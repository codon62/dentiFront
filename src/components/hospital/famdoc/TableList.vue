<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td v-if="districtCodeFirst === 'J'">
      <p class="scommp">{{ data.districtSiName }}</p>
    </td>
    <td>
      <p class="scommp">{{ districtCodeFirst === 'C' ? data.districtSiName : data.healthCareName }}</p>
    </td>
    <td v-if="divJoin('S')">
      <p class="scommp">{{ div.value[data.businessDivision] }}</p>
    </td>
    <td>
      <p class="scommp" v-html="data.studentToSchoolGrade1 ? `${data.schoolName}<br>(${data.studentToSchoolGrade1}/${data.studentToSchoolGrade2}/${data.studentToSchoolGrade3})` : '학교밖'"></p>
    </td>
    <td>
      <p class="scommp">
        {{ data.studentName }}
        <br />
        ({{ data.studentBirth }})
      </p>
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
      <v-button :message="notMsg" :tooltip="notTooltip" @vclick="notification"></v-button>
    </td>
    <td>
      <v-button :message="billMsg" :tooltip="billTooltip" :optional-btn-type="billBtnType" @vclick="showBillRejectReason"></v-button>
    </td>
    <td>
      <v-button :message="modMsg" :tooltip="modTooltip" @vclick="infoModify"></v-button>
    </td>
    <td>
      <v-button :message="canMsg" :tooltip="canTooltip" @vclick="unregister"></v-button>
    </td>
    <!--<td v-if="isDev">
      <v-button message="초기화" @vclick="adminBusiness"></v-button>
    </td>-->
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
    ...mapState('user', ['userOrganTargetId', 'adminOrganType']),
    ...mapState('status', ['div']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'endBusiness', 'questionnaireTitle']),
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
      this.notMsg = this.statusToMsg(this.data.notificationStatus, this.data.questionnaireStatus === 'Y' || ['A', 'I', 'J'].includes(this.districtCodeFirst));
      // 21.07.27 경기도의 경우 동의서 등록되어야 통보서 최종제출 가능
      this.notTooltip = this.notMsg.includes('불가')
        ? `${this.questionnaireTitle} 등록 후 작성 가능합니다.`
        : this.districtCodeFirst === 'C' && !this.data.infoAgreeFileUId && !this.data.studentAppAgree
        ? '동의서가 등록되어야 통보서 최종제출이 가능합니다.'
        : '';
      if (this.notMsg === '등록' && this.endBusiness('notification')) {
        this.notMsg = '등록불가';
        this.notTooltip = '통보서 신규 등록이 마감되었습니다.';
      }
      this.billMsg = this.billStatusToMsg(this.data.billStatus);
      this.billTooltip = this.billMsg === '처리완료' ? '실제 지급일과 처리 일자는 다를 수 있습니다.' : '';
      // 21.07.29 경기도의 경우 비용청구서 반려시 학생 정보 수정 가능
      // this.modMsg = this.data.studentBusinessModifyAuth === 'N' && !(this.districtCodeFirst === 'C' && this.data.billStatus === 'R') ? '수정불가' : '수정';
      this.modMsg = '수정';
      this.modTooltip = this.modMsg === '수정불가' ? (this.districtCodeFirst === 'C' ? '통보서가 청구된 학생은 정보수정이 불가능합니다.' : '통보서가 최종제출된 학생은 정보수정이 불가능합니다.') : '';
      this.canMsg = this.data.studentBusinessModifyAuth === 'N' ? '취소불가' : '취소';
      this.canTooltip = this.canMsg === '취소불가' ? '통보서가 최종제출된 학생은 등록취소가 불가능합니다.' : '';
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
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewAgreement',
          params: { studentId: this.data.studentId, studentName: this.data.studentName, businessDivision: this.data.businessDivision },
        });
      } else {
        if (!this.checkBusinessClose()) return;
        this.$store.dispatch('popup/popupOpen', {
          contents: this.districtCodeFirst === 'F' ? 'checkAgreement' : 'registAgreement',
          params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision },
        });
      }
    },
    questionnaire() {
      if (this.queMsg === '등록' || this.queMsg === '임시저장') {
        if (!this.checkBusinessClose()) return;
        this.$router.push({ path: '/hospital/que', query: { studentId: this.data.studentId, businessDivision: this.data.businessDivision } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewQuestionnaire', params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision } });
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
        this.$router.push({ path: '/hospital/ntc', query: { studentId: this.data.studentId, businessDivision: this.data.businessDivision } });
      } else if (this.notMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewNotification',
          params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision, notificationYear: this.data.notificationYear },
        });
      }
    },
    infoModify() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'hospitalStudentInfoModify',
        params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision, billStatus: this.data.billStatus },
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
    unregister() {
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
    },
    adminBusiness() {
      this.$store.dispatch('popup/popupOpen', { contents: 'adminBusiness', params: Object.assign(this.data, { businessDivision: this.data.businessDivision }) });
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
