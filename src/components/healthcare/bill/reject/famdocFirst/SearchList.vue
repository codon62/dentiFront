<template>
  <fragment>
    <div class="flex_container">
      <v-district v-if="userOrganTargetType === 'CT'" v-model="form.district" :clear="clear" :code="true" @input="updateData"></v-district>
      <v-input v-model="form.hospitalName" title="병원 검색" placeholder="병원명" @input="updateData" @enter="enter"></v-input>
    </div>
    <div class="flex_container mt20">
      <v-select v-model="form.schoolId" title="학생" size="wid180" type="school" message="학교" @input="updateData"></v-select>
      <div class="put__set mt10">
        <div class="m__putbox d_inblock wid_100"><input v-model="form.studentToSchoolGrade2" type="text" class="comm_put" placeholder="반" @input="updateData" @keyup.enter="enter" /></div>
        <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade3" type="number" class="comm_put" placeholder="번호" @input="updateData" @keyup.enter="enter" /></div>
      </div>
      <v-input v-model="form.studentName" placeholder="학생 이름을 검색해주세요." @input="updateData" @enter="enter"></v-input>
    </div>
  </fragment>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import District from '@/components/common/search/District.vue';
import Input from '@/components/common/search/Input.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-select': Select,
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
