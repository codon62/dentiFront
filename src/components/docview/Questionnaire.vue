<template>
  <div class="popup_content">
    <v-popuptitle divclass="bg__form_ver" :message="dataObject.isQuestionnaireSurvey ? '사후 설문조사' : questionnaireTitle" imgsrc="sub/ic_write.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver">
      <div class="row">
        <div class="inner--right">
          <a href="javascript:;" class="comm__green_bd_btn d_inblock fwn commp2 bg_white btn_l_size wid120" @click="htmlToPDF">
            <img src="@/assets/images/sub/ic_download_20.png" />
            다운로드
          </a>
          <a href="javascript:;" class="comm__blue_bd_btn d_inblock fwn commp2 bg_white btn_l_size ml10 wid120" @click="htmlToPdfPrint">
            <img src="@/assets/images/sub/ic_print_20.png" />
            인쇄
          </a>
        </div>
      </div>

      <div class="bg_white mt20 pb20">
        <div ref="pdfArea" :key="pdfRefreshKey" class="pdf_page_wrap" :class="{ onepage: districtCodeFirst === 'J' }">
          <div class="lcommp tac fwb">{{ title }}</div>
          <std-info-box :businessDivision="dataObject.businessDivision" />
          <template v-if="formBlock.block1.length">
            <p class="commp2 fwb mt30">구강 증상</p>
            <p v-if="dataObject.isQuestionnaireSurvey" class="mt5 scommp">
              * 구강검진 후 구강상태 및 자기효능감을 참고하기 위하여 실시하는 것으로, 부모님(보호자)과 상의하여 정확하게 기재하여 주세요.
            </p>
            <p v-else class="mt5 scommp">* 최근 1년 동안 느낀 증상에 모두 표시해 주세요.</p>
            <question-table width="575" width2="205" :data-array="formBlock.block1" :view="true" />
          </template>
          <div class="mt30">
            <p class="commp2 fwb">{{ this.districtCodeFirst === 'I' ? '구강건강 관리상태 및 실천' : '구강 건강 행태' }}</p>
            <p class="mt5 scommp">* 본인의 구강 건강 상태에 해당하는 번호를 표시해 주세요.</p>
          </div>
          <question-table width="360" width2="385" :data-array="formBlock.block2" :view="true" :pdf="true" />

          <div class="pdfBlock mt30">
            <p class="commp2 fwb">{{ formContents.questionnaire.q_say.label }}</p>
            <div class="textbox mt20" style="width: 760px">
              <div
                :id="formContents.questionnaire.q_say.id"
                class="textarea_box"
                :class="{ read_only: !formContents.questionnaire.q_say.value }"
                style="height: 110px"
                v-html="formContents.questionnaire.q_say.value.replace(/(\n)/g, ' ')"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import questionTable from '@/components/doc/questionTable';
