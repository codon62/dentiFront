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
            2024년 {{ districtCodeFirstToName[districtCodeFirst] }} {{ data.title }}{{ districtCodeFirst === 'I' ? '의' : '' }}
            <b v-html="(districtCodeFirst !== 'I' ? '사업의 ' : '<br />') + '효과성'" />과 <b>만족도 평가</b>를 실시하고 있습니다.
            <br />
            더 나은 사업 시행을 위해 사업 전반에 대한 설문조사를 실시하고 있으니,
            <br />
            귀 기관의 소중한 의견 부탁드립니다.
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
      data.menu = '만족도조사';
      data.button = '만족도조사 참여하기';
      switch (this.districtCodeFirst) {
        case 'A':
          data.title = '치과주치의';
          data.period = '2024년 11월 1일 ~ 11월 30일';
          switch (this.userOrganTargetType) {
            case 'HC':
              data.href = 'https://forms.gle/WvfQNC5mhdK7BL9X9';
              break;
            case 'HP':
              data.href = 'https://forms.gle/mbdMr1DdiyHxy9596';
              break;
            case 'SC':
              data.href = 'https://forms.gle/XkBkFe8uowbfVu8Z8';
              data.menu = '치과주치의 설문';
              data.button = '치과주치의 설문 참여하기';
              break;
          }
          break;
        case 'B':
          data.title = '아동치과주치의';
          data.period = '2024년 11월 1일 ~ 11월 30일';
          switch (this.userOrganTargetType) {
            case 'HC':
              data.href = 'https://forms.gle/FocuEMYwjXudBVKM7';
              break;
            case 'HP':
              data.href = 'https://forms.gle/yYHM4rHqggWD1M2KA';
              break;
            case 'SC':
              data.href = 'https://forms.gle/Wf76jvV4VkMRei5U7';
              break;
          }
          break;
        case 'D':
          data.title = '치과주치의';
          data.period = '2024년 11월 5일 ~ 12월 5일';
          switch (this.userOrganTargetType) {
            case 'HC':
              data.href = 'https://forms.gle/5YFg3cPUYfZjSBoN9';
              break;
            case 'HP':
              data.href = 'https://forms.gle/v5u5NX1wcuZucqap7';
              break;
            case 'SC':
              data.href = 'https://forms.gle/phRSWtF78NFP1LQV9';
              break;
            case 'CE':
              data.href = 'https://forms.gle/6ZYYRvPWjzztiS6W6';
              break;
          }
          break;
        // case 'G':
        //   data.title = '초등학생 구강건강 모니터링서비스';
        //   data.period = '2023년 11월 14일 ~ 12월 16일';
        //   switch (this.userOrganTargetType) {
        //     case 'SC':
        //       data.href = 'https://docs.google.com/forms/d/e/1FAIpQLSf3E26D77gNcm3V8s_zw19CYK77l8aI6uPq1MCBIZ57W9dMsA/viewform';
        //       break;
        //   }
        //   break;
        case 'I':
          data.title = '초등학생 구강진료 지원사업';
          data.period = '2024년 11월 1일 ~ 11월 30일';
          switch (this.userOrganTargetType) {
            case 'HC':
              data.href = 'https://forms.gle/ZSEeemmkHk6Tw4oHA';
              break;
            case 'HP':
              data.href = 'https://forms.gle/RP3DycyLiChSsntV7';
              break;
            case 'SC':
              data.href = 'https://forms.gle/A29yEStE5UWAwUvv7';
              break;
          }
          break;
        case 'J':
          data.title = '사업';
          data.period = '2024년 11월 4일 ~ 11월 30일';
          switch (this.userOrganTargetType) {
            case 'HP':
              data.href = 'https://forms.gle/C6MQJHpviFpFysx89';
              break;
          }
          break;
      }
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
