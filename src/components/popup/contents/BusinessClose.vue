<template>
  <div class="popup_content">
    <v-popuptitle :message="`${districtCodeFirstToName[districtCodeFirst]} ${data.title}${districtCodeFirst !== 'I' ? ' 사업' : ''} 종료 안내`" imgsrc="sub/ic_info.png"></v-popuptitle>
    <div class="popup__con_inner tac">
      <div class="popup__item">
        <div class="popup__box">
          <div class="popup__text">
            {{ businessYear }}년 {{ districtCodeFirstToName[districtCodeFirst] }}{{ districtCodeFirst === 'D' ? '/연제구' : '' }} {{ districtCodeFirst !== 'J' ? data.title : '사업' }}
            {{ examTitle }} 기간은<br />
            <span class="c_blue">{{ getEndDay('treatment', true) }}</span
            >까지입니다.
          </div>
          <div class="popup__info">
            <p class="table_title">덴티아이 전산시스템 일정</p>
            <table>
              <tr>
                <th>{{ examTitle }} 및 학생 등록</th>
                <td>{{ businessYear }}년 {{ getEndDay('treatment', districtCodeFirst === 'I' ? true : false) }}까지</td>
              </tr>
              <tr>
                <th>의료기관의 통보서{{ divJoin('C') ? '/내역서' : '' }} 제출</th>
                <td>{{ businessYear }}년 {{ getEndDay('notification', true) }}까지</td>
              </tr>
              <tr v-if="!['G', 'J'].includes(districtCodeFirst)">
                <th>{{ ['I', 'J'].includes(districtCodeFirst) ? '교육지원청' : '보건소' }} 전산업무 종료</th>
                <td>{{ businessYear }}년 {{ getEndDay('bill', true) }}까지</td>
              </tr>
              <tr v-if="getBulkDownloadStartDay">
                <th>자료 일괄 다운로드</th>
                <td>{{ businessYear }}년 {{ getBulkDownloadStartDay }} ~ {{ getEndDay('system', true) }}</td>
              </tr>
              <tr>
                <th>덴티아이 접속<br /><span class="commp fwn">(기관용 웹사이트 및 학생 앱)</span></th>
                <td>{{ businessYear }}년 {{ getEndDay('system', true) }}까지</td>
              </tr>
            </table>
          </div>
          <div class="popup__sub" v-html="data.html" />
        </div>
      </div>
      <div>
        <a href="javascript:;" class="comm__gray_btn btn_m_size2 wid130 commp inner--right mr10 mt25" @click="todayClose">오늘 하루 보지 않기</a>
      </div>
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
    ...mapState('status', ['userOrganTargetTypeToPath', 'districtCodeFirstToName']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['getEndDay', 'getBulkDownloadStartDay', 'examTitle', 'divJoin']),
    data() {
      let data = {};
      switch (this.districtCodeFirst) {
        case 'A': // 서울
          data.title = '치과주치의 및 구강검진';
          data.html =
            '※ 서울시(4학년)/노원구(1,4학년) 학생 치과주치의, 아동 치과주치의, 학생 구강검진 <b>전산 일정 모두 동일</b>합니다.<br />※ <b>12월 1일부터 신규 학생 및 문진표, 12월 6일부터 통보서 등록 불가<b/>합니다.';
          break;
        case 'B': // 인천
          data.title = '아동 치과주치의';
          data.html = '※ <b>12월 8일부터 신규 학생 및 문진표, 통보서 등록 불가<b/>합니다.';
          break;
        case 'D': // 부산
          data.title = '치과주치의';
          data.html = '※ <b>12월 6일부터 신규 학생 및 문진표 등록 불가하며,<br />12월 7일부터 통보서 등록 불가합니다.<b/>';
          break;
        case 'E': // 순천 - 사업 진행 X
          data.title = '치과주치의';
          data.html = '※ <b>12월 1일부터 신규 학생 및 문진표 등록 불가하며,<br />12월 16일부터 통보서 등록 불가합니다.<b/>';
          break;
        case 'F': // 밀양
          data.title = '치과주치의';
          data.html = '※ <b>12월 1일부터 신규 학생 및 문진표 등록 불가하며, 12월 8일부터 통보서 등록 불가합니다.<b/>';
          break;
        case 'G': // 수원
          data.title = '학생구강검진';
          data.html = '※ <b>12월 1일부터 신규 학생 및 문진표 등록 불가하며,<br />12월 7일부터 통보서 등록 불가합니다.<b/>';
          break;
        case 'I': // 전북
          data.title = '구강진료 지원사업';
          data.html = '※ <b>비용 청구 문의는 해당 학교 소속 교육지원청으로,<br />시스템 오류 문의는 우측 하단 채팅상담으로 부탁드립니다.</b>';
          break;
        case 'J': // 울산
          data.title = '구강검진 및 치과주치의';
          data.html = '※ <b>12월 1일부터 신규 학생 및 문진표 등록 불가하며,<br />12월 5일부터 통보서 등록 불가합니다.<b/>';
          break;
      }
      return data;
    },
  },
  methods: {
    ...mapActions('popup', ['popupClose', 'todayClose']),
  },
};
</script>

<style scoped>
.popup__item {
  padding: 7px 80px 0 80px;
}
.popup__box {
  padding: 30px 0;
  background: #ffffff;
  box-shadow: 0 0 4px #868686;
  border-radius: 5px;
}
.popup__text {
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 40px;
  text-align: center;
  color: #1c1c1c;
}
.popup__sub {
  margin-top: 30px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  text-align: center;
  color: #000;
}
.popup__info {
  margin-top: 12px;
  padding: 0 100px;
  font-style: normal;
  font-weight: 600;
  color: #191919;
}
.table_title {
  margin-top: 28px;
  margin-bottom: 16px;
  line-height: 26px;
  font-size: 18px;
  font-weight: 700;
}
.popup__info table {
  border: 1px solid #cacaca;
}
.popup__info th {
  width: 240px;
  padding: 6px 0;
  border: 1px dashed #cacaca;
  text-align: center;
  line-height: 20px;
  font-size: 15px;
  font-weight: 700;
  color: #000;
}
.popup__info td {
  padding: 6px 0 6px 16px;
  border: 1px dashed #cacaca;
  text-align: left;
  line-height: 20px;
  font-size: 15px;
  font-weight: 400;
  color: #000;
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
</style>
