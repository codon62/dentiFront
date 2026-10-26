<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td v-if="userOrganTargetType === 'CT'">
      <p class="scommp">{{ districtCodeFirst === 'C' ? data.districtSiName : data.districtGunguName }}</p>
    </td>
    <td v-if="districtCodeFirst === 'C'">
      <p class="scommp">{{ schoolType.value[data.schoolType] }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.schoolName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.userOrganLoginId }}</p>
    </td>
    <td v-if="districtCodeFirst === 'A'">
      <p class="scommp" v-html="businessJoin"></p>
    </td>
    <td>
      <p class="scommp">{{ data.userOrganManagerName ? data.userOrganManagerName : '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.userOrganManagerTel ? data.userOrganManagerTel : '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.userOrganManagerAlarm ? userOrganManagerAlarm.value[data.userOrganManagerAlarm] : '-' }}</p>
    </td>
    <td><v-button message="수정" @vclick="popupOpen({ contents: 'managementSchoolInfoModify', params: { schoolId: data.schoolId } })"></v-button></td>
    <td><v-button message="초기화" @vclick="passwordReset"></v-button></td>
  </tr>
</template>

<script>
import Management from '@/apis/Management';
import Button from '@/components/common/Button.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-button': Button,
  },
  props: ['num', 'data'],
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapState('status', ['userOrganManagerAlarm', 'schoolType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName']),
    ...mapGetters('definedCode', ['valueToCode']),
    businessJoin() {
      let obj = {
        F: this.data.schoolBusinessDivisionF,
        E: this.data.schoolBusinessDivisionE,
      };

      let list = [];
      for (let key in obj) {
        if (obj[key] === 'Y') {
          list.push(this.divName(key));
        }
      }

      return list.length ? list.join('<br/>') : '-';
    },
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    passwordReset() {
      this.$confirm('비밀번호를 초기화하시겠습니까?', '알림', 'question')
        .then(() => {
          const form = {
            userOrganTargetId: this.data.schoolId,
            userOrganTargetType: this.valueToCode('C0006', 'SC'),
          };
          Management.passwordReset(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('초기화되었습니다.', '알림', 'success');
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
