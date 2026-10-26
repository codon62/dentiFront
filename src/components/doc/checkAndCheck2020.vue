<template>
  <div class="row" :class="divclass">
    <div class="d_inblock" :class="{ p_relative: data2, s_blit_line: data2, pr30: data2 }">
      <div class="check_set" name="depth1">
        <input :id="data1.id" type="checkbox" value="1" :checked="data1.value == 1" :name="data1.name" class="blind" :disabled="disabled" />
        <label :for="data1.id">
          <span class="icon"></span>
          <span class="label_t">{{ data1.label }}</span>
        </label>
      </div>
    </div>
    <div v-if="data2" class="d_inblock ml30">
      <div v-if="['radio', 'checkbox'].indexOf(data2.type) !== -1" :class="{ comm_radio: data2.type === 'radio', check_set: data2.type === 'checkbox' }">
        <div v-for="option in data2.options" :key="option.id" class="radio_box d_inblock" :class="{ ml20: parseInt(option.id, 10) > 0 }">
          <input
            :id="data2.id + '_' + option.id"
            :type="data2.type"
            :value="option.value"
            :checked="checked(option.value, data2.value)"
            :name="data2.name"
            class="blind"
            :disabled="disabled || data1.value != 1"
          />
          <label :for="data2.id + '_' + option.id">
            <span class="icon"></span>
            <span class="label_t" :class="{ off_put: data1.value != 1 }">{{ option.label }}</span>
          </label>
        </div>
      </div>
      <div v-else class="m__putbox wid250">
        <input type="text" :value="data2.value" class="comm_put" :class="{ read_put: disabled || data1.value != 1 }" :disabled="disabled || data1.value != 1" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'CheckAndCheck2020',
  props: ['dataArray', 'divclass', 'disabled', 'statementName'],
  data() {
    return {
      type: '',
      data1: '',
      data2: '',
    };
  },
  created() {
    this.data1 = this.formContents[this.statementName][this.dataArray.data1];
    this.data2 = this.formContents[this.statementName][this.dataArray.data2];
  },
  computed: {
    ...mapState('doc', ['formContents']),
  },
  methods: {
    checked(optionVal, itemVal) {
      if (typeof itemVal === 'object') {
        return itemVal.indexOf(optionVal) !== -1 || itemVal.indexOf(String(optionVal)) !== -1 ? true : false;
      } else {
        return itemVal == optionVal ? true : false;
      }
    },
  },
};
</script>
