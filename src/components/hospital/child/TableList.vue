<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.centerName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.studentName }}</p>
    </td>
    <td v-if="['A', 'C'].includes(districtCodeFirst)">
      <p v-if="data.completeEduDate" class="scommp">이수</p>
      <v-button v-else message="미이수" @vclick="preventEduComplete"></v-button>
    </td>
    <td><v-button :message="iafMsg" :tooltip="iafTooltip" @vclick="agreement"></v-button></td>
    <td><v-button :message="queMsg" :tooltip="queTooltip" @vclick="questionnaire"></v-button></td>
    <td><v-button :message="notMsg" :tooltip="notTooltip" @vclick="notification"></v-button></td>
    <template v-if="districtCodeFirst === 'A'">
      <td v-if="hospitalType === 'H'"><p class="scommp" v-html="treatmentHospitalHtml"></p></td>
      <td><v-button :message="ttrMsg" :tooltip="ttrTooltip" @vclick="treatmentRequest"></v-button></td>
      <td><v-button :message="ttpMsg" :tooltip="ttpTooltip" @vclick="treatmentPlan"></v-button></td>
    </template>
    <td v-if="districtCodeFirst === 'D'">
      <p class="scommp">{{ data.treatStatus ? treatStatus.value[data.treatStatus] : '-' }}</p>
    </td>
    <td><v-button :message="stmMsg" :tooltip="stmTooltip" @vclick="statement"></v-button></td>
    <td><v-button :message="billMsg" :tooltip="billTooltip" :optional-btn-type="billBtnType" @vclick="showBillRejectReason"></v-button></td>
    <td v-if="districtCodeFirst === 'A'"><v-button message="보기" @vclick="historyPopup"></v-button></td>
    <td v-if="districtCodeFirst === 'A' && hospitalType === 'H'"><v-button :message="data.studentBusinessNote ? '메모 조회' : '메모 등록'" @vclick="studentBusinessNoteRegist"></v-button></td>
    <td><v-button :message="modMsg" :tooltip="modTooltip" @vclick="infoModify"></v-button></td>
    <td><v-button :message="canMsg" :tooltip="canTooltip" @vclick="unregister"></v-button></td>
    <!--        <td v-if="isDev"><v-button message="초기화" @vclick="adminBusiness"></v-button></td>-->
  </tr>
</template>

<script>
import Management from '@/apis/Management';
import Hospital from '@/apis/Hospital';
import Button from '@/components/common/Button.vue';
import { mapGetters, mapState } from 'vuex';
import Bill from '@/apis/Bill';

