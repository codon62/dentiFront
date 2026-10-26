<template>
  <div class="flex_container">
    <v-input v-model="form.subjectOrAdminOrganName" title="제목 또는 작성자" placeholder="제목 또는 작성자를 입력해 주세요." @input="updateData" @enter="enter"></v-input>
  </div>
</template>

<script>
import Input from '@/components/common/search/Input.vue';

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
