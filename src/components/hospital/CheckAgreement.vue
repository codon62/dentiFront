<template>
  <div class="popup_content">
    <v-popuptitle message="개인정보활용동의서" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner">
      <p class="lcommp4"><strong>개인정보활용동의서를 업로드</strong>하거나 <strong>직접 보관에 체크</strong>해 주세요. <strong class="c_red">(택1)</strong></p>
      <div class="row flex_set mt30">
        <div class="step_box tac ml20" :class="{ on: checked === 1 }" @click="checked = 1">
          <div class="icon_box"></div>
          <p class="commp2 mt30 fwb">개인정보활용동의서 업로드</p>
          <p class="commp mt20">개인정보활용동의서를 스캔하여 업로드합니다.</p>
        </div>
        <div class="step_box tac ml20" :class="{ on: checked === 2 }" @click="checked = 2">
          <div class="icon_box"></div>
          <p class="commp2 mt30 fwb">개인정보활용동의서 직접 보관</p>
          <p class="commp mt20">
            개인정보활용동의서를 실물로 보관합니다.<br />
            동의서 보관에 대한 책임은 보관하는 기관에 있습니다.
          </p>
        </div>
      </div>
      <div class="row mt30">
        <div class="inner--left">
          <button class="comm__gray_bd_btn d_block btn_l_size commp2 fwn wid110" @click="cancel">취소</button>
        </div>
        <div class="inner--right">
          <button class="comm__blue_btn d_block btn_l_size commp2 fwn wid130" @click="next">다음으로</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';

export default {
  components: {
    'v-popuptitle': popupTitle,
  },
  props: ['dataObject'],
  data() {
    return {
      checked: null,
    };
  },
  methods: {
    cancel() {
      if (this.dataObject.customCancel) {
        this.$store.dispatch('popup/popupOpen', { contents: this.dataObject.customCancel, params: { studentId: this.dataObject.studentId, businessDivision: this.dataObject.businessDivision } });
      } else {
        this.$store.dispatch('popup/popupClose');
      }
    },
    next() {
      switch (this.checked) {
        case 1:
          this.$store.dispatch('popup/popupOpen', {
            contents: 'registAgreement',
            params: { studentId: this.dataObject.studentId, businessDivision: this.dataObject.businessDivision, customCancel: 'checkAgreement' },
          });
          break;
        case 2:
          this.$store.dispatch('popup/popupOpen', {
            contents: 'keepAgreement',
            params: { studentId: this.dataObject.studentId, businessDivision: this.dataObject.businessDivision, customCancel: 'checkAgreement' },
          });
          break;
        default:
          this.$alert('업로드 또는 직접 보관 중 선택해 주세요.', '알림', 'warning');
          break;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.step_box {
  @include box-sizing(border-box);
  @include transition(all 0.4s ease-out);
  @include border-radius(3px);

  border: 1px solid #dbdbdb;
  overflow: hidden;
  padding: 30px;
  width: 430px;
  height: 218px;
  cursor: pointer;
}
.step_box.on {
  border-color: #0868f1;
}
.step_box .icon_box {
  background: url('#{$asset-img-path}common/ic_unselect.png') no-repeat;
  width: 40px;
  height: 40px;
  margin: 0 auto;
}
.step_box.on .icon_box {
  background: url('#{$asset-img-path}common/ic_select.png') no-repeat;
}
</style>
