<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">청구/지급</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>

      <div class="sub__section mt30">
        <div class="titbox row">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_cost.png" /></span>
          <p class="commp2 d_inblock fwb ml5">청구 금액</p>
        </div>
        <div class="section_con">
          <hrznt-table :data="billClaimTotal"></hrznt-table>
        </div>
      </div>

      <v-list :full-title="title" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
        <template v-if="userOrganTargetType === 'HC' && healthCareType !== 'E' && ((isDev && districtCodeFirst === 'C') || (!isDev && isBulkDownloadStart))">
          <template v-if="districtCodeFirst === 'C'">
            <a href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp inner--right mr10" @click="pdfListSlide" @blur="pdfListSlideUp()">일괄(PDF) 다운로드</a>
            <div class="btn_box btn_box_pdf tac fwb wid130">
              <a href="javascript:;" @mousedown="pdfDownload(null, 'D', '_전체')">전체</a>
              <a href="javascript:;" @mousedown="pdfDownload(null, 'D', '_4학년')">4학년</a>
              <a href="javascript:;" @mousedown="pdfDownload(null, 'D', '_학교밖')">학교밖</a>
            </div>
          </template>
          <a v-else href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp inner--right mr10" @mousedown="pdfDownload(null, 'D', '')">일괄(PDF) 다운로드</a>
        </template>
        <div v-if="districtCodeFirst === 'J'" class="mr10" style="position: relative">
          <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp" @click="excelListSlide" @blur="excelListSlideUp()">결과통계표 엑셀</a>
          <div class="btn_box btn_box_excel tac fwb">
            <a href="javascript:;" @mousedown="excel(null, 'businessFamdoc')">학생 치과주치의</a>
            <a href="javascript:;" @mousedown="excel(null, 'businessExamine')">학생 구강검진</a>
          </div>
        </div>
        <a v-if="(divJoin('C') || divJoin('F')) && cityType !== 'E' && healthCareType !== 'E'" href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid130 commp" @click="billMonthJudge"
          >선택 지급</a
        >
        <div v-if="!(districtCodeFirst === 'A' && (cityType === 'E' || healthCareType === 'E'))" class="ml10" style="position: relative">
          <template v-if="!$route.query.studentToSchoolGrade1">
            <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp inner--right" @click="excelListSlide" @blur="excelListSlideUp()">엑셀 다운로드</a>
            <div class="btn_box btn_box_excel tac fwb">
              <a href="javascript:;" @mousedown="excel()">전체</a>
              <a v-if="['A', 'C', 'D', 'E', 'H'].includes(districtCodeFirst)" href="javascript:;" @mousedown="excel({ studentToSchoolGrade1: 4 })">4학년</a>
              <a v-if="['B', 'D'].includes(districtCodeFirst)" href="javascript:;" @mousedown="excel({ studentToSchoolGrade1: 5 })">5학년</a>
              <a v-if="districtCodeFirst === 'D'" href="javascript:;" @mousedown="excel({ studentToSchoolGrade1: 6 })">6학년</a>
              <a v-if="districtCodeFirst === 'C'" href="javascript:;" @mousedown="excel({ studentToSchoolNull: 'Y' })">학교밖</a>
            </div>
          </template>
          <a v-else href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp inner--right" @click="excel">엑셀 다운로드</a>
        </div>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import Bill from '@/apis/Bill';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import HrzntTable from '@/components/common/HrzntTable.vue';
import List from '@/components/common/List.vue';
import { mapGetters, mapState } from 'vuex';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';
import pdfDownload from '@/components/common/mixin/tableList/pdfDownload';

