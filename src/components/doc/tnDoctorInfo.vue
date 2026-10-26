<template>
  <div class="flex_set">
    <div class="flex_item flex_size_m">
      <p class="fwb mt20 commp2">판정 치과의사</p>
      <p class="scommp c_gray2 fwn mt10">
        치과의사명
        <span class="c_red">*</span>
      </p>
      <div class="m__putbox mt10 wid250">
        <input
          type="text"
          class="comm_put"
          :value="formContents.intensiveNotification.tn_doctor.value"
          placeholder="치과의사명을 입력해 주세요."
          @input="TN_DATA_SET({ tn_doctor: $event.target.value })"
        />
      </div>
    </div>
    <div class="flex_item flex_size_m ml20">
      <p class="scommp c_gray2 fwn">
        면허번호
        <span class="c_red">*</span>
      </p>
      <div class="m__putbox mt10 wid250">
        <input
          type="text"
          class="comm_put"
          :value="formContents.intensiveNotification.tn_license.value"
          placeholder="면허번호를 입력해 주세요."
          @input="TN_DATA_SET({ tn_license: $event.target.value })"
        />
      </div>
    </div>
    <div class="flex_item ml60">
      <p class="fwb mt30 commp2">검진일 및 검진기관</p>
      <p class="scommp c_gray2 fwn mt10">
        검진일
        <span class="c_red">*</span>
      </p>
      <date v-model="date" :data="formContents.intensiveNotification.tn_date.value" />
    </div>
    <div class="flex_item flex_size_m4 ml20">
      <p class="scommp c_gray2 fwn">
        검진기관명
        <span class="c_red">*</span>
      </p>
      <div class="m__putbox mt10 wid250"><input type="text" class="comm_put read_put" :value="formContents.intensiveNotification.tn_organ.value" disabled /></div>
    </div>
  </div>
</template>

<script>
import Date from '@/components/common/Date.vue';
import { mapMutations, mapState } from 'vuex';

export default {
  components: { Date },
  data() {
    return {
      date: '',
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['userOrganTargetName']),
    ...mapState('doc', ['formContents']),
  },
  methods: {
    ...mapMutations('doc', ['TN_DATA_SET']),
    getToday() {
      const date = new window.Date();
      const yyyy = date.getFullYear();
      let dd = date.getDate();
      let mm = date.getMonth() + 1; // January is 0
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      const today = yyyy + '-' + mm + '-' + dd;
      return today;
    },
  },
  watch: {
    date() {
      this.TN_DATA_SET({ tn_date: this.date });
    },
    update() {
      this.TN_DATA_SET({ tn_organ: this.userOrganTargetName });
      if (!this.formContents.intensiveNotification.tn_date.value) {
        this.date = this.getToday();
      }
    },
  },
};
</script>

<style scoped></style>
