<template>
  <div>
    <div class="menu__tab mt30">
      <ul class="menu__tab_list">
        <li :class="{ on: $route.path === '/healthcare/stats/report/busan' }"><router-link to="/healthcare/stats/report/busan">아동 치과주치의</router-link></li>
        <li :class="{ on: $route.path === '/healthcare/stats/report/busan/fam' }"><router-link to="/healthcare/stats/report/busan/fam">학생 치과주치의</router-link></li>
        <li v-if="divJoin('FY')" :class="{ on: $route.path === '/healthcare/stats/report/busan/famdoc/yeonjegu' }"
          ><router-link to="/healthcare/stats/report/busan/famdoc/yeonjegu">연제구 학생 치과주치의</router-link></li
        >
      </ul>
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('business', ['divJoin']),
  },
};
</script>
