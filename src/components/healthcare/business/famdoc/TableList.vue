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
        ({{ studentGender[data.studentGender] }})
      </p>
    </td>
    <td v-if="districtCodeFirst === 'C'">
      <p class="scommp" :class="{ c_red: data.studentRegistUserOrganTargetType === 'HC', c_blue: data.studentRegistUserOrganTargetType === 'SC' }">
        {{ data.studentRegistAdminOrganTargetName }}
      </p>
    </td>
    <td>
      <p class="scommp">{{ data.studentBirth }}</p>
    </td>
    <td v-if="districtCodeFirst === 'C'">
      <p class="scommp">{{ data.schoolType ? schoolType.value[data.schoolType] : '-' }}</p>
    </td>
    <td><p class="scommp" v-html="data.studentToSchoolGrade1 ? `${data.schoolName}<br>(${data.studentToSchoolGrade1}/${data.studentToSchoolGrade2}/${data.studentToSchoolGrade3})` : '학교밖'"></p></td>
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
    <template v-if="districtCodeFirst === 'C'">
      <td><v-button :message="studentSurveyMsg" @vclick="studentSurvey"></v-button></td>
      <td><v-button :message="queSurveyMsg" @vclick="questionnaireSurvey"></v-button></td>
    </template>
    <td v-if="districtCodeFirst === 'A'">
      <p class="scommp">{{ data.n_date }}</p>
    </td>
    <td><v-button :message="billMsg" :tooltip="billTooltip" :optional-btn-type="billBtnType" @vclick="showBillRejectReason"></v-button></td>
    <td><v-button :message="canMsg" :tooltip="canTooltip" @vclick="unregister"></v-button></td>
    <td><v-button message="보기" @vclick="studentLogPopup"></v-button></td>
    <td><button class="checkIcon" :class="data.checkStatus === 'Y' ? 'on' : ''" @click="studentCheckToggle"></button></td>
    <td v-if="isAdmin"><v-button message="보기" @vclick="adminBusiness"></v-button></td>
  </tr>
</template>

<script>
import Management from '@/apis/Management';
import Business from '@/apis/Business';
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
      queSurveyMsg: '',
      studentSurveyMsg: '',
      notMsg: '',
      billMsg: '',
      billTooltip: '',
      billBtnType: '',
      canMsg: '',
      canTooltip: '',
      isAdmin: false,
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'adminOrganType']),
    ...mapState('status', ['studentGender', 'schoolType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['endBusiness', 'questionnaireTitle']),
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
      this.iafMsg = this.data.infoAgreeFileUId ? '보기' : this.data.studentAppAgree ? 'APP 동의' : '등록';
      this.iafTooltip = '';
      if (this.adminOrganType !== 'AD' && this.iafMsg === '등록' && this.endBusiness('treatment')) {
        this.iafMsg = '등록불가';
        this.iafTooltip = '동의서 등록이 마감되었습니다.';
      }
      this.queMsg = this.statusToMsg(this.data.questionnaireStatus, !(['F'].includes(this.districtCodeFirst) && this.iafMsg === '등록'));
      this.queTooltip = this.queMsg.includes('불가') ? '개인정보활용동의서 등록 후 작성 가능합니다.' : '';
      if (this.adminOrganType !== 'AD' && this.queMsg === '등록' && this.endBusiness('treatment')) {
        this.queMsg = '등록불가';
        this.queTooltip = `${this.questionnaireTitle} 등록이 마감되었습니다.`;
      }
      this.notMsg = this.docStatusToMsg(this.data.notificationStatus);
      this.studentSurveyMsg = this.data.studentSurveyStatus === 'Y' || this.data.billId ? this.statusToMsg(this.data.studentSurveyStatus, true) : '-';
      this.queSurveyMsg = this.data.questionnaireSurveyStatus === 'Y' || this.data.billId ? this.statusToMsg(this.data.questionnaireSurveyStatus, true) : '-';
      this.billMsg = this.data.notificationStatus === 'E' ? '-' : this.billStatusToMsg(this.data.billStatus);
      this.billTooltip = this.billMsg === '처리완료' ? '실제 지급일과 처리 일자는 다를 수 있습니다.' : '';
      this.canMsg = this.data.notificationStatus !== 'E' && this.data.treatStatus ? '취소불가' : '취소';
      this.canTooltip = this.canMsg === '취소불가' ? '통보서가 최종제출된 학생은 등록취소가 불가능합니다.' : '';
    },
    agreement() {
      if (this.iafMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewAgreement', params: { studentId: this.data.studentId, studentName: this.data.studentName, businessDivision: 'F' } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: this.districtCodeFirst === 'F' ? 'checkAgreement' : 'registAgreement', params: { studentId: this.data.studentId, businessDivision: 'F' } });
      }
    },
    questionnaire() {
      if (this.queMsg === '등록' || this.queMsg === '임시저장') {
        this.$router.push({ path: '/healthcare/que', query: { studentId: this.data.studentId, businessDivision: 'F' } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewQuestionnaire', params: { studentId: this.data.studentId, businessDivision: 'F' } });
      }
    },
    questionnaireSurvey() {
      if (this.queSurveyMsg === '등록' || this.queSurveyMsg === '임시저장') {
        this.$router.push({ path: '/healthcare/que-survey', query: { studentId: this.data.studentId, businessDivision: 'F' } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewQuestionnaire', params: { studentId: this.data.studentId, businessDivision: 'F', isQuestionnaireSurvey: true } });
      }
    },
    studentSurvey() {
      if (this.studentSurveyMsg === '등록' || this.studentSurveyMsg === '임시저장') {
        this.$router.push({ path: '/healthcare/student-survey', query: { studentId: this.data.studentId, businessDivision: 'F' } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewStudentSurvey', params: { studentId: this.data.studentId, businessDivision: 'F' } });
      }
    },
    notification() {
      if (this.notMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewNotification',
          params: { studentId: this.data.studentId, businessDivision: 'F', notificationYear: this.data.notificationYear },
        });
      }
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
