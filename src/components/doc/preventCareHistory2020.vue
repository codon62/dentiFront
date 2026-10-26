<template>
  <div class="mt20">
    <div v-if="!data1.value.length" class="comm__bg no_data">
      <p class="tac commp c_gray2 mt10 mb10">예방진료 내역이 없습니다.</p>
    </div>
    <div v-for="(data, index) in data1.value" v-else :key="index" class="form__row">
      <div class="row flex_set mt10 pd_inner flex_left flex_top">
        <div class="1flex_item flex_size_m1">
          <p class="scommp c_gray2 fwn">진료일자</p>
          <date :data="setDateForm(data.date)" :disabled="view" />
        </div>
        <div class="flex_item ml30">
          <p class="scommp c_gray2 fwn">부위</p>
          <div v-if="checkArrEmpty([data['up_right'], data['up_left'], data['low_right'], data['low_left']])" class="row">
            <div class="m__putbox mt10 wid150 inner--left">
              <input
                type="text"
                class="comm_put read_put"
                :value="districtCodeFirst === 'D' && data.contents === '치석제거' ? '-' : '치아전체'"
                style="background-color: #ebebeb; padding: 0px 15px"
                disabled
              />
            </div>
            <div class="m__putbox mt10 wid175 inner--left ml30"></div>
          </div>
          <div v-else class="row">
            <div class="m__putbox mt10 wid175 inner--left">
              <input type="text" :value="data.up_left" class="comm_put" :class="{ bg_white: !view, read_eb: view }" style="background-color: #ebebeb; padding: 0px 15px" disabled />
            </div>
            <div class="m__putbox mt10 wid175 inner--left ml5">
              <input type="text" :value="data.up_right" class="comm_put" :class="{ bg_white: !view, read_eb: view }" style="background-color: #ebebeb; padding: 0px 15px" disabled />
            </div>
            <br />
            <br />
            <br />
            <div class="m__putbox mt5 wid175 inner--left">
              <input type="text" :value="data.low_left" class="comm_put" :class="{ bg_white: !view, read_eb: view }" style="background-color: #ebebeb; padding: 0px 15px" disabled />
            </div>
            <div class="m__putbox mt5 wid175 inner--left ml5">
              <input type="text" :value="data.low_right" class="comm_put" :class="{ bg_white: !view, read_eb: view }" style="background-color: #ebebeb; padding: 0px 15px" disabled />
            </div>
          </div>
        </div>
        <div class="flex_item ml30">
          <p class="scommp c_gray2 fwn">진료내용</p>
          <div class="m__putbox mt10" :class="{ wid260: !view }" :style="view ? 'width: 188px;' : null">
            <input type="text" class="comm_put read_put" style="background-color: #ebebeb; padding: 0px 15px" :value="data.contents" disabled />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import Date from '@/components/common/Date.vue';

export default {
  components: {
    Date,
  },
  props: ['dataArray', 'view'],
  data() {
    return {
      data1: [],
    };
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
  created() {
    this.data1 = this.formContents.notification2020[this.dataArray.data1];
  },
  methods: {
    ...mapMutations('doc', ['OBJECT_SPLICE']),
    checkArrEmpty(arr) {
      let status = true;
      arr.forEach(list => {
        if (list[0]) {
          status = false;
        }
      });
      return status;
    },
    setDateForm(dateStr) {
      return `${dateStr.slice(0, 4)}-${dateStr.slice(5, 7)}-${dateStr.slice(-2)}`;
    },
  },
};
</script>
