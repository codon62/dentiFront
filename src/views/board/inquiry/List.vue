<template>
  <div class="sub__content form__ver_1 bg_white mt30">
    <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
    <div class="comm__line mt20"></div>
    <v-list title="보건소 문의" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
      <template v-if="userOrganTargetType === 'HP'">
        <a href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid150 commp" @click="popupOpen({ contents: 'hospitalHealthcareList' })">시군별 연락처 안내</a>
        <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid130 commp ml10" @click="$router.push('/hospital/board/inquiry/enroll')">보건소 문의 등록</a>
      </template>
    </v-list>
  </div>
</template>

<script>
import Board from '@/apis/Board';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'List',
  data() {
    return {
      cmp: 'inquiryList',
      pager: {},
      table: {
        maxNum: 1,
        col: ['6%', '8%', '8%', '*', '8%', '8%', '8%', '8%'],
        th: ['번호', '문의한 시군', '카테고리', '제목', '처리사항', '소속된 시군', '작성자', '작성일'],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode', 'userOrganId', 'userOrganTargetType', 'adminOrganType']),
    ...mapGetters('definedCode', ['valueToCode']),
    ...mapGetters('user', ['districtCodeFirst']),
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
    this.getList();
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        page: 1,
        size: 10,
      };
      if (['CT', 'HC'].includes(this.userOrganTargetType)) {
        form.districtCode = this.districtCode;
      } else {
        form.inquiryQuestionAdminOrganId = this.userOrganId;
        form.inquiryQuestionAdminOrganType = this.valueToCode('C0006', this.adminOrganType);
      }
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Board.inquiryList(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = res.data.inquiryList;
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

<style scoped></style>
