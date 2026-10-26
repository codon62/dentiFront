<template>
  <div class="new_date_box_wrap">
    <span class="date_box">{{ year }}</span>
    <span class="blit">-</span>
    <span class="date_box">{{ month }}</span>
    <span class="blit">-</span>
    <span class="date_box">{{ day }}</span>
    <date-pick v-if="!disabled" v-model="date" class="icon d_block mt5" :weekdays="weekdays" :months="months" :isDateDisabled="isDateDisabled" style="margin-left: 0; right: 5px; top: -1px">
      <template v-slot:default="{ toggle }">
        <a class="calendar_button" href="javascript:;" @click="toggle"><img src="@/assets/images/common/ic-calendar-34-enabled.png" /></a>
      </template>
    </date-pick>
  </div>
</template>

<script>
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';
export default {
  name: 'DateInput',
  components: { DatePick },
  props: ['search', 'title', 'data', 'customEnabled', 'customDisabled', 'disabled', 'clear', 'redesign'],
  data() {
    return {
      weekdays: ['월', '화', '수', '목', '금', '토', '일'],
      months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      date: '',
      year: '년',
      month: '월',
      day: '일',
    };
  },
  watch: {
    date() {
      this.dateChange();
    },
    data() {
      this.getDate();
    },
    clear() {
      this.date = '';
    },
  },
  created() {
    if (this.data) {
      this.getDate();
    }
  },
  methods: {
    getDate() {
      this.date = this.isDateDisabled(new Date(this.data)) ? '' : this.data;
    },
    dateChange() {
      this.$emit('input', this.date);
      if (!this.date) return;
      const date = this.date.split('-');
      this.year = date[0];
      this.month = date[1];
      this.day = date[2];
    },
    isFutureDate(date) {
      const currentDate = new Date();
      return date > currentDate;
    },
    isDateCustomDisabled(date) {
      if (!this.customDisabled) {
        return false;
      }
      let startDate = this.customDisabled[0] ? new Date(this.customDisabled[0]) : null;
      let endDate = new Date(this.customDisabled[1]);
      if (startDate) startDate.setDate(startDate.getDate() - 1);
      return (!startDate || date > startDate) && date < endDate;
    },
    isDateDisabled(date) {
      if (!this.customEnabled) {
        return this.isFutureDate(date) || this.isDateCustomDisabled(date);
      } else {
        let startDate = new Date(this.customEnabled[0]);
        startDate.setDate(startDate.getDate() - 1);
        return date < startDate || date > new Date(this.customEnabled[1]);
      }
    },
  },
};
</script>

<style scoped>
.vdpComponent {
  position: absolute;
  margin-left: 228px;
}
</style>
