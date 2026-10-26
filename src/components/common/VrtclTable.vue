<template>
  <table class="comm__table">
    <colgroup>
      <col v-for="(item, i) in table.col" :key="i" :span="item[0]" :width="item[1]" />
    </colgroup>
    <thead>
      <tr v-for="(row, i) in table.thead" :key="i">
        <th v-for="(item, i) in row" :key="i" scope="col" :rowspan="item[1]" :colspan="item[2]" :class="item[3]">{{ item[0] }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in table.tbody" :key="i">
        <td v-for="(item, i) in row" :key="i" scope="col" :rowspan="item[1]" :colspan="item[2]" :class="item[3]"><p class="scommp" v-html="lineBreak(item[0])"></p></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['table'],
  methods: {
    // 줄바꿈
    lineBreak(txt) {
      return txt.replace(/(?:\r\n|\r|\n)/g, '<br>');
    },
  },
};
</script>
