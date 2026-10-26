<template>
  <fragment>
    <div class="flex_wrap_gap_container">
      <check-toggle v-if="['A', 'C'].includes(districtCodeFirst)" v-model="form.completeEduDate" status="completeEduDate" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.studentToHospital" status="studentToHospital2" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.userToStudent" status="userToStudent" @input="updateData" class="mr15"></check-toggle>
      <template v-if="districtCodeFirst === 'C'">
        <check-toggle v-model="form.userSnsType" status="userSnsType" @input="updateData" class="mr15"></check-toggle>
      </template>
      <check-toggle v-if="divJoin('S')" v-model="form.businessDivision" status="businessDivisionSpc" @input="updateData"></check-toggle>
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
      <v-input v-model="form.hospitalName" title="병원 검색" placeholder="병원명" @input="updateData" @enter="enter"></v-input>
    </div>
    <div class="flex_container mt20">
      <v-input v-if="userOrganTargetType === 'CT'" v-model="form.schoolName" title="학생 검색" placeholder="학교명을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <v-select v-else v-model="form.schoolId" title="학생" size="wid180" type="school" message="학교" @input="updateData"></v-select>
      <div class="put__set mt10">
        <div class="m__putbox d_inblock wid_100"><input v-model="form.studentToSchoolGrade1" type="number" class="comm_put" placeholder="학년" @input="updateData" @keyup.enter="enter" /></div>
        <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade2" type="text" class="comm_put" placeholder="반" @input="updateData" @keyup.enter="enter" /></div>
        <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade3" type="number" class="comm_put" placeholder="번호" @input="updateData" @keyup.enter="enter" /></div>
      </div>
      <v-input v-model="form.studentName" placeholder="학생 이름을 검색해주세요." @input="updateData" @enter="enter"></v-input>
    </div>
  </fragment>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import Input from '@/components/common/search/Input.vue';
import CheckToggle from '@/components/common/search/CheckToggle';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-select': Select,
    'v-input': Input,
    CheckToggle,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'districtCode']),
    ...mapState('status', ['schoolTypeEach']),
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
