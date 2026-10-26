<template>
  <div class="popup_content">
    <v-popuptitle message="구강진료 지원사업 안내" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner tac">
      <div class="popup__item">
        <div class="popup__box">
          <div class="popup__title">9월 1일부로 비용청구서 기능 오픈</div>
          <div class="popup__text">좌측 메뉴 '비용청구서'를 클릭하여 {{ userOrganTargetType === 'HC' ? '지급/반려 처리' : '비용 청구 현황을 확인' }}하실 수 있습니다.</div>
          <div class="popup__text">자세한 내용은 '홈 > 사용자 매뉴얼'에서 {{ userOrganTargetType === 'HP' ? '의료기관' : '교육지원청' }} 전산 매뉴얼 확인 부탁드립니다.</div>
          <div v-if="userOrganTargetType === 'HP'" class="popup__text">
            ※ 사업자등록증, 통장사본, 도장을 등록해야 비용 청구가 가능합니다.<br />재등록을 원할 경우는 우측 상단 [정보수정] 버튼 클릭 바랍니다.
          </div>
        </div>
      </div>
      <a href="javascript:;" class="comm__gray_btn btn_m_size2 wid130 commp inner--right mr10 mt25" @click="todayClose">오늘 하루 보지 않기</a>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
  },
  computed: {
    ...mapState('user', ['userOrganTargetType']),
  },
  methods: {
    ...mapActions('popup', ['todayClose']),
  },
};
</script>

<style scoped>
.popup__item {
  padding: 50px 80px 0 80px;
}
.popup__box {
  padding: 50px 0;
  box-shadow: 0 0 8px 1px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
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
  font-size: 20px;
  line-height: 29px;
  text-align: center;
  color: #191919;
}
</style>
