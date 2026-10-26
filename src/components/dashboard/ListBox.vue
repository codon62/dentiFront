<template>
  <div :class="`dash__comm_box${districtCodeFirst === 'J' ? 7 : 5}`" class="dash__comm_box inner--left">
    <div class="tit_row row">
      <div class="inner--left">
        <p class="commp5 c_black2 fwb">
          {{ title }}
        </p>
      </div>
      <div v-if="button" class="inner--right">
        <a class="d_block scommp c_gray3" @click="button.action">
          <a href="" @click.prevent>{{ button.label }}</a>
          <span class="icon"><img src="@/assets/images/common/ic_seeall.png" :alt="button.label" /></span>
        </a>
      </div>
    </div>
    <div class="board__con bg_white" :class="userOrganTargetType === 'SC' && ['A', 'C', 'F', 'G'].includes(districtCodeFirst) ? 'mt30' : 'mt15'">
      <div class="list__con">
        <div class="m_inner row">
          <ul class="notice__list">
            <li v-if="!data.length" class="tac"><a href="javascript:;" style="cursor: default">등록된 공지사항이 없습니다.</a></li>
            <li v-for="(item, idx) in data" :key="idx">
              <a href="" @click="() => onrowclick(item)" @click.prevent>
                <span v-if="options && options.baseIcon" class="icon"><img :src="options.baseIcon" /></span>
                <span class="d_inblock subject-text">
                  {{ item.noticeBoardSubject }}
                </span>
                <span v-if="item.fileExist" class="icon_file">첨부파일</span>
                <span v-if="options && options.datapick && options.pickCond(item)" class="new_badge d_inblock ml5">
                  {{ options.pickEffect }}
                </span>
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

export default {
  props: ['title', 'data', 'button', 'onrowclick', 'options'],
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
};
</script>

<style scoped lang="scss">
.notice__list li a .subject-text {
  max-width: calc(100% - 105px);
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
