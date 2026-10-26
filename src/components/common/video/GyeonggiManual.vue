<template>
  <div class="sub__content form__ver_1 mt30">
    <div class="browser__con">
      <div class="bg_white mt20 tac" style="width: 1200px; margin: 0 auto; padding: 50px; box-sizing: border-box">
        <div class="iconbox"><img src="@/assets/images/sub/ic_hospital_o.png" /></div>
        <p class="commp3 mt15 fwb">경기도 의료기관 치과주치의 교육 동영상</p>
        <div class="mt30">
          <video id="video" ref="video" width="100%" controls></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hls from 'hls.js';

export default {
  mounted() {
    const hls = new Hls();
    const stream = 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/치과주치의사업 교육 매뉴얼(의료기관용)/gyeonggi-manual.m3u8';
    const video = this.$refs.video;
    hls.loadSource(stream);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play();
    });
  },
};
</script>
