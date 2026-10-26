<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">
        {{ data.studentName }}
        <br />
        ({{ data.studentBirth }})
      </p>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalName ? data.hospitalName : '-' }}</p>
    </td>
    <td v-if="['A', 'C'].includes(districtCodeFirst)">
      <p v-if="data.completeEduDate" class="scommp">이수</p>
      <v-button v-else message="미이수" @vclick="preventEduComplete"></v-button>
    </td>
    <td><v-button :message="iafMsg" :tooltip="iafTooltip" @vclick="agreement"></v-button></td>
    <td><v-button :message="queMsg" :tooltip="queTooltip" @vclick="questionnaire"></v-button></td>
    <td><v-button :message="notMsg" @vclick="notification"></v-button></td>
    <td>
      <p class="scommp">{{ data.treatStatus ? treatStatus.value[data.treatStatus] : '-' }}</p>
    </td>
    <td v-if="districtCodeFirst === 'A'">
      <p class="scommp" v-html="treatmentHospitalHtml"></p>
    </td>
    <td v-if="districtCodeFirst === 'A'"><v-button :message="stmMsg" @vclick="statement"></v-button></td>
    <td v-if="districtCodeFirst === 'A'">
      <p class="scommp">{{ data.screenStatus ? screenStatus.value[data.screenStatus] : '-' }}</p>
    </td>
    <td><v-button :message="modMsg" :tooltip="modTooltip" @vclick="infoModify"></v-button></td>
    <!--        <td v-if="isDev"><v-button message="초기화" @vclick="adminBusiness"></v-button></td>-->
  </tr>
</template>

<script>
import Management from '@/apis/Management';
import Button from '@/components/common/Button.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapState('status', ['treatStatus', 'screenStatus']),
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
  components: {
    'v-button': Button,
  },
  data() {
    return {
      iafMsg: '',
      queMsg: '',
      queTooltip: '',
      notMsg: '',
      stmMsg: '',
      modMsg: '',
      modTooltip: '',
    };
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
      this.notMsg = this.data.notificationStatus === 'Y' ? '보기' : '-';
      this.stmMsg = this.data.statementStatus === 'Y' ? '보기' : '-';
      this.modMsg = this.data.studentBusinessModifyAuth === 'N' ? '수정불가' : '수정';
      this.modTooltip = this.modMsg === '수정불가' ? '통보서가 최종제출된 학생은 정보수정이 불가능합니다.' : '';
    },
    agreement() {
      if (this.iafMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewAgreement', params: { studentId: this.data.studentId, studentName: this.data.studentName, businessDivision: 'C' } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'registAgreement', params: { studentId: this.data.studentId, businessDivision: 'C' } });
      }
    },
    questionnaire() {
      if (this.queMsg === '등록' || this.queMsg === '임시저장') {
        this.$router.push({ path: '/center/que', query: { studentId: this.data.studentId, businessDivision: 'C' } });
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
    statement() {
      if (this.stmMsg === '보기') {
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
    adminBusiness() {
      this.$store.dispatch('popup/popupOpen', { contents: 'adminBusiness', params: Object.assign(this.data, { businessDivision: 'C' }) });
    },
  },
};
</script>
