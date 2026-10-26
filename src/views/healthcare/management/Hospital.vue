<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">병원 회원 관리</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>
      <v-list title="병원" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
        <a
          v-if="districtCodeFirst === 'A' && (cityType === 'E' || healthCareType === 'E' || adminOrganType === 'AD')"
          href="javascript:;"
          class="comm__green_btn btn_m_size2 d_block wid130 commp mr10"
          @click="excel(null, 'temporaryId')"
        >
          임시계정 조회
        </a>
        <a v-if="isTemporaryId" href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid150 commp" @click="registHospitalId">병원 아이디 추가</a>
        <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid130 commp ml10" @click="popupOpen({ contents: 'hospitalEnrollment' })">병원 등록</a>
        <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp ml10" @click="excel()">엑셀 다운로드</a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import Management from '@/apis/Management';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';
import Hospital from '@/apis/Hospital';

export default {
  mixins: [excelDownload],
  data() {
    return {
      cmp: 'managementHospital',
      pager: {},
      table: {
        maxNum: 1,
        col: ['*'],
        th: ['번호', '보건소', '병원명<br/>(사업자등록번호)', '대표치과의사<br/>성명', '검진 유형', '알림톡', '정보 수정', '비밀번호'],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode', 'adminOrganType', 'cityType', 'healthCareType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin']),
    ...mapGetters('definedCode', ['codeToValueList']),
    isTemporaryId() {
      return ['A', 'I'].includes(this.districtCodeFirst) && (this.cityType === 'E' || this.healthCareType === 'E' || this.adminOrganType === 'AD');
    },
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
    if ((!this.divJoin('C') && this.districtCodeFirst !== 'J') || this.cityType === 'E' || this.healthCareType === 'E') {
      this.table.th.splice(4, 1); // 검진 유형 삭제
    }
    if (this.districtCodeFirst === 'C') {
      this.table.th[1] = '시군명';
      this.table.th.splice(4, 0, '장애인 진료', '동영상 교육');
      this.table.th.splice(7, 0, '자율점검표');
    } else if (this.districtCodeFirst === 'B') {
      this.table.th[2] = '병원명<br/>(요양기관번호)';
    } else if (this.districtCodeFirst === 'I') {
      this.table.th[1] = '교육지원청';
    } else if (this.districtCodeFirst === 'J') {
      this.table.th[1] = '지역구';
    }
    if (this.isTemporaryId) {
      this.table.th.splice(-2, 0, '최초 로그인 아이디');
    }
    if (this.adminOrganType === 'AD') {
      this.table.th.push((this.districtCodeFirst === 'B' ? '요양기관번호' : '사업자등록번호') + ' 변경', '삭제');
    }
    this.getList();
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    registHospitalId() {
      this.$prompt(`등록할 치과병원의 ${this.districtCodeFirst === 'A' ? '서울시치과의사회 ' : ''}아이디를 입력해 주세요.`, '', `${this.districtCodeFirst === 'A' ? '치과의사회 ' : ''}아이디 입력`)
        .then(res => {
          const form = {
            districtDigit1: this.districtCodeFirst,
            userOrganLoginId: res.trim(),
          };
          Hospital.registTemporaryId(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('등록되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
              });
            } else {
              if (res.data.rt === 422) {
                this.$alert(res.data.rtMsg, '알림', 'error');
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            }
          });
        })
        .catch(() => {});
    },
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        districtCode: this.districtCode,
        page: 1,
        size: 10,
      };
      if (this.cityType === 'E' || this.healthCareType === 'E') {
        form.businessDivisionE = 'Y';
      }
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Management.hospitalList(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = this.codeToValueList(res.data.hospitalList);
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
