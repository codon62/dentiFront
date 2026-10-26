<template>
  <fragment>
    <div class="flex_wrap_gap_container">
      <check-toggle v-model="form.billStatus" status="claimBillStatus" @input="updateData" class="mr15"></check-toggle>
      <template v-if="cityType !== 'E' && healthCareType !== 'E'">
        <check-toggle v-if="divJoin('F1')" v-model="form.businessDivision" status="businessDivisionF1NotE" @input="updateData" class="mr15"></check-toggle>
        <check-toggle v-else-if="divJoin('FY')" v-model="form.businessDivision" status="businessDivisionFY" @input="updateData" class="mr15"></check-toggle>
        <check-toggle v-else-if="divJoin('C')" v-model="form.businessDivision" status="businessDivisionNotE" @input="updateData" class="mr15"></check-toggle>
        <check-toggle v-else-if="divJoin('S')" v-model="form.businessDivision" status="businessDivisionSpc" @input="updateData" class="mr15"></check-toggle>
      </template>
      <check-toggle v-model="form.billCheck" status="billCheck" @input="updateData"></check-toggle>
    </div>
    <div class="flex_container mt20">
      <v-district v-if="userOrganTargetType === 'CT'" v-model="form.district" :clear="clear" :code="true" @input="updateData"></v-district>
      <v-select v-else-if="secondHelList.length" v-model="form.districtCode" title="지역구" message="전체" size="wid180" :option-data="secondHelList" @input="updateData"></v-select>
      <v-select v-if="districtCodeFirst !== 'D'" v-model="form.claimMonth" title="월별" message="전체" size="wid180" :option-data="month" @input="updateData"></v-select>
      <template v-else>
        <v-select v-model="form.claimMonth" title="기간별" message="전체" size="wid180" class="mr0" :option-data="month" @input="updateData"></v-select>
        <div class="lcommp" style="margin: 0px 10px; color: #cccccc">-</div>
        <v-select v-model="form.claimEndMonth" :noTitle="true" message="전체" size="wid180" class="ml0" :option-data="month" @input="updateData"></v-select>
      </template>
      <v-input v-model="form.hospitalName" title="병원 검색" placeholder="병원명" @input="updateData" @enter="enter"></v-input>
      <template v-if="!divJoin('C')">
        <v-select v-model="form.schoolId" title="학교" size="wid180" type="school" message="학교" @input="updateData"></v-select>
        <v-input v-model="form.studentToSchoolGrade1" title="학년 검색" type="number" placeholder="학년" @input="updateData" @enter="enter"></v-input>
      </template>
    </div>
  </fragment>
</template>

<script>
import Common from '@/apis/Common';
import Select from '@/components/common/search/Select.vue';
import District from '@/components/common/search/District.vue';
import CheckToggle from '@/components/common/search/CheckToggle';
import Input from '@/components/common/search/Input.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-select': Select,
    'v-district': District,
    'v-input': Input,
    CheckToggle,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
      secondHelList: [],
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'districtCode', 'cityType', 'healthCareType']),
    ...mapState('status', ['month']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin']),
  },
  watch: {
    clear() {
      for (const i in this.form) {
        delete this.form[i];
      }
    },
  },
  created() {
    Object.assign(this.form, this.$route.query);
    if (this.districtCodeFirst === 'C' && this.userOrganTargetType !== 'CT') {
      Common.healthCareSecondList({ districtCode: this.districtCode }).then(res => {
        if (res && res.data.rt === 200) {
          this.secondHelList = res.data.healthCareList.map(item => {
            return { id: item.districtCode, name: item.healthCareName };
          });
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
  },
  methods: {
    updateData() {
      this.$emit('input', this.form);
    },
    enter() {
      this.$emit('enter');
    },
  },
};
</script>
