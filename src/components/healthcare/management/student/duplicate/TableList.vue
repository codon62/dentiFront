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
    <td>
      <p class="scommp">{{ data.studentBirth }}</p>
    </td>
    <td><p class="scommp" v-html="data.studentToSchoolGrade1 ? `${data.schoolName}<br>(${data.studentToSchoolGrade1}/${data.studentToSchoolGrade2}/${data.studentToSchoolGrade3})` : '학교밖'"></p></td>
    <td>
      <p class="scommp">{{ data.centerName ? data.centerName : '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.billIdStudentBusinessDivisionC ? '검진' : '미검진' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.billIdStudentBusinessDivisionF ? '검진' : '미검진' }}</p>
    </td>
  </tr>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapState('status', ['studentGender']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
};
</script>
