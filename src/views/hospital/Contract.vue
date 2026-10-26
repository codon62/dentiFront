<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">계약 관리</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list title="학교" :cmp="cmp" divclass="mt30" :table="table" :pager="pager"></v-list>
    </div>
  </fragment>
</template>

<script>
import Hospital from '@/apis/Hospital';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      cmp: 'hospitalContract',
      pager: {},
      table: {
        maxNum: 1,
        col: ['8%', '10%', '*', '*', '*', '10%', '10%'],
        th: ['번호', '보건소', '학교명', '이메일', '학교 전화번호', '서식 다운로드', '사업 신청'],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['userOrganTargetId']),
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
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        hospitalId: this.userOrganTargetId,
        page: parseInt(this.$route.query.page || 1),
        size: 10,
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Hospital.contractSchoolList(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = this.codeToValueList(res.data.schoolList);
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
