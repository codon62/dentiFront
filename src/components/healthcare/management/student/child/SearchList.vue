<template>
  <fragment>
    <div class="flex_wrap_gap_container">
      <check-toggle v-if="['A', 'C'].includes(districtCodeFirst)" v-model="form.completeEduDate" status="completeEduDate" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.studentToHospital" :status="districtCodeFirst === 'A' ? 'studentToHospital' : 'studentToHospital2'" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.userToStudent" status="userToStudent" @input="updateData" class="mr15"></check-toggle>
      <template v-if="districtCodeFirst === 'C'">
        <check-toggle v-model="form.userSnsType" status="userSnsType" @input="updateData"></check-toggle>
      </template>
    </div>
    <div class="flex_container mt20">
      <v-select v-if="userOrganTargetType === 'CT'" v-model="form.districtCode" title="보건소" size="wid180" message="전체" type="healthcareCode" @input="updateData"></v-select>
      <v-input v-model="form.hospitalName" title="병원 검색" placeholder="병원명" @input="updateData" @enter="enter"></v-input>
      <v-input v-model="form.centerName" title="시설(센터)명 검색" placeholder="시설(센터)명" @input="updateData" @enter="enter"></v-input>
      <v-input v-model="form.studentName" title="아동 검색" placeholder="아동명" @input="updateData" @enter="enter"></v-input>
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
    ...mapState('user', ['userOrganTargetType']),
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
