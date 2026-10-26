<template>
  <fragment>
    <div v-if="districtCodeFirst !== 'G'" class="flex_wrap_gap_container mb20">
      <v-select class="ml0mr15" v-model="form.claimMonth" title="검진월" message="전체" :option-data="month" @input="updateData"></v-select>
      <check-toggle v-model="form.bill" status="billStatusExReject" @input="updateData"></check-toggle>
    </div>
    <div class="flex_container">
      <v-select v-model="form.hospitalId" title="병원" type="hospital" size="wid180" message="전체" businessDivision="E" @input="updateData"></v-select>
      <template v-if="districtCodeFirst !== 'G'">
        <div class="ml15">
          <p class="commp fwb">학생 검색</p>
          <div class="put__set mt10">
            <div class="m__putbox d_inblock wid_100"><input v-model="form.studentToSchoolGrade1" type="number" class="comm_put" placeholder="학년" @input="updateData" @keyup.enter="enter" /></div>
            <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade2" type="text" class="comm_put" placeholder="반" @input="updateData" @keyup.enter="enter" /></div>
            <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade3" type="number" class="comm_put" placeholder="번호" @input="updateData" @keyup.enter="enter" /></div>
          </div>
        </div>
        <v-input v-model="form.studentName" placeholder="학생 이름을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      </template>
      <check-toggle v-else v-model="form.bill" status="billStatusExReject" @input="updateData"></check-toggle>
    </div>
  </fragment>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import CheckToggle from '@/components/common/search/CheckToggle';
import Input from '@/components/common/search/Input.vue';
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
