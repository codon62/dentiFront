<template>
  <fragment>
    <p class="content_title">
      {{ title }}
      <i v-if="required" class="red_dot ml10"></i>
    </p>
    <select v-model="data1.value" class="select_box_new mt5" @input="updateData(data1.id, $event)">
      <option value="">선택</option>
      <option v-for="item in data1.options" :key="item.id" :value="item.value">{{ item.label }}</option>
    </select>
  </fragment>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'optionSelectBox',
  props: ['dataArray', 'required'],
  data() {
    return {
      title: '',
      data1: '',
      offClass: true,
    };
  },
  created() {
    this.title = this.dataArray.title;

    if (this.dataArray.year && this.dataArray.year === '2020') {
      if (this.formContents.notification2020[this.dataArray.data1]) this.data1 = this.formContents.notification2020[this.dataArray.data1];
    } else {
      this.data1 = this.formContents.notification[this.dataArray.data1];
    }
  },
  computed: {
    ...mapState('doc', ['formContents']),
  },
  methods: {
    updateData(id, e) {
      const { value } = e.target;
      const formContents = { [id]: value };
      this.$store.commit('doc/DATA_SET', formContents);
    },
  },
};
</script>

<style scoped></style>
