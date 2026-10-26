<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td><p class="scommp" v-html="data.studentToSchoolGrade1 ? `${data.schoolName}<br>(${data.studentToSchoolGrade1}/${data.studentToSchoolGrade2}/${data.studentToSchoolGrade3})` : '학교밖'"></p></td>
    <td>
      <p class="scommp">
        {{ data.studentName }}
        <br />
        ({{ data.studentBirth }})
      </p>
    </td>
    <td><v-button :message="iafMsg" :tooltip="iafTooltip" @vclick="agreement"></v-button></td>
    <td><v-button :message="queMsg" :tooltip="queTooltip" @vclick="questionnaire"></v-button></td>
    <td><v-button :message="notMsg" :tooltip="notTooltip" @vclick="notification"></v-button></td>
    <td><v-button :message="billMsg" :tooltip="billTooltip" :optional-btn-type="billBtnType" @vclick="showBillRejectReason"></v-button></td>
    <td><v-button :message="modMsg" :tooltip="modTooltip" @vclick="infoModify"></v-button></td>
    <td><v-button :message="canMsg" :tooltip="canTooltip" @vclick="unregister"></v-button></td>
    <!--        <td v-if="isDev"><v-button message="초기화" @vclick="adminBusiness"></v-button></td>-->
  </tr>
</template>

<script>
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
    ...mapState('user', ['userOrganTargetId']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName', 'endBusiness']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
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
      this.iafTooltip = this.districtCodeFirst === 'A' && this.iafMsg === '등록' ? '학생구강검진의 개인정보동의서 등록은 필수 사항이 아닙니다.' : '';
      if (this.iafMsg === '등록' && this.endBusiness('treatment')) {
        this.iafMsg = '등록불가';
        this.iafTooltip = '동의서 등록이 마감되었습니다.';
      }
      this.queMsg = this.statusToMsg(this.data.questionnaireStatus, true);
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
      this.billMsg = this.billStatusToMsg(this.data.billStatus);
      this.billTooltip = this.billMsg === '처리완료' ? '실제 지급일과 처리 일자는 다를 수 있습니다.' : '';
      // this.modMsg = this.data.studentBusinessModifyAuth === 'N' ? '수정불가' : '수정';
      this.modMsg = '수정';
      this.modTooltip = this.modMsg === '수정불가' ? '통보서가 최종제출된 학생은 정보수정이 불가능합니다.' : '';
      this.canMsg = this.data.studentBusinessModifyAuth === 'N' ? '취소불가' : '취소';
      this.canTooltip = this.canMsg === '취소불가' ? `통보서가 최종제출된 학생은 ${this.districtCodeFirst === 'G' ? '삭제' : '등록취소'}가 불가능합니다.` : '';
    },
    agreement() {
      if (this.iafMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewAgreement', params: { studentId: this.data.studentId, studentName: this.data.studentName, businessDivision: 'E' } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'registAgreement', params: { studentId: this.data.studentId, businessDivision: 'E' } });
      }
    },
    questionnaire() {
      if (this.queMsg === '등록' || this.queMsg === '임시저장') {
        this.$router.push({ path: '/hospital/que', query: { studentId: this.data.studentId, businessDivision: 'E' } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewQuestionnaire', params: { studentId: this.data.studentId, businessDivision: 'E' } });
      }
    },
    notification() {
      if (this.notMsg === '등록' || this.notMsg === '임시저장') {
        if (this.endBusiness('bill')) {
          this.$alert('통보서 등록이 마감되었습니다.', '알림', 'warning');
          return false;
        }
        if (this.endBusiness('notification') && !this.data.billId) {
          this.$alert('통보서 신규 등록이 마감되었습니다.', '알림', 'warning');
          return false;
        }
        this.$router.push({ path: '/hospital/ntc', query: { studentId: this.data.studentId, businessDivision: 'E' } });
      } else if (this.notMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewNotification',
          params: { studentId: this.data.studentId, businessDivision: 'E', notificationYear: this.data.notificationYear },
        });
      }
    },
    infoModify() {
      this.$store.dispatch('popup/popupOpen', { contents: 'hospitalStudentInfoModify', params: { studentId: this.data.studentId, businessDivision: 'E' } });
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
      this.$store.dispatch('popup/popupOpen', { contents: 'adminBusiness', params: Object.assign(this.data, { businessDivision: 'E' }) });
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