import { mapActions, mapGetters, mapState } from 'vuex';
import StdInfoBox from '@/components/docview/stdInfoBox.vue';
import jsPDF from 'jspdf';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'question-table': questionTable,
    StdInfoBox,
  },
  props: ['dataObject'],
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapState('student', ['studentInfo']),
    ...mapState('status', ['districtCodeFirstToName', 'businessDivision']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName', 'questionnaireTitle']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
  data() {
    return {
      title: '',
      form: ['q_1', 'q_2', 'q_3', 'q_4', 'q_5', 'q_6', 'q_7', 'q_8', 'q_9', 'q_9_1', 'q_10', 'q_11'],
      formBlock: {
        block1: [],
        block2: [],
      },
      renderedImg: [],
      vuePDFStatus: false,
      pdfRefreshKey: 0,
    };
  },
  methods: {
    ...mapActions('popup', ['popupClose']),
    getFileName() {
      const date = new Date();
      const now =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);
      const divName = this.divName(this.dataObject.businessDivision, false);
      const hospitalName = this.studentInfo.hospitalName.value ? `${this.studentInfo.hospitalName.value}_` : '';
      return `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.studentInfo.healthCareName.value}_${divName}_${hospitalName}${
        this.dataObject.isQuestionnaireSurvey ? '사후 설문조사' : '문진표'
      }_${this.studentInfo.studentName.value}_${now}`;
    },
    htmlToPDF() {
      const name = this.getFileName();
      this.$htmlToPdf(this.$refs.pdfArea, name, this.districtCodeFirst === 'J' ? [10, 0, 10, 0] : null);
      this.pdfRefreshKey += 1;
    },
    htmlToPdfPrint() {
      this.$htmlToPdfPrint(this.$refs.pdfArea, this.districtCodeFirst === 'J' ? [10, 0, 10, 0] : null);
      this.pdfRefreshKey += 1;
    },
    questionnaireInfo() {
      const form = {
        studentId: this.dataObject.studentId,
        businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
      };
      const request = this.dataObject.isQuestionnaireSurvey ? Hospital.questionnaireSurveyInfo : Hospital.questionnaireInfo;
      request(form).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
          res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
          let info = this.dataObject.isQuestionnaireSurvey ? res.data.questionnaireSurveyInfo : res.data.questionnaireInfo;
          if (info) {
            info.status = this.codeToValue(info.status);
          }
          // code convert end
          this.$store.commit('student/DATA_SET', res.data.studentInfo);
          if (info) {
            this.$store.commit('doc/DATA_SET', info.form);
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    generateCanvas(i, contWidth, deferred, curList) {
      //페이지를 이미지로 만들기
      const pdfWidth = $(curList).outerWidth(true) * 0.2645, //px -> mm로 변환
        pdfHeight = $(curList).outerHeight() * 0.2645,
        fullHeight = $(curList).outerHeight(true) * 0.2645, // margin 포함
        heightCalc = (contWidth * pdfHeight) / pdfWidth, //비율에 맞게 높이 조절
        fullHeightCalc = (contWidth * fullHeight) / pdfWidth;

      html2canvas(curList, { logging: false }).then(canvas => {
        const img = canvas.toDataURL('image/jpeg', 1.0); //이미지 형식 지정
        this.renderedImg.push({ num: i, image: img, height: heightCalc, fullHeight: fullHeightCalc }); //renderedImg 배열에 이미지 데이터 저장(뒤죽박죽 방지)
        deferred.resolve(); //결과 보내기
      });
    },
    pdfDownload(print) {
      this.$store.commit('loading', true);
      // setTImeout을 하는 이유는 html2canvas를 불러오는게 너무 빨라서 앞의 js가 먹혀도 반영되지 않은 것처럼 보임
      // 따라서 0.1 초 지연 발생 시킴
      setTimeout(() => {
        print ? this.pdf(true, true) : this.pdf(true);
      }, 100);
    },
    pdf(download, print) {
      this.renderedImg = []; //이미지 배열 초기화
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      const lists = document.getElementsByClassName('pdfBlock');
      let deferreds = [];
      let doc = new jsPDF('p', 'mm', 'a4');
      const padding = 20 * 0.2645; // 상하좌우 여백(px -> mm로 변환);
      const contWidth = 210 - padding * 2; // A4 기준

      for (let i = 0; i < lists.length; i++) {
        const deferred = $.Deferred();
        deferreds.push(deferred.promise());
        this.generateCanvas(i, contWidth, deferred, lists[i]);
      }

      $.when.apply($, deferreds).then(() => {
        // 이미지 렌더링이 끝난 후
        const sorted = this.renderedImg.sort((a, b) => {
          return a.num < b.num ? -1 : 1;
        }); // 순서대로 정렬
        let curHeight = print ? 0 : padding; //위 여백 (이미지가 들어가기 시작할 y축)

        if (print) {
          // 인쇄
          let imgHtml = '';
          for (let i = 0; i < sorted.length; i++) {
            const sortedHeight = sorted[i].height, //이미지 높이
              sortedFullHeight = sorted[i].fullHeight, // margin 포함 이미지 높이
              sortedImage = sorted[i].image; //이미지

            const margin = sortedFullHeight - sortedHeight;
            imgHtml += `<img src="${sortedImage}" style="margin-top:${margin}mm;" />`;
          }
          this.$store.commit('loading', false); // 팝업 차단 대비 loading 먼저 제거
          const Pagelink = 'about:blank';
          const pwa = window.open(Pagelink, '_new');
          pwa.document.open();
          const source =
            `<html>
                                    <head>
                                        <style type="text/css" media="print">
                                            @page {
                                                margin: ${padding}mm;
                                            }
                                        </style>
                                        <script>
                                            function step1() {
                                                setTimeout("step2()", 10);
                                            }
                                            function step2() {
                                                window.print();
                                                window.close();
                                            }
                                        </scr` +
            `ipt>
                                    </head>
                                    <body onload="step1()">${imgHtml}</body>
                                    </html>`;
          pwa.document.write(source);
          pwa.document.close();
          return false;
        }
        // pdf
        for (let i = 0; i < sorted.length; i++) {
          const sortedHeight = sorted[i].height, //이미지 높이
            sortedFullHeight = sorted[i].fullHeight, // margin 포함 이미지 높이
            sortedImage = sorted[i].image; //이미지

          if (i !== 0 && curHeight + sortedFullHeight > 297 - padding * 2) {
            // a4 높이에 맞게 남은 공간이 이미지높이보다 작을 경우 페이지 추가
            doc.addPage(); // 페이지를 추가함
            curHeight = padding; // 이미지가 들어갈 y축을 초기 여백값으로 초기화
            doc.addImage(sortedImage, 'jpeg', padding, curHeight, contWidth, sortedHeight); //이미지 넣기
            curHeight += sortedHeight; // y축 = 여백 + 새로 들어간 이미지 높이
          } else {
            // 페이지에 남은 공간보다 이미지가 작으면 페이지 추가하지 않음
            const margin = sortedFullHeight - sortedHeight;
            curHeight += margin; // 마진값만큼 높이 추가
            doc.addImage(sortedImage, 'jpeg', padding, curHeight, contWidth, sortedHeight); //이미지 넣기
            curHeight += sortedHeight; // y축 = 기존y축 + 새로들어간 이미지 높이
          }
        }
        if (download) {
          const fileName = this.getFileName();
          doc.save(`${fileName}.pdf`);
          this.$store.commit('loading', false);
        } else {
          const blob = doc.output('blob');
          const file = new Blob([blob], { type: 'application/pdf' });
          const form = new FormData();
          form.append('studentId', this.dataObject.studentId);
          form.append('businessDivision', this.dataObject.businessDivision);
          form.append('dcfType', 'Q');
          form.append('file', file, `Q${this.dataObject.studentId}${this.dataObject.businessDivision}.pdf`);
          Hospital.documentFileRegist(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$store.commit('doc/pdfStatusSet', true);
            } else {
              this.$store.commit('loading', false);
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        }
      });
    },
  },
  created() {
    this.title =
      this.districtCodeFirst === 'I'
        ? '초등학생 구강진료 지원사업 사전 설문조사'
        : `${this.divName(this.dataObject.businessDivision, false, true)} ${this.dataObject.isQuestionnaireSurvey ? '사후 설문조사' : '구강검진 문진표'}`;

    if (!this.dataObject.pdf) {
      this.$store.commit('student/resetStudentInfo');
      this.$store.commit('doc/questionnaire_clear');
    }

    this.$store.commit('doc/questionnaire_set', { districtCodeFirst: this.districtCodeFirst, businessDivision: this.dataObject.businessDivision });

    this.form.q1 = { data1: 'q_1' };
    this.form.q2 = { data1: 'q_2' };
    this.form.q3 = { data1: 'q_3' };
    this.form.q4 = { data1: 'q_4' };
    this.form.q5 = { data1: 'q_5' };
    this.form.q6 = { data1: 'q_6' };
    this.form.q7 = { data1: 'q_7' };
    this.form.q8 = { data1: 'q_8' };
    this.form.q9 = { data1: 'q_9' };
    this.form.q9_1 = { data1: 'q_9_1' };
    this.form.q10 = { data1: 'q_10', data2: 'q_10_input' };
    this.form.q11 = { data1: 'q_11' };
    this.form.q12 = { data1: 'q_12' };
    this.form.q13 = { data1: 'q_13', data2: 'q_13_input' };
    this.form.q14 = { data1: 'q_14' };
    this.form.q15_1 = { data1: 'q_15_1' };
    this.form.q15_2 = { data1: 'q_15_2' };
    this.form.q15_3 = { data1: 'q_15_3' };
    this.form.q15_4 = { data1: 'q_15_4' };
    this.form.q15_5 = { data1: 'q_15_5' };
    this.form.q15_6 = { data1: 'q_15_6' };
    this.form.q15_7 = { data1: 'q_15_7' };
    this.form.q16 = { data1: 'q_16' };
    this.form.q17 = { data1: 'q_17' };
    this.form.q18 = { data1: 'q_18' };
    this.form.q19 = { data1: 'q_19' };
    this.form.q20 = { data1: 'q_20' };
    this.form.q21 = { data1: 'q_21' };
    this.form.q22 = { data1: 'q_22' };
    this.form.q23 = { data1: 'q_23' };
    this.form.q23_1 = { data1: 'q_23_1' };

    if (!this.dataObject.isQuestionnaireSurvey && this.districtCodeFirst !== 'I') {
      // 모든 지역 공통 (사후 설문조사, 전북 제외)
      this.formBlock.block1.push(
        { id: 1, form: this.form.q1, num: 1 },
        { id: 2, form: this.form.q2, num: 2 },
        { id: 3, form: this.form.q3, num: 3 },
        { id: 4, form: this.form.q4, num: 4 },
        { id: 5, form: this.form.q5, num: 5 },
        { id: 6, form: this.form.q6, num: 6 },
      );
    }

    if (this.districtCodeFirst === 'A' && this.dataObject.businessDivision !== 'E') {
      // 서울 (학구 제외)
      this.formBlock.block2.push(
        { id: 1, form: this.form.q7, num: 7 },
        { id: 2, form: this.form.q8, num: 8 },
        { id: 3, form: this.form.q9, num: 9 },
        { id: 4, form: this.form.q9_1, num: '9-1' },
        { id: 5, form: this.form.q22, num: 10 },
        { id: 6, form: this.form.q10, num: 11 },
        { id: 7, form: this.form.q11, num: 12 },
      );
    } else if (['A', 'G'].includes(this.districtCodeFirst) && this.dataObject.businessDivision === 'E') {
      // 서울시, 수원시 학생구강검진
      this.formBlock.block2.push({ id: 1, form: this.form.q18, num: 7 }, { id: 2, form: this.form.q12, num: 8 }, { id: 3, form: this.form.q7, num: 9 }, { id: 4, form: this.form.q8, num: 10 });
    } else if (this.districtCodeFirst === 'B') {
      // 인천시
      this.formBlock.block2.push(
        { id: 1, form: this.form.q10, num: 7 },
        { id: 2, form: this.form.q12, num: 8 },
        { id: 3, form: this.form.q7, num: 9 },
        { id: 4, form: this.form.q13, num: 10 },
        { id: 5, form: this.form.q11, num: 11 },
        { id: 6, form: this.form.q21, num: 12 },
      );
    } else if (this.districtCodeFirst === 'C') {
      // 경기도
      this.formBlock.block2.push(
        { id: 1, form: this.form.q10, num: this.dataObject.isQuestionnaireSurvey ? 1 : 7 },
        { id: 2, form: this.form.q12, num: this.dataObject.isQuestionnaireSurvey ? 2 : 8 },
        { id: 3, form: this.form.q13, num: this.dataObject.isQuestionnaireSurvey ? 3 : 9 },
        { id: 4, form: this.form.q14, num: this.dataObject.isQuestionnaireSurvey ? 4 : 10 },
        { id: 5, form: this.form.q15_1, num: this.dataObject.isQuestionnaireSurvey ? '5-1' : '11-1' },
        { id: 6, form: this.form.q15_2, num: this.dataObject.isQuestionnaireSurvey ? '5-2' : '11-2' },
        { id: 7, form: this.form.q15_3, num: this.dataObject.isQuestionnaireSurvey ? '5-3' : '11-3' },
        { id: 8, form: this.form.q15_4, num: this.dataObject.isQuestionnaireSurvey ? '5-3-1' : '11-3-1' },
        { id: 9, form: this.form.q15_5, num: this.dataObject.isQuestionnaireSurvey ? '5-4' : '11-4' },
        { id: 10, form: this.form.q15_6, num: this.dataObject.isQuestionnaireSurvey ? '5-5' : '11-5' },
        { id: 11, form: this.form.q15_7, num: this.dataObject.isQuestionnaireSurvey ? '5-6' : '11-6' },
        { id: 12, form: this.form.q16, num: this.dataObject.isQuestionnaireSurvey ? 6 : 12 },
        { id: 13, form: this.form.q17, num: this.dataObject.isQuestionnaireSurvey ? 7 : 13 },
      );
    } else if (['D', 'F'].indexOf(this.districtCodeFirst) !== -1) {
      // 부산 / 밀양
      this.formBlock.block2.push(
        { id: 1, form: this.form.q7, num: 7 },
        { id: 2, form: this.form.q8, num: 8 },
        { id: 3, form: this.form.q9, num: 9 },
        { id: 4, form: this.form.q9_1, num: '9-1' },
        { id: 5, form: this.form.q10, num: 10 },
        { id: 6, form: this.form.q11, num: 11 },
      );
    } else if (this.districtCodeFirst === 'E') {
      // 순천시
      this.formBlock.block2.push(
        { id: 1, form: this.form.q7, num: 7 },
        { id: 2, form: this.form.q8, num: 8 },
        { id: 3, form: this.form.q12, num: 9 },
        { id: 4, form: this.form.q13, num: 10 },
        { id: 5, form: this.form.q10, num: 11 },
        { id: 6, form: this.form.q11, num: 12 },
      );
    } else if (this.districtCodeFirst === 'H') {
      // 여수시
      delete this.form.q13.data2;
      this.formBlock.block2.push(
        { id: 1, form: this.form.q19, num: 7 },
        { id: 2, form: this.form.q7, num: 8 },
        { id: 3, form: this.form.q20, num: 9 },
        { id: 4, form: this.form.q8, num: 10 },
        { id: 5, form: this.form.q13, num: 11 },
        { id: 6, form: this.form.q12, num: 12 },
        { id: 7, form: this.form.q14, num: 13 },
        { id: 8, form: this.form.q18, num: 14 },
        { id: 9, form: this.form.q11, num: 15 },
      );
    } else if (this.districtCodeFirst === 'I') {
      // 전북
      this.formBlock.block2.push(
        { id: 1, form: this.form.q10, num: 1 },
        { id: 2, form: this.form.q16, num: 2 },
        { id: 3, form: this.form.q12, num: 3 },
        { id: 4, form: this.form.q17, num: 4 },
        { id: 5, form: this.form.q15_5, num: '5-1' },
        { id: 6, form: this.form.q15_6, num: '5-2' },
        { id: 7, form: this.form.q15_7, num: '5-3' },
      );
    } else if (this.districtCodeFirst === 'J') {
      // 울산
      this.formBlock.block2.push(
        { id: 1, form: this.form.q18, num: 7 },
        { id: 2, form: this.form.q12, num: 8 },
        { id: 3, form: this.form.q7, num: 9 },
        { id: 4, form: this.form.q8, num: 10 },
        { id: 5, form: this.form.q23, num: 11 },
        { id: 6, form: this.form.q23_1, num: '11-1' },
      );
    }

    if (!this.dataObject.pdf) {
      this.questionnaireInfo();
    }
  },
  mounted() {
    if (this.dataObject.pdf) {
      const view = document.querySelector('.container_wrap');
      view.style.zIndex = 99;
      setTimeout(() => {
        this.pdf();
        this.popupClose();
        view.style.zIndex = '';
      }, 500);
    }
  },
};
</script>

<style lang="scss">
.onepage {
  .lcommp {
    font-size: 26px;
  }
  .commp2 {
    font-size: 16px;
  }
  .commp {
    font-size: 13px;
  }
  .scommp {
    font-size: 12px;
  }

  .info_box {
    height: 32px;

    & > p {
      line-height: 32px;
    }
  }

  .mt5 {
    margin-top: 3px !important;
  }
  .mt10 {
    margin-top: 5px !important;
  }
  .mt20 {
    margin-top: 12px !important;
  }
  .mt30 {
    margin-top: 20px !important;
  }

  .form_wrap_question_table .question_th,
  .form_wrap_question_table .question_td {
    min-height: 30px;
  }

  .textarea_box {
    height: 80px !important;
    font-size: 13px;
  }
}
</style>
