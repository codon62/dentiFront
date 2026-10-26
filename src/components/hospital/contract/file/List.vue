<template>
  <div class="popup_content">
    <v-popuptitle message="학생구강검진 계약서류" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver">
      <div class="board__box mt10">
        <div class="titbox row">
          <div class="inner--left">
            <p class="commp2 fwb">{{ userOrganTargetName }} 계약서류 목록</p>
          </div>
        </div>
      </div>
      <div class="board__box mt10">
        <v-table :data="table" cmp="hospitalContractFileList"></v-table>
        <v-pager :data="pager" :popup="true" @vclick="contractFileList"></v-pager>
      </div>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import table from '@/components/common/Table.vue';
import Pager from '@/components/common/Pager.vue';
import { mapState } from 'vuex';

export default {
  props: ['dataObject'],
  data() {
    return {
      pager: {},
      table: {
        maxNum: 1,
        col: ['8%', '*', '15%'],
        th: ['번호', '파일명', '다운로드'],
        list: [],
      },
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetName']),
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-table': table,
    'v-pager': Pager,
  },
  created() {
    this.contractFileList(1);
  },
  methods: {
    contractFileList(page) {
      const form = {
        schoolId: this.dataObject.schoolId,
        size: 10,
        page: page,
      };
      Hospital.contractFileList(form).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = res.data.contractFileList;
          this.pager = res.data.paging;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>
