<template>
  <fragment>
    <div class="flex_wrap_gap_container">
      <check-toggle v-model="form.que" status="queView" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.not" status="notView" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="districtCodeFirst === 'A'" v-model="form.ttr" status="ttrView" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="districtCodeFirst === 'A'" v-model="form.ttp" status="ttpView" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.stm" status="stmView" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.bill" status="billView" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="['A', 'C'].includes(districtCodeFirst)" v-model="form.completeEduDate" status="completeEduDate" @input="updateData"></check-toggle>
    </div>
    <div class="flex_container mt20">
      <v-select
        v-if="userOrganTargetType === 'CT'"
        v-model="form.districtCode"
        :title="districtCodeFirst === 'C' ? '시군' : '보건소'"
        size="wid180"
        message="전체"
        type="healthcareCode"
        @input="updateData"
      ></v-select>
      <v-select v-model="form.dateType" title="기간별" size="wid180" :option-data="dateTypeC" message="기간 유형" @input="updateData"></v-select>
      <date v-model="form.startDate" :search="true" :clear="clear" :data="form.startDate" @input="updateData" />
      <div class="lcommp" style="margin: 0 10px; color: #cccccc">-</div>
      <date v-model="form.endDate" :search="true" :clear="clear" :data="form.endDate" @input="updateData" />
    </div>
    <div class="flex_container mt20">
      <v-input v-model="form.hospitalName" title="병원 검색" placeholder="병원명을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <v-input
        v-if="districtCodeFirst === 'A'"
        v-model="form.treatmentHospitalName"
        title="진료 의뢰 병원 검색"
        placeholder="진료 의뢰 병원을 검색해주세요."
        @input="updateData"
        @enter="enter"
      ></v-input>
      <v-input v-model="form.centerName" title="시설(센터) 검색" placeholder="센터명을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <v-input v-model="form.studentName" title="학생 검색" placeholder="학생 이름을 검색해주세요." @input="updateData" @enter="enter"></v-input>
      <check-toggle v-model="form.studentCheck" status="studentCheck" @input="updateData" class="ml15"></check-toggle>
    </div>
  </fragment>
</template>

<script>
import Date from '@/components/common/Date.vue';
import Select from '@/components/common/search/Select.vue';
import CheckToggle from '@/components/common/search/CheckToggle';
import Input from '@/components/common/search/Input.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-select': Select,
    'v-input': Input,
    Date,
    CheckToggle,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapState('status', ['dateTypeC']),
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
