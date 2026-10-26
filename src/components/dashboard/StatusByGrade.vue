<template>
  <div :class="`type${type}`" class="status_list flex_space_between_container">
    <div class="col_2">
      <dl class="box">
        <dt>1학년</dt>
        <dd>
          <strong>학생 구강검진</strong>
          <span>{{ numberWithCommas(data.totalE1BillCount || 0) }}명 / {{ numberWithCommas(data.totalE1Count || 0) }}명</span>
          <span class="c_gray3">({{ numberRound(data.totalE1Rate || 0, 2) }}%)</span>
        </dd>
        <dd>
          <strong>학생 치과주치의</strong>
          <span>{{ numberWithCommas(data.totalF1BillCount || 0) }}명 / {{ numberWithCommas(data.totalF1Count || 0) }}명</span>
          <span class="c_gray3">({{ numberRound(data.totalF1Rate || 0, 2) }}%)</span>
        </dd>
      </dl>
      <dl class="box">
        <dt>2학년</dt>
        <dd>
          <strong>학생 구강검진</strong>
          <span>{{ numberWithCommas(data.totalE2BillCount || 0) }}명 / {{ numberWithCommas(data.totalE2Count || 0) }}명</span>
          <span class="c_gray3">({{ numberRound(data.totalE2Rate || 0, 2) }}%)</span>
        </dd>
      </dl>
      <dl class="box">
        <dt>3학년</dt>
        <dd>
          <strong>학생 구강검진</strong>
          <span>{{ numberWithCommas(data.totalE3BillCount || 0) }}명 / {{ numberWithCommas(data.totalE3Count || 0) }}명</span>
          <span class="c_gray3">({{ numberRound(data.totalE3Rate || 0, 2) }}%)</span>
        </dd>
      </dl>
    </div>
    <div class="col_2">
      <dl class="box">
        <dt>4학년</dt>
        <dd>
          <strong>학생 구강검진</strong>
          <span>{{ numberWithCommas(data.totalE4BillCount || 0) }}명 / {{ numberWithCommas(data.totalE4Count || 0) }}명</span>
          <span class="c_gray3">({{ numberRound(data.totalE4Rate || 0, 2) }}%)</span>
        </dd>
        <dd>
          <strong>학생 치과주치의</strong>
          <span>{{ numberWithCommas(data.totalF4BillCount || 0) }}명 / {{ numberWithCommas(data.totalF4Count || 0) }}명</span>
          <span class="c_gray3">({{ numberRound(data.totalF4Rate || 0, 2) }}%)</span>
        </dd>
      </dl>
      <dl class="box">
        <dt>5학년</dt>
        <dd>
          <strong>학생 구강검진</strong>
          <span>{{ numberWithCommas(data.totalE5BillCount || 0) }}명 / {{ numberWithCommas(data.totalE5Count || 0) }}명</span>
          <span class="c_gray3">({{ numberRound(data.totalE5Rate || 0, 2) }}%)</span>
        </dd>
      </dl>
      <dl class="box">
        <dt>6학년</dt>
        <dd>
          <strong>학생 구강검진</strong>
          <span>{{ numberWithCommas(data.totalE6BillCount || 0) }}명 / {{ numberWithCommas(data.totalE6Count || 0) }}명</span>
          <span class="c_gray3">({{ numberRound(data.totalE6Rate || 0, 2) }}%)</span>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  props: ['type', 'data'],
};
</script>

<style scoped></style>
