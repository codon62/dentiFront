<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.healthCareName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.schoolName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.schoolEmail ? data.schoolEmail : '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.schoolTel ? data.schoolTel : '-' }}</p>
    </td>
    <td>
      <a
        v-if="data.isFile"
        href="javascript:;"
        class="d_inblock wid80 scommp btn_m_size comm__gray_bd_btn fwb"
        @click="popupOpen({ contents: 'hospitalContractFileList', params: { schoolId: data.schoolId } })"
      >
        다운로드
      </a>
      <a v-else v-tooltip="isNotFileTooltip" class="d_inblock wid80 scommp btn_m_size comm__gray_bd_btn fwb" style="opacity: 0.2">다운로드</a>
    </td>
    <td>
      <a v-if="data.contractStatus === 'Y'" class="d_inblock wid80 scommp btn_s_size comm__green_bd_btn">승인완료</a>
      <p v-else-if="deldate" class="scommp">-</p>
      <a v-else-if="data.contractStatus === 'N'" class="d_inblock wid80 scommp btn_s_size comm__gray_btn">대기중</a>
      <a v-else href="javascript:;" class="d_inblock wid80 scommp btn_s_size comm__blue_btn" @click="contractRegist">신청</a>
    </td>
  </tr>
</template>

<script>
import Hospital from '@/apis/Hospital';
import { mapActions, mapState } from 'vuex';

export default {
  props: ['num', 'data'],
  data() {
    return {
      isNotFileTooltip: '계약 서류 준비중입니다.',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId', 'deldate']),
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    contractRegist() {
      this.$confirm(`${this.data.schoolName}에 학생구강검진사업을 신청하시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            schoolId: this.data.schoolId,
            hospitalId: this.userOrganTargetId,
          };
          Hospital.contractRegist(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('신청되었습니다.', '알림', 'success').then(() => {
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
