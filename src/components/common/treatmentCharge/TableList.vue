<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.districtGunguName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.treatmentChargeName }}</p>
    </td>
    <td>
      <p class="scommp">{{ /^[0-9]*$/.test(data.treatmentChargePrice) ? numberWithCommas(data.treatmentChargePrice) + '원' : data.treatmentChargePrice }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.treatmentChargeNote || '-' }}</p>
    </td>
    <td v-if="userOrganTargetType === 'HC'">
      <a href="javascript:;" class="d_inblock wid60 scommp btn_s_size comm__blue_btn" @click="popupOpen({ contents: 'treatmentChargeRegist', params: data })">수정</a>
      <a href="javascript:;" class="d_inblock wid60 scommp btn_s_size comm__red_btn" @click="deleteCharge">삭제</a>
    </td>
  </tr>
</template>

<script>
import Business from '@/apis/Business';
import { mapActions, mapState } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapState('user', ['userOrganTargetId', 'userOrganTargetType']),
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    deleteCharge() {
      this.$confirm('삭제하시겠습니까?', '알림', 'question')
        .then(() => {
          const form = {
            treatmentChargeId: this.data.treatmentChargeId,
            healthCareId: this.userOrganTargetId,
          };
          Business.treatmentChargeDelete(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('삭제되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update2');
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
