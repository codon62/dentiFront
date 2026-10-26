<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">학생 회원 관리</p>
    </div>
    <div v-if="(divJoin('C') && cityType !== 'E' && healthCareType !== 'E') || districtCodeFirst === 'C'" class="menu__tab mt30">
      <ul class="menu__tab_list">
        <li v-if="divJoin('C')" :class="{ on: $route.path === '/healthcare/management/student' }">
          <router-link to="/healthcare/management/student">{{ divName('C', true) }}</router-link>
        </li>
        <li v-if="divJoin('F')" :class="{ on: $route.path === '/healthcare/management/student/famdoc' }">
          <router-link v-if="isMenuOpen" to="/healthcare/management/student/famdoc">{{ divName('F', true) }}</router-link>
          <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('F', true) }}</a>
        </li>
        <li v-if="divJoin('F1')" :class="{ on: $route.path === '/healthcare/management/student/famdoc/first' }">
          <router-link v-if="isMenuOpen" to="/healthcare/management/student/famdoc/first">{{ divName('F1', true) }}</router-link>
          <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('F1', true) }}</a>
        </li>
        <li v-if="divJoin('FY')" :class="{ on: $route.path === '/healthcare/management/student/famdoc/yeonjegu' }">
          <router-link v-if="isMenuOpen" to="/healthcare/management/student/famdoc/yeonjegu">{{ divName('FY', true) }}</router-link>
          <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('FY', true) }}</a>
        </li>
        <li v-if="divJoin('E') && !divJoin('S') && business && business.businessDivisionE === 'Y'" :class="{ on: $route.path === '/healthcare/management/student/examine' }">
          <router-link v-if="isMenuOpen" to="/healthcare/management/student/examine">{{ divName('E', true) }}</router-link>
          <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('E', true) }}</a>
        </li>
        <li v-if="districtCodeFirst === 'A'" :class="{ on: $route.path === '/healthcare/management/student/duplicate' }">
          <router-link v-if="isMenuOpen" to="/healthcare/management/student/duplicate">중복대상자</router-link>
          <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">중복대상자</a>
        </li>
        <!-- 경기도만 오픈 -->
        <li v-if="districtCodeFirst === 'C'" :class="{ on: $route.path === '/healthcare/management/student/special' }">
          <router-link to="/healthcare/management/student/special">특수학교</router-link>
        </li>
      </ul>
    </div>
    <router-view />
  </fragment>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['cityType', 'healthCareType', 'business']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName']),
    isMenuOpen() {
      // 서울시 2024-04-01 이후 메뉴 오픈
      const currentDate = new Date();
      const april2024 = new Date(2024, 3, 1);
      return process.env.NODE_ENV !== 'production' || this.districtCodeFirst !== 'A' || currentDate >= april2024;
    },
  },
};
</script>
