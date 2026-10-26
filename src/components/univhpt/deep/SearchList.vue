<template>
  <fragment>
    <div class="flex_wrap_gap_container">
      <v-input class="ml0mr15" v-model="form.centerName" title="시설(센터)명 검색" placeholder="시설(센터)명" @input="updateData" @enter="enter"></v-input>
      <v-input class="ml0mr15" v-model="form.studentName" title="아동 검색" placeholder="아동명" @input="updateData" @enter="enter"></v-input>
      <check-toggle v-model="form.intensiveNotificationStatus" status="intensiveNotificationStatus" @input="updateData"></check-toggle>
    </div>
    <div class="flex_container mt20">
      <v-select class="ml15" v-model="form.dateType" title="기간별" size="wid180" :option-data="intensiveRequestDateType" message="기간 유형" @input="updateData"></v-select>
      <date v-model="form.startDate" :search="true" :clear="clear" :data="form.startDate" @input="updateData" />
      <div class="lcommp" style="margin: 0 10px; color: #cccccc">-</div>
      <date v-model="form.endDate" :search="true" :clear="clear" :data="form.endDate" @input="updateData" />
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
