<template>
  <ul class="lnb__list">
    <!-- 현재페이지 .on으로 활성화  -->
    <li class="l_menu1" :class="{ on: $route.path.startsWith('/hospital/home/') }">
      <router-link to="/hospital/home">
        <img src="@/assets/images/common/lnb_icon1.png" />
        HOME
      </router-link>
    </li>
    <li v-if="divJoin('C') && business && business.businessDivisionC === 'Y'" class="l_menu4" :class="{ on: $route.path === '/hospital/child' }">
      <router-link to="/hospital/child">
        <img src="@/assets/images/common/lnb_icon4.png" />
        {{ divName('C', true) }}
      </router-link>
    </li>
    <li v-if="business && (business.businessDivisionF === 'Y' || (divJoin('S') && business.businessDivisionE === 'Y'))" class="l_menu2" :class="{ on: $route.path === '/hospital/famdoc' }">
      <router-link v-if="isMenuOpen" to="/hospital/famdoc">
        <img src="@/assets/images/common/lnb_icon2.png" />
        {{ divJoin('S') ? divName('S', true) : divName('F', true) }}
      </router-link>
      <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">
        <img src="@/assets/images/common/lnb_icon2.png" />
        {{ divJoin('S') ? divName('S', true) : divName('F', true) }}
      </a>
    </li>
    <template v-if="divJoin('E') && !divJoin('S') && business && business.businessDivisionE === 'Y'">
      <li class="l_menu3" :class="{ on: $route.path === '/hospital/examine' }">
        <router-link v-if="isMenuOpen" to="/hospital/examine">
          <img src="@/assets/images/common/lnb_icon3.png" />
          {{ divName('E', true) }}
        </router-link>
        <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">
          <img src="@/assets/images/common/lnb_icon3.png" />
          {{ divName('E', true) }}
        </a>
      </li>
      <li class="l2_menu4_2" :class="{ on: $route.path === '/hospital/contract' }">
        <router-link v-if="isMenuOpen" to="/hospital/contract">
          <img src="@/assets/images/common/lnb2_icon4.png" />
          계약 관리
        </router-link>
        <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">
          <img src="@/assets/images/common/lnb2_icon4.png" />
          계약 관리
        </a>
      </li>
    </template>
    <li class="l_menu5" :class="{ on: $route.path.startsWith('/hospital/bill') }">
      <router-link to="/hospital/bill">
        <img src="@/assets/images/common/lnb_icon5.png" />
        비용 청구서
      </router-link>
    </li>
    <li class="l_menu6" :class="{ on: $route.path.indexOf('/hospital/board') !== -1 }">
      <span>
        <img src="@/assets/images/common/lnb_icon6.png" />
        게시판
      </span>
      <ul class="sub__lnb" style="display: none">
        <li v-if="districtCodeFirst === 'C'">
          <router-link to="/hospital/board/inquiry/list" class="active" :class="{ on: $route.path.startsWith('/hospital/board/inquiry') }">보건소 문의</router-link>
        </li>
        <li v-if="['A', 'C'].includes(districtCodeFirst)">
          <router-link to="/hospital/board/faq/list" class="active" :class="{ on: $route.path.startsWith('/hospital/board/faq') }">자주하는 질문</router-link>
        </li>
        <li><router-link to="/hospital/board/notice/list" class="active" :class="{ on: $route.path.startsWith('/hospital/board/notice') }">공지사항</router-link></li>
      </ul>
    </li>

    <li
      v-if="districtCodeFirst === 'C' && !surveyCheck && !endBusiness('survey') && (new Date() > new Date('2024-09-02 07:59:59') || isDev)"
      class="l_menu7"
      :class="{ on: $route.path.startsWith('/hospital/survey') }"
    >
      <router-link to="/hospital/survey">
        <img src="@/assets/images/common/ic_agreement_black.png" />
        사업 설문조사
      </router-link>
    </li>

    <li v-if="surveyHref" class="l_menu7" :class="{ on: $route.path.startsWith('/hospital/survey') }">
      <a :href="surveyHref" target="_blank">
        <img src="@/assets/images/common/ic_agreement_black.png" />
        만족도조사
      </a>
    </li>

    <li
      v-if="districtCodeFirst === 'C' && !selfCheckListIsDone && ((new Date() > new Date('2024-10-06 23:59:59') && new Date() < new Date('2024-12-01 00:00:00')) || isDev)"
      class="l_menu8"
      :class="{ on: $route.path.startsWith('/hospital/selfCheck') }"
    >
      <router-link to="/hospital/selfCheck">
        <BadgeContainer :top="15" :right="-10" :align="'top'" :size="6" :customStyle="{ height: '55px', verticalAlign: 'top !important', padding: 0 }" :on="true">
          <img src="@/assets/images/common/lnb_icon8.png" />
          자율점검표
        </BadgeContainer>
      </router-link>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import BadgeContainer from '@/components/common/BadgeContainer';

export default {
  components: {
    BadgeContainer,
  },
  computed: {
    ...mapState('user', ['business', 'surveyCheck', 'selfCheckListIsDone']),
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
        if (['A', 'B', 'D', 'I', 'J'].includes(this.districtCodeFirst)) {
          switch (this.districtCodeFirst) {
            case 'A':
              return 'https://forms.gle/mbdMr1DdiyHxy9596';
            case 'B':
              return 'https://forms.gle/yYHM4rHqggWD1M2KA';
            case 'D':
              return 'https://forms.gle/v5u5NX1wcuZucqap7';
            case 'I':
              return 'https://forms.gle/RP3DycyLiChSsntV7';
            case 'J':
              return 'https://forms.gle/C6MQJHpviFpFysx89';
          }
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
