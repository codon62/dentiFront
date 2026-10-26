<template>
  <div class="sub__section" :class="divclass">
    <div class="sub__titbox mt30">
      <span class="icon d_inblock"><img src="@/assets/images/common/ic_filter.png" /></span>
      <p class="commp2 d_inblock fwb ml5" v-html="searchTitle"></p>
    </div>
    <div class="comm__line mt15"></div>
    <div class="section_con search__ver">
      <component :is="cmp" v-model="form" :clear="clear" :description="description" @enter="search"></component>
      <div v-if="!disabled" class="row tac mt20">
        <input type="button" class="comm__blue_btn search_btn d_inblock" value="검색" @click="search" />
        <input type="button" class="comm__blue_bd_btn refresh_btn d_inblock ml10" value="초기화" :disabled="clearDisabled" @click="reset" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  components: {
    hospitalChild: () => import('@/components/hospital/child/SearchList.vue'),
    hospitalFamdoc: () => import('@/components/hospital/famdoc/SearchList.vue'),
    hospitalExamine: () => import('@/components/hospital/examine/SearchList.vue'),
    hospitalContract: () => import('@/components/hospital/contract/SearchList.vue'),
    hospitalBill: () => import('@/components/hospital/bill/SearchList.vue'),
    managementHealthcare: () => import('@/components/healthcare/management/healthcare/SearchList.vue'),
    managementCenter: () => import('@/components/healthcare/management/center/SearchList.vue'),
    managementHospital: () => import('@/components/healthcare/management/hospital/SearchList.vue'),
    managementSchool: () => import('@/components/healthcare/management/school/SearchList.vue'),
    managementStudentChild: () => import('@/components/healthcare/management/student/child/SearchList.vue'),
    managementStudentFamdoc: () => import('@/components/healthcare/management/student/famdoc/SearchList.vue'),
    managementStudentFamdocFirst: () => import('@/components/healthcare/management/student/famdocFirst/SearchList.vue'),
    managementStudentFamdocYeonjegu: () => import('@/components/healthcare/management/student/famdocYeonjegu/SearchList.vue'),
    managementStudentExamine: () => import('@/components/healthcare/management/student/examine/SearchList.vue'),
    managementStudentDuplicate: () => import('@/components/healthcare/management/student/duplicate/SearchList.vue'),
    managementStudentSpecial: () => import('@/components/healthcare/management/student/special/SearchList.vue'),
    managementUser: () => import('@/components/healthcare/management/user/SearchList.vue'),
    businessFamdoc: () => import('@/components/healthcare/business/famdoc/SearchList.vue'),
    businessFamdocFirst: () => import('@/components/healthcare/business/famdocFirst/SearchList.vue'),
    businessFamdocYeonjegu: () => import('@/components/healthcare/business/famdocYeonjegu/SearchList.vue'),
    businessExamine: () => import('@/components/healthcare/business/examine/SearchList.vue'),
    businessChild: () => import('@/components/healthcare/business/child/SearchList.vue'),
    businessPlan: () => import('@/components/healthcare/business/plan/SearchList.vue'),
    businessDeep: () => import('@/components/healthcare/business/deep/SearchList.vue'),
    billClaim: () => import('@/components/healthcare/bill/claim/SearchList.vue'),
    billRejectChild: () => import('@/components/healthcare/bill/reject/child/SearchList.vue'),
    billRejectFamdoc: () => import('@/components/healthcare/bill/reject/famdoc/SearchList.vue'),
    billRejectFamdocFirst: () => import('@/components/healthcare/bill/reject/famdocFirst/SearchList.vue'),
    billRejectFamdocYeonjegu: () => import('@/components/healthcare/bill/reject/famdocYeonjegu/SearchList.vue'),
    billRejectExamine: () => import('@/components/healthcare/bill/reject/examine/SearchList.vue'),
    centerChild: () => import('@/components/center/child/SearchList.vue'),
    schoolFamdoc: () => import('@/components/school/famdoc/SearchList.vue'),
    schoolExamine: () => import('@/components/school/examine/SearchList.vue'),
    schoolContract: () => import('@/components/school/contract/SearchList.vue'),
    schoolBill: () => import('@/components/school/bill/SearchList.vue'),
    univhptDeep: () => import('@/components/univhpt/deep/SearchList.vue'),
    noticeList: () => import('@/components/common/notice/list/SearchList.vue'),
    inquiryList: () => import('@/components/common/inquiry/list/SearchList.vue'),
    faqList: () => import('@/components/common/faq/list/SearchList.vue'),
    statsReport: () => import('@/components/healthcare/stats/report/SearchList.vue'),
    statsRecord: () => import('@/components/healthcare/stats/record/SearchList.vue'),
    statsEduSite: () => import('@/components/healthcare/stats/eduSite/SearchList.vue'),
    statsSchoolStatistics: () => import('@/components/healthcare/stats/schoolStatistics/SearchList.vue'),
    statsSchoolStatisticsDetail: () => import('@/components/healthcare/stats/schoolStatisticsDetail/SearchList.vue'),
    statsSurvey: () => import('@/components/healthcare/stats/survey/SearchList.vue'),
  },
  props: ['cmp', 'divclass', 'description', 'disabled', 'clearDisabled'],
  data() {
    return {
      form: {},
      clear: false,
    };
  },
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
    searchTitle() {
      let addMsg = '';
      if (['hospitalFamdoc', 'hospitalExamine'].indexOf(this.cmp) !== -1 || (this.districtCodeFirst !== 'A' && 'hospitalChild' === this.cmp)) {
        addMsg = '<span class="c_red ml20">※ 학생 등록을 먼저 해주세요. 해당 의료기관에 등록한 학생을 검색하는 기능입니다.</span>';
      } else if (this.districtCodeFirst === 'A' && ['schoolFamdoc', 'schoolExamine'].indexOf(this.cmp) !== -1) {
        addMsg = '<span class="c_red ml20">※ 정상적인 서비스 이용을 위해 "학생 정보 업로드"를 통해 학생 정보를 먼저 입력해주세요.</span>';
      }
      return '상세 검색' + addMsg;
    },
  },
  created() {
    Object.assign(this.form, this.$route.query);
  },
  methods: {
    reset() {
      const search = document.querySelector('.search__ver');

      for (const i of search.getElementsByClassName('toggle_btn')) {
        i.classList.remove('on');
      }

      for (const i of search.getElementsByClassName('check_toggle_btn')) {
        i.classList.remove('on');
      }

      for (const i of search.getElementsByClassName('comm_select')) {
        i.value = '';
      }

      for (const i of search.getElementsByClassName('comm_put')) {
        i.value = '';
      }
      this.form = {};
      this.clear = !this.clear;
      if (this.$route.path !== this.$route.fullPath) {
        this.$router.push(this.$route.path);
      }
    },
    search() {
      this.$emit('search', this.form);
    },
  },
};
</script>
