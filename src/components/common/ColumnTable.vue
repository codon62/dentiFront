<template>
  <div class="column_table">
    <dl v-for="([key, value], index) in Object.entries(data)" :key="index" :style="{ flexBasis: `calc(100% / ${col})`, minHeight: `${height}px` }">
      <dt
        :style="{
          flexBasis: `${width}px`,
          lineHeight: `${height - 16}px`,
        }"
      >
        <span>{{ key }}</span>
      </dt>
      <dd>
        <span>{{ value }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: ['col', 'width', 'height', 'data'],
};
</script>

<style></style>
