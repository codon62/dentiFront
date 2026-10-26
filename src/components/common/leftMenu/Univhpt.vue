<template>
  <ul class="lnb__list">
    <!-- 현재페이지 .on으로 활성화  -->
    <li class="l_menu4" :class="{ on: this.$route.path === '/univhpt' }">
      <router-link to="/univhpt">
        <img src="@/assets/images/common/lnb_icon4.png" />
        심화치료
      </router-link>
    </li>
    <!-- <li class="l_menu6" :class="{ 'on': $route.path.indexOf('/univhpt/board') !== -1}">
            <span><img src="@/assets/images/common/lnb_icon6.png">게시판</span>
            <ul class="sub__lnb" style="display: none;">
                <li><router-link to="/univhpt/board/notice/list" class="active" :class="{ 'on': $route.path.indexOf('/univhpt/board/notice') !== -1}">공지사항</router-link></li>
            </ul>
        </li> -->
  </ul>
</template>

<script>
export default {
  mounted() {
    $('.menu__list .lnb__list > li > span').on('click', function () {
      $('.menu__list .lnb__list > li > span').not(this).next('.sub__lnb').slideUp();
      $(this).next('.sub__lnb').slideToggle();
    });
  },
};
</script>
