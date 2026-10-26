<template>
  <div class="form_wrap_check_box_list">
    <div class="">
      <p class="commp c_black tal">{{ title }}</p>
    </div>
    <div>
      <div class="flex_box" v-for="(dividedOptions, dividedIndex) in data1Options" :key="dividedIndex" :class="{ mt10: dividedIndex > 0 }">
        <div v-for="(option, index) in dividedOptions" :key="option.id" :class="{ ml20: index > 0 }">
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
              <span v-if="districtCodeFirst === 'D' && option.label_busan" class="label_t ml5">{{ option.label_busan }}</span>
              <span v-else class="label_t">{{ option.label }}</span>
            </label>
          </span>

          <span v-if="option.sub && formContents.notification[option.sub].type === 'checkbox'" class="d_inblock check_set">
            <span class="label_t ml5 mr2">(</span>
            <span v-for="(subOption, subIndex) in formContents.notification[option.sub].options" :key="subOption.id">
              <span v-if="subIndex !== 0" class="label_t ml2 mr5">,</span>
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
                <span class="label_t ml5" :class="{ off_put: data1.value.indexOf(option.value) === -1 }">{{ subOption.label }}</span>
              </label>
            </span>
            <span class="label_t ml2">)</span>
          </span>

          <span v-if="option.sub && formContents.notification[option.sub].type === 'radio'" class="d_inblock comm_radio">
            <span class="label_t ml5 mr2">(</span>
            <span v-for="(subOption, subIndex) in formContents.notification[option.sub].options" :key="subOption.id" class="radio_box">
              <span v-if="subIndex !== 0" class="label_t ml2 mr5">,</span>
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
                <span class="label_t ml5 fwn" :class="{ off_put: data1.value.indexOf(option.value) === -1 }">{{ subOption.label }}</span>
              </label>
            </span>
            <span class="label_t ml2">)</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'CheckboxListVue',
  props: ['dataArray', 'view'],
  data() {
    return {
      title: '',
      data1: '',
      data1Options: [[]],
    };
  },
  created() {
    this.title = this.dataArray.title;
    if (this.dataArray.year && this.dataArray.year === '2020') {
      this.data1 = this.formContents.notification2020[this.dataArray.data1];
      // 부산 - 치근단 촬영 제외
      if (this.districtCodeFirst === 'D') this.data1.options = this.data1.options.filter(item => item.label !== '치근단 촬영');
    } else {
      this.data1 = this.formContents.notification[this.dataArray.data1];
    }
    const options = this.dataArray.data1Options2 ? this.data1.options2 : this.data1.options;
    // 통보서 보기 폼의 경우 길이 때문에 divide값으로 줄바꿈 처리
    if (this.view) {
      let index = 0;
      for (let i = 0; i < options.length; i++) {
        if (options[i].divide) {
          index++;
          this.data1Options.push([]);
        }
        this.data1Options[index].push(options[i]);
      }
    } else {
      this.data1Options = [options];
    }
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapGetters('user', ['districtCodeFirst']),
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
          if (this.districtCodeFirst === 'A' && label === '치아홈메우기') {
            let indexList = [];
            this.formContents.notification.n_13_tooth.value.forEach((item, index) => {
              if (item.contents === label) {
                indexList.push(index);
              }
            });
            indexList.sort((a, b) => b - a);
            for (const i in indexList) {
              this.OBJECT_SPLICE({ n_13_tooth: indexList[i] });
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
        }
      } else if (option.sub) {
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

<style scoped></style>
