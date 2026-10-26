<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">학교별 현황</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list :full-title="table.title" :cmp="cmp" divclass="mt30" :table="table">
        <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp ml10" @click="excel()">엑셀 다운로드</a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import Statistic from '@/apis/Statistic';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapState } from 'vuex';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';

export default {
  mixins: [excelDownload],
  data() {
    return {
      cmp: 'statsSchoolStatistics',
      table: {
        title: '학교별 현황 목록 <span class="scommp">(학교밖 학생 데이터 제외)</span>',
        maxNum: 1,
        col: ['*'],
        th: [
          ['구분', '시군명', '보건소명'],
          '학교수',
          '전체 수검률 (%)',
          '대상자수 (명)',
          '전체 검진자수 (명)',
          '치과주치의 검진자수 (명)',
          '학생구강검진 검진자수 (명)',
          ['검진 유형별 비율 (%)', '학생치과주치의', '학생구강검진'],
          '상세보기',
        ],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode']),
  },
  components: {
    'v-detailed-search': DetailedSearch,
    'v-list': List,
  },
  watch: {
    '$route.query'() {
      if (!this.isDev && this.$route.query.districtCode?.includes('99')) {
        alert('테스트 지역구 통계는 제공되지 않습니다.');
        this.$router.go(-1);
        return false;
      }
      this.getList();
    },
    update() {
      this.getList();
    },
  },
  created() {
    if (!this.isDev && this.districtCode.includes('99')) {
      alert('테스트 지역구 통계는 제공되지 않습니다.');
      this.$router.go(-1);
      return false;
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
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Statistic.schoolStatistics(form, this.abortController.signal).then(res => {
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
