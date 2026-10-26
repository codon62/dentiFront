<template>
  <div class="popup_content">
    <v-popuptitle message="학생 전체 이력" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner pt30">
      <v-table :data="table" cmp="studentLogPopup"></v-table>
    </div>
    <v-pager :data="pager" :popup="true" @vclick="studentLogList"></v-pager>
  </div>
</template>

<script>
import Business from '@/apis/Business';
import popupTitle from '@/components/popup/PopupTitle.vue';
import table from '@/components/common/Table.vue';
import Pager from '@/components/common/Pager.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-table': table,
    'v-pager': Pager,
  },
  props: ['dataObject'],
  data() {
    return {
      table: {
        maxNum: 1,
        col: ['100px', '*', '170px'],
        th: ['연번', '상세 내용', '시간'],
        list: [],
      },
      pager: {},
    };
  },
  computed: {
    ...mapGetters('definedCode', ['valueToCode']),
  },
  created() {
    this.studentLogList(1);
  },
  methods: {
    studentLogList(page) {
      const form = {
        businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
        studentId: this.dataObject.studentId,
        page: page,
        size: 10,
      };
      Business.studentLogList(form).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          let tempList = [];
          for (const i in res.data.logList) {
            res.data.logList[i].studentId = this.dataObject.studentId;
            res.data.logList[i].num = this.table.maxNum - i;
            tempList.push(res.data.logList[i]);
            if (res.data.logList[i].systemLogContents.includes('비용청구서') && res.data.logList[i].systemLogContents.includes('반려') && res.data.logList[i].systemLogDetailContents) {
              let tempData = {
                title: '반려',
                systemLogDetailContents: res.data.logList[i].systemLogDetailContents,
              };
              tempList.push(tempData);
            }
            if (res.data.logList[i].systemLogContents.includes('의뢰') && res.data.logList[i].systemLogContents.includes('취소') && res.data.logList[i].systemLogDetailContents) {
              let tempData = {
                title: '의뢰취소',
                systemLogDetailContents: res.data.logList[i].systemLogDetailContents,
              };
              tempList.push(tempData);
            }
          }
          this.table.list = tempList;
          this.pager = res.data.paging;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.popup__con_inner::-webkit-scrollbar {
  display: block;
  width: 10px;
}
.popup__con_inner {
  -ms-overflow-style: auto; /* IE and Edge */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #969696 transparent;
}
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  @include border-radius(10px);

  background: #d5d3d3;
}

/* Handle */
::-webkit-scrollbar-thumb {
  @include border-radius(10px);

  background: #969696;
}
</style>