export default {
  components: {
    'v-button': Button,
  },
  props: ['num', 'data'],
  data() {
    return {
      iafMsg: '',
      iafTooltip: '',
      queMsg: '',
      queTooltip: '',
      notMsg: '',
      notTooltip: '',
      ttrMsg: '',
      ttrTooltip: '',
      ttpMsg: '',
      ttpTooltip: '',
      stmMsg: '',
      stmTooltip: '',
      billMsg: '',
      billTooltip: '',
      billBtnType: '',
      modMsg: '',
      modTooltip: '',
      canMsg: '',
      canTooltip: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId', 'hospitalType']),
    ...mapState('status', ['treatStatus']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['endBusiness']),
    treatmentHospitalHtml() {
      if (!this.data.treatmentHospitalName) {
        return '-';
      }
      let html = this.data.treatmentHospitalName;
      if (this.data.treatmentHospitalType === 'N') {
        html += `<br/>(${this.data.treatmentHospitalTel})`;
      }
      return html;
    },
  },
  watch: {
    data() {
      this.status();
    },
  },
  created() {
    this.status();
  },
  methods: {
    statusToMsg(status, rule) {
      switch (status) {
        case 'Y':
          return '보기';
        case 'E':
          return '등록';
        case 'N':
          return rule ? '임시저장' : '임시저장불가';
        case null:
          return rule ? '등록' : '등록불가';
      }
    },
    treatmentRequestStatusToMsg(status, rule) {
      switch (status) {
        case 'N':
          return rule ? '임시저장' : '-';
        case 'Y':
          return '보기';
        case null:
          return rule ? '등록' : '-';
      }
    },
    treatmentPlanStatusToMsg(status, rule) {
      switch (status) {
        case 'N':
          return rule ? '임시저장' : '-';
        case 'Y':
          return '대기중';
        case 'A':
          return '승인됨';
        case 'D':
          return '미승인됨';
        case null:
          return rule ? '등록' : '-';
      }
    },
    statementStatusToMsg(status, rule) {
      switch (status) {
        case 'N':
          return rule ? '임시저장' : '-';
        case 'Y':
          return '보기';
        case null:
          return !rule ? '-' : this.districtCodeFirst === 'A' && this.data.treatmentPlanStatus !== 'A' ? '등록불가' : '등록'; // 서울시 : 진료계획서 승인 후 등록 / 부산시 : 심화치료 필요시 등록
      }
    },
    billStatusToMsg(status) {
      switch (status) {
        case 'N':
          return '제출완료<br>(청구중)';
        case 'Y':
          return '처리완료';
        case 'R':
          this.billBtnType = 'btn';
          return '반려됨';
        case 'RN':
          return '제출완료<br>(재청구중)';
        case null:
          return '-';
      }
    },
    status() {
      this.iafMsg = this.data.infoAgreeFileUId ? '보기' : this.data.studentAppAgree ? (this.districtCodeFirst === 'A' && !this.endBusiness('treatment') ? 'APP 동의 버튼' : 'APP 동의') : '등록';
      this.iafTooltip = '';
      if (this.iafMsg === '등록' && this.endBusiness('treatment')) {
        this.iafMsg = '등록불가';
        this.iafTooltip = '동의서 등록이 마감되었습니다.';
      }
      this.queMsg = this.statusToMsg(this.data.questionnaireStatus, !(this.districtCodeFirst === 'A' && this.iafMsg === '등록'));
      this.queTooltip = this.queMsg.includes('불가') ? '개인정보활용동의서 등록 후 작성 가능합니다.' : '';
      if (this.queMsg === '등록' && this.endBusiness('treatment')) {
        this.queMsg = '등록불가';
        this.queTooltip = '문진표 등록이 마감되었습니다.';
      }
      this.notMsg = this.statusToMsg(this.data.notificationStatus, this.data.questionnaireStatus === 'Y' || this.districtCodeFirst === 'I');
      this.notTooltip = this.notMsg.includes('불가') ? '문진표 등록 후 작성 가능합니다.' : '';
      if (this.notMsg === '등록' && this.endBusiness('notification')) {
        this.notMsg = '등록불가';
        this.notTooltip = '통보서 신규 등록이 마감되었습니다.';
      }
      this.ttrMsg = this.treatmentRequestStatusToMsg(this.data.treatmentRequestStatus, this.data.treatStatus === 'Y' && this.hospitalType === 'H');
      if (this.ttrMsg === '등록' && this.endBusiness('notification')) {
        this.ttrMsg = '등록불가';
        this.ttrTooltip = '진료의뢰서 신규 등록이 마감되었습니다.';
      }
      this.ttpMsg = this.treatmentPlanStatusToMsg(
        this.data.treatmentPlanStatus,
        this.data.treatStatus === 'Y' && ((!this.data.treatmentHospitalId && this.hospitalType !== 'H') || this.data.treatmentHospitalId === this.userOrganTargetId),
      );
      if (this.ttpMsg === '등록' && this.endBusiness('notification')) {
        this.ttpMsg = '등록불가';
        this.ttpTooltip = '진료계획서 신규 등록이 마감되었습니다.';
      }
      this.stmMsg = this.statementStatusToMsg(
        this.data.statementStatus,
        this.data.treatStatus === 'Y' && ((!this.data.treatmentHospitalId && this.hospitalType !== 'H') || this.data.treatmentHospitalId === this.userOrganTargetId),
      );
      this.stmTooltip = this.stmMsg === '등록불가' ? '진료계획서 승인 후 작성 가능합니다.' : '';
      if (this.stmMsg === '등록' && this.endBusiness('notification')) {
        this.stmMsg = '등록불가';
        this.stmTooltip = '내역서 신규 등록이 마감되었습니다.';
      }
      this.billMsg = this.billStatusToMsg(this.data.billStatus);
      this.billTooltip = this.billMsg === '처리완료' ? '실제 지급일과 처리 일자는 다를 수 있습니다.' : '';
      // this.modMsg = this.data.studentBusinessModifyAuth === 'N' ? '수정불가' : '수정';
      this.modMsg = '수정';
      this.modTooltip = this.modMsg === '수정불가' ? '통보서가 최종제출된 학생은 정보수정이 불가능합니다.' : '';
      this.canMsg = !this.data.treatStatus ? '취소' : '취소불가';
      this.canTooltip = this.canMsg === '취소불가' ? '통보서가 최종제출된 학생은 등록취소가 불가능합니다.' : '';
    },
    studentBusinessNoteRegist() {
      this.$store.dispatch('popup/popupOpen', { contents: 'studentBusinessNoteRegist', params: Object.assign(this.data, { businessDivision: 'C' }) });
    },
    checkBusinessClose() {
      // 사업종료 체크
      const closeDistrict = {
        // 부산
        D0109: '금정구',
        D0105: '해운대구',
      };
      const healthCareName = closeDistrict[this.data.districtCode];
      if (healthCareName) {
        this.$fire({
          html: `${healthCareName} 사업이 조기 종료되어<br> ${healthCareName} 소속 학생의 검진이 불가합니다.<br><br> 사업 관련 문의는 ${healthCareName} 보건소로 연락 부탁드립니다.`,
          confirmButtonText: '확인',
          padding: '40px',
        });
        return false;
      } else {
        return true;
      }
    },
    agreement() {
      if (this.iafMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewAgreement', params: { studentId: this.data.studentId, studentName: this.data.studentName, businessDivision: 'C' } });
      } else {
        if (!this.checkBusinessClose()) return;
        this.$store.dispatch('popup/popupOpen', { contents: 'registAgreement', params: { studentId: this.data.studentId, businessDivision: 'C' } });
      }
    },
    questionnaire() {
      if (this.queMsg === '등록' || this.queMsg === '임시저장') {
        if (!this.checkBusinessClose()) return;
        this.$router.push({ path: '/hospital/que', query: { studentId: this.data.studentId, businessDivision: 'C' } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewQuestionnaire', params: { studentId: this.data.studentId, businessDivision: 'C' } });
      }
    },
    notification() {
      if (this.notMsg === '등록' || this.notMsg === '임시저장') {
        if (!this.checkBusinessClose()) return;
        if (this.endBusiness('bill')) {
          this.$alert('통보서 등록이 마감되었습니다.', '알림', 'warning');
          return false;
        }
        if (this.endBusiness('notification') && !this.data.billId) {
          this.$alert('통보서 신규 등록이 마감되었습니다.', '알림', 'warning');
          return false;
        }
        this.$router.push({ path: '/hospital/ntc', query: { studentId: this.data.studentId, businessDivision: 'C' } });
      } else if (this.notMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewNotification',
          params: { studentId: this.data.studentId, businessDivision: 'C', notificationYear: this.data.notificationYear },
        });
      }
    },
    treatmentRequest() {
      if (this.ttrMsg === '등록' || this.ttrMsg === '임시저장') {
        if (this.endBusiness('notification')) {
          this.$alert('진료의뢰서 신규 등록이 마감되었습니다.', '알림', 'warning');
          return false;
        }
        // this.$store.dispatch('popup/popupOpen', { contents: 'hptDesignation', params: Object.assign({}, this.data, { designationType: 'treatmentRequest' }) });
        this.$router.push({ path: '/hospital/treatmentRequest', query: { studentId: this.data.studentId, notificationId: this.data.notificationId } });
      } else {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewTreatmentRequest',
          params: { hospitalId: this.data.treatmentHospitalId, studentId: this.data.studentId, notificationId: this.data.notificationId },
        });
      }
    },
    treatmentPlan() {
      if (this.ttpMsg === '등록' || this.ttpMsg === '임시저장') {
        if (this.endBusiness('notification')) {
          this.$alert('진료계획서 신규 등록이 마감되었습니다.', '알림', 'warning');
          return false;
        }
        this.$router.push({ path: '/hospital/plan', query: { studentId: this.data.studentId, notificationId: this.data.notificationId } });
      } else {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewTreatmentPlan',
          params: { studentId: this.data.studentId, notificationId: this.data.notificationId },
        });
      }
    },
    statement() {
      if (this.stmMsg === '등록' || this.stmMsg === '임시저장') {
        if (this.endBusiness('bill')) {
          this.$alert('내역서 등록이 마감되었습니다.', '알림', 'warning');
          return false;
        }
        if (this.endBusiness('notification') && !this.data.billId) {
          this.$alert('내역서 신규 등록이 마감되었습니다.', '알림', 'warning');
          return false;
        }
        if (this.data.notificationStatus !== 'Y') {
          this.$alert('통보서를 먼저 최종 제출해 주세요.', '알림', 'warning');
          return false;
        }
        this.$router.push({ path: '/hospital/stm', query: { studentId: this.data.studentId, notificationId: this.data.notificationId } });
      } else {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewStatement',
          params: { studentId: this.data.studentId, notificationId: this.data.notificationId, statementYear: this.data.statementYear },
        });
      }
    },
    infoModify() {
      this.$store.dispatch('popup/popupOpen', { contents: 'childInfoModify', params: { studentId: this.data.studentId, businessDivision: 'C' } });
    },
    preventEduComplete() {
      this.$confirm('"구강보건교육"을 이수로 처리하시겠습니까?', '알림', 'question')
        .then(() => {
          const form = {
            studentId: this.data.studentId,
          };
          Management.eduRegist(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('처리되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
              });
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
    unregister() {
      if (this.canMsg === '취소') {
        this.$confirm(this.data.studentName + ' 학생의 등록을 취소하시겠습니까?', '알림', 'question')
          .then(() => {
            let form = {
              hospitalId: this.userOrganTargetId,
              studentBusinessId: this.data.studentBusinessId,
            };
            Hospital.studentRegistCancel(form).then(res => {
              if (res && res.data.rt === 200) {
                this.$alert('등록 취소되었습니다.', '알림', 'success').then(() => {
                  this.$store.commit('update');
                });
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            });
          })
          .catch(() => {});
      }
    },
    historyPopup() {
      this.$store.dispatch('popup/popupOpen', { contents: 'historyPopup', params: { studentId: this.data.studentId } });
    },
    adminBusiness() {
      this.$store.dispatch('popup/popupOpen', { contents: 'adminBusiness', params: Object.assign(this.data, { businessDivision: 'C' }) });
    },
    showBillRejectReason() {
      if (this.billBtnType === 'btn') {
        const form = {
          studentBusinessId: this.data.studentBusinessId,
        };
        Bill.billRejectReason(form).then(res => {
          if (res && res.data.rt === 200) {
            let title = '반려사유';
            if (res.data.healthCareName) {
              title += ` (${res.data.healthCareName}`;
              if (res.data.secondHealthCareName) {
                title += ` ${res.data.secondHealthCareName}`;
              }
              title += ')';
            }

            this.$alert('', title, 'info', { html: `${res.data.billRejectReasonInfo.billRejectReason.replace(/(\n)/g, '<br>')}` });
          } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        });
      }
    },
  },
};
</script>
