<template>
  <fragment>
    <div v-if="!list.length" class="comm__bg mt20 no_data" :class="{ pdfBlock: view }">
      <p class="tac commp c_gray2 mt10 mb10">구강진료 내역이 없습니다.</p>
    </div>
    <div v-for="(data, index) in list" v-else :key="`${data.contentsIndex}_${data.listIndex}`" class="form_wrap_oral_care" :class="rowClass(index, list.length)">
      <div>
        <div>
          <p v-if="data.listIndex === 0" class="scommp c_gray2 fwn">진료내용</p>
          <div class="m__putbox mt10 wid150" style="display: flex; align-content: center">
            <template v-if="data.listIndex === 0">
              <div class="input_box_view" :class="{ read_only: !view }">
                {{ data.contents }}
              </div>
            </template>
          </div>
          <div class="m__putbox mt5 wid150">
            <template v-if="data.listIndex === 0 && data.contents2">
              <div class="input_box_view_overflow content2" :class="{ read_only: !view }">
                {{ data.contents2 }}
              </div>
            </template>
          </div>
        </div>
        <div class="ml20">
          <p class="scommp c_gray2 fwn">진료일자</p>
          <div v-if="view" class="m__putbox mt10 wid_100">
            <div class="input_box_view">
              {{ data.year + '.' + data.month + '.' + data.day }}
            </div>
          </div>
          <date v-else :data="data.year + '-' + data.month + '-' + data.day" @input="changeDate($event, data)" />
          <a v-if="!view && data1.value[data.contentsIndex].list.length - 1 === data.listIndex" href="javascript:;" class="comm__blue_bd_btn d_block btn_m_size2 commp fwn mt5" @click="addDate(data)">
            일자 추가
          </a>
        </div>
        <div class="ml20">
          <p class="scommp c_gray2 fwn">부위</p>
          <div style="display: flex; flex-wrap: wrap; width: 410px">
            <template v-if="data.leftTop.indexOf('all') !== -1">
              <div class="m__putbox mt10 wid200 inner--left">
                <div v-if="view" class="input_box_view">치아전체</div>
                <input v-else type="text" class="input_box read_only" :value="'치아전체'" readonly />
              </div>
              <div class="m__putbox mt10 wid200 inner--left ml20"></div>
            </template>
            <template v-else>
              <div class="m__putbox mt10 wid200">
                <div v-if="view" class="input_box_view">{{ data.rightTop.toString() }}</div>
                <input v-else type="text" :value="data.rightTop" class="input_box bg_white" disabled />
              </div>
              <div class="m__putbox mt10 wid200 ml10">
                <div v-if="view" class="input_box_view">{{ data.leftTop.toString() }}</div>
                <input v-else type="text" :value="data.leftTop" class="input_box bg_white" disabled />
              </div>
              <div class="m__putbox mt5 wid200">
                <div v-if="view" class="input_box_view">{{ data.rightBottom.toString() }}</div>
                <input v-else type="text" :value="data.rightBottom" class="input_box bg_white" disabled />
              </div>
              <div class="m__putbox mt5 wid200 ml10">
                <div v-if="view" class="input_box_view">{{ data.leftBottom.toString() }}</div>
                <input v-else type="text" :value="data.leftBottom" class="input_box bg_white" disabled />
              </div>
            </template>
          </div>
        </div>
        <div v-if="!view && isPopup(data)" class="form_edit_btn_wrap">
          <a href="javascript:;" class="comm__blue_bd_btn mt5 btn_m_size2 wid150 d_block" @click="modify(data)">수정</a>
        </div>
      </div>

      <div class="mt10">
        <div>
          <div class="m__putbox mt10 ml10 wid150 d_inblock">
            <div v-if="view" class="input_box_view">{{ data.price }}</div>
            <input
              v-else
              type="number"
              name="price"
              class="input_box"
              :class="{ read_only: fixedPrice(data) }"
              :value="data.price"
              placeholder="0"
              @keypress="isNumber($event)"
              :disabled="fixedPrice(data)"
              @input="
                LIST_MODIFY({ contentsIndex: data.contentsIndex, listIndex: data.listIndex, id: 's_tooth', form: { price: $event.target.value === '' ? 0 : $event.target.value } });
                getList();
              "
            />
          </div>
          <span class="d_inblock ml5 mt25">원</span>
          <div v-if="districtCodeFirst === 'D'" class="mt10">
            지원금 : {{ parseInt(data.price) - parseInt(data.copayPrice) }}원
            <br />
            환자부담 : {{ parseInt(data.copayPrice) }}원
          </div>
        </div>
      </div>
      <a
        v-if="!view && (labels.indexOf(data.contents) === -1 || formContents.statement.s_tooth.value[data.contentsIndex].list.length > 1)"
        href="javascript:;"
        class="form_delete_x_btn"
        @click="xButton(data)"
      >
        <img src="@/assets/images/common/ic_close_m.png" alt="삭제" />
      </a>
    </div>
    <div class="form_price_wrap mt10" :class="{ pdfBlock: view }">
      <div class="price_row tac">
        <p class="commp d_inblock">
          <img src="@/assets/images/sub/ic_won.png" />
          청구 금액 총액
        </p>
        <div class="wid150 m__putbox d_inblock ml30">
          <div v-if="view" class="input_box_view">{{ data2.value }}</div>
          <input
            v-else
            id="treatPrice"
            type="number"
            class="input_box"
            :value="data2.value"
            placeholder="0"
            disabled
            @keypress="isNumber($event)"
            @input="DATA_SET({ [data2.id]: $event.target.value })"
          />
        </div>
        <p class="commp d_inblock ml10 mt15">원</p>
        <div v-if="districtCodeFirst === 'D'" class="wid120 m__putbox d_inblock ml30">
          지원금 : {{ parseInt(data2.value) - parseInt(data3.value) }}원
          <br />
          환자부담 : {{ parseInt(data3.value) }}원
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import Date from '@/components/common/Date.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    Date,
  },
  props: ['dataArray', 'view'],
  data() {
    return {
      data1: [],
      data2: [],
      data3: [],
      list: [],
    };
  },
  computed: {
    ...mapState(['update']),
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
        return ['충전치료(인레이)', '충전치료(크라운)', '기타'];
      }
    },
  },
  created() {
    this.data1 = this.formContents.statement[this.dataArray.data1]; // s_tooth
    this.data2 = this.formContents.statement[this.dataArray.data2]; // treatPrice
    this.data3 = this.formContents.statement[this.dataArray.data3]; // copayPrice
  },
  mounted() {
    if (this.districtCodeFirst === 'A' && !this.view) {
      const unvisitedTreat = document.getElementById('unvisitedTreat');
      const treatPrice = document.getElementById('treatPrice');
      unvisitedTreat.addEventListener('change', () => {
        if (this.isUnvisitedTreat()) {
          treatPrice.disabled = false;
        } else {
          treatPrice.disabled = true;
          if (!this.list.length) {
            this.$store.commit('doc/DATA_SET', { treatPrice: 0 });
          }
        }
        return false;
      });
    }
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET', 'LIST_MODIFY']),
    ...mapActions('doc', ['listSplice']),
    isNumber(e) {
      const charCode = e.which;
      if (charCode < 48 || charCode > 57) {
        e.preventDefault();
      } else {
        return true;
      }
    },
    isUnvisitedTreat() {
      const defaultTreat = document.getElementById('defaultTreat');
      const defaultInput = defaultTreat.getElementsByTagName('input');
      const unvisitedTreat = document.getElementById('unvisitedTreat');
      const unvisitedInput = unvisitedTreat.getElementsByTagName('input');
      if (this.list.length) {
        return false;
      }
      for (let idx = 0; idx < defaultInput.length; idx++) {
        if (defaultInput[idx].checked) {
          return false;
        }
      }
      for (let idx = 0; idx < unvisitedInput.length; idx++) {
        if (unvisitedInput[idx].checked) {
          return true;
        }
      }
      return false;
    },
    modify(data) {
      this.$store.dispatch('popup/popupOpen', { contents: 'addTreatment2', params: { contentsIndex: data.contentsIndex, listIndex: data.listIndex, label: data.contents } });
    },
    addDate(data) {
      if (this.isPopup(data)) {
        this.$store.dispatch('popup/popupOpen', { contents: 'addTreatment2', params: { contentsIndex: data.contentsIndex, label: data.contents } });
      } else {
        const today = this.getToday().split('-');
        const listForm = {
          year: today[0],
          month: today[1],
          day: today[2],
          leftTop: ['all'],
          rightTop: [],
          leftBottom: [],
          rightBottom: [],
          price: 0,
          copayPrice: 0,
        };
        this.$store.commit('doc/LIST_SET', { id: 's_tooth', contentsIndex: data.contentsIndex, form: listForm });
        this.$store.commit('update');
      }
    },
    xButton(data) {
      this.listSplice({ id: 's_tooth', contentsIndex: data.contentsIndex, listIndex: data.listIndex });
      this.$store.commit('update');
    },
    isPopup(data) {
      return this.labels.indexOf(data.contents) === -1 || data.leftTop.indexOf('all') === -1 ? true : false;
    },
    changeDate(date, data) {
      const form = {
        year: date.split('-')[0],
        month: date.split('-')[1],
        day: date.split('-')[2],
      };
      this.$store.commit('doc/LIST_MODIFY', { id: 's_tooth', contentsIndex: data.contentsIndex, listIndex: data.listIndex, form: form });
    },
    rowClass(index, length) {
      // let newRow = true;
      // if (index > 0 && this.list[index - 1].contents === this.list[index].contents) {
      //   newRow = false;
      // }
      // if (type === 1) {
      //   const clazz = newRow ? 'mt10' : 'duplicate_form_row';
      //   return this.view ? ['pdfBlock', clazz] : clazz;
      // } else {
      //   return newRow ? 'mt20' : 'pt30';
      // }
      let classArr = [];
      if (index < length - 1 && this.list[index].contents === this.list[index + 1].contents) {
        classArr.push('duplicate_row_bottom_border');
      }
      if (index > 0 && this.list[index - 1].contents === this.list[index].contents) {
        classArr.push('duplicate_row_top_border');
      } else {
        classArr.push('mt10');
      }
      return classArr;
    },
    fixedPrice() {
      return this.districtCodeFirst === 'D';
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
    getList() {
      let list = [];
      let treatPrice = 0;
      let copayPrice = 0;
      this.data1.value.forEach((row, contentsIndex) => {
        row.list.forEach((data, listIndex) => {
          let obj = {
            contents: row.contents,
            contents2: row.contents2,
            contentsIndex: contentsIndex,
            listIndex: listIndex,
          };
          Object.assign(obj, data);
          list.push(obj);
          treatPrice += parseInt(data.price);
          copayPrice += parseInt(data.copayPrice);
        });
      });
      this.list = list;
      if (!this.view && !(this.districtCodeFirst === 'A' && this.isUnvisitedTreat())) {
        this.$store.commit('doc/DATA_SET', { treatPrice: treatPrice });
        this.$store.commit('doc/DATA_SET', { copayPrice: copayPrice });
      }
    },
  },
  watch: {
    'data1.value'() {
      this.getList();
    },
    update() {
      this.getList();
      if (this.districtCodeFirst === 'A' && !this.view) {
        if (this.isUnvisitedTreat()) {
          const treatPrice = document.getElementById('treatPrice');
          treatPrice.disabled = false;
        }
      }
    },
  },
};
</script>

<style>
.content2 {
  display: inline-flex;
  min-height: 40px;
}
</style>
