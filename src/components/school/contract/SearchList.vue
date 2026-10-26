<template>
  <div class="flex_container">
    <v-select v-model="form.healthCareCode" title="보건소" message="전체" type="healthcareBusinessCode" div="E" @input="updateData"></v-select>
    <v-input v-model="form.hospitalName" title="병원 검색" placeholder="병원명을 검색해주세요." @input="updateData" @enter="enter"></v-input>
    <check-toggle v-model="form.contractStatus" status="contractStatus" @input="updateData" class="ml15"></check-toggle>
  </div>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import Input from '@/components/common/search/Input.vue';
import CheckToggle from '@/components/common/search/CheckToggle';
import { mapState } from 'vuex';

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
