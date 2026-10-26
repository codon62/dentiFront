<template>
  <fragment>
    <p class="content_title">
      {{ title }}
      <i v-if="required" class="red_dot ml10"></i>
    </p>
    <div class="flex_wrap_gap_container mt14">
      <!--      <div v-for="option in data1.options" :key="option.id" class="check_button" :class="{ ml14: parseInt(option.id, 10) > 0 }">-->
      <div v-for="option in data1.options" :key="option.id" class="check_button">
        <input
          :id="data1.id + '_' + option.id"
          type="checkbox"
          :value="option.value"
          :checked="data1.value.indexOf(option.value) !== -1"
          :name="data1.name"
          class="blind"
          @change="dataSet(parseInt($event.target.value))"
        />
        <label :for="data1.id + '_' + option.id">
          <span class="icon"></span>
          <span class="label_t">{{ option.label }}</span>
        </label>
      </div>
    </div>
    <div v-if="extendTextarea" class="mt14">
      <input
        :id="data2.id"
        :name="data2.name"
        type="text"
        maxlength="100"
        class="text_box"
        :class="{ disabled: otherDisabled }"
        :disabled="otherDisabled"
        :value="data2.value"
        :placeholder="data2.placeholder"
        @input="DATA_SET({ [data2.id]: $event.target.value })"
      />
    </div>
  </fragment>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'CheckExtendBoxVue',
  props: ['dataArray', 'required'],
  data() {
    return {
      title: '',
      data1: '',
      data2: '',
      otherDisabled: false,
    };
  },
  created() {
    this.title = this.dataArray.title;
    this.data1 = this.formContents.notification[this.dataArray.data1];
    this.data2 = this.formContents.notification[this.dataArray.data2];
  },
  computed: {
    ...mapState(['update2']),
    ...mapState('doc', ['formContents']),
    data1View() {
      return !!this.data1;
    },
    extendTextarea() {
      return this.data2 && this.data2.type === 'textarea';
    },
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
    dataSet(value) {
      this.DATA_SET({ [this.data1.id]: value });
      this.changeOtherDisabled();
      this.clearData2();
    },
    changeOtherDisabled() {
      if (this.data1View) {
        const lastVal = this.data1.options[this.data1.options.length - 1].value;
        this.otherDisabled = this.data1.value.indexOf(lastVal) === -1 && this.data1.value.indexOf(String(lastVal)) === -1;
      }
    },
    clearData2() {
      if (this.otherDisabled) {
        this.DATA_SET({ [this.data2.id]: '' });
      }
    },
  },
  watch: {
    update2() {
      this.changeOtherDisabled();
    },
  },
};
</script>

<style scoped></style>
