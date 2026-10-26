<template>
  <fragment>
    <div class="flex_container">
      <v-select v-if="userOrganTargetType === 'CT'" v-model="form.districtCode" title="보건소" size="wid180" message="전체" type="healthcareCode" @input="updateData"></v-select>
      <v-input v-model="form.centerName" title="시설(센터)명 검색" placeholder="시설(센터)명을 입력해주세요." @input="updateData" @enter="enter"></v-input>
    </div>
  </fragment>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import Input from '@/components/common/search/Input.vue';
import { mapState } from 'vuex';

export default {
  components: {
    'v-select': Select,
    'v-input': Input,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType']),
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
