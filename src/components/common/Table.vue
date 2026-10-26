<template>
  <table class="comm__table">
    <colgroup>
      <col v-for="(item, key) in data.col" :key="key" :width="item" />
    </colgroup>
    <thead v-if="$route.path === '/healthcare/stats/record/seoul/child'">
      <tr>
        <th v-for="(item, key) in th1" :key="key" :rowspan="item[1]" :colspan="item[2]">
          <p class="scommp fwb" v-html="item[0]" />
        </th>
      </tr>
      <tr v-if="th2.length">
        <th v-for="(item, key) in th2" :key="key" :rowspan="item[1]" :colspan="item[2]" :class="{ border: key === 0 && th1[0][1] > 1 }">
          <p class="scommp">{{ item[0] }}</p>
        </th>
      </tr>
      <tr v-if="th3.length">
        <th v-for="(item, key) in th3" :key="key" :class="{ border: key === 0 && th1[0][1] > 1 }">
          <p class="scommp">{{ item }}</p>
        </th>
      </tr>
    </thead>
    <thead v-else>
      <tr>
        <th v-for="(item, key) in th1" :key="key" :rowspan="item[1]" :colspan="item[2]">
          <div v-if="item[0].split('_')[0] === 'c'" class="check_set d_inblock">
            <input :id="`${item[0]}_all`" type="checkbox" class="blind" @input="checkboxAll($event)" />
            <label :for="`${item[0]}_all`"><span class="icon"></span></label>
          </div>
          <p v-else class="scommp fwb" v-html="item[0]" />
        </th>
      </tr>
      <tr v-if="th2.length">
        <th v-for="(item, key) in th2" :key="key" :class="{ border: key === 0 && th1[0][1] > 1 }">
          <p class="scommp">{{ item }}</p>
        </th>
      </tr>
    </thead>
    <tbody style="position: relative">
      <loading :active.sync="tableIsLoading" :is-full-page="false" color="#0868f1" :opacity="1" loader="dots" :height="50" :width="50"></loading>
      <component :is="cmp" v-for="(item, key) in data.list" :key="key" :num="num - key" :data="item" @vclick="vclick"></component>
      <tr v-if="!data.list.length">
        <td :colspan="tableLength" class="none_ver">
          <p class="scommp tac" v-html="tableMessage ? tableMessage : '검색 결과가 없습니다.'"></p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { mapState } from 'vuex';

