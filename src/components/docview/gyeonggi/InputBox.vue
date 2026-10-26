<template>
  <div class="flex__box_center pd__0_10">
    <div class="wid120 flex__item_fix">
      <p class="commp c_black tal fwb">
        {{ title }}
      </p>
    </div>
    <div class="ml30 pd__10 ovf__auto commp fwn">{{ data1.value }}</div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'InputBox',
  props: ['dataArray', 'view'],
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

<style scoped>
.flex__box_center {
  display: flex;
  align-items: center;
  min-height: 40px;
}
.flex__item_fix {
  flex-shrink: 0;
}
.ovf__auto {
  overflow: auto;
}
.pd__10 {
  padding: 10px;
}
</style>
