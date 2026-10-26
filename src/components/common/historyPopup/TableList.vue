<template>
  <tr>
    <td>
      <p class="scommp">{{ data.studentToHospitalSequence }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.centerName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.studentName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalName }}</p>
    </td>
    <td><v-button :message="['E', 'Y'].includes(data.notificationStatus) ? '보기' : '-'" @vclick="notification"></v-button></td>
    <td>
      <p class="scommp">{{ data.notificationDate ? data.notificationDate : '-' }}</p>
    </td>
    <td><v-button :message="['Y', 'A'].includes(data.treatmentPlanStatus) ? '보기' : '-'" @vclick="treatmentPlan"></v-button></td>
    <td>
      <p class="scommp">{{ data.approvalDate ? data.approvalDate : '-' }}</p>
    </td>
    <td><v-button :message="['Y'].includes(data.statementStatus) ? '보기' : '-'" @vclick="statement"></v-button></td>
    <td>
      <p class="scommp">{{ data.statementDate ? data.statementDate : '-' }}</p>
    </td>
    <td><v-button :message="billMsg" :tooltip="billTooltip"></v-button></td>
  </tr>
</template>

<script>
import Button from '@/components/common/Button.vue';

export default {
  components: {
    'v-button': Button,
  },
  props: ['num', 'data'],
  data() {
    return {
      billMsg: '',
      billTooltip: '',
    };
  },
  created() {
    this.status();
  },
  methods: {
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
    status() {
      this.billMsg = this.billStatusToMsg(this.data.billStatus);
      this.billTooltip = this.billMsg === '처리완료' ? '실제 지급일과 처리 일자는 다를 수 있습니다.' : '';
    },
    notification() {
      const params = {
        studentId: this.data.studentId,
        businessDivision: this.data.businessDivision ? this.data.businessDivision : 'C',
        notificationId: this.data.notificationId,
        notificationYear: this.data.notificationYear,
      };

      const contents = this.data.notificationYear === '2020' ? 'viewNotification2020' : 'viewNotification';
      this.$store.dispatch('popup/popupOpen', { contents: contents, params: params });
    },
    treatmentPlan() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewTreatmentPlan',
        params: { hospitalId: this.data.treatmentHospitalId || this.data.hospitalId, studentId: this.data.studentId, notificationId: this.data.notificationId },
      });
    },
    statement() {
      const params = {
        studentId: this.data.studentId,
        notificationId: this.data.notificationId,
        statementId: this.data.statementId,
        statementYear: this.data.statementYear,
      };

      const contents = this.data.statementYear === '2020' ? 'viewStatement2020' : 'viewStatement';
      this.$store.dispatch('popup/popupOpen', { contents: contents, params: params });
    },
  },
};
</script>
