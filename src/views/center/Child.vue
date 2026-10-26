<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">아동 치과주치의</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list title="학생" :cmp="cmp" divclass="mt30" :table="table" :pager="pager"></v-list>
    </div>
  </fragment>
</template>

<script>
import Center from '@/apis/Center';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      cmp: 'centerChild',
      pager: {},
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
    ...mapState('user', ['userOrganTargetId']),
    ...mapGetters('user', ['districtCodeFirst']),
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
    if (this.districtCodeFirst === 'A') {
      this.table.th = ['번호', '이름<br>(생년월일)', '검진 병원', '교육 이수', '개인정보<br/>활용동의', '문진표', '통보서', '진료 여부', '진료 의뢰 병원', '내역서', '수검 여부', '정보 수정'];
    } else if (this.districtCodeFirst === 'D') {
      this.table.th = ['번호', '이름<br>(생년월일)', '검진 병원', '개인정보<br/>활용동의', '문진표', '통보서', '심화치료', '정보 수정'];
    }
    // if (this.isDev) {
    //     this.table.th.push('관리자 기능<br/>(개발서버)');
    // }
    this.getList();
  },
  methods: {
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        centerId: this.userOrganTargetId,
        page: parseInt(this.$route.query.page || 1),
        size: 10,
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Center.studentList(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = this.codeToValueList(res.data.studentList);
          this.pager = res.data.paging;
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
