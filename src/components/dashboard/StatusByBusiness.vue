<template>
  <div :class="`type${type}`" class="status_list">
    <dl :class="{ box: type === 2 }">
      <dt>학생 구강검진</dt>
      <dd>
        <strong>{{ numberWithCommas(data.totalEBillCount || 0) }}명 / {{ numberWithCommas(data.totalECount || 0) }}명</strong><br />
        <span class="c_gray3">({{ numberRound(data.totalERate || 0, 2) }}%)</span>
      </dd>
    </dl>
    <div v-if="type === 1" class="divider" />
    <dl :class="{ box: type === 2 }">
      <dt>학생 치과주치의</dt>
      <dd>
        <strong>{{ numberWithCommas(data.totalFBillCount || 0) }}명 / {{ numberWithCommas(data.totalFCount || 0) }}명</strong><br />
        <span class="c_gray3">({{ numberRound(data.totalFRate || 0, 2) }}%)</span>
      </dd>
    </dl>
  </div>
</template>

<script>
export default {
  props: ['type', 'data'],
};
</script>

<style scoped></style>
