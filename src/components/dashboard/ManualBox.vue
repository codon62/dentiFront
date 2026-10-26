<template>
  <div class="dash__comm_box dash__comm_box6 inner--left">
    <div class="tit_row row">
      <p class="commp5 c_black2 fwb">
        {{ title }}
        &nbsp;&nbsp;
        <span class="scommp fwn c_gray3">압축파일 해제 시 압축프로그램 사용 권장</span>
      </p>
    </div>
    <div class="board__con" :class="userOrganTargetType === 'SC' && ['A', 'C', 'F', 'G'].includes(districtCodeFirst) ? 'mt30' : 'mt15'">
      <div class="list__con">
        <div class="m_inner row">
          <ul class="manual__list">
            <li v-for="(manual, index) in data" :key="index" :class="`manual_list${manual[0]}`">
              <a v-if="!manual[2]" href="javascript:;" class="scommp" @click="$alert('준비중입니다.', '알림', 'warning')">
                <span class="icon fixed"><img :src="require(`@/assets/images/common/${dataImg[manual[0]]}.png`)" /></span>
                {{ manual[1] }}
              </a>

              <router-link v-else-if="manual[3] === 'push'" :to="manual[2]" class="scommp">
                <span class="icon fixed"><img :src="require(`@/assets/images/common/${dataImg[manual[0]]}.png`)" /></span>
                {{ manual[1] }}
              </router-link>

              <a v-else-if="manual[3] === 'blank' || manual[2].slice(-3) === 'pdf'" :href="manual[2]" class="scommp" target="_blank">
                <span class="icon fixed"><img :src="require(`@/assets/images/common/${dataImg[manual[0]]}.png`)" /></span>
                {{ manual[1] }}
              </a>

              <a v-else href="javascript:;" class="scommp" @click="download(manual[2])">
                <span class="icon fixed"><img :src="require(`@/assets/images/common/${dataImg[manual[0]]}.png`)" /></span>
                {{ manual[1] }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';
import axios from 'axios';

export default {
  props: ['title', 'data', 'button', 'dataImg'],
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
  methods: {
    download(href) {
      // 크롬 보안 이슈로 인해 axios 거쳐 다운로드
      const fileName = href.substring(href.lastIndexOf('/') + 1);
      axios.get(href, { responseType: 'blob' }).then(res => {
        this.fileDownload(res.data, fileName);
      });
    },
  },
};
</script>

<style scoped>
.icon img {
  width: 15px;
}
</style>
