<template>
  <div class="sub__content form__ver_1 mt30">
    <div class="browser__con">
      <div class="bg_white mt20 tac" style="width: 800px; margin: 0 auto; padding: 50px; box-sizing: border-box">
        <div class="iconbox"><img src="@/assets/images/common/ic_school_b.png" /></div>
        <p class="commp3 mt15 fwb">계약서류 및 지출 수신 이메일 설정</p>
        <p class="commp mt15 c_black2">
          검진 기관과의 계약을 위해 이메일을 입력하여 주세요.
          <br />
          등록된 이메일로 검진 기관이 계약 서류를 발송합니다.
        </p>
        <div class="basic__form_box mt50">
          <div class="row flex_set">
            <p class="flex_item scommp c_gray2 fwn d_inblock tal fw500" style="width: 120px">이메일</p>
            <div class="m__putbox wid160 d_inblock"><input v-model="email1" type="text" class="comm_put" placeholder="이메일 입력" /></div>
            <div class="m__putbox d_inblock"><p class="commp fw500 ml5 pt10">@</p></div>
            <div class="m__putbox wid160 d_inblock ml5"><input v-model="email2" type="text" class="comm_put" placeholder="이메일 입력" /></div>
          </div>
        </div>
        <p class="mt30 fw300 sscommp c_gray2">* 우측 상단의 정보 수정 페이지에서 정보 수정이 가능합니다.</p>
        <div class="row tac mt30"></div>
        <a href="javascript:;" class="d_inblock comm__blue_btn btn_m_size2" style="width: 160px" @click="change">이메일 설정하기</a>
      </div>
    </div>
  </div>
</template>

<script>
import School from '@/apis/School';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      email1: '',
      email2: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId', 'userOrganTargetType']),
  },
  methods: {
    change() {
      const email = `${this.email1}@${this.email2}`;
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(email).toLowerCase())) {
        const form = {
          schoolId: this.userOrganTargetId,
          schoolEmail: email,
        };
        School.emailModify(form).then(res => {
          if (res && res.data.rt === 200) {
            this.$alert('설정되었습니다.', '알림', 'success').then(() => {
              this.$store.commit('user/setSchoolEmail', email);
            });
          } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        });
      } else {
        this.$alert('유효한 이메일 형식이 아닙니다.', '알림', 'warning');
      }
    },
  },
};
</script>
