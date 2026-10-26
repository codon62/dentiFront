<template>
  <div class="sub__content form__ver_1 bg_white mt30">
    <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
    <div class="comm__line mt20"></div>
    <div class="sub__section mt30">
      <div class="titbox" style="height: 40px">
        <div>
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_searchlist.png" /></span>
          <p class="commp2 d_inblock fwb ml5">
            설문조사 참여 현황 목록
            <router-link to="/healthcare/business/famdoc" class="c_red ml20">※ 학생별 세부적인 답변(raw data)은 사업관리 → 학생 치과주치의 → 만족도조사 결과 클릭하여 다운로드 가능</router-link>
          </p>
        </div>
      </div>
      <div class="section_con search__ver">
        <div class="board__box">
          <table class="comm__table">
            <thead>
              <tr>
                <th v-for="item in table.th" :key="item">
                  <p class="scommp fwb">{{ item }}</p>
                </th>
              </tr>
            </thead>
            <tbody style="position: relative">
              <table-list v-for="(item, key) in table.list" :key="key" :data="item" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import { mapState } from 'vuex';
import TableList from '../../../components/healthcare/stats/survey/TableList.vue';

export default {
  data() {
    return {
      cmp: 'statsSurvey',
      table: {
        maxNum: 1,
        col: ['*'],
        th: ['구분', '설문조사', '엑셀 다운로드'],
        list: [
          { surveyName: '문진표(사전 설문)', excelType: 'gyeonggiQuestionnaire', section: '학생 및 보호자', sameRow: 3 },
          { surveyName: '만족도 조사', excelType: 'gyeonggiSurvey' },
          { surveyName: '사후 설문조사', excelType: 'gyeonggiQuestionnaireSurvey' },
          { surveyName: '보건소 만족도 조사', excelType: 'gyeonggiHealthCareSurvey', section: '기관', sameRow: 3 },
          { surveyName: '의료기관 만족도 조사', excelType: 'gyeonggiHospitalSurvey' },
          { surveyName: '학교 만족도 조사', excelType: 'gyeonggiSchoolSurvey' },
        ],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState('user', ['districtCode']),
  },
  components: {
    'v-detailed-search': DetailedSearch,
    TableList,
  },
  watch: {
    '$route.query'() {
      if (!this.isDev && this.$route.query.districtCode?.includes('99')) {
        alert('테스트 지역구 통계는 제공되지 않습니다.');
        this.$router.go(-1);
        return false;
      }
    },
  },
  created() {
    if (!this.isDev && this.districtCode.includes('99')) {
      alert('테스트 지역구 통계는 제공되지 않습니다.');
      this.$router.go(-1);
      return false;
    }
  },
  methods: {
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

<style scoped lang="scss">
table {
  width: 450px;
}
.comm__table th {
  border: 1px solid #cad5e6 !important;
}
.comm__table th:first-child {
  border-left: 1px solid #cad5e6 !important;
}
</style>
