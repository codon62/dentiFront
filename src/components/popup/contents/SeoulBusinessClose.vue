<template>
  <div class="popup_content">
    <v-popuptitle message="서울시 학생치과주치의사업 종료 안내" imgsrc="sub/ic_info.png"></v-popuptitle>
    <div class="popup__con_inner tac">
      <div class="popup__item">
        <div class="popup__box">
          <p class="popup__title">2024년 서울시 학생치과주치의 사업이 <strong>6월 30일</strong> 종료됩니다.</p>
          <div class="popup__info mt24">
            <p class="table__title">덴티아이 전산시스템 일정</p>
            <table>
              <colgroup>
                <col width="200" />
                <col width="*" />
              </colgroup>
              <tbody>
                <tr>
                  <th>덴티아이 전산시스템 일정</th>
                  <td>2024년 6월 30일까지</td>
                </tr>
                <tr>
                  <th>의료기관 학생치과주치의 청구</th>
                  <td>2024년 7월 29일까지</td>
                </tr>
                <tr>
                  <th>사업 전환에 따른 연동작업</th>
                  <td>2024년 7월 1일 ~ 7월 29일 (7월 검진 불가)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="popup__sub mt24">
            <ol>
              <li>서울시 학생치과주치의 사업이 7월 1일부로 <strong class="underline">정부 아동치과주치의 건강보험 시범사업으로 전환</strong>됩니다.</li>
              <li>사업 전환에 따른 <strong>연동작업 기간(7월 1일 ~ 7월 29일)동안 학생치과주치의 검진이 불가능</strong>합니다.</li>
              <li>6월 30일까지 학생치과주치의 검진을 완료한 학생에 한하여 7월 29일까지 의료기관에서 청구가 가능합니다.</li>
            </ol>
            <p>※ 기존 서울시 아동치과주치의 사업은 2024년도 지속 운영합니다.</p>
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
}
.popup__title {
  line-height: 42px;
  font-size: 28px;
  font-weight: 700;
  color: #464749;
  strong {
    color: #4da0ff;
  }
}
.popup__info {
  padding: 0 150px;
  .table__title {
    line-height: 28px;
    font-size: 18px;
    font-weight: 700;
    color: #464749;
  }
  table {
    margin-top: 16px;
    border-top: 1px solid #eaedf0;
    border-left: 1px solid #eaedf0;
    th,
    td {
      padding: 7px 15px;
      border-right: 1px solid #eaedf0;
      border-bottom: 1px solid #eaedf0;
      line-height: 22px;
      font-size: 14px;
      color: #464749;
    }
    th {
      background-color: #f5f6f7;
      font-weight: 700;
    }
    td {
      text-align: left;
    }
  }
}
.popup__sub {
  padding: 0 63px;
  text-align: left;
  line-height: 24px;
  font-size: 16px;
  color: #464749;
  ol {
    padding-left: 19px;
    li {
      list-style: decimal;
      & + li {
        margin-top: 4px;
      }
    }
  }
  p {
    margin-top: 16px;
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
