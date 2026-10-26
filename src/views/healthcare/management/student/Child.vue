<template>
  <div class="sub__content form__ver_1 bg_white mt30">
    <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
    <div class="comm__line mt20"></div>
    <v-list title="학생" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
      <a v-if="userOrganTargetType === 'HC' || adminOrganType === 'AD'" href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid130 commp" @click="studentEnrollment">
        {{ districtCodeFirst === 'A' ? '신청자' : '신규 아동' }} 등록
      </a>
      <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp ml10" @click="excel()">엑셀 다운로드</a>
    </v-list>
  </div>
</template>

<script>
import Management from '@/apis/Management';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';

export default {
  mixins: [excelDownload],
  data() {
    return {
      cmp: 'managementStudentChild',
      pager: {},
      table: {
        maxNum: 1,
        col: ['*'],
        th: ['번호', '이름<br>', '생년월일', '시설(센터)명', '연락처', '개인정보<br>활용동의', '문진표', '병원 지정', 'APP 가입', 'APP 가입<br/>초기화', '정보 수정', '삭제'],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode', 'userOrganTargetType', 'adminOrganType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['endBusiness']),
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
    if (this.districtCodeFirst !== 'A') {
      this.table.th[7] = '병원 등록';
    }
    if (['A', 'C'].indexOf(this.districtCodeFirst) !== -1) {
      this.table.th.splice(7, 0, '교육 이수');
    }
    if (this.userOrganTargetType === 'CT') {
      this.table.th.splice(1, 0, '보건소');
    }
    if (this.adminOrganType === 'AD') {
      this.table.th.push('관리자 기능');
    }
    this.getList();
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    studentEnrollment() {
      if (this.adminOrganType !== 'AD' && this.endBusiness('treatment')) {
        this.$alert(`${this.districtCodeFirst === 'A' ? '신청자' : '신규 아동'} 등록이 마감되었습니다.`, '알림', 'warning');
        return false;
      }
      this.popupOpen({ contents: 'managementStudentChildStudentEnrollment' });
    },
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        districtCode: this.districtCode,
        tabType: this.valueToCode('C0036', 'C'),
        page: 1,
        size: 10,
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Management.studentList(form, this.abortController.signal).then(res => {
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
