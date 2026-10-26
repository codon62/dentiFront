<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">학생 구강검진</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list title="학생" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
        <template v-if="(isDev && districtCodeFirst === 'C') || (!isDev && isBulkDownloadStart)">
          <a href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp inner--right" @click="pdfListSlide" @blur="pdfListSlideUp()">일괄(PDF) 다운로드</a>
          <div class="btn_box btn_box_pdf tac fwb wid130">
            <a href="javascript:;" @mousedown="pdfDownload('E', 'B')">문진표</a>
            <a href="javascript:;" @mousedown="pdfDownload('E', 'C')">통보서</a>
          </div>
        </template>
        <template v-if="districtCodeFirst === 'A'">
          <a href="javascript:;" class="comm__blue_bd_btn btn_m_size2 d_block commp ml10" @click="schoolInfoUpload">학생 정보 업로드</a>
          <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block commp ml10" @click="studentEnrollment">신규 학생 등록</a>
        </template>
        <a v-else href="javascript:;" class="comm__navy_btn btn_m_size2 d_block commp ml10" @click="studentTransfer"> {{ districtCodeFirstToName[districtCodeFirst] }} 내 학생 전입 </a>
        <a href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp ml10" @click="popupOpen({ contents: 'schoolHospitalList', params: { businessDivision: 'E' } })">병원 목록</a>
        <div class="ml10" style="position: relative">
          <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp" @click="excelListSlide" @blur="excelListSlideUp">엑셀 다운로드</a>
          <div class="btn_box btn_box_excel tac fwb">
            <a href="javascript:;" @mousedown="excel({ niceCheck: 'N' })">전체</a>
            <a href="javascript:;" @mousedown="excel({ niceCheck: 'Y' })">나이스양식</a>
          </div>
        </div>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import School from '@/apis/School';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';
import pdfDownload from '@/components/common/mixin/tableList/pdfDownload';

export default {
  mixins: [excelDownload, pdfDownload],
  data() {
    return {
      cmp: 'schoolExamine',
      pager: {},
      table: {
        maxNum: 1,
        col: ['*'],
        th: [
          '번호',
          '학년/반/번호',
          '성명<br/>(생년월일)',
          '성별',
          '검진 병원',
          'APP 가입',
          'APP 가입<br/>초기화',
          '개인정보<br/>활용동의',
          '문진표',
          '통보서',
          '검진일',
          '수검 여부',
          '미수검 사유',
          '정보 수정',
          '전출처리',
          '삭제',
        ],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['userOrganTargetId']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['isBulkDownloadStart', 'endBusiness']),
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
    // if (this.isDev) {
    //     this.table.th.push('관리자 기능<br/>(개발서버)');
    // }
    this.getList();
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        schoolId: this.userOrganTargetId,
        businessDivision: this.valueToCode('C0003', 'E'),
        page: parseInt(this.$route.query.page || 1),
        size: 10,
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      School.studentList(form, this.abortController.signal).then(res => {
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
    studentEnrollment() {
      if (this.endBusiness('treatment')) {
        this.$alert('학생 등록이 마감되었습니다.', '알림', 'warning');
        return false;
      }
      this.$fire({
        html: `${this.districtCodeFirstToName[this.districtCodeFirst]} 내 학교에서 전입 온 학생입니까?`,
        allowEnterKey: false,
        confirmButtonText: '예',
        showCancelButton: true,
        cancelButtonText: '아니오',
        confirmButtonColor: '#0868f1',
        cancelButtonColor: '#d94f4f',
        padding: '40px',
      }).then(r => {
        if (r.value) {
          this.popupOpen({ contents: 'schoolStudentTransfer', params: { businessDivision: 'E' } });
        } else if (r.dismiss === 'cancel') {
          this.popupOpen({ contents: 'managementStudentStudentEnrollment', params: { businessDivision: 'E' } });
        }
      });
    },
    schoolInfoUpload() {
      if (this.endBusiness('treatment')) {
        this.$alert('학생 등록이 마감되었습니다.', '알림', 'warning');
        return false;
      }
      this.$fire({
        html: `본인 및 보호자에게 본 자료를 구강검진 기관에<br/>제공한다는 <b>개인정보 동의</b>를 받았습니까?`,
        allowEnterKey: false,
        confirmButtonText: '예',
        showCancelButton: true,
        cancelButtonText: '아니오',
        confirmButtonColor: '#0868f1',
        cancelButtonColor: '#d94f4f',
        padding: '40px',
      }).then(r => {
        if (r.value) {
          this.popupOpen({ contents: 'schoolInfoUpload', params: { businessDivision: 'E' } });
        } else if (r.dismiss === 'cancel') {
          this.$fire({
            html: `본인 및 보호자에게 <b>개인정보 제공</b>에 대해<br/><b>동의</b>를 받아주세요.`,
            confirmButtonText: '확인',
            padding: '40px',
          });
        }
      });
    },
    studentTransfer() {
      if (this.endBusiness('treatment')) {
        this.$alert('학생 전입이 마감되었습니다.', '알림', 'warning');
        return false;
      }
      this.popupOpen({ contents: 'schoolStudentTransfer', params: { businessDivision: 'E' } });
    },
  },
};
</script>
