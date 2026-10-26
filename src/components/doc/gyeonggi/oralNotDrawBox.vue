<template>
  <fragment>
    <p class="content_title">
      {{ title }}
      <i v-if="required" class="red_dot ml10"></i>
    </p>
    <div class="flex_box mt5">
      <div v-for="option in first.options" :key="option.id" class="radio_button" :class="{ ml14: parseInt(option.id, 10) > 0 }">
        <input
          :id="`${first.id}_${option.id}`"
          type="radio"
          :value="option.value"
          :checked="parseInt(first.value) === option.value"
          :name="first.name"
          class="blind"
          @change="updateData(first.id, $event)"
        />
        <label :for="`${first.id}_${option.id}`">
          <span class="icon"></span>
          <span class="label_t">{{ option.label }}</span>
        </label>
      </div>
    </div>
    <div class="mt14">
      <div v-if="secondView" class="teeth_number_container">
        <div>
          <p class="content_sub_title">{{ fourthView ? `유치 (${second.label})` : `${second.label}` }}</p>
        </div>
        <select v-model="second.value" class="select_box_new mt5" @input="updateData(second.id, $event)" :disabled="first.value !== 1" :class="{ read_only: first.value !== 1 }">
          <option v-for="item in teeth_list" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>
      <div v-if="thirdView" class="teeth_number_container ml14">
        <div>
          <p class="content_sub_title">{{ fourthView ? `유치 (${third.label})` : `${third.label}` }}</p>
        </div>
        <select v-model="third.value" class="select_box_new mt5" @input="updateData(third.id, $event)" :disabled="first.value !== 1" :class="{ read_only: first.value !== 1 }">
          <option v-for="item in teeth_list" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>
      <div v-if="fourthView" class="teeth_number_container ml14">
        <div>
          <p class="content_sub_title">영구치 (상)</p>
        </div>
        <select v-model="fourth.value" class="select_box_new mt5" @input="updateData(fourth.id, $event)" :disabled="first.value !== 1" :class="{ read_only: first.value !== 1 }">
          <option v-for="item in teeth_list" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>
      <div v-if="fifthView" class="teeth_number_container ml14">
        <div>
          <p class="content_sub_title">영구치 (하)</p>
        </div>
        <select v-model="fifth.value" class="select_box_new mt5" @input="updateData(fifth.id, $event)" :disabled="first.value !== 1" :class="{ read_only: first.value !== 1 }">
          <option v-for="item in teeth_list" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </div>
    </div>
  </fragment>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'OralNotDrawBox',
  props: ['dataArray', 'required'],
  data() {
    return {
      title: '',
      first: '',
      second: '',
      third: '',
      fourth: '',
      fifth: '',
      teeth_list: [
        { id: 0, name: '0개' },
        { id: 1, name: '1개' },
        { id: 2, name: '2개' },
        { id: 3, name: '3개' },
        { id: 4, name: '4개' },
        { id: 5, name: '5개' },
        { id: 6, name: '6개' },
        { id: 7, name: '7개' },
        { id: 8, name: '8개' },
        { id: 9, name: '9개' },
        { id: 10, name: '10개' },
        { id: 11, name: '11개' },
        { id: 12, name: '12개' },
        { id: 13, name: '13개' },
        { id: 14, name: '14개' },
      ],
    };
  },
  created() {
    this.title = this.dataArray.title;
    if (this.dataArray.year && this.dataArray.year === '2020') {
      this.first = this.formContents.notification2020[this.dataArray.first];
      this.second = this.formContents.notification2020[this.dataArray.second];
      this.third = this.formContents.notification2020[this.dataArray.third];
      this.fourth = this.formContents.notification2020[this.dataArray.fourth];
      this.fifth = this.formContents.notification2020[this.dataArray.fifth];
    } else {
      this.first = this.formContents.notification[this.dataArray.first];
      this.second = this.formContents.notification[this.dataArray.second];
      this.third = this.formContents.notification[this.dataArray.third];
      this.fourth = this.formContents.notification[this.dataArray.fourth];
      this.fifth = this.formContents.notification[this.dataArray.fifth];
    }
  },
  computed: {
    ...mapState('doc', ['formContents']),
    secondView() {
      return !!this.second;
    },
    thirdView() {
      return !!this.third;
    },
    fourthView() {
      return !!this.fourth;
    },
    fifthView() {
      return !!this.fifth;
    },
  },
  methods: {
    updateData(id, e) {
      const { value } = e.target;
      const formContents = { [id]: parseInt(value) };
      this.$store.commit('doc/DATA_SET', formContents);
      if (this.first.value !== 1) {
        if (this.secondView) {
          this.$store.commit('doc/DATA_SET', { [this.second.id]: 0 });
          this.$store.commit('doc/DATA_SET', { [this.third.id]: 0 });
        }
        if (this.fourthView) {
          this.$store.commit('doc/DATA_SET', { [this.fourth.id]: 0 });
          this.$store.commit('doc/DATA_SET', { [this.fifth.id]: 0 });
        }
      }
    },
  },
};
</script>

<style scoped></style>
