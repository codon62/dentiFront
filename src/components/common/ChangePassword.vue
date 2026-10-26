<template>
  <div class="sub__content form__ver_1 mt30">
    <div class="browser__con">
      <div class="bg_white mt20 tac" style="width: 800px; margin: 0 auto; padding: 50px; box-sizing: border-box">
        <div class="iconbox"><img src="@/assets/images/sub/ic_key_o.png" /></div>
        <p class="commp3 mt15 fwb">비밀번호 변경</p>
        <p class="commp mt15 c_black2">
          보다 안전한 서비스 이용을 위해
          <br />
          기존 설정된 사용자 비밀번호를 새로운 비밀번호로 변경해주세요.
        </p>
        <div class="basic__form_box mt50">
          <div class="row flex_set">
            <p class="flex_item scommp c_black2 fwn d_inblock tal fw500" style="width: 130px">기존 비밀번호</p>
            <div class="flex_item m__putbox d_inblock" style="width: 345px">
              <input v-model="now" type="password" class="comm_put" placeholder="현재 비밀번호를 입력해 주세요." />
            </div>
          </div>
          <div class="row flex_set">
            <p style="width: 130px"></p>
            <div class="flex_item m__putbox d_inblock" style="width: 345px">
              <p class="mt10 c_red scommp tal">※ 비밀번호 규칙 : 영문 + 숫자 + 특수문자가 혼합된 8~15자리</p>
            </div>
          </div>
          <div class="row flex_set">
            <p class="flex_item scommp c_black2 fwn d_inblock tal fw500" style="width: 130px">새 비밀번호 입력</p>
            <div class="flex_item m__putbox d_inblock" style="width: 345px">
              <input v-model="new1" type="password" class="comm_put" placeholder="새로운 비밀번호를 입력해 주세요." />
            </div>
          </div>
          <div class="row flex_set mt20">
            <p class="flex_item scommp c_black2 fwn d_inblock tal fw500" style="width: 130px">새 비밀번호 확인</p>
            <div class="flex_item m__putbox d_inblock" style="width: 345px">
              <input v-model="new2" type="password" class="comm_put" placeholder="새로운 비밀번호를 한번 더 입력해 주세요." />
            </div>
          </div>
        </div>
        <p class="mt30 fw300 sscommp c_gray2">
          * 계정 사용자가 직접 변경한 비밀번호가 아니므로, 개인 정보 보호를 위해 비밀번호를 변경해 주세요.
          <br />
          * 아래 비밀번호 변경에서 현재와 새 비밀번호를 설정한 후 ‘변경하기’ 버튼으로 설정을 완료하면 정상적인 서비스 이용이 가능합니다.
        </p>
        <div class="row tac mt30"></div>
        <a href="javascript:;" class="d_inblock comm__blue_btn btn_m_size2" style="width: 160px" @click="change">비밀번호 변경하기</a>
      </div>
    </div>
  </div>
</template>

<script>
import Admin from '@/apis/Admin';
import Hospital from '@/apis/Hospital';
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      now: '',
      new1: '',
      new2: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId', 'userOrganTargetType', 'adminOrganType', 'userOrganId']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  methods: {
    change() {
      const num = /[0-9]/;
      const eng = /[a-zA-Z]/;
      // eslint-disable-next-line
      const spc = /[\!\"#$%\&'()\*\+,\-\.\/\:;<>=\?@\[\]\\\^\_`\{|\}~]/;
      const check = this.new1.length >= 8 && this.new1.length <= 15 && eng.test(this.new1) && num.test(this.new1) && spc.test(this.new1);
      if (this.now === '') {
        this.$alert('기존 비밀번호를 입력해 주세요.', '알림', 'warning');
      } else if (this.new1 === '') {
        this.$alert('새 비밀번호를 입력해 주세요.', '알림', 'warning');
      } else if (this.new2 === '') {
        this.$alert('새 비밀번호 확인을 입력해 주세요.', '알림', 'warning');
      } else if (!check) {
        this.$alert('비밀번호 조건에 맞지 않습니다.', '알림', 'error');
      } else if (this.new1 !== this.new2) {
        this.$alert('새 비밀번호가 일치하지 않습니다.', '알림', 'error');
      } else {
        let form = {
          password: this.now,
          newPassword: this.new1,
        };
        let request = '';
        if (this.adminOrganType === 'AD') {
          request = Admin.passwordModify;
          form.userAdminId = this.userOrganId;
        } else {
          request = Hospital.passwordModify;
          form.userOrganTargetId = this.userOrganTargetId;
          form.userOrganTargetType = this.valueToCode('C0006', this.userOrganTargetType);
        }
        request(form).then(res => {
          if (res && res.data.rt === 200) {
            this.$alert('변경되었습니다.', '알림', 'success').then(() => {
              const passwordModify = this.adminOrganType === 'AD' ? res.data.userAdminPasswordModify : res.data.userOrganPasswordModify;
              this.$store.commit('user/setUserOrganPasswordModify', passwordModify);
            });
          } else {
            if (res.data.rt === 400) {
              this.$alert(res.data.rtMsg, '알림', 'error');
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          }
        });
      }
    },
  },
};
</script>
