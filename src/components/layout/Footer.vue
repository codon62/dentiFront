<template>
  <div id="footer">
    <!-- <a href="#" id="topBtn"><img src="./images/board/top_btn.gif" alt="위로올라가기" style="display: none;"></a> -->

    <footer>
      <div class="footer_wrap" :class="districtCodeFirst === 'C' ? 'footer-contact-wrap' : ''">
        <address v-if="districtCodeFirst === 'C'" class="footer-contact">
          <p>
            <span>관할 보건소</span>
            <span>:</span>
            <span>의료기관 계약, 통보서 심사 및 반려, 검진비 지급 문의</span>
          </p>
          <p>
            <span>경기도 의료원</span>
            <span>:</span>
            <span>
              치과주치의 사업 전반 문의
              <br />
              월 - 금 09:00 ~ 17:00 (점심시간 12:00 ~ 13:30)
            </span>
            <span>|</span>
            <span>031) 250 - 8895~6</span>
          </p>
          <p>
            <span>카이아이 컴퍼니</span>
            <span>:</span>
            <span>
              덴티아이 전산시스템 문의
              <br />
              월 - 금 09:00 ~ 18:00
            </span>
            <span>|</span>
            <span>1670 - 2628</span>
          </p>
        </address>
        <div class="f_link">
          <a href="javascript:;" class="comm_privacy" @click="popupOpen({ contents: 'privacyPolicy' })">개인정보처리방침</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
  },
};
</script>
<style scoped lang="scss">
.footer-contact-wrap {
  display: flex;
  justify-content: space-between;
  padding: 15px 50px;
  .footer-contact > p {
    display: flex;
    line-height: 27px;
    &:not(:last-child) {
      margin-bottom: 5px;
    }
    & > span {
      font-size: 15px;
      color: #000;
    }
    & > span:nth-child(1) {
      width: 100px;
    }
    & > span:nth-child(3) {
      margin-left: 10px;
      width: 320px;
    }
    & > span:nth-child(5) {
      margin-left: 10px;
    }
  }
}
</style>
