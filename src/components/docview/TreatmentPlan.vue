<template>
  <div class="popup_content">
    <v-popuptitle divclass="bg__form_ver" message="진료 계획서" imgsrc="sub/ic_write.png"></v-popuptitle>
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
          <div class="lcommp tac fwb">아동치과주치의 구강 진료 계획서</div>
          <std-info-box businessDivision="C" />
          <div class="comm__line mt30"></div>
          <p class="commp2 fwb mt30">진료 계획 작성 원칙</p>
          <p class="commp mt5 fw500">
            * 치과 진료는 자치구 보건소 지역협의체 회의에서 결정된 진료범위입니다. (반드시 확인요망)
            <br />
            * 예방진료 : 치아홈메우기/치석제거(부분치석제거)
          </p>
          <p class="commp mt20 c_red fw500">
            ※ 치석제거 전악제거가 필요시 보건소 협의하에 진행
            <br />
            ※ 불소도포는 치과의원에서 실시하더라도 청구 불가
            <br />
            ※ 예산사정상 반드시 보건소 승인 후 진료 시작하셔야 합니다.
          </p>

          <p class="commp2 fwb mt30">구강 진료 계획</p>
          <div class="textarea_box mt20" style="min-height: 300px" v-html="formContents.treatmentPlan.t_contents.value.replace(/(\n)/g, '<br>')"></div>
          <div class="comm__line mt30"></div>
          <div class="mt20">
            <doctor-info :data-array="form.doctor" subject="작성" />
          </div>
        </div>
      </div>
      <div class="bg_white mt20 pb20">
        <div class="pdf_page_wrap">
          <p class="fwb commp2">진료 계획 승인</p>
          <!-- 승인 / 미승인 가능한 경우 -->
          <div class="row set_table mt35">
            <div class="set__table align_top" style="width: 32%">
              <p class="commp fwn">승인 여부 선택</p>
              <div class="row mt10">
                <!--클릭시 클래스 on 활성화 -->
                <template v-if="approvable">
                  <a href="javascript:;" class="cs_btns cs_btns1" :class="{ on: submitForm.treatmentPlanStatus === 'A' }" @click="treatmentPlanStatusChange('A')">
                    <span class="icon"></span>
                    승인
                  </a>
                  <a href="javascript:;" class="cs_btns cs_btns2 ml5" :class="{ on: submitForm.treatmentPlanStatus === 'D' }" @click="treatmentPlanStatusChange('D')">
                    <span class="icon"></span>
                    미승인
                  </a>
                </template>
                <template v-else>
                  <a href="javascript:;" class="cs_btns cs_btns1" :class="{ on: status === 'A' }">
                    <span class="icon"></span>
                    승인
                  </a>
                  <a href="javascript:;" class="cs_btns cs_btns2 ml5" :class="{ on: status === 'D' }">
                    <span class="icon"></span>
                    미승인
                  </a>
                </template>
              </div>
            </div>
            <div class="set__table align_top" style="width: 68%">
              <!-- 미승인 선택시 cs__box .on 활성화 -->
              <div v-if="approvable" class="cs__box" :class="{ on: submitForm.treatmentPlanStatus === 'D' }">
                <p class="commp fwn">미승인 사유</p>
                <div class="d_block textbox mt10">
                  <textarea
                    v-model="submitForm.treatmentPlanRejectReason"
                    cols="30"
                    rows="10"
                    class="textarea_box"
                    :class="{ read_only: submitForm.treatmentPlanStatus !== 'D' }"
                    placeholder="미승인 사유를 작성해 주세요."
                    style="width: 480px; height: 90px"
                    :disabled="submitForm.treatmentPlanStatus !== 'D'"
                  ></textarea>
                </div>
              </div>
              <div v-else class="cs__box" :class="{ on: status === 'D' }">
                <p class="commp fwn">미승인 사유</p>
                <div class="d_block textbox mt10">
                  <div class="textarea_box" style="min-height: 90px" :class="{ read_only: status !== 'D' }" v-html="reason.replace(/(\n)/g, '<br>')"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="row set_table">
            <div class="set__table align_top">
              <div v-if="approvable" class="cs__box on">
                <p class="commp fwn">비고</p>
                <div class="d_block textbox mt10">
                  <textarea v-model="treatmentPlanNote" cols="30" rows="10" class="textarea_box" placeholder="비고를 작성해 주세요." style="width: 95%; height: 60px"></textarea>
                </div>
              </div>
              <div v-else class="cs__box" :class="{ on: treatmentPlanNote }">
                <p class="commp fwn">비고</p>
                <div class="d_block textbox mt10">
                  <div class="textarea_box" style="min-height: 60px" :class="{ read_only: !treatmentPlanNote }" v-html="treatmentPlanNote.replace(/(\n)/g, '<br>')"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="approvable" class="row mt30">
        <div class="inner--left">
          <a href="javascript:;" class="comm__red_btn d_block btn_l_size commp2 fwn wid130" @click="deleteTreatmentPlan">의뢰 취소</a>
        </div>
        <div class="inner--right">
          <a href="javascript:;" class="comm__blue_btn d_block btn_l_size commp2 fwn wid130" @click="save">최종제출</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import Hospital from '@/apis/Hospital';
