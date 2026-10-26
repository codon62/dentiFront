<template>
  <div class="flex_set pd__10_10">
    <div class="wid120 flex__item_fix">
      <p class="commp c_black tal fwb">{{ title }}</p>
    </div>
    <div class="ml40">
      <div class="row">
        <div v-for="option in data1.options" :key="option.id" class="d_inblock hei100" :class="{ ml30: parseInt(option.id, 10) > 0 }">
          <span class="d_inblock check_set">
            <input
              :id="data1.id + '_' + option.id"
              type="checkbox"
              :value="option.value"
              :checked="data1.value.indexOf(option.value) !== -1"
              :name="data1.name"
              class="blind"
              :disabled="view"
              @change="checked(data1.id, $event, option)"
            />
            <label :for="data1.id + '_' + option.id">
              <span class="icon"></span>
              <span class="label_t">{{ option.label }}</span>
            </label>
          </span>

          <span v-if="option.sub && formContents.notification[option.sub].type === 'checkbox'" class="d_inblock check_set">
            <span class="label_t mr10">(</span>
            <span v-for="(subOption, subIndex) in formContents.notification[option.sub].options" :key="subOption.id">
              <span v-if="subIndex !== 0" class="label_t mr10">,</span>
              <input
                :id="formContents.notification[option.sub].id + '_' + subOption.id"
                type="checkbox"
                :value="subOption.value"
                :checked="formContents.notification[option.sub].value.indexOf(subOption.value) !== -1"
                :name="formContents.notification[option.sub].name"
                class="blind"
                :disabled="view || data1.value.indexOf(option.value) === -1"
                @change="checked(formContents.notification[option.sub].id, $event, subOption, option)"
              />
              <label :for="formContents.notification[option.sub].id + '_' + subOption.id">
                <span class="icon"></span>
                <span class="label_t" :class="{ off_put: data1.value.indexOf(option.value) === -1 }">{{ subOption.label }}</span>
              </label>
            </span>
            <span class="label_t">)</span>
          </span>

          <span v-if="option.sub && formContents.notification[option.sub].type === 'radio'" class="d_inblock comm_radio">
            <span class="label_t mr10">(</span>
            <span v-for="(subOption, subIndex) in formContents.notification[option.sub].options" :key="subOption.id" class="radio_box">
              <span v-if="subIndex !== 0" class="label_t mr10">,</span>
              <input
                :id="formContents.notification[option.sub].id + '_' + subOption.id"
                type="radio"
                :value="subOption.value"
                :checked="formContents.notification[option.sub].value == subOption.value"
                :name="formContents.notification[option.sub].name"
                class="blind"
                :disabled="view || data1.value.indexOf(option.value) === -1"
                @change="checked(formContents.notification[option.sub].id, $event, subOption, option)"
              />
              <label :for="formContents.notification[option.sub].id + '_' + subOption.id">
                <span class="icon"></span>
                <span class="label_t fwn" :class="{ off_put: data1.value.indexOf(option.value) === -1 }">{{ subOption.label }}</span>
              </label>
            </span>
            <span class="label_t">)</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'CheckboxList',
  props: ['dataArray', 'view'],
  data() {
    return {
      title: '',
      data1: '',
    };
  },
  created() {
    this.title = this.dataArray.title;
    this.data1 = this.formContents.notification[this.dataArray.data1];
  },
  computed: {
    ...mapState('doc', ['formContents']),
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET', 'OBJECT_SPLICE']),
    checked(data1Id, e, option, parent) {
      if (option.appendTable) {
        if (e.target.type === 'radio') {
          this.clearTooth(parent);
        }
        const label = parent ? parent.label + '(' + option.label + ')' : option.label;
        if (e.target.checked) {
          if (option.popup === 'enable') {
            this.$store.dispatch('popup/popupOpen', { contents: 'addTreatment', params: { docId: data1Id, docValue: e.target.value, label: label } });
          } else {
            const today = this.getToday().split('-');
            const form = {
              year: today[0],
              month: today[1],
              day: today[2],
              leftTop: ['all'],
              rightTop: [],
              leftBottom: [],
              rightBottom: [],
              contents: label,
            };
            this.$store.commit('doc/OBJECT_SET', { n_13_tooth: form });
          }
        } else {
          let index = -1;
          this.formContents.notification.n_13_tooth.value.forEach((value, key) => {
            if (value.contents === label) {
              index = key;
            }
          });
          if (index !== -1) {
            this.OBJECT_SPLICE({ n_13_tooth: index });
          }
        }
      } else {
        // 하위 선택지가 있는 경우
        // disabled handling
        const sub = document.getElementsByName(this.formContents.notification[option.sub].name);
        for (let i = 0; i < sub.length; i++) {
          if (e.target.checked) {
            sub[i].nextElementSibling.childNodes[1].classList.remove('off_put');
            sub[i].disabled = false;
          } else {
            sub[i].checked = false;
            sub[i].nextElementSibling.childNodes[1].classList.add('off_put');
            sub[i].disabled = true;
          }
        }
        if (this.formContents.notification[option.sub].type === 'checkbox') {
          this.DATA_SET({ [option.sub]: [] });
        } else {
          this.DATA_SET({ [option.sub]: '' });
        }
        this.clearTooth(option);
      }
      this.DATA_SET({ [data1Id]: parseInt(e.target.value) });
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
    clearTooth(option) {
      let optionContents = [];
      this.formContents.notification[option.sub].options.forEach(optionVal => {
        optionContents.push(option.label + '(' + optionVal.label + ')');
      });
      let keys = [];
      this.formContents.notification.n_13_tooth.value.forEach((toothVal, key) => {
        if (optionContents.indexOf(toothVal.contents) !== -1) {
          keys.push(key);
        }
      });
      keys.sort((a, b) => {
        return a > b ? -1 : 1;
      });
      for (const i in keys) {
        this.OBJECT_SPLICE({ n_13_tooth: keys[i] });
      }
    },
  },
};
</script>

<style scoped>
.flex__item_fix {
  flex-shrink: 0;
}
</style>
