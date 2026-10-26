<template>
  <ul class="lnb__list">
    <!-- 현재페이지 .on으로 활성화  -->
    <li class="l_menu1" :class="{ on: $route.path === '/center' }">
      <router-link to="/center">
        <img src="@/assets/images/common/lnb_icon1.png" />
        HOME
      </router-link>
    </li>
    <li class="l_menu4" :class="{ on: $route.path === '/center/child' }">
      <router-link to="/center/child">
        <img src="@/assets/images/common/lnb_icon4.png" />
        아동 치과주치의
      </router-link>
    </li>
    <li class="l_menu6" :class="{ on: $route.path.indexOf('/center/board') !== -1 }">
      <span>
        <img src="@/assets/images/common/lnb_icon6.png" />
        게시판
      </span>
      <ul class="sub__lnb" style="display: none">
        <li v-if="['A', 'C'].includes(districtCodeFirst)">
          <router-link to="/center/board/faq/list" class="active" :class="{ on: $route.path.startsWith('/center/board/faq') }">자주하는 질문</router-link>
        </li>
        <li><router-link to="/center/board/notice/list" class="active" :class="{ on: $route.path.indexOf('/center/board/notice') !== -1 }">공지사항</router-link></li>
      </ul>
    </li>

    <li v-if="surveyHref" class="l_menu7" :class="{ on: $route.path.startsWith('/center/survey') }">
      <a :href="surveyHref" target="_blank">
        <img src="@/assets/images/common/ic_agreement_black.png" />
        만족도조사
      </a>
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['isSurveyOpen', 'endBusiness']),
    surveyHref() {
      if ((this.isDev && !this.endBusiness('survey')) || this.isSurveyOpen) {
        if (['D'].includes(this.districtCodeFirst)) {
          switch (this.districtCodeFirst) {
            case 'D':
              return 'https://forms.gle/6ZYYRvPWjzztiS6W6';
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
