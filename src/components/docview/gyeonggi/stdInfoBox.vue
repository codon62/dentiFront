<template>
  <fragment>
    <p class="commp2 fwb mt20">{{ businessDivision === 'C' ? '아동' : '학생' }} 기본 정보</p>
    <div class="std_container mt10">
      <div v-for="(item, index) in data" :key="item.id" class="info_box" :class="{ info_box_2: index > 2 }">
        <p class="commp c_black fwb">{{ item.label }}</p>
        <div style="display: table">
          <div class="info_text wid100" style="display: table-cell; vertical-align: middle">{{ value(item) }}</div>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'StdInfoBox',
  props: ['businessDivision'],
  data() {
    return {
      data: [],
    };
  },
  computed: {
    ...mapState('status', ['studentGender', 'studentInsurance']),
    ...mapState('student', ['studentInfo']),
  },
  created() {
    const { healthCareName, studentName, studentBirth, studentGender, centerName, schoolInfo, studentTel, studentInsurance } = this.studentInfo;

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
      } else if (item.id === 'healthCareName') {
        value = `${item.value} 보건소`;
      } else if (item.id === 'schoolInfo') {
        value =
          this.studentInfo.schoolName.value !== '학교밖'
            ? `${this.studentInfo.schoolName.value} (${this.studentInfo.studentToSchoolGrade1.value}학년 ${this.studentInfo.studentToSchoolGrade2.value}반 ${this.studentInfo.studentToSchoolGrade3.value}번)`
            : this.studentInfo.schoolName.value;
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
  height: 40px;
}
.info_box:nth-child(3n + 1) {
  border-left-width: 1px;
}
.info_box > p {
  line-height: 40px;
  padding: 0 10px;
  width: 70px;
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
.info_text {
  padding: 0 10px;
  color: #343c58;
  font-weight: 400;
}
</style>
