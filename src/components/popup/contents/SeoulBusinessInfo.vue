<template>
  <div class="popup_content">
    <v-popuptitle message="정부 아동치과주치의 건강보험 시범사업 안내" imgsrc="sub/ic_info.png"></v-popuptitle>
    <div class="popup__con_inner tac">
      <div class="popup__item">
        <div class="popup__box">
          <p class="popup__title">정부 아동치과주치의 건강보험 시범 안내</p>
          <p class="popup__sub">
            정부 아동치과주치의 건강보험 시범사업
            <br />
            (구 서울시 학생치과주치의 사업)이 <strong>7월 30일</strong> 개시됩니다.
          </p>
          <div class="popup__info mt24">
            <dl>
              <dt>사업 기간</dt>
              <dd>2024년 7월 30일 ~ 11월 30일</dd>
            </dl>
            <dl>
              <dt>필수사항</dt>
              <dd>
                정부 아동치과주치의 시범사업 전환에 따른 교육이수 필수
                <ol>
                  <li>대한 치과의사협회 홈페이지 보수교육센터 접속</li>
                  <li>아동치과주치의사업 교육 이수 후 주치의 등록</li>
                </ol>
              </dd>
            </dl>
            <dl>
              <dt>안내사항</dt>
              <dd>
                정부 아동치과주치의 사업 청구 금액 4,500원
                <br />
                <span>(24년도 한하여 서울시에서 본인 부담금 지원)</span>
              </dd>
              <dd>홈메우기, 방사선촬영, 스케일링은 서비스에 미포함</dd>
            </dl>
          </div>
        </div>
      </div>
      <div class="popup__close">
        <a href="javascript:;" @click="todayClose">오늘 하루 보지 않기</a>
      </div>
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
    ...mapState('status', ['userOrganTargetTypeToPath']),
  },
  methods: {
    ...mapActions('popup', ['todayClose']),
  },
};
</script>

<style scoped lang="scss">
.popup__item {
  padding: 7px 50px 30px 50px;
}
.popup__box {
  padding: 30px 0;
  background: #fff;
  border: 1px solid #d1d1d1;
  text-align: center;
}
.popup__title {
  line-height: 42px;
  font-size: 28px;
  font-weight: 700;
  color: #464749;
}
.popup__sub {
  margin-top: 8px;
  line-height: 30px;
  font-size: 20px;
  font-weight: 500;
}
.popup__info {
  padding: 0 180px;
  line-height: 24px;
  font-size: 16px;
  color: #464749;
  dl {
    position: relative;
    padding-left: 92px;
    dt {
      position: absolute;
      top: 0;
      left: 0;
      min-width: 60px;
      font-weight: 700;
    }
    dd {
      text-align: left;
      font-weight: 500;
      & + dd {
        margin-top: 8px;
      }
      ol {
        padding-left: 19px;
        li {
          margin-top: 4px;
          list-style: decimal;
          color: #757779;
        }
      }
      span {
        display: block;
        margin-top: 4px;
        font-size: 14px;
        color: #757779;
      }
    }
    & + dl {
      margin-top: 16px;
    }
  }
}
.popup__close {
  text-align: right;
  padding-right: 10px;
  a {
    display: inline-block;
    padding: 0 24px;
    margin-right: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    line-height: 40px;
    font-size: 14px;
    font-weight: 500;
    color: #737373;
    vertical-align: middle;
  }
}
</style>
