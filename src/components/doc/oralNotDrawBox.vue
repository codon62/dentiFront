<template>
  <div class="form_wrap_oral_no_img">
    <div :style="'width:' + (view ? '' : '120px')">
      <p class="commp tal">
        {{ title }}
        <span class="c_red d_inblock ml5">*</span>
      </p>
    </div>
    <div>
      <div class="comm_radio m__putbox mt10">
        <div v-for="option in first.options" :key="option.id" class="radio_box d_inblock hei100" :class="{ ml30: parseInt(option.id, 10) > 0 }">
          <input
            :id="`${first.id}_${option.id}`"
            type="radio"
            :value="option.value"
            :checked="parseInt(first.value) === option.value"
            :name="first.name"
            class="blind"
            :disabled="view"
            @change="updateData(first.id, $event)"
          />
          <label :for="`${first.id}_${option.id}`">
            <span class="icon"></span>
            <span class="label_t">{{ option.label }}</span>
          </label>
        </div>
      </div>
    </div>
    <div :style="'width:' + (view ? '' : '185px')">
      <div class="number_check row">
        <div class="d_inblock" v-if="fourthView">
          <p class="commp d_inblock wid80 tac">{{ fourthView ? '유치' : '' }}</p>
        </div>
        <div class="d_inblock">
          <div v-if="secondView" class="number_check row">
            <div class="d_inblock wid50">
              <p class="commp">{{ second.label }}</p>
            </div>
            <div class="d_inblock m__putbox wid50">
              <div v-if="view" class="input_box_view_center">{{ second.value }}</div>
              <input
                v-else
                type="number"
                readonly
                class="input_box commp tac"
                :class="{ read_only: first.value !== 1 }"
                :name="second.name"
                :value="second.value"
                @input="updateData(second.id, $event)"
              />
            </div>
            <p v-if="view" class="d_inblock commp ml5">개</p>
            <div v-if="!view" class="d_inblock ml10 mt5">
              <a href="javascript:" class="up_btn d_inblock ml5" @click="plusData(second.id)"><img src="@/assets/images/common/bt_plus.png" /></a>
              <a href="javascript:" class="down_btn d_inblock ml5" @click="minusData(second.id)"><img src="@/assets/images/common/bt_minus.png" /></a>
            </div>
          </div>
          <div v-if="thirdView" class="number_check row mt5">
            <div class="d_inblock wid50">
              <p class="commp">{{ third.label }}</p>
            </div>
            <div class="d_inblock m__putbox wid50">
              <div v-if="view" class="input_box_view_center">{{ third.value }}</div>
              <input v-else type="number" readonly class="input_box commp tac" :class="{ read_only: first.value !== 1 }" :name="third.name" :value="third.value" />
            </div>
            <p v-if="view" class="d_inblock commp ml5">개</p>
            <div v-if="!view" class="d_inblock ml10 mt5">
              <a href="javascript:" class="up_btn d_inblock ml5" @click="plusData(third.id)"><img src="@/assets/images/common/bt_plus.png" /></a>
              <a href="javascript:" class="down_btn d_inblock ml5" @click="minusData(third.id)"><img src="@/assets/images/common/bt_minus.png" /></a>
            </div>
          </div>
        </div>
      </div>
      <div v-if="fourthView" class="number_check row mt15">
        <div class="d_inblock">
          <p class="commp d_inblock wid80 tac">영구치</p>
        </div>
        <div class="d_inblock">
          <div v-if="fourthView" class="number_check row">
            <div class="d_inblock wid50">
              <p class="commp">{{ fourth.label }}</p>
            </div>
            <div class="d_inblock wid50">
              <div class="m__putbox wid50">
                <div v-if="view" class="input_box_view_center">{{ fourth.value }}</div>
                <input
                  v-else
                  type="number"
                  readonly
                  class="input_box commp tac"
                  :class="{ read_only: first.value != 1 }"
                  :name="fourth.name"
                  :value="fourth.value"
                  @input="updateData(fourth.id, $event)"
                />
              </div>
            </div>
            <p v-if="view" class="d_inblock commp ml5">개</p>
            <div v-if="!view" class="d_inblock ml10 mt5">
              <a href="javascript:" class="up_btn d_inblock ml5" @click="plusData(fourth.id)"><img src="@/assets/images/common/bt_plus.png" /></a>
              <a href="javascript:" class="down_btn d_inblock ml5" @click="minusData(fourth.id)"><img src="@/assets/images/common/bt_minus.png" /></a>
            </div>
          </div>
          <div v-if="fifthView" class="number_check row mt5">
            <div class="d_inblock wid50">
              <p class="commp">{{ fifth.label }}</p>
            </div>
            <div class="d_inblock wid50">
              <div class="m__putbox wid50">
                <div v-if="view" class="input_box_view_center">{{ fifth.value }}</div>
                <input v-else type="number" readonly class="input_box commp tac" :class="{ read_only: first.value != 1 }" :name="fifth.name" :value="fifth.value" />
              </div>
            </div>
            <p v-if="view" class="d_inblock commp ml5">개</p>
            <div v-if="!view" class="d_inblock ml10 mt5">
              <a href="javascript:" class="up_btn d_inblock ml5" @click="plusData(fifth.id)"><img src="@/assets/images/common/bt_plus.png" /></a>
              <a href="javascript:" class="down_btn d_inblock ml5" @click="minusData(fifth.id)"><img src="@/assets/images/common/bt_minus.png" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'OralNotDrawBoxVue',
  props: ['dataArray', 'view'],
  data() {
    return {
      title: '',
      first: '',
      second: '',
      third: '',
      fourth: '',
      fifth: '',
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
      if (this.first.value != 1) {
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
    plusData(id) {
      if (this.first.value == 1) {
        const { value } = this.formContents.notification[id];
        const plusValue = value + 1;
        this.$store.commit('doc/DATA_SET', { [id]: plusValue });
      }
    },
    minusData(id) {
      if (this.first.value == 1) {
        const { value } = this.formContents.notification[id];
        const calcValue = value - 1;
        const minusValue = calcValue >= 0 ? calcValue : 0;
        this.$store.commit('doc/DATA_SET', { [id]: minusValue });
      }
    },
  },
};
</script>

<style scoped></style>
