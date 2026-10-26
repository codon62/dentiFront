<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td v-if="userOrganTargetType === 'CT'">
      <p class="scommp">{{ districtCodeFirst === 'C' ? data.districtSiName : data.districtGunguName }}</p>
    </td>
    <td>
      <p class="scommp">
        {{ data.studentName }}
        <br />
        ({{ data.studentBirth }})
      </p>
    </td>
    <td>
      <p class="scommp">{{ data.centerName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalName }}</p>
    </td>
    <td v-if="['A', 'C'].includes(districtCodeFirst)">
      <p v-if="data.completeEduDate" class="scommp">이수</p>
      <v-button v-else message="미이수" @vclick="preventEduComplete"></v-button>
    </td>
    <td><v-button :message="iafMsg" :tooltip="iafTooltip" @vclick="agreement"></v-button></td>
    <td><v-button :message="queMsg" :tooltip="queTooltip" @vclick="questionnaire"></v-button></td>
    <td><v-button :message="notMsg" @vclick="notification"></v-button></td>
    <td>
      <p class="scommp">{{ this.data.notificationStatus !== 'E' && (data.treatStatus === 'Y' || data.billStatus) ? treatStatus.value[data.treatStatus] : '-' }}</p>
    </td>
    <td v-if="districtCodeFirst === 'A'">
      <p class="scommp" v-html="treatmentHospitalHtml"></p>
    </td>
    <td v-if="districtCodeFirst === 'A'"><v-button :message="ttrMsg" @vclick="treatmentRequest"></v-button></td>
    <td v-if="districtCodeFirst === 'A'"><v-button :message="ttpMsg" @vclick="treatmentPlan"></v-button></td>
    <td><v-button :message="stmMsg" @vclick="statement"></v-button></td>
    <td><v-button :message="billMsg" :tooltip="billTooltip" :optional-btn-type="billBtnType" @vclick="showBillRejectReason"></v-button></td>
    <td v-if="districtCodeFirst === 'A'"><v-button :message="intensiveRequestMsg" @vclick="intensiveRequest"></v-button></td>
    <td v-if="districtCodeFirst === 'A'"><v-button :message="addTreatCountMsg" @vclick="hptDesignation"></v-button></td>
    <td><v-button :message="canMsg" :tooltip="canTooltip" @vclick="unregister"></v-button></td>
    <td><v-button message="보기" @vclick="historyPopup"></v-button></td>
    <td><v-button message="보기" @vclick="studentLogPopup"></v-button></td>
    <td v-if="districtCodeFirst === 'A'">
      <v-button v-if="data.studentBusinessNote" message="메모 조회" @vclick="studentBusinessNoteRegist"></v-button>
      <template v-else>-</template>
    </td>
    <td><button class="checkIcon" :class="data.checkStatus === 'Y' ? 'on' : ''" @click="studentCheckToggle"></button></td>
    <td v-if="districtCodeFirst !== 'A'"><v-button :message="data.infoAgreeFileUId ? '초기화' : '-'" @vclick="agreementReset"></v-button></td>
    <td v-if="isAdmin"><v-button message="보기" @vclick="adminBusiness"></v-button></td>
  </tr>
</template>

