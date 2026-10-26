<template>
  <fragment>
    <p class="content_title">
      {{ title }}
      <i v-if="required" class="red_dot ml10"></i>
    </p>
    <div class="flex_box mt14">
      <div class="check_button">
        <input id="basicEduDate" type="checkbox" :checked="notificationSubData.basicEduDate === 'Y'" class="blind" disabled />
        <label for="basicEduDate">
          <span class="icon"></span>
          <span class="label_t">온라인 교육 이수</span>
        </label>
      </div>
    </div>
    <div class="flex_box mt14">
      <div class="check_button">
        <input :id="data1.id" type="checkbox" :checked="data1.value.length === data1.options.length" class="blind" @change="allCheck($event)" />
        <label :for="data1.id">
          <span class="icon"></span>
          <span class="label_t">전체</span>
        </label>
      </div>
      <div v-for="option in data1.options" :key="option.id" class="check_button ml14">
        <input
          :id="data1.id + '_' + option.id"
          type="checkbox"
          :value="option.value"
          :checked="data1.value.indexOf(option.value) !== -1"
          :name="data1.name"
          class="blind"
          @change="clickCheck(option.value)"
        />
        <label :for="data1.id + '_' + option.id">
          <span class="icon"></span>
          <span class="label_t">{{ option.label }}</span>
        </label>
      </div>
    </div>
  </fragment>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'allCheckList',
  props: ['dataArray', 'required'],
  data() {
    return {
      title: '',
      data1: '',
      data2: '',
    };
  },
  created() {
    this.title = this.dataArray.title;

    if (this.dataArray.year && this.dataArray.year === '2020') {
      if (this.formContents.notification2020[this.dataArray.data1]) this.data1 = this.formContents.notification2020[this.dataArray.data1];
      this.data2 = this.formContents.notification2020[this.dataArray.data2];
    } else {
      this.data1 = this.formContents.notification[this.dataArray.data1];
      this.data2 = this.formContents.notification[this.dataArray.data2];
    }
  },
  computed: {
    ...mapState('doc', ['formContents', 'notificationSubData']),
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
    allCheck(e) {
      const { checked } = e.target;
      const checkBoxList = document.querySelectorAll(`[name='${this.data1.name}']`);
      for (let checkBoxIndex = 0; checkBoxIndex < checkBoxList.length; checkBoxIndex++) {
        checkBoxList[checkBoxIndex].checked = checked;
      }
      let allValue = [];
      if (checked) {
        for (const i in this.data1.options) {
          allValue.push(this.data1.options[i].value);
        }
      }
      this.DATA_SET({ [this.data1.id]: allValue });
    },
    clickCheck(value) {
      const checkBoxList = document.querySelectorAll(`[name='${this.data1.name}']`);
      let allBoxChecked = true;
      for (let checkBoxIndex = 0; checkBoxIndex < checkBoxList.length; checkBoxIndex++) {
        if (!checkBoxList[checkBoxIndex].checked) {
          allBoxChecked = false;
          break;
        }
      }
      this.DATA_SET({ [this.data1.id]: value });
      document.getElementById(this.data1.id).checked = allBoxChecked;
    },
  },
};
</script>

<style scoped></style>
