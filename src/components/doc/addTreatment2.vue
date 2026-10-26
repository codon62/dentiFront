<template>
  <div class="popup_content">
    <v-popuptitle message="진료 추가" imgsrc="sub/ic_addcare.png" :data-object="dataObject"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <div class="flex_set">
        <div class="flex_item flex_size_m1">
          <p class="commp fwb">진료일자</p>
          <date v-model="date" :data="date" />
        </div>
        <div v-if="districtCodeFirst === 'A' || isBusanGuitar" class="flex_item ml20">
          <p class="commp fwb">청구 금액</p>
          <div class="m__putbox mt10 wid110 d_inblock">
            <input v-model="listForm.price" type="number" class="comm_put" :class="{ read_put: fixedPrice }" placeholder="0" @keypress="isNumber($event)" :readonly="fixedPrice" />
          </div>
          <span class="d_inblock ml5 fwn">원</span>
        </div>
      </div>

      <div class="row flex_set mt30">
        <div class="flex_item flex_size_m">
          <p class="commp fwb">치료 항목</p>
          <div class="m__putbox mt10">
            <div v-if="dataObject.label" class="m__putbox mt10"><input type="text" class="comm_put read_put" :value="dataObject.label" readonly /></div>
            <select v-else-if="districtCodeFirst === 'A'" v-model="contents" class="comm_select" @change="form.contents = ''">
              <option v-for="item in oralCareItemsSeoul" :key="item" :value="item">{{ item }}</option>
              <option value="기타" selected>기타</option>
            </select>
          </div>
        </div>
        <!-- 기타의 경우에만 input으로 작성할 수 있게 되어야 함 -->
        <v-popupinput v-if="districtCodeFirst === 'A' && contents === '기타'" v-model="form.contents" size="m4" divclass="ml10" placeholder="기타"></v-popupinput>
        <v-popupinput
          v-else-if="isBusanGuitar"
          v-model="form.contents2"
          size="m4"
          divclass="ml10"
          placeholder="기타 서비스를 모두 입력해 주세요."
          :is-readonly="dataObject.contentsIndex !== undefined"
        ></v-popupinput>
        <v-popupinput
          v-else-if="districtCodeFirst === 'A' && ['충전치료(인레이)', '충전치료(크라운)'].indexOf(dataObject.label) !== -1"
          v-model="form.contents2"
          size="m"
          divclass="ml10"
          placeholder="입력"
          :is-readonly="dataObject.contentsIndex !== undefined"
        ></v-popupinput>
      </div>
      <p class="mt20 commp c_gray2">* 입력한 치료 항목에 해당하는 치아를 선택해 주세요.</p>
      <div v-if="!isCheckbox(dataObject.label)" class="row mt20">
        <a href="javascript:;" class="cs_btns cs_btns1" :class="{ on: !partialTooth }" @click="partialTooth = false">전체 치아</a>
        <a href="javascript:;" class="cs_btns cs_btns1 ml5" :class="{ on: partialTooth }" @click="partialTooth = true">부분 치아</a>
      </div>

      <div v-if="partialTooth" class="tooth__con mt20">
        <div class="tooth__row">
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 8 })" @click="tooth({ position: 'rightTop', number: 8, e: $event })">8</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 7 })" @click="tooth({ position: 'rightTop', number: 7, e: $event })">7</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 6 })" @click="tooth({ position: 'rightTop', number: 6, e: $event })">6</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 5 })" @click="tooth({ position: 'rightTop', number: 5, e: $event })"> 5 </div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 4 })" @click="tooth({ position: 'rightTop', number: 4, e: $event })"> 4 </div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 3 })" @click="tooth({ position: 'rightTop', number: 3, e: $event })"> 3 </div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 2 })" @click="tooth({ position: 'rightTop', number: 2, e: $event })"> 2 </div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 1 })" @click="tooth({ position: 'rightTop', number: 1, e: $event })"> 1 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 1 })" @click="tooth({ position: 'leftTop', number: 1, e: $event })"> 1 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 2 })" @click="tooth({ position: 'leftTop', number: 2, e: $event })"> 2 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 3 })" @click="tooth({ position: 'leftTop', number: 3, e: $event })"> 3 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 4 })" @click="tooth({ position: 'leftTop', number: 4, e: $event })"> 4 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 5 })" @click="tooth({ position: 'leftTop', number: 5, e: $event })"> 5 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 6 })" @click="tooth({ position: 'leftTop', number: 6, e: $event })">6</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 7 })" @click="tooth({ position: 'leftTop', number: 7, e: $event })">7</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 8 })" @click="tooth({ position: 'leftTop', number: 8, e: $event })">8</div>
        </div>
        <div class="tooth__row">
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 8 })" @click="tooth({ position: 'rightBottom', number: 8, e: $event })">8</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 7 })" @click="tooth({ position: 'rightBottom', number: 7, e: $event })">7</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 6 })" @click="tooth({ position: 'rightBottom', number: 6, e: $event })">6</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 5 })" @click="tooth({ position: 'rightBottom', number: 5, e: $event })"> 5 </div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 4 })" @click="tooth({ position: 'rightBottom', number: 4, e: $event })"> 4 </div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 3 })" @click="tooth({ position: 'rightBottom', number: 3, e: $event })"> 3 </div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 2 })" @click="tooth({ position: 'rightBottom', number: 2, e: $event })"> 2 </div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 1 })" @click="tooth({ position: 'rightBottom', number: 1, e: $event })"> 1 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 1 })" @click="tooth({ position: 'leftBottom', number: 1, e: $event })"> 1 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 2 })" @click="tooth({ position: 'leftBottom', number: 2, e: $event })"> 2 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 3 })" @click="tooth({ position: 'leftBottom', number: 3, e: $event })"> 3 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 4 })" @click="tooth({ position: 'leftBottom', number: 4, e: $event })"> 4 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 5 })" @click="tooth({ position: 'leftBottom', number: 5, e: $event })"> 5 </div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 6 })" @click="tooth({ position: 'leftBottom', number: 6, e: $event })">6</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 7 })" @click="tooth({ position: 'leftBottom', number: 7, e: $event })">7</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 8 })" @click="tooth({ position: 'leftBottom', number: 8, e: $event })">8</div>
        </div>
      </div>
      <p v-if="partialTooth" class="mt10 commp c_gray2"> * (치아 번호 한 번 클릭 시) 파란색은 영구치, (치아 번호 두 번 클릭 시) 빨간색은 유치를 의미합니다. </p>
      <div class="comm__line mt30"></div>
      <v-popupconfirm message="선택완료" :data-object="dataObject" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Date from '@/components/common/Date.vue';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import popupInput from '@/components/popup/PopupInput.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    Date,
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
  },
  props: ['dataObject'],
  data() {
    return {
      fixedPrice: false,
      date: '',
      contents: '',
      partialTooth: true,
      form: {
        contents: '',
        contents2: '',
        list: [],
      },
      listForm: {
        year: '',
        month: '',
        day: '',
        leftTop: [],
        rightTop: [],
        leftBottom: [],
        rightBottom: [],
        price: '',
        copayPrice: '',
      },
    };
  },
  created() {
    if (!this.dataObject.label) {
      if (this.districtCodeFirst === 'A') {
        this.contents = '기타'; // 구강진료 항목 추가 전까지 기타 고정
      }
    } else {
      if (this.districtCodeFirst === 'D') {
        // 부산시 아동치과주치의
        if (this.dataObject.label === '충전치료(인레이)') {
          this.fixedPrice = true;
          this.listForm.price = 250000;
          this.listForm.copayPrice = 30000;
        } else if (this.dataObject.label === '충전치료(크라운)') {
          this.fixedPrice = true;
          this.listForm.price = 300000;
          this.listForm.copayPrice = 40000;
        }
      }
    }
    if (this.dataObject.contentsIndex !== undefined) {
      this.form.contents2 = this.formContents.statement.s_tooth.value[this.dataObject.contentsIndex].contents2;
    }
    if (this.dataObject.contentsIndex !== undefined && this.dataObject.listIndex !== undefined) {
      const tooth = this.formContents.statement.s_tooth.value[this.dataObject.contentsIndex].list[this.dataObject.listIndex];
      for (const i in tooth) {
        this.listForm[i] = tooth[i];
      }
      if (tooth.leftTop.indexOf('all') !== -1) {
        this.listForm.leftTop = [];
        this.partialTooth = false;
      }
      this.date = tooth.year + '-' + tooth.month + '-' + tooth.day;
    } else {
      this.date = this.getToday();
    }
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapState('status', ['oralCareItemsSeoul', 'oralCareItemsBusan']),
    ...mapGetters('user', ['districtCodeFirst']),
    isBusanGuitar() {
      return this.districtCodeFirst === 'D' && this.dataObject.label === '기타';
    },
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
  methods: {
    ...mapActions('doc', ['toothClass']),
    ...mapMutations('doc', ['DATA_SET']),
    isNumber(e) {
      const charCode = e.which;
      if (charCode < 48 || charCode > 57) {
        e.preventDefault();
      } else {
        return true;
      }
    },
    save() {
      if (this.dataObject.label) {
        // 일자 추가 or 체크박스 선택 or 수정
        this.form.contents = this.dataObject.label;
      } else if (this.contents !== '기타') {
        // select 항목 선택시
        this.form.contents = this.contents;
      } else if (this.isCheckbox(this.form.contents)) {
        // 체크박스에 이미 있는 항목인지 확인
        this.$alert('사용할 수 없는 치료 항목입니다.', '알림', 'error');
        return false;
      }
      if (this.form.contents === '') {
        // 미선택 확인
        this.$alert('치료 항목을 입력해주세요.', '알림', 'warning');
        return false;
      }
      if (this.isBusanGuitar && this.listForm.price > 12000) {
        this.$alert('기타 항목은 청구 금액이 12,000원을 넘을 수 없습니다.', '알림', 'warning');
        return false;
      }
      if (!this.partialTooth) {
        this.listForm.leftTop = ['all'];
        this.listForm.rightTop = [];
        this.listForm.leftBottom = [];
        this.listForm.rightBottom = [];
      } else {
        if (this.listForm.leftTop.length + this.listForm.rightTop.length + this.listForm.leftBottom.length + this.listForm.rightBottom.length === 0) {
          this.$alert('치아를 선택해 주세요.', '알림', 'error');
          return false;
        }
        this.listForm.leftTop = this.arraySort(this.listForm.leftTop, true);
        this.listForm.rightTop = this.arraySort(this.listForm.rightTop);
        this.listForm.leftBottom = this.arraySort(this.listForm.leftBottom, true);
        this.listForm.rightBottom = this.arraySort(this.listForm.rightBottom);
      }
      if (!this.listForm.price) {
        this.listForm.price = 0;
      }
      if (!this.listForm.copayPrice) {
        this.listForm.copayPrice = 0;
      }
      this.form.list.push(this.listForm);
      if (this.dataObject.listIndex !== undefined) {
        // 수정
        this.$store.commit('doc/LIST_MODIFY', { contentsIndex: this.dataObject.contentsIndex, listIndex: this.dataObject.listIndex, id: 's_tooth', form: this.listForm });
        this.$store.commit('update');
      } else if (this.dataObject.contentsIndex !== undefined) {
        // 일자 추가
        this.$store.commit('doc/LIST_SET', { contentsIndex: this.dataObject.contentsIndex, id: 's_tooth', form: this.listForm });
        this.$store.commit('update');
      } else {
        // 진료 추가
        this.$store.commit('doc/OBJECT_SET', { s_tooth: this.form });
      }
      this.$store.dispatch('popup/popupClose');
    },
    tooth(payload) {
      this.toothClass(payload);
      const { position, number, e } = payload;
      const classList = e.target.getAttribute('class');
      const redCheck = classList.indexOf('on2');
      const blueCheck = classList.indexOf('on1');

      let valueSet = [];
      for (const i in this.listForm[payload.position]) {
        valueSet.push(this.listForm[payload.position][i]);
      }

      let blueNum = 0;
      let redNum = 0;
      switch (position) {
        case 'rightTop':
          blueNum = 1;
          redNum = 5;
          break;
        case 'leftTop':
          blueNum = 2;
          redNum = 6;
          break;
        case 'leftBottom':
          blueNum = 3;
          redNum = 7;
          break;
        case 'rightBottom':
          blueNum = 4;
          redNum = 8;
          break;
      }
      const blueVal = blueNum + String(number);
      const redVal = redNum + String.fromCharCode(64 + number);

      if (blueCheck !== -1) {
        valueSet.push(blueVal);
      } else {
        valueSet = valueSet.filter(value => value !== blueVal);
        if (redCheck !== -1) {
          valueSet.push(redVal);
        } else {
          valueSet = valueSet.filter(value => value !== redVal);
        }
      }

      this.listForm[payload.position] = valueSet;
    },
    arraySort(arr, reverse) {
      arr.sort(function (a, b) {
        const aa = a.charAt(0) <= 4 ? a.charAt(1) : a.charCodeAt(1) - 64;
        const bb = b.charAt(0) <= 4 ? b.charAt(1) : b.charCodeAt(1) - 64;
        return reverse ? aa - bb : bb - aa;
      });
      return arr;
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
    isCheckbox(contents) {
      return this.labels.indexOf(contents) !== -1;
    },
    toothSet(payload) {
      let obj = [];
      if (this.dataObject.contentsIndex !== undefined && this.dataObject.listIndex !== undefined) {
        const { position, number } = payload;
        let blueNum = 0;
        let redNum = 0;
        switch (position) {
          case 'rightTop':
            blueNum = 1;
            redNum = 5;
            break;
          case 'leftTop':
            blueNum = 2;
            redNum = 6;
            break;
          case 'leftBottom':
            blueNum = 3;
            redNum = 7;
            break;
          case 'rightBottom':
            blueNum = 4;
            redNum = 8;
            break;
        }
        const blueVal = blueNum + String(number);
        const redVal = redNum + String.fromCharCode(64 + number);

        const tooth = this.formContents.statement.s_tooth.value[this.dataObject.contentsIndex].list[this.dataObject.listIndex];
        if (tooth[position].indexOf(blueVal) !== -1) {
          obj.push('on1');
        }
        if (tooth[position].indexOf(redVal) !== -1) {
          obj.push('on2');
        }
      }
      return obj;
    },
  },
  watch: {
    date() {
      const date = this.date.split('-');
      this.listForm.year = date[0];
      this.listForm.month = date[1];
      this.listForm.day = date[2];
    },
  },
};
</script>
