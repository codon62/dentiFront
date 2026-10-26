<template>
  <div class="flex_container">
    <v-select v-model="form.inquiryCategoryCode" title="카테고리" message="전체" size="wid180" :option-data="inquiryCategoryList" @input="updateData"></v-select>
    <v-input v-model="form.inquiryQuestionSubject" title="제목" placeholder="제목을 입력해 주세요." @input="updateData" @enter="enter"></v-input>
  </div>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import Input from '@/components/common/search/Input.vue';
import Board from '@/apis/Board';

export default {
  components: {
    'v-select': Select,
    'v-input': Input,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
      inquiryCategoryList: [],
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
    Board.inquiryCategoryList().then(res => {
      if (res && res.data.rt === 200) {
        this.inquiryCategoryList = res.data.inquiryCategoryList.map(item => {
          return { id: item.inquiryCategoryCode, name: item.inquiryCategoryName };
        });
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
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
