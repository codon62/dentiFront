<template>
  <div class="info_box_wrap pd__0_10 flex_wrap_container">
    <div class="info_box pd__10_0" style="padding-right: 20px">
      <p class="commp c_black tal fwb">
        {{ title }}
        <span class="c_red ml5">*</span>
      </p>
    </div>
    <div class="info_box pd__10_10">
      <div class="comm_radio">
        <div v-for="option in first.options" :key="option.id" class="radio_box d_inblock" :class="{ ml25: parseInt(option.id, 10) > 0 }">
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
    <div class="info_box flex_wrap_container border__left pd__0_10">
      <div class="number_check flex_wrap_container pd__10_0" style="padding-right: 10px">
        <div v-if="fourthView" class="mr30">
          <p class="commp d_inblock tac fwb">{{ fourthView ? '유치' : '' }}</p>
        </div>
        <div class="flex_wrap_container">
          <div v-if="secondView" class="number_check">
            <div class="d_inblock">
              <p class="commp fwb">{{ second.label }}</p>
            </div>
            <div class="d_inblock ml10">{{ second.value }} 개</div>
            <div v-if="!view" class="d_inblock ml10">
              <a href="javascript:" class="up_btn d_inblock ml5" @click="plusData(second.id)"><img src="@/assets/images/common/bt_plus.png" /></a>
              <a href="javascript:" class="down_btn d_inblock ml5" @click="minusData(second.id)"><img src="@/assets/images/common/bt_minus.png" /></a>
            </div>
          </div>
          <div v-if="thirdView" class="number_check ml20">
            <div class="d_inblock">
              <p class="commp fwb">{{ third.label }}</p>
            </div>
            <div class="d_inblock ml10">{{ third.value }} 개</div>
            <div v-if="!view" class="d_inblock ml10">
              <a href="javascript:" class="up_btn d_inblock ml5" @click="plusData(third.id)"><img src="@/assets/images/common/bt_plus.png" /></a>
              <a href="javascript:" class="down_btn d_inblock ml5" @click="minusData(third.id)"><img src="@/assets/images/common/bt_minus.png" /></a>
            </div>
          </div>
        </div>
      </div>
      <div v-if="fourthView" class="number_check flex_wrap_container pd__10_10 border__left">
        <div class="mr30">
          <p class="commp d_inblock tac fwb">영구치</p>
        </div>
        <div class="flex_wrap_container">
          <div v-if="fourthView" class="number_check">
            <div class="d_inblock">
              <p class="commp fwb">{{ fourth.label }}</p>
            </div>
            <div class="d_inblock ml10">{{ fourth.value }} 개</div>
            <div v-if="!view" class="d_inblock ml10">
              <a href="javascript:" class="up_btn d_inblock ml5" @click="plusData(fourth.id)"><img src="@/assets/images/common/bt_plus.png" /></a>
              <a href="javascript:" class="down_btn d_inblock ml5" @click="minusData(fourth.id)"><img src="@/assets/images/common/bt_minus.png" /></a>
            </div>
          </div>
          <div v-if="fifthView" class="number_check ml20">
            <div class="d_inblock">
              <p class="commp fwb">{{ fifth.label }}</p>
            </div>
            <div class="d_inblock ml10">{{ fifth.value }} 개</div>
            <div v-if="!view" class="d_inblock ml10">
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
  name: 'OralNotDrawBox',
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
    this.first = this.formContents.notification[this.dataArray.first];
    this.second = this.formContents.notification[this.dataArray.second];
    this.third = this.formContents.notification[this.dataArray.third];
    this.fourth = this.formContents.notification[this.dataArray.fourth];
    this.fifth = this.formContents.notification[this.dataArray.fifth];
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
    plusData(id) {
      if (this.first.value === 1) {
        const { value } = this.formContents.notification[id];
        const plusValue = value + 1;
        this.$store.commit('doc/DATA_SET', { [id]: plusValue });
      }
    },
    minusData(id) {
      if (this.first.value === 1) {
        const { value } = this.formContents.notification[id];
        const calcValue = value - 1;
        const minusValue = calcValue >= 0 ? calcValue : 0;
        this.$store.commit('doc/DATA_SET', { [id]: minusValue });
      }
    },
  },
};
</script>

<style scoped>
.info_box:nth-child(1) {
  width: 120px;
}
.wid__50.mid__box > .info_box_wrap {
  height: 65px;
  align-items: center;
}
.ml20 {
  margin-left: 20px;
}
.mr30 {
  margin-right: 30px;
}
input[type='number'] {
  letter-spacing: 0;
}
.pd__10_0 {
  padding: 10px 0;
}
.pd__10_10 {
  padding: 10px;
}
.pd__0_10 {
  padding: 0 10px;
}
.border__left {
  border-left: 1px solid #e6e6e6;
}
.wid__50.mid__box > .info_box_wrap > .border__left {
  border-left: 0;
}
</style>
