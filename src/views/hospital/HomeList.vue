<template>
  <fragment>
    <div class="sub__content dash__board mt30">
      <div v-if="divJoin('C')" class="menu__tab">
        <ul class="menu__tab_list">
          <li v-if="business && business.businessDivisionC === 'Y'" :class="{ on: $route.path === '/hospital/home/child' }">
            <BadgeContainer :on="hasRejectC" :right="5">
              <router-link to="/hospital/home/child">{{ divName('C', true) }}</router-link>
            </BadgeContainer>
          </li>
          <li v-if="divJoin('F') && business && business.businessDivisionF === 'Y'" :class="{ on: $route.path === '/hospital/home/famdoc' }">
            <BadgeContainer v-if="isMenuOpen" :on="hasRejectF" :right="5">
              <router-link to="/hospital/home/famdoc">{{ divName('F', true) }}</router-link>
            </BadgeContainer>
            <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">{{ divName('F', true) }}</a>
          </li>
          <li v-if="divJoin('E') && business && business.businessDivisionE === 'Y'" :class="{ on: $route.path === '/hospital/home/examine' }">
            <BadgeContainer v-if="isMenuOpen" :on="hasRejectE" :right="5">
              <router-link to="/hospital/home/examine">학생 구강검진</router-link>
            </BadgeContainer>
            <a v-else href="javascript:;" @click="$alert('학생치과주치의 및 학생구강검진 사업은 4/1(월)부터입니다.', '알림', 'warning')">학생 구강검진</a>
          </li>
        </ul>
      </div>
      <router-view :key="$route.fullPath" @hasReject="hasReject" />
    </div>
  </fragment>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import BadgeContainer from '@/components/common/BadgeContainer';

export default {
  components: {
    BadgeContainer,
  },
  data() {
    return {
      hasRejectC: false,
      hasRejectF: false,
      hasRejectE: false,
    };
  },
  computed: {
    ...mapState('user', ['business']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName']),
    isMenuOpen() {
      // 서울시 2024-04-01 이후 메뉴 오픈
      const currentDate = new Date();
      const april2024 = new Date(2024, 3, 1);
      return process.env.NODE_ENV !== 'production' || this.districtCodeFirst !== 'A' || currentDate >= april2024;
    },
  },
  methods: {
    hasReject(data) {
      Object.keys(data).forEach(key => {
        this[key] = data[key];
      });
    },
  },
};
</script>
