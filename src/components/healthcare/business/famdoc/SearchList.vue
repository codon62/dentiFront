<template>
  <fragment>
    <div class="flex_wrap_gap_container">
      <check-toggle v-model="form.que" :status="this.districtCodeFirst === 'I' ? 'queIView' : 'queView'" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.not" :status="this.districtCodeFirst === 'I' ? 'notIView' : 'notView'" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.bill" status="billView" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="['A', 'C'].includes(districtCodeFirst)" v-model="form.completeEduDate" status="completeEduDate" @input="updateData"></check-toggle>
    </div>
    <div class="flex_container mt20">
      <v-select
        v-if="districtCodeFirst === 'C'"
        v-model="form.schoolType"
        title="학교 구분"
        each="schoolType"
        size="wid180"
        :option-data="schoolTypeEach"
        message="전체"
        @input="updateData"
      ></v-select>
      <v-select v-model="form.dateType" title="기간별" size="wid180" :option-data="districtCodeFirst === 'I' ? dateTypeI : dateType" message="기간 유형" @input="updateData"></v-select>
      <date v-model="form.startDate" :search="true" :clear="clear" :data="form.startDate" @input="updateData" />
      <div class="lcommp" style="margin: 0 10px; color: #cccccc">-</div>
      <date v-model="form.endDate" :search="true" :clear="clear" :data="form.endDate" @input="updateData" className="mr15" />
      <v-select v-if="districtCodeFirst === 'C'" v-model="form.hospitalType" title="병원 구분" size="wid180" :option-data="hospitalTypeList" message="전체" @input="updateData"></v-select>
      <v-input v-model="form.hospitalName" title="병원 검색" placeholder="병원명을 검색해주세요." @input="updateData" @enter="enter"></v-input>
    </div>
    <div class="flex_container mt20">
      <v-district v-if="userOrganTargetType === 'CT'" v-model="form.district" :clear="clear" :code="true" @input="updateData"></v-district>
      <v-select v-else-if="secondHelList.length" v-model="form.districtCode" title="지역구" message="전체" size="wid180" :option-data="secondHelList" @input="updateData"></v-select>
      <v-input v-if="userOrganTargetType === 'CT'" v-model="form.schoolName" title="학생 검색" placeholder="학교명을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <v-select v-else v-model="form.schoolId" title="학생" size="wid180" type="school" message="학교" @input="updateData"></v-select>
      <div class="put__set mt10">
        <div class="m__putbox d_inblock wid_100"><input v-model="form.studentToSchoolGrade1" type="number" class="comm_put" placeholder="학년" @input="updateData" @keyup.enter="enter" /></div>
        <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade2" type="text" class="comm_put" placeholder="반" @input="updateData" @keyup.enter="enter" /></div>
        <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade3" type="number" class="comm_put" placeholder="번호" @input="updateData" @keyup.enter="enter" /></div>
      </div>
      <v-input v-model="form.studentName" placeholder="학생 이름을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <div class="item">
        <check-toggle v-model="form.studentCheck" status="studentCheck" @input="updateData"></check-toggle>
      </div>
    </div>
  </fragment>
</template>

<script>
import Common from '@/apis/Common';
import Date from '@/components/common/Date.vue';
import Select from '@/components/common/search/Select.vue';
import District from '@/components/common/search/District.vue';
import Input from '@/components/common/search/Input.vue';
import CheckToggle from '@/components/common/search/CheckToggle';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-select': Select,
    'v-district': District,
    'v-input': Input,
    Date,
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
    ...mapState('user', ['userOrganTargetType', 'districtCode']),
    ...mapState('status', ['dateType', 'dateTypeI', 'schoolTypeEach']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode']),
    hospitalTypeList() {
      return [
        { id: this.valueToCode('C0016', 'N'), name: '치과 의료기관' },
        { id: this.valueToCode('C0016', 'T'), name: '특수학교 이동진료' },
      ];
    },
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
