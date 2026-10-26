<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">심화치료</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list title="학생" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
        <a
          href="https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024%20%EC%84%9C%EC%9A%B8%EB%8C%80%EC%B9%98%EA%B3%BC%EB%B3%91%EC%9B%90%EC%9A%A9%20%EC%A0%84%EC%82%B0%EA%B0%80%EC%9D%B4%EB%93%9C.pdf"
          class="comm__orange_btn btn_m_size2 d_block wid130 commp"
          target="_blank"
        >
          전산 매뉴얼
        </a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import Univhpt from '@/apis/Univhpt';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      cmp: 'univhptDeep',
      pager: {},
      table: {
        maxNum: 1,
        col: ['*'],
        th: ['번호', '이름<br/>(성별)', '생년월일', '시설(센터)명', '개인정보<br/>활용동의', '문진표', '의뢰일', '승인일', '심화치료 의뢰서', '심화치료 통보서', '진료 상태'],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValueList']),
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
    // let popupContents = [];
    // popupContents.push('businessClose');
    //
    // this.$store.dispatch('popup/popupOpen', { contents: popupContents });

    this.getList();
  },
  methods: {
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        page: parseInt(this.$route.query.page || 1),
        size: 10,
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Univhpt.deepTreatStudentList(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = this.codeToValueList(res.data.studentList);
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
