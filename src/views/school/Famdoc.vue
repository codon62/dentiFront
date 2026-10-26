<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">{{ divJoin('S') ? divName('S', true) : divName('F', true) }}</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list title="학생" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
        <template v-if="(isDev && districtCodeFirst === 'C') || (!isDev && isBulkDownloadStart)">
          <a href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp inner--right" @click="pdfListSlide" @blur="pdfListSlideUp()">일괄(PDF) 다운로드</a>
          <div class="btn_box btn_box_pdf tac fwb wid130">
            <a href="javascript:;" @mousedown="pdfDownload('F', 'B')">문진표</a>
            <a href="javascript:;" @mousedown="pdfDownload('F', 'C')">통보서</a>
          </div>
        </template>
        <template v-if="['A', 'B', 'C', 'I', 'J'].includes(districtCodeFirst)">
          <a v-if="['A', 'B', 'I', 'J'].includes(districtCodeFirst)" href="javascript:;" class="comm__blue_bd_btn btn_m_size2 d_block commp ml10" @click="schoolInfoUpload">학생 정보 업로드</a>
          <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block commp ml10" @click="studentEnrollment">신규 학생 등록</a>
        </template>
        <a v-else href="javascript:;" class="comm__navy_btn btn_m_size2 d_block commp ml10" @click="studentTransfer"> {{ districtCodeFirstName }} 내 학생 전입 </a>
        <a href="javascript:;" class="comm__red_btn btn_m_size2 d_block commp ml10" @click="popupOpen({ contents: 'schoolHospitalList', params: { businessDivision: 'F' } })">병원 목록</a>
        <div class="ml10" style="position: relative">
          <a v-if="districtCodeFirst === 'I'" href="javascript:;" class="comm__green_btn btn_m_size2 d_block commp" @click="excel({ niceCheck: 'N' })">엑셀 다운로드</a>
          <template v-else>
            <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block commp" @click="excelListSlide" @blur="excelListSlideUp">엑셀 다운로드</a>
            <div class="btn_box btn_box_excel tac fwb">
              <a href="javascript:;" @mousedown="excel({ niceCheck: 'N' })">전체</a>
              <a href="javascript:;" @mousedown="excel({ niceCheck: 'Y' })">나이스양식</a>
            </div>
          </template>
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
      cmp: 'schoolFamdoc',
      pager: {},
      table: {
        maxNum: 1,
        col: ['*'],
        th: [],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['userOrganTargetId', 'adminOrganType']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName', 'questionnaireTitle', 'examTitle', 'notificationTitle', 'isBulkDownloadStart', 'endBusiness']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValueList']),
    districtCodeFirstName() {
      return this.districtCodeFirstToName[this.districtCodeFirst].replaceAll('교육청', '');
    },
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
    this.table.th = [
      '번호',
      '학년/반/번호',
      '성명<br/>(생년월일)',
      '성별',
      this.examTitle + ' 병원',
      'APP 가입',
      'APP 가입<br/>초기화',
      this.questionnaireTitle,
      this.notificationTitle.replaceAll(' ', '<br/>'),
      this.examTitle + '일',
      (this.districtCodeFirst === 'I' ? '진료' : '수검') + ' 여부',
      `미${this.districtCodeFirst === 'I' ? '진료' : '수검'} 사유`,
      '정보 수정',
      '전출처리',
      '삭제',
    ];
    if (!(this.districtCodeFirst === 'J' && this.adminOrganType !== 'AD')) {
      this.table.th.splice(7, 0, '개인정보<br/>활용동의');
    }
    if (['A', 'C'].indexOf(this.districtCodeFirst) !== -1) {
      this.table.th.splice(7, 0, '교육 이수');
    }
    if (this.districtCodeFirst === 'C') {
      this.table.th.splice(-6, 0, '만족도조사', '사후설문조사');
      this.table.th.splice(-3, 0, '이력 보기');
    }
    if (this.districtCodeFirst === 'J') {
      this.table.th.splice(this.table.th.length, 0, '확인');
    }
    if (this.divJoin('S')) {
      this.table.th.splice(1, 0, '검진 유형');
    }
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
        page: parseInt(this.$route.query.page || 1),
        size: 10,
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      if (!this.divJoin('S')) {
        form.businessDivision = this.valueToCode('C0003', 'F');
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
        html: `${this.districtCodeFirstName} 내 학교에서 전입 온 학생입니까?`,
        allowEnterKey: false,
        confirmButtonText: '예',
        showCancelButton: true,
        cancelButtonText: '아니오',
        confirmButtonColor: '#0868f1',
        cancelButtonColor: '#d94f4f',
        padding: '40px',
      }).then(r => {
        if (r.value) {
          this.popupOpen({ contents: 'schoolStudentTransfer', params: { businessDivision: 'F' } });
        } else if (r.dismiss === 'cancel') {
          this.popupOpen({ contents: 'managementStudentStudentEnrollment', params: { businessDivision: 'F' } });
        }
      });
    },
    schoolInfoUpload() {
      if (this.endBusiness('treatment')) {
        this.$alert('학생 등록이 마감되었습니다.', '알림', 'warning');
        return false;
      }
      if (this.districtCodeFirst === 'A') {
        this.popupOpen({ contents: 'schoolInfoUpload', params: { businessDivision: 'F' } });
        return false;
      }
      this.$fire({
        html: `${
          this.districtCodeFirst === 'I' || this.districtCodeFirst === 'J'
            ? `학생 및 보호자에게 사업 신청을 위한<br/> <b>명단 업로드 동의</b>를 받으셨습니까?<br/>※ 학생 및 보호자가 APP 내 회원가입 시 동의하는 개인정보 동의와는 상이합니다.`
            : `본인 및 보호자에게 본 자료를 구강${this.examTitle} 기관에<br/>제공한다는 <b>개인정보 동의</b>를 받았습니까?`
        }`,
        allowEnterKey: false,
        confirmButtonText: '예',
        showCancelButton: true,
        cancelButtonText: '아니오',
        confirmButtonColor: '#0868f1',
        cancelButtonColor: '#d94f4f',
        padding: '40px',
      }).then(r => {
        if (r.value) {
          this.popupOpen({ contents: 'schoolInfoUpload', params: { businessDivision: 'F' } });
        } else if (r.dismiss === 'cancel') {
          this.$fire({
            html: `${
              this.districtCodeFirst === 'I' || this.districtCodeFirst === 'J'
                ? `학생 및 보호자에게 <br/> <b>명단 업로드 동의</b>에 대해<br/><b>동의</b>를 받아주세요.`
                : `본인 및 보호자에게 <b>개인정보 제공</b>에 대해<br/><b>동의</b>를 받아주세요.`
            }`,
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
      this.popupOpen({ contents: 'schoolStudentTransfer', params: { businessDivision: 'F' } });
    },
  },
};
</script>
