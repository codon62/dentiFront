<template>
  <fragment>
    <div class="sub__content dash__board mt30">
      <div class="menu__tab">
        <ul class="menu__tab_list">
          <li :class="{ on: $route.path === '/healthcare/stats/record/busan/child' }"><router-link to="/healthcare/stats/record/busan/child">아동 치과주치의</router-link></li>
          <li :class="{ on: $route.path === '/healthcare/stats/record/busan/famdoc' }"><router-link to="/healthcare/stats/record/busan/famdoc">학생 치과주치의</router-link></li>
          <li v-if="divJoin('FY')" :class="{ on: $route.path === '/healthcare/stats/record/busan/famdoc/yeonjegu' }"
            ><router-link to="/healthcare/stats/record/busan/famdoc/yeonjegu">연제구 학생 치과주치의</router-link></li
          >
        </ul>
      </div>
      <router-view :key="$route.fullPath" />
    </div>
  </fragment>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('business', ['divJoin']),
  },
};
</script>
