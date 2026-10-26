<template>
  <fragment>
    <div class="flex_container">
      <v-input v-model="form.healthCareName" :title="healthCareTitle + ' 검색'" :placeholder="healthCareTitle" @input="updateData" @enter="enter"></v-input>
    </div>
  </fragment>
</template>

<script>
import Input from '@/components/common/search/Input.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    'v-input': Input,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
    };
  },
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['healthCareTitle']),
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
