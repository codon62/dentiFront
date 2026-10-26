<template>
  <div class="sub__content form__ver_1 bg_white mt30">
    <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
    <div class="comm__line mt20"></div>
    <v-list :full-title="`종합실적 목록${table.subTitle}`" :cmp="cmp" divclass="mt30" :table="table">
      <template v-if="adminOrganType === 'AD'">
        <a href="javascript:;" class="comm__green_bd_btn btn_m_size2 d_block wid250 commp mr10" @click="excelListSlide" @blur="excelListSlideUp">보고 데이터 엑셀 다운로드 (관리자)</a>
        <div class="btn_box btn_box_excel tac fwb wid250">
          <a href="javascript:;" @mousedown="gyeonggiReport(0)">검색 월 기준 월간보고 데이터</a>
          <a href="javascript:;" @mousedown="gyeonggiReport(1)">지난주 기준 주간보고 데이터</a>
          <a href="javascript:;" @mousedown="gyeonggiReport(2)">어제 기준 일일보고 데이터</a>
          <a href="javascript:;" @mousedown="gyeonggiReport(3)">성과보고 데이터</a>
        </div>
      </template>
      <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp" @click="excel()">엑셀 다운로드</a>
    </v-list>
  </div>
</template>

<script>
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapState } from 'vuex';
import Statistic from '@/apis/Statistic';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';
import Admin from '@/apis/Admin';

export default {
  mixins: [excelDownload],
  data() {
    return {
      recordStbDiv: 'F',
      cmp: 'statsRecord',
      billClaimTotal: [],
      table: {
        subTitle: '<span class="c_red ml20">※ 통계 기준 : 통보서 내 입력된 검진일</span>',
        maxNum: 1,
        col: ['*'],
        th: [
          ['구분', '시군명', '보건소명'],
          '학교수',
          ['대상자수', '합계', '남성', '여성'],
          ['치과주치의 검진자수', '합계', '남성', '여성'],
          ['학생구강검진 검진자수', '합계', '남성', '여성'],
          ['전체 검진자수', '합계', '남성', '여성'],
          '학생 구강검진 비율',
          '전체 수검율',
          ['선택진료인원수', '치아홈메우기', '부분 치석제거', '파노라마 촬영'],
          ['선택진료비율', '치아홈메우기', '부분 치석제거', '파노라마 촬영'],
          ['참여병원', '병원 수', '교육 이수'],
          '청구완료금액',
        ],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode', 'adminOrganType']),
    ...mapState('business', ['businessYear']),
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
    if (!this.isDev && this.districtCode.includes('99')) {
      alert('테스트 지역구 종합실적은 제공되지 않습니다.');
      this.$router.go(-1);
      return false;
    }
    this.getList();
  },
  methods: {
    gyeonggiReport(type) {
      this.$store.commit('loading', true);
      if (type !== 3) {
        let form = {
          districtCode: this.districtCode,
          type: type,
        };
        if (type === 0) {
          form.month = this.$route.query.month ?? this.getRecordMonth();
        }
        Admin.gyeonggiReport(form).then(async res => {
          await this.handleDownload(res);
          this.$store.commit('loading', false);
        });
      } else {
        Admin.gyeonggiReportData().then(async res => {
          await this.handleDownload(res);
          this.$store.commit('loading', false);
        });
      }
    },
    async handleDownload(res) {
      if (res.data.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        const fileName = decodeURI(res.headers['content-disposition'].split('filename=')[1]);
        this.fileDownload(res.data, fileName);
      } else {
        let err = {};
        if (res.data.type === 'application/json') {
          await res.data.text().then(json => {
            err = JSON.parse(json);
          });
        }
        if (err.rt === 400) {
          this.$alert(err.rtMsg, '알림', 'error');
        } else {
          let alertMsg = '알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.';
          if (err.rt) {
            alertMsg += ` 오류 코드 : ${err.rt}`;
          }
          alert(alertMsg);
        }
      }
    },
    getRecordMonth() {
      const now = new Date();
      // 사업 년도이면 (현재 월 - 1)월 까지, 아니면 12월까지
      const targetMonth = now.getFullYear() === this.businessYear ? now.getMonth() : 12;
      return targetMonth < 10 ? `0${targetMonth}` : `${targetMonth}`;
    },
    getList() {
      this.$store.commit('tableLoading', true);

      let form = {
        districtCode: this.districtCode,
        month: this.getRecordMonth(),
        type: '0',
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Statistic.reportListGyeonggi(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          this.table.list = res.data.resultList;
          // 데이터 for loop에 돌리면서 같은 시이름을 가지고 있으면 시이름을 지우고 rowspan에 들어갈 값을 증가 한다.
          for (let i = 0; i < this.table.list.length - 1; i++) {
            const str1 = this.table.list[i];
            if (str1.districtSiName === this.table.list[i + 1].districtSiName) {
              for (let j = i + 1; j < this.table.list.length; j++) {
                const str2 = this.table.list[j];
                if (str1.districtSiName === str2.districtSiName) {
                  str1.sameRow ? (str1.sameRow += 1) : (str1.sameRow = 2);
                  str2.districtSiName = '';
                  i = j;
                } else {
                  break;
                }
              }
            }
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
        this.$store.commit('tableLoading', false);
      });
    },
    search(searchData) {
      let query = {};
      for (const i in searchData) {
        if (searchData[i]) {
          query[i] = searchData[i];
        } else {
          delete query[i];
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
