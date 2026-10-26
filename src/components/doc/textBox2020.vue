<template>
  <div class="set_table">
    <div class="set__table" style="width: 16%"><p class="commp c_black tal" v-html="title"></p></div>
    <div class="set__table" style="width: 60%">
      <div class="textbox" :class="{ off_ver: offClass }" style="height: 90px">
        <textarea v-if="!view" :id="data1.id" :name="data1.name" class="comm__textarea wid100" :placeholder="data1.placeholder" :value="data1.value" style="color: #000; font-weight: 400"></textarea>
        <div v-else :id="data1.id" :name="data1.name" class="comm__textarea wid100" style="color: #000; font-weight: 400" v-html="data1.value.replace(/(\n)/g, '<br>')"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'TextBox2020',
  props: ['dataArray', 'view'],
  data() {
    return {
      title: '',
      data1: '',
      data2: '',
      offClass: true,
    };
  },
  created() {
    this.title = this.dataArray.title;
    this.data1 = this.dataArray.data1.charAt(0) === 'n' ? this.formContents.notification2020[this.dataArray.data1] : this.formContents.statement2020[this.dataArray.data1];
    if (this.data1.value === '') this.data1.value = '-';
  },
  computed: {
    ...mapState('doc', ['formContents']),
  },
};
</script>

<style scoped></style>
