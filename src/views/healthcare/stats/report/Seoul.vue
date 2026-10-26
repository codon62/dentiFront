<template>
  <div>
    <div class="menu__tab mt30">
      <div v-if="cityType !== 'E' && healthCareType !== 'E'" class="menu__tab">
        <ul class="menu__tab_list">
          <li :class="{ on: $route.path === '/healthcare/stats/report/seoul' }"><router-link to="/healthcare/stats/report/seoul">아동 치과주치의</router-link></li>
          <li :class="{ on: $route.path === '/healthcare/stats/report/seoul/fam' }"><router-link to="/healthcare/stats/report/seoul/fam">학생 치과주치의</router-link></li>
          <li v-if="divJoin('F1')" :class="{ on: $route.path === '/healthcare/stats/report/seoul/famdoc1' }">
            <router-link to="/healthcare/stats/report/seoul/famdoc1">학생 치과주치의 (1학년)</router-link>
          </li>
          <li :class="{ on: $route.path === '/healthcare/stats/report/seoul/examine' }"><router-link to="/healthcare/stats/report/seoul/examine">학생 구강검진</router-link></li>
        </ul>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['cityType', 'healthCareType']),
    ...mapGetters('business', ['divJoin']),
  },
};
</script>
