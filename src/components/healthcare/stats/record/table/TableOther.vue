<template>
  <tr :class="{ comm__bg: ['B', 'F', 'G', 'I', 'J'].includes(data.districtCode) }">
    <td v-if="data.healthCareName !== ''" :rowspan="data.sameRow">
      <p class="scommp">{{ data.healthCareName }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countTargetBusinessAmount) }} 명</p>
    </td>
    <template v-if="divJoin('S')">
      <td>
        <p class="scommp">{{ numberWithCommas(data.countRegistByBusinessDivisionF) }} 명</p>
      </td>
      <td>
        <p class="scommp">{{ numberWithCommas(data.countRegistByBusinessDivisionE) }} 명</p>
      </td>
    </template>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countRegist) }} 명</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.ratioRegist, 2) }} %</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countBillPriceByStatusNotY) }} 건</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.totalBillPriceByStatusNotY) }} 원</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countBillPriceByStatusY) }} 건</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.totalBillPriceByStatusY) }} 원</p>
    </td>
    <td>
      <p class="scommp">{{ numberRound(data.ratioBillStatusY, 2) }} %</p>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['data'],
  computed: {
    ...mapGetters('business', ['divJoin']),
  },
};
</script>
