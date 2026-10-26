<template>
  <div class="flex_wrap_gap_container">
    <check-toggle v-if="districtCodeFirst === 'C'" v-model="form.userSnsType" status="userSnsType" @input="updateData" class="mr15"></check-toggle>
    <v-input v-model="form.userEmail" title="이메일 검색" placeholder="이메일" @input="updateData" @enter="enter" :class="{ ml0: districtCodeFirst !== 'C' }"></v-input>
    <check-toggle v-model="form.appInfoType" status="appInfoType" @input="updateData"></check-toggle>
  </div>
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
