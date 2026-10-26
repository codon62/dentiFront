<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td v-if="divJoin('S')">
      <p class="scommp">{{ divName(data.businessDivision, true) }}</p>
    </td>
    <td>
      <p class="scommp">{{ `${data.studentToSchoolGrade1}학년 ${data.studentToSchoolGrade2}반 ${data.studentToSchoolGrade3}번` }}</p>
    </td>
    <td><p class="scommp" v-html="data.studentName + (data.studentBirth ? `<br>(${data.studentBirth})` : '')"></p></td>
    <td>
      <p class="scommp">{{ data.studentGender ? studentGender[data.studentGender] : '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalName ? data.hospitalName : '-' }}</p>
    </td>
    <td>
      <p class="scommp" v-html="data.userId ? '가입' + (data.userSnsType ? '<br>(' + userSnsType.value[data.userSnsType] + ')' : '') : '미가입'"></p>
    </td>
    <td>
      <v-button :message="data.userId ? '초기화' : '-'" @vclick="appRollback"></v-button>
    </td>
    <td v-if="['A', 'C'].includes(districtCodeFirst)">
      <p v-if="data.completeEduDate" class="scommp">이수</p>
      <v-button v-else message="미이수" @vclick="preventEduComplete"></v-button>
    </td>
    <td v-if="!(districtCodeFirst === 'J' && adminOrganType !== 'AD')">
      <v-button :message="iafMsg" :tooltip="iafTooltip" @vclick="agreement"></v-button>
    </td>
    <td>
      <v-button :message="queMsg" :tooltip="queTooltip" @vclick="questionnaire"></v-button>
    </td>
    <td>
      <v-button :message="notMsg" @vclick="notification"></v-button>
    </td>
    <template v-if="districtCodeFirst === 'C'">
      <td><v-button :message="studentSurveyMsg" @vclick="studentSurvey"></v-button></td>
      <td><v-button :message="queSurveyMsg" @vclick="questionnaireSurvey"></v-button></td>
    </template>
    <td>
      <p class="scommp">{{ data.treatDate ? data.treatDate : '-' }}</p>
    </td>
    <td>
      <p class="scommp" v-tooltip="screenTooltip">{{ districtCodeFirst === 'I' ? screenMsg.replaceAll('수검', '진료') : screenMsg }}</p>
    </td>
    <td>
      <v-button :message="screenMsg === '수검' ? '-' : data.notificationScreenReason ? '사유 조회' : '사유 등록'" @vclick="notScreenRegist"></v-button>
    </td>
    <td v-if="districtCodeFirst === 'C'">
      <v-button message="보기" @vclick="studentLogPopup"></v-button>
    </td>
    <td>
      <v-button :message="modMsg" :tooltip="modTooltip" @vclick="infoModify"></v-button>
    </td>
    <td>
      <v-button :message="transferMsg" :tooltip="transferTooltip" @vclick="deleteConfirm(true)"></v-button>
    </td>
    <td>
      <v-button :message="delMsg" :tooltip="delTooltip" @vclick="deleteConfirm(false)"></v-button>
    </td>
    <td v-if="districtCodeFirst === 'J'">
      <button class="checkIcon" :class="data.checkStatus === 'Y' ? 'on' : ''" @click="studentCheckToggle"></button>
    </td>
    <!--<td v-if="isDev">
      <v-button message="초기화" @vclick="adminBusiness"></v-button>
    </td>-->
  </tr>
</template>

<script>
import School from '@/apis/School';
import Management from '@/apis/Management';
import Business from '@/apis/Business';
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
      queSurveyMsg: '',
      studentSurveyMsg: '',
      notMsg: '',
      screenMsg: '',
      screenTooltip: '',
      modMsg: '',
      modTooltip: '',
      transferMsg: '',
      transferTooltip: '',
      delMsg: '',
      delTooltip: '',
    };
  },
  computed: {
    ...mapState('status', ['studentGender', 'screenStatus', 'div', 'userSnsType', 'districtCodeFirstToName']),
    ...mapState('user', ['userOrganTargetId', 'adminOrganType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName', 'endBusiness', 'questionnaireTitle']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
    districtCodeFirstName() {
      return this.districtCodeFirstToName[this.districtCodeFirst].replaceAll('교육청', '');
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
        case 'N':
          return rule ? '임시저장' : '임시저장불가';
        case null:
          return rule ? '등록' : '등록불가';
      }
    },
    status() {
      this.iafMsg = this.data.infoAgreeFileUId ? '보기' : this.data.studentAppAgree ? 'APP 동의' : '등록';
      this.iafTooltip = '';
      if (this.iafMsg === '등록' && this.endBusiness('treatment')) {
        this.iafMsg = '등록불가';
        this.iafTooltip = '동의서 등록이 마감되었습니다.';
      }
      this.queMsg = this.statusToMsg(this.data.questionnaireStatus, !(['F'].includes(this.districtCodeFirst) && this.iafMsg === '등록'));
      this.queTooltip = this.queMsg.includes('불가') ? '개인정보활용동의서 등록 후 작성 가능합니다.' : '';
      if (this.queMsg === '등록' && this.endBusiness('treatment')) {
        this.queMsg = '등록불가';
        this.queTooltip = `${this.questionnaireTitle} 등록이 마감되었습니다.`;
      }
      this.notMsg = this.data.notificationStatus === 'Y' ? '보기' : this.districtCodeFirst === 'I' && this.data.notificationStatus === 'N' ? '진료중' : '-';
      this.studentSurveyMsg = this.data.studentSurveyStatus === 'Y' || this.data.screenStatus === 'Y' ? this.statusToMsg(this.data.studentSurveyStatus, true) : '-';
      this.queSurveyMsg = this.data.questionnaireSurveyStatus === 'Y' || this.data.screenStatus === 'Y' ? this.statusToMsg(this.data.questionnaireSurveyStatus, true) : '-';
      this.screenMsg = this.data.screenStatus ? this.screenStatus.value[this.data.screenStatus] : '-';
      this.screenTooltip = this.screenMsg === '미수검' ? `의료기관에서 통보서 제출 시 ${this.districtCodeFirst === 'I' ? '진료' : '수검'} 상태로 변경됩니다.` : '';
      // this.modMsg = this.data.studentBusinessModifyAuth === 'N' ? '수정불가' : '수정';
      this.modMsg = '수정';
      this.modTooltip = this.modMsg === '수정불가' ? '통보서가 최종제출된 학생은 정보수정이 불가능합니다.' : '';
      this.transferMsg = this.data.userId || this.data.hospitalCount ? '전출불가' : '전출';
      this.transferTooltip = this.transferMsg === '전출불가' ? 'APP 가입 또는 지정된 병원이 있는 학생은 전출 처리할 수 없습니다.' : '';
      if (this.transferMsg === '전출' && this.endBusiness('treatment')) {
        this.transferMsg = '전출불가';
        this.transferTooltip = '학생 전출이 마감되었습니다.';
      }
      this.delMsg = this.data.userId || this.data.hospitalCount ? '취소불가' : '취소';
      this.delTooltip = this.delMsg === '취소불가' ? 'APP 가입 또는 지정된 병원이 있는 학생은 삭제할 수 없습니다.' : '';
      if (this.delMsg === '취소' && this.endBusiness('treatment')) {
        this.delMsg = '취소불가';
        this.delTooltip = '학생 삭제가 마감되었습니다.';
      }
    },
    agreement() {
      if (this.iafMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewAgreement',
          params: { studentId: this.data.studentId, studentName: this.data.studentName, businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F' },
        });
      } else {
        this.$store.dispatch('popup/popupOpen', {
          contents: this.districtCodeFirst === 'F' ? 'checkAgreement' : 'registAgreement',
          params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F' },
        });
      }
    },
    questionnaire() {
      if (this.queMsg === '등록' || this.queMsg === '임시저장') {
        this.$router.push({ path: '/school/que', query: { studentId: this.data.studentId, businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F' } });
      } else {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewQuestionnaire',
          params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F' },
        });
      }
    },
    questionnaireSurvey() {
      if (this.queSurveyMsg === '등록' || this.queSurveyMsg === '임시저장') {
        this.$router.push({ path: '/school/que-survey', query: { studentId: this.data.studentId, businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F' } });
      } else {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewQuestionnaire',
          params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F', isQuestionnaireSurvey: true },
        });
      }
    },
    studentSurvey() {
      if (this.studentSurveyMsg === '등록' || this.studentSurveyMsg === '임시저장') {
        this.$router.push({ path: '/school/student-survey', query: { studentId: this.data.studentId, businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F' } });
      } else {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewStudentSurvey',
          params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F' },
        });
      }
    },
    notification() {
      if (this.notMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewNotification',
          params: {
            studentId: this.data.studentId,
            businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F',
            notificationYear: this.data.notificationYear,
          },
        });
      }
    },
    notScreenRegist() {
      if (this.screenMsg === '미수검') {
        this.$store.dispatch('popup/popupOpen', { contents: 'notScreenRegist', params: Object.assign(this.data, { businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F' }) });
      }
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
    infoModify() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'hospitalStudentInfoModify',
        params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F', notificationId: this.data.notificationId },
      });
    },
    deleteConfirm(isTransfer) {
      this.$fire({
        html: isTransfer ? `${this.districtCodeFirstName} 내 학교로 전학 간 학생입니까?` : `잘못 등록된 학생이거나<br/>${this.districtCodeFirstName} 외 지역으로 전학을 간 학생인가요?`,
        allowEnterKey: false,
        confirmButtonText: '예',
        showCancelButton: true,
        cancelButtonText: '아니오',
        confirmButtonColor: '#0868f1',
        cancelButtonColor: '#d94f4f',
        padding: '40px',
      }).then(r => {
        if (r.value) {
          isTransfer ? this.transferOut() : this.deleteStudent();
        } else if (r.dismiss === 'cancel') {
          this.$fire({
            html: isTransfer
              ? `학생이 ${this.districtCodeFirstName} 내 학교로 전학 가지 않는 경우에는<br/><b>[삭제]</b> 버튼을 클릭해 주세요.`
              : `학생이 ${this.districtCodeFirstName} 내 학교로 전학 가는 경우에는 <b>[전출]</b>,<br/>정보 수정이 필요한 경우에는 <b>[정보 수정]</b>을 클릭해 주세요.`,
            confirmButtonText: '확인',
            padding: '40px',
          });
        }
      });
    },
    transferOut() {
      this.$confirm(`${this.data.studentName} 학생을 전출 처리하시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            studentId: this.data.studentId,
          };
          School.transferOut(form).then(res => {
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
    deleteStudent() {
      Management.beforeDeleteInfo({ studentId: this.data.studentId }).then(res => {
        if (res && res.data.rt === 200) {
          let msg = `${this.data.studentName} 학생을 삭제하시겠습니까?`;

          if (res.data.businessDivisionList.length > 1) {
            const businessDivisionList = res.data.businessDivisionList.map(item => this.divName(this.codeToValue(item)));
            msg += `<br/><span style="color: red">※ 주의 : 학생이 참여하고 있는 모든 사업에서 삭제됩니다.<br/>참여중인 사업 : ${businessDivisionList.join(', ')}</span>`;
          }

          this.$confirm('', '알림', 'question', { html: msg })
            .then(() => {
              const form = {
                userType: this.valueToCode('C0006', 'ST'),
                userId: this.data.studentId,
              };
              Management.delete(form).then(res2 => {
                if (res2 && res2.data.rt === 200) {
                  this.$alert('삭제되었습니다.', '알림', 'success').then(() => {
                    this.$store.commit('update');
                  });
                } else {
                  alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res2.data.rt);
                }
              });
            })
            .catch(() => {});
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
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
    adminBusiness() {
      this.$store.dispatch('popup/popupOpen', { contents: 'adminBusiness', params: Object.assign(this.data, { businessDivision: this.data.businessDivision ? this.data.businessDivision : 'F' }) });
    },
    appRollback() {
      this.$confirm(`${this.data.studentName} 학생의 APP 가입을 초기화하시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            studentId: this.data.studentId,
            userId: this.data.userId,
          };
          Management.studentAppRollback(form).then(res => {
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
  },
};
</script>
