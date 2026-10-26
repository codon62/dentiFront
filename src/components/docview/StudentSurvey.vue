<template>
  <div class="popup_content">
    <v-popuptitle divclass="bg__form_ver" message="만족도조사" imgsrc="sub/ic_write.png"></v-popuptitle>
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
        <div class="pdf_page_wrap" ref="pdfArea" :key="pdfRefreshKey">
          <div class="lcommp tac fwb">{{ title }}</div>
          <std-info-box :businessDivision="dataObject.businessDivision" />
          <p class="scommp mt20">* 더 나은 치과 서비스 개선 등 제도 개선을 위한 기초 자료로 활용될 예정이오니, 아래 문항을 읽고 일치하는 내용에 표시해 주세요.</p>
          <student-survey-table width="575" width2="205" :data-array="formBlock.block1" :view="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import studentSurveyTable from '@/components/doc/studentSurveyTable';
import { mapActions, mapGetters, mapState } from 'vuex';
import StdInfoBox from '@/components/docview/stdInfoBox.vue';

export default {
  components: {
    'v-popuptitle': popupTitle,
    studentSurveyTable,
    StdInfoBox,
  },
  props: ['dataObject'],
  computed: {
    ...mapState('student', ['studentInfo']),
    ...mapState('status', ['districtCodeFirstToName', 'businessDivision']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName']),
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
      return `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.studentInfo.healthCareName.value}_${divName}_${hospitalName}만족도조사_${this.studentInfo.studentName.value}_${now}`;
    },
    htmlToPDF() {
      const name = this.getFileName();
      this.$htmlToPdf(this.$refs.pdfArea, name);
      this.pdfRefreshKey += 1;
    },
    htmlToPdfPrint() {
      this.$htmlToPdfPrint(this.$refs.pdfArea);
      this.pdfRefreshKey += 1;
    },
    studentSurveyInfo() {
      const form = {
        studentId: this.dataObject.studentId,
        businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
      };
      Hospital.studentSurveyInfo(form).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
          res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
          if (res.data.studentSurveyInfo) {
            res.data.studentSurveyInfo.status = this.codeToValue(res.data.studentSurveyInfo.status);
          }
          // code convert end
          this.$store.commit('student/DATA_SET', res.data.studentInfo);
          if (res.data.studentSurveyInfo) {
            this.$store.commit('doc/STUDENTSURVEY_DATA_SET', res.data.studentSurveyInfo.form);
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
  created() {
    this.title = `${this.divName(this.dataObject.businessDivision, false, true)} 만족도조사`;

    this.$store.commit('student/resetStudentInfo');
    this.$store.commit('doc/studentSurvey_clear');
    this.$store.commit('loading', false);

    this.form.q1 = { data1: 'q_1' };
    this.form.q2 = { data1: 'q_2' };
    this.form.q3 = { data1: 'q_3' };
    this.form.q4 = { data1: 'q_4', data2: 'q_4_input' };
    this.form.q5 = { data1: 'q_5' };
    this.form.q6 = { data1: 'q_6' };
    this.form.q7 = { data1: 'q_7' };
    this.form.q8 = { data1: 'q_8' };
    this.form.q9 = { data1: 'q_9' };
    this.form.q9_1 = { data1: 'q_9_1', data2: 'q_9_1_input' };

    this.$store.commit('doc/studentSurvey_set', { districtCodeFirst: this.districtCodeFirst, businessDivision: this.dataObject.businessDivision });

    this.formBlock.block1.push(
      { id: 1, form: this.form.q1, num: 1 },
      { id: 2, form: this.form.q2, num: 2 },
      { id: 3, form: this.form.q3, num: 3 },
      { id: 4, form: this.form.q4, num: 4 },
      { id: 5, form: this.form.q5, num: 5 },
      { id: 6, form: this.form.q6, num: 6 },
      { id: 7, form: this.form.q7, num: 7 },
      { id: 8, form: this.form.q8, num: 8 },
      { id: 9, form: this.form.q9, num: 9 },
      { id: 10, form: this.form.q9_1, num: 10 },
    );

    this.studentSurveyInfo();
  },
};
</script>
