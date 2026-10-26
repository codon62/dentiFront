<template>
  <div class="popup_content">
    <v-popuptitle message="진료 추가" imgsrc="sub/ic_addcare.png" :data-object="dataObject"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <div class="flex_set">
        <div class="flex_item flex_size_m1">
          <p class="commp fwb">진료일자</p>
          <date v-model="date" :data="date" :customDisabled="disabledPeriod" />
        </div>
        <!-- <div class="flex_item ml20">
                    <p class="commp fwb">청구 금액</p>
                    <div class="m__putbox mt10 wid110 d_inblock"><input type="text" class="comm_put" placeholder="0"></div>
                    <span class="d_inblock ml5 fwn">원</span>
                </div> -->
      </div>

      <div class="row flex_set mt30">
        <div class="flex_item flex_size_m">
          <p class="commp fwb">치료 항목</p>
          <div class="m__putbox mt10">
            <div class="m__putbox mt10">
              <input v-model="form.contents" type="text" class="comm_put" :class="{ read_put: isCheckbox(dataObject.label) }" :readonly="isCheckbox(dataObject.label)" />
            </div>
          </div>
        </div>
        <!-- 기타의 경우에만 input으로 작성할 수 있게 되어야 함 -->
        <v-popupinput v-if="['기타'].includes(form.contents)" v-model="form.contents2" size="m4" divclass="ml10" placeholder="기타 (최대 100자)"></v-popupinput>
      </div>

      <p class="mt20 commp c_gray2">* 입력한 치료 항목에 해당하는 치아를 선택해 주세요.</p>
      <div v-if="!isCheckbox(dataObject.label) || ['기타'].includes(form.contents)" class="row mt20">
        <a href="javascript:;" class="cs_btns cs_btns1" :class="{ on: !partialTooth }" @click="partialTooth = false">전체 치아</a>
        <a href="javascript:;" class="cs_btns cs_btns1 ml5" :class="{ on: partialTooth }" @click="partialTooth = true">부분 치아</a>
      </div>

      <div v-if="partialTooth" class="tooth__con mt20">
        <div class="tooth__row">
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 8 })" @click="tooth({ position: 'rightTop', number: 8, e: $event })">8</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 7 })" @click="tooth({ position: 'rightTop', number: 7, e: $event })">7</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 6 })" @click="tooth({ position: 'rightTop', number: 6, e: $event })">6</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 5 })" @click="tooth({ position: 'rightTop', number: 5, e: $event })">5</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 4 })" @click="tooth({ position: 'rightTop', number: 4, e: $event })">4</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 3 })" @click="tooth({ position: 'rightTop', number: 3, e: $event })">3</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 2 })" @click="tooth({ position: 'rightTop', number: 2, e: $event })">2</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightTop', number: 1 })" @click="tooth({ position: 'rightTop', number: 1, e: $event })">1</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 1 })" @click="tooth({ position: 'leftTop', number: 1, e: $event })">1</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 2 })" @click="tooth({ position: 'leftTop', number: 2, e: $event })">2</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 3 })" @click="tooth({ position: 'leftTop', number: 3, e: $event })">3</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 4 })" @click="tooth({ position: 'leftTop', number: 4, e: $event })">4</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 5 })" @click="tooth({ position: 'leftTop', number: 5, e: $event })">5</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 6 })" @click="tooth({ position: 'leftTop', number: 6, e: $event })">6</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 7 })" @click="tooth({ position: 'leftTop', number: 7, e: $event })">7</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftTop', number: 8 })" @click="tooth({ position: 'leftTop', number: 8, e: $event })">8</div>
        </div>
        <div class="tooth__row">
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 8 })" @click="tooth({ position: 'rightBottom', number: 8, e: $event })">8</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 7 })" @click="tooth({ position: 'rightBottom', number: 7, e: $event })">7</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 6 })" @click="tooth({ position: 'rightBottom', number: 6, e: $event })">6</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 5 })" @click="tooth({ position: 'rightBottom', number: 5, e: $event })">5</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 4 })" @click="tooth({ position: 'rightBottom', number: 4, e: $event })">4</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 3 })" @click="tooth({ position: 'rightBottom', number: 3, e: $event })">3</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 2 })" @click="tooth({ position: 'rightBottom', number: 2, e: $event })">2</div>
          <div class="tooth_box" :class="toothSet({ position: 'rightBottom', number: 1 })" @click="tooth({ position: 'rightBottom', number: 1, e: $event })">1</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 1 })" @click="tooth({ position: 'leftBottom', number: 1, e: $event })">1</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 2 })" @click="tooth({ position: 'leftBottom', number: 2, e: $event })">2</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 3 })" @click="tooth({ position: 'leftBottom', number: 3, e: $event })">3</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 4 })" @click="tooth({ position: 'leftBottom', number: 4, e: $event })">4</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 5 })" @click="tooth({ position: 'leftBottom', number: 5, e: $event })">5</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 6 })" @click="tooth({ position: 'leftBottom', number: 6, e: $event })">6</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 7 })" @click="tooth({ position: 'leftBottom', number: 7, e: $event })">7</div>
          <div class="tooth_box" :class="toothSet({ position: 'leftBottom', number: 8 })" @click="tooth({ position: 'leftBottom', number: 8, e: $event })">8</div>
        </div>
      </div>
      <p v-if="partialTooth" class="mt10 commp c_gray2">* (치아 번호 한 번 클릭 시) 파란색은 영구치, (치아 번호 두 번 클릭 시) 빨간색은 유치를 의미합니다.</p>
      <div class="comm__line mt30"></div>
      <v-popupconfirm message="선택완료" :data-object="dataObject" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Date from '@/components/common/Date.vue';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import popupInput from '@/components/popup/PopupInput';

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
      date: '',
      partialTooth: false,
      form: {
        year: '',
        month: '',
        day: '',
        leftTop: [],
        rightTop: [],
        leftBottom: [],
        rightBottom: [],
        contents: '',
        contents2: '',
      },
    };
  },
  created() {
    if (this.dataObject.label) {
      this.partialTooth = true;
      this.form.contents = this.dataObject.label;
    }
    if (this.dataObject.index !== undefined) {
      const tooth = this.formContents.notification.n_13_tooth.value[this.dataObject.index];
      for (const i in tooth) {
        this.form[i] = tooth[i];
      }
      this.date = tooth.year + '-' + tooth.month + '-' + tooth.day;
      if (tooth.leftTop.indexOf('all') !== -1) {
        this.form.leftTop = [];
        this.partialTooth = false;
      }
    } else {
      this.date = this.getToday();
    }
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapState('status', ['treatmentItems']),
    ...mapGetters('user', ['districtCodeFirst']),
    disabledPeriod() {
      return this.districtCodeFirst === 'C' ? [null, '2024-05-01'] : null;
    },
  },
  methods: {
    ...mapActions('doc', ['toothClass']),
    ...mapMutations('doc', ['DATA_SET']),
    save() {
      if (!this.dataObject.label && this.isCheckbox(this.form.contents)) {
        // 체크박스에 이미 있는 항목인지 확인
        this.$alert('사용할 수 없는 치료 항목입니다.', '알림', 'error');
        return false;
      }
      if (this.form.contents === '기타' && this.form.contents2 === '') {
        // 미입력 확인
        this.$alert('치료 항목을 입력해주세요.', '알림', 'warning');
        return false;
      }
      if (this.form.contents === '') {
        // 미입력 확인
        this.$alert('치료 항목을 입력해주세요.', '알림', 'warning');
        return false;
      }
      if (!this.partialTooth) {
        this.form.leftTop = ['all'];
        this.form.rightTop = [];
        this.form.leftBottom = [];
        this.form.rightBottom = [];
      } else {
        if (this.form.leftTop.length + this.form.rightTop.length + this.form.leftBottom.length + this.form.rightBottom.length === 0) {
          this.$alert('치아를 선택해 주세요.', '알림', 'error');
          return false;
        }
        this.form.leftTop = this.arraySort(this.form.leftTop, true);
        this.form.rightTop = this.arraySort(this.form.rightTop);
        this.form.leftBottom = this.arraySort(this.form.leftBottom, true);
        this.form.rightBottom = this.arraySort(this.form.rightBottom);
      }
      if (this.dataObject.index !== undefined) {
        this.$store.commit('doc/OBJECT_MODIFY', { index: this.dataObject.index, id: 'n_13_tooth', form: this.form });
      } else {
        this.$store.commit('doc/OBJECT_SET', { n_13_tooth: this.form });
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
      for (const i in this.form[payload.position]) {
        valueSet.push(this.form[payload.position][i]);
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

      this.form[payload.position] = valueSet;
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
      const options = [...this.formContents.notification.n_13_check.options, ...this.formContents.notification.n_13_check.options2];
      for (const i in options) {
        if (options[i].sub) {
          const options3 = this.formContents.notification[options[i].sub].options;
          for (const j in options3) {
            if (contents === `${options[i].label}(${options3[j].label})`) {
              return true;
            }
          }
        } else if (contents === options[i].label) {
          return true;
        }
      }
      const options2 = this.formContents.notification.n_13.options;
      for (const i in options2) {
        if (contents === options2[i].label) {
          return true;
        }
      }
      return false;
    },
    toothSet(payload) {
      let obj = [];
      if (this.dataObject.index !== undefined) {
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

        const tooth = this.formContents.notification.n_13_tooth.value[this.dataObject.index];
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
      this.form.year = date[0];
      this.form.month = date[1];
      this.form.day = date[2];
    },
  },
};
</script>
