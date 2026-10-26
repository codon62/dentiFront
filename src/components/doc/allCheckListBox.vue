<template>
  <div class="form_wrap_all_check_list_box">
    <div>
      <p class="commp c_black tal" v-html="title"></p>
    </div>
    <div>
      <ul class="tg-list">
        <li class="tg-list-item">
          <input :id="data1.id" class="tgl tgl-ios" type="checkbox" :checked="data1.value.length === data1.options.length" :disabled="view" @change="allCheck($event)" />
          <label class="tgl-btn d_inblock" :for="data1.id"></label>
          <p class="d_inblock commp c_black2 fwn ml10">전체선택</p>
        </li>
      </ul>
      <div class="comm__line mt15"></div>
      <div class="flex_box mt15">
        <div v-for="(option, index) in data1.options" :key="option.id" :class="{ ml20: index > 0 }">
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
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'AllCheckListBoxVue',
  props: ['dataArray', 'view'],
  data() {
    return {
      title: '',
      data1: '',
    };
  },
  created() {
    this.title = this.dataArray.title;
    if (this.dataArray.year && this.dataArray.year === '2020') {
      this.data1 = this.formContents.notification2020[this.dataArray.data1];
      // 부산은 치근단 촬영 제외
      if (this.districtCodeFirst === 'D') this.data1.options = this.data1.options.slice(0, 3);
    } else {
      this.data1 = this.formContents.notification[this.dataArray.data1];
    }
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapGetters('user', ['districtCodeFirst']),
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
