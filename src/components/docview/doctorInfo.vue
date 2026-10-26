<template>
  <fragment>
    <div class="row flex_set">
      <div class="flex_item">
        <p class="fwb commp2">판정 치과의사</p>
        <p class="scommp c_gray2 fwn mt10">치과의사명</p>
        <!-- pdf 적용 위해 style 태그 필요 -->
        <div class="m__putbox mt10 wid170">
          <div class="input_box_view">{{ data2.value }}</div>
        </div>
      </div>
      <div class="flex_item ml20">
        <p class="scommp c_gray2 fwn">면허번호</p>
        <div class="m__putbox mt10 wid170">
          <div class="input_box_view">{{ data3.value }}</div>
        </div>
      </div>
      <div class="flex_item ml40">
        <p class="fwb commp2">{{ subject }}일 및 {{ subject }}기관</p>
        <p class="scommp c_gray2 fwn mt10">{{ subject }}일</p>
        <div class="m__putbox mt10 wid170">
          <div class="input_box_view">{{ data4.value }}</div>
        </div>
      </div>
      <div class="flex_item ml20">
        <p class="scommp c_gray2 fwn">{{ subject }}기관명</p>
        <div class="m__putbox mt10 wid170">
          <div class="input_box_view">{{ data5.value }}</div>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: ['dataArray', 'subject'],
  data() {
    return {
      date: '',
      data1: '',
      data2: '',
      data3: '',
      data4: '',
      data5: '',
    };
  },
  computed: {
    ...mapState('doc', ['formContents']),
  },
  created() {
    const prefix = this.dataArray.data1.split('_')[0];
    let type = '';
    if (prefix === 'n') {
      type = 'notification';
    } else if (prefix === 't') {
      type = 'treatmentPlan';
    } else if (prefix === 'tt') {
      type = 'treatmentRequest';
    } else if (prefix === 'tn') {
      type = 'intensiveNotification';
    } else {
      type = 'statement';
    }
    this.data1 = this.formContents[type][this.dataArray.data1];
    this.data2 = this.formContents[type][this.dataArray.data2];
    this.data3 = this.formContents[type][this.dataArray.data3];
    this.data4 = this.formContents[type][this.dataArray.data4];
    this.data5 = this.formContents[type][this.dataArray.data5];
  },
};
</script>
