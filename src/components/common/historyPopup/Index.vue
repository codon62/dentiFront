<template>
  <div class="popup_content">
    <v-popuptitle message="치료 이력" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner pt30">
      <v-table :data="table" cmp="historyPopup"></v-table>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import Business from '@/apis/Business';
import popupTitle from '@/components/popup/PopupTitle.vue';
import table from '@/components/common/Table.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['dataObject'],
  data() {
    return {
      table: {
        col: ['*'],
        th: ['회차', '시설(센터)', '성명', '검진병원', ['통보서', '보기', '검진일'], ['진료 계획서', '보기', '승인일'], ['내역서', '보기', '검진일'], '처리 상황'],
        list: [],
      },
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapGetters('definedCode', ['codeToValueList']),
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-table': table,
  },
  created() {
    this.notificationHistory();
  },
  methods: {
    notificationHistory() {
      const form = {
        studentId: this.dataObject.studentId,
      };
      switch (this.userOrganTargetType) {
        case 'HP':
          Hospital.notificationHistory(form).then(res => this.notificationHistoryThen(res));
          break;
        case 'HC':
        case 'CT':
          Business.notificationHistory(form).then(res => this.notificationHistoryThen(res));
          break;
      }
    },
    notificationHistoryThen(res) {
      if (res && res.data.rt === 200) {
        for (const i in res.data.historyList) {
          res.data.historyList[i].studentId = this.dataObject.studentId;
        }
        this.table.list = this.codeToValueList(res.data.historyList);
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    },
  },
};
</script>
