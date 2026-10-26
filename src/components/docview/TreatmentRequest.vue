<template>
  <div class="popup_content">
    <v-popuptitle divclass="bg__form_ver" message="진료 의뢰서" imgsrc="sub/ic_write.png"></v-popuptitle>
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
        <div id="pdf" class="pdf_page_wrap" ref="pdfArea">
          <div class="lcommp tac fwb">아동치과주치의 구강 진료 의뢰서</div>
          <std-info-box businessDivision="C" />

          <div class="row flex_set flex_left mt30">
            <div class="flex_item flex_size_m5">
              <p class="commp fwn">의료기관명</p>
              <div class="m__putbox mt10">
                <div class="input_box_view">{{ hospitalName }}</div>
              </div>
            </div>
          </div>
          <p class="commp fwn mt20">
            환자상태 및 진료의뢰내용
            <span class="c_red">*</span>
          </p>
          <div class="textarea_box mt10" style="min-height: 300px" v-html="formContents.treatmentRequest.tt_contents.value.replace(/(\n)/g, '<br>')"></div>
          <div class="comm__line mt30"></div>
          <div class="mt20">
            <doctor-info :data-array="form.doctor" subject="작성" />
          </div>
        </div>
      </div>
      <div v-if="cancelable" class="row mt30">
        <div class="inner--left">
          <a href="javascript:;" class="comm__red_btn d_block btn_l_size commp2 fwn wid130" @click="deleteTreatmentRequest">의뢰 취소</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import DoctorInfo from '@/components/docview/doctorInfo';
import StdInfoBox from '@/components/docview/stdInfoBox.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
    DoctorInfo,
    StdInfoBox,
  },
  props: ['dataObject'],
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapState('user', ['userOrganTargetType', 'hospitalType']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode']),
  },
  data() {
    return {
      hospitalName: '',
      form: {
        doctor: { data1: 'tt_doctor', data2: 'tt_doctor_name', data3: 'tt_license', data4: 'tt_date', data5: 'tt_organ' },
      },
      cancelable: false,
    };
  },
  created() {
    if (!this.dataObject.pdf) {
      this.$store.commit('doc/treatmentRequest_clear');

      let infoForm = {
        hospitalId: this.dataObject.hospitalId,
        studentId: this.dataObject.studentId,
        notificationId: this.dataObject.notificationId,
      };
      Hospital.treatmentRequestInfo(infoForm).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
          res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
          if (res.data.treatmentRequestInfo) {
            res.data.treatmentRequestInfo.status = this.codeToValue(res.data.treatmentRequestInfo.status);
          }
          // code convert end
          this.hospitalName = res.data.hospitalInfo.hospitalName;
          this.$store.commit('student/DATA_SET', res.data.studentInfo);
          if (res.data.treatmentRequestInfo) {
            this.$store.commit('doc/DATA_SET', res.data.treatmentRequestInfo.form);
            // 보건소치과 계정에서 진료의뢰서 상태 최종제출인 경우 진료계획서가 제출되기 전이면 의뢰취소 가능
            if (this.userOrganTargetType === 'HP' && this.hospitalType === 'H' && res.data.treatmentRequestInfo.status === 'Y') {
              this.cancelable = res.data.cancelable;
            }
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
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
      return `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.studentInfo.healthCareName.value}_아동치과주치의_진료의뢰서_${this.studentInfo.studentName.value}_${now}`;
    },
    htmlToPDF() {
      const name = this.getFileName();
      this.$htmlToPdf(this.$refs.pdfArea, name);
    },
    htmlToPdfPrint() {
      this.$htmlToPdfPrint(this.$refs.pdfArea);
    },
    deleteTreatmentRequest() {
      this.$fire({
        text: `${this.studentInfo.studentName.value} 아동의 진료의뢰서를 취소하시겠습니까?`,
        allowEnterKey: false,
        showConfirmButton: true,
        showCancelButton: true,
        inputPlaceholder: '의뢰취소 사유 입력',
        input: 'textarea',
        inputValidator: function (text) {
          if (text === '') {
            return '의뢰취소 사유 입력 부탁드립니다.';
          }
        },
      })
        .then(result => {
          if (result.value) {
            const form = {
              notificationId: this.dataObject.notificationId,
              treatmentRequestCancelReason: result.value,
            };
            Hospital.treatmentRequestDeleteReason(form).then(res => {
              if (res && res.data.rt === 200) {
                this.$alert('취소되었습니다.', '알림', 'success').then(() => {
                  this.$store.dispatch('popup/popupClose');
                  this.$store.commit('update');
                });
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            });
          }
        })
        .catch(() => {});
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
          form.append('dcfType', 'TT');
          form.append('notificationId', this.dataObject.notificationId);
          form.append('file', file, `TT${this.dataObject.studentId}C${this.dataObject.notificationId}.pdf`);
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
