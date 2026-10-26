<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.originName }}</p>
    </td>
    <td><a :href="data.fullPath" class="d_inblock wid80 scommp btn_m_size comm__gray_bd_btn fwb" download>다운로드</a></td>
    <td><a href="javascript:;" class="d_inblock wid80 scommp btn_m_size comm__red_btn fwb" @click="deleteFile">삭제</a></td>
  </tr>
</template>

<script>
import School from '@/apis/School';
import { mapState } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapState('user', ['userOrganTargetId']),
  },
  methods: {
    deleteFile() {
      this.$confirm('삭제하시겠습니까?', '알림', 'question')
        .then(() => {
          this.$store.commit('loading', true);
          const form = {
            schoolId: this.userOrganTargetId,
            contractFileId: this.data.contractFileId,
          };
          School.contractFileDelete(form).then(res => {
            this.$store.commit('loading', false);
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
