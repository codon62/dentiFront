<template>
  <div class="popup_content">
    <v-popuptitle message="학생 정보 수정" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp4 fwb">제공된 항목</p>
      <div class="row flex_set mt30">
        <v-popupinput v-if="!divJoin('S')" :title="`${examTitle} 유형`" size="m" :value="divName(dataObject.businessDivision, true)" divclass="mr10" :is-readonly="true"></v-popupinput>
        <v-popupinput title="학교 정보" size="m" :value="studentInfo.schoolName.value ? studentInfo.schoolName.value : '학교밖'" :is-readonly="true"></v-popupinput>
        <v-popupinput v-if="userOrganTargetType !== 'SC'" title="학생명" size="m" :value="studentInfo.studentName.value" divclass="ml10" :is-readonly="true"></v-popupinput>
      </div>
      <div v-if="userOrganTargetType === 'HP' && !['B', 'G'].includes(districtCodeFirst) && studentInfo.studentToSchoolGrade1.value" class="row flex_set mt20">
        <v-popupinput title="학년" size="m" :value="studentInfo.studentToSchoolGrade1.value" :is-readonly="true"></v-popupinput>
        <v-popupinput title="반" size="m" :value="studentInfo.studentToSchoolGrade2.value" divclass="ml10" :is-readonly="true"></v-popupinput>
        <v-popupinput title="번호" size="m" :value="studentInfo.studentToSchoolGrade3.value" divclass="ml10" :is-readonly="true"></v-popupinput>
      </div>
      <div class="comm__line mt30"></div>
      <p class="commp2 fwb mt30">
        추가 기입 항목
        <span class="c_red">*</span>
      </p>
      <div v-if="divJoin('S')" class="row flex_set mt20">
        <div class="flex_item">
          <p class="commp fwb">
            검진 유형
            <span class="c_red">*</span>
          </p>
          <div class="comm_radio mt10">
            <div v-for="(item, key) in businessDivisionSpc.value" :key="item" class="radio_box d_inblock hei100" :class="{ ml20: key !== 'F' }">
              <input
                :id="'div_' + key"
                type="radio"
                :value="key"
                :checked="modifyBusinessDivision === key"
                name="div"
                class="blind"
                :disabled="(userOrganTargetType === 'HP' && !(!dataObject.billStatus || dataObject.billStatus === 'R')) || (userOrganTargetType !== 'HP' && dataObject.notificationId)"
                @change="modifyBusinessDivision = key"
              />
              <label :for="'div_' + key">
                <span class="icon"></span>
                <span class="label_t">{{ item }}</span>
              </label>
            </div>
          </div>
          <p v-if="userOrganTargetType === 'HP' && (!dataObject.billStatus || dataObject.billStatus === 'R')" class="mt10 c_red scommp">※ 검진 유형 변경 시, 작성중인 통보서가 초기화됩니다.</p>
          <p v-else-if="userOrganTargetType === 'HP'" class="mt10 c_red scommp">※ 청구중이거나 처리완료된 경우 검진 유형을 변경할 수 없습니다.</p>
          <p v-else-if="dataObject.notificationId" class="mt10 c_red scommp">※ 병원에서 작성중이거나 작성된 통보서가 존재하여 검진 유형을 변경할 수 없습니다.</p>
        </div>
      </div>
      <div v-if="userOrganTargetType === 'HP'" class="row flex_set flex_base mt20">
        <div class="flex_item">
          <p class="commp fwb">
            {{ studentInfo.studentBirth.label }}
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10 wid345">
            <input type="number" class="comm_put" :value="studentInfo.studentBirth.value" placeholder="생년월일을 입력해 주세요.(8자리)" @input="isNumber($event, 'studentBirth')" />
          </div>
          <!-- <p class="mt10 c_red scommp">※ 통보서 {{ districtCodeFirst === 'C' ? '청구중에는' : '작성 후에는' }}  해당정보를 수정할 수 없습니다.</p> -->
          <p class="mt10 c_red scommp">※ 8자리 생년월일을 입력해 주세요 (20010101)</p>
        </div>
      </div>
      <div class="row flex_set mt20 flex_base">
        <div v-if="userOrganTargetType === 'HP'" class="flex_item flex_size_m4">
          <p class="commp fwb">
            {{ studentInfo.studentTel.label }}
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10 wid345">
            <input type="number" class="comm_put" :value="studentInfo.studentTel.value" placeholder="연락처를 입력해 주세요.(01012345678)" @input="isNumber($event, 'studentTel')" />
          </div>
        </div>
        <div class="flex_item flex_size_m4" :class="{ ml20: userOrganTargetType === 'HP' }">
          <p class="commp fwb">추가 연락처</p>
          <div class="m__putbox mt10 wid345">
            <input type="number" class="comm_put" :value="studentInfo.studentTel2.value" placeholder="추가 연락처를 입력해 주세요.(01012345678)" @input="isNumber($event, 'studentTel2')" />
          </div>
        </div>
      </div>
      <div v-if="userOrganTargetType === 'SC' || ['B', 'G'].includes(districtCodeFirst)" class="row flex_set mt20">
        <div class="flex_item flex_size_s">
          <p class="commp fwb">
            학년
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <input
              type="number"
              class="comm_put"
              :value="studentInfo.studentToSchoolGrade1.value"
              placeholder="학년"
              @input="
                isNumber($event, 'studentToSchoolGrade1', {
                  min: 1,
                  max: 6,
                  maxlength: 1,
                })
              "
            />
          </div>
        </div>
        <div class="flex_item flex_size_s ml5">
          <p class="commp fwb">
            반
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <input type="text" class="comm_put" :value="studentInfo.studentToSchoolGrade2.value" placeholder="반" @input="DATA_SET({ studentToSchoolGrade2: $event.target.value })" />
          </div>
        </div>
        <div class="flex_item flex_size_s ml5">
          <p class="commp fwb">
            번호
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <input type="number" class="comm_put" :value="studentInfo.studentToSchoolGrade3.value" placeholder="번호" @input="isNumber($event, 'studentToSchoolGrade3')" />
          </div>
        </div>
      </div>
      <div class="row flex_set mt20 flex_base">
        <div v-if="userOrganTargetType === 'SC'" class="flex_item flex_size_m4 mr20">
          <p class="commp fwb">
            {{ studentInfo.studentName.label }}
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10 wid345">
            <input type="text" class="comm_put" :value="studentInfo.studentName.value" placeholder="학생 이름을 입력해 주세요." @input="DATA_SET({ studentName: $event.target.value })" />
          </div>
        </div>
        <div class="flex_item">
          <p class="commp fwb">
            {{ studentInfo.studentGender.label }}
            <span class="c_red">*</span>
          </p>
          <div class="comm_radio mt10">
            <div v-for="(item, key) in studentGender" :key="item" class="radio_box d_inblock hei100" :class="{ ml20: key !== 'M' }">
              <input
                :id="'gen_' + key"
                type="radio"
                :value="key"
                :checked="studentInfo.studentGender.value === key"
                name="gen"
                class="blind"
                @change="DATA_SET({ studentGender: $event.target.value })"
              />
              <label :for="'gen_' + key">
                <span class="icon"></span>
                <span class="label_t">{{ item }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="comm__line mt30"></div>
      <v-popupconfirm :message="dataObject.studentId ? '수정' : '등록'" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import Hospital from '@/apis/Hospital';
import Management from '@/apis/Management';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import popupInput from '@/components/popup/PopupInput.vue';
import { mapGetters, mapMutations, mapState } from 'vuex';

Vue.use(SimpleVueValidation);
SimpleVueValidation.extendTemplates({
  required: '필수 입력 항목입니다.',
  integer: '잘못된 입력값입니다.',
  length: '잘못된 입력값입니다.',
  minLength: '잘못된 입력값입니다.',
  maxLength: '잘못된 입력값입니다.',
});
const Validator = SimpleVueValidation.Validator;

export default {
  props: ['dataObject'],
  data() {
    return {
      modifyBusinessDivision: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'userOrganTargetId']),
    ...mapState('status', ['studentGender', 'businessDivisionSpc']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName', 'examTitle', 'grade1ValidMsg']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode']),
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
  },
  validators: {
    'studentInfo.studentBirth.value': value => {
      return Validator.value(value).required().integer().length(8);
    },
    'studentInfo.studentTel.value': value => {
      return Validator.value(value).required().integer().minLength(10).maxLength(11);
    },
    'studentInfo.studentTel2.value': value => {
      return Validator.value(value).integer().minLength(10).maxLength(11);
    },
    'studentInfo.studentGender.value': value => {
      return Validator.value(value).required();
    },
    'studentInfo.studentToSchoolGrade1.value': value => {
      return Validator.value(value).required().integer();
    },
    'studentInfo.studentToSchoolGrade2.value': value => {
      return Validator.value(value).required();
    },
    'studentInfo.studentToSchoolGrade3.value': value => {
      return Validator.value(value).required().integer();
    },
  },
  created() {
    this.$store.commit('student/resetStudentInfo');
    this.modifyBusinessDivision = this.dataObject.businessDivision;
    Hospital.studentInfo({ studentId: this.dataObject.studentId }).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
        res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
        res.data.studentInfo.studentDuplicable = this.codeToValue(res.data.studentInfo.studentDuplicable);
        // code convert end
        this.DATA_SET(res.data.studentInfo);
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    ...mapMutations('student', ['DATA_SET']),
    isNumber(e, key, options) {
      let value = e.target.value.replace(/[^0-9]/g, '');
      value = value.length > options?.maxlength ? value.charAt(value.length - 1) : value;
      value = value < options?.min || value > options?.max ? null : value;
      if (key) this.DATA_SET({ [key]: value });
      e.target.value = value;
    },
    save() {
      let validData = ['studentTel2', 'studentGender'];
      if (this.userOrganTargetType === 'HP') {
        validData.push('studentBirth', 'studentTel');
      }
      if (this.userOrganTargetType === 'SC' || ['B', 'G'].includes(this.districtCodeFirst)) {
        validData.push('studentToSchoolGrade1', 'studentToSchoolGrade2', 'studentToSchoolGrade3');
      }
      let validTarget = [];
      validData.forEach(item => {
        validTarget.push('studentInfo.' + item + '.value');
      });
      this.$validate(validTarget).then(success => {
        if (success) {
          if (this.studentInfo.schoolName.value !== '학교밖') {
            const grade1ValidMsg = this.grade1ValidMsg(this.modifyBusinessDivision, this.studentInfo.studentToSchoolGrade1.value);
            if (grade1ValidMsg) {
              this.$alert(grade1ValidMsg, '알림', 'warning');
              return false;
            }
          }
          let form = {
            businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
            modifyBusinessDivision: this.valueToCode('C0003', this.modifyBusinessDivision),
            studentId: this.dataObject.studentId,
            studentName: this.studentInfo.studentName.value,
            studentGender: this.valueToCode('C0005', this.studentInfo.studentGender.value),
            studentBirth: this.studentInfo.studentBirth.value,
            studentTel: this.studentInfo.studentTel.value,
            studentTel2: this.studentInfo.studentTel2.value,
            schoolId: this.studentInfo.schoolId.value,
            studentToSchoolGrade1: this.studentInfo.studentToSchoolGrade1.value,
            studentToSchoolGrade2: this.studentInfo.studentToSchoolGrade2.value,
            studentToSchoolGrade3: this.studentInfo.studentToSchoolGrade3.value,
            centerId: this.studentInfo.centerId.value,
          };
          if (this.studentInfo.studentInsurance.value) {
            form.studentInsurance = this.valueToCode('C0013', this.studentInfo.studentInsurance.value);
          }
          Management.studentModify(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('수정되었습니다.', '알림', 'success').then(() => {
                this.$store.dispatch('popup/popupClose');
                this.$store.commit('update');
              });
            } else if (res.data.rt === 422) {
              this.$alert(res.data.rtMsg, '알림', 'error');
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        } else {
          this.validError(validData, validTarget);
        }
      });
    },
    validError(validData, validTarget) {
      let errorMsg = '';
      validData.forEach((item, index) => {
        if (this.validation.hasError(validTarget[index])) {
          if (errorMsg !== '') {
            errorMsg += '<br/>';
          }
          errorMsg += '<b>' + this.studentInfo[item].label + '</b> : ' + this.validation.firstError(validTarget[index]);
        }
      });
      this.$alert('', '알림', 'warning', { html: errorMsg });
    },
  },
};
</script>
