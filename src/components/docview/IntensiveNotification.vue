<template>
  <div class="popup_content">
    <v-popuptitle divclass="bg__form_ver" message="심화치료 통보서" imgsrc="sub/ic_write.png"></v-popuptitle>
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
        <div class="pdf_page_wrap" ref="pdfArea">
          <div class="lcommp tac fwb">아동치과주치의 심화치료 통보서</div>
          <std-info-box businessDivision="C" />
          <div class="comm__line mt30"></div>
          <p class="commp fwn mt20">
            심화치료 내용
            <span class="c_red">*</span>
          </p>
          <div class="textarea_box read_only mt10" style="min-height: 300px" v-html="formContents.intensiveNotification.tn_contents.value.replace(/(\n)/g, '<br>')"></div>

          <div class="row flex_set flex_left mt20">
            <div class="flex_item flex_size_m5">
              <p class="commp fwn">
                비용
                <span class="c_red">*</span>
              </p>
              <div class="m__putbox mt10">
                <input type="text" class="input_box read_only" :value="formContents.intensiveNotification.examPrice.value" readonly />
              </div>
            </div>
          </div>

          <div class="comm__line mt30"></div>
          <div class="mt20">
            <doctor-info :data-array="form.doctor" subject="작성" />
          </div>

          <div v-if="files.length" class="comm__line mt30" data-html2canvas-ignore></div>
          <p v-if="files.length" class="commp fwn mt30" data-html2canvas-ignore>첨부파일</p>

          <div v-if="files.length" class="row mt10 file__upload" data-html2canvas-ignore>
            <div v-for="(file, index) in files" :key="file.intensiveNotificationFileId" class="upload_put p_relative on" :class="{ mt10: parseInt(index) > 0 }">
              <input type="text" class="upload_text upload-name ml0" readonly="readonly" :value="file.originName" />
              <a :href="file.fullPath" class="name_del"><img src="@/assets/images/common/ic_download.png" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import Univhpt from '@/apis/Univhpt';
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import StdInfoBox from '@/components/docview/stdInfoBox.vue';
import DoctorInfo from '@/components/docview/doctorInfo.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
    StdInfoBox,
    DoctorInfo,
  },
  props: ['dataObject'],
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
  data() {
    return {
      form: {
        doctor: { data1: 'tn_doctor', data2: 'tn_doctor', data3: 'tn_license', data4: 'tn_date', data5: 'tn_organ' },
      },
      files: [],
    };
  },
  created() {
    if (!this.dataObject.pdf) {
      this.$store.commit('doc/intensiveNotification_clear');

      const form = {
        universityHospitalId: this.userOrganTargetId,
        studentId: this.dataObject.studentId,
      };
      Univhpt.intensiveNotificationInfo(form).then(res => {
        // code convert
        res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
        res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
        if (res.data.intensiveNotification) {
          res.data.intensiveNotification.status = this.codeToValue(res.data.intensiveNotification.status);
        }
        // code convert end
        if (res && res.data.rt === 200) {
          this.$store.commit('student/DATA_SET', res.data.studentInfo);
          if (res.data.intensiveNotificationInfo) {
            this.$store.commit('doc/TN_DATA_SET', res.data.intensiveNotificationInfo.form);
            this.files = res.data.files;
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
  },
  methods: {
    ...mapActions('popup', ['popupClose']),
    htmlToPDF() {
      const name = this.getFileName();
      this.$htmlToPdf(this.$refs.pdfArea, name);
    },
    htmlToPdfPrint() {
      this.$htmlToPdfPrint(this.$refs.pdfArea);
    },
    getFileName() {
      const date = new Date();
      const now =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);
      return `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.studentInfo.healthCareName.value}_아동치과주치의_심화치료통보서_${this.studentInfo.studentName.value}_${now}`;
    },
    pdf(download, img) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      const selector = '#pdf';
      window.html2canvas = html2canvas; //Vue.js 특성상 window 객체에 직접 할당해야한다.
      let doc = new jsPDF('p', 'mm', 'a4');
      let canvas = doc.canvas;
      const pageWidth = 210; //캔버스 너비 mm
      const pageHeight = 295; //캔버스 높이 mm
      canvas.width = pageWidth;

      let ele = document.querySelector(selector);
      let width = ele.offsetWidth; // 셀렉트한 요소의 px 너비
      let height = ele.offsetHeight; // 셀렉트한 요소의 px 높이
      let imgHeight = (pageWidth * height) / width; // 이미지 높이값 px to mm 변환

      if (!ele) {
        console.warn(selector + ' is not exist.');
        return false;
      }
      html2canvas(ele).then(canvas => {
        let position = 0;
        const imgData = canvas.toDataURL('image/png');
        if (img) {
          var Pagelink = 'about:blank';
          var pwa = window.open(Pagelink, '_new');
          pwa.document.open();
          const source =
            `<html>
                                    <head>
                                        <style type="text/css" media="print">
                                            @page {
                                                margin-top: 0;
                                                margin-bottom: 0;
                                                margin-left: 5px;
                                                margin-right: 5px;
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
                                    <body onload="step1()">
                                        <img src="${imgData}"/>
                                    </body>
                                    </html>`;

          pwa.document.write(source);
          pwa.document.close();
          return false;
        }
        doc.addImage(imgData, 'png', 0, position, pageWidth, imgHeight, undefined, 'slow');

        //Paging 처리
        let heightLeft = imgHeight; //페이징 처리를 위해 남은 페이지 높이 세팅.
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'png', 0, position, pageWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        if (download) {
          const fileName = this.getFileName();
          doc.save(`${fileName}.pdf`);
        } else {
          const blob = doc.output('blob');
          const file = new Blob([blob], { type: 'application/pdf' });
          const form = new FormData();
          form.append('studentId', this.dataObject.studentId);
          form.append('businessDivision', 'C');
          form.append('dcfType', 'TN');
          form.append('file', file, `TN${this.dataObject.studentId}C.pdf`);
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
