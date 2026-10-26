<template>
  <div>
    <div class="titbox">
      <p class="commp3 sub_title fwb">보건소 문의{{ $route.path === '/hospital/board/inquiry/enroll' ? ($route.query.inquiryId ? ' 수정' : ' 등록') : '' }}</p>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Inquiry',
};
</script>

<style scoped></style>
