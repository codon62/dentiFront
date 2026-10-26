<template>
  <fragment>
    <p class="commp2 fwb mt20">{{ businessDivision === 'C' ? '아동' : '학생' }} 기본 정보</p>
    <div class="std_container mt10">
      <div v-for="(item, index) in data" :key="item.id" class="info_box" :class="{ info_box_2: index > 2 }">
        <p class="commp c_black fwb">{{ item.label }}</p>
        <div class="m__putbox wid100"><input type="text" class="comm_put read_put" style="background-color: #fff; padding: 0 20px" :value="value(item)" readonly /></div>
      </div>
    </div>
    <div v-if="studentInsuranceNotice" class="flex_item ml20">
      <p class="commp c_red fwn">※ 보험종류 미가입 시 정보수정에서 보험종류 수정 부탁드립니다.</p>
      <p class="commp c_red fwn">※ 보험종류가 없을 시 반려됩니다.</p>
    </div>
  </fragment>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'StdInfoBoxVue',
  props: ['businessDivision', 'studentInsuranceNotice'],
  data() {
    return {
      lineData: {
        line1Data: {
          id: '1',
          data: [],
        },
        line2Data: {
          id: '2',
          data: [],
        },
      },
      data: [],
    };
  },
  computed: {
    ...mapState('status', ['studentGender', 'studentInsurance']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
  created() {
    const { healthCareName, studentName, studentBirth, studentGender, centerName, schoolInfo, studentTel, studentInsurance } = this.studentInfo;

    if (this.districtCodeFirst === 'I') {
      healthCareName.label = '교육지원청';
    } else if (this.districtCodeFirst === 'J') {
      healthCareName.label = '지역구';
    }
    if (this.businessDivision === 'C') {
      this.data = [healthCareName, studentName, studentBirth, studentGender, centerName, studentTel, studentInsurance];
    } else {
      this.data = [studentName, schoolInfo, studentBirth, studentTel, studentGender, healthCareName];
    }
  },
  methods: {
    value(item) {
      let value = '';
      if (item.id === 'studentGender') {
        value = this.studentGender[item.value];
      } else if (item.id === 'studentInsurance') {
        value = this.studentInsurance[item.value];
      } else {
        value = item.value;
      }
      return value ? value : '-';
    },
  },
};
</script>

<style scoped lang="scss">
.std_container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.info_box {
  @include box-sizing(border-box);

  display: flex;
  border: 1px solid #e6e6e6;
  border-left-width: 0;
  width: 30%;
}
.info_box:nth-child(3n + 1) {
  border-left-width: 1px;
}
.info_box > p {
  line-height: 40px;
  padding: 0 10px;
  width: 130px;
  text-align: center;
  border-right: 1px #e6e6e6 solid;
  flex-shrink: 0;
  box-sizing: border-box;
}
.info_box_2 {
  border-top: 0;
}
.info_box:nth-child(3n + 2) {
  width: 40%;
}
</style>
