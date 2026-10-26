<template>
  <div class="flex_container">
    <v-select v-model="form.faqCategory" title="카테고리" message="전체" size="wid180" :option-data="faqCategoryList" @input="updateData"></v-select>
    <v-input v-model="form.faqSubject" title="제목" placeholder="제목을 입력해 주세요." @input="updateData" @enter="enter"></v-input>
  </div>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import Input from '@/components/common/search/Input.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-select': Select,
    'v-input': Input,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
      faqCategoryList: [],
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapState('status', ['faqCategory']),
    ...mapGetters('business', ['divJoin']),
    ...mapGetters('definedCode', ['valueToCode']),
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
    this.faqCategoryList = Object.entries(this.faqCategory)
      .filter(([key]) => [this.userOrganTargetType, 'ST'].includes(key) || (['HC', 'CT'].includes(this.userOrganTargetType) && (this.divJoin('C') || key !== 'CE')))
      .map(([key, value]) => {
        return {
          id: this.valueToCode('C0006', key),
          name: value,
        };
      });
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
