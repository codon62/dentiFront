<template>
  <div class="popup_content">
    <v-popuptitle message="인천시 치과주치의 사업 종료 안내" imgsrc="sub/ic_info.png"></v-popuptitle>
    <div class="popup__con_inner tac">
      <div class="popup__item">
        <div class="popup__box">
          <div class="popup__title">2024년 일부 자치구 사업 종료 안내</div>
          <div class="popup__text">인천시 일부 자치구 치과주치의 예산이 소진되어 안내드립니다.<br />세부적인 사업 기간 및 정책은 학생 학교가 소속된 자치구 보건소로 확인 부탁드립니다.</div>
          <div class="popup__text"><b>사업 종료된 자치구 : 동구, 미추홀구</b></div>
          <div class="popup__text">
            ※ <strong style="color: red">동구, 미추홀구 외 타 자치구 소속 학생은 검진 가능</strong>합니다.<br />※ 사업 기간 및 정책 문의는 해당 자치구 보건소로 문의해 주세요.
          </div>
        </div>
      </div>
      <a href="javascript:;" class="comm__gray_btn btn_m_size2 wid130 commp inner--right mr10 mt25" @click="todayClose">오늘 하루 보지 않기</a>
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
  padding: 7px 80px 0 80px;
}
.popup__box {
  padding: 50px 0;
  box-shadow: 0 0 4px #868686;
  border-radius: 5px;
}
.popup__title {
  margin-top: -10px;
  font-style: normal;
  font-weight: 700;
  font-size: 28px;
  text-align: center;
  color: #191919;
}
.popup__text {
  margin-top: 46px;
  font-style: normal;
  font-weight: 400;
  font-size: 19px;
  line-height: 29px;
  text-align: center;
  color: #191919;
}
</style>
