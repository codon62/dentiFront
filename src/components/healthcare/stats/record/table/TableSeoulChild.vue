<template>
  <tr :class="{ comm__bg: data.districtCode === 'A' }">
    <td v-if="data.healthCareName !== ''" :rowspan="data.sameRow">
      <p class="scommp">{{ data.healthCareName }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countTargetBusinessAmount) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countStudent) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countPreviousMonthlyRegist) }} 건</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countThisMonthlyRegist) }} 건</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countRegist) }} 건</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countRegistStudent) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.ratioRegistStudent, 2) }} %</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countIntensiveRequest) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countTreatmentPlan) }} 건</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countBillStatusY) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countStatementTooth) }} 건</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countExamPrice) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.totalExamPrice, 2) }} 원</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countTreatPriceByZero) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countTreatPriceByZeroExcessToLessThanTen) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countTreatPriceByTenToLessThanTwenty) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countTreatPriceByTwentyToLessThanForty) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countTreatPriceByFortyToLessThanSixty) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countTreatPriceBySixtyToLessThanHundred) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countTreatPriceHundred) }} 명</p>
    </td>
  </tr>
</template>

<script>
export default {
  props: ['data'],
};
</script>
