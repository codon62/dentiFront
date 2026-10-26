<template>
  <div class="container_wrap" :class="{ hei100: isClose, bg_white: isClose }">
    <div v-if="isClose" class="tac hei100" :style="`padding-top: ${['C'].includes(districtInfo.code) ? 150 : 80}px; box-sizing: border-box;`">
      <img src="@/assets/images/sub/ic_bang.png" />
      <template v-if="['C'].includes(districtInfo.code) && new Date() >= new Date('2024-04-15 00:00:00') && businessYear === 2024 && !endBusiness('system')">
        <p class="mt100 c_black xlcommp">{{ businessYear }}년 덴티아이 서비스 오픈일은 <b>5월 2일</b>입니다.<br />서비스 오픈 이후 이용 부탁드립니다.</p>
        <!-- <p class="mt60 c_black xlcommp">학교 이용자의 경우 <b>6월 26일</b>부터 이용하실 수 있습니다.</p> -->
      </template>
      <template v-else>
        <p class="mt100 c_black xlcommp fwb">
          <span style="color: #0177ff">{{ endBusiness('system') ? businessYear : parseInt(businessYear) - 1 }} 덴티아이 서비스</span>가 종료되었습니다.
        </p>
        <p class="mt80 c_black xlcommp">
          보내주신 아낌없는 격려와 관심에 감사드리며,<br />더 나은 <b>{{ endBusiness('system') ? parseInt(businessYear) + 1 : businessYear }} 덴티아이 서비스</b>로 찾아뵙겠습니다.
        </p>
      </template>
    </div>
    <div v-else class="set_table">
      <div class="set__table">
        <div class="login__con tac">
          <div class="imgbox"
            ><img :src="require(`@/assets/images/common/denti_i_logo_${districtInfo.eng}.png`)" alt="덴티아이 로고" :style="['I', 'J'].includes(districtInfo.code) ? 'width: 180px' : ''"
          /></div>
          <p class="commp3 fwb c_black mt40" v-html="title"></p>
          <p class="commp c_gray mt5">전산 표준화 및 통합 관리 시스템</p>
          <div class="login__form mt60">
            <form action="">
              <fieldset>
                <legend class="blind">로그인 폼</legend>
                <div class="put__set">
                  <!-- l__putbox -> input size class (l__putbox~s__putbox) -->
                  <div class="l__putbox">
                    <input
                      id="loginid"
                      v-model="loginid"
                      type="text"
                      class="comm_put"
                      :placeholder="`병원 (${districtInfo.code === 'B' ? '요양기관번호 8자리' : '사업자등록번호 10자리'}) 또는 기관명`"
                      @keyup.enter="login"
                    />
                  </div>
                </div>
                <div class="put__set mt10">
                  <div class="l__putbox"><input v-model="password" type="password" class="comm_put" placeholder="비밀번호를 입력해주세요." @keyup.enter="login" /></div>
                </div>
                <div class="login_add mt10 row">
                  <div class="inner--left">
                    <div class="check_set">
                      <input id="id__remember" type="checkbox" value="t" name="id_remember" class="blind" />
                      <label for="id__remember">
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
    ...mapState('status', ['userOrganTargetTypeToName']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('business', ['districtInfo', 'isOpen', 'endBusiness', 'examTitle']),
    ...mapGetters('definedCode', ['codeToValue']),
    isClose() {
      // 개발서버거나, 백업 도메인인 경우 오픈
      if (this.isDev || location.pathname === '/login/backup') {
        return false;
      }
      return !this.isOpen();
    },
    title() {
      switch (this.districtInfo.code) {
        case 'G':
          return `${this.districtInfo.name} 학생구강검진 전문 구강 플랫폼`;
        case 'I':
          return `${this.districtInfo.name}<br/> 구강진료 지원사업 전문 구강 플랫폼`;
        case 'J':
          return `${this.districtInfo.name}<br/> 구강검진(치과주치의) 플랫폼`;
        default:
          return `${this.districtInfo.name} 치과주치의 전문 구강 플랫폼`;
      }
    },
  },
  mounted() {
    if (this.isClose) {
      document.getElementById('container').setAttribute('style', 'height: 100%');
      Gitple('shutdown');
      return false;
    }
    if (this.$cookies.isKey('id__remember')) {
      document.getElementById('id__remember').checked = true;
      this.loginid = this.$cookies.get('id__remember');
      document.getElementById('loginid').value = this.loginid;
    }
    document.getElementById('wrap').classList.add('login__page');
    document.querySelector('body').setAttribute('style', 'height: 100% !important'); // alert plugin height 이슈 처리
  },
  beforeDestroy() {
    if (this.isClose) {
      document.getElementById('container').removeAttribute('style');
    }

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
        if (location.pathname === '/login/backup') {
          this.ip = this.$store.getters['ip/getKaiiIp'];
        }
        const form = {
          districtCode: this.districtInfo.code,
          loginid: this.loginid,
          password: this.password,
        };
        Login.organ(form, this.ip).then(res => {
          if (res && res.data.rt === 200) {
            // 울산 운영서버 2024-04-04~07 교육(지원)청, 의료기관 로그인 제한
            if (!this.isDev && ['C000600002', 'C000600003', 'C000600005'].includes(res.data.loginUserInfo.userOrganTargetType) && this.districtInfo.code === 'J' && new Date() < new Date(2024, 3, 8)) {
              this.$alert('4/8(월)부터 이용하실 수 있습니다.', '알림', 'info');
              return;
            } else {
              // code convert
              res.data.loginUserInfo.userOrganTargetType = this.codeToValue(res.data.loginUserInfo.userOrganTargetType);
              res.data.loginUserInfo.hospitalType = this.codeToValue(res.data.loginUserInfo.hospitalType);
              res.data.loginUserInfo.cityType = this.codeToValue(res.data.loginUserInfo.cityType);
              res.data.loginUserInfo.healthCareType = this.codeToValue(res.data.loginUserInfo.healthCareType);
              res.data.loginUserInfo.hospitalVideoEdu = this.codeToValue(res.data.loginUserInfo.hospitalVideoEdu);
              if (res.data.loginUserInfo.business) {
                res.data.loginUserInfo.business.businessDivisionC = this.codeToValue(res.data.loginUserInfo.business.businessDivisionC);
                res.data.loginUserInfo.business.businessDivisionF = this.codeToValue(res.data.loginUserInfo.business.businessDivisionF);
                res.data.loginUserInfo.business.businessDivisionE = this.codeToValue(res.data.loginUserInfo.business.businessDivisionE);
              }
              // code convert end

              if (document.getElementById('id__remember').checked) {
                this.$cookies.set('id__remember', this.loginid, '30d');
              } else {
                this.$cookies.remove('id__remember');
              }
              this.$store.dispatch('user/updateInfo', Object.assign(res.data.loginUserInfo, { adminOrganType: 'ALL' }));
              if (!this.isDev) {
                Gitple('update', {
                  // 깃플챗 로그인
                  id: `${this.districtInfo.eng}${this.businessYear}${this.isDev ? 'dev' : ''}@${res.data.loginUserInfo.userOrganTargetType}@${res.data.loginUserInfo.userOrganTargetId}@${
                    res.data.loginUserInfo.userOrganId
                  }`,
                  name: res.data.loginUserInfo.userOrganTargetName,
                  meta: {
                    도시: this.districtInfo.name,
                    지역구: res.data.loginUserInfo.districtName,
                    기관유형: this.userOrganTargetTypeToName[res.data.loginUserInfo.userOrganTargetType],
                    기관명: res.data.loginUserInfo.userOrganTargetName,
                  },
                });
              }
              this.$router.push('/').catch(() => {});
            }
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