import Business from '@/apis/Business';
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
    ...mapState('user', ['userOrganTargetType']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode']),
  },
  data() {
    return {
      form: {
        doctor: { data1: 't_doctor', data2: 't_doctor_name', data3: 't_license', data4: 't_date', data5: 't_organ' },
      },
      status: '',
      reason: '',
      treatmentPlanNote: '',
      approvable: false,
      submitForm: {
        treatmentPlanStatus: '',
        treatmentPlanRejectReason: '',
      },
    };
  },
  created() {
    if (!this.dataObject.pdf) {
      this.$store.commit('doc/treatmentPlan_clear');
      this.t_etc = this.formContents.treatmentPlan.t_etc;
      this.t_etc_contents = this.formContents.treatmentPlan.t_etc_contents;

      let infoForm = {
        hospitalId: this.dataObject.hospitalId,
        studentId: this.dataObject.studentId,
        notificationId: this.dataObject.notificationId,
      };
      Hospital.treatmentPlanInfo(infoForm).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
          res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
          if (res.data.treatmentPlanInfo) {
            res.data.treatmentPlanInfo.status = this.codeToValue(res.data.treatmentPlanInfo.status);
          }
          // code convert end
          this.$store.commit('student/DATA_SET', res.data.studentInfo);
          if (res.data.treatmentPlanInfo) {
            this.$store.commit('doc/DATA_SET', res.data.treatmentPlanInfo.form);
            this.status = res.data.treatmentPlanInfo.status;
            this.treatmentPlanNote = res.data.treatmentPlanInfo.treatmentPlanNote ?? '';
            if (this.status === 'D') {
              this.reason = res.data.treatmentPlanInfo.treatmentPlanRejectList[0].treatmentPlanRejectReason;
            }
            // 보건소 계정에서 진료계획서 상태 Y(최종제출(대기중))인 경우 승인/미승인 가능
            if (this.userOrganTargetType === 'HC' && this.status === 'Y') {
              this.approvable = true;
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
      return `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.studentInfo.healthCareName.value}_아동치과주치의_진료계획서_${this.studentInfo.studentName.value}_${now}`;
    },
    htmlToPDF() {
      const name = this.getFileName();
      this.$htmlToPdf(this.$refs.pdfArea, name);
    },
    htmlToPdfPrint() {
      this.$htmlToPdfPrint(this.$refs.pdfArea);
    },
    treatmentPlanStatusChange(status) {
      this.submitForm.treatmentPlanStatus = status;
      this.submitForm.treatmentPlanRejectReason = '';
    },
    save() {
      this.$confirm('최종제출 하시겠습니까?', '알림', 'question')
        .then(() => {
          if (this.submitForm.treatmentPlanStatus === '') {
            this.$alert('승인 여부를 선택해주세요.', '알림', 'warning');
            return false;
          } else if (this.submitForm.treatmentPlanStatus === 'D' && this.submitForm.treatmentPlanRejectReason === '') {
            this.$alert('미승인 사유를 입력해주세요.', '알림', 'error');
            return false;
          }
          const submitForm = {
            studentId: this.dataObject.studentId,
            hospitalId: this.dataObject.hospitalId,
            notificationId: this.dataObject.notificationId,
            treatmentPlanStatus: this.valueToCode('C0001', this.submitForm.treatmentPlanStatus),
            treatmentPlanRejectReason: this.submitForm.treatmentPlanRejectReason,
            treatmentPlanNote: this.treatmentPlanNote?.trim() || '',
          };
          Business.treatmentPlanApprovalOrRejection(submitForm).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert((this.submitForm.treatmentPlanStatus === 'A' ? '승인' : '미승인') + '되었습니다.', '알림', 'success').then(() => {
                this.$store.dispatch('popup/popupClose');
                this.$store.commit('update');
              });
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
    deleteTreatmentPlan() {
      this.$fire({
        text: `${this.studentInfo.studentName.value} 아동의 진료계획서를 취소하시겠습니까?`,
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
              treatmentPlanCancelReason: result.value,
            };
            Business.treatmentPlanDeleteReason(form).then(res => {
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
          form.append('dcfType', 'T');
          form.append('notificationId', this.dataObject.notificationId);
          form.append('file', file, `T${this.dataObject.studentId}C${this.dataObject.notificationId}.pdf`);
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
