<template>
  <div class="flex_set pd__10_10">
    <div class="wid120 flex__item_fix"><p class="commp c_black tal fwb" v-html="title"></p></div>
    <div class="ml40">
      <div class="flex__box_center">
        <div class="border__right">
          <ul class="pr__20">
            <li class="tg-list-item flex__box_center">
              <input :id="data1.id" class="tgl tgl-ios" type="checkbox" :checked="data1.value.length === data1.options.length" :disabled="view" @change="allCheck($event)" />
              <label class="tgl-btn" :for="data1.id"></label>
              <p class="commp c_black2 ml10">전체선택</p>
            </li>
          </ul>
        </div>
        <div v-for="option in data1.options" :key="option.id" class="pl__20">
          <div class="check_set">
            <input
              :id="data1.id + '_' + option.id"
              type="checkbox"
              :value="option.value"
              :checked="data1.value.indexOf(option.value) !== -1"
              :name="data1.name"
              class="blind"
              :disabled="view"
              @change="clickCheck(option.value)"
            />
            <label :for="data1.id + '_' + option.id">
              <span class="icon"></span>
              <span class="label_t">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'AllCheckListBox',
  props: ['dataArray', 'view'],
  data() {
    return {
      title: '',
      data1: '',
    };
  },
  created() {
    this.title = this.dataArray.title;
    this.data1 = this.formContents.notification[this.dataArray.data1];
  },
  computed: {
    ...mapState('doc', ['formContents']),
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

<style scoped>
.flex__box_center {
  display: flex;
  align-items: center;
}
.flex__item_fix {
  flex-shrink: 0;
}
.border__right {
  border-right: 1px solid #e6e6e6;
}
.pr__20 {
  padding-right: 20px;
}
.pl__20 {
  padding-left: 20px;
}
</style>
