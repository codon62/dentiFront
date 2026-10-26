<template>
  <div class="sub__content form__ver_1 bg_white mt30">
    <v-detailed-search :cmp="cmp" divclass="mt15" :description="description" @search="search"></v-detailed-search>
    <div class="comm__line mt20"></div>
    <v-list title="종합실적" :cmp="cmp" divclass="mt30" :table="table">
      <a
        href="https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/부산시 덴티아이 시스템 통계자료(종합실적) 가이드.pdf"
        class="comm__red_btn btn_m_size2 d_block wid130 commp mr10"
        target="_blank"
      >
        통계 기준
      </a>
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
        th: [
          '구분',
          '대상자',
          '검진자수 (아동치과주치의)',
          '수검률',
          '치료인원 (누계)',
          ['치료비 지원 인원수', '20만원 미만', '20만원 ~ 30만원 미만'],
          ['청구 (반려포함)', '청구건', '청구금액'],
          ['처리완료', '지급건', '지급금액'],
          '지급율',
        ],
        list: [],
      },
      description: '',
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode', 'userOrganTargetType']),
    ...mapState('business', ['businessYear']),
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
  components: {
    'v-detailed-search': DetailedSearch,
    'v-list': List,
  },
  methods: {
    getList() {
      this.$store.commit('tableLoading', true);
      if (this.$route.path === '/healthcare/stats/record/busan/child') {
        this.recordStbDiv = 'C';
      } else if (this.$route.path === '/healthcare/stats/record/busan/famdoc') {
        this.recordStbDiv = 'F';
      } else if (this.$route.path === '/healthcare/stats/record/busan/famdoc/yeonjegu') {
        this.recordStbDiv = 'FY';
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
      Statistic.reportListBusan(form, this.abortController.signal).then(res => {
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
      switch (this.$route.path) {
        case '/healthcare/stats/record/busan/child':
          this.table.th = [
            '구분',
            '대상자',
            '검진자수 (아동치과주치의)',
            '수검률',
            '치료인원 (누계)',
            ['치료비 지원 인원수', '20만원 미만', '20만원 ~ 30만원 미만'],
            ['청구 (반려포함)', '청구건', '청구금액'],
            ['처리완료', '지급건', '지급금액'],
            '지급율',
          ];
          break;
        default:
          this.table.th = ['구분', '대상자', '검진자수 (치과주치의)', '수검률', ['청구 (반려포함)', '청구건', '청구금액'], ['처리완료', '지급건', '지급금액'], '지급율'];
          break;
      }
    },
  },
};
</script>
