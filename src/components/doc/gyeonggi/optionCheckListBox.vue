<template>
  <fragment>
    <p class="content_title">
      {{ title }}
      <i v-if="required" class="red_dot ml10"></i>
    </p>
    <div class="flex_box mt14">
      <div v-for="option in data1.options" :key="option.id" class="check_button" :class="{ ml14: parseInt(option.id, 10) > 0 }">
        <input
          :id="data1.id + '_' + option.id"
          type="checkbox"
          :value="option.value"
          :checked="data1.value.indexOf(option.value) !== -1"
          :name="data1.name"
          class="blind"
          @change="updateData(option)"
        />
        <label :for="data1.id + '_' + option.id">
          <span class="icon"></span>
          <span class="label_t">{{ option.label }}</span>
        </label>
      </div>
    </div>
    <div v-if="extendTextarea" class="mt10">
      <input
        type="text"
        maxlength="100"
        :id="data2.id"
        class="text_box"
        :name="data2.name"
        :value="data2.value"
        :placeholder="data2.placeholder"
        @input="DATA_SET({ [data2.id]: $event.target.value })"
      />
    </div>
  </fragment>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'optionCheckListBox',
  props: ['dataArray', 'required'],
  data() {
    return {
      title: '',
      data1: '',
      offClass: true,
    };
  },
  created() {
    this.title = this.dataArray.title;

    if (this.dataArray.year && this.dataArray.year === '2020') {
      if (this.formContents.notification2020[this.dataArray.data1]) this.data1 = this.formContents.notification2020[this.dataArray.data1];
      this.data2 = this.formContents.notification2020[this.dataArray.data2];
    } else {
      this.data1 = this.formContents.notification[this.dataArray.data1];
      this.data2 = this.formContents.notification[this.dataArray.data2];
    }
  },
  computed: {
    ...mapState('doc', ['formContents']),
    extendTextarea() {
      return this.data2 && this.data2.type === 'textarea';
    },
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET', 'OBJECT_SPLICE']),
    updateData(option) {
      this.DATA_SET({ [this.data1.id]: option.value });
      const label = option.label;
      if (option.appendTable) {
        if (this.data1.value.includes(option.value)) {
          if (option.popup === 'enable') {
            this.$store.dispatch('popup/popupOpen', {
              contents: 'addTreatment',
              params: { docId: this.data1.id, docValue: option.value, label: label },
            });
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
