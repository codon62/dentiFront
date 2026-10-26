<template>
  <div class="item">
    <p class="commp fwb">{{ title }}</p>
    <div class="put__set mt10">
      <div class="m__putbox wid200">
        <input :type="type || 'text'" class="comm_put" :placeholder="placeholder" :value="value" :readonly="readonly" :class="className" @input="input($event)" @keyup.enter="enter" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'placeholder', 'type', 'value', 'readonly', 'className'],
  methods: {
    input(e) {
      this.$emit('input', e.target.value);
    },
    enter() {
      this.$emit('enter');
    },
  },
};
</script>
