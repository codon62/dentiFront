<template>
  <div class="form_wrap_oral_img">
    <div :style="'width:' + (view ? '' : '120px')"><p class="commp tal" v-html="(view && title.length > 4 ? title.replace(' ', '<br>') : title) + bullet"></p></div>
    <div class="ml10 mr10">
      <div v-if="data1View" class="tooth__con">
        <div class="tooth__row">
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightTop.indexOf('18') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'rightTop', number: 8, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            8
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightTop.indexOf('17') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'rightTop', number: 7, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            7
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightTop.indexOf('16') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'rightTop', number: 6, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            6
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightTop.indexOf('15') !== -1, on2: data1.value.rightTop.indexOf('5E') !== -1 || data1.value.rightTop.indexOf('55') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'rightTop', number: 5, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            5
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightTop.indexOf('14') !== -1, on2: data1.value.rightTop.indexOf('5D') !== -1 || data1.value.rightTop.indexOf('54') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'rightTop', number: 4, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            4
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightTop.indexOf('13') !== -1, on2: data1.value.rightTop.indexOf('5C') !== -1 || data1.value.rightTop.indexOf('53') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'rightTop', number: 3, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            3
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightTop.indexOf('12') !== -1, on2: data1.value.rightTop.indexOf('5B') !== -1 || data1.value.rightTop.indexOf('52') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'rightTop', number: 2, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            2
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightTop.indexOf('11') !== -1, on2: data1.value.rightTop.indexOf('5A') !== -1 || data1.value.rightTop.indexOf('51') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'rightTop', number: 1, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            1
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftTop.indexOf('21') !== -1, on2: data1.value.leftTop.indexOf('6A') !== -1 || data1.value.leftTop.indexOf('61') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftTop', number: 1, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            1
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftTop.indexOf('22') !== -1, on2: data1.value.leftTop.indexOf('6B') !== -1 || data1.value.leftTop.indexOf('62') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftTop', number: 2, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            2
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftTop.indexOf('23') !== -1, on2: data1.value.leftTop.indexOf('6C') !== -1 || data1.value.leftTop.indexOf('63') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftTop', number: 3, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            3
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftTop.indexOf('24') !== -1, on2: data1.value.leftTop.indexOf('6D') !== -1 || data1.value.leftTop.indexOf('64') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftTop', number: 4, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            4
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftTop.indexOf('25') !== -1, on2: data1.value.leftTop.indexOf('6E') !== -1 || data1.value.leftTop.indexOf('65') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftTop', number: 5, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            5
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftTop.indexOf('26') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftTop', number: 6, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            6
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftTop.indexOf('27') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftTop', number: 7, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            7
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftTop.indexOf('28') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftTop', number: 8, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            8
          </div>
        </div>
        <div class="tooth__row">
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightBottom.indexOf('48') !== -1 }"
            @click="
              !view ? updateTooth({ id: data1.id, position: 'rightBottom', number: 8, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null
            "
          >
            8
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightBottom.indexOf('47') !== -1 }"
            @click="
              !view ? updateTooth({ id: data1.id, position: 'rightBottom', number: 7, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null
            "
          >
            7
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightBottom.indexOf('46') !== -1 }"
            @click="
              !view ? updateTooth({ id: data1.id, position: 'rightBottom', number: 6, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null
            "
          >
            6
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightBottom.indexOf('45') !== -1, on2: data1.value.rightBottom.indexOf('8E') !== -1 || data1.value.rightBottom.indexOf('85') !== -1 }"
            @click="
              !view ? updateTooth({ id: data1.id, position: 'rightBottom', number: 5, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null
            "
          >
            5
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightBottom.indexOf('44') !== -1, on2: data1.value.rightBottom.indexOf('8D') !== -1 || data1.value.rightBottom.indexOf('84') !== -1 }"
            @click="
              !view ? updateTooth({ id: data1.id, position: 'rightBottom', number: 4, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null
            "
          >
            4
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightBottom.indexOf('43') !== -1, on2: data1.value.rightBottom.indexOf('8C') !== -1 || data1.value.rightBottom.indexOf('83') !== -1 }"
            @click="
              !view ? updateTooth({ id: data1.id, position: 'rightBottom', number: 3, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null
            "
          >
            3
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightBottom.indexOf('42') !== -1, on2: data1.value.rightBottom.indexOf('8B') !== -1 || data1.value.rightBottom.indexOf('82') !== -1 }"
            @click="
              !view ? updateTooth({ id: data1.id, position: 'rightBottom', number: 2, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null
            "
          >
            2
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.rightBottom.indexOf('41') !== -1, on2: data1.value.rightBottom.indexOf('8A') !== -1 || data1.value.rightBottom.indexOf('81') !== -1 }"
            @click="
              !view ? updateTooth({ id: data1.id, position: 'rightBottom', number: 1, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null
            "
          >
            1
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftBottom.indexOf('31') !== -1, on2: data1.value.leftBottom.indexOf('7A') !== -1 || data1.value.leftBottom.indexOf('71') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftBottom', number: 1, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            1
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftBottom.indexOf('32') !== -1, on2: data1.value.leftBottom.indexOf('7B') !== -1 || data1.value.leftBottom.indexOf('72') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftBottom', number: 2, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            2
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftBottom.indexOf('33') !== -1, on2: data1.value.leftBottom.indexOf('7C') !== -1 || data1.value.leftBottom.indexOf('73') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftBottom', number: 3, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            3
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftBottom.indexOf('34') !== -1, on2: data1.value.leftBottom.indexOf('7D') !== -1 || data1.value.leftBottom.indexOf('74') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftBottom', number: 4, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            4
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftBottom.indexOf('35') !== -1, on2: data1.value.leftBottom.indexOf('7E') !== -1 || data1.value.leftBottom.indexOf('75') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftBottom', number: 5, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            5
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftBottom.indexOf('36') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftBottom', number: 6, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            6
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftBottom.indexOf('37') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftBottom', number: 7, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            7
          </div>
          <div
            class="tooth_box"
            :class="{ on1: data1.value.leftBottom.indexOf('38') !== -1 }"
            @click="!view ? updateTooth({ id: data1.id, position: 'leftBottom', number: 8, e: $event, useId: data2.id, topId: data3.id, bottomId: data4.id, reasonId: data7 ? data7.id : null }) : null"
          >
            8
          </div>
        </div>

        <div v-if="data7View">
          <div class="comm_radio m__putbox mt10">
            <p class="scommp c_red" v-html="data7.label + bullet"></p>
            <div v-for="option in data7.options" :key="option.id" class="radio_box d_inblock hei100" :class="{ ml30: parseInt(option.id, 10) > 0 }">
              <input
                :id="`${data7.id}_${option.id}`"
                type="radio"
                :value="option.value"
                :checked="parseInt(data7.value) === option.value"
                :name="data7.name"
                class="blind"
                :disabled="view || data2.value === 0"
                @change="DATA_SET({ [data7.id]: parseInt($event.target.value) })"
              />
              <label :for="`${data7.id}_${option.id}`">
                <span class="icon"></span>
                <span class="label_t" :class="{ off_put: data2.value === 0 }">{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="number_check row">
        <div class="d_inblock">
          <div v-if="data3View" class="number_check row">
            <div class="d_inblock wid50 tac">
              <p class="commp">{{ data3.label }}</p>
            </div>
            <div class="d_inblock m__putbox wid50">
              <div v-if="view" class="input_box_view_center">{{ data3.value }}</div>
              <input v-else type="number" class="input_box commp tac" :value="data3.value" readonly />
            </div>
            <p class="d_inblock commp ml5">개</p>
          </div>
          <div v-if="data4View" class="number_check row mt5">
            <div class="d_inblock wid50 tac">
              <p class="commp">{{ data4.label }}</p>
            </div>
            <div class="d_inblock m__putbox wid50">
              <div v-if="view" class="input_box_view_center">{{ data4.value }}</div>
              <input v-else type="number" class="input_box commp tac" :value="data4.value" readonly />
            </div>
            <p class="d_inblock commp ml5">개</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';

export default {
  name: 'OralDrawBoxVue',
  props: ['dataArray', 'view'],
  data() {
    return {
      bullet: '<span class="c_red d_inblock ml5">*</span>',
      title: '',
      data1: '',
      data2: '',
      data3: '',
      data4: '',
      data5: '',
      data6: '',
      data7: '',
    };
  },
  created() {
    this.title = this.dataArray.title;
    if (this.dataArray.year && this.dataArray.year === '2020') {
      this.data1 = this.formContents.notification2020[this.dataArray.data1];
      this.data2 = this.formContents.notification2020[this.dataArray.data2];
      this.data3 = this.formContents.notification2020[this.dataArray.data3];
      this.data4 = this.formContents.notification2020[this.dataArray.data4];
      this.data5 = this.formContents.notification2020[this.dataArray.data5];
      this.data6 = this.formContents.notification2020[this.dataArray.data6];
      this.data7 = this.formContents.notification2020[this.dataArray.data7];
    } else {
      this.data1 = this.formContents.notification[this.dataArray.data1];
      this.data2 = this.formContents.notification[this.dataArray.data2];
      this.data3 = this.formContents.notification[this.dataArray.data3];
      this.data4 = this.formContents.notification[this.dataArray.data4];
      this.data5 = this.formContents.notification[this.dataArray.data5];
      this.data6 = this.formContents.notification[this.dataArray.data6];
      this.data7 = this.formContents.notification[this.dataArray.data7];
    }
  },
  computed: {
    ...mapState('doc', ['formContents']),
    data1View() {
      return !!this.data1;
    },
    data3View() {
      return !!this.data3;
    },
    data4View() {
      return !!this.data4;
    },
    data5View() {
      return !!this.data5;
    },
    data6View() {
      return !!this.data6;
    },
    data7View() {
      return !!this.data7;
    },
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
    ...mapActions('doc', ['updateTooth']),
  },
};
</script>

<style scoped></style>
