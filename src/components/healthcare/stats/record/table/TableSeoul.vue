<template>
  <tr :class="{ comm__bg: data.districtCode === 'A' }">
    <td v-if="data.healthCareName !== ''" :rowspan="data.sameRow">
      <p class="scommp">{{ data.healthCareName }}</p>
    </td>
    <td v-if="$route.path === '/healthcare/stats/record/seoul/famdoc'">
      <p class="scommp">{{ numberWithCommas(data.countTargetBusinessAmount) }} 명</p>
    </td>
    <td v-if="!($route.path === '/healthcare/stats/record/seoul/examine')">
      <p class="scommp">{{ numberWithCommas(data.countStudent) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countPreviousMonthlyRegist) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countThisMonthlyRegist) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countRegistStudent) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.ratioRegistStudent, 2) }} %</p>
    </td>
  </tr>
</template>

<script>
export default {
  props: ['data'],
};
</script>
