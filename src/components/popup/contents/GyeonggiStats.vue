<template>
  <div class="popup_content">
    <v-popuptitle message="2022년 경기도 초등학생 치과주치의 사업 종료 안내" imgsrc="sub/ic_popup.png"></v-popuptitle>
    <div class="popup__con_inner tac">
      <div class="popup__item">
        <div class="popup__box">
          <img src="@/assets/images/common/logo_gyeonggi2.png" />
          <div class="popup__text">통계자료 > 최종 종합실적은 12월 22일(목)부터 다운로드 가능합니다.</div>
          <div class="popup__sub"
            >12월 21일(수) 종합실적 엑셀 자료를 받으신 담당자 분께서는<br />번거로우시더라도 12월 22일(목) 이후에 다시 다운로드 받아주시길 부탁드립니다.<br /><br />종합실적은 통보서 검진일 기준으로
            집계되고 있어<br />11월 30일(수) 이후 작성된 통보서에 대해서는 현재 11월 기준으로는 조회가 되지 않습니다.<br />12월에 작성된 통보서 건에 대한 실적을 11월 종합실적에 합산하는 작업이
            필요하여<br />최종적인 종합실적 조회 일정이 늦어지는 점 양해해 주시기 바랍니다.</div
          >
        </div>
      </div>
      <div class="popup__close">
        <a href="javascript:;" style="background-color: #f0f0f0; color: #737373" @click="todayClose">오늘 하루 보지 않기</a>
      </div>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
  },
  methods: {
    ...mapActions('popup', ['todayClose']),
  },
};
</script>

<style scoped>
.popup__item {
  padding: 7px 80px 30px 80px;
}
.popup__box {
  padding: 14px 0 24px 0;
  background: #ffffff;
  box-shadow: 0 0 4px #868686;
  border-radius: 5px;
}
.popup__text {
  margin-top: 15px;
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 45px;
  text-align: center;
  color: #ff0000;
}
.popup__sub {
  margin-top: 24px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
  color: #191919;
}
.popup__close {
  float: right;
  margin-right: 10px;
}
.popup__close a {
  margin-right: 10px;
  padding: 10px;
  border-radius: 5px;
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  vertical-align: middle;
}
</style>
