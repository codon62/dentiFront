<template>
  <!-- <a v-if="clickable" href="javascript:;" :class="typeClass" @click="vclick" class="d_inblock wid60 commp btn_s_size">{{ message }}</a>
    <span v-else :class="typeClass" @click="vclick" class="d_inblock wid60 commp btn_s_size">{{ message }}</span> -->
  <p v-if="type === 'bilt'" v-tooltip="tooltip" class="scommp blit_ver" :class="cls1">
    <span class="blit" :class="cls2"></span>
    <span v-html="message" />
  </p>
  <a v-else-if="type === 'btn'" v-tooltip="tooltip" href="javascript:;" :class="cls1" class="d_inblock wid60 scommp btn_s_size" :style="style" @click="vclick">
    <span v-if="message === '반려됨'" class="blit d_inblock mr5" :class="cls2"></span>
    {{ otherMessage ? otherMessage : message }}
  </a>
  <a v-else-if="type === 'plus'" v-tooltip="tooltip" href="javascript:;" class="plus_btn d_block" :class="cls1" @click="vclick"></a>
  <a v-else-if="type === 'img'" v-tooltip="tooltip" href="javascript:;" class="board_link_btn" @click="vclick"><img :src="require(`@/assets/images/common/${imgsrc}.png`)" :style="style" /></a>
  <p v-else class="scommp">{{ message }}</p>
</template>

<script>
export default {
  props: ['message', 'tooltip', 'optionalBtnType'],
  data() {
    return {
      otherMessage: '',
      type: '',
      cls1: '',
      cls2: '',
      imgsrc: 'bt_see',
      style: '',
      click: false,
    };
  },
  watch: {
    message() {
      this.check();
    },
  },
  mounted() {
    this.check();
  },
  methods: {
    vclick() {
      if (this.click) {
        this.$emit('vclick', this.data);
      }
    },
    check() {
      switch (this.message) {
        case '제출완료<br>(청구중)':
        case '제출완료<br>(재청구중)':
        case '진료중':
        case '작성중':
          this.type = 'bilt';
          this.cls1 = '';
          this.cls2 = 'bg_black';
          this.click = false;
          break;
        case '처리완료':
        case '진료완료':
          this.type = 'bilt';
          this.cls1 = 'c_green';
          this.cls2 = 'bg_green';
          this.click = false;
          break;
        case '반려됨':
          this.cls1 = 'c_red';
          this.cls2 = 'bg_red';
          if (this.optionalBtnType === 'btn') {
            this.type = 'btn';
            this.click = true;
          } else {
            this.type = 'bilt';
            this.click = false;
          }
          break;
        case '임시저장':
        case '지정':
        case '신청':
        case '지급':
        case '인쇄':
        case '미이수':
        case '메모 등록':
        case '사유 등록':
          this.type = 'btn';
          this.cls1 = 'comm__blue_btn';
          this.click = true;
          break;
        case '메모 조회':
        case '사유 조회':
          this.type = 'btn';
          this.cls1 = 'comm__gray_btn';
          this.click = true;
          break;
        case '임시저장불가':
          this.type = 'btn';
          this.cls1 = 'comm__blue_btn';
          this.style = { opacity: 0.2 };
          this.click = true;
          this.otherMessage = '임시저장';
          break;
        case '초기화':
        case '반려':
        case '전출':
          this.type = 'btn';
          this.cls1 = 'comm__red_btn';
          this.style = '';
          this.click = true;
          break;
        case '전출불가':
          this.type = 'btn';
          this.cls1 = 'comm__red_btn';
          this.style = { opacity: 0.2 };
          this.click = false;
          this.otherMessage = '전출';
          break;
        case '지급취소':
          this.type = 'btn';
          this.cls1 = 'comm__navy_btn';
          this.click = true;
          break;
        case '대기중':
          this.type = 'btn';
          this.cls1 = 'comm__bd_btn';
          this.click = true;
          break;
        case '승인됨':
          this.type = 'btn';
          this.cls1 = 'comm__green_bd_btn';
          this.click = true;
          break;
        case '미승인됨':
          this.type = 'btn';
          this.cls1 = 'comm__red_bd_btn';
          this.click = true;
          break;
        case '등록':
          this.type = 'plus';
          this.cls1 = 'on';
          this.click = true;
          break;
        case '등록불가':
          this.type = 'plus';
          this.cls1 = '';
          this.click = false;
          break;
        case '보기':
          this.type = 'img';
          this.imgsrc = 'bt_see';
          this.style = '';
          this.click = true;
          break;
        case '수정':
          this.type = 'img';
          this.imgsrc = 'bt_edit';
          this.style = '';
          this.click = true;
          break;
        case '취소':
          this.type = 'img';
          this.imgsrc = 'ico_x';
          this.style = '';
          this.click = true;
          break;
        case '수정불가':
          this.type = 'img';
          this.imgsrc = 'bt_edit';
          this.style = { opacity: 0.2 };
          this.click = false;
          break;
        case '취소불가':
          this.type = 'img';
          this.imgsrc = 'ico_x';
          this.style = { opacity: 0.2 };
          this.click = false;
          break;
        case 'APP 동의 버튼':
          this.type = 'btn';
          this.cls1 = 'comm__blue_btn';
          this.style = '';
          this.click = true;
          this.otherMessage = 'APP 동의';
          break;
        default:
          this.type = '';
          this.imgsrc = '';
          this.click = false;
          break;
      }
    },
  },
};
</script>

<style scoped>
.blit {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 6px;
  overflow: hidden;
}
</style>
