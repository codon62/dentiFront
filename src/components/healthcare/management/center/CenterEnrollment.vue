<template>
  <div class="popup_content">
    <v-popuptitle message="센터 등록" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp4 fwb">센터 정보</p>

      <div v-if="healthCareList.length" class="row flex_set mt20">
        <div class="flex_item flex_size_m">
          <p class="commp fwb">
            지역구
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <select class="comm_select" v-model="centerInfo.districtCode">
              <option value="">{{ districtCodeFirst === 'C' ? '시/군' : '지역구' }}</option>
              <option v-for="item in healthCareList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="centerInfo.centerName" title="센터명 (아이디)" size="m" placeholder="센터명을 입력해 주세요." :required="true"></v-popupinput>
        <v-popupinput v-model="centerInfo.centerTel" divclass="ml20" title="센터 연락처" type="number" size="m" placeholder="센터 연락처를 입력해 주세요."></v-popupinput>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="centerInfo.centerAddress" title="센터 주소" size="m2" placeholder="센터 주소를 입력해 주세요."></v-popupinput>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="centerInfo.userOrganManagerName" title="담당자명" size="m" placeholder="담당자명을 입력해 주세요."></v-popupinput>
        <v-popupinput v-model="centerInfo.userOrganManagerTel" divclass="ml20" title="담당자 연락처" type="number" size="m" placeholder="담당자 연락처를 입력해 주세요."></v-popupinput>
      </div>
      <div class="comm__line mt30"></div>
      <v-popupconfirm message="등록" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import Common from '@/apis/Common';
import Management from '@/apis/Management';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import popupInput from '@/components/popup/PopupInput.vue';
import { mapGetters, mapState } from 'vuex';

Vue.use(SimpleVueValidation);
SimpleVueValidation.extendTemplates({
  required: '필수 입력 항목입니다.',
  integer: '잘못된 입력값입니다.',
  minLength: '잘못된 입력값입니다.',
  maxLength: '잘못된 입력값입니다.',
});
const Validator = SimpleVueValidation.Validator;

export default {
  props: ['dataObject'],
  data() {
    return {
      centerInfo: {
        districtCode: '',
        centerName: '',
        centerTel: '',
        centerAddress: '',
        userOrganManagerName: '',
        userOrganManagerTel: '',
      },
      healthCareList: [],
    };
  },
  computed: {
    ...mapState('user', ['districtCode', 'userOrganTargetType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
  },
  validators: {
    'centerInfo.districtCode': value => {
      return Validator.value(value).required();
    },
    'centerInfo.centerName': value => {
      return Validator.value(value).required();
    },
    'centerInfo.centerTel': value => {
      return Validator.value(value).integer().minLength(7).maxLength(11);
    },
    'centerInfo.userOrganManagerTel': value => {
      return Validator.value(value).integer().minLength(10).maxLength(11);
    },
  },
  async created() {
    if (this.userOrganTargetType === 'CT') {
      await Common.healthCareList({ districtCode: this.districtCodeFirst }).then(res => {
        if (res && res.data.rt === 200) {
          this.healthCareList = res.data.healthCareList;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    } else {
      this.centerInfo.districtCode = this.districtCode;
    }
  },
  methods: {
    save() {
      let validData = ['centerInfo.districtCode', 'centerInfo.centerName', 'centerInfo.centerTel', 'centerInfo.userOrganManagerTel'];
      let validTitle = ['지역구', '센터명', '센터 연락처', '담당자 연락처'];
      this.$validate(validData).then(success => {
        if (success) {
          Management.centerRegist(this.centerInfo).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('등록되었습니다.', '알림', 'success').then(() => {
                this.$store.dispatch('popup/popupClose');
                this.$store.commit('update');
              });
            } else {
              if (res.data.rt === 422) {
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
