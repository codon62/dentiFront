<template>
  <div class="board__con bg_white" style="min-height: 240px">
    <div class="list__con">
      <ul class="notice__list">
        <li v-if="!data.length" class="tac">
          <a href="javascript:;" style="cursor: default">등록된 {{ title === '보건소 문의' ? `${title}가` : `${title}이` }} 없습니다.</a>
        </li>
        <li v-for="(item, idx) in data" :key="idx">
          <a href="" @click="() => onrowclick(item)" @click.prevent>
            <template v-if="title.includes('문의')">
              <span class="d_inblock wid60 scommp btn_s_size mr10" :class="item.inquiryAnswerRegdate ? 'comm__blue_btn' : 'comm__red_btn'">{{ item.inquiryAnswerRegdate ? '해결' : '처리중' }}</span>
              <span class="d_inblock inquiry-text">
                {{ item.inquiryQuestionSubject }}
              </span>
              <span v-if="options && options.datapick && options.pickCond(item)" class="new_badge d_inblock ml5">
                {{ options.pickEffect }}
              </span>
            </template>
            <template v-else>
              <span v-if="options && options.baseIcon" class="icon"><img :src="options.baseIcon" /></span>
              <span class="d_inblock subject-text">
                {{ item.faqSubject ? item.faqSubject : item.noticeBoardSubject }}
              </span>
              <span v-if="item.fileExist" class="icon_file">첨부파일</span>
              <span v-if="options && options.datapick && options.pickCond(item)" class="new_badge d_inblock ml5">
                {{ options.pickEffect }}
              </span>
            </template>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'NoticeBox',
  props: ['data', 'onrowclick', 'options', 'title'],
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapGetters('business', ['divJoin']),
  },
};
</script>

<style scoped lang="scss">
ul.notice__list > li {
  margin: 11px 0;
  padding: 0 10px;
}
.notice__list li a {
  line-height: normal;
}
.notice__list li a .inquiry-text {
  max-width: calc(100% - 115px);
  text-overflow: ellipsis;
  overflow: hidden;
}
.notice__list li a .subject-text {
  max-width: calc(100% - 105px);
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
