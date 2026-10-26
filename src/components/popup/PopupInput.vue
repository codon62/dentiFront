<template>
  <div class="flex_item" :class="[sizeClass, divclass]">
    <p class="commp fwb">
      {{ title }}
      <span v-if="required" class="c_red">{{ requiredKr ? '(필수)' : '*' }}</span>
    </p>
    <div class="m__putbox mt10">
      <input
        :type="type || 'text'"
        :maxlength="maxlength || 100"
        class="comm_put"
        :class="{ read_put: isReadonly }"
        :value="value"
        :name="name"
        :readonly="isReadonly"
        :placeholder="placeholder"
        @input="input($event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'divclass', 'type', 'size', 'value', 'maxlength', 'name', 'isReadonly', 'placeholder', 'required', 'requiredKr', 'options'],
  computed: {
    sizeClass() {
      return 'flex_size_' + this.size;
    },
  },
  methods: {
    input(e) {
      let value = e.target.value;
      if (this.type === 'number') {
        value = value.replace(/[^0-9]/g, '');
        value = value.length > this.options?.maxlength ? value.charAt(value.length - 1) : value;
        value = value < this.options?.min || value > this.options?.max ? null : value;
        e.target.value = value;
      }
      this.$emit('input', value);
    },
  },
};
</script>
