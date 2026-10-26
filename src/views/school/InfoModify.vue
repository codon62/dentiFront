<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        학교 정보
      </p>
    </div>

    <!-- form__ver_1 -->
    <div class="sub__content form__ver_1 bg_white mt30">
      <div class="sub__section mt30 mb30">
        <p class="commp2 fwb">학교 정보</p>
        <div class="row flex_set mt20 flex_left">
          <div class="flex_item flex_size_m5">
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
        <p class="mt10 c_red scommp tal">※ 비밀번호 규칙 : 영문 + 숫자 + 특수문자가 혼합된 8~15자리</p>

        <div class="row flex_set mt20 flex_left">
          <div class="flex_item flex_size_m5">
            <p class="scommp c_black2 fwn">
              학교명
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input v-model="schoolInfo.schoolName" type="text" class="comm_put" placeholder="학교명을 입력해 주세요." /></div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="scommp c_black2 fwn">
              학교 연락처
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input v-model="schoolInfo.schoolTel" type="number" class="comm_put" placeholder="학교 연락처를 입력해 주세요." /></div>
          </div>
        </div>
        <div class="row flex_set mt20 flex_left">
          <div class="flex_item flex_size_m5">
            <p class="scommp c_black2 fwn">
              보건교사명
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input v-model="schoolInfo.userOrganManagerName" type="text" class="comm_put" placeholder="보건교사명을 입력해 주세요." /></div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="scommp c_black2 fwn">
              보건교사 연락처
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input v-model="schoolInfo.userOrganManagerTel" type="number" class="comm_put" placeholder="보건교사 연락처를 입력해 주세요." /></div>
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
        <div v-if="isDivE" class="row flex_set mt20 flex_left">
          <div class="flex_item">
            <p class="scommp c_black2 fwn">
              이메일
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <div class="m__putbox wid160 d_inblock"><input v-model="email[0]" type="text" class="comm_put" placeholder="이메일 입력" /></div>
              <div class="m__putbox d_inblock"><p class="commp fw500 ml5 pt10">@</p></div>
              <div class="m__putbox wid160 d_inblock ml5"><input v-model="email[1]" type="text" class="comm_put" placeholder="이메일 입력" /></div>
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
import School from '@/apis/School';
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
      schoolInfo: {
        districtCode: '',
        schoolId: '',
        schoolName: '',
        schoolTel: '',
        userOrganManagerName: '',
        userOrganManagerTel: '',
        userOrganManagerAlarm: '',
      },
      password: '',
      passwordChange: '',
      email: ['', ''],
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId', 'business']),
    ...mapState('status', ['userOrganManagerAlarm']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
    ...mapGetters('business', ['divJoin']),
    isDivE() {
      return this.divJoin('E') && !this.divJoin('S') && this.business && this.business.businessDivisionE === 'Y';
    },
  },
  validators: {
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
      return Validator.value(value).required().integer().minLength(10).maxLength(11);
    },
    'schoolInfo.userOrganManagerAlarm': value => {
      return Validator.value(value).required();
    },
  },
  created() {
    School.info({ schoolId: this.userOrganTargetId }).then(res => {
      if (res && res.data.rt === 200) {
        this.schoolInfo.districtCode = res.data.school.districtCode;
        this.schoolInfo.schoolId = res.data.school.schoolId;
        this.schoolInfo.schoolName = res.data.school.schoolName;
        this.schoolInfo.schoolTel = res.data.school.schoolTel;
        this.schoolInfo.userOrganManagerName = res.data.manager.userOrganManagerName;
        this.schoolInfo.userOrganManagerTel = res.data.manager.userOrganManagerTel;
        this.schoolInfo.userOrganManagerAlarm = this.codeToValue(res.data.manager.userOrganManagerAlarm);
        if (res.data.school.schoolEmail) {
          this.email = res.data.school.schoolEmail.split('@');
        }
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
      const email = this.email[0] !== '' || this.email[1] !== '' ? `${this.email[0]}@${this.email[1]}` : '';
      if (this.isDivE && !email) {
        this.$alert('이메일을 입력해 주세요.', '알림', 'warning');
        return false;
      }
      if (email !== '') {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) {
          this.$alert('유효한 이메일 형식이 아닙니다.', '알림', 'warning');
          return false;
        }
      }
      let validData = ['schoolInfo.schoolName', 'schoolInfo.schoolTel', 'schoolInfo.userOrganManagerName', 'schoolInfo.userOrganManagerTel', 'schoolInfo.userOrganManagerAlarm'];
      let validTitle = ['학교명', '학교 연락처', '보건교사명', '보건교사 연락처', '알림톡 수신 여부'];
      this.$validate(validData).then(success => {
        if (success) {
          this.$confirm('저장하시겠습니까?', '알림', 'question')
            .then(() => {
              let form = {
                passwordChange: this.passwordChange,
                newPassword: this.password,
                schoolEmail: email,
              };
              Object.assign(form, this.schoolInfo);
              // code convert
              form.userOrganManagerAlarm = this.valueToCode('C0018', form.userOrganManagerAlarm);
              // code convert end
              School.modify(form).then(res => {
                if (res && res.data.rt === 200) {
                  const user = {
                    userOrganTargetName: this.schoolInfo.schoolName,
                    schoolEmail: email,
                  };
                  this.$store.commit('user/setLoginUserInfo', user);
                  this.$alert('변경되었습니다.', '알림', 'success').then(() => {
                    this.$router.push('/school');
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
