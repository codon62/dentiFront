<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">{{ healthCareTitle }} 회원 관리</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list :title="healthCareTitle" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
        <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp" @click="excel()">엑셀 다운로드</a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import Management from '@/apis/Management';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapGetters, mapState } from 'vuex';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';

export default {
  mixins: [excelDownload],
  data() {
    return {
      cmp: 'managementHealthcare',
      pager: {},
      table: {
        maxNum: 1,
        col: ['*'],
        th: ['번호', '보건소', '아이디', '연락처', '담당자', '담당자 연락처', '정보 수정', '비밀번호'],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['healthCareTitle']),
    ...mapGetters('definedCode', ['codeToValueList']),
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
    if (this.districtCodeFirst === 'C') {
      this.table.th[1] = '시군명';
    } else if (['I', 'J'].includes(this.districtCodeFirst)) {
      this.table.th[1] = '교육지원청';
    }
    this.getList();
  },
  methods: {
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        districtCode: this.districtCodeFirst,
        page: 1,
        size: 10,
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Management.healthcareList(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = this.codeToValueList(res.data.healthCareList);
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
