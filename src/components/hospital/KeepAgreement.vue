<template>
  <div class="popup_content">
    <v-popuptitle message="개인정보활용동의서" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp2 fwb">개인정보활용동의서 직접 보관</p>
      <p class="mt10 c_red scommp">※ 보관 기관을 입력해 주세요.</p>
      <p class="commp fwb mt20">
        보관 기관
        <span class="c_red">*</span>
      </p>
      <div class="row flex_set">
        <div class="flex_item flex_size_s2">
          <div class="m__putbox mt10">
            <select class="comm_select" v-model="organType" @change="setOrganType($event.target.value)">
              <option value="">기관유형 선택</option>
              <option v-for="item in organTypeList" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </div>
        </div>
        <div class="flex_item flex_size_m ml10">
          <div class="m__putbox mt10">
            <input type="text" class="comm_put" v-model="organTypeEtc" placeholder="기타 선택 시 입력해 주세요." :disabled="organType !== 'C008700010'" />
          </div>
        </div>
      </div>
      <v-popupconfirm message="등록" :customCancel="dataObject.customCancel" @cancel="cancel" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import { mapGetters } from 'vuex';

Vue.use(SimpleVueValidation);
SimpleVueValidation.extendTemplates({
  required: '필수 입력 항목입니다.',
  integer: '잘못된 입력값입니다.',
  minLength: '잘못된 입력값입니다.',
  maxLength: '잘못된 입력값입니다.',
});
const Validator = SimpleVueValidation.Validator;

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
  },
  props: ['dataObject'],
  data() {
    return {
      checked: null,
      organTypeList: [],
      organType: '',
      organTypeEtc: '',
    };
  },
  computed: {
    ...mapGetters('definedCode', ['valueToCode', 'codeToOptionList']),
  },
  validators: {
    organType: value => {
      return Validator.value(value).required();
    },
  },
  created() {
    this.organTypeList = this.codeToOptionList('C0087');
  },
  methods: {
    setOrganType(value) {
      if (value !== 'C008700010') {
        this.organTypeEtc = '';
      }
    },
    cancel() {
      this.$store.dispatch('popup/popupOpen', { contents: this.dataObject.customCancel, params: { studentId: this.dataObject.studentId, businessDivision: this.dataObject.businessDivision } });
    },
    save() {
      const validData = ['organType'];
      const validTitle = ['기관유형'];
      this.$validate(validData).then(success => {
        if (success) {
          this.$store.commit('loading', true);
          const request = Hospital.infoAgreeDirectRegist;
          request({
            studentId: this.dataObject.studentId,
            businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
            organType: this.organType,
            organTypeEtc: this.organTypeEtc,
          }).then(res => {
            this.$store.commit('loading', false);
            if (res && res.data.rt === 200) {
              this.$alert('업로드되었습니다.', '알림', 'success').then(() => {
                this.$store.dispatch('popup/popupClose');
                this.$store.commit('update');
              });
            } else {
              if (res.data.rt === 400) {
                this.$alert(res.data.rtMsg, '알림', 'error');
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            }
          });
        } else {
          this.validError(validData, validTitle);
        }
      });
    },
    validError(validData, validTitle) {
      let errorMsg = '';
      validData.forEach((item, index) => {
        if (this.validation.hasError(validData[index])) {
          if (errorMsg !== '') {
            errorMsg += '<br/>';
          }
          errorMsg += '<b>' + validTitle[index] + '</b> : ' + this.validation.firstError(validData[index]);
        }
      });
      this.$alert('', '알림', 'warning', { html: errorMsg });
    },
  },
};
</script>

<style scoped lang="scss"></style>
