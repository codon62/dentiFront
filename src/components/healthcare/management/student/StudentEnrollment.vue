<template>
  <div class="popup_content">
    <v-popuptitle :message="`학생 ${isModify ? '정보 수정' : '등록'}`" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <div v-if="!divJoin('S')">
        <p class="commp4 fwb">제공된 항목</p>
        <div class="row flex_set mt30">
          <v-popupinput :title="`${examTitle} 유형`" size="m" :value="divName(dataObject.businessDivision, true)" is-readonly="true"></v-popupinput>
        </div>
        <div class="comm__line mt30 mb30"></div>
      </div>
      <div v-if="districtCodeFirst === 'C'" class="mb15">
        <span class="commp4 fwb c_red">※ 경기도 외 전입 또는 신규 학생을 등록할 수 있습니다.</span>
      </div>
      <p class="commp2 fwb">
        필수 기입 항목
        <span class="c_red">*</span>
      </p>
      <div v-if="divJoin('S')" class="row flex_set mt20">
        <div class="flex_item">
          <p class="commp fwb">
            검진 유형
            <span class="c_red">*</span>
          </p>
          <div class="comm_radio mt10">
            <div
              v-for="(item, key) in districtCodeFirst === 'J' ? businessDivisionSpcJ.value : businessDivisionSpc.value"
              :key="item"
              class="radio_box d_inblock hei100"
              :class="{ ml20: key !== 'F' }"
            >
              <input :id="'div_' + key" type="radio" :value="key" :checked="modifyBusinessDivision === key" name="div" class="blind" @change="modifyBusinessDivision = key" />
              <label :for="'div_' + key">
                <span class="icon"></span>
                <span class="label_t">{{ item }}</span>
              </label>
            </div>
          </div>
          <p v-if="isModify" class="mt10 c_red scommp">※ 검진 유형 변경 시, 기존 통보서 및 비용 청구가 초기화됩니다.</p>
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
            <select class="comm_select" v-model="schoolDistrictCode" @change="setSchoolList($event.target.value)">
              <option value="">지역구</option>
              <option v-for="item in secondHelList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row flex_set mt20 flex_base">
        <div class="flex_item">
          <p class="commp fwb">
            {{ studentInfo.studentName.label }}
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10 wid345">
            <input type="text" class="comm_put" :value="studentInfo.studentName.value" placeholder="성명을 입력해 주세요." @input="DATA_SET({ studentName: $event.target.value.trim() })" />
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
      <div class="row flex_set mt20">
        <div v-if="userOrganTargetType !== 'SC'" class="flex_item flex_size_m">
          <p class="commp fwb">
            학교 정보
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <select class="comm_select" v-model="schoolId" @change="setSchoolInfo($event.target.value)">
              <option value="">학교</option>
              <option v-for="item in schoolList" :key="item.schoolId" :value="item.schoolId">{{ item.schoolName }}</option>
            </select>
          </div>
        </div>
        <fragment v-if="!isSchoolOutside">
          <div class="flex_item flex_size_s" :class="{ ml10: userOrganTargetType !== 'SC' }">
            <p v-if="userOrganTargetType === 'SC'" class="commp fwb">
              학생 정보
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <input
                type="number"
                class="comm_put"
                :class="{ read_put: dataObject.businessDivision === 'F1' }"
                :value="studentInfo.studentToSchoolGrade1.value"
                placeholder="학년"
                :readonly="dataObject.businessDivision === 'F1'"
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
      <div class="row flex_set mt20 flex_base">
        <div v-if="districtCodeFirst === 'D' && ['F', 'FY'].includes(dataObject.businessDivision)" class="flex_item flex_size_m4">
          <p class="commp fwb">
            {{ studentInfo.studentTel.label }}
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10 wid345">
            <input type="number" class="comm_put" :value="studentInfo.studentTel.value" placeholder="연락처를 입력해 주세요.(01012345678)" @input="isNumber($event, 'studentTel')" />
          </div>
        </div>
        <div v-else class="flex_item flex_size_m4">
          <p class="commp fwb">추가 연락처</p>
          <div class="m__putbox mt10 wid345">
            <input type="number" class="comm_put" :value="studentInfo.studentTel2.value" placeholder="추가 연락처를 입력해 주세요.(01012345678)" @input="isNumber($event, 'studentTel2')" />
          </div>
        </div>
      </div>
      <div v-if="requiredBirthAndTel || adminOrganType === 'AD'">
        <div class="comm__line mt30"></div>
        <p class="commp2 fwb mt30">
          추가 기입 항목
          <span v-if="requiredBirthAndTel" class="c_red">*</span>
        </p>
        <div class="row flex_set mt20 flex_base">
          <div class="flex_item">
            <p class="commp fwb">
              {{ studentInfo.studentBirth.label }}
              <span v-if="requiredBirthAndTel" class="c_red">*</span>
            </p>
            <div class="m__putbox mt10 wid345">
              <input type="number" class="comm_put" :value="studentInfo.studentBirth.value" placeholder="생년월일을 입력해 주세요.(8자리)" @input="isNumber($event, 'studentBirth')" />
            </div>
          </div>
          <div class="flex_item ml20">
            <p class="commp fwb">
              {{ studentInfo.studentTel.label }}
              <span v-if="requiredBirthAndTel" class="c_red">*</span>
            </p>
            <div class="m__putbox mt10 wid345">
              <input
                type="number"
                class="comm_put"
                :value="districtCodeFirst === 'D' && ['F', 'FY'].includes(dataObject.businessDivision) ? studentInfo.studentTel2.value : studentInfo.studentTel.value"
                placeholder="연락처를 입력해 주세요.(01012345678)"
                @input="isNumber($event, districtCodeFirst === 'D' && ['F', 'FY'].includes(dataObject.businessDivision) ? 'studentTel2' : 'studentTel')"
              />
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
      schoolDistrictCode: '',
      modifyBusinessDivision: '',
      fullSchoolList: [],
      schoolList: [],
      firstDistrictCode: '',
      firstHelList: [],
      fullSecondHelList: [],
      secondHelList: [],
      backup: {
        studentBirth: '',
        studentTel: '',
      },
      isSchoolOutside: false,
      requiredBirthAndTel: false,
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId', 'districtCode', 'userOrganTargetType', 'adminOrganType']),
    ...mapState('status', ['studentGender', 'businessDivisionSpc', 'businessDivisionSpcJ']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName', 'examTitle', 'grade1ValidMsg', 'districtInfo']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue', 'codeToValueList']),
    isModify() {
      return !!this.dataObject.studentId;
    },
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
  },
  validators: {
    schoolId: value => {
      return Validator.value(value).required();
    },
    schoolDistrictCode: value => {
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
    'studentInfo.studentToSchoolGrade1.value': value => {
      return Validator.value(value).required().integer();
    },
    'studentInfo.studentToSchoolGrade2.value': value => {
      return Validator.value(value).required();
    },
    'studentInfo.studentToSchoolGrade3.value': value => {
      return Validator.value(value).required().integer();
    },
    'studentInfo.studentGender.value': value => {
      return Validator.value(value).required();
    },
    'studentInfo.studentName.value': value => {
      return Validator.value(value).required();
    },
  },
  async created() {
    this.$store.commit('student/resetStudentInfo');
    this.modifyBusinessDivision = this.dataObject.businessDivision;
    if (this.userOrganTargetType !== 'SC') {
      const isHospitalContractDivE = this.userOrganTargetType === 'HP' && this.divJoin('E') && !this.divJoin('S') && this.dataObject.businessDivision === 'E';

      const request = isHospitalContractDivE ? Hospital.hospitalContractYSchoolList : Common.schoolList;
      let form = { districtCode: this.districtCodeFirst };
      if (isHospitalContractDivE) {
        form.hospitalId = this.userOrganTargetId;
      }

      await request(form).then(res => {
        if (res && res.data.rt === 200) {
          this.fullSchoolList = this.codeToValueList(res.data.schoolList);
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }

    if (['CT', 'HP'].includes(this.userOrganTargetType)) {
      await Common.healthCareList({ districtCode: this.districtCodeFirst }).then(res => {
        if (res && res.data.rt === 200) {
          this.firstHelList = res.data.healthCareList;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }

    if ((this.districtCodeFirst === 'C' && this.userOrganTargetType !== 'SC') || (this.districtCodeFirst === 'J' && this.userOrganTargetType !== 'SC')) {
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

    if (this.isModify) {
      // 학생 정보 수정
      Hospital.studentInfo({ studentId: this.dataObject.studentId }).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
          res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
          res.data.studentInfo.studentDuplicable = this.codeToValue(res.data.studentInfo.studentDuplicable);
          // code convert end
          this.DATA_SET(res.data.studentInfo);
          this.backup.studentBirth = res.data.studentInfo.studentBirth;
          this.backup.studentTel = res.data.studentInfo.studentTel;
          this.schoolDistrictCode = res.data.studentInfo.schoolDistrictCode;
          if (this.firstHelList.length) {
            this.firstDistrictCode = this.firstHelList.find(hel => this.schoolDistrictCode.startsWith(hel.districtCode)).districtCode;
            if (this.fullSecondHelList.length) {
              this.setSecondHelList(this.firstDistrictCode);
            }
          }

          if (this.userOrganTargetType !== 'SC') {
            this.setSchoolList(this.schoolDistrictCode);
          }
          this.setSchoolInfo(res.data.studentInfo.schoolId);
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    } else {
      // 학생 신규 등록
      if (this.dataObject.businessDivision === 'F1') {
        this.DATA_SET({ studentToSchoolGrade1: 1 });
      }
      if (!this.firstHelList.length && !this.fullSecondHelList.length && !this.secondHelList.length) {
        this.schoolDistrictCode = this.districtCode;
      }
      if (this.userOrganTargetType !== 'SC') {
        this.setSchoolList(this.schoolDistrictCode);
      } else {
        this.setSchoolInfo(this.userOrganTargetId);
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
    changeFirstHelList(districtCode) {
      const closeDistrict = {
        // 인천
        B0102: '동구',
        B0103: '미추홀구',
      };
      if (closeDistrict[districtCode]) {
        const healthCareName = this.firstHelList.find(hel => hel.districtCode === districtCode).healthCareName;
        this.$fire({
          html: `${this.districtInfo.name} ${healthCareName} 사업이 조기 종료되어<br> ${healthCareName} 소속 학생의 검진이 불가합니다.<br><br> 사업 관련 문의는 ${healthCareName} 보건소로 연락 부탁드립니다.`,
          confirmButtonText: '확인',
          padding: '40px',
        });
        this.firstDistrictCode = '';
        this.schoolDistrictCode = '';
      } else {
        if (this.fullSecondHelList.length) {
          this.setSecondHelList(districtCode);
        }
        if (this.secondHelList.length) {
          this.schoolDistrictCode = '';
          this.setSchoolList(''); // 학교 목록 초기화
        } else {
          this.schoolDistrictCode = districtCode;
          this.setSchoolList(districtCode);
        }
      }
    },
    setSecondHelList(districtCode) {
      this.secondHelList = districtCode ? this.fullSecondHelList.filter(hel => hel.districtCode.startsWith(districtCode)) : [];
    },
    setSchoolList(districtCode) {
      this.setSchoolInfo(''); // 학교 정보 초기화
      this.schoolList = districtCode ? this.fullSchoolList.filter(school => school.districtCode.startsWith(districtCode)) : [];
    },
    setSchoolInfo(schoolId) {
      const schoolInfo = this.schoolList.find(school => school.schoolId === parseInt(schoolId));
      this.schoolId = schoolId ? schoolId : '';
      this.isSchoolOutside = schoolInfo && schoolInfo.schoolType === 'E';
      this.requiredBirthAndTel = this.isSchoolOutside || this.dataObject.hospitalName || this.userOrganTargetType === 'HP';
      if (!this.requiredBirthAndTel) {
        this.DATA_SET(this.backup);
      }
    },
    save() {
      let validData = ['schoolDistrictCode', 'studentName', 'studentGender', 'schoolId', 'studentTel2'];
      if (!this.isSchoolOutside) {
        validData.push('studentToSchoolGrade1', 'studentToSchoolGrade2', 'studentToSchoolGrade3');
      }
      if (this.isSchoolOutside || this.dataObject.hospitalName || this.userOrganTargetType === 'HP') {
        validData.push('studentBirth', 'studentTel');
      }
      if (this.districtCodeFirst === 'D' && ['F', 'FY'].includes(this.dataObject.businessDivision)) {
        validData.push('studentTel');
      }
      let validTarget = [];
      validData.forEach(item => {
        validTarget.push(['schoolId', 'schoolDistrictCode'].includes(item) ? item : 'studentInfo.' + item + '.value');
      });
      this.$validate(validTarget).then(success => {
        if (success) {
          if (this.districtCodeFirst === 'G' && parseInt(this.studentInfo.studentToSchoolGrade1.value) === 4) {
            this.$alert('', '알림', 'warning', { html: '4학년 학생은 경기도 학생치과주치의 대상자입니다.<br/>덴티아이경기 시스템을 이용해주세요.' });
            return false;
          }

          // 1학년, 연제구 학생치과주치의 대응
          let businessDivision = this.dataObject.businessDivision;
          if (this.dataObject.businessDivision === 'F') {
            const grade1Int = parseInt(this.studentInfo.studentToSchoolGrade1.value);
            if (this.schoolDistrictCode === 'A0109' && grade1Int === 1) {
              businessDivision = 'F1';
              this.modifyBusinessDivision = businessDivision;
            } else if (this.schoolDistrictCode === 'D0101' && (grade1Int === 4 || grade1Int === 6)) {
              businessDivision = 'FY';
              this.modifyBusinessDivision = businessDivision;
            }
          }

          if (!this.isSchoolOutside) {
            const grade1ValidMsg = this.grade1ValidMsg(this.modifyBusinessDivision, this.studentInfo.studentToSchoolGrade1.value);
            if (grade1ValidMsg) {
              this.$alert(grade1ValidMsg, '알림', 'warning');
              return false;
            }
          }

          let form = {
            businessDivision: this.valueToCode('C0003', businessDivision),
            studentName: this.studentInfo.studentName.value,
            studentGender: this.valueToCode('C0005', this.studentInfo.studentGender.value),
            studentBirth: this.studentInfo.studentBirth.value,
            studentTel: this.studentInfo.studentTel.value,
            studentTel2: this.studentInfo.studentTel2.value,
            centerId: this.studentInfo.centerId.value,
            schoolId: this.schoolId,
          };
          if (this.studentInfo.studentInsurance.value) {
            form.studentInsurance = this.valueToCode('C0013', this.studentInfo.studentInsurance.value);
          }
          if (!this.isSchoolOutside) {
            form.studentToSchoolGrade1 = this.studentInfo.studentToSchoolGrade1.value;
            form.studentToSchoolGrade2 = this.studentInfo.studentToSchoolGrade2.value;
            form.studentToSchoolGrade3 = this.studentInfo.studentToSchoolGrade3.value;
          }
          let request = '';
          let alertMsg = '';
          if (this.isModify) {
            form.studentId = this.dataObject.studentId;
            if (this.divJoin('S')) {
              form.modifyBusinessDivision = this.valueToCode('C0003', this.modifyBusinessDivision);
            }
            request = Management.studentModify;
            alertMsg = '수정';
          } else {
            if (this.divJoin('S')) {
              form.businessDivision = this.valueToCode('C0003', this.modifyBusinessDivision);
            }
            request = this.userOrganTargetType === 'HP' ? Hospital.studentNewRegist : Management.studentRegister;
            alertMsg = '등록';
          }
          request(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert(`${alertMsg}되었습니다.`, '알림', 'success').then(() => {
                this.$store.dispatch('popup/popupClose');
                this.$store.commit('update');
              });
            } else if (res.data.rt === 422) {
              this.$alert(res.data.rtMsg, '알림', 'error');
            } else if (res.data.rt === 400) {
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
          errorMsg += '<b>' + (item === 'schoolId' ? '학교' : item === 'schoolDistrictCode' ? '지역구' : this.studentInfo[item].label) + '</b> : ' + this.validation.firstError(validTarget[index]);
        }
      });
      this.$alert('', '알림', 'warning', { html: errorMsg });
    },
  },
};
</script>
