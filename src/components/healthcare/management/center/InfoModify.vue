<template>
  <div class="popup_content">
    <v-popuptitle message="정보 수정" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp4 fwb">계정 정보</p>
      <div class="row flex_set mt20">
        <v-popupinput title="회원 구분" size="m" value="시설(센터)" :is-readonly="true"></v-popupinput>
      </div>
      <div class="row flex_set mt20">
        <v-popupinput title="아이디" size="m" :value="userOrganLoginId" :is-readonly="true"></v-popupinput>
        <v-popupinput v-model="password" divclass="ml20" title="비밀번호" size="m" type="password" placeholder="비밀번호를 입력해 주세요." :is-readonly="passwordChange !== 'Y'"></v-popupinput>
        <div class="flex_item flex_size_m5 ml20">
          <div class="check_set mb10">
            <input id="passwordChange" type="checkbox" value="Y" class="blind" @change="passwordChangeCheck($event.target)" />
            <label for="passwordChange">
              <span class="icon"></span>
              <span class="label_t">변경</span>
            </label>
          </div>
        </div>
      </div>
      <p class="mt10 c_red scommp tal" style="margin-left: 270px">※ 비밀번호 규칙 : 영문 + 숫자 + 특수문자가 혼합된 8~15자리</p>
      <div class="comm__line mt30"></div>
      <p class="commp4 fwb mt30">
        시설(센터) 정보
        <span class="c_red">*</span>
      </p>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="centerInfo.centerName" title="시설(센터)명" size="m" placeholder="시설(센터)명을 입력해 주세요." :required="true"></v-popupinput>
        <v-popupinput v-model="centerInfo.centerTel" divclass="ml20" title="연락처" type="number" size="m" placeholder="연락처를 입력해 주세요." :required="true"></v-popupinput>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="centerInfo.userOrganManagerName" title="담당자명" size="m" placeholder="담당자명을 입력해 주세요." :required="true"></v-popupinput>
        <v-popupinput v-model="centerInfo.userOrganManagerTel" divclass="ml20" title="담당자 연락처" type="number" size="m" placeholder="담당자 연락처를 입력해 주세요."></v-popupinput>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="centerInfo.centerAddress" title="주소" size="m4" placeholder="주소를 입력해 주세요."></v-popupinput>
      </div>
      <div class="comm__line mt30"></div>
      <v-popupconfirm message="수정" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import Management from '@/apis/Management';
import Center from '@/apis/Center';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import popupInput from '@/components/popup/PopupInput.vue';

Vue.use(SimpleVueValidation);
SimpleVueValidation.extendTemplates({
  required: '필수 입력 항목입니다.',
  integer: '잘못된 입력값입니다.',
  minLength: '잘못된 입력값입니다.',
  maxLength: '잘못된 입력값입니다.',
});
const Validator = SimpleVueValidation.Validator;

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
  },
  props: ['dataObject'],
  data() {
    return {
      userOrganLoginId: '',
      centerInfo: {
        districtCode: '',
        centerId: '',
        centerName: '',
        centerTel: '',
        centerAddress: '',
        userOrganManagerName: '',
        userOrganManagerTel: '',
      },
      password: '',
      passwordChange: '',
    };
  },
  validators: {
    'centerInfo.centerName': value => {
      return Validator.value(value).required();
    },
    'centerInfo.centerTel': value => {
      return Validator.value(value).required().integer().minLength(7).maxLength(11);
    },
    'centerInfo.userOrganManagerName': value => {
      return Validator.value(value).required();
    },
    'centerInfo.userOrganManagerTel': value => {
      return Validator.value(value).integer().minLength(10).maxLength(11);
    },
  },
  created() {
    Center.centerInfo({ centerId: this.dataObject.centerId }).then(res => {
      if (res && res.data.rt === 200) {
        this.userOrganLoginId = res.data.userOrganLoginId;
        this.centerInfo.districtCode = res.data.center.districtCode;
        this.centerInfo.centerId = res.data.center.centerId;
        this.centerInfo.centerName = res.data.center.centerName;
        this.centerInfo.centerTel = res.data.center.centerTel;
        this.centerInfo.centerAddress = res.data.center.centerAddress;
        this.centerInfo.userOrganManagerName = res.data.manager.userOrganManagerName;
        this.centerInfo.userOrganManagerTel = res.data.manager.userOrganManagerTel;
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    passwordChangeCheck(target) {
      this.password = '';
      this.passwordChange = target.checked ? target.value : '';
    },
    save() {
      if (this.passwordChange === 'Y') {
        const num = /[0-9]/;
        const eng = /[a-zA-Z]/;
        // eslint-disable-next-line
        const spc = /[\!\"#$%\&'()\*\+,\-\.\/\:;<>=\?@\[\]\\\^\_`\{|\}~]/;
        const check = this.password.length >= 8 && this.password.length <= 15 && eng.test(this.password) && num.test(this.password) && spc.test(this.password);
        if (this.password === '') {
          this.$alert('비밀번호를 입력해 주세요.', '알림', 'warning');
          return false;
        } else if (!check) {
          this.$alert('비밀번호 조건에 맞지 않습니다.', '알림', 'error');
          return false;
        }
      }
      let validData = ['centerInfo.centerName', 'centerInfo.centerTel', 'centerInfo.userOrganManagerName', 'centerInfo.userOrganManagerTel'];
      let validTitle = ['시설(센터)명', '연락처', '담당자명', '담당자 연락처'];
      this.$validate(validData).then(success => {
        if (success) {
          const form = {
            passwordChange: this.passwordChange,
            newPassword: this.password,
          };
          Object.assign(form, this.centerInfo);
          Management.centerModify(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('변경되었습니다.', '알림', 'success').then(() => {
                this.$store.dispatch('popup/popupClose');
                this.$store.commit('update');
              });
            } else {
              if (res.data.rt === 422) {
                this.$alert('이미 존재하는 아이디입니다.', '알림', 'error');
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            }
          });
        } else {
          this.validError(validData, validTitle);
        }
      });
    },
    validError(validData, validTitle) {
      let errorMsg = '';
      validData.forEach((item, index) => {
        if (this.validation.hasError(validData[index])) {
          if (errorMsg !== '') {
            errorMsg += '<br/>';
          }
          errorMsg += '<b>' + validTitle[index] + '</b> : ' + this.validation.firstError(validData[index]);
        }
      });
      this.$alert('', '알림', 'warning', { html: errorMsg });
    },
  },
};
</script>
