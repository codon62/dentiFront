<template>
  <div class="popup_content">
    <v-popuptitle message="채팅앱 사용 안내" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner tac">
      <div>
        <div class="popup_inner_wrap">
          <p>
            1:1 상담 업체의 공공기관 서버 일부 제한으로
            <br />
            채팅 아이콘 미노출 기관에서는
            <br />
            <b class="underline">"파이어폭스" 브라우저 다운로드 후 이용 부탁드립니다.</b>
            <br />
            빠른 해결방안을 마련하여 복구하도록 노력하겠습니다.
            <br />
            불편을 드려 죄송합니다.
          </p>
        </div>
        <div class="popup_link_btn_wrap mt30">
          <a :href="formUrl" target="_blank" class="popup_link_btn cyan">파이어폭스 다운로드</a>
        </div>
      </div>
      <a href="javascript:;" class="comm__gray_btn btn_m_size2 wid130 commp inner--right mr10 mt10" @click="yearClose">다시 보지 않기</a>
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
  data() {
    return {
      formUrl: 'https://www.mozilla.org/ko/',
    };
  },
  methods: {
    ...mapActions('popup', ['popupClose']),
    yearClose() {
      this.$cookies.set('gitpleLoginPopup', 'Y', '365d');
      this.popupClose();
    },
  },
};
</script>

<style scoped lang="scss">
.popup_heading {
  font-size: 2rem;
  text-decoration: underline;
  font-weight: 500;
  padding: 15px;
}
.popup_inner_wrap {
  @include border-radius(15px);

  background-color: #ebf4ff;
}
.popup_inner_wrap > p {
  line-height: 3rem;
  font-size: 1.2rem;
  padding: 20px;
}
.popup_inner_wrap > p > span {
  font-weight: 700;
}
.popup_footer {
  padding: 20px;
}
.popup_link_btn_wrap {
  padding: 20px;
}
.popup_link_btn {
  @include border-radius(15px);

  padding: 10px 25px;
  border: 3px solid #08298a;
  font-size: 1.1rem;
}
.popup_link_btn:hover {
  color: #000;
  font-weight: 500;
  background-color: #ebf4ff;
}
.underline {
  text-decoration: underline;
}
</style>
