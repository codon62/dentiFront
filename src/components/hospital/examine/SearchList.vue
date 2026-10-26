<template>
  <fragment>
    <div class="flex_wrap_gap_container">
      <check-toggle v-model="form.questionnaire" status="questionnaire" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.notification" status="notification" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.bill" status="bill" @input="updateData"></check-toggle>
    </div>
    <div class="flex_container mt20">
      <v-district v-model="form.district" :clear="clear" school="학생" businessDivision="E" @input="updateData"></v-district>
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
import District from '@/components/common/search/District.vue';
import Input from '@/components/common/search/Input.vue';
import CheckToggle from '@/components/common/search/CheckToggle';
import { mapState } from 'vuex';

export default {
  components: {
    'v-district': District,
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
