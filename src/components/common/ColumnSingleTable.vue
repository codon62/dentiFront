<template>
  <div class="column_Single_table">
    <dl v-for="(item, itemIndex) in data" :key="itemIndex" :style="{ paddingLeft: `${width}px` }">
      <dt :style="{ width: `${width}px`, minHeight: `${height}px` }">{{ item.head }}</dt>
      <dd
        v-for="(body, bodyIndex) in item.body"
        :key="bodyIndex"
        :class="{ highlight: [...item.highlight].includes(bodyIndex) }"
        :style="{ flexBasis: `calc(100% / ${item.col})`, minHeight: `${height}px` }"
        v-html="body"
      />
    </dl>
  </div>
</template>

<script>
export default {
  props: ['width', 'height', 'data'],
};
</script>

<style></style>
