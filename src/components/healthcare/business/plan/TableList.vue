<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td v-if="userOrganTargetType === 'CT'">
      <p class="scommp">{{ data.districtGunguName }}</p>
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
    <td><v-button message="보기" @vclick="questionnaire"></v-button></td>
    <td><v-button message="보기" @vclick="notification"></v-button></td>
    <td>
      <p class="scommp">{{ data.studentToHospitalSequence }}회차</p>
    </td>
    <td><v-button message="대기중" @vclick="treatmentPlan"></v-button></td>
  </tr>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { mapState } from 'vuex';

export default {
  components: {
    'v-button': Button,
  },
  props: ['num', 'data'],
  computed: {
    ...mapState('user', ['userOrganTargetType']),
  },
  methods: {
    questionnaire() {
      this.$store.dispatch('popup/popupOpen', { contents: 'viewQuestionnaire', params: { studentId: this.data.studentId, businessDivision: 'C' } });
    },
    notification() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewNotification',
        params: { studentId: this.data.studentId, businessDivision: 'C', notificationYear: this.data.notificationYear },
      });
    },
    treatmentPlan() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewTreatmentPlan',
        params: { hospitalId: this.data.treatmentHospitalId || this.data.hospitalId, studentId: this.data.studentId, notificationId: this.data.notificationId },
      });
    },
  },
};
</script>
