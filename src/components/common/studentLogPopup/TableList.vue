<template>
  <tr v-if="data.num">
    <td>
      <p class="scommp">{{ data.num }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.systemLogContents }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.regdate }}</p>
    </td>
  </tr>
  <tr v-else class="bg_blue">
    <td>
      <p class="scommp" style="font-weight: 500">{{ data.title }} 사유</p>
    </td>
    <td><p class="scommp" style="font-weight: 500" v-html="data.systemLogDetailContents.replace(/(\n)/g, '<br>')"></p></td>
    <td><p class="scommp"></p></td>
  </tr>
</template>

<script>
export default {
  props: ['num', 'data'],
};
</script>