export default {
  components: {
    Loading,
    hospitalStudentEnrollment: () => import('@/components/hospital/studentEnrollment/TableList.vue'),
    hospitalChild: () => import('@/components/hospital/child/TableList.vue'),
    hospitalFamdoc: () => import('@/components/hospital/famdoc/TableList.vue'),
    hospitalExamine: () => import('@/components/hospital/examine/TableList.vue'),
    hospitalContract: () => import('@/components/hospital/contract/TableList.vue'),
    hospitalBill: () => import('@/components/hospital/bill/TableList.vue'),
    hospitalBillDetail: () => import('@/components/hospital/bill/detail/TableList.vue'),
    managementHealthcare: () => import('@/components/healthcare/management/healthcare/TableList.vue'),
    managementCenter: () => import('@/components/healthcare/management/center/TableList.vue'),
    managementHospital: () => import('@/components/healthcare/management/hospital/TableList.vue'),
    managementSchool: () => import('@/components/healthcare/management/school/TableList.vue'),
    managementStudentChild: () => import('@/components/healthcare/management/student/child/TableList.vue'),
    managementStudentFamdoc: () => import('@/components/healthcare/management/student/famdoc/TableList.vue'),
    managementStudentFamdocFirst: () => import('@/components/healthcare/management/student/famdocFirst/TableList.vue'),
    managementStudentFamdocYeonjegu: () => import('@/components/healthcare/management/student/famdocYeonjegu/TableList.vue'),
    managementStudentExamine: () => import('@/components/healthcare/management/student/examine/TableList.vue'),
    managementStudentDuplicate: () => import('@/components/healthcare/management/student/duplicate/TableList.vue'),
    managementStudentSpecial: () => import('@/components/healthcare/management/student/special/TableList.vue'),
    managementUser: () => import('@/components/healthcare/management/user/TableList.vue'),
    businessFamdoc: () => import('@/components/healthcare/business/famdoc/TableList.vue'),
    businessFamdocFirst: () => import('@/components/healthcare/business/famdocFirst/TableList.vue'),
    businessFamdocYeonjegu: () => import('@/components/healthcare/business/famdocYeonjegu/TableList.vue'),
    businessExamine: () => import('@/components/healthcare/business/examine/TableList.vue'),
    businessChild: () => import('@/components/healthcare/business/child/TableList.vue'),
    businessPlan: () => import('@/components/healthcare/business/plan/TableList.vue'),
    businessDeep: () => import('@/components/healthcare/business/deep/TableList.vue'),
    billClaim: () => import('@/components/healthcare/bill/claim/TableList.vue'),
    billPrintPopup: () => import('@/components/healthcare/bill/claim/printPopup/TableList.vue'),
    billClaimDetail: () => import('@/components/healthcare/bill/claim/detail/TableList.vue'),
    billRejectChild: () => import('@/components/healthcare/bill/reject/child/TableList.vue'),
    billRejectFamdoc: () => import('@/components/healthcare/bill/reject/famdoc/TableList.vue'),
    billRejectFamdocFirst: () => import('@/components/healthcare/bill/reject/famdocFirst/TableList.vue'),
    billRejectFamdocYeonjegu: () => import('@/components/healthcare/bill/reject/famdocYeonjegu/TableList.vue'),
    billRejectExamine: () => import('@/components/healthcare/bill/reject/examine/TableList.vue'),
    historyPopup: () => import('@/components/common/historyPopup/TableList.vue'),
    centerChild: () => import('@/components/center/child/TableList.vue'),
    schoolFamdoc: () => import('@/components/school/famdoc/TableList.vue'),
    schoolExamine: () => import('@/components/school/examine/TableList.vue'),
    schoolContract: () => import('@/components/school/contract/TableList.vue'),
    schoolBill: () => import('@/components/school/bill/TableList.vue'),
    schoolBillDetail: () => import('@/components/school/bill/detail/TableList.vue'),
    univhptDeep: () => import('@/components/univhpt/deep/TableList.vue'),
    contractFileList: () => import('@/components/school/contract/file/TableList.vue'),
    HospitalContractFileList: () => import('@/components/hospital/contract/file/TableList.vue'),
    noticeList: () => import('@/components/common/notice/list/TableList.vue'),
    inquiryList: () => import('@/components/common/inquiry/list/TableList.vue'),
    faqList: () => import('@/components/common/faq/list/TableList.vue'),
    treatmentChargeList: () => import('@/components/common/treatmentCharge/TableList.vue'),
    schoolHospitalList: () => import('@/components/school/hospitalList/TableList.vue'),
    hospitalHealthcareList: () => import('@/components/hospital/healthcareList/TableList.vue'),
    studentLogPopup: () => import('@/components/common/studentLogPopup/TableList.vue'),
    statsRecord: () => import('@/components/healthcare/stats/record/TableList.vue'),
    statsEduSite: () => import('@/components/healthcare/stats/eduSite/TableList.vue'),
    statsSchoolStatistics: () => import('@/components/healthcare/stats/schoolStatistics/TableList.vue'),
    statsSchoolStatisticsDetailHealthcare: () => import('@/components/healthcare/stats/schoolStatisticsDetail/healthcare/TableList.vue'),
    statsSchoolStatisticsDetailSchool: () => import('@/components/healthcare/stats/schoolStatisticsDetail/school/TableList.vue'),
    statsSurvey: () => import('@/components/healthcare/stats/survey/TableList.vue'),
    schoolStudentTransfer: () => import('@/components/school/studentTransfer/TableList.vue'),
  },
  props: ['data', 'cmp', 'tableMessage'],
  data() {
    return {
      th1: [],
      th2: [],
      th3: [],
      none: false,
    };
  },
  computed: {
    ...mapState(['tableIsLoading']),
    num() {
      return this.data.maxNum || this.data.list.length;
    },
    tableLength() {
      let num = 0;
      for (const item of this.th1) {
        if (item[1] !== 2) {
          num++;
        }
      }
      return this.th1.length + this.th2.length + this.th3.length - num;
    },
  },
  watch: {
    'data.th'() {
      if (this.$route.path === '/healthcare/stats/record/seoul/child') {
        this.setTh3();
      } else {
        this.setTh();
      }
    },
  },
  mounted() {
    if (this.$route.path === '/healthcare/stats/record/seoul/child') {
      this.setTh3();
    } else {
      this.setTh();
    }
  },
  methods: {
    vclick(data) {
      this.$emit('vclick', data);
    },
    setTh() {
      this.th1 = [];
      this.th2 = [];
      this.data.th.forEach(value => {
        if (typeof value !== 'object') {
          this.th1.push([value, 2, 1]);
        } else {
          this.th1.push([value[0], 1, value.length - 1]);
          for (let i = 1; i < value.length; i++) {
            this.th2.push(value[i]);
          }
        }
      });
    },
    setTh3() {
      // 3열 헤더 셋팅
      this.th1 = [];
      this.th2 = [];
      this.th3 = [];
      this.data.th.forEach(value => {
        if (typeof value !== 'object') {
          this.th1.push([value, 3, 1]);
        } else {
          if (typeof value[0] !== 'object' && typeof value[1] === 'object') {
            // 예) ['등록현황', ['목표 (사업량)', '전월 누계', '()월 등록수', '누계', '비율']]
            // 배열 안 첫번째 item이 배열이 아니고 두번째 item이 배열이면 첫번째 item이 1열 헤드가 되고 배열인 item은 2열에 rowspan 되며 들어간다.
            this.th1.push([value[0], 1, value[1].length]);
            for (let i = 0; i < value[1].length; i++) {
              this.th2.push([value[1][i], 2, 0]);
            }
          } else if (typeof value[0] !== 'object') {
            // 예) ['검진 및 치료비지원 인원수', '검진비 건 수', '검진비 합계']
            // 배열 안 item들이 배열이 아니면 첫번째 item이 1열 헤드가 되고 나머지는 3열에 들어간다.
            this.th1.push([value[0], 2, value.length - 1]);
            for (let i = 1; i < value.length; i++) {
              this.th3.push(value[i]);
            }
          } else {
            // 예) [['지원현황', '치과의뢰(누계)', '심화', '지역치과']]
            // 배열 안 첫번째 item이 배열인 경우 첫번째 item이 1열 헤드, 두번째 item이 2열 헤드, 나머지는 3열에 들어간다.
            this.th1.push([value[0][0], 1, value[0].length - 2]);
            this.th2.push([value[0][1], 1, value[0].length - 2]);
            for (let i = 2; i < value[0].length; i++) {
              this.th3.push(value[0][i]);
            }
          }
        }
      });
    },
    checkboxAll(e) {
      const checkbox = document.getElementsByName(e.target.id.split('_all')[0]);
      for (const item of checkbox) {
        item.checked = e.target.checked;
      }
    },
  },
};
</script>
