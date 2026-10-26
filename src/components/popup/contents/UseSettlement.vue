<template>
  <div class="popup_content">
    <v-popuptitle message="울산광역시교육청 검진비용 정산 안내" imgsrc="sub/ic_popup.png"></v-popuptitle>
    <div class="popup__con_inner tac">
      <div class="popup__item">
        <div class="popup__box">
          <p class="popup__text">
            2024. 6.1.~8.31.까지의 비용 청구건에 대해서 2차 정산을 실시하여
            <br />
            2024. 9. 19.(목) 병원별 등록 계좌로 지급 완료되었음을 알려드립니다.
          </p>
          <p class="popup__sub mt20">
            각 병원에서는 덴티아이 &gt; 비용청구서 &gt; 청구금액에서 "처리완료" 금액과 실제 입금 금액을 확인하시고
            <br />
            이상이 있는 경우 052-210-5583으로 연락주시기 바랍니다.
          </p>
          <p class="popup__sub mt30 fw500"> ※ <strong>최종 정산(3차 정산) 관련 안내</strong> </p>
          <div class="popup__info mt15">
            <table>
              <colgroup>
                <col width="150" />
                <col width="150" />
                <col width="360" />
              </colgroup>
              <thead>
                <tr>
                  <th colspan="2">구분</th>
                  <th>일정</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th colspan="2">학생 구강검진 및 치과주치의 사업 종료</th>
                  <td>2024. 11. 30.(토)까지</td>
                </tr>
                <tr>
                  <th rowspan="3">3차 정산</th>
                  <th>정산 대상</th>
                  <td>2024. 9. 1.~11.30. 기간 내 청구 및 검진 완료한 건</td>
                </tr>
                <tr>
                  <th>통보서 작성 기한</th>
                  <td>2024. 12. 4.(수)까지 최종제출</td>
                </tr>
                <tr>
                  <th>정산 일정</th>
                  <td
                    >2024. 12. 13.(금) 지급 예정<br />
                    <p class="popup__sm__text">단, 교육청 내부 사유 등으로 변동될 수 있음</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="popup__close">
        <a href="javascript:;" @click="customClose('2024-07-31')">다시 보지 않기</a>
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
    ...mapActions('popup', ['customClose']),
  },
};
</script>

<style scoped>
.popup__item {
  padding: 7px 80px 30px 80px;
}
.popup__box {
  padding: 30px 0;
  background: #fff;
  border: 1px solid #d1d1d1;
  border-radius: 5px;
  text-align: center;
}
.popup__text {
  line-height: 30px;
  font-size: 21px;
  font-weight: 700;
  color: #1c1c1c;
}
.popup__sub {
  line-height: 23px;
  font-size: 16px;
  color: #191919;
}
.popup__info {
  padding: 0 50px;
}
.popup__info table {
  border: 1px solid #cacaca;
}
.popup__info th,
.popup__info td {
  padding: 5px 18px;
  border-left: 1px solid #cacaca;
  line-height: 22px;
  font-size: 16px;
  color: #191919;
}
.popup__info th {
  font-weight: 700;
}
.popup__info td {
  text-align: left;
  font-weight: 500;
  letter-spacing: -0.5px;
}
.popup__info thead th {
  background-color: #f0f0f0;
}
.popup__info tbody th,
.popup__info tbody td {
  border-top: 1px solid #cacaca;
}
.popup__sm__text {
  font-size: 14px;
}
.popup__close {
  float: right;
  margin-right: 10px;
}
.popup__close a {
  padding: 10px 25px;
  margin-right: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #737373;
  vertical-align: middle;
}
</style>
