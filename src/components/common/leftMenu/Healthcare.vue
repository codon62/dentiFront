<template>
  <ul class="lnb__list">
    <!-- 현재페이지 .on으로 활성화  -->
    <li class="l_menu1" :class="{ on: $route.path.startsWith('/healthcare/home/') }">
      <router-link to="/healthcare/home">
        <img src="@/assets/images/common/lnb_icon1.png" />
        HOME
      </router-link>
    </li>
    <!-- <li class="l2_menu2"><a href="javascript:;" onclick="alert('준비중입니다.')"><img src="@/assets/images/common/lnb2_icon2.png">자동 보고서</a></li> -->

    <li class="l2_menu3" :class="{ on: $route.path.startsWith('/healthcare/management') }">
      <span>
        <img src="@/assets/images/common/lnb2_icon3.png" />
        회원 관리
      </span>
      <ul class="sub__lnb" style="display: none">
        <li v-if="userOrganTargetType === 'CT' && cityType !== 'E'">
          <router-link to="/healthcare/management/healthcare" class="active" :class="{ on: $route.path === '/healthcare/management/healthcare' }">
            {{ healthCareTitle }}
          </router-link>
        </li>
        <li v-if="divJoin('C') && cityType !== 'E' && healthCareType !== 'E'">
          <router-link to="/healthcare/management/center" class="active" :class="{ on: $route.path === '/healthcare/management/center' }">시설(센터)</router-link>
        </li>
        <li>
          <router-link to="/healthcare/management/hospital" class="active" :class="{ on: $route.path === '/healthcare/management/hospital' }">병원</router-link>
        </li>
        <li v-if="districtCodeFirst === 'I' && (userOrganTargetType === 'CT' || adminOrganType === 'AD')">
          <router-link to="/healthcare/management/hospitalView" class="active" :class="{ on: $route.path === '/healthcare/management/hospitalView' }">병원(검수용)</router-link>
        </li>
        <li><router-link to="/healthcare/management/school" class="active" :class="{ on: $route.path === '/healthcare/management/school' }">학교</router-link></li>
        <li v-if="!(districtCodeFirst === 'J' && adminOrganType !== 'AD')">
          <router-link to="/healthcare/management/student" class="active" :class="{ on: $route.path.startsWith('/healthcare/management/student') }">학생</router-link>
        </li>
        <li v-if="adminOrganType === 'AD'">
          <router-link to="/healthcare/management/user" class="active" :class="{ on: $route.path.startsWith('/healthcare/management/user') }">앱 가입</router-link>
        </li>
      </ul>
    </li>

    <li v-if="!(districtCodeFirst === 'J' && adminOrganType !== 'AD')" class="l2_menu4" :class="{ on: $route.path.startsWith('/healthcare/business') }">
      <span>
        <img src="@/assets/images/common/lnb2_icon4.png" />
        사업 관리
      </span>
      <ul class="sub__lnb" style="display: none">
        <li v-if="divJoin('C') && cityType !== 'E' && healthCareType !== 'E'">
          <router-link to="/healthcare/business/child" class="active" :class="{ on: $route.path === '/healthcare/business/child' }">{{ divName('C', true) }}</router-link>
        </li>
        <template v-if="districtCodeFirst === 'A' && cityType !== 'E' && healthCareType !== 'E'">
          <li><router-link to="/healthcare/business/plan" class="active" :class="{ on: $route.path === '/healthcare/business/plan' }">진료계획(승인전)</router-link></li>
          <li><router-link to="/healthcare/business/deep" class="active" :class="{ on: $route.path === '/healthcare/business/deep' }">심화치료</router-link></li>
        </template>
        <li v-if="divJoin('F') && cityType !== 'E' && healthCareType !== 'E'">
          <router-link v-if="isMenuOpen" to="/healthcare/business/famdoc" class="active" :class="{ on: $route.path === '/healthcare/business/famdoc' }">{{ divName('F', true) }}</router-link>
          <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('F', true) }}</a>
        </li>
        <li v-if="divJoin('F1') && cityType !== 'E' && healthCareType !== 'E'">
          <router-link v-if="isMenuOpen" to="/healthcare/business/famdoc/first" class="active" :class="{ on: $route.path === '/healthcare/business/famdoc/first' }">
            {{ divName('F1', true) }}
          </router-link>
          <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('F1', true) }}</a>
        </li>
        <li v-if="divJoin('FY') && cityType !== 'E' && healthCareType !== 'E'">
          <router-link to="/healthcare/business/famdoc/yeonjegu" class="active" :class="{ on: $route.path === '/healthcare/business/famdoc/yeonjegu' }">{{ divName('FY', true) }}</router-link>
        </li>
        <li v-if="divJoin('E') && !(districtCodeFirst === 'A' && userOrganTargetType === 'HC' && healthCareType !== 'E')">
          <router-link v-if="isMenuOpen" to="/healthcare/business/examine" class="active" :class="{ on: $route.path === '/healthcare/business/examine' }">학생 구강검진</router-link>
          <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">학생 구강검진</a>
        </li>
      </ul>
    </li>

    <li class="l2_menu5" :class="{ on: $route.path.startsWith('/healthcare/bill') }">
      <span>
        <img src="@/assets/images/common/lnb_icon5.png" />
        비용 청구서
      </span>
      <ul class="sub__lnb" style="display: none">
        <li><router-link to="/healthcare/bill/claim" class="active" :class="{ on: $route.path.startsWith('/healthcare/bill/claim') }">청구/지급</router-link></li>
        <li v-if="(divJoin('C') || divJoin('F')) && cityType !== 'E' && healthCareType !== 'E'">
          <router-link to="/healthcare/bill/reject" class="active" :class="{ on: $route.path.startsWith('/healthcare/bill/reject') }">반려</router-link>
        </li>
      </ul>
    </li>

    <li v-if="isDev || adminOrganType === 'AD' || isStatisticsOpen" class="l2_menu2" :class="{ on: $route.path.startsWith('/healthcare/stats') }">
      <span>
        <img src="@/assets/images/common/lnb2_icon2.png" />
        통계자료
      </span>
      <ul class="sub__lnb" style="display: none">
        <li v-if="!['I', 'J'].includes(districtCodeFirst)">
          <router-link to="/healthcare/stats/report" class="active" :class="{ on: $route.path.startsWith('/healthcare/stats/report') }">자동보고서</router-link>
        </li>
        <li>
          <router-link to="/healthcare/stats/record" class="active" :class="{ on: $route.path.startsWith('/healthcare/stats/record') }">종합실적</router-link>
        </li>
        <li v-if="districtCodeFirst === 'C'">
          <router-link v-if="userOrganTargetType === 'CT'" to="/healthcare/stats/school-statistics" class="active" :class="{ on: $route.path.startsWith('/healthcare/stats/school-statistics') }">
            학교별 현황
          </router-link>
          <router-link v-else to="/healthcare/stats/school-statistics-detail" class="active" :class="{ on: $route.path.startsWith('/healthcare/stats/school-statistics-detail') }">
            학교별 현황
          </router-link>
        </li>
        <li v-if="districtCodeFirst === 'C'">
          <router-link to="/healthcare/stats/survey" class="active" :class="{ on: $route.path.startsWith('/healthcare/stats/survey') }">설문조사</router-link>
        </li>
        <!--<template v-if="['G'].includes(districtCodeFirst)">-->
        <!--  <li>-->
        <!--    <router-link to="/healthcare/stats/edu-site" class="active" :class="{ on: $route.path.startsWith('/healthcare/stats/edu-site') }">학교용 교육 학습 현황</router-link>-->
        <!--  </li>-->
        <!--</template>-->
      </ul>
    </li>

    <li class="l_menu6" :class="{ on: $route.path.startsWith('/healthcare/board') }">
      <span>
        <img src="@/assets/images/common/lnb_icon6.png" />
        게시판
      </span>
      <ul class="sub__lnb" style="display: none">
        <li v-if="districtCodeFirst === 'C'">
          <router-link to="/healthcare/board/inquiry/list" class="active" :class="{ on: $route.path.startsWith('/healthcare/board/inquiry') }">보건소 문의</router-link>
        </li>
        <li v-if="['A', 'C'].includes(districtCodeFirst)">
          <router-link to="/healthcare/board/faq/list" class="active" :class="{ on: $route.path.startsWith('/healthcare/board/faq') }">자주하는 질문</router-link>
        </li>
        <li><router-link to="/healthcare/board/notice/list" class="active" :class="{ on: $route.path.startsWith('/healthcare/board/notice') }">공지사항</router-link></li>
      </ul>
    </li>

    <li
      v-if="districtCodeFirst === 'C' && userOrganTargetType === 'HC' && !healthCareSurveyCheck && !endBusiness('survey') && (new Date() > new Date('2024-09-02 07:59:59') || isDev)"
      class="l_menu7"
      :class="{ on: $route.path.startsWith('/healthcare/survey') }"
    >
      <router-link to="/healthcare/survey">
        <img src="@/assets/images/common/ic_agreement_black.png" />
        사업 설문조사
      </router-link>
    </li>

    <li v-if="surveyHref" class="l_menu7" :class="{ on: $route.path.startsWith('/healthcare/survey') }">
      <a :href="surveyHref" target="_blank">
        <img src="@/assets/images/common/ic_agreement_black.png" />
        만족도조사
      </a>
    </li>
  </ul>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['userOrganTargetType', 'districtCode', 'cityType', 'healthCareType', 'adminOrganType']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('user', ['districtCodeFirst', 'healthCareSurveyCheck']),
    ...mapGetters('business', ['divJoin', 'divName', 'isSurveyOpen', 'endBusiness', 'startMonth', 'openStatistics', 'healthCareTitle']),
    isMenuOpen() {
      // 서울시 2024-04-01 이후 메뉴 오픈
      const currentDate = new Date();
      const april2024 = new Date(2024, 3, 1);
      return process.env.NODE_ENV !== 'production' || this.districtCodeFirst !== 'A' || currentDate >= april2024;
    },
    isStatisticsOpen() {
      // 사업 년도이면 (현재 월 + 1)월부터, 아니면 12월까지
      const now = new Date();
      const targetMonth = now.getFullYear() === this.businessYear ? now.getMonth() + 1 : 12;
      return this.openStatistics && targetMonth > this.startMonth;
    },
    surveyHref() {
      if ((this.isDev && !this.endBusiness('survey')) || this.isSurveyOpen) {
        if (['A', 'B', 'D', 'I'].includes(this.districtCodeFirst) && this.userOrganTargetType === 'HC' && this.healthCareType !== 'E') {
          switch (this.districtCodeFirst) {
            case 'A':
              return 'https://forms.gle/WvfQNC5mhdK7BL9X9';
            case 'B':
              return 'https://forms.gle/FocuEMYwjXudBVKM7';
            case 'D':
              return 'https://forms.gle/5YFg3cPUYfZjSBoN9';
            case 'I':
              return 'https://forms.gle/ZSEeemmkHk6Tw4oHA';
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
