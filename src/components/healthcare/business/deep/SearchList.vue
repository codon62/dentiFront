<template>
  <fragment>
    <div class="flex_container">
      <v-select v-model="form.dateType" title="기간별" size="wid180" :option-data="intensiveRequestDateType" message="기간 유형" @input="updateData"></v-select>
      <date v-model="form.startDate" :search="true" :clear="clear" :data="form.startDate" @input="updateData" />
      <div class="lcommp" style="margin: 0 10px; color: #cccccc">-</div>
      <date v-model="form.endDate" :search="true" :clear="clear" :data="form.endDate" @input="updateData" />
    </div>
    <div class="flex_wrap_gap_container mt20">
      <check-toggle v-model="form.intensiveRequestStatus" status="intensiveRequestStatus" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.intensiveNotificationStatus" status="intensiveNotificationStatusHc" @input="updateData"></check-toggle>
      <v-input v-model="form.centerName" title="시설(센터) 검색" placeholder="시설(센터)명" @input="updateData" @enter="enter"></v-input>
      <v-input v-model="form.studentName" title="학생 검색" placeholder="학생명" @input="updateData" @enter="enter" class="ml0"></v-input>
    </div>
  </fragment>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import Input from '@/components/common/search/Input.vue';
import Date from '@/components/common/Date.vue';
import { mapState } from 'vuex';
import CheckToggle from '@/components/common/search/CheckToggle';

export default {
  components: {
    CheckToggle,
    'v-select': Select,
    'v-input': Input,
    Date,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
    };
  },
  computed: {
    ...mapState('status', ['intensiveRequestDateType']),
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
