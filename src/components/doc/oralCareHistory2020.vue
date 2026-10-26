<template>
  <fragment>
    <div v-if="!list.length" class="comm__bg mt20 no_data" :class="{ pdfBlock: view }">
      <p class="tac commp c_gray2 mt10 mb10">구강진료 내역이 없습니다.</p>
    </div>
    <div v-for="(data, index) in list" v-else :key="`${data.contentsIndex}`" class="form__row comm__bg p_relative" :class="rowClass(1, index)">
      <div class="row flex_set pd_inner flex_top flex_left" :class="rowClass(2, index)">
        <div class="flex_item">
          <p class="scommp c_gray2 fwn">진료내용</p>
          <!-- pdf 적용 위해 style 태그 필요 -->
          <div class="m__putbox mt10 wid175"><input type="text" class="comm_put read_eb" style="background-color: #ebebeb; padding: 0px 15px" :value="data.contents" readonly /></div>
          <div class="m__putbox mt10 wid175">
            <input
              v-if="data.contents2 && !(districtCodeFirst === 'D' && data.contents2 === '기타(비보험)')"
              type="text"
              class="comm_put read_eb"
              style="background-color: #ebebeb; padding: 0px 15px"
              :value="data.contents2"
              readonly
            />
          </div>
        </div>
        <div class="flex_item ml30">
          <p class="scommp c_gray2 fwn">진료일자</p>
          <div class="m__putbox mt10 wid_100"><input type="text" class="comm_put read_eb" style="background-color: #ebebeb; padding: 0px 15px" :value="data.date" readonly /></div>
        </div>
        <div class="flex_item ml30">
          <p class="scommp c_gray2 fwn">부위</p>
          <div v-if="checkArrEmpty([data['up_right'], data['up_left'], data['low_right'], data['low_left']])" class="row">
            <div class="m__putbox mt10 wid150 inner--left"><input type="text" class="comm_put read_eb" style="background-color: #ebebeb; padding: 0px 15px" :value="'치아전체'" readonly /></div>
            <div class="m__putbox mt10 wid160 inner--left ml20"></div>
          </div>
          <div v-else class="row">
            <div class="m__putbox mt10 wid160 inner--left">
              <input type="text" :value="data['up_left']" class="comm_put" :class="{ bg_white: !view, read_eb: view }" :style="view ? 'background-color: #ebebeb; padding: 0px 15px;' : ''" disabled />
            </div>
            <div class="m__putbox mt10 wid160 inner--left ml5">
              <input type="text" :value="data['up_right']" class="comm_put" :class="{ bg_white: !view, read_eb: view }" :style="view ? 'background-color: #ebebeb; padding: 0px 15px;' : ''" disabled />
            </div>
            <br />
            <br />
            <br />
            <div class="m__putbox mt5 wid160 inner--left">
              <input type="text" :value="data['low_left']" class="comm_put" :class="{ bg_white: !view, read_eb: view }" :style="view ? 'background-color: #ebebeb; padding: 0px 15px;' : ''" disabled />
            </div>
            <div class="m__putbox mt5 wid160 inner--left ml5">
              <input
                type="text"
                :value="data['low_right']"
                class="comm_put"
                :class="{ bg_white: !view, read_eb: view }"
                :style="view ? 'background-color: #ebebeb; padding: 0px 15px;' : ''"
                disabled
              />
            </div>
          </div>
        </div>
        <div class="flex_item ml30">
          <p class="scommp c_gray2 fwn">금액</p>
          <div class="m__putbox mt10 wid_100 d_inblock">
            <input
              type="number"
              name="price"
              class="comm_put"
              :class="{ read_eb: view || fixedPrice(data) }"
              :style="view ? 'background-color: #ebebeb; padding: 0px 15px;' : ''"
              :value="data.money"
              placeholder="0"
              :disabled="view || fixedPrice(data)"
            />
          </div>
          <span class="d_inblock ml5 mt10">원</span>
        </div>
      </div>
    </div>
    <div class="price__box mt10" :class="{ pdfBlock: view }">
      <div class="price_row tac">
        <p class="commp d_inblock">
          <img src="@/assets/images/sub/ic_won.png" />
          청구 금액 총액
        </p>
        <div class="wid120 m__putbox d_inblock ml30">
          <input id="treatPrice" type="number" class="comm_put bg_white" :style="view ? 'background-color: #fff; padding: 0px 15px;' : ''" :value="data2.value" placeholder="0" disabled />
        </div>
        <p class="commp d_inblock ml10">원</p>
      </div>
    </div>
  </fragment>
</template>
<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'OralCareHistory2020',
  props: ['dataArray', 'view', 'statementName'],
  data() {
    return {
      data1: [],
      data2: [],
      list: [],
    };
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapState('status', ['oralCareItemsSeoul', 'oralCareItemsBusan']),
    ...mapGetters('user', ['districtCodeFirst']),
    labels() {
      if (this.districtCodeFirst === 'A') {
        return [
          '치아홈메우기',
          '치석제거(부분)',
          '치석제거(전체)',
          '전문가 구강위생관리',
          '불소도포',
          '방사선 촬영(치근단)',
          '방사선 촬영(파노라마)',
          '충전치료(아말감)',
          '충전치료(레진)',
          '충전치료(G.I)',
          '충전치료(인레이)',
          '충전치료(크라운)',
          '발치',
          '치수/치근단 치료',
          '유치발치',
          '간격유지장치',
        ];
      } else {
        return ['충전치료(인레이)', '충전치료(크라운)'];
      }
    },
  },
  watch: {
    'data1.value'() {
      this.getList();
    },
  },
  created() {
    this.data1 = this.formContents[this.statementName][this.dataArray.data1]; // s_treatment
    this.data2 = this.formContents[this.statementName][this.dataArray.data2]; // s_price
    this.getList();
  },
  methods: {
    rowClass(type, index) {
      let newRow = true;
      if (index > 0 && this.list[index - 1].contents === this.list[index].contents) {
        newRow = false;
      }
      if (type === 1) {
        const clazz = newRow ? 'mt10' : 're__form__row';
        return this.view ? ['pdfBlock', clazz] : clazz;
      } else {
        return newRow ? 'mt20' : 'pt30';
      }
    },
    fixedPrice() {
      return this.districtCodeFirst === 'D';
    },
    getList() {
      let list = [];
      this.data1.value.forEach((data, contentsIndex) => {
        let obj = {
          contentsIndex,
        };
        Object.assign(obj, data);
        list.push(obj);
      });
      this.list = list;
    },
    checkArrEmpty(arr) {
      let status = true;
      arr.forEach(list => {
        if (list[0]) {
          status = false;
        }
      });
      return status;
    },
  },
};
</script>

<style scoped></style>
