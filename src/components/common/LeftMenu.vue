<template>
  <div class="left__menu">
    <div class="l__top">
      <h1>
        <router-link to="/">
          <img v-if="districtCodeFirst === 'C'" src="@/assets/images/common/logo_gyeonggi.jpg" alt="경기도 로고" />
          <img v-else src="@/assets/images/common/logo.png" alt="카이아이 로고" />
        </router-link>
      </h1>
      <div class="my__profile mt40">
        <div class="my_img action"><img src="@/assets/images/common/no_profile.png" alt="프로필 이미지" /></div>
        <p class="commp2 mt10 action">
          <span class="fwb">{{ userOrganTargetName }}</span>
          님,
          <br />
          환영합니다!
        </p>
      </div>
    </div>
    <div class="menu__list mt30">
      <component :is="cmp"></component>
    </div>
  </div>
  <!--//left__menu-->
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
  props: ['cmp'],
  computed: {
    ...mapState('user', ['userOrganTargetName']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
  components: {
    hospital: () => import('@/components/common/leftMenu/Hospital.vue'),
    healthcare: () => import('@/components/common/leftMenu/Healthcare.vue'),
    center: () => import('@/components/common/leftMenu/Center.vue'),
    school: () => import('@/components/common/leftMenu/School.vue'),
    univhpt: () => import('@/components/common/leftMenu/Univhpt.vue'),
  },
  mounted() {
    // 프로필, 텍스트 페이지 로딩되면 효과처리
    $('.action').each(function (i) {
      const obj = $(this);
      setTimeout(function () {
        obj.addClass('on');
      }, 300 * i);
    });
  },
};
</script>
