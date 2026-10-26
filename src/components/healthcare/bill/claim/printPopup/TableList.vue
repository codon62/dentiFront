<template>
  <tr style="page-break-inside: avoid">
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ divName(data.businessDivision, true) }}</p>
    </td>
    <td v-if="data.businessDivision === 'C'">
      <p class="scommp">{{ data.centerName }}</p>
    </td>
    <td v-if="data.businessDivision !== 'C'">
      <p class="scommp">{{ data.schoolName ? data.schoolName : '학교밖' }}</p>
    </td>
    <td v-if="['I', 'J'].includes(districtCodeFirst)">
      <p class="scommp">{{ numberWithCommas(data.studentCount) }}명</p>
    </td>
    <template v-else>
      <td v-if="data.businessDivision !== 'C'">
        <p class="scommp">{{ data.studentToSchoolGrade1 ? data.studentToSchoolGrade1 : '-' }}</p>
      </td>
      <td v-if="data.businessDivision !== 'C'">
        <p class="scommp">{{ data.studentToSchoolGrade2 ? data.studentToSchoolGrade2 : '-' }}</p>
      </td>
      <td v-if="data.businessDivision !== 'C'">
        <p class="scommp">{{ data.studentToSchoolGrade3 ? data.studentToSchoolGrade3 : '-' }}</p>
      </td>
      <td v-if="!(districtCodeFirst === 'J' && adminOrganType !== 'AD')">
        <p class="scommp">{{ data.studentBirth ? data.studentBirth : '-' }}</p>
      </td>
      <td>
        <p class="scommp">{{ data.studentName }}</p>
      </td>
    </template>
    <td v-if="data.businessDivision === 'C'">
      <p class="scommp">{{ numberWithCommas(data.billExamPrice) }}원</p>
    </td>
    <td v-if="data.businessDivision === 'C'">
      <p class="scommp">{{ numberWithCommas(data.billTreatPrice) }}원</p>
    </td>
    <td v-if="data.businessDivision === 'C' && districtCodeFirst === 'D'">
      <p class="scommp">{{ numberWithCommas(data.billCopayPrice) }}원</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.totalClaimPrice) }}원</p>
    </td>
  </tr>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapState('user', ['adminOrganType']),
    ...mapGetters('business', ['divName']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
};
</script>
