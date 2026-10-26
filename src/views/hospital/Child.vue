<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">아동 치과주치의</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list title="학생" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
        <template v-if="(isDev && districtCodeFirst === 'C') || (!isDev && isBulkDownloadStart)">
          <a href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp inner--right" @click="pdfListSlide" @blur="pdfListSlideUp()">일괄(PDF) 다운로드</a>
          <div class="btn_box btn_box_pdf tac fwb wid130">
            <a href="javascript:;" @mousedown="pdfDownload('C', 'A')">동의서(서면)</a>
            <a href="javascript:;" @mousedown="pdfDownload('C', 'B')">문진표</a>
            <a href="javascript:;" @mousedown="pdfDownload('C', 'C')">통보서</a>
            <a href="javascript:;" @mousedown="pdfDownload('C', 'T')">내역서</a>
          </div>
        </template>
        <a v-if="districtCodeFirst === 'A'" href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp ml10" @click="popupOpen({ contents: 'treatmentChargeList' })">
          <img src="@/assets/images/sub/ic_searchlist_r.png" />
          진료 수가
        </a>
        <a v-if="districtCodeFirst !== 'A'" href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid130 commp ml10" @click="studentEnrollment">학생 등록</a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import Hospital from '@/apis/Hospital';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import pdfDownload from '@/components/common/mixin/tableList/pdfDownload';

export default {
  mixins: [pdfDownload],
  data() {
    return {
      cmp: 'hospitalChild',
      pager: {},
      table: {
        maxNum: 1,
        col: ['*'],
        th: ['번호', '시설(센터)', '성명', '교육 이수', '개인정보<br/>활용동의', '문진표', '통보서', '진료의뢰서', '진료계획서', '내역서', '처리 상황', '치료 이력', '정보 수정', '취소'],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['userOrganTargetId', 'districtCode', 'hospitalType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['endBusiness', 'isBulkDownloadStart']),
    ...mapGetters('definedCode', ['codeToValueList']),
  },
  components: {
    'v-detailed-search': DetailedSearch,
    'v-list': List,
  },
  watch: {
    '$route.query'() {
      this.getList();
    },
    update() {
      this.getList();
    },
  },
  created() {
    if (this.districtCodeFirst === 'A' && this.hospitalType === 'H') {
      this.table.th.splice(7, 0, '진료 의뢰 병원');
      this.table.th.splice(-2, 0, '메모');
    }
    if (this.districtCodeFirst === 'D') {
      this.table.th = ['번호', '시설(센터)', '성명', '개인정보<br/>활용동의', '문진표', '통보서', '심화치료', '내역서', '처리 상황', '정보 수정', '취소'];
    }
    // if (this.isDev) {
    //     this.table.th.push('관리자 기능<br/>(개발서버)');
    // }
    this.getList();
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    studentEnrollment() {
      if (this.endBusiness(this.districtCodeFirst === 'D' ? 'billPromotion' : 'treatment')) {
        this.$alert('학생 등록이 마감되었습니다.', '알림', 'warning');
        return false;
      }
      this.popupOpen({ contents: 'hospitalStudentEnrollment', params: { businessDivision: 'C' } });
    },
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        hospitalId: this.userOrganTargetId,
        page: parseInt(this.$route.query.page || 1),
        size: 10,
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Hospital.studentListC(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = this.codeToValueList(res.data.studentList);
          this.pager = res.data.paging;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
        this.$store.commit('tableLoading', false);
      });
    },
    search(searchData) {
      let query = {};
      for (const i in searchData) {
        if (typeof searchData[i] === 'object') {
          for (const j in searchData[i]) {
            if (searchData[i][j]) {
              query[j] = searchData[i][j];
            } else {
              delete query[j];
            }
          }
        } else {
          if (searchData[i]) {
            query[i] = searchData[i];
          } else {
            delete query[i];
          }
        }
      }
      this.abortController?.abort();
      if (JSON.stringify(query) !== JSON.stringify(this.$route.query)) {
        this.$router.push({ query: query });
      } else {
        this.getList();
      }
    },
  },
};
</script>