<script>
import Management from '@/apis/Management';
import Business from '@/apis/Business';
import Bill from '@/apis/Bill';
import Button from '@/components/common/Button.vue';
import { mapGetters, mapState } from 'vuex';

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
      ttrMsg: '',
      ttpMsg: '',
      stmMsg: '',
      billMsg: '',
      billTooltip: '',
      billBtnType: '',
      intensiveRequestMsg: '',
      addTreatCountMsg: '',
      canMsg: '',
      canTooltip: '',
      isAdmin: false,
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'adminOrganType']),
    ...mapState('status', ['treatStatus']),
    ...mapGetters('business', ['endBusiness']),
    ...mapGetters('user', ['districtCodeFirst']),
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
    if (this.adminOrganType === 'AD') {
      this.isAdmin = true;
    }
    this.status();
  },
  methods: {
    statusToMsg(status, rule) {
      switch (status) {
        case 'Y':
          return '보기';
        case 'N':
          return rule ? '임시저장' : '임시저장불가';
        case null:
          return rule ? '등록' : '등록불가';
      }
    },
    docStatusToMsg(status) {
      switch (status) {
        case 'Y':
          return '보기';
        case 'N':
          return this.adminOrganType === 'AD' ? '(임시저장)' : '-';
        case null:
          return '-';
      }
    },
    treatmentPlanStatusToMsg(status) {
      switch (status) {
        case 'Y':
          return '대기중';
        case 'A':
          return '승인됨';
        case 'D':
          return '미승인됨';
        case 'N':
          return this.adminOrganType === 'AD' ? '(임시저장)' : '-';
        case null:
          return '-';
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
    intensiveRequestStatusToMsg(status) {
      switch (status) {
        case 'N':
          return this.userOrganTargetType === 'HC' ? '임시저장' : this.adminOrganType === 'AD' ? '(임시저장)' : '-';
        case 'Y':
          return '대기중';
        case 'A':
          return '승인됨';
        case 'D':
          return '미승인됨';
        case null:
          return this.userOrganTargetType === 'HC' ? '신청' : '-';
      }
    },
    status() {
      this.iafMsg = this.data.infoAgreeFileUId
        ? '보기'
        : this.data.studentAppAgree
        ? this.districtCodeFirst === 'A' && (this.adminOrganType === 'AD' || !this.endBusiness('treatment'))
          ? 'APP 동의 버튼'
          : 'APP 동의'
        : '등록';
      this.iafTooltip = '';
      if (this.adminOrganType !== 'AD' && this.iafMsg === '등록' && this.endBusiness('treatment')) {
        this.iafMsg = '등록불가';
        this.iafTooltip = '동의서 등록이 마감되었습니다.';
      }
      this.queMsg = this.statusToMsg(this.data.questionnaireStatus, !(this.districtCodeFirst === 'A' && this.iafMsg === '등록'));
      this.queTooltip = this.queMsg.includes('불가') ? '개인정보활용동의서 등록 후 작성 가능합니다.' : '';
      if (this.adminOrganType !== 'AD' && this.queMsg === '등록' && this.endBusiness('treatment')) {
        this.queMsg = '등록불가';
        this.queTooltip = '문진표 등록이 마감되었습니다.';
      }
      this.notMsg = this.docStatusToMsg(this.data.notificationStatus);
      this.ttrMsg = this.data.notificationStatus === 'E' ? '-' : this.docStatusToMsg(this.data.treatmentRequestStatus);
      this.ttpMsg = this.data.notificationStatus === 'E' ? '-' : this.treatmentPlanStatusToMsg(this.data.treatmentPlanStatus);
      this.stmMsg = this.data.notificationStatus === 'E' ? '-' : this.docStatusToMsg(this.data.statementStatus);
      this.billMsg = this.data.notificationStatus === 'E' ? '-' : this.billStatusToMsg(this.data.billStatus);
      this.billTooltip = this.billMsg === '처리완료' ? '실제 지급일과 처리 일자는 다를 수 있습니다.' : '';
      this.intensiveRequestMsg = this.intensiveRequestStatusToMsg(this.data.intensiveRequestStatus);
      this.addTreatCountMsg = this.data.notificationStatus === 'E' || !this.data.billStatus ? '-' : '지정';
      this.canMsg = this.data.notificationStatus !== 'E' && this.data.treatStatus ? '취소불가' : '취소';
      this.canTooltip = this.canMsg === '취소불가' ? '통보서가 최종제출된 학생은 등록취소가 불가능합니다.' : '';
    },
    studentBusinessNoteRegist() {
      this.$store.dispatch('popup/popupOpen', { contents: 'studentBusinessNoteRegist', params: Object.assign(this.data, { businessDivision: 'C' }) });
    },
    agreement() {
      if (this.iafMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewAgreement',
          params: { studentId: this.data.studentId, studentName: this.data.studentName, studentBusinessId: this.data.studentBusinessId, businessDivision: 'C' },
        });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'registAgreement', params: { studentId: this.data.studentId, businessDivision: 'C' } });
      }
    },
    agreementReset() {
      this.$confirm(`${this.data.studentName} 아동의 개인정보활용동의 내역을 초기화하시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            studentBusinessId: this.data.studentBusinessId,
          };
          Business.infoAgreeFileDelete(form).then(res => {
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
    questionnaire() {
      if (this.queMsg === '등록' || this.queMsg === '임시저장') {
        this.$router.push({ path: '/healthcare/que', query: { studentId: this.data.studentId, businessDivision: 'C' } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewQuestionnaire', params: { studentId: this.data.studentId, businessDivision: 'C' } });
      }
    },
    notification() {
      if (this.notMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewNotification',
          params: { studentId: this.data.studentId, businessDivision: 'C', notificationYear: this.data.notificationYear },
        });
      }
    },
    treatmentRequest() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewTreatmentRequest',
        params: { hospitalId: this.data.treatmentHospitalId, studentId: this.data.studentId, notificationId: this.data.notificationId },
      });
    },
    treatmentPlan() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewTreatmentPlan',
        params: { hospitalId: this.data.treatmentHospitalId || this.data.hospitalId, studentId: this.data.studentId, notificationId: this.data.notificationId },
      });
    },
    statement() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewStatement',
        params: { studentId: this.data.studentId, notificationId: this.data.notificationId, statementYear: this.data.statementYear },
      });
    },
    intensiveRequest() {
      if (this.intensiveRequestMsg === '신청' || this.intensiveRequestMsg === '임시저장') {
        this.$router.push({ path: '/healthcare/intensiveRequest', query: { studentId: this.data.studentId } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewIntensiveRequest', params: { studentId: this.data.studentId } });
      }
    },
    hptDesignation() {
      if (this.endBusiness('treatment')) {
        this.$alert('검진이 마감되었습니다.', '알림', 'warning');
        return false;
      }
      this.$store.dispatch('popup/popupOpen', { contents: 'hptDesignation', params: this.data });
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
      this.$confirm(this.data.studentName + ' 학생의 병원 지정을 취소하시겠습니까?', '알림', 'question')
        .then(() => {
          const form = {
            hospitalId: this.data.hospitalId,
            studentBusinessId: this.data.studentBusinessId,
          };
          Business.studentToHospitalCancel(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('지정 취소되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
              });
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
    historyPopup() {
      this.$store.dispatch('popup/popupOpen', { contents: 'historyPopup', params: { studentId: this.data.studentId } });
    },
    studentLogPopup() {
      this.$store.dispatch('popup/popupOpen', { contents: 'studentLogPopup', params: this.data });
    },
    studentCheckToggle() {
      const form = {
        studentBusinessId: this.data.studentBusinessId,
      };
      Business.studentCheckToggle(form).then(res => {
        if (res && res.data.rt === 200) {
          this.data.checkStatus = this.data.checkStatus !== 'Y' ? 'Y' : 'N';
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    adminBusiness() {
      this.$store.dispatch('popup/popupOpen', { contents: 'adminBusiness', params: this.data });
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
