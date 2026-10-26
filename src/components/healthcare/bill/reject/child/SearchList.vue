<template>
  <fragment>
    <div class="flex_container">
      <v-select
        v-if="userOrganTargetType === 'CT'"
        v-model="form.districtCode"
        :title="districtCodeFirst === 'C' ? '시군' : '보건소'"
        size="wid180"
        message="전체"
        type="healthcareCode"
        @input="updateData"
      ></v-select>
      <v-input v-model="form.hospitalName" title="병원 검색" placeholder="병원명을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <v-input v-model="form.centerName" title="시설(센터) 검색" placeholder="센터명을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <v-input v-model="form.studentName" title="학생 검색" placeholder="학생 이름을 검색해주세요." @input="updateData" @enter="enter"></v-input>
    </div>
  </fragment>
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
