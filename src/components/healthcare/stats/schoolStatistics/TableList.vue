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
    <td>
      <v-button v-if="data.districtCode !== 'C'" message="보기" @vclick="$router.push({ path: '/healthcare/stats/school-statistics-detail', query: { districtCode: data.districtCode } })"></v-button>
      <p v-else class="scommp">-</p>
    </td>
  </tr>
</template>

<script>
import Button from '@/components/common/Button.vue';

export default {
  props: ['data'],
  components: {
    'v-button': Button,
  },
};
</script>
