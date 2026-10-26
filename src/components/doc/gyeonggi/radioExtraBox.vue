<template>
  <fragment>
    <div v-for="(option, optionIndex) in data1.options" :key="option.id" class="mt24">
      <p class="content_title">
        {{ optionIndex === 0 ? title1 : title2 }}
        <i v-if="required" class="red_dot ml10"></i>
      </p>
      <div class="flex_box mt14">
        <div class="radio_button">
          <input :id="`${data1.id}_${option.value}_N`" type="radio" :checked="!data1.value.includes(option.value)" class="blind" @change="clickCheck(optionIndex, option)" />
          <label :for="`${data1.id}_${option.value}_N`">
            <span class="icon"></span>
            <span class="label_t">미시행</span>
          </label>
        </div>
        <div class="radio_button ml14">
          <input :id="`${data1.id}_${option.value}_Y`" type="radio" :checked="data1.value.includes(option.value)" class="blind" @change="clickCheck(optionIndex, option)" />
          <label :for="`${data1.id}_${option.value}_Y`">
            <span class="icon"></span>
            <span class="label_t">시행</span>
          </label>
        </div>
        <div class="ml14" style="flex-grow: 1">
          <input
            :id="data2[optionIndex].id"
            type="text"
            class="text_box"
            maxlength="100"
            :value="data2[optionIndex].value"
            :placeholder="data2[optionIndex].placeholder"
            :disabled="data1.value.includes(option.value)"
            :class="{ disabled: data1.value.includes(option.value) }"
            @input="DATA_SET({ [data2[optionIndex].id]: $event.target.value })"
          />
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'radioExtraBox',
  props: ['dataArray', 'required'],
  data() {
    return {
      title1: '',
      title2: '',
      data1: '',
      data2: '',
    };
  },
  created() {
    this.title1 = this.dataArray.title1;
    this.title2 = this.dataArray.title2;
    if (this.dataArray.year && this.dataArray.year === '2020') {
      this.data1 = this.formContents.notification2020[this.dataArray.data1];
      if (typeof this.dataArray.data2 === 'object') {
        this.data2 = [];
        for (let index = 0; index < this.dataArray.data2.length; index++) {
          this.data2.push(this.formContents.notification2020[this.dataArray.data2[index]]);
        }
      } else {
        this.data2 = this.formContents.notification2020[this.dataArray.data2];
      }
    } else {
      this.data1 = this.formContents.notification[this.dataArray.data1];
      if (typeof this.dataArray.data2 === 'object') {
        this.data2 = [];
        for (let index = 0; index < this.dataArray.data2.length; index++) {
          this.data2.push(this.formContents.notification[this.dataArray.data2[index]]);
        }
      } else {
        this.data2 = this.formContents.notification[this.dataArray.data2];
      }
    }
  },
  computed: {
    ...mapState('doc', ['formContents', 'notificationSubData']),
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET', 'OBJECT_SPLICE']),
    clickCheck(optionIndex, option) {
      const notInputId = this.data2[optionIndex].id;
      const notInputElement = document.getElementById(notInputId);
      this.DATA_SET({ [this.data1.id]: option.value });
      if (option.appendTable) {
        if (this.data1.value.includes(option.value)) {
          const today = this.getToday().split('-');
          const form = {
            year: today[0],
            month: today[1],
            day: today[2],
            leftTop: ['all'],
            rightTop: [],
            leftBottom: [],
            rightBottom: [],
            contents: option.label,
          };
          this.$store.commit('doc/OBJECT_SET', { n_13_tooth: form });
          this.DATA_SET({ [notInputId]: '' });
          notInputElement.setAttribute('disabled', '');
          notInputElement.classList.add('disabled');
        } else {
          let index = -1;
          this.formContents.notification.n_13_tooth.value.forEach((value, key) => {
            if (value.contents === option.label) {
              index = key;
            }
          });
          if (index !== -1) {
            this.OBJECT_SPLICE({ n_13_tooth: index });
          }
          notInputElement.removeAttribute('disabled');
          notInputElement.classList.remove('disabled');
        }
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
      return yyyy + '-' + mm + '-' + dd;
    },
  },
};
</script>

<style scoped></style>
