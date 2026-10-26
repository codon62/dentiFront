<template>
  <div id="wrap">
    <loading :active.sync="isLoading" color="#0868f1" background-color="#f5f5f5" loader="dots" :height="100" :width="100" inert></loading>
    <div v-if="isBanner" class="commp4 tac banner-block">
      <div class="banner-dev">
        <a v-if="isDev" href="https://dentii.kai-i.com/business">
          현재 페이지는 시범 사이트로 <span style="color: red">{{ bannerText.before }}까지만 테스트 계정으로 로그인</span>할 수 있습니다.<br />
          {{ bannerText.after }}사업 오픈일 이후 정식 사이트를 이용해 주세요.<span class="c_blue underline ml10">덴티아이(Denti-i) 바로가기</span>
        </a>
        <div v-else-if="showInfoBanner" class="flex">
          <div>학교는 <span style="color: red">4/4(목)</span>부터, 교육(지원)청 및 의료기관은 <span style="color: red">4/8(월)</span>부터 로그인 가능합니다.</div>
        </div>
        <div v-else>
          {{ businessYear }}년 덴티아이 서비스는 12월 31일까지만 이용 가능합니다.<br />
          <span style="color: red">{{ businessYear + 1 }}년 1월 1일부로 접속 불가</span>하니 참고 바랍니다.
        </div>
        <button @click="isBanner = false"><img src="@/assets/images/common/ic_close.png" alt="다시 보지 않기" /></button>
      </div>
    </div>
    <v-header></v-header>
    <div v-if="!isIe" id="container">
      <div v-if="!isOk" class="browser__page content__area">잠시만 기다려주세요.</div>
      <router-view v-else></router-view>
      <v-popup v-if="view"></v-popup>
    </div>
    <div v-else id="container">
      <div class="container_wrap">
        <div class="content__area bg__form_ver">
          <!-- form__ver_1 -->
          <div class="sub__content form__ver_1 mt30">
            <div class="browser__con bg_white mt20 tac" style="width: 800px; margin: 0 auto; padding: 50px; box-sizing: border-box">
              <div class="iconbox"><img src="@/assets/images/sub/ic_security.png" /></div>
              <p class="commp3 mt15 fwb">프로그램 설치</p>
              <p class="commp mt15">
                안전한 서비스 이용을 위해
                <br />
                아래와 같은 프로그램 설치를 확인해 주세요.
              </p>
              <div class="linebox mt30" style="border: 1px solid #ccc; padding: 20px; box-sizing: border-box">
                <p class="sscommp c_gray2 fw300">
                  * 컴퓨터 성능에 따라 10초 ~ 1분정도 소요될 수 있습니다.
                  <br />
                  * 사용자 환경에 따라 오류 메세지가 발생할 경우, 다운로드 안내창에서 ‘저장’을 눌러 PC에서 다운로드를 진행해 주세요.
                </p>
                <p class="sscommp c_gray2 fwn mt15">전산화시스템(Denti-i)은 IE(익스플로러)로 사용할 경우 일부기능의 사용이 어려울 수 있어 구글 크롬 브라우저 사용을 부탁드립니다.</p>
              </div>
              <p class="commp2 mt50 fwb">크롬 브라우저 설치 방법</p>
              <p class="commp mt20">1. 포털사이트 ‘크롬’ 검색 > 구글 크롬 접속 (www.google.com/chrome) > chrome 다운로드 > 동의 및 설치</p>
              <p class="commp mt10">2. 설치관리의 ‘다운로드’ 버튼 클릭 > 구글 크롬 접속(www.goole.com/chrome) > chrome 다운로드 > 동의 및 설치</p>
              <div class="iconbox mt30"><img src="@/assets/images/sub/img_chrome.png" /></div>
              <p class="commp fwb">Chrome 브라우저</p>
              <div class="tac mt30">
                <a href="https://www.google.com/chrome/" class="d_inblock comm__blue_btn btn_m_size2 wid110">다운로드</a>
              </div>
              <!-- <p class="sscommp c_gray2 fw300 mt30">* 접속 PC 정보 : [Window64, Win64] [Chrome 72.0.3626.121] [TouchEnNxKey] Mozilla/5.0 (Windows NT 10.0; Win64; x64) <br>AppleWebKit/537.36(KHTML, like Gecko) Chrome/72.0.3626.121 safari/537.36</p> -->
              <p class="sscommp mt15 c_blue fwn">설치가 완료된 후, 크롬 브라우저를 통한 덴티아이 시스템 이용을 부탁드립니다.</p>
            </div>
          </div>
          <!--//sub__content-->
        </div>
        <!-- content__area -->
      </div>
      <!--//container_wrap-->
    </div>
    <v-footer v-if="!isIe && !$route.path.startsWith('/app/')"></v-footer>
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import Popup from '@/components/popup/Popup.vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import { mapGetters, mapState } from 'vuex';
import Common from '@/apis/Common';
import Admin from '@/apis/Admin';

