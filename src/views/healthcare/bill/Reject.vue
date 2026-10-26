<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">반려</p>
    </div>
    <div v-if="divJoin('C')" class="menu__tab mt30">
      <ul class="menu__tab_list">
        <li :class="{ on: $route.path === '/healthcare/bill/reject' }">
          <router-link to="/healthcare/bill/reject">{{ divName('C', true) }}</router-link>
        </li>
        <li :class="{ on: $route.path === '/healthcare/bill/reject/famdoc' }">
          <router-link v-if="isMenuOpen" to="/healthcare/bill/reject/famdoc">{{ divName('F', true) }}</router-link>
          <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('F', true) }}</a>
        </li>
        <li v-if="divJoin('F1')" :class="{ on: $route.path === '/healthcare/bill/reject/famdoc/first' }">
          <router-link v-if="isMenuOpen" to="/healthcare/bill/reject/famdoc/first">{{ divName('F1', true) }}</router-link>
          <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('F1', true) }}</a>
        </li>
        <li v-if="divJoin('FY')" :class="{ on: $route.path === '/healthcare/bill/reject/famdoc/yeonjegu' }">
          <router-link to="/healthcare/bill/reject/famdoc/yeonjegu">{{ divName('FY', true) }}</router-link>
        </li>
        <!--        <li :class="{ on: $route.path === '/healthcare/bill/reject/examine' }">-->
        <!--          <router-link to="/healthcare/bill/reject/examine">{{ divName('E', true) }}</router-link>-->
        <!--        </li>-->
      </ul>
    </div>
    <router-view />
  </fragment>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
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
