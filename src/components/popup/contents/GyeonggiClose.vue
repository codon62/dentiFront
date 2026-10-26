<template>
  <div class="popup_content">
    <v-popuptitle message="2024년 경기도 초등학생 치과주치의 사업 종료 안내" imgsrc="sub/ic_popup.png"></v-popuptitle>
    <div class="popup__con_inner tac">
      <div class="popup__item">
        <div class="popup__box">
          <img src="@/assets/images/common/logo_gyeonggi2.png" />
          <div class="popup__text">
            2024년 경기도 초등학생 치과주치의 검진 기간은
            <br />
            <span class="popup__strong">{{ getEndDay('treatment', true, true) }}까지</span>
            입니다.
          </div>
          <div class="popup__sub">덴티아이 전산시스템 일정</div>
          <div class="popup__info">
            <table>
              <tr>
                <th>검진 및 학생 등록</th>
                <td>{{ businessYear }}년 5월 2일 ~ {{ getEndDay('treatment', false) }}</td>
              </tr>
              <tr>
                <th>의료기관의 통보서 제출</th>
                <td>{{ businessYear }}년 {{ getEndDay('notification', true) }}까지</td>
              </tr>
              <tr>
                <th>보건소 전산업무 종료</th>
                <td>{{ businessYear }}년 {{ getEndDay('bill', true) }}까지</td>
              </tr>
              <tr>
                <th>자료 일괄 다운로드</th>
                <td>{{ businessYear }}년 {{ getBulkDownloadStartDay }} ~ {{ getEndDay('system', true) }}</td>
              </tr>
              <tr>
                <th>덴티아이 접속<br /><span class="sscommp fwn">(기관용 웹사이트 및 학생 앱)</span></th>
                <td>{{ businessYear }}년 {{ getEndDay('system', true) }}까지</td>
              </tr>
            </table>
          </div>
          <div class="popup__red">※ 12월 1일부터 신규학생 및 문진표 등록 불가 ※</div>
        </div>
      </div>
      <div class="popup__close">
        <a href="javascript:;" style="background-color: #065097; color: #ffffff" @click="redirectNotice">세부 내용 확인하기</a>
        <a href="javascript:;" style="background-color: #f0f0f0; color: #737373" @click="todayClose">오늘 하루 보지 않기</a>
      </div>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
  },
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapState('status', ['userOrganTargetTypeToPath']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('business', ['getEndDay', 'getBulkDownloadStartDay']),
  },
  methods: {
    ...mapActions('popup', ['popupClose', 'todayClose']),
    redirectNotice() {
      let noticeBoardId;
      switch (this.userOrganTargetType) {
        case 'CT':
        case 'HC':
          noticeBoardId = this.isDev ? 145 : 8;
          break;
        case 'HP':
          noticeBoardId = this.isDev ? 145 : 8;
          break;
        case 'SC':
          noticeBoardId = this.isDev ? 145 : 8;
          break;
      }
      this.$router.push({ path: `/${this.userOrganTargetTypeToPath[this.userOrganTargetType]}/board/notice/contents`, query: { noticeBoardId } });
      this.popupClose();
    },
  },
};
</script>

<style scoped>
.popup__item {
  padding: 7px 80px 30px 80px;
}
.popup__box {
  padding: 36px 0 34px 0;
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
  color: #1c1c1c;
}
.popup__sub {
  margin-top: 34px;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 29px;
  text-align: center;
  color: #000000;
}
.popup__info {
  margin-top: 12px;
  padding: 0 125px 0 151px;
  font-style: normal;
  font-weight: 600;
  color: #191919;
}
.popup__info table {
  border: 0.5px solid #cacaca;
  /*border-collapse: separate;*/
  /*border-spacing: 0 8px;*/
}
.popup__info th {
  padding: 7px 0;
  border: 0.5px dashed #cacaca;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  text-align: center;
  color: #000000;
  width: 200px;
}
.popup__info td {
  padding: 4px 0 4px 30px;
  border: 0.5px dashed #cacaca;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 23px;
  text-align: left;
  color: #000000;
}
.popup__info td b {
  color: #0190b0;
}
.popup__strong {
  background: #065097;
  color: white;
}
.popup__red {
  margin-top: 27px;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 23px;
  text-align: center;
  color: #ff0000;
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
