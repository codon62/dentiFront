<template>
  <div class="popup_content">
    <v-popuptitle :message="`${districtCodeFirstToName[districtCodeFirst]} ${data.title} 만족도조사 ${organTypeName}용`" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner tac">
      <div class="popup__item">
        <div class="popup__box">
          <img class="popup__img" src="@/assets/images/sub/popup_survey.png" />
          <div
            class="popup__title"
            v-html="`${districtCodeFirst !== 'I' ? districtCodeFirstToName[districtCodeFirst] : ''} ${data.title} ${data.title.length > 15 ? `<br/>` : ''}만족도조사 안내`"
          ></div>
          <div class="popup__text">
            2023년 {{ districtCodeFirstToName[districtCodeFirst] }} {{ data.title }} <b>통합 전산화 시스템 만족도 평가</b>를 실시하고 있습니다.
            <br />
            더 나은 사업 시행을 위해 설문조사를 실시하고 있으니, 귀 기관의 소중한 의견 부탁드립니다.
          </div>
          <div class="popup__info">
            <table>
              <tr>
                <th>참여기간</th>
                <td>{{ data.period }}</td>
              </tr>
              <tr>
                <th>참여방법</th>
                <td>
                  1. 팝업창 내 ‘<b>{{ data.button }}</b
                  >’ 버튼 클릭
                  <br />
                  2. ‘<b>{{ data.menu }}</b
                  >’ 메뉴 선택
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div>
          <a :href="data.href" target="_blank" class="survey_but">{{ data.button }}</a>
        </div>
      </div>
      <a href="javascript:;" class="comm__gray_btn btn_m_size2 wid130 commp inner--right mr10 mt10" @click="todayClose">오늘 하루 보지 않기</a>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
  },
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapState('status', ['userOrganTargetTypeToName', 'districtCodeFirstToName']),
    ...mapGetters('user', ['districtCodeFirst']),
    organTypeName() {
      if (this.districtCodeFirst === 'I') {
        switch (this.userOrganTargetType) {
          case 'HC':
            return '교육지원청';
          case 'HP':
            return '치과병의원';
        }
      }
      return this.userOrganTargetTypeToName[this.userOrganTargetType];
    },
    data() {
      let data = {};
      data.title = '학생구강검진';
      data.period = '2024년 11월 1일 ~ 11월 30일';
      data.menu = '구강검진 설문';
      data.button = '구강검진 설문 참여하기';
      data.href = 'https://forms.gle/ovqzdb5kZhepLJuF6';
      return data;
    },
  },
  methods: {
    ...mapActions('popup', ['todayClose']),
  },
};
</script>

<style scoped>
.popup__img {
  margin: -100px -725px -40px 0;
  left: 762px;
  top: 90px;
}
.popup__item {
  padding: 50px 60px 0 80px;
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
.popup__info {
  margin-top: 30px;
  padding: 0 100px 0 140px;
  font-style: normal;
  font-weight: 600;
  color: #191919;
}
.popup__info table {
  border-collapse: separate;
  border-spacing: 0 8px;
}
.popup__info th {
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  line-height: 29px;
  text-align: left;
  vertical-align: top !important;
  color: #191919;
  width: 60px;
}
.popup__info td {
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 29px;
  text-align: left;
  color: #191919;
  width: 160px;
}
.popup__info td b {
  color: #0190b0;
}
.survey_but {
  margin-top: 20px;
  display: inline-block;
  padding: 8px;
  border: 2px solid #0190b0;
  border-radius: 10px;
  color: #0190b0;
  font-weight: 600;
  font-size: 18px;
  box-shadow: 1px 1px #0190b0;
  transition: 0.5s;
}
.survey_but:hover {
  background-color: #0190b0;
  color: #fff;
}
</style>
