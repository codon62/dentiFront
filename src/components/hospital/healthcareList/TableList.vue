<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.healthCareName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.secondHealthCareName ? data.secondHealthCareName : '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.healthCareTel ? data.healthCareTel : '-' }}</p>
    </td>
  </tr>
</template>

<script>
export default {
  props: ['num', 'data'],
};
</script>
