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
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['businessDivision'],
  data() {
    return {
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
      this.data = [healthCareName, studentName, studentBirth, studentGender, schoolInfo];
      if (this.districtCodeFirst !== 'A') {
        this.data.push(studentTel);
      }
    }
    if (this.data.length % 3 !== 0) {
      let remainingCell = 3 - (this.data.length % 3);
      for (let i = 0; i < remainingCell; i++) {
        this.data.push('');
      }
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
      return value ? value : item.label ? '-' : '';
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
  width: 100px;
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
  padding: 0 20px;
  color: #343c58;
  font-weight: 400;
}
</style>
