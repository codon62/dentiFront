<template>
  <table class="check_table">
    <colgroup v-if="col">
      <col v-for="width in col" :key="width" :width="width" />
    </colgroup>
    <thead>
      <tr>
        <th v-for="head in thead" :key="head">{{ head }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, itemIndex) in list" :key="itemIndex">
        <td>{{ itemIndex + 1 }}</td>
        <td class="tal">
          <p class="commp fw500">{{ item.label }}</p>
          <ul v-if="item.subLabel">
            <li v-for="sub in item.subLabel" :key="sub">{{ sub }}</li>
          </ul>
        </td>
        <td>
          <div class="comm_radio flex_box">
            <div v-for="(option, optionIndex) in options" :key="option" class="radio_box" :class="optionIndex > 0 ? (readonly ? 'ml20' : 'ml60') : ''">
              <input type="radio" v-model="form[item.id]" :name="item.id" :id="`${item.id}_${optionIndex}`" :value="optionIndex" class="blind" @change="changeRadio" :disabled="readonly" />
              <label :for="`${item.id}_${optionIndex}`">
                <span class="icon"></span>
                <span class="label_t">{{ option }}</span>
              </label>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['col', 'thead', 'list', 'options', 'data', 'readonly'],
  data() {
    return {
      form: null,
    };
  },
  created() {
    this.initialize();
  },
  watch: {
    data() {
      this.initialize();
    },
  },
  methods: {
    initialize() {
      this.list.map(item => {
        this.form = { ...this.form, [item.id]: this.data[item.id] };
      });
    },
    changeRadio(e) {
      const { name, value } = e.target;

      this.form[name] = Number(value);
      this.$emit('change', this.form);
    },
  },
};
</script>

<style></style>
