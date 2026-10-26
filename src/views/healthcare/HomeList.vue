<template>
  <fragment>
    <div class="sub__content dash__board mt30">
      <div v-if="divJoin('C') && cityType !== 'E' && healthCareType !== 'E'" class="menu__tab">
        <ul class="menu__tab_list">
          <li :class="{ on: $route.path === '/healthcare/home/child' }">
            <router-link to="/healthcare/home/child">{{ divName('C', true) }}</router-link>
          </li>
          <li :class="{ on: $route.path === '/healthcare/home/famdoc' }">
            <router-link v-if="isMenuOpen" to="/healthcare/home/famdoc">{{ divName('F', true) }}</router-link>
            <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('F', true) }}</a>
          </li>
          <li v-if="divJoin('F1')" :class="{ on: $route.path === '/healthcare/home/famdoc/first' }">
            <router-link v-if="isMenuOpen" to="/healthcare/home/famdoc/first">{{ divName('F1', true) }}</router-link>
            <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('F1', true) }}</a>
          </li>
          <li v-if="divJoin('FY')" :class="{ on: $route.path === '/healthcare/home/famdoc/yeonjegu' }">
            <router-link to="/healthcare/home/famdoc/yeonjegu">{{ divName('FY', true) }}</router-link>
          </li>
          <li v-if="divJoin('E') && userOrganTargetType === 'CT'" :class="{ on: $route.path === '/healthcare/home/examine' }">
            <router-link v-if="isMenuOpen" to="/healthcare/home/examine">{{ divName('E', true) }}</router-link>
            <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('E', true) }}</a>
          </li>
        </ul>
      </div>
      <router-view :key="$route.fullPath" />
    </div>
  </fragment>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['cityType', 'healthCareType', 'userOrganTargetType']),
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
