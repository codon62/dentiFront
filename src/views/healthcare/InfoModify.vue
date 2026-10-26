<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        {{ healthCareTitle }} 정보
      </p>
    </div>

    <!-- form__ver_1 -->
    <div class="sub__content form__ver_1 bg_white mt30">
      <div class="sub__section mt30 mb30">
        <p class="commp2 fwb">계정 정보</p>
        <div class="row flex_set mt20 flex_left">
          <div class="flex_item flex_size_m5">
            <p class="scommp c_black2 fwn">회원 구분</p>
            <div class="m__putbox mt10"><input type="text" class="comm_put read_put" :value="healthCareTitle" readonly /></div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="scommp c_black2 fwn">도시명</p>
            <div class="m__putbox mt10">
              <input
                type="text"
                class="comm_put read_put"
                :value="`${healthCareInfo.districtDoName} ${districtCodeFirst === 'C' ? healthCareInfo.districtSiName : healthCareInfo.districtGunguName || ''}`"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="row flex_set mt20 flex_left">
          <div class="flex_item flex_size_m5">
            <p class="scommp c_black2 fwn">
              아이디
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input v-model="healthCareInfo.userOrganLoginId" type="text" class="comm_put" /></div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="scommp c_black2 fwn">비밀번호</p>
            <div class="m__putbox mt10">
              <input v-model="password" type="password" class="comm_put" :class="{ read_put: passwordChange !== 'Y' }" placeholder="비밀번호를 입력해 주세요." :readonly="passwordChange !== 'Y'" />
            </div>
          </div>
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
        <p class="mt10 c_red scommp tal" style="margin-left: 290px">※ 비밀번호 규칙 : 영문 + 숫자 + 특수문자가 혼합된 8~15자리</p>

        <div class="comm__line mt30"></div>
        <p class="commp2 fwb mt30">{{ healthCareTitle }} 정보</p>
        <div class="row flex_set mt20 flex_left">
          <div class="flex_item flex_size_m5">
            <p class="scommp c_black2 fwn">
              담당자명
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input v-model="healthCareInfo.userOrganManagerName" type="text" class="comm_put" placeholder="담당자명을 입력해 주세요." /></div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="scommp c_black2 fwn">
              연락처
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input v-model="healthCareInfo.userOrganManagerTel" type="number" class="comm_put" placeholder="연락처를 입력해 주세요." /></div>
          </div>
          <div class="flex_item flex_size_m5 ml30">
            <p class="scommp c_black2 fwn">
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
      </div>
      <!--//sub__section-->
    </div>
    <!-- content__area -->

    <div class="btn__box mt30 mb30 row">
      <div class="inner--left">
        <a href="javascript:;" class="d_inblock comm__gray_bd_btn wid110 bg_white btn_l_size commp2 fwb off_ver" @click="$router.go(-1)">취소</a>
      </div>
      <div class="inner--right">
        <!-- 활성화시 .off_ver 제거 -->
        <a href="javascript:;" class="d_inblock comm__blue_btn wid110 btn_l_size commp2 fwb" @click="save">저장</a>
      </div>
    </div>
  </fragment>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import Management from '@/apis/Management';
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
  data() {
    return {
      healthCareInfo: {
        healthCareId: '',
        healthCareName: '',
        districtDoName: '',
        districtSiName: '',
        districtGunguName: '',
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
    ...mapState('user', ['userOrganTargetId', 'districtCode']),
    ...mapState('status', ['userOrganManagerAlarm']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['healthCareTitle']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode']),
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
    Management.healthCareInfo({ healthCareId: this.userOrganTargetId }).then(res => {
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
          this.$confirm('저장하시겠습니까?', '알림', 'question')
            .then(() => {
              const form = {
                districtCode: this.districtCode,
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
                    this.$router.push('/healthcare');
                  });
                } else {
                  if (res.data.rt === 422) {
                    this.$alert('이미 존재하는 아이디입니다.', '알림', 'error');
                  } else {
                    alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
                  }
                }
              });
            })
            .catch(() => {});
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
