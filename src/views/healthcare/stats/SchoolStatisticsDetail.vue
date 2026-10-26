<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">학교별 현황</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search" :clear-disabled="userOrganTargetType === 'CT'"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list :full-title="`${tableDistrictName} ${table.title}`" :cmp="cmp + 'Healthcare'" divclass="mt30" :table="table" />
      <v-list :full-title="`${tableDistrictName} ${table2.title}`" :sub-title="table2.subTitle" :cmp="cmp + 'School'" divclass="mt30" :table="table2">
        <v-select :key="sort" v-model="sort" size="wid200" :option-data="sortList" message="정렬하기" :no-title="true"></v-select>
        <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp ml10" @click="excel({ sort: sort, districtName: excelDistrictName })">엑셀 다운로드</a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import Statistic from '@/apis/Statistic';
import Select from '@/components/common/search/Select.vue';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapState } from 'vuex';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';

export default {
  mixins: [excelDownload],
  data() {
    return {
      cmp: 'statsSchoolStatisticsDetail',
      table: {
        title: '검진 현황 목록 <span class="scommp">(학교밖 학생 데이터 제외)</span>',
        maxNum: 1,
        col: ['*'],
        th: [
          ['구분', '시군명', '보건소명'],
          '전체 수검률 (%)',
          '대상자수 (명)',
          '전체 검진자수 (명)',
          '치과주치의 검진자수 (명)',
          '학생구강검진 검진자수 (명)',
          ['검진 유형별 비율 (%)', '학생치과주치의', '학생구강검진'],
        ],
        list: [],
      },
      table2: {
        title: '학교별 검진 현황 목록 <span class="scommp">(학교밖 학생 데이터 제외)</span>',
        subTitle: '※ 수검률이 <span class="c_blue">50% 이상은 파란색</span>, <span class="c_red">50% 미만은 빨간색</span>으로 표시됩니다.',
        maxNum: 1,
        col: ['*'],
        th: [
          ['구분', '보건소명', '학교명'],
          '전체 수검률 (%)',
          '대상자수 (명)',
          '전체 검진자수 (명)',
          '치과주치의 검진자수 (명)',
          '학생구강검진 검진자수 (명)',
          ['검진 유형별 비율 (%)', '학생치과주치의', '학생구강검진'],
        ],
        list: [],
      },
      sort: '',
      tableDistrictName: '',
      excelDistrictName: '',
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode']),
    sortList() {
      return [
        { id: 1, name: '학교명 오름차순 (ㄱ-ㅎ)' },
        { id: 2, name: '학교명 내림차순 (ㅎ-ㄱ)' },
        { id: 3, name: '전체 수검률 오름차순 (1-9)' },
        { id: 4, name: '전체 수검률 내림차순 (9-1)' },
      ];
    },
  },
  components: {
    'v-detailed-search': DetailedSearch,
    'v-select': Select,
    'v-list': List,
  },
  watch: {
    '$route.query'() {
      if (!this.isDev && this.$route.query.districtCode?.includes('99')) {
        alert('테스트 지역구 통계는 제공되지 않습니다.');
        this.$router.go(-1);
        return false;
      }
      this.sort = '';
      this.getList();
    },
    update() {
      this.getList();
    },
    sort() {
      let compareFunction;
      switch (parseInt(this.sort)) {
        case 1:
          compareFunction = (a, b) => {
            return a.schoolName > b.schoolName ? 1 : -1;
          };
          break;
        case 2:
          compareFunction = (a, b) => {
            return a.schoolName < b.schoolName ? 1 : -1;
          };
          break;
        case 3:
          compareFunction = (a, b) => {
            return a.billPercent > b.billPercent ? 1 : -1;
          };
          break;
        case 4:
          compareFunction = (a, b) => {
            return a.billPercent < b.billPercent ? 1 : -1;
          };
          break;
        default:
          compareFunction = (a, b) => {
            if (a.districtCode !== b.districtCode) {
              return a.districtCode > b.districtCode ? 1 : -1;
            }
            return a.schoolName > b.schoolName ? 1 : -1;
          };
      }
      this.table2.list.sort(compareFunction);
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
      Statistic.schoolStatisticsDetail(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          this.table.list = res.data.resultHealthCareList;
          this.table2.list = res.data.resultSchoolList;

          if (this.table.list.length > 0) {
            const firstRow = this.table.list[0];
            this.excelDistrictName = '';
            if (this.userOrganTargetType === 'CT') {
              this.tableDistrictName = firstRow.districtSiName;
              this.excelDistrictName = firstRow.districtSiName;
            } else {
              this.tableDistrictName = this.districtName;
            }
            if (firstRow.districtCode.length === 5) {
              if (this.excelDistrictName) {
                this.excelDistrictName += '_';
              }
              this.excelDistrictName += firstRow.healthCareName;
              this.tableDistrictName = firstRow.healthCareName;
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
