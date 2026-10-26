<template>
  <fragment>
    <div v-if="!(districtCodeFirst === 'C' && userOrganTargetType !== 'CT')" class="item">
      <p class="commp fwb">{{ title }} 검색</p>
      <div class="put__set mt10">
        <div class="m__putbox" :class="size ? size : 'wid180'">
          <select v-model="healthCareCode" class="comm_select" @change="healthCareInput($event)">
            <option v-if="!notAll" value="">전체</option>
            <option v-for="item in healthCareList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="districtCodeFirst === 'C'" :class="{ ml0: userOrganTargetType === 'CT' }" class="item">
      <p v-if="userOrganTargetType !== 'CT'" class="commp fwb">지역구 검색</p>
      <div class="put__set mt10">
        <div class="m__putbox" :class="size ? size : 'wid180'">
          <select v-model="secondHealthCareCode" class="comm_select" @change="secondHealthCareInput($event)">
            <option value="">{{ userOrganTargetType === 'CT' ? '선택' : '전체' }}</option>
            <option v-for="item in secondHealthCareList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
          </select>
        </div>
      </div>
    </div>
    <div v-if="school" class="item">
      <p class="commp fwb">{{ school }} 검색</p>
      <div class="put__set mt10">
        <div class="m__putbox" :class="size ? size : 'wid180'">
          <select v-model="schoolId" class="comm_select" @change="schInput($event)">
            <option v-if="!notAll" value="">학교</option>
            <option v-for="item in schoolList" :key="item.schoolId" :value="item.schoolId">{{ item.schoolName }}</option>
          </select>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import Common from '@/apis/Common';
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['size', 'value', 'type', 'clear', 'school', 'code', 'notAll', 'businessDivision'],
  data() {
    return {
      form: {},
      healthCareCode: '',
      secondHealthCareCode: '',
      schoolId: '',
      healthCareList: [],
      secondHealthCareList: [],
      fullSecondHealthCareList: [],
      schoolList: [],
    };
  },
  computed: {
    ...mapState('user', ['districtCode', 'userOrganTargetId', 'userOrganTargetType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'healthCareTitle']),
    title() {
      return this.districtCodeFirst === 'C' ? this.healthCareTitle + '구' : this.healthCareTitle;
    },
  },
  watch: {
    clear() {
      if (!(this.districtCodeFirst === 'C' && this.userOrganTargetType === 'HC')) {
        this.healthCareCode = '';
        this.secondHealthCareList = [];
      }
      this.secondHealthCareCode = '';
      this.schoolId = '';
      this.schoolList = [];
      if (this.school) {
        this.getSchoolList(this.userOrganTargetType === 'HP' ? this.districtCodeFirst : this.districtCode);
      }
    },
  },
  async created() {
    Common.healthCareList({ districtCode: this.districtCodeFirst }).then(res => {
      if (res && res.data.rt === 200) {
        this.healthCareList = res.data.healthCareList;
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
    if (this.districtCodeFirst === 'C') {
      await Common.healthCareSecondList({ districtCode: this.districtCodeFirst }).then(res => {
        if (res && res.data.rt === 200) {
          this.fullSecondHealthCareList = res.data.healthCareList;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
    if (this.school) {
      this.getSchoolList(this.userOrganTargetType === 'HP' ? this.districtCodeFirst : this.districtCode);
    }
    if (this.code) {
      if (this.districtCodeFirst === 'C' && this.userOrganTargetType === 'HC') {
        this.healthCareCode = this.districtCode;
        this.healthCareSecondList();
      }
      if (this.$route.query.districtCode) {
        if (this.districtCodeFirst === 'C') {
          this.healthCareCode = this.$route.query.districtCode.substring(0, 3);
          this.healthCareSecondList();
          if (this.$route.query.districtCode.length !== 5) {
            if (this.school) {
              this.getSchoolList(this.healthCareCode);
            }
          } else {
            this.secondHealthCareCode = this.$route.query.districtCode;
            if (this.school) {
              this.getSchoolList(this.secondHealthCareCode);
            }
          }
        } else {
          this.healthCareCode = this.$route.query.districtCode;
          if (this.school) {
            this.getSchoolList(this.healthCareCode);
          }
        }
      }
    } else {
      if (this.$route.query.healthCareCode) {
        this.healthCareCode = this.$route.query.healthCareCode;
        if (this.school && !this.$route.query.secondHealthCareCode) {
          this.getSchoolList(this.healthCareCode);
        }
        if (this.districtCodeFirst === 'C') {
          this.healthCareSecondList();
        }
      }
      if (this.$route.query.secondHealthCareCode) {
        this.secondHealthCareCode = this.$route.query.secondHealthCareCode;
        if (this.school) {
          this.getSchoolList(this.secondHealthCareCode);
        }
      }
    }
    if (this.$route.query.schoolId) {
      this.schoolId = this.$route.query.schoolId;
    }
  },
  methods: {
    healthCareInput(e) {
      this.healthCareCode = e.target.value;
      let form = {};
      if (this.code) {
        form.districtCode = this.healthCareCode;
      } else {
        form.healthCareCode = this.healthCareCode;
        form.secondHealthCareCode = '';
      }
      if (this.school) {
        form.schoolId = '';
        if (this.healthCareCode !== '') {
          this.getSchoolList(this.healthCareCode);
        } else {
          this.getSchoolList(this.userOrganTargetType === 'HP' ? this.districtCodeFirst : this.districtCode);
        }
      }
      this.$emit('input', form);
      this.secondHealthCareCode = '';
      this.schoolId = '';
      if (this.districtCodeFirst === 'C') {
        if (this.healthCareCode !== '') {
          this.healthCareSecondList();
        } else {
          this.secondHealthCareList = [];
        }
      }
    },
    secondHealthCareInput(e) {
      this.secondHealthCareCode = e.target.value;
      let form = {};
      if (this.code) {
        form.districtCode = this.secondHealthCareCode ? this.secondHealthCareCode : this.healthCareCode;
      } else {
        form.healthCareCode = this.healthCareCode;
        form.secondHealthCareCode = this.secondHealthCareCode;
      }
      if (this.school) {
        form.schoolId = '';
        if (this.secondHealthCareCode !== '') {
          this.getSchoolList(this.secondHealthCareCode);
        } else {
          this.schoolList = [];
        }
      }
      this.$emit('input', form);
    },
    schInput(e) {
      this.schoolId = e.target.value;
      let form = {};
      if (this.code) {
        form.districtCode = this.secondHealthCareCode ? this.secondHealthCareCode : this.healthCareCode;
      } else {
        form.healthCareCode = this.healthCareCode;
        form.secondHealthCareCode = this.secondHealthCareCode;
      }
      form.schoolId = this.schoolId;
      this.$emit('input', form);
    },
    healthCareSecondList() {
      this.secondHealthCareList = this.fullSecondHealthCareList.filter(healthCare => healthCare.districtCode.startsWith(this.healthCareCode));
    },
    getSchoolList(districtCode) {
      let form = { districtCode };
      if (this.userOrganTargetType === 'HP' && ((this.businessDivision === 'E' && !this.divJoin('S')) || this.districtCodeFirst === 'G')) {
        form.hospitalId = this.userOrganTargetId;
      }
      Common.schoolList(form).then(res => {
        if (res && res.data.rt === 200) {
          this.schoolList = res.data.schoolList;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>
