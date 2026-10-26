<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">{{ divName('FY', true) }}</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list title="학생" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
        <div v-if="userOrganTargetType === 'HC' && ((isDev && districtCodeFirst === 'C') || (!isDev && isBulkDownloadStart))" class="p_relative">
          <a href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp ml10" @click="pdfListSlide" @blur="pdfListSlideUp()">일괄(PDF) 다운로드</a>
          <div class="btn_box btn_box_pdf tac fwb wid130 ml10">
            <a href="javascript:;" @mousedown="pdfDownload('FY', 'A')">동의서(서면)</a>
            <a href="javascript:;" @mousedown="pdfDownload('FY', 'B')">문진표</a>
            <a href="javascript:;" @mousedown="pdfDownload('FY', 'C')">통보서</a>
          </div>
        </div>
        <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp ml10" @click="excel()">엑셀 다운로드</a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import Business from '@/apis/Business';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapGetters, mapState } from 'vuex';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';
import pdfDownload from '@/components/common/mixin/tableList/pdfDownload';

export default {
  mixins: [excelDownload, pdfDownload],
  data() {
    return {
      cmp: 'businessFamdocYeonjegu',
      pager: {},
      table: {
        maxNum: 1,
        col: ['*'],
        th: ['번호', '이름<br/>(성별)', '생년월일', '학교<br/>(학년/반/번호)', '병원명', '개인정보<br/>활용동의', '문진표', '통보서', '처리 상황', '병원 취소', '이력 보기', '확인'],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode', 'userOrganTargetType', 'adminOrganType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName', 'isBulkDownloadStart']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValueList']),
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
    if (['A', 'C'].includes(this.districtCodeFirst)) {
      this.table.th.splice(5, 0, '교육 이수');
    }
    if (this.districtCodeFirst === 'C') {
      this.table.th.splice(3, 0, '학교 구분');
      this.table.th.splice(2, 0, '등록기관');
      this.table.th.splice(-4, 0, '만족도조사', '사후설문조사');
    }
    if (this.districtCodeFirst === 'A') {
      this.table.th.splice(3, 1);
      this.table.th.splice(9, 0, '통보서<br/>검진일');
    }
    if (this.userOrganTargetType === 'CT') {
      this.table.th.splice(1, 0, this.districtCodeFirst === 'C' ? '시군명' : ['I', 'J'].includes(this.districtCodeFirst) ? '교육지원청' : '보건소');
    }
    if (this.adminOrganType === 'AD') {
      this.table.th.push('관리자 기능');
    }
    this.getList();
  },
  methods: {
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        districtCode: this.districtCode,
        businessDivision: this.valueToCode('C0003', 'FY'),
        page: 1,
        size: 10,
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Business.studentList(form, this.abortController.signal).then(res => {
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
