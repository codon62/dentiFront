<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">
        {{ data.studentName }}
        <br />
        ({{ studentGender[data.studentGender] }})
      </p>
    </td>
    <td>
      <p class="scommp">{{ data.studentBirth ? data.studentBirth : '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.centerName ? data.centerName : '-' }}</p>
    </td>
    <td><v-button :message="iafMsg" :tooltip="iafTooltip" @vclick="agreement"></v-button></td>
    <td><v-button :message="queMsg" :tooltip="queTooltip" @vclick="questionnaire"></v-button></td>
    <td>
      <p class="scommp">{{ data.requestDate ? data.requestDate : '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.approvalDate ? data.approvalDate : '-' }}</p>
    </td>
    <td><v-button message="보기" @vclick="intensiveRequest"></v-button></td>
    <td><v-button :message="intensiveNotificationMsg" @vclick="intensiveNotification"></v-button></td>
    <td>
      <p v-if="intensiveNotificationStatusMsg === '대기중'" class="scommp">{{ intensiveNotificationStatusMsg }}</p>
      <v-button v-else :message="intensiveNotificationStatusMsg"></v-button>
    </td>
  </tr>
</template>

<script>
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
      intensiveNotificationMsg: '',
      intensiveNotificationStatusMsg: '',
    };
  },
  computed: {
    ...mapState('status', ['studentGender']),
    ...mapState('user', ['userOrganTargetId']),
    ...mapGetters('business', ['endBusiness']),
    ...mapGetters('user', ['districtCodeFirst']),
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
    intensiveNotificationStatusToMsg(status, rule) {
      switch (status) {
        case 'N':
          return '진료중';
        case 'Y':
          return '진료완료';
        case null:
          return rule ? '대기중' : '-';
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
      this.intensiveNotificationMsg = this.statusToMsg(this.data.intensiveNotificationStatus, true);
      this.intensiveNotificationStatusMsg = this.intensiveNotificationStatusToMsg(this.data.intensiveNotificationStatus, true);
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
        this.$router.push({ path: '/univhpt/que', query: { studentId: this.data.studentId, businessDivision: 'C' } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewQuestionnaire', params: { studentId: this.data.studentId, businessDivision: 'C' } });
      }
    },
    intensiveRequest() {
      this.$store.dispatch('popup/popupOpen', { contents: 'viewIntensiveRequest', params: { studentId: this.data.studentId } });
    },
    intensiveNotification() {
      if (this.intensiveNotificationMsg === '등록' || this.intensiveNotificationMsg === '임시저장') {
        this.$router.push({ path: '/univhpt/intensiveNotification', query: { studentId: this.data.studentId } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewIntensiveNotification', params: { studentId: this.data.studentId } });
      }
    },
  },
};
</script>
