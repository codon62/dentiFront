<template>
  <fragment>
    <p class="fwb commp2">판정 치과의사</p>
    <div class="flex_set mt10 border__all">
      <div class="flex_item flex_item_1">
        <p class="commp fwb c_black border__all border__side border__except_left">치과의사명</p>
        <p class="commp fwn">{{ data2.value }}</p>
      </div>
      <div class="flex_item flex_item_1">
        <p class="commp fwb c_black border__all border__side">면허번호</p>
        <p class="commp fwn">{{ data3.value }}</p>
      </div>
    </div>
    <p class="fwb commp2 mt20">검진일 및 검진기관</p>
    <div class="flex_set mt10 border__all">
      <div class="flex_item flex_item_1">
        <p class="commp fwb c_black border__all border__side border__except_left">검진일</p>
        <p class="commp fwn">{{ data4.value }}</p>
      </div>
      <div class="flex_item flex_item_1">
        <p class="commp fwb c_black border__all border__side">검진기관명</p>
        <div class="commp fwn">
          <div class="hpt-text">{{ data5.value }}</div>
        </div>
      </div>
      <div class="flex_item flex_item_1">
        <p class="commp fwb c_black border__all border__side">병원 전화번호</p>
        <p class="commp fwn">{{ notificationSubData.hospitalTel }}</p>
      </div>
    </div>
  </fragment>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DoctorInfoBill',
  props: ['dataArray'],
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
    ...mapState('doc', ['formContents', 'notificationSubData']),
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

<style scoped>
.border__all {
  border: 1px solid #e6e6e6;
}
.border__side {
  border-width: 0 1px;
}
.border__except_left {
  border-left-width: 0;
}
.flex_set {
  flex-wrap: nowrap;
}
.flex_item {
  display: flex;
}
.flex_item_1 {
  flex-basis: 33%;
}
.flex_item_2 {
  flex-basis: 66%;
}
.flex_item > p {
  line-height: 40px;
  padding: 0 20px;
  flex-shrink: 0;
}
.flex_item > div {
  display: table;
  padding: 0 20px;
  flex-shrink: 0;
}
.hpt-text {
  display: table-cell;
  vertical-align: middle;
  max-width: 110px !important;
}
</style>
