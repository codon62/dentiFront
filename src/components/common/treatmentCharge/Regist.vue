<template>
  <div class="popup_content">
    <v-popuptitle message="진료 수가" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp4 fwb">진료 수가 {{ isModify ? '수정' : '등록' }}</p>
      <div class="row flex_set mt20">
        <v-popupinput v-model="treatmentChargeName" title="진료 항목" size="m4" :required="true" placeholder="진료 항목"></v-popupinput>
        <v-popupinput v-model="treatmentChargePrice" title="진료 금액" size="s2" :required="true" divclass="ml30" placeholder="진료 금액"></v-popupinput>
        <v-popupinput v-model="treatmentChargeNote" title="비고" size="m5" divclass="ml30" placeholder="비고"></v-popupinput>
      </div>
      <div class="row mt30">
        <div class="inner--left">
          <a href="javascript:;" class="comm__gray_bd_btn d_block btn_l_size commp2 fwn wid110" @click="cancel">취소</a>
        </div>
        <div class="inner--right">
          <a href="javascript:;" class="comm__blue_btn d_block btn_l_size commp2 fwn wid130" @click="save">{{ isModify ? '수정' : '등록' }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Business from '@/apis/Business';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupInput from '@/components/popup/PopupInput.vue';
import { mapState } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupinput': popupInput,
  },
  props: ['dataObject'],
  data() {
    return {
      treatmentChargeName: '',
      treatmentChargePrice: '',
      treatmentChargeNote: '',
    };
  },
  computed: {
    ...mapState('user', ['districtCode', 'userOrganTargetId']),
    isModify() {
      return !!this.dataObject.treatmentChargeId;
    },
  },
  created() {
    if (this.isModify) {
      this.treatmentChargeName = this.dataObject.treatmentChargeName;
      this.treatmentChargePrice = this.dataObject.treatmentChargePrice;
      this.treatmentChargeNote = this.dataObject.treatmentChargeNote;
    }
  },
  methods: {
    cancel() {
      this.$store.dispatch('popup/popupOpen', { contents: 'treatmentChargeList' });
    },
    save() {
      const treatmentChargeName = this.treatmentChargeName?.trim() || '';
      if (treatmentChargeName === '') {
        this.$alert('진료 항목을 입력해 주세요.', '알림', 'warning');
        return false;
      }
      if (this.treatmentChargePrice === '') {
        this.$alert('치료 금액을 입력해주세요.', '알림', 'warning');
        return false;
      }
      let form = {
        districtCode: this.districtCode,
        healthCareId: this.userOrganTargetId,
        treatmentChargeName: treatmentChargeName,
        treatmentChargePrice: this.treatmentChargePrice?.trim() || '',
        treatmentChargeNote: this.treatmentChargeNote?.trim() || '',
      };
      if (this.isModify) {
        form.treatmentChargeId = this.dataObject.treatmentChargeId;
      }
      Business.treatmentChargeRegist(form).then(res => {
        if (res && res.data.rt === 200) {
          this.$alert((this.isModify ? '수정' : '등록') + '되었습니다.', '알림', 'success').then(() => {
            this.$store.dispatch('popup/popupClose');
            this.$store.dispatch('popup/popupOpen', { contents: 'treatmentChargeList' });
          });
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>
