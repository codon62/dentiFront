<template>
  <tr :class="{ comm__bg: data.districtCode === 'C' }">
    <td>
      <p class="scommp">{{ data.districtSiName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.healthCareName }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.billPercent, 2) }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.studentTotal) }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionAllTotal) }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionFTotal) }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.businessDivisionETotal) }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.businessDivisionFPercent, 2) }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.businessDivisionEPercent, 2) }}</p>
    </td>
  </tr>
</template>

<script>
export default {
  props: ['data'],
};
</script>
