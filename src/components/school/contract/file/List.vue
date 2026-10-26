<template>
  <div class="popup_content">
    <v-popuptitle message="계약서류 업로드" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver">
      <div class="board__box mt10">
        <div class="titbox row">
          <div class="inner--left">
            <p class="commp2 fwb">계약서류 목록</p>
          </div>
          <div class="inner--right">
            <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid130 commp inner--right" @click="popupOpen({ contents: 'contractFileRegist' })">계약 서류 업로드</a>
          </div>
        </div>
      </div>
      <div class="board__box mt10">
        <v-table :data="table" cmp="contractFileList"></v-table>
        <v-pager :data="pager" :popup="true" @vclick="contractFileList"></v-pager>
      </div>
    </div>
  </div>
</template>

<script>
import School from '@/apis/School';
import popupTitle from '@/components/popup/PopupTitle.vue';
import table from '@/components/common/Table.vue';
import Pager from '@/components/common/Pager.vue';
import { mapActions, mapState } from 'vuex';

export default {
  props: ['dataObject'],
  data() {
    return {
      pager: {},
      table: {
        maxNum: 1,
        col: ['8%', '*', '15%', '15%'],
        th: ['번호', '파일명', '다운로드', '관리'],
        list: [],
      },
    };
  },
  computed: {
    ...mapState(['update2']),
    ...mapState('user', ['userOrganTargetId']),
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
    ...mapActions('popup', ['popupOpen']),
    contractFileList(page) {
      const form = {
        schoolId: this.userOrganTargetId,
        size: 10,
        page: page,
      };
      School.contractFileList(form).then(res => {
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
  watch: {
    update2() {
      this.contractFileList(1);
    },
  },
};
</script>
