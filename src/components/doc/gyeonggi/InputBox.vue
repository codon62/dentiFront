<template>
  <div class="mt24">
    <p class="content_title">
      {{ title }}
      <i v-if="required" class="red_dot ml10"></i>
    </p>
    <div class="flex_box mt14">
      <input :id="data1.id" type="text" maxlength="100" class="text_box" :value="data1.value" :placeholder="data1.placeholder" @input="DATA_SET({ [data1.id]: $event.target.value })" />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'inputBox',
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
    this.data1 = this.formContents.notification[this.dataArray.data1];
  },
  computed: {
    ...mapState('doc', ['formContents']),
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
  },
};
</script>

<style scoped></style>
