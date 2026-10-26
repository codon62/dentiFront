<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">자주하는 질문{{ $route.path === '/healthcare/board/faq/enroll' ? ($route.query.faqId ? ' 수정' : ' 등록') : '' }}</p>
    </div>
    <router-view />
  </fragment>
</template>

<script>
export default {
  name: 'Faq',
};
</script>

<style scoped></style>
