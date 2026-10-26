<template>
  <div class="container_wrap">
    <div class="set_table">
      <div class="set__table">
        <div class="login__con tac">
          <div class="imgbox"
            ><img :src="require(`@/assets/images/common/denti_i_logo_${districtInfo.eng}.png`)" alt="덴티아이 로고" :style="['I', 'J'].includes(districtInfo.code) ? 'width: 180px' : ''"
          /></div>
          <p class="commp3 fwb c_black mt40" v-html="title"></p>
          <div class="login__form mt60">
            <form action="">
              <fieldset>
                <legend class="blind">로그인 폼</legend>
                <div class="put__set">
                  <!-- l__putbox -> input size class (l__putbox~s__putbox) -->
                  <div class="l__putbox"><input id="loginid" v-model="loginid" type="text" class="comm_put" placeholder="아이디를 입력해주세요." @keyup.enter="login" /></div>
                </div>
                <div class="put__set mt10">
                  <div class="l__putbox"><input v-model="password" type="password" class="comm_put" placeholder="비밀번호를 입력해주세요." @keyup.enter="login" /></div>
                </div>
                <div class="login_add mt10 row">
                  <div class="inner--left">
                    <div class="check_set">
                      <input id="id__remember_admin" type="checkbox" value="t" name="id_remember" class="blind" />
                      <label for="id__remember_admin">
                        <span class="icon"></span>
                        <span class="label_t">아이디 저장</span>
                      </label>
                    </div>
                  </div>
                  <div class="inner--right">
                    <a href="javascript:;" class="c_black commp fwn" @click="resetHospitalPassword">비밀번호 초기화</a>
                  </div>
                </div>
                <div class="btn__box">
                  <input type="button" class="comm__blue_btn commp wid100 mt30 btn_l_size fwb" value="로그인" @click="login" />
                </div>
              </fieldset>
            </form>
          </div>
        </div>
        <!-- login__con -->
      </div>
    </div>
  </div>
  <!--//container_wrap-->
</template>

<script>
import Login from '@/apis/Login';
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      loginid: '',
      password: '',
    };
  },
  computed: {
    ...mapState('ip', ['ip']),
    ...mapState('business', ['businessYear']),
    ...mapState('status', ['userOrganTargetTypeToName']),
    ...mapGetters('business', ['districtInfo', 'divJoin']),
    title() {
      switch (this.districtInfo.code) {
        case 'G':
          return `${this.districtInfo.name} 학생구강검진 관리자 로그인`;
        case 'I':
          return `${this.districtInfo.name}<br/>구강진료 지원사업 관리자 로그인`;
        case 'J':
          return `${this.districtInfo.name} 치과주치의<br/>관리자 로그인`;
        default:
          return `${this.districtInfo.name} 치과주치의 관리자 로그인`;
      }
    },
  },
  mounted() {
    if (this.$cookies.isKey('id__remember_admin')) {
      document.getElementById('id__remember_admin').checked = true;
      this.loginid = this.$cookies.get('id__remember_admin');
      document.getElementById('loginid').value = this.loginid;
    }
    document.getElementById('wrap').classList.add('login__page');
    document.querySelector('body').setAttribute('style', 'height: 100% !important'); // alert plugin height 이슈 처리
  },
  beforeDestroy() {
    document.getElementById('wrap').classList.remove('login__page');
    document.querySelector('body').removeAttribute('style'); // alert plugin height 이슈 처리
  },
  methods: {
    resetHospitalPassword() {
      this.$store.dispatch('popup/popupOpen', { contents: 'resetHospitalPassword' });
    },
    login() {
      if (!this.loginid) {
        this.$alert('아이디를 입력해주세요.', '알림', 'warning');
      } else if (!this.password) {
        this.$alert('비밀번호를 입력해주세요.', '알림', 'warning');
      } else {
        const form = {
          loginid: this.loginid,
          password: this.password,
        };
        Login.admin(form, this.ip).then(res => {
          if (res && res.data.rt === 200) {
            if (document.getElementById('id__remember_admin').checked) {
              this.$cookies.set('id__remember_admin', this.loginid, '30d');
            } else {
              this.$cookies.remove('id__remember_admin');
            }
            // divJoin 사용 위해 districtCode 먼저 업데이트
            this.$store.commit('user/setLoginUserInfo', { districtCode: this.districtInfo.code });
            const user = {
              accessToken: res.data.loginUserInfo.accessToken,
              refreshToken: res.data.loginUserInfo.refreshToken,
              userOrganId: res.data.loginUserInfo.userAdminId,
              userOrganTargetType: 'CT',
              districtName: this.districtInfo.name,
              userOrganTargetId: 0,
              userOrganTargetName: res.data.loginUserInfo.userAdminName,
              userOrganPasswordModify: res.data.loginUserInfo.userAdminPasswordModify,
              business: {
                businessDivisionC: this.divJoin('C') ? 'Y' : 'N',
                businessDivisionF: this.divJoin('F') ? 'Y' : 'N',
                businessDivisionE: this.divJoin('E') ? 'Y' : 'N',
              },
              adminOrganType: 'AD',
            };
            this.$store.dispatch('user/updateInfo', user);
            if (!this.isDev) {
              Gitple('update', {
                // 깃플챗 로그인
                id: `${this.districtInfo.eng}${this.businessYear}${this.isDev ? 'dev' : ''}@AD@${res.data.loginUserInfo.userAdminId}`,
                name: res.data.loginUserInfo.userOrganTargetName,
                meta: {
                  도시: this.districtInfo.name,
                  지역구: this.districtInfo.name,
                  기관유형: this.userOrganTargetTypeToName.CT,
                  기관명: '관리자',
                },
              });
            }
            this.$router.push('/').catch(() => {});
          } else {
            if (res.data.rt === 401) {
              this.$alert('아이디 또는 비밀번호를 확인해주세요.', '알림', 'error');
            } else if (res.data.rt === 400) {
              //  해당 사업 참여 기관이 아닙니다.
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
