<template>
  <div class="popup_content">
    <v-popuptitle message="정보 수정" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp4 fwb">계정 정보</p>
      <div class="row flex_set mt20">
        <v-popupinput title="회원 구분" size="m" value="학교" :is-readonly="true"></v-popupinput>
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
        학교 정보
        <span class="c_red">*</span>
      </p>
      <div v-if="districtCodeFirst === 'C'" class="row flex_set mt20 flex_base">
        <div class="flex_item">
          <p class="commp fwb">
            학교 구분
            <span class="c_red">*</span>
          </p>
          <div class="comm_radio m__putbox mt10">
            <div v-for="(item, key) in schoolTypeNotNull.value" :key="key" class="radio_box d_inblock hei100 mt10" :class="{ ml20: key !== 'A' }">
              <input
                :id="'schoolType' + key"
                type="radio"
                :value="key"
                :checked="schoolInfo.schoolType === key"
                name="schoolType"
                class="blind"
                @change="schoolInfo.schoolType = $event.target.value"
              />
              <label :for="'schoolType' + key">
                <span class="icon"></span>
                <span class="label_t">{{ item }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="schoolInfo.schoolName" title="학교명" size="m" placeholder="학교명을 입력해 주세요." :required="true"></v-popupinput>
        <v-popupinput v-model="schoolInfo.schoolTel" divclass="ml20" title="학교 연락처" type="number" size="m" placeholder="학교 연락처를 입력해 주세요." :required="true"></v-popupinput>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="schoolInfo.userOrganManagerName" title="보건교사명" size="m" placeholder="보건교사명을 입력해 주세요." :required="true"></v-popupinput>
        <v-popupinput v-model="schoolInfo.userOrganManagerTel" divclass="ml20" title="보건교사 연락처" type="number" size="m" placeholder="보건교사 연락처를 입력해 주세요."></v-popupinput>
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
                :checked="schoolInfo.userOrganManagerAlarm === key"
                name="userOrganManagerAlarm"
                class="blind"
                @change="schoolInfo.userOrganManagerAlarm = $event.target.value"
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
import School from '@/apis/School';
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
      userOrganLoginId: '',
      schoolInfo: {
        districtCode: '',
        schoolId: '',
        schoolType: '',
        schoolName: '',
        schoolTel: '',
        userOrganManagerName: '',
        userOrganManagerTel: '',
        userOrganManagerAlarm: '',
      },
      password: '',
      passwordChange: '',
    };
  },
  computed: {
    ...mapState('status', ['userOrganManagerAlarm', 'schoolTypeNotNull']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode']),
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
  },
  validators: {
    'schoolInfo.schoolType': value => {
      return Validator.value(value).required();
    },
    'schoolInfo.schoolName': value => {
      return Validator.value(value).required();
    },
    'schoolInfo.schoolTel': value => {
      return Validator.value(value).required().integer().minLength(7).maxLength(11);
    },
    'schoolInfo.userOrganManagerName': value => {
      return Validator.value(value).required();
    },
    'schoolInfo.userOrganManagerTel': value => {
      return Validator.value(value).integer().minLength(10).maxLength(11);
    },
    'schoolInfo.userOrganManagerAlarm': value => {
      return Validator.value(value).required();
    },
  },
  created() {
    School.info({ schoolId: this.dataObject.schoolId }).then(res => {
      if (res && res.data.rt === 200) {
        this.userOrganLoginId = res.data.userOrganLoginId;
        this.schoolInfo.districtCode = res.data.school.districtCode;
        this.schoolInfo.schoolId = res.data.school.schoolId;
        this.schoolInfo.schoolType = this.codeToValue(res.data.school.schoolType);
        this.schoolInfo.schoolName = res.data.school.schoolName;
        this.schoolInfo.schoolTel = res.data.school.schoolTel;
        this.schoolInfo.userOrganManagerName = res.data.manager.userOrganManagerName;
        this.schoolInfo.userOrganManagerTel = res.data.manager.userOrganManagerTel;
        this.schoolInfo.userOrganManagerAlarm = this.codeToValue(res.data.manager.userOrganManagerAlarm);
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
      let validData = [
        'schoolInfo.schoolType',
        'schoolInfo.schoolName',
        'schoolInfo.schoolTel',
        'schoolInfo.userOrganManagerName',
        'schoolInfo.userOrganManagerTel',
        'schoolInfo.userOrganManagerAlarm',
      ];
      let validTitle = ['학교 구분', '학교명', '학교 연락처', '보건교사명', '보건교사 연락처', '알림톡 수신 여부'];
      this.$validate(validData).then(success => {
        if (success) {
          let form = {
            passwordChange: this.passwordChange,
            newPassword: this.password,
          };
          Object.assign(form, this.schoolInfo);
          // code convert
          form.schoolType = this.valueToCode('C0022', form.schoolType);
          form.userOrganManagerAlarm = this.valueToCode('C0018', form.userOrganManagerAlarm);
          // code convert end
          Management.schoolModify(form).then(res => {
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
