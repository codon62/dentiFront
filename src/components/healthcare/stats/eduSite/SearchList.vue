<template>
  <div class="flex_container">
    <v-district v-if="userOrganTargetType === 'CT'" v-model="form.district" :clear="clear" :code="true" @input="updateData"></v-district>
    <v-input v-model="form.schoolName" title="학교 검색" placeholder="학교명을 검색해주세요." @input="updateData" @enter="enter"></v-input>
    <div class="item">
      <div class="put__set mt10">
        <div class="m__putbox d_inblock wid_100"><input v-model="form.studentToSchoolGrade1" type="number" class="comm_put" placeholder="학년" @input="updateData" @keyup.enter="enter" /></div>
        <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade2" type="text" class="comm_put" placeholder="반" @input="updateData" @keyup.enter="enter" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import District from '@/components/common/search/District.vue';
import Input from '@/components/common/search/Input.vue';
import { mapState } from 'vuex';

export default {
  components: {
    'v-district': District,
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
