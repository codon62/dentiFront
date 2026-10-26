<template>
  <tr :class="{ comm__bg: data.districtCode === 'C' }">
    <td v-if="data.districtSiName !== ''" :rowspan="data.sameRow">
      <p class="scommp">{{ data.districtSiName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.healthCareName }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.school) }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.studentTotal) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.studentMen) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.studentWomen) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionFTotal) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionFMen) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionFWomen) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionETotal) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionEMen) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionEWomen) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionAllTotal) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionAllMen) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionAllWomen) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.businessDivisionEPercent, 2) }} %</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.billPercent, 2) }} %</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.n_13_check_1) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.n_13_check_3) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.n_13_check_4) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.n_13_check_1_percent, 2) }} %</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.n_13_check_3_percent, 2) }} %</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.n_13_check_4_percent, 2) }} %</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.hospital) }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.hospitalEdu) }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.examPrice) }} 원</p>
    </td>
  </tr>
</template>

<script>
export default {
  props: ['data'],
};
</script>
