<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ districtCodeFirst === 'C' ? data.districtSiName : data.healthCareName }}</p>
    </td>
    <td>
      <p v-if="data.hospitalBusinessDivisionF === 'C000800001'" class="scommp">
        {{ divName('F', true) }}
      </p>
      <p v-if="data.hospitalBusinessDivisionE === 'C000800001'" class="scommp">
        {{ divName('E', true) }}
      </p>
      <p v-if="data.hospitalBusinessDivisionC === 'C000800001'" class="scommp">
        {{ divName('C', true) }}
      </p>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalTel }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalAddress }}</p>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName']),
  },
};
</script>
