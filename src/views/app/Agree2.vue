<template>
  <div class="popup__con_inner" style="max-height: none">
    <div class="privacy-wrap">개인정보 제공 동의서 준비중</div>
  </div>
</template>

<script>
export default {
  created() {
    Gitple('shutdown');
  },
};
</script>
