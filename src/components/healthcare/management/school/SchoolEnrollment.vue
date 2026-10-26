<template>
  <div class="popup_content">
    <v-popuptitle message="학교 등록" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp4 fwb">학교 정보</p>

      <div v-if="districtCodeFirst === 'A'" class="row flex_set mt20 flex_base">
        <div class="flex_item">
          <p class="commp fwb">
            검진 유형
            <span class="c_red">*</span>
          </p>
          <div class="check_set mb10">
            <div v-for="(item, key) in divType" :key="key" class="d_inblock hei100 mt10" :class="{ ml20: key !== 'F' }">
              <input
                :id="'divType' + key"
                type="checkbox"
                :value="key"
                :checked="schoolInfo['schoolBusinessDivision' + key] === 'Y'"
                name="divType"
                class="blind"
                @change="schoolInfo['schoolBusinessDivision' + key] = $event.target.checked ? 'Y' : 'N'"
              />
              <label :for="'divType' + key">
                <span class="icon"></span>
                <span class="label_t">{{ item }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div v-if="firstHelList.length || secondHelList.length" class="row flex_set mt20">
        <div v-if="firstHelList.length" class="flex_item flex_size_m">
          <p class="commp fwb">
            지역구
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <select class="comm_select" v-model="firstDistrictCode" @change="changeFirstHelList($event.target.value)">
              <option value="">{{ districtCodeFirst === 'C' ? '시/군' : '지역구' }}</option>
              <option v-for="item in firstHelList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
            </select>
          </div>
        </div>
        <div v-if="secondHelList.length" class="flex_item flex_size_m" :class="{ ml10: firstHelList.length }">
          <p v-if="!firstHelList.length" class="commp fwb">
            지역구
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <select class="comm_select" v-model="schoolInfo.districtCode">
              <option value="">지역구</option>
              <option v-for="item in secondHelList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="districtCodeFirst === 'C'" class="row flex_set mt20 flex_base">
        <div class="flex_item">
          <p class="commp fwb">
            학교 구분
            <span class="c_red">*</span>
          </p>
          <div class="comm_radio m__putbox mt10">
            <div v-for="(item, key) in schoolTypeNotNull.value" :key="key" class="radio_box d_inblock hei100 mt10" :class="{ ml20: key !== 'A' }">
              <input
                :id="'schoolType' + key"
                type="radio"
                :value="key"
                :checked="schoolInfo.schoolType === key"
                name="schoolType"
                class="blind"
                @change="schoolInfo.schoolType = $event.target.value"
              />
              <label :for="'schoolType' + key">
                <span class="icon"></span>
                <span class="label_t">{{ item }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="schoolInfo.schoolName" title="학교명" size="s2" placeholder="학교명 ('초등학교' 제외)" :required="true"></v-popupinput>
        <v-popupinput title="학교" size="s" value="초등학교" :isReadonly="true"></v-popupinput>
        <v-popupinput v-model="schoolInfo.schoolTel" divclass="ml20" title="학교 연락처" type="number" size="m" placeholder="학교 연락처를 입력해 주세요." :required="true"></v-popupinput>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="schoolInfo.userOrganManagerName" title="보건교사명" size="m" placeholder="보건교사명을 입력해 주세요." :required="true"></v-popupinput>
        <v-popupinput v-model="schoolInfo.userOrganManagerTel" divclass="ml20" title="보건교사 연락처" type="number" size="m" placeholder="보건교사 연락처를 입력해 주세요."></v-popupinput>
        <div class="flex_item flex_size_m5 ml30">
          <p class="commp fwb">
            알림톡 수신 여부
            <span class="c_red">*</span>
          </p>
          <div class="comm_radio m__putbox mt10">
            <div v-for="(item, key) in userOrganManagerAlarm.value" :key="key" class="radio_box d_inblock hei100 mt10" :class="{ ml20: key !== 'Y' }">
              <input
                :id="'orm_' + key"
                type="radio"
                :value="key"
                :checked="schoolInfo.userOrganManagerAlarm === key"
                name="userOrganManagerAlarm"
                class="blind"
                @change="schoolInfo.userOrganManagerAlarm = $event.target.value"
              />
              <label :for="'orm_' + key">
                <span class="icon"></span>
                <span class="label_t">{{ item }}</span>
              </label>
            </div>
          </div>
        </div>
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
      schoolInfo: {
        districtCode: '',
        schoolType: '',
        schoolName: '',
        schoolTel: '',
        schoolBusinessDivisionF: '',
        schoolBusinessDivisionE: '',
        userOrganManagerName: '',
        userOrganManagerTel: '',
        userOrganManagerAlarm: '',
      },
      firstDistrictCode: '',
      firstHelList: [],
      fullSecondHelList: [],
      secondHelList: [],
    };
  },
  computed: {
    ...mapState('user', ['districtCode', 'userOrganTargetType']),
    ...mapState('status', ['userOrganManagerAlarm', 'schoolTypeNotNull', 'businessDivisionSpc']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode']),
    divType() {
      return this.businessDivisionSpc.value;
    },
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
  },
  validators: {
    'schoolInfo.districtCode': value => {
      return Validator.value(value).required();
    },
    'schoolInfo.schoolType': value => {
      return Validator.value(value).required();
    },
    'schoolInfo.schoolName': value => {
      return Validator.value(value).required();
    },
    'schoolInfo.schoolTel': value => {
      return Validator.value(value).required().integer().minLength(7).maxLength(11);
    },
    'schoolInfo.userOrganManagerName': value => {
      return Validator.value(value).required();
    },
    'schoolInfo.userOrganManagerTel': value => {
      return Validator.value(value).integer().minLength(10).maxLength(11);
    },
    'schoolInfo.userOrganManagerAlarm': value => {
      return Validator.value(value).required();
    },
  },
  async created() {
    if (this.districtCodeFirst !== 'C') {
      this.schoolInfo.schoolType = 'A';
    }
    if (this.userOrganTargetType === 'CT') {
      await Common.healthCareList({ districtCode: this.districtCodeFirst }).then(res => {
        if (res && res.data.rt === 200) {
          this.firstHelList = res.data.healthCareList;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
    if (this.districtCodeFirst === 'C' || this.districtCodeFirst === 'J') {
      await Common.healthCareSecondList({ districtCode: this.userOrganTargetType === 'HC' ? this.districtCode : this.districtCodeFirst }).then(res => {
        if (res && res.data.rt === 200) {
          if (this.firstHelList.length) {
            this.fullSecondHelList = res.data.healthCareList;
          } else {
            this.secondHelList = res.data.healthCareList;
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
    if (!this.firstHelList.length && !this.fullSecondHelList.length && !this.secondHelList.length) {
      this.schoolInfo.districtCode = this.districtCode;
    }
  },
  methods: {
    changeFirstHelList(districtCode) {
      if (this.fullSecondHelList.length) {
        this.setSecondHelList(districtCode);
      }
      this.schoolInfo.districtCode = !this.secondHelList.length ? districtCode : '';
    },
    setSecondHelList(districtCode) {
      this.secondHelList = districtCode ? this.fullSecondHelList.filter(hel => hel.districtCode.startsWith(districtCode)) : [];
    },
    save() {
      if (this.districtCodeFirst === 'A') {
        if (this.schoolInfo.schoolBusinessDivisionF !== 'Y' && this.schoolInfo.schoolBusinessDivisionE !== 'Y') {
          this.$alert('검진 유형을 선택해 주세요.', '알림', 'warning');
          return false;
        }
      }
      let validData = [
        'schoolInfo.districtCode',
        'schoolInfo.schoolType',
        'schoolInfo.schoolName',
        'schoolInfo.schoolTel',
        'schoolInfo.userOrganManagerName',
        'schoolInfo.userOrganManagerTel',
        'schoolInfo.userOrganManagerAlarm',
      ];
      let validTitle = ['지역구', '학교 구분', '학교명', '학교 연락처', '보건교사명', '보건교사 연락처', '알림톡 수신 여부'];
      this.$validate(validData).then(success => {
        if (success) {
          let form = Object.assign({}, this.schoolInfo);
          if (this.districtCodeFirst === 'A') {
            if (!form.schoolBusinessDivisionF) {
              form.schoolBusinessDivisionF = 'N';
            }
            if (!form.schoolBusinessDivisionE) {
              form.schoolBusinessDivisionE = 'N';
            }
          }
          // code convert
          form.schoolType = this.valueToCode('C0022', form.schoolType);
          form.userOrganManagerAlarm = this.valueToCode('C0018', form.userOrganManagerAlarm);
          form.schoolBusinessDivisionF = this.valueToCode('C0008', form.schoolBusinessDivisionF);
          form.schoolBusinessDivisionE = this.valueToCode('C0008', form.schoolBusinessDivisionE);
          // code convert end
          Management.schoolRegist(form).then(res => {
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
