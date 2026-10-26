<template>
  <div class="sub__content form__ver_1 bg_white mt30">
    <v-detailed-search :cmp="cmp" divclass="mt15" :description="description" @search="search"></v-detailed-search>
    <div class="comm__line mt20"></div>
    <v-list title="종합실적" :cmp="cmp" divclass="mt30" :table="table">
      <a :href="manualHref" class="comm__red_btn btn_m_size2 d_block wid130 commp mr10" target="_blank">통계 기준</a>
      <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp" @click="excel()">엑셀 다운로드</a>
    </v-list>
  </div>
</template>

<script>
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapGetters, mapState } from 'vuex';
import Statistic from '@/apis/Statistic';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';

export default {
  mixins: [excelDownload],
  data() {
    return {
      recordStbDiv: 'C',
      cmp: 'statsRecord',
      billClaimTotal: [],
      table: {
        maxNum: 1,
        col: ['*'],
        th: ['자치구', ['등록현황', '전월 누계', '-월 등록수', '누계 (검진자 수)', '비율']],
        list: [],
      },
      description: '',
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode', 'userOrganTargetType', 'cityType', 'healthCareType']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('definedCode', ['valueToCode']),
    manualHref() {
      if (this.cityType === 'E' || this.healthCareType === 'E') {
        return 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/서울시 덴티아이 시스템 통계자료(종합실적) 가이드_교육청,치과의사회 계정.pdf';
      }
      if (this.userOrganTargetType === 'CT') {
        return 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/서울시 덴티아이 시스템 통계자료(종합실적) 가이드_서울시 계정.pdf';
      }
      if (this.districtCode === 'A0109') {
        return 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/서울시 덴티아이 시스템 통계자료(종합실적) 가이드_노원구 보건소 계정.pdf';
      }
      return 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/서울시 덴티아이 시스템 통계자료(종합실적) 가이드_보건소 계정.pdf';
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
    if (!this.isDev && this.districtCode.includes('99')) {
      alert('테스트 지역구 종합실적은 제공되지 않습니다.');
      this.$router.go(-1);
      return false;
    }
    this.tableHeaderSet();
    this.getList();
  },
  methods: {
    getList() {
      this.$store.commit('tableLoading', true);
      if (this.$route.path === '/healthcare/stats/record/seoul/child') {
        this.recordStbDiv = 'C';
      } else if (this.$route.path === '/healthcare/stats/record/seoul/famdoc') {
        this.recordStbDiv = 'F';
      } else if (this.$route.path === '/healthcare/stats/record/seoul/famdoc/first') {
        this.recordStbDiv = 'F1';
      } else if (this.$route.path === '/healthcare/stats/record/seoul/examine') {
        this.recordStbDiv = 'E';
      }
      let form = {
        districtCode: this.districtCode,
        tabType: this.valueToCode('C0003', this.recordStbDiv),
      };
      if (!this.$route.query.type) {
        const now = new Date();
        // 사업 년도이면 (현재 월 - 1)월 까지, 아니면 12월까지
        const targetMonth = now.getFullYear() === this.businessYear ? now.getMonth() : 12;

        form.month = targetMonth < 10 ? `0${targetMonth}` : `${targetMonth}`;
        form.type = '2';
      } else {
        for (const i in this.$route.query) {
          form[i] = this.$route.query[i];
        }
      }
      this.abortController = new AbortController();
      Statistic.reportListSeoul(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          this.table.list = res.data.resultList;
          // 데이터 for loop에 돌리면서 같은 시이름을 가지고 있으면 시이름을 지우고 rowspan에 들어갈 값을 증가 한다.
          for (let i = 0; i < this.table.list.length - 1; i++) {
            const str1 = this.table.list[i];
            if (str1.healthCareName === this.table.list[i + 1].healthCareName) {
              for (let j = i + 1; j < this.table.list.length; j++) {
                const str2 = this.table.list[j];
                if (str1.healthCareName === str2.healthCareName) {
                  str1.sameRow ? (str1.sameRow += 1) : (str1.sameRow = 2);
                  str2.healthCareName = '';
                  i = j;
                } else {
                  break;
                }
              }
            }
          }
          this.description = res.data.description;
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
    tableHeaderSet() {
      const now = new Date();
      let optionHeader = '';
      if (this.$route.query.type === '0') {
        // 월별 검색
        if (this.$route.query.month) {
          optionHeader = `${Number(this.$route.query.month)}월`;
        } else {
          // 사업 년도이면 (현재 월 - 1)월 까지, 아니면 12월까지
          optionHeader = (now.getFullYear() === this.businessYear ? now.getMonth() : 12) + '월';
        }
      } else {
        let date = now;
        switch (this.$route.query.type) {
          case '2':
            date.setDate(now.getDate() - 1);
            break;
          case '1':
            date.setDate(now.getDate() - 7);
            break;
        }
        optionHeader = date.getMonth() + 1 + '월';
      }
      switch (this.$route.path) {
        case '/healthcare/stats/record/seoul/child':
          this.table.th = [
            '자치구',
            ['등록현황', ['목표 (사업량)', '등록 인원수', '전월 누계', `${optionHeader} 등록수`, '누계 (통보서)', '누계 (검진자 수)', '비율']],
            [['지원현황', '치과의뢰(누계)', '심화', '지역치과']],
            '검진 및 치료인원 (실인원) / 누계',
            '치료건수',
            [
              '검진 및 치료비지원 인원수',
              '검진 인원수',
              '검진비 합계',
              '지원금 없음',
              '10만원 미만',
              '10만원 ~ 20만원 미만',
              '20만원 ~ 40만원 미만',
              '40만원 ~ 60만원 미만',
              '60만원 ~ 100만원 미만',
              '100만원 이상',
            ],
          ];
          break;
        case '/healthcare/stats/record/seoul/examine':
          this.table.th = ['자치구', ['등록현황', '전월 누계', `${optionHeader} 등록수`, '누계 (검진자 수)', '비율']];
          break;
        case '/healthcare/stats/record/seoul/famdoc/first':
          this.table.th = ['자치구', ['등록현황', '등록 인원수', '전월 누계', `${optionHeader} 등록수`, '누계 (검진자 수)', '비율']];
          break;
        default:
          this.table.th = ['자치구', ['등록현황', '목표 (사업량)', '등록 인원수', '전월 누계', `${optionHeader} 등록수`, '누계 (검진자 수)', '비율']];
          break;
      }
    },
  },
};
</script>
