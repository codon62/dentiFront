<template>
  <div class="row" :class="divclass">
    <div class="d_inblock" :class="{ p_relative: data2, s_blit_line: data2, pr20: data2 }">
      <div class="check_set" name="depth1">
        <input :id="data1.id" type="checkbox" value="1" :checked="data1.value == 1" :name="data1.name" class="blind" :disabled="disabled" @change="change(data1.id, $event, data1)" />
        <label :for="data1.id">
          <span class="icon"></span>
          <span class="label_t">{{ data1.label }}</span>
        </label>
      </div>
    </div>
    <div v-if="data2" class="d_inblock ml20">
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
            @change="change(data2.id, $event, option, true)"
          />
          <label :for="data2.id + '_' + option.id">
            <span class="icon"></span>
            <span class="label_t" :class="{ off_put: data1.value != 1 }">{{ option.label }}</span>
          </label>
        </div>
      </div>
      <div v-else class="m__putbox wid250">
        <input
          type="text"
          :value="data2.value"
          class="input_box"
          :class="{ read_only: disabled || data1.value != 1 }"
          :disabled="disabled || data1.value != 1"
          @input="DATA_SET({ [data2.id]: $event.target.value })"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  props: ['dataArray', 'divclass', 'disabled'],
  data() {
    return {
      type: '',
      data1: '',
      data2: '',
    };
  },
  created() {
    this.type = this.dataArray.data1.charAt(0) === 't' ? 'treatmentPlan' : 'statement';
    this.data1 = this.formContents[this.type][this.dataArray.data1];
    this.data2 = this.formContents[this.type][this.dataArray.data2];
  },
  computed: {
    ...mapState('doc', ['formContents']),
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET', 'OBJECT_SPLICE']),
    change(dataId, e, option, isData2) {
      if (isData2) {
        this.DATA_SET({ [dataId]: parseInt(e.target.value) });
      } else {
        this.DATA_SET({ [dataId]: e.target.checked ? parseInt(e.target.value) : 0 });
      }
      // data2 초기화
      if (!e.target.checked && dataId === this.data1.id && this.data2) {
        const inputs = document.getElementsByName(this.data2.name);
        for (const i of inputs) {
          i.checked = false;
        }
        if (this.data2.type === 'checkbox') {
          this.DATA_SET({ [this.data2.id]: [] });
        } else {
          this.DATA_SET({ [this.data2.id]: '' });
        }
      }
      // 내역서 구강진료내역 업데이트
      if (this.type === 'statement') {
        if (this.data1.id !== dataId || !this.data2) {
          const contents = this.data2 ? this.data1.label + '(' + option.label + ')' : option.label;
          if (e.target.checked) {
            if (e.target.type === 'radio') {
              this.clearTooth();
            }
            if (option.appendTable) {
              if (option.popup === 'enable') {
                this.$store.dispatch('popup/popupOpen', { contents: 'addTreatment2', params: { docId: dataId, docValue: e.target.value, label: contents } });
              } else {
                const today = this.getToday().split('-');
                const form = {
                  contents: contents,
                  list: [
                    {
                      year: today[0],
                      month: today[1],
                      day: today[2],
                      leftTop: ['all'],
                      rightTop: [],
                      leftBottom: [],
                      rightBottom: [],
                      price: 0,
                    },
                  ],
                };
                this.$store.commit('doc/OBJECT_SET', { s_tooth: form });
              }
            }
          } else {
            let index = -1;
            this.formContents.statement.s_tooth.value.forEach((value, key) => {
              if (value.contents === contents) {
                index = key;
              }
            });
            if (index !== -1) {
              this.OBJECT_SPLICE({ s_tooth: index });
            }
          }
        } else {
          // data2 있는 data1 checkbox
          if (!e.target.checked) {
            this.clearTooth();
          }
        }
      }
    },
    checked(optionVal, itemVal) {
      if (typeof itemVal === 'object') {
        return itemVal.indexOf(optionVal) !== -1 || itemVal.indexOf(String(optionVal)) !== -1 ? true : false;
      } else {
        return itemVal == optionVal ? true : false;
      }
    },
    getToday() {
      const date = new window.Date();
      const yyyy = date.getFullYear();
      let dd = date.getDate();
      let mm = date.getMonth() + 1; // January is 0
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      const today = yyyy + '-' + mm + '-' + dd;
      return today;
    },
    clearTooth() {
      let optionContents = [];
      if (this.formContents.statement[this.data2.id].type) {
        // radio or checkbox
        this.formContents.statement[this.data2.id].options.forEach(optionVal => {
          optionContents.push(this.data1.label + '(' + optionVal.label + ')');
        });
        let keys = [];
        this.formContents.statement.s_tooth.value.forEach((toothVal, key) => {
          if (optionContents.indexOf(toothVal.contents) !== -1) {
            keys.push(key);
          }
        });
        keys.sort((a, b) => {
          return a > b ? -1 : 1;
        });
        for (const i in keys) {
          this.OBJECT_SPLICE({ s_tooth: keys[i] });
        }
      }
    },
  },
};
</script>
