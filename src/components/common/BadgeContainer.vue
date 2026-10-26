<template>
  <div class="d_inblock" :style="{ ...padding, ...customStyle }">
    <div
      class="badge-container"
      :style="{
        verticalalign: align,
      }"
    >
      <slot />
      <div v-if="on" class="badge" :style="{ top: `${top}px`, right: `${right}px`, width: `${size}px`, height: `${size}px` }"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    on: {
      type: Boolean,
      default: false,
    },
    top: {
      type: Number,
      default: 0,
    },
    right: {
      type: Number,
      default: 0,
    },
    customStyle: {
      type: Object,
      default: () => ({}),
    },
    align: {
      type: String,
      default: 'middle',
    },
    size: {
      type: Number,
      default: 8,
    },
  },
  computed: {
    padding() {
      const horizontalPadding = this.top < 0 ? `${-this.top}px` : 0;
      const verticalPadding = this.right < 0 ? `${-this.right}px` : 0;
      return `${horizontalPadding} ${verticalPadding}`;
    },
  },
};
</script>

<style scoped>
.badge-container {
  position: relative;
  display: inline-block;
  overflow: visible;
}
.badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: red;
  border-radius: 50%;
  overflow: visible;
}
</style>