export default {
  data() {
    return {
      isBanner: true,
      showInfoBanner: false,
    };
  },
  components: {
    'v-header': Header,
    'v-footer': Footer,
    'v-popup': Popup,
    Loading,
  },
  computed: {
    ...mapState(['isOk', 'isLoading']),
    ...mapState('popup', ['view']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('business', ['districtInfo']),
    isIe() {
      const agent = navigator.userAgent.toLowerCase();
      return (navigator.appName === 'Netscape' && agent.indexOf('trident') !== -1) || agent.indexOf('msie') !== -1;
    },
    bannerText() {
      if (this.districtInfo.code !== 'C') {
        return {
          before: '사업 오픈 전',
          after: '',
        };
      }
      const beforeDate = new Date(this.districtInfo.startDay.replaceAll('-', '/'));
      beforeDate.setDate(beforeDate.getDate() - 1);
      const afterDate = new Date(this.districtInfo.startDay.replaceAll('-', '/'));
      return {
        before: this.convertBannerDateText(beforeDate),
        after: this.convertBannerDateText(afterDate),
      };
    },
  },
  created() {
    const currentDate = new Date();
    // 울산 2024-04-04~07 로그인 안내 배너 노출
    this.showInfoBanner = this.districtInfo.code === 'J' && currentDate >= new Date(2024, 3, 4) && currentDate < new Date(2024, 3, 8);
    this.isBanner = this.isDev || currentDate.getMonth() + 1 === 12 || this.showInfoBanner;
    if (this.isDev) {
      Gitple('shutdown');
    }
    Common.getIp().then(res => {
      this.$store.commit('ip/setIp', res.data);
      if (!res.data) return;
      Admin.authIp({
        ip: res.data,
      }).then(res => {
        if (!res) return;
        this.$store.commit('ip/setIsKaii', res.data?.valid || false);
      });
    });
  },
  methods: {
    convertBannerDateText(date) {
      const weekday = ['일', '월', '화', '수', '목', '금', '토'];
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}(${weekday[date.getDay()]})`;
    },
  },
};
</script>

<style lang="scss">
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}

.login__page {
  @include box-sizing(border-box);

  height: 100%;
  overflow: hidden;
  padding-bottom: 50px;

  #container {
    background-color: #fff !important;
  }

  #container,
  .container_wrap {
    height: 100%;
  }

  .login__con {
    width: 340px;
    margin: 0 auto;
  }

  .banner-block ~ #container {
    height: calc(100% - 80px);
  }

  .comm_put {
    @include border-radius(3px);
  }

  .f_link a {
    color: #2699fb;
    border-color: #2699fb;
  }

  #footer {
    border-top: 1px solid #dbdbdb;
  }
}

.banner-block {
  background-color: #fff7e1;
  height: 80px;
}

.banner-dev {
  position: relative;
  width: 1000px;
  margin: 0 auto;
  height: 80px;
  line-height: 30px;

  & > a,
  & > div {
    position: absolute;
    padding: 10px 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    font-weight: 1000;
  }

  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & > button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    position: absolute;
    top: 25px;
    right: 0;
  }
}

/* tooltip */
.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  @include border-radius(16px);

  background: black;
  color: white;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^='top'] {
  margin-bottom: 5px;
}

.tooltip[x-placement^='top'] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^='bottom'] {
  margin-top: 5px;
}

.tooltip[x-placement^='bottom'] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^='right'] {
  margin-left: 5px;
}

.tooltip[x-placement^='right'] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^='left'] {
  margin-right: 5px;
}

.tooltip[x-placement^='left'] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  @include border-radius(5px);

  background: #f9f9f9;
  color: black;
  padding: 24px;
  box-shadow: 0 5px 30px rgba(black, 0.1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  @include transition(opacity 0.15s, visibility 0.15s);
  @include opacity(0);

  visibility: hidden;
}

.tooltip[aria-hidden='false'] {
  @include transition(opacity 0.15s);
  @include opacity(1);

  visibility: visible;
}

.underline {
  text-decoration: underline;
}
</style>
