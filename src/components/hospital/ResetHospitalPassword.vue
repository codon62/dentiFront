<template>
  <div class="popup_content">
    <v-popuptitle message="비밀번호 초기화 (병원 전용)" imgsrc="sub/ic_passwordreset.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="c_red scommp">※ 비밀번호 초기화는 병원만 가능합니다.</p>
      <p class="c_red scommp mt5">※ 모든 정보를 정확하게 입력해야 비밀번호 초기화가 가능합니다.</p>
      <div class="row flex_set mt20">
        <v-popupinput v-model="hospitalCeo.value" :title="hospitalCeo.title" size="m4" :placeholder="hospitalCeo.title + '을' + ph"></v-popupinput>
        <v-popupinput v-model="hospitalTel.value" :title="hospitalTel.title" size="m4" divclass="ml20" type="number" :placeholder="hospitalTel.title + '를' + ph"></v-popupinput>
      </div>
      <div class="row flex_set mt30">
        <v-popupinput
          v-if="districtInfo.code !== 'B'"
          v-model="hospitalRegNum.value"
          :title="hospitalRegNum.title"
          size="m4"
          type="number"
          :placeholder="hospitalRegNum.title + '를' + ph"
        ></v-popupinput>
        <v-popupinput
          v-model="hospitalMedicalNum.value"
          :title="hospitalMedicalNum.title"
          size="m4"
          :divclass="{ ml20: districtInfo.code !== 'B' }"
          type="number"
          :placeholder="hospitalMedicalNum.title + '를' + ph"
        ></v-popupinput>
      </div>
      <div class="comm__line mt30"></div>
      <v-popupconfirm message="초기화" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import popupInput from '@/components/popup/PopupInput.vue';
import Hospital from '@/apis/Hospital';
import { mapGetters, mapState } from 'vuex';

Vue.use(SimpleVueValidation);
SimpleVueValidation.extendTemplates({
  required: '필수 입력 항목입니다.',
  integer: '잘못된 입력값입니다.',
});
const Validator = SimpleVueValidation.Validator;

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
  },
  data() {
    return {
      ph: ' 입력해주세요.',
      hospitalCeo: { title: '대표자명', value: '' },
      hospitalTel: { title: '병원 전화번호', value: '' },
      hospitalRegNum: { title: '사업자등록번호', value: '' },
      hospitalMedicalNum: { title: '요양기관번호', value: '' },
    };
  },
  computed: {
    ...mapState('business', ['businessYear']),
    ...mapGetters('business', ['districtInfo']),
  },
  validators: {
    'hospitalCeo.value': value => {
      return Validator.value(value).required();
    },
    'hospitalTel.value': value => {
      return Validator.value(value).required().integer();
    },
    'hospitalRegNum.value': value => {
      return Validator.value(value).required().integer();
    },
    'hospitalMedicalNum.value': value => {
      return Validator.value(value).required().integer();
    },
  },
  methods: {
    save() {
      let validData = ['hospitalCeo', 'hospitalTel'];
      if (this.districtInfo.code !== 'B') {
        validData.push('hospitalRegNum');
      }
      validData.push('hospitalMedicalNum');
      let validTarget = [];
      validData.forEach(item => {
        validTarget.push(item + '.value');
      });
      this.$validate(validTarget).then(success => {
        if (success) {
          let form = {
            hospitalCeo: this.hospitalCeo.value,
            hospitalTel: this.hospitalTel.value,
            hospitalRegNum: this.hospitalRegNum.value,
            hospitalMedicalNum: this.hospitalMedicalNum.value,
          };
          Hospital.passwordReset(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('', '알림', 'success', { html: `초기화되었습니다.<br>초기화된 비밀번호 : ${this.businessYear}` }).then(() => {
                this.$store.dispatch('popup/popupClose');
              });
            } else {
              if (res.data.rt === 401 || res.data.rt === 417) {
                this.$alert('입력하신 정보에 해당하는 병원이 존재하지 않습니다.', '알림', 'error');
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            }
          });
        } else {
          this.validError(validData, validTarget);
        }
      });
    },
    validError(validData, validTarget) {
      let errorMsg = '';
      validData.forEach((item, index) => {
        if (this.validation.hasError(validTarget[index])) {
          if (errorMsg !== '') {
            errorMsg += '<br/>';
          }
          errorMsg += '<b>' + this[item].title + '</b> : ' + this.validation.firstError(validTarget[index]);
        }
      });
      this.$alert('', '알림', 'warning', { html: errorMsg });
    },
  },
};
</script>
