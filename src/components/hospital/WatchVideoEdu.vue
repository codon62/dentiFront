<template>
  <div class="sub__content form__ver_1 mt30">
    <div class="browser__con">
      <div class="bg_white mt20 tac" style="width: 1200px; margin: 0 auto; padding: 50px; box-sizing: border-box">
        <div class="iconbox"><img src="@/assets/images/sub/ic_hospital_o.png" /></div>
        <p class="commp3 mt15 fwb">경기도 치과주치의 교육 동영상</p>
        <p class="commp mt15 c_black2">
          보다 원활한 서비스 이용을 위해
          <br />
          치과주치의 교육 동영상을 시청하여 주세요.
        </p>
        <div class="mt30">
          <video id="video" ref="video" width="100%" controls @ended="videoEnd()"></video>
        </div>
        <div class="mt10">
          <a id="endButton" v-tooltip="tooltip" href="javascript:;" class="d_inblock wid160 btn_m_size comm__blue_btn" style="opacity: 0.2" @click="finish">교육 동영상 시청 완료</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hls from 'hls.js';
import Hospital from '@/apis/Hospital';
import { mapState } from 'vuex';

export default {
  props: ['bankList'],
  data() {
    return {
      videoEnded: false,
      tooltip: '동영상 시청 완료 시에 활성화됩니다.',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId']),
  },
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
  methods: {
    videoEnd() {
      this.videoEnded = true;
      this.tooltip = '';
      document.getElementById('endButton').removeAttribute('style');
    },
    finish() {
      if (!this.videoEnded) {
        return false;
      }
      Hospital.videoEduWatch({ hospitalId: this.userOrganTargetId }).then(res => {
        if (res && res.data.rt === 200) {
          this.$alert('시청 완료 처리되었습니다.', '알림', 'success').then(() => {
            this.$store.commit('user/setHospitalVideoEdu', 'Y');
            this.$emit('change');
          });
        } else {
          if (res.data.rt === 422) {
            this.$alert('시청 완료 처리되었습니다.', '알림', 'success').then(() => {
              this.$store.commit('user/setHospitalVideoEdu', 'Y');
              this.$emit('change');
            });
          }
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>
