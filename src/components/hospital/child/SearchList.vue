<template>
  <fragment>
    <div class="flex_wrap_gap_container">
      <check-toggle v-model="form.questionnaire" status="questionnaire" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.notificationC" status="notificationC" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="districtCodeFirst === 'A'" v-model="form.ttr" :status="hospitalType === 'H' ? 'ttr' : 'ttrView'" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="districtCodeFirst === 'A'" v-model="form.ttp" status="ttp" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.stm" status="stm" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.bill" status="bill" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="['A', 'C'].includes(districtCodeFirst)" v-model="form.eduStatus" status="eduStatus" @input="updateData" class="mr15"></check-toggle>
    </div>
    <div class="flex_container mt20">
      <v-input v-model="form.studentName" title="학생 검색" placeholder="학생 이름을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <v-input v-model="form.centerName" title="시설(센터)" placeholder="센터명을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <v-input v-if="hospitalType === 'H'" v-model="form.treatmentHospitalName" title="진료 의뢰 병원 검색" placeholder="진료 의뢰 병원을 검색해주세요." @input="updateData" @enter="enter"></v-input>
    </div>
  </fragment>
</template>

<script>
import Input from '@/components/common/search/Input.vue';
import CheckToggle from '@/components/common/search/CheckToggle';
import { mapGetters, mapState } from 'vuex';

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
    ...mapState('user', ['hospitalType']),
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
