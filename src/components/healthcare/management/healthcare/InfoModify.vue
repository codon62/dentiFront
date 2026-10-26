<template>
  <div class="popup_content">
    <v-popuptitle message="정보 수정" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp4 fwb">계정 정보</p>
      <div class="row flex_set mt30">
        <v-popupinput title="회원 구분" size="m" :value="healthCareTitle" :is-readonly="true"></v-popupinput>
        <v-popupinput
          divclass="ml20"
          :title="districtTitle"
          size="m"
          :value="`${healthCareInfo.districtDoName} ${districtCodeFirst === 'C' ? healthCareInfo.districtSiName : healthCareInfo.districtGunguName}`"
          :is-readonly="true"
        ></v-popupinput>
      </div>
      <div class="row flex_set mt20">
        <v-popupinput v-model="healthCareInfo.userOrganLoginId" title="아이디" size="m" placeholder="아이디를 입력해 주세요." :required="true"></v-popupinput>
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
      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="healthCareInfo.userOrganManagerName" title="담당자명" size="m" placeholder="담당자명을 입력해 주세요." :required="true"></v-popupinput>
        <v-popupinput v-model="healthCareInfo.userOrganManagerTel" divclass="ml20" title="연락처" type="number" size="m" placeholder="연락처를 입력해 주세요." :required="true"></v-popupinput>
        <div class="flex_item flex_size_m5 ml30">
          <p class="commp fwb">
            알림톡 수신 여부
            <span class="c_red">*</span>
          </p>
          <div class="comm_radio m__putbox mt10">
            <div v-for="(item, key) in userOrganManagerAlarm.value" :key="key" class="radio_box d_inblock hei100 mt10" :class="{ ml20: key !== 'Y' }">
              <input
                :id="'orm_' + key"
                type="radio"
                :value="key"
                :checked="healthCareInfo.userOrganManagerAlarm === key"
                name="userOrganManagerAlarm"
                class="blind"
                @change="healthCareInfo.userOrganManagerAlarm = $event.target.value"
              />
              <label :for="'orm_' + key">
                <span class="icon"></span>
                <span class="label_t">{{ item }}</span>
              </label>
            </div>
          </div>
        </div>
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
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import popupInput from '@/components/popup/PopupInput.vue';
import { mapGetters, mapState } from 'vuex';

Vue.use(SimpleVueValidation);
SimpleVueValidation.extendTemplates({
  required: '필수 입력 항목입니다.',
  integer: '잘못된 입력값입니다.',
  minLength: '잘못된 입력값입니다.',
  maxLength: '잘못된 입력값입니다.',
});
const Validator = SimpleVueValidation.Validator;

export default {
  props: ['dataObject'],
  data() {
    return {
      healthCareInfo: {
        healthCareId: '',
        healthCareName: '',
        districtDoName: '',
        districtSiName: '',
        districtGunguName: '',
        districtCode: '',
        userOrganId: '',
        userOrganLoginId: '',
        ormId: '',
        userOrganManagerName: '',
        userOrganManagerTel: '',
        userOrganManagerAlarm: '',
      },
      password: '',
      passwordChange: '',
    };
  },
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapState('status', ['userOrganManagerAlarm']),
    ...mapGetters('business', ['healthCareTitle']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode']),

    districtTitle() {
      return this.districtCodeFirst === 'J' ? '교육지원청' : '도시명';
    },
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
  },
  validators: {
    'healthCareInfo.userOrganLoginId': value => {
      return Validator.value(value).required();
    },
    'healthCareInfo.userOrganManagerName': value => {
      return Validator.value(value).required();
    },
    'healthCareInfo.userOrganManagerTel': value => {
      return Validator.value(value).required().integer().minLength(10).maxLength(11);
    },
    'healthCareInfo.userOrganManagerAlarm': value => {
      return Validator.value(value).required();
    },
  },
  created() {
    Management.healthCareInfo({ healthCareId: this.dataObject.healthCareId }).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.healthCareInfo.userOrganManagerAlarm = this.codeToValue(res.data.healthCareInfo.userOrganManagerAlarm);
        // code convert end
        this.healthCareInfo = res.data.healthCareInfo;
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
      let validData = ['healthCareInfo.userOrganLoginId', 'healthCareInfo.userOrganManagerName', 'healthCareInfo.userOrganManagerTel', 'healthCareInfo.userOrganManagerAlarm'];
      let validTitle = ['아이디', '담당자명', '연락처', '알림톡 수신 여부'];
      this.$validate(validData).then(success => {
        if (success) {
          const form = {
            districtCode: this.healthCareInfo.districtCode,
            userOrganLoginId: this.healthCareInfo.userOrganLoginId,
            passwordChange: this.passwordChange,
            newPassword: this.password,
            healthCareId: this.healthCareInfo.healthCareId,
            userOrganManagerName: this.healthCareInfo.userOrganManagerName,
            userOrganManagerTel: this.healthCareInfo.userOrganManagerTel,
            userOrganManagerAlarm: this.valueToCode('C0018', this.healthCareInfo.userOrganManagerAlarm),
          };
          Management.healthCareModify(form).then(res => {
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
