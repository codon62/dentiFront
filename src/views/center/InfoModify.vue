<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        시설(센터) 정보
      </p>
    </div>

    <!-- form__ver_1 -->
    <div class="sub__content form__ver_1 bg_white mt30">
      <div class="sub__section mt30 mb30">
        <p class="commp2 fwb">시설(센터) 정보</p>
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
              시설(센터)명
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input v-model="centerInfo.centerName" type="text" class="comm_put" placeholder="시설(센터)명을 입력해 주세요." /></div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="scommp c_black2 fwn">
              연락처
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input v-model="centerInfo.centerTel" type="number" class="comm_put" placeholder="연락처를 입력해 주세요.(01012345678)" /></div>
          </div>
        </div>
        <div class="row flex_set mt20 flex_left">
          <div class="flex_item flex_size_m5">
            <p class="scommp c_black2 fwn">
              담당자명
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input v-model="centerInfo.userOrganManagerName" type="text" class="comm_put" placeholder="담당자명을 입력해 주세요." /></div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="scommp c_black2 fwn">
              담당자 연락처
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input v-model="centerInfo.userOrganManagerTel" type="number" class="comm_put" placeholder="담당자 연락처를 입력해 주세요.(01012345678)" /></div>
          </div>
        </div>
        <div class="row flex_set mt20 flex_left">
          <div class="flex_item flex_size_m2">
            <p class="scommp c_black2 fwn">주소</p>
            <div class="m__putbox mt10"><input v-model="centerInfo.centerAddress" type="text" class="comm_put" placeholder="주소를 입력해 주세요." /></div>
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
import Center from '@/apis/Center';
import { mapState } from 'vuex';
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
  computed: {
    ...mapState('user', ['userOrganTargetId']),
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
      return Validator.value(value).required().integer().minLength(10).maxLength(11);
    },
  },
  created() {
    Center.centerInfo({ centerId: this.userOrganTargetId }).then(res => {
      if (res && res.data.rt === 200) {
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
          this.$confirm('저장하시겠습니까?', '알림', 'question')
            .then(() => {
              let form = {
                passwordChange: this.passwordChange,
                newPassword: this.password,
              };
              Object.assign(form, this.centerInfo);
              Center.centerModify(form).then(res => {
                if (res && res.data.rt === 200) {
                  this.$store.commit('user/setLoginUserInfo', { userOrganTargetName: this.centerInfo.centerName });
                  this.$alert('변경되었습니다.', '알림', 'success').then(() => {
                    this.$router.push('/center');
                  });
                } else {
                  alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
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