export default {
  mixins: [excelDownload, pdfDownload],
  data() {
    return {
      cmp: 'billClaim',
      pager: {},
      billClaimTotal: [],
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
    ...mapState('user', ['userOrganTargetType', 'districtCode', 'cityType', 'healthCareType', 'adminOrganType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'endBusiness', 'examTitle', 'isBulkDownloadStart']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValueList']),
    title() {
      const addMsg = this.districtCodeFirst === 'C' ? '<span class="c_red ml20">※ 통계 기준 : 비용청구서 발생일 (통보서 첫 최종제출일)</span>' : '';
      return '병원 목록' + addMsg;
    },
  },
  components: {
    'v-detailed-search': DetailedSearch,
    'v-list': List,
    HrzntTable,
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
      'c_bill',
      '번호',
      `${this.examTitle} 유형`,
      this.districtCodeFirst === 'C' ? '시군명' : this.districtCodeFirst === 'I' ? '교육지원청' : this.districtCodeFirst === 'J' ? '교육지원청<br>(연락처)' : '보건소',
      '병원명',
      '청구 월',
      this.districtCodeFirst === 'I' ? '진료 완료<br>학생 수' : '청구 인원',
      '청구 금액',
      '은행명<br>(예금주)',
      '계좌번호',
      '비용 청구서',
      '처리 상황',
      '확인',
    ];
    if (this.districtCodeFirst === 'G') {
      this.table.th.splice(8, 0, '수수료');
    }
    if (this.districtCodeFirst === 'I') {
      this.table.th.splice(6, 0, '진료학교 수');
    }
    if (!(this.divJoin('C') || this.divJoin('F')) || this.cityType === 'E' || this.healthCareType === 'E') {
      this.table.th.splice(0, 1);
    }
    this.getList();
  },
  methods: {
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        districtCode: this.districtCode,
        page: 1,
        size: 10,
      };
      if (this.cityType === 'E' || this.healthCareType === 'E') {
        form.businessDivisionE = 'Y';
      }
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Bill.monthClaimList(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = this.codeToValueList(res.data.billList);
          this.pager = res.data.paging;
          const data = res.data.billClaimTotal;
          this.billClaimTotal = [
            [
              ['총 청구인원', this.numberWithCommas(data.countBillPersonnel) + '명', 'person'],
              ['인원 (청구/지급)', this.numberWithCommas(data.countBillStatusN) + '명/' + this.numberWithCommas(data.countBillStatusY) + '명', 'person'],
              ['인원 (반려)', this.numberWithCommas(data.countBillStatusR) + '명', 'person'],
            ],
            [
              ['총 청구금액', data.totalBillPrice, 'won'],
              ['지급 금액', data.totalBillStatusYPrice, 'won'],
              ['미지급 금액', data.totalNotBillStatusYPrice, 'won'],
            ],
          ];
        }
        this.$store.commit('tableLoading', false);
      });
    },
    search(searchData) {
      if (this.districtCodeFirst === 'D') {
        if ((!!searchData.claimMonth && !searchData.claimEndMonth) || (!searchData.claimMonth && !!searchData.claimEndMonth)) {
          this.$alert('기간별 검색의 시작과 종료 월을 모두 선택해 주세요.', '알림', 'error');
          return;
        } else if (parseInt(searchData.claimMonth) > parseInt(searchData.claimEndMonth)) {
          this.$alert('기간별 검색의 종료 월이 시작 월보다 빠를 수 없습니다.', '알림', 'error');
          return;
        }
      }
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
    billMonthJudge() {
      if (this.adminOrganType !== 'AD' && this.endBusiness('bill')) {
        this.$alert('비용청구서 처리가 마감되었습니다.', '알림', 'warning');
        return false;
      }
      const checkbox = document.getElementsByName('c_bill');
      let billMonthIdList = [];
      for (const item of checkbox) {
        if (item.checked) {
          billMonthIdList.push(item.id.split('_')[0]);
        }
      }
      if (!billMonthIdList.length) {
        this.$alert('지급할 비용청구서를 선택해 주세요.', '알림', 'warning');
        return false;
      }
      this.$confirm('선택하신 비용청구서를 지급하시겠습니까?', '알림', 'question')
        .then(() => {
          this.$store.commit('loading', true);
          const form = {
            districtCode: this.$route.query.districtCode ? this.$route.query.districtCode : this.districtCode,
            billMonthIdList: billMonthIdList,
            billStatus: this.valueToCode('C0004', 'Y'),
          };
          Bill.billMonthJudge(form).then(res => {
            this.$store.commit('loading', false);
            if (res && res.data.rt === 200) {
              this.$alert('처리 완료되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
                document.getElementById('c_bill_all').checked = false;
                for (const item of checkbox) {
                  item.checked = false;
                }
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
