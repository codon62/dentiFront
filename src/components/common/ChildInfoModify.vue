<template>
  <div class="popup_content">
    <v-popuptitle :message="dataObject.studentId ? '정보 수정' : '학생 정보 등록'" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp4 fwb">제공된 항목</p>
      <div class="row flex_set mt30">
        <v-popupinput title="검진 유형" size="m" value="아동 치과주치의" is-readonly="true"></v-popupinput>
        <v-popupinput v-if="!hcAndCt" title="소속" size="m" :value="studentInfo.centerName.value" divclass="ml10" :is-readonly="true"></v-popupinput>
        <v-popupinput v-if="!hcAndCt && isModify" title="학생명" size="m" :value="studentInfo.studentName.value" divclass="ml10" :is-readonly="true"></v-popupinput>
      </div>
      <div class="comm__line mt30"></div>
      <p class="commp2 fwb mt30">
        필수 추가 기입 항목
        <span class="c_red">*</span>
      </p>
      <div v-if="!isModify && userOrganTargetType === 'CT'" class="row flex_set mt20">
        <div class="flex_item flex_size_m">
          <p class="commp fwb">
            지역구
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <select class="comm_select" v-model="centerHealthCareCode" @change="setCenterList($event.target.value)">
              <option value="">지역구</option>
              <option v-for="item in healthCareList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
            </select>
          </div>
        </div>
      </div>
      <div v-if="hcAndCt" class="row flex_set mt20">
        <div class="flex_item flex_size_m4">
          <p class="commp fwb">
            시설(센터)명
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <select class="comm_select" v-model="centerId" @change="setCenterInfo($event.target.value)">
              <option value="">시설(센터)명</option>
              <option v-for="item in centerList" :key="item.centerId" :value="item.centerId">{{ item.centerName }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row flex_set mt20 flex_base">
        <div v-if="!isModify || hcAndCt" class="flex_item">
          <p class="commp fwb">
            {{ studentInfo.studentName.label }}
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10 wid345">
            <input type="text" class="comm_put" :value="studentInfo.studentName.value" placeholder="성명을 입력해 주세요." @input="DATA_SET({ studentName: $event.target.value.trim() })" />
          </div>
        </div>
        <div class="flex_item" :class="{ ml20: !dataObject.studentId || hcAndCt }">
          <p class="commp fwb">
            {{ studentInfo.studentBirth.label }}
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10 wid345">
            <input type="number" class="comm_put" :value="studentInfo.studentBirth.value" placeholder="생년월일을 입력해 주세요.(8자리)" @input="isNumber($event, 'studentBirth')" />
          </div>
          <p v-if="isModify && !hcAndCt" class="mt10 c_red scommp">※ 통보서 작성 후에는 해당정보를 수정할 수 없습니다.</p>
          <p v-else class="mt10 c_red scommp">※ 8자리 생년월일을 입력해 주세요 (20010101)</p>
        </div>
      </div>
      <template v-if="schoolRequired && studentInfo.studentDuplicable.value !== 'N'">
        <div v-if="userOrganTargetType !== 'SC'" class="row flex_set mt20">
          <div class="flex_item flex_size_m">
            <p class="commp fwb">
              학교 정보
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <select class="comm_select" v-model="schoolHealthCareCode" @change="setSchoolList($event.target.value)">
                <option value="">지역구</option>
                <option v-for="item in healthCareList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row flex_set">
          <div class="flex_item flex_size_m">
            <div class="m__putbox mt10">
              <select class="comm_select" v-model="schoolId" @change="setSchoolInfo($event.target.value)">
                <option value="">학교</option>
                <option v-for="item in schoolList" :key="item.schoolId" :value="item.schoolId">{{ item.schoolName }}</option>
              </select>
            </div>
          </div>
          <fragment v-if="!isSchoolOutside">
            <div class="flex_item flex_size_s ml10">
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
              <div class="m__putbox mt10">
                <input type="text" class="comm_put" :value="studentInfo.studentToSchoolGrade2.value" placeholder="반" @input="DATA_SET({ studentToSchoolGrade2: $event.target.value })" />
              </div>
            </div>
            <div class="flex_item flex_size_s ml5">
              <div class="m__putbox mt10">
                <input type="number" class="comm_put" :value="studentInfo.studentToSchoolGrade3.value" placeholder="번호" @input="isNumber($event, 'studentToSchoolGrade3')" />
              </div>
            </div>
          </fragment>
        </div>
      </template>
      <div v-if="schoolRequired" class="flex_item">
        <div class="check_set">
          <div class="d_inblock hei100 mt10">
            <input
              id="alarmTypeY"
              type="checkbox"
              :value="'Y'"
              :checked="studentInfo.studentDuplicable.value === 'N'"
              name="alarmType"
              class="blind"
              @change="DATA_SET({ studentDuplicable: $event.target.checked ? 'N' : 'Y' })"
            />
            <label for="alarmTypeY">
              <span class="icon"></span>
              <span class="label_t">중복 검진 대상자가 아닌 경우</span>
            </label>
          </div>
        </div>
        <p class="mt10 c_red scommp">※ 체크할 경우 학생치과주치의/학생구강검진 중복 검진 대상자로 등록 불가</p>
      </div>

      <div class="row flex_set mt20 flex_base">
        <div class="flex_item flex_size_m4">
          <p class="commp fwb">
            {{ studentInfo.studentTel.label }}
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10 wid345">
            <input type="number" class="comm_put" :value="studentInfo.studentTel.value" placeholder="연락처를 입력해 주세요.(01012345678)" @input="isNumber($event, 'studentTel')" />
          </div>
        </div>
        <div class="flex_item flex_size_m4 ml20">
          <p class="commp fwb">{{ studentInfo.studentTel2.label }}</p>
          <div class="m__putbox mt10 wid345">
            <input type="number" class="comm_put" :value="studentInfo.studentTel2.value" placeholder="추가 연락처를 입력해 주세요.(01012345678)" @input="isNumber($event, 'studentTel2')" />
          </div>
        </div>
      </div>
      <div class="row flex_set mt30">
        <div class="flex_item">
          <p class="commp fwb">
            {{ studentInfo.studentInsurance.label }}
          </p>
          <div class="comm_radio m__putbox mt10">
            <div v-for="(item, key) in studentInsurance" :key="item" class="radio_box d_inblock hei100" :class="{ ml20: key !== 'N' }">
              <input
                :id="'ins_' + key"
                type="radio"
                :value="key"
                :checked="studentInfo.studentInsurance.value === key"
                name="ins"
                class="blind"
                @change="DATA_SET({ studentInsurance: $event.target.value })"
              />
              <label :for="'ins_' + key">
                <span class="icon"></span>
                <span class="label_t">{{ item }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="flex_item ml30">
          <p class="commp fwb">
            {{ studentInfo.studentGender.label }}
            <span class="c_red">*</span>
          </p>
          <div class="comm_radio m__putbox mt10">
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
      <v-popupconfirm :message="isModify ? '수정' : '등록'" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import Common from '@/apis/Common';
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
      schoolId: '',
      fullSchoolList: [],
      schoolList: [],
      centerId: '',
      fullCenterList: [],
      centerList: [],
      centerHealthCareCode: '',
      schoolHealthCareCode: '',
      healthCareList: [],
      isSchoolOutside: false,
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId', 'userOrganTargetName', 'userOrganTargetType', 'districtCode']),
    ...mapState('status', ['studentInsurance', 'studentGender']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue', 'codeToValueList']),
    isModify() {
      return !!this.dataObject.studentId;
    },
    schoolRequired() {
      return this.districtCodeFirst === 'A' && (!this.isModify || this.hcAndCt);
    },
    hcAndCt() {
      return ['HC', 'CT'].indexOf(this.userOrganTargetType) !== -1;
    },
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
  },
  validators: {
    centerId: value => {
      return Validator.value(value).required();
    },
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
    'studentInfo.studentName.value': value => {
      return Validator.value(value).required();
    },
    schoolId: value => {
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
  async created() {
    this.$store.commit('student/resetStudentInfo');
    if (this.hcAndCt) {
      await Common.centerList({ districtCode: this.districtCode }).then(res => {
        if (res && res.data.rt === 200) {
          if (this.userOrganTargetType === 'HC') {
            this.centerList = res.data.centerList;
          } else {
            this.fullCenterList = res.data.centerList;
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
    if ((!this.isModify && this.userOrganTargetType === 'CT') || this.schoolRequired) {
      await Common.healthCareList({ districtCode: this.districtCodeFirst }).then(res => {
        if (res && res.data.rt === 200) {
          this.healthCareList = res.data.healthCareList;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
      if (this.schoolRequired) {
        await Common.schoolList({ districtCode: this.districtCodeFirst }).then(res => {
          if (res && res.data.rt === 200) {
            this.fullSchoolList = this.codeToValueList(res.data.schoolList);
          } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        });
      }
    }
    if (this.isModify) {
      // 학생 정보 수정
      Hospital.studentInfo({ studentId: this.dataObject.studentId }).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
          res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
          res.data.studentInfo.studentDuplicable = this.codeToValue(res.data.studentInfo.studentDuplicable);
          // code convert end
          this.centerHealthCareCode = res.data.studentInfo.centerDistrictCode ?? '';
          this.schoolHealthCareCode = res.data.studentInfo.schoolDistrictCode ?? '';

          if (this.hcAndCt) {
            if (this.schoolHealthCareCode) {
              this.setSchoolList(this.schoolHealthCareCode);
              this.setSchoolInfo(res.data.studentInfo.schoolId);
            }
            if (this.userOrganTargetType === 'CT') {
              this.setCenterList(this.centerHealthCareCode);
            }
          }
          this.setCenterInfo(res.data.studentInfo.centerId);

          this.DATA_SET(res.data.studentInfo);
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    } else {
      // 학생 신규 등록
      if (this.userOrganTargetType === 'CE') {
        this.setCenterInfo(this.userOrganTargetId);
        this.DATA_SET({ centerId: this.userOrganTargetId, centerName: this.userOrganTargetName });
      }
    }
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
    setCenterList(districtCode) {
      this.setCenterInfo(''); // 센터 정보 초기화
      this.centerList = districtCode ? this.fullCenterList.filter(center => center.districtCode.startsWith(districtCode)) : [];
    },
    setCenterInfo(centerId) {
      this.centerId = centerId ?? '';
    },
    setSchoolList(districtCode) {
      this.setSchoolInfo(''); // 학교 정보 초기화
      this.schoolList = districtCode ? this.fullSchoolList.filter(school => school.districtCode.startsWith(districtCode)) : [];
    },
    setSchoolInfo(schoolId) {
      const schoolInfo = this.schoolList.find(school => school.schoolId === parseInt(schoolId));
      this.schoolId = schoolId ? schoolId : '';
      this.isSchoolOutside = schoolInfo && schoolInfo.schoolType === 'E';
    },
    save() {
      let validData = ['centerId', 'studentBirth', 'studentTel', 'studentTel2', 'studentGender', 'studentName'];
      if ((!this.dataObject.studentId || this.hcAndCt) && this.districtCodeFirst === 'A' && this.studentInfo.studentDuplicable.value !== 'N') {
        validData.push('schoolId');
        if (!this.isSchoolOutside) {
          validData.push('studentToSchoolGrade1', 'studentToSchoolGrade2', 'studentToSchoolGrade3');
        }
      }
      let validTarget = [];
      validData.forEach(item => {
        validTarget.push(['schoolId', 'centerId'].includes(item) ? item : 'studentInfo.' + item + '.value');
      });
      this.$validate(validTarget).then(success => {
        if (success) {
          let form = {
            businessDivision: this.valueToCode('C0003', 'C'),
            studentName: this.studentInfo.studentName.value,
            studentGender: this.valueToCode('C0005', this.studentInfo.studentGender.value),
            studentBirth: this.studentInfo.studentBirth.value,
            studentTel: this.studentInfo.studentTel.value,
            studentTel2: this.studentInfo.studentTel2.value,
            centerId: this.centerId,
            studentInsurance: this.valueToCode('C0013', this.studentInfo.studentInsurance.value),
            studentDuplicable: this.valueToCode('C0030', this.studentInfo.studentDuplicable.value === 'N' ? 'N' : 'Y'),
            schoolId: this.schoolId,
          };
          if (this.studentInfo.studentDuplicable.value === 'N') {
            form.schoolId = 0; // 학교 미변경
          } else if (!this.isSchoolOutside) {
            form.studentToSchoolGrade1 = this.studentInfo.studentToSchoolGrade1.value;
            form.studentToSchoolGrade2 = this.studentInfo.studentToSchoolGrade2.value;
            form.studentToSchoolGrade3 = this.studentInfo.studentToSchoolGrade3.value;
          }
          let request;
          if (this.dataObject.studentId) {
            // 학생 정보 수정
            form.studentId = this.dataObject.studentId;
            request = Management.studentModify;
          } else {
            // 학생 신규 등록
            request = Management.studentRegister;
          }
          request(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert((this.dataObject.studentId ? '수정' : '등록') + '되었습니다.', '알림', 'success').then(() => {
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
          errorMsg += '<b>' + (item === 'schoolId' ? '학교' : this.studentInfo[item].label) + '</b> : ' + this.validation.firstError(validTarget[index]);
        }
      });
      this.$alert('', '알림', 'warning', { html: errorMsg });
    },
  },
};
</script>
