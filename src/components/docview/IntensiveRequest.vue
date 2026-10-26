<template>
  <div class="popup_content">
    <v-popuptitle divclass="bg__form_ver" message="심화치료 진료 의뢰서" imgsrc="sub/ic_write.png"></v-popuptitle>
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
      <div id="pdf" class="bg_white comm__inner mt20" ref="pdfArea">
        <div class="lcommp tac fwb">아동치과주치의 심화치료 진료 의뢰서</div>
        <std-info-box businessDivision="C" />

        <div class="row flex_set flex_left mt30">
          <div class="flex_item flex_size_m5">
            <p class="commp fwn">
              상병명
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <div class="input_box_view">{{ formContents.intensiveRequest.tr_disease_name.value }}</div>
            </div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="commp fwn">
              상병코드
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <div class="input_box_view">{{ formContents.intensiveRequest.tr_disease_code.value }}</div>
            </div>
          </div>
        </div>
        <p class="commp fwn mt20">
          환자상태 및 진료의뢰내용
          <span class="c_red">*</span>
        </p>
        <div class="textarea_box mt10" style="min-height: 300px" v-html="formContents.intensiveRequest.tr_contents.value.replace(/(\n)/g, '<br>')"></div>
        <agency-info />

        <div v-if="files.length" class="comm__line mt30" data-html2canvas-ignore></div>
        <p v-if="files.length" class="commp fwn mt30" data-html2canvas-ignore>첨부파일</p>

        <div v-if="files.length" class="row mt10 file__upload" data-html2canvas-ignore>
          <div v-for="(file, index) in files" :key="file.intensiveRequestFileId" class="upload_put p_relative on" :class="{ mt10: parseInt(index) > 0 }">
            <input type="text" class="upload_text upload-name ml0" readonly="readonly" :value="file.originName" />
            <a :href="file.fullPath" class="name_del"><img src="@/assets/images/common/ic_download.png" /></a>
          </div>
        </div>
      </div>

      <div class="bg_white comm__inner mt30">
        <p class="fwb commp2">심화치료 승인</p>
        <!-- 승인 / 미승인 가능한 경우 -->
        <div class="row set_table mt35">
          <div class="set__table align_top" style="width: 32%">
            <p class="commp fwn">승인 여부 선택</p>
            <div class="row mt10">
              <!--클릭시 클래스 on 활성화 -->
              <template v-if="approvable">
                <a href="javascript:;" class="cs_btns cs_btns1" :class="{ on: submitForm.intensiveRequestStatus === 'A' }" @click="intensiveRequestStatusChange('A')">
                  <span class="icon"></span>
                  승인
                </a>
                <a href="javascript:;" class="cs_btns cs_btns2 ml5" :class="{ on: submitForm.intensiveRequestStatus === 'D' }" @click="intensiveRequestStatusChange('D')">
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
            <div v-if="approvable" class="cs__box" :class="{ on: submitForm.intensiveRequestStatus === 'D' }">
              <p class="commp fwn">미승인 사유</p>
              <div class="d_block textbox mt10">
                <textarea
                  v-model="submitForm.intensiveRequestRejectReason"
                  cols="30"
                  rows="10"
                  class="textarea_box"
                  :class="{ read_only: submitForm.intensiveRequestStatus !== 'D' }"
                  placeholder="미승인 사유를 작성해 주세요."
                  style="width: 480px; height: 90px"
                  :disabled="submitForm.intensiveRequestStatus !== 'D'"
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
      </div>
      <v-popupconfirm v-if="approvable" message="최종제출" @save="save"></v-popupconfirm>
      <div v-if="userOrganTargetType === 'HC' && status === 'Y'" class="row mt30">
        <div class="inner--left">
          <a href="javascript:;" class="comm__red_btn d_block btn_l_size commp2 fwn wid130" @click="deleteIntensiveRequest">의뢰 취소</a>
        </div>
      </div>
      <div v-if="userOrganTargetType === 'HC' && status === 'D'" class="row mt30">
        <div class="inner--right">
          <a href="javascript:;" class="comm__red_btn d_block btn_l_size commp2 fwn wid130" @click="rewrite">의뢰서 재작성</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import Business from '@/apis/Business';
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import StdInfoBox from '@/components/docview/stdInfoBox.vue';
import AgencyInfo from '@/components/docview/agencyInfo.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    StdInfoBox,
    AgencyInfo,
  },
  props: ['dataObject'],
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapState('user', ['userOrganTargetType', 'adminOrganType']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
  data() {
    return {
      status: '',
      reason: '',
      approvable: false,
      submitForm: {
        intensiveRequestStatus: '',
        intensiveRequestRejectReason: '',
      },
      files: [],
    };
  },
  created() {
    if (!this.dataObject.pdf) {
      this.$store.commit('doc/intensiveRequest_clear');

      const form = {
        studentId: this.dataObject.studentId,
      };
      Business.intensiveRequestInfo(form).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
          res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
          if (res.data.intensiveRequestInfo) {
            res.data.intensiveRequestInfo.status = this.codeToValue(res.data.intensiveRequestInfo.status);
          }
          // code convert end
          this.$store.commit('student/DATA_SET', res.data.studentInfo);
          if (res.data.intensiveRequestInfo) {
            this.$store.commit('doc/TR_DATA_SET', res.data.intensiveRequestInfo.form);
            this.files = res.data.files;
            this.status = res.data.intensiveRequestInfo.status;
            if (this.status === 'D') {
              this.reason = res.data.intensiveRequestRejectInfo[0].intensiveRequestRejectReason;
            }
            // 서울시 계정에서 심화치료 의뢰서 상태 Y(최종제출(대기중))인 경우 승인/미승인 가능
            if (this.userOrganTargetType === 'CT' && this.adminOrganType !== 'AD' && this.status === 'Y') {
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
      return `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.studentInfo.healthCareName.value}_아동치과주치의_심화치료의뢰서_${this.studentInfo.studentName.value}_${now}`;
    },
    htmlToPDF() {
      const name = this.getFileName();
      this.$htmlToPdf(this.$refs.pdfArea, name);
    },
    htmlToPdfPrint() {
      this.$htmlToPdfPrint(this.$refs.pdfArea);
    },
    intensiveRequestStatusChange(status) {
      this.submitForm.intensiveRequestStatus = status;
      this.submitForm.intensiveRequestRejectReason = '';
    },
    save() {
      if (this.submitForm.intensiveRequestStatus === '') {
        this.$alert('승인 여부를 선택해주세요.', '알림', 'warning');
        return false;
      } else if (this.submitForm.intensiveRequestStatus === 'D' && this.submitForm.intensiveRequestRejectReason === '') {
        this.$alert('미승인 사유를 입력해주세요.', '알림', 'error');
        return false;
      }
      const submitForm = {
        studentId: this.dataObject.studentId,
        intensiveRequestStatus: this.valueToCode('C0001', this.submitForm.intensiveRequestStatus),
        intensiveRequestRejectReason: this.submitForm.intensiveRequestRejectReason,
      };
      Business.intensiveRequestApprovalOrRejection(submitForm).then(res => {
        if (res && res.data.rt === 200) {
          this.$alert((this.submitForm.intensiveRequestStatus === 'A' ? '승인' : '미승인') + '되었습니다.', '알림', 'success').then(() => {
            this.$store.dispatch('popup/popupClose');
            this.$store.commit('update');
          });
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    rewrite() {
      this.$router.push({ path: '/healthcare/intensiveRequest', query: { studentId: this.dataObject.studentId } });
      this.$store.dispatch('popup/popupClose');
    },
    deleteIntensiveRequest() {
      this.$fire({
        text: `${this.studentInfo.studentName.value} 아동의 심화치료 진료 의뢰를 취소하시겠습니까?`,
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
              studentId: this.dataObject.studentId,
              reason: result.value,
            };
            Business.intensiveRequestDeleteReason(form).then(res => {
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
          form.append('dcfType', 'TR');
          form.append('file', file, `TR${this.dataObject.studentId}C.pdf`);
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
