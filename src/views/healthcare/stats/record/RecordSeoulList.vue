<template>
  <fragment>
    <div class="sub__content dash__board mt30">
      <div v-if="cityType !== 'E' && healthCareType !== 'E'" class="menu__tab">
        <ul class="menu__tab_list">
          <li :class="{ on: $route.path === '/healthcare/stats/record/seoul/child' }"><router-link to="/healthcare/stats/record/seoul/child">아동 치과주치의</router-link></li>
          <li :class="{ on: $route.path === '/healthcare/stats/record/seoul/famdoc' }"><router-link to="/healthcare/stats/record/seoul/famdoc">학생 치과주치의</router-link></li>
          <li v-if="divJoin('F1')" :class="{ on: $route.path === '/healthcare/stats/record/seoul/famdoc/first' }">
            <router-link to="/healthcare/stats/record/seoul/famdoc/first">학생 치과주치의 (1학년)</router-link>
          </li>
          <li :class="{ on: $route.path === '/healthcare/stats/record/seoul/examine' }"><router-link to="/healthcare/stats/record/seoul/examine">학생 구강검진</router-link></li>
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
    ...mapState('user', ['cityType', 'healthCareType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin']),
  },
};
</script>
