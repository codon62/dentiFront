<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.districtName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.schoolName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.studentToSchoolGrade1 }}학년</p>
    </td>
    <td>
      <p class="scommp">{{ data.studentToSchoolGrade2 }}반</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.headcount) }}명</p>
    </td>
    <td>
      <p class="scommp">{{ data.eduResultRegdate }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.eduSubject }}</p>
    </td>
  </tr>
</template>

<script>
export default {
  props: ['num', 'data'],
};
</script>
