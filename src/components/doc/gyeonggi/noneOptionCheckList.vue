<template>
  <fragment>
    <p class="content_title">
      {{ title }}
      <i v-if="required" class="red_dot ml10"></i>
    </p>
    <div class="flex_box mt14">
      <div class="check_button">
        <input :id="data1.id" type="checkbox" :checked="data1.value === 0" class="blind" @change="noneCheck($event)" />
        <label :for="data1.id">
          <span class="icon"></span>
          <span class="label_t">없음</span>
        </label>
      </div>
      <div v-for="option in data2.options" :key="option.id" class="check_button ml14">
        <input
          :id="data2.id + '_' + option.id"
          type="checkbox"
          :value="option.value"
          :checked="data2.value.indexOf(option.value) !== -1"
          :name="data2.name"
          class="blind"
          @change="clickCheck(option.value)"
        />
        <label :for="data2.id + '_' + option.id">
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
  name: 'noneOptionCheckList',
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
    noneCheck(e) {
      const { checked } = e.target;
      if (checked) {
        this.DATA_SET({ [this.data1.id]: 0 });
        this.DATA_SET({ [this.data2.id]: [] });
      } else {
        this.DATA_SET({ [this.data1.id]: '' });
      }
    },
    clickCheck(value) {
      this.DATA_SET({ [this.data2.id]: parseInt(value) });
      this.DATA_SET({ [this.data1.id]: this.data2.value.length ? 1 : 0 });
    },
  },
};
</script>

<style scoped></style>
