<template>
  <fragment>
    <div class="flex_wrap_gap_container">
      <v-select class="ml0mr15" v-model="form.treatMonth" :title="`${examTitle}월`" message="전체" :option-data="month" size="wid180" @input="updateData"></v-select>
      <check-toggle v-if="divJoin('S')" v-model="form.businessDivision" status="businessDivisionRadio" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="['A', 'C'].includes(districtCodeFirst)" v-model="form.eduStatus" status="eduStatus" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.questionnaire" :status="districtCodeFirst === 'I' ? 'schoolQuestionnaireI' : 'schoolQuestionnaire'" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.notification" :status="districtCodeFirst === 'I' ? 'schoolNotificationI' : 'schoolNotification'" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.screenStatus" :status="districtCodeFirst === 'I' ? 'screenStatusI' : 'screenStatus'" @input="updateData" class="mr15"></check-toggle>
      <check-toggle
        v-model="form.studentBusinessNotTreatReason"
        :status="districtCodeFirst === 'I' ? 'studentBusinessNotTreatReasonI' : 'studentBusinessNotTreatReason'"
        @input="updateData"
      ></check-toggle>
    </div>
    <div class="flex_container mt20">
      <v-select v-if="districtCodeFirst === 'C'" v-model="form.hospitalType" title="병원 구분" size="wid180" :option-data="hospitalTypeList" message="전체" @input="updateData"></v-select>
      <v-input v-model="form.hospitalName" title="병원 검색" placeholder="병원명을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <div class="ml15">
        <p class="commp fwb">학생 검색</p>
        <div class="put__set mt10">
          <div class="m__putbox d_inblock wid_100"><input v-model="form.studentToSchoolGrade1" type="number" class="comm_put" placeholder="학년" @input="updateData" @keyup.enter="enter" /></div>
          <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade2" type="text" class="comm_put" placeholder="반" @input="updateData" @keyup.enter="enter" /></div>
          <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade3" type="number" class="comm_put" placeholder="번호" @input="updateData" @keyup.enter="enter" /></div>
        </div>
      </div>
      <v-input v-model="form.studentName" placeholder="학생 이름을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <div v-if="districtCodeFirst === 'J'" class="item">
        <check-toggle v-model="form.studentCheck" status="studentCheck" @input="updateData"></check-toggle>
      </div>
      <div class="item">
        <check-toggle v-model="form.userToStudent" status="userToStudent2" @input="updateData"></check-toggle>
      </div>
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
    ...mapState('user', ['districtCode']),
    ...mapState('status', ['month']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'examTitle']),
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
