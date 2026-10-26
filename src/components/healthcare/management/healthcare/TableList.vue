<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.healthCareName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.userOrganLoginId }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.healthCareTel || '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.userOrganManagerName || '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.userOrganManagerTel || '-' }}</p>
    </td>
    <td><v-button message="수정" @vclick="popupOpen({ contents: 'managementHealthcareInfoModify', params: { healthCareId: data.healthCareId } })"></v-button></td>
    <td><v-button message="초기화" @vclick="passwordReset"></v-button></td>
  </tr>
</template>

<script>
import Management from '@/apis/Management';
import Button from '@/components/common/Button.vue';
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    'v-button': Button,
  },
  props: ['num', 'data'],
  computed: {
    ...mapGetters('definedCode', ['valueToCode']),
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    passwordReset() {
      this.$confirm('비밀번호를 초기화하시겠습니까?', '알림', 'question')
        .then(() => {
          const form = {
            userOrganTargetId: this.data.healthCareId,
            userOrganTargetType: this.valueToCode('C0006', 'HC'),
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
