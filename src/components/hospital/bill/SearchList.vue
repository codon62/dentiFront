<template>
  <fragment>
    <div v-if="districtCodeFirst !== 'G'" class="flex_wrap_gap_container mb20">
      <v-select v-model="form.claimMonth" title="월별" message="전체" size="wid180" :option-data="month" @input="updateData" class="ml0"></v-select>
      <v-input v-if="divJoin('C')" v-model="form.centerName" title="시설(센터)" placeholder="센터명을 검색해주세요." @input="updateData" @enter="enter" class="ml0"></v-input>
      <check-toggle v-if="districtCodeFirst === 'A'" v-model="form.businessDivision" status="businessDivision" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-else-if="districtCodeFirst === 'D'" class="mr15" v-model="form.businessDivision" status="businessDivisionNotE" @input="updateData"></check-toggle>
      <check-toggle v-else-if="divJoin('S')" v-model="form.businessDivision" status="businessDivisionSpc" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.billStatus" status="billStatusWithReject" @input="updateData"></check-toggle>
    </div>
    <div class="flex_container">
      <v-district v-model="form.district" :clear="clear" :school="districtCodeFirst === 'G' ? '학교' : '학생'" @input="updateData"></v-district>
      <template v-if="districtCodeFirst !== 'G'">
        <div class="put__set mt10">
          <div class="m__putbox d_inblock wid_100"><input v-model="form.studentToSchoolGrade1" type="number" class="comm_put" placeholder="학년" @input="updateData" @keyup.enter="enter" /></div>
          <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade2" type="text" class="comm_put" placeholder="반" @input="updateData" @keyup.enter="enter" /></div>
          <div class="m__putbox d_inblock wid_100 ml5"><input v-model="form.studentToSchoolGrade3" type="number" class="comm_put" placeholder="번호" @input="updateData" @keyup.enter="enter" /></div>
        </div>
        <v-input v-model="form.studentName" placeholder="학생 이름을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      </template>
      <check-toggle v-else v-model="form.billStatus" status="billStatusExReject" @input="updateData"></check-toggle>
    </div>
  </fragment>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import District from '@/components/common/search/District.vue';
import Input from '@/components/common/search/Input.vue';
import { mapGetters, mapState } from 'vuex';
import CheckToggle from '@/components/common/search/CheckToggle';

export default {
  components: {
    CheckToggle,
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
    ...mapState('user', ['districtCode']),
    ...mapState('status', ['month']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin']),
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
