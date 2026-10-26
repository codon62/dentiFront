<template>
  <div class="container_wrap">
    <div class="set_table">
      <div class="set__table">
        <p class="mcommp2 fwb tac">404 ERROR</p>
        <p class="mt5 commp4 tac">페이지를 찾을 수 없습니다.</p>
        <div class="imgbox tac mt40"><img src="@/assets/images/common/error.png" /></div>
        <p class="mt40 commp tac c_gray2">
          존재하지 않는 주소를 입력하셨거나
          <br />
          요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.
        </p>
        <div class="mt30 tac">
          <router-link to="/" class="comm__blue_btn commp2 wid160 btn_l_size d_inblock">홈으로 이동</router-link>
        </div>
      </div>
    </div>
  </div>
  <!--//container_wrap-->
</template>

<script>
export default {
  mounted() {
    document.getElementById('container').setAttribute('style', 'height: 100%');
  },
  beforeDestroy() {
    document.getElementById('container').removeAttribute('style');
  },
};
</script>

<style scoped>
.container_wrap {
  height: 100%;
}
</style>
