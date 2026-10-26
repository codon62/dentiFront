<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">아동 치과주치의</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list title="학생" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
        <div v-if="userOrganTargetType === 'HC' && ((isDev && districtCodeFirst === 'C') || (!isDev && isBulkDownloadStart))" class="p_relative">
          <a href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp ml10" @click="pdfListSlide" @blur="pdfListSlideUp()">일괄(PDF) 다운로드</a>
          <div class="btn_box btn_box_pdf tac fwb wid130 ml10">
            <a href="javascript:;" @mousedown="pdfDownload('C', 'A')">동의서(서면)</a>
            <a href="javascript:;" @mousedown="pdfDownload('C', 'B')">문진표</a>
            <a href="javascript:;" @mousedown="pdfDownload('C', 'C')">통보서</a>
            <a href="javascript:;" @mousedown="pdfDownload('C', 'T')">내역서</a>
          </div>
        </div>
        <a v-if="districtCodeFirst === 'A'" href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp ml10" @click="popupOpen({ contents: 'treatmentChargeList' })">
          <img src="@/assets/images/sub/ic_searchlist_r.png" />
          진료 수가
        </a>
        <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp ml10" @click="excel()">엑셀 다운로드</a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import Business from '@/apis/Business';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';
import pdfDownload from '@/components/common/mixin/tableList/pdfDownload';

export default {
  mixins: [excelDownload, pdfDownload],
  data() {
    return {
      cmp: 'businessChild',
      pager: {},
      table: {
        maxNum: 1,
        col: ['*'],
        th: [
          '번호',
          '이름<br/>(생년월일)',
          '시설(센터)명',
          '병원명',
          '교육 이수',
          '개인정보<br/>활용동의',
          '문진표',
          '통보서',
          '추가진료',
          '진료 의뢰 병원',
          '진료 의뢰서',
          '진료 계획서',
          '내역서',
          '처리 상황',
          '심화치료',
          '추가 지정',
          '병원 취소',
          '치료 이력',
          '이력 보기',
          '확인',
          '개인정보<br/>활용동의<br/>파일 초기화',
        ],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode', 'userOrganTargetType', 'adminOrganType', 'healthCareType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['isBulkDownloadStart']),
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
    if (this.districtCodeFirst === 'D') {
      this.table.th = [
        '번호',
        '이름<br/>(생년월일)',
        '시설(센터)명',
        '병원명',
        '개인정보<br/>활용동의',
        '문진표',
        '통보서',
        '심화치료',
        '내역서',
        '처리 상황',
        '병원 취소',
        '치료 이력',
        '이력 보기',
        '확인',
        '개인정보<br/>활용동의<br/>파일 초기화',
      ];
    } else if (this.districtCodeFirst === 'A') {
      this.table.th = [
        '번호',
        '이름<br/>(생년월일)',
        '시설(센터)명',
        '병원명',
        '교육 이수',
        '개인정보<br/>활용동의',
        '문진표',
        '통보서',
        '추가진료',
        '진료 의뢰 병원',
        '진료 의뢰서',
        '진료 계획서',
        '내역서',
        '처리 상황',
        '심화치료',
        '추가 지정',
        '병원 취소',
        '치료 이력',
        '이력 보기',
        '메모',
        '확인',
      ];
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
    ...mapActions('popup', ['popupOpen']),
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        districtCode: this.districtCode,
        businessDivision: this.valueToCode('C0003', 'C'),
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
