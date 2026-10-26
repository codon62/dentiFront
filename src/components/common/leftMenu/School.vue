<template>
  <ul class="lnb__list">
    <!-- 현재페이지 .on으로 활성화  -->
    <li class="l_menu1" :class="{ on: $route.path === '/school' }">
      <router-link to="/school">
        <img src="@/assets/images/common/lnb_icon1.png" />
        HOME
      </router-link>
    </li>
    <li v-if="divJoin('F') && business && business.businessDivisionF === 'Y'" class="l_menu2" :class="{ on: $route.path === '/school/famdoc' }">
      <router-link v-if="isMenuOpen" to="/school/famdoc">
        <img src="@/assets/images/common/lnb_icon2.png" />
        {{ divJoin('S') ? divName('S', true) : divName('F', true) }}
      </router-link>
      <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">
        <img src="@/assets/images/common/lnb_icon2.png" />
        {{ divJoin('S') ? divName('S', true) : divName('F', true) }}
      </a>
    </li>
    <template v-if="divJoin('E') && !divJoin('S') && business && business.businessDivisionE === 'Y'">
      <li class="l_menu3" :class="{ on: $route.path === '/school/examine' }">
        <router-link v-if="isMenuOpen" to="/school/examine">
          <img src="@/assets/images/common/lnb_icon3.png" />
          {{ divName('E', true) }}
        </router-link>
        <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">
          <img src="@/assets/images/common/lnb_icon3.png" />
          {{ divName('E', true) }}
        </a>
      </li>
      <li class="l2_menu4_2" :class="{ on: $route.path === '/school/contract' }">
        <router-link v-if="isMenuOpen" to="/school/contract">
          <img src="@/assets/images/common/lnb2_icon4.png" />
          계약 관리
        </router-link>
        <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">
          <img src="@/assets/images/common/lnb2_icon4.png" />
          계약 관리
        </a>
      </li>
      <li class="l_menu5" :class="{ on: $route.path.startsWith('/school/bill') }">
        <router-link to="/school/bill">
          <img src="@/assets/images/common/lnb_icon5.png" />
          비용 청구서
        </router-link>
      </li>
    </template>
    <li class="l_menu6" :class="{ on: $route.path.indexOf('/school/board') !== -1 }">
      <span>
        <img src="@/assets/images/common/lnb_icon6.png" />
        게시판
      </span>
      <ul class="sub__lnb" style="display: none">
        <li v-if="['A', 'C'].includes(districtCodeFirst)">
          <router-link to="/school/board/faq/list" class="active" :class="{ on: $route.path.startsWith('/school/board/faq') }">자주하는 질문</router-link>
        </li>
        <li><router-link to="/school/board/notice/list" class="active" :class="{ on: $route.path.startsWith('/school/board/notice') }">공지사항</router-link></li>
      </ul>
    </li>

    <li
      v-if="districtCodeFirst === 'C' && !surveyCheck && !endBusiness('survey') && (new Date() > new Date('2024-09-02 07:59:59') || isDev)"
      class="l_menu7"
      :class="{ on: $route.path.startsWith('/school/survey') }"
    >
      <router-link to="/school/survey">
        <img src="@/assets/images/common/ic_agreement_black.png" />
        사업 설문조사
      </router-link>
    </li>

    <li v-if="surveyHref" class="l_menu7">
      <a :href="surveyHref" target="_blank">
        <img src="@/assets/images/common/ic_agreement_black.png" />
        {{ districtCodeFirst === 'A' ? '치과주치의 설문' : '만족도조사' }}
      </a>
    </li>

    <li v-if="examineSurveyHref" class="l_menu7">
      <a :href="examineSurveyHref" target="_blank">
        <img src="@/assets/images/common/ic_agreement_black.png" />
        {{ '구강검진 설문' }}
      </a>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
  computed: {
    ...mapState('user', ['business', 'surveyCheck']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName', 'isSurveyOpen', 'endBusiness']),
    isMenuOpen() {
      // 서울시 2024-04-01 이후 메뉴 오픈
      const currentDate = new Date();
      const april2024 = new Date(2024, 3, 1);
      return process.env.NODE_ENV !== 'production' || this.districtCodeFirst !== 'A' || currentDate >= april2024;
    },
    surveyHref() {
      if ((this.isDev && !this.endBusiness('survey')) || this.isSurveyOpen) {
        if (['A', 'B', 'D', 'I'].includes(this.districtCodeFirst) && this.business.businessDivisionF === 'Y') {
          switch (this.districtCodeFirst) {
            case 'A':
              return 'https://forms.gle/XkBkFe8uowbfVu8Z8';
            case 'B':
              return 'https://forms.gle/Wf76jvV4VkMRei5U7';
            case 'D':
              return 'https://forms.gle/phRSWtF78NFP1LQV9';
            case 'I':
              return 'https://forms.gle/A29yEStE5UWAwUvv7';
          }
        }
      }
      return null;
    },
    examineSurveyHref() {
      if ((this.isDev || new Date() > new Date('2024-10-31 23:59:59')) && !this.endBusiness('survey')) {
        if (this.districtCodeFirst === 'A' && this.business.businessDivisionE === 'Y') {
          return 'https://forms.gle/ovqzdb5kZhepLJuF6';
        }
      }
      return null;
    },
  },
  mounted() {
    $('.menu__list .lnb__list > li > span').on('click', function () {
      $('.menu__list .lnb__list > li > span').not(this).next('.sub__lnb').slideUp();
      $(this).next('.sub__lnb').slideToggle();
    });
  },
};
</script>
