<template>
  <div class="popup_content">
    <v-popuptitle message="경기도 학생치과주치의 학교 안내 사항" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner tac">
      <img src="@/assets/images/sub/popup_gyeonggi_school.png" />
      <a href="javascript:;" class="comm__gray_btn btn_m_size2 wid130 commp inner--right mr10 mt10" @click="todayClose">오늘 하루 보지 않기</a>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';
import { mapActions } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
  },
  methods: {
    ...mapActions('popup', ['todayClose']),
  },
};
</script>
