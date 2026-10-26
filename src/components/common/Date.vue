<template>
  <fragment>
    <div v-if="search" :class="className">
      <p v-if="title" class="commp fwb">{{ title }}</p>
      <div class="put__set mt10">
        <div class="m__putbox date__box mt10" :style="disabled ? 'width: 215px;' : null">
          <span class="date_put"><input v-model="year" type="number" class="comm_put" placeholder="년" readonly /></span>
          <span class="blit">/</span>
          <span class="date_put"><input v-model="month" type="number" class="comm_put" placeholder="월" readonly /></span>
          <span class="blit">/</span>
          <span class="date_put"><input v-model="day" type="number" class="comm_put" placeholder="일" readonly /></span>
          <date-pick v-if="!disabled" v-model="date" class="icon inner--right d_block mt5" :weekdays="weekdays" :months="months" :isDateDisabled="isDateDisabled">
            <template v-slot:default="{ toggle }">
              <a v-if="disabled" href="javascript:;"><img src="@/assets/images/common/bt_calen.png" /></a>
              <a v-else href="javascript:;" @click="toggle"><img src="@/assets/images/common/bt_calen.png" /></a>
            </template>
          </date-pick>
        </div>
      </div>
    </div>
    <template v-else>
      <div v-if="redesign" class="date_box_wrap mt10" :class="{ read_only: disabled }" :style="disabled ? '' : 'padding-right: 20px;'">
        <span class="date_box">
          <input v-model="year" type="number" class="date_input_box" :class="{ read_only: disabled }" placeholder="년" readonly />
        </span>
        <span class="blit">/</span>
        <span class="date_box">
          <input v-model="month" type="number" class="date_input_box" :class="{ read_only: disabled }" placeholder="월" readonly />
        </span>
        <span class="blit">/</span>
        <span class="date_box">
          <input v-model="day" type="number" class="date_input_box" :class="{ read_only: disabled }" placeholder="일" readonly />
        </span>
        <date-pick v-if="!disabled" v-model="date" class="icon d_block mt5" :weekdays="weekdays" :months="months" :isDateDisabled="isDateDisabled" style="margin-left: 0; right: 5px; top: -1px">
          <template v-slot:default="{ toggle }">
            <a v-if="disabled" href="javascript:;"><img src="@/assets/images/common/bt_calen.png" /></a>
            <a v-else href="javascript:;" @click="toggle"><img src="@/assets/images/common/bt_calen.png" /></a>
          </template>
        </date-pick>
      </div>
      <div v-else class="m__putbox date__box mt10" :class="{ read_eb: disabled }" :style="disabled ? 'background-color: #ebebeb; width: 215px;' : null">
        <span class="date_put">
          <input v-model="year" type="number" class="comm_put" :class="{ read_eb: disabled }" :style="disabled ? 'background-color: #ebebeb;' : null" placeholder="년" readonly />
        </span>
        <span class="blit">/</span>
        <span class="date_put">
          <input v-model="month" type="number" class="comm_put" :class="{ read_eb: disabled }" :style="disabled ? 'background-color: #ebebeb;' : null" placeholder="월" readonly />
        </span>
        <span class="blit">/</span>
        <span class="date_put">
          <input v-model="day" type="number" class="comm_put" :class="{ read_eb: disabled }" :style="disabled ? 'background-color: #ebebeb;' : null" placeholder="일" readonly />
        </span>
        <date-pick v-if="!disabled" v-model="date" class="icon inner--right d_block mt5" :weekdays="weekdays" :months="months" :isDateDisabled="isDateDisabled">
          <template v-slot:default="{ toggle }">
            <a v-if="disabled" href="javascript:;"><img src="@/assets/images/common/bt_calen.png" /></a>
            <a v-else href="javascript:;" @click="toggle"><img src="@/assets/images/common/bt_calen.png" /></a>
          </template>
        </date-pick>
      </div>
    </template>
  </fragment>
</template>

<script>
import DatePick from 'vue-date-pick';
import 'vue-date-pick/dist/vueDatePick.css';

export default {
  components: { DatePick },
  props: ['search', 'title', 'data', 'customDisabled', 'disabled', 'clear', 'redesign', 'className'],
  data() {
    return {
      weekdays: ['월', '화', '수', '목', '금', '토', '일'],
      months: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      date: '',
      year: '',
      month: '',
      day: '',
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
      if (this.date) {
        const date = this.date.split('-');
        this.year = date[0];
        this.month = date[1];
        this.day = date[2];
      } else {
        this.date = '';
        this.year = '';
        this.month = '';
        this.day = '';
      }
      this.$emit('input', this.date);
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
      return this.isFutureDate(date) || this.isDateCustomDisabled(date);
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
