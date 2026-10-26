<template>
  <tr v-if="data.billId">
    <td>
      <p class="scommp">{{ data.num }}</p>
    </td>
    <td>
      <p class="scommp">{{ divName(data.businessSubsidiaryDivision, true) }}</p>
    </td>
    <td>
      <p class="scommp">{{ districtCodeFirst === 'C' ? data.districtSiName : data.districtGunguName }}</p>
    </td>
    <td>
      <p class="scommp">
        {{ data.studentName }}
        <br />
        ({{ data.studentBirth }})
      </p>
    </td>
    <td><p class="scommp" v-html="data.studentToSchoolGrade1 ? `${data.schoolName}<br>(${data.studentToSchoolGrade1}/${data.studentToSchoolGrade2}/${data.studentToSchoolGrade3})` : '학교밖'"></p></td>
    <td>
      <p class="scommp">{{ data.hospitalName }}</p>
    </td>
    <td><v-button :message="queMsg" @vclick="questionnaire"></v-button></td>
    <td><v-button :message="notMsg" @vclick="notification"></v-button></td>
    <td><v-button :message="billMsg"></v-button></td>
  </tr>
  <tr v-else class="bg_blue">
    <td colspan="2">
      <p class="scommp c_red fwn">{{ data.regdate }}</p>
    </td>
    <td colspan="7"><p class="scommp fwn tal ml25" v-html="data.billRejectReason"></p></td>
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
      queMsg: '',
      notMsg: '',
      billMsg: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName']),
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
    status() {
      this.queMsg = this.data.questionnaireStatus && this.data.questionnaireStatus !== 'N' ? '보기' : '-';
      this.notMsg = this.data.notificationStatus && this.data.notificationStatus !== 'N' ? '보기' : '-';
      this.billMsg = this.billStatusToMsg(this.data.billStatus);
      if (this.data.billRejectReason) {
        this.data.billRejectReason = this.data.billRejectReason.replace(/(\n)/g, '<br>');
      }
    },
    billStatusToMsg(status) {
      switch (status) {
        case 'N':
          return '제출완료<br>(청구중)';
        case 'Y':
          return '처리완료';
        case 'R':
          return '반려됨';
        case 'RN':
          return '제출완료<br>(재청구중)';
        case null:
          return '-';
      }
    },
    questionnaire() {
      this.$store.dispatch('popup/popupOpen', { contents: 'viewQuestionnaire', params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision } });
    },
    notification() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewNotification',
        params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision, notificationYear: this.data.notificationYear },
      });
    },
  },
};
</script>
