<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.healthCareName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalName }}</p>
    </td>
    <td><v-button message="보기" @vclick="popupOpen({ contents: 'schoolHospitalLocation', params: data })"></v-button></td>
    <td>
      <p class="scommp">{{ data.hospitalTel }}</p>
    </td>
    <td>
      <a v-if="data.contractStatus === 'Y'" class="d_inblock wid60 scommp btn_s_size comm__green_bd_btn">승인됨</a>
      <a v-else href="javascript:;" class="d_inblock wid60 scommp btn_s_size comm__blue_btn" @click="contractUpdate">대기중</a>
    </td>
  </tr>
</template>

<script>
import School from '@/apis/School';
import Button from '@/components/common/Button.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-button': Button,
  },
  props: ['num', 'data'],
  computed: {
    ...mapState('user', ['userOrganTargetId']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    contractUpdate() {
      this.$confirm(`${this.data.hospitalName}의 학생구강검진사업을 승인하시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            schoolId: this.userOrganTargetId,
            hospitalId: this.data.hospitalId,
            contractStatus: this.valueToCode('C0009', 'Y'),
          };
          School.contractUpdate(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('승인되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
              });
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
