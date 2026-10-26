<template>
  <fragment>
    <div class="flex_wrap_gap_container">
      <check-toggle v-if="['A', 'C'].includes(districtCodeFirst)" v-model="form.eduStatus" status="eduStatus" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.iaf" status="iafView" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.que" status="queViewNY" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.not" status="notViewNY" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.treatStatus" :status="districtCodeFirst === 'A' ? 'treatStatus' : 'treatStatus2'" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="districtCodeFirst === 'A'" v-model="form.stm" status="stmViewNY" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="districtCodeFirst === 'A'" v-model="form.screenStatus" status="screenStatus" @input="updateData"></check-toggle>
    </div>
    <div class="flex_container mt20">
      <v-input v-model="form.hospitalName" title="병원 검색" placeholder="병원명" @input="updateData" @enter="enter"></v-input>
      <v-input v-model="form.treatmentHospitalName" title="진료 의뢰 병원 검색" placeholder="진료 의뢰 병원명" @input="updateData" @enter="enter"></v-input>
      <v-input v-model="form.studentBirth" title="아동 검색" :type="'number'" placeholder="생년월일" @input="updateData" @enter="enter"></v-input>
      <v-input v-model="form.studentName" placeholder="아동명" @input="updateData" @enter="enter" class="ml0"></v-input>
    </div>
  </fragment>
</template>

<script>
import Input from '@/components/common/search/Input.vue';
import CheckToggle from '@/components/common/search/CheckToggle';
import { mapGetters } from 'vuex';

export default {
  components: {
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
