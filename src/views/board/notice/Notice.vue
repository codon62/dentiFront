<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">공지사항{{ $route.path === '/healthcare/board/notice/enroll' ? ($route.query.noticeBoardId ? ' 수정' : ' 등록') : '' }}</p>
    </div>
    <router-view />
  </fragment>
</template>

<script>
export default {
  name: 'Notice',
};
</script>

<style scoped></style>
