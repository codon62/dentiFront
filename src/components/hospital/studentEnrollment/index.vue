<template>
  <div class="popup_content">
    <v-popuptitle message="학생 등록" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <div class="row">
        <div class="inner--left">
          <p class="commp4 fwb">
            {{ topTitle }}
            <span v-if="!view3" class="commp5 c_red ml20">
              ※ {{ dataObject.businessDivision === 'C' ? '시설(센터)' : '학교' }}와 성명만 입력하면 학생을 검색할 수 있습니다.
              {{ districtCodeFirst === 'J' ? '4/15 이후 전학한 경우 이전 학교명과 학반으로 조회가능합니다.' : '' }}
            </span>
          </p>
        </div>
        <div v-if="districtCodeFirst === 'A' && dataObject.businessDivision === 'E' && !view3" class="inner--right">
          <a
            href="javascript:;"
            class="comm__red_btn btn_m_size2 d_block wid130 commp inner--right ml10"
            @click="popupOpen({ contents: 'managementStudentStudentEnrollment', params: { businessDivision: dataObject.businessDivision } })"
          >
            신규 학생 등록
          </a>
        </div>
      </div>
      <div v-if="dataObject.businessDivision === 'C'" class="row flex_set mt30">
        <v-popupinput
          :title="studentInfo.centerName.label"
          size="m"
          :value="studentInfo.centerName.value"
          name="input"
          :placeholder="studentInfo.centerName.label + '을 입력해 주세요'"
          :is-readonly="view3"
          :required="true"
          :requiredKr="true"
          @input="DATA_SET({ centerName: $event })"
        ></v-popupinput>
        <v-popupinput
          v-if="!view3"
          :title="studentInfo.studentBirth.label"
          size="s2"
          :value="studentInfo.studentBirth.value"
          divclass="ml10"
          name="input"
          type="number"
          :placeholder="studentInfo.studentBirth.label + '을 입력해 주세요'"
          :requiredKr="true"
          @input="DATA_SET({ studentBirth: $event })"
        ></v-popupinput>
        <v-popupinput
          v-if="!view3"
          :title="studentInfo.studentTel.label"
          size="s2"
          :value="studentInfo.studentTel.value"
          divclass="ml10"
          name="input"
          type="number"
          :placeholder="studentInfo.studentTel.label + '를 입력해 주세요'"
          :requiredKr="true"
          @input="DATA_SET({ studentTel: $event })"
        ></v-popupinput>
      </div>
      <div v-else class="row flex_set mt30">
        <div v-if="districtCodeFirst === 'C'" class="flex_item">
          <p class="commp fwb">학교밖</p>
          <div class="check_set ml10 mb15" style="margin-top: 16px">
            <input id="schoolOutside" type="checkbox" class="blind" :disabled="view3" @change="changeSchOutside($event.target.checked)" />
            <label for="schoolOutside">
              <span class="icon"></span>
              <span class="label_t"></span>
            </label>
          </div>
        </div>
        <v-popupinput
          :title="studentInfo.schoolName.label"
          size="m"
          :value="studentInfo.schoolName.value"
          :divclass="{ ml30: districtCodeFirst === 'C' }"
          name="input"
          :placeholder="studentInfo.schoolName.label + '명을 입력해 주세요'"
          :is-readonly="view3 || schoolOutside === 1"
          :required="true"
          :requiredKr="true"
          @input="DATA_SET({ schoolName: $event })"
        ></v-popupinput>
        <v-popupinput
          :title="studentInfo.studentToSchoolGrade1.label"
          size="s"
          :value="studentInfo.studentToSchoolGrade1.value"
          divclass="ml10"
          name="input"
          type="number"
          :placeholder="studentInfo.studentToSchoolGrade1.label"
          :is-readonly="view3 || schoolOutside === 1"
          :requiredKr="true"
          @input="DATA_SET({ studentToSchoolGrade1: $event })"
        ></v-popupinput>
        <v-popupinput
          :title="studentInfo.studentToSchoolGrade2.label"
          size="s"
          :value="studentInfo.studentToSchoolGrade2.value"
          divclass="ml10"
          name="input"
          :placeholder="studentInfo.studentToSchoolGrade2.label"
          :is-readonly="view3 || schoolOutside === 1"
          :requiredKr="true"
          @input="DATA_SET({ studentToSchoolGrade2: $event })"
        ></v-popupinput>
        <v-popupinput
          :title="studentInfo.studentToSchoolGrade3.label"
          size="s"
          :value="studentInfo.studentToSchoolGrade3.value"
          divclass="ml10"
          name="input"
          type="number"
          :placeholder="studentInfo.studentToSchoolGrade3.label"
          :is-readonly="view3 || schoolOutside === 1"
          :requiredKr="true"
          @input="DATA_SET({ studentToSchoolGrade3: $event })"
        ></v-popupinput>
      </div>
      <div class="row flex_set mt30" :class="{ flex_left: view3 }">
        <v-popupinput
          :title="studentInfo.studentName.label"
          :size="view3 ? 'm3' : 'l'"
          :value="studentInfo.studentName.value"
          name="input"
          :placeholder="`학생의 성명을 ${districtCodeFirst === 'C' ? '띄어쓰기 없이 ' : ''}정확하게 입력해 주세요 (한글, 영문 동일)`"
          :is-readonly="view3"
          :required="true"
          :requiredKr="true"
          @input="DATA_SET({ studentName: $event })"
        ></v-popupinput>
        <div v-if="!view3" class="flex_item ml10">
          <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid110" @click="search">
            <img src="@/assets/images/common/ic_search.png" />
            검색
          </a>
        </div>
      </div>
      <template v-if="view2 || view3">
        <div class="comm__line mt40"></div>
        <p class="commp4 fwb mt30">
          {{ bottomTitle }}
          <span v-if="view2 && dataObject.businessDivision !== 'C'" class="c_red ml20">※ 학생의 성명, 학교, 학년, 반, 번호를 정확하게 확인해 주세요.</span>
        </p>
      </template>
      <div v-if="view2" class="mt30">
        <div class="board__box">
          <v-table
            :data="table"
            cmp="hospitalStudentEnrollment"
            tableMessage="입력하신 학교와 학생명으로 검색된 결과가 없습니다.<br/>학교와 학생명을 다시 확인해 주세요."
            @vclick="studentEnrollment"
          ></v-table>
          <v-pager :data="pager" :popup="true" @vclick="studentRegistList"></v-pager>
        </div>
        <!--//board__box-->
      </div>
      <template v-if="view3">
        <template v-if="districtCodeFirst === 'J'">
          <p class="commp fwb">대상자</p>
          <p class="scommp mt5"><strong class="fw500">학생 치과주치의</strong> : 1·4학년 중 희망학생</p>
          <p class="scommp"><strong class="fw500">학생 구강검진</strong> : 2·3·5·6학년, 1·4학년 중 치과주치의 미희망자</p>
        </template>
        <div v-if="divJoin('S')" class="row flex_set mt20">
          <div class="flex_item">
            <p class="commp fwb">
              검진 유형
              <span class="c_red">*</span>
            </p>
            <div class="comm_radio mt10">
              <div v-for="(item, key) in businessDivisionSpc.value" :key="item" class="radio_box d_inblock hei100" :class="{ ml20: key !== 'F' }">
                <input :id="'div_' + key" type="radio" :value="key" :checked="modifyBusinessDivision === key" name="div" class="blind" @change="modifyBusinessDivision = key" />
                <label :for="'div_' + key">
                  <span class="icon"></span>
                  <span class="label_t">{{ item }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="row flex_set mt20">
          <div class="flex_item flex_size_s3">
            <p class="commp fwb">
              생년
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <select class="comm_select" v-model="year">
                <option value="">생년</option>
                <option v-for="item in getStudentYears" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </div>
          </div>
          <div class="flex_item flex_size_s3 ml10">
            <p class="commp fwb">
              월
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <select class="comm_select" v-model="month">
                <option value="">월</option>
                <option v-for="item in getStudentMonths" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </div>
          </div>
          <div class="flex_item flex_size_s3 ml10">
            <p class="commp fwb">
              일
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <select class="comm_select" v-model="day">
                <option value="">일</option>
                <option v-for="item in getStudentDays" :key="item.id" :value="item.id">{{ item.name }}</option>
              </select>
            </div>
          </div>
          <v-popupinput
            :title="studentInfo.studentTel.label"
            :value="studentInfo.studentTel.value"
            size="m"
            divclass="ml10"
            name="input"
            type="number"
            placeholder="연락처를 입력해 주세요 (01012345678)"
            :required="true"
            @input="DATA_SET({ studentTel: $event })"
          ></v-popupinput>
          <div class="flex_item ml20">
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
        <p class="mt10 c_red scommp" style="margin-left: 240px">※ 연락처 작성 시 숫자만 입력해 주세요.</p>
        <div class="comm__line mt40"></div>
        <v-popupconfirm message="등록" @save="save"></v-popupconfirm>
      </template>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import popupInput from '@/components/popup/PopupInput.vue';
import table from '@/components/common/Table.vue';
import Pager from '@/components/common/Pager.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

Vue.use(SimpleVueValidation);
SimpleVueValidation.extendTemplates({
  required: '필수 입력 항목입니다.',
  integer: '잘못된 입력값입니다.',
  greaterThan: '잘못된 입력값입니다.',
  lessThan: '잘못된 입력값입니다.',
  length: '잘못된 입력값입니다.',
  minLength: '잘못된 입력값입니다.',
  maxLength: '잘못된 입력값입니다.',
});
const Validator = SimpleVueValidation.Validator;

export default {
  props: ['dataObject'],
  data() {
    return {
      topTitle: '학생 검색',
      bottomTitle: '',
      pager: {},
      table: {
        maxNum: 1,
        col: ['8%', '*', '10%', '*', '10%', '*', '*', '12%'],
        th: ['번호', '학교', '학년', '반', '번호', '성명', '병원', '추가하기'],
        list: [],
      },
      studentId: '',
      schoolOutside: '',
      modifyBusinessDivision: '',
      year: '',
      month: '',
      day: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId', 'districtCode']),
    ...mapState('popup', ['view2', 'view3']),
    ...mapState('status', ['studentGender', 'businessDivisionSpc']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'grade1ValidMsg']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValueList']),
    ...mapGetters('date', ['getStudentYears', 'getStudentMonths', 'getStudentDays', 'getStudentYearByGrade1']),
    isDivE() {
      return this.divJoin('E') && !this.divJoin('S') && this.dataObject.businessDivision === 'E';
    },
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
    'v-table': table,
    'v-pager': Pager,
  },
  validators: {
    modifyBusinessDivision: value => {
      return Validator.value(value).required();
    },
    year: value => {
      return Validator.value(value).required();
    },
    month: value => {
      return Validator.value(value).required();
    },
    day: value => {
      return Validator.value(value).required();
    },
    'studentInfo.centerName.value': value => {
      return Validator.value(value).required();
    },
    'studentInfo.schoolName.value': value => {
      return Validator.value(value).required();
    },
    'studentInfo.studentName.value': value => {
      return Validator.value(value).required();
    },
    'studentInfo.studentGender.value': value => {
      return Validator.value(value).required();
    },
    'studentInfo.studentTel.value': value => {
      return Validator.value(value).required().integer().minLength(10).maxLength(11);
    },
  },
  created() {
    this.modifyBusinessDivision = this.dataObject.businessDivision;
    if (this.dataObject.businessDivision === 'C') {
      this.table.col = ['8%', '*', '*', '*', '*', '*', '12%'];
      this.table.th = ['번호', '시설(센터)명', '성명', '생년월일', '연락처', '병원', '추가하기'];
    }
    this.$store.commit('student/resetStudentInfo');
  },
  methods: {
    ...mapMutations('student', ['DATA_SET']),
    ...mapActions('popup', ['popupOpen']),
    changeSchOutside(checked) {
      this.schoolOutside = checked ? 1 : '';
      this.DATA_SET({ schoolName: '' });
      this.DATA_SET({ studentToSchoolGrade1: '' });
      this.DATA_SET({ studentToSchoolGrade2: '' });
      this.DATA_SET({ studentToSchoolGrade3: '' });
    },
    search() {
      // 학생 검색
      let validData = ['studentName'];
      if (this.dataObject.businessDivision === 'C') {
        validData.push('centerName');
      } else if (this.schoolOutside !== 1) {
        validData.push('schoolName');
      }
      let validTarget = [];
      validData.forEach(item => {
        validTarget.push('studentInfo.' + item + '.value');
      });
      this.$validate(validTarget).then(success => {
        if (success) {
          this.studentRegistList(1);
        } else {
          this.validError(validData, validTarget);
        }
      });
    },
    studentRegistList(page) {
      // 학생 조회 API
      let form = {
        hospitalId: this.userOrganTargetId,
        page: page,
        size: 10,
        studentName: this.studentInfo.studentName.value.trim(),
      };
      let request = '';
      if (this.dataObject.businessDivision === 'C') {
        form.centerName = this.studentInfo.centerName.value.trim();
        form.studentBirth = this.studentInfo.studentBirth.value;
        form.studentTel = this.studentInfo.studentTel.value;
        request = Hospital.studentRegistListC;
      } else {
        form.schoolOutside = this.schoolOutside;
        form.schoolName = this.studentInfo.schoolName.value.trim();
        form.studentToSchoolGrade1 = this.studentInfo.studentToSchoolGrade1.value;
        form.studentToSchoolGrade2 = this.studentInfo.studentToSchoolGrade2.value.trim();
        form.studentToSchoolGrade3 = this.studentInfo.studentToSchoolGrade3.value;
        if (this.divJoin('S')) {
          request = Hospital.studentRegistListS;
        } else if (this.dataObject.businessDivision.includes('F')) {
          request = Hospital.studentRegistListF;
        } else if (this.isDivE) {
          request = Hospital.contractStudentRegistListE;
        } else {
          request = Hospital.studentRegistListE;
        }
      }
      request(form).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = this.codeToValueList(res.data.studentList);
          this.pager = res.data.paging;
          this.bottomTitle = '검색 결과';
          this.$store.commit('popup/popupView2');
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    studentEnrollment(data) {
      this.topTitle = '제공된 항목';
      this.bottomTitle = '추가 항목';
      this.studentId = data.studentId;
      if (data.studentBirth?.length === 8) {
        this.year = data.studentBirth.substring(0, 4);
        this.month = data.studentBirth.substring(4, 6);
        this.day = data.studentBirth.substring(6, 8);
      } else {
        this.year = this.getStudentYearByGrade1(data.studentToSchoolGrade1);
      }
      const form = {
        schoolName: data.schoolName ? data.schoolName : '학교밖',
        studentToSchoolGrade1: data.studentToSchoolGrade1,
        studentToSchoolGrade2: data.studentToSchoolGrade2,
        studentToSchoolGrade3: data.studentToSchoolGrade3,
        centerName: data.centerName,
        studentName: data.studentName,
        studentBirth: data.studentBirth,
        studentTel: data.studentTel,
        studentGender: data.studentGender,
      };
      this.DATA_SET(form);
      this.$store.commit('popup/popupView3');
      this.dataObject.businessDivision = data.businessDivision;
      if (this.districtCodeFirst !== 'C') {
        // 경기도는 학생치과주치의 default
        this.modifyBusinessDivision = data.businessDivision;
      }
    },
    save() {
      const validData = ['modifyBusinessDivision', 'year', 'month', 'day', 'studentTel', 'studentGender'];
      let validTarget = [];
      validData.forEach(item => {
        validTarget.push(['modifyBusinessDivision', 'year', 'month', 'day'].includes(item) ? item : `studentInfo.${item}.value`);
      });
      this.$validate(validTarget).then(success => {
        if (success) {
          if (!(this.districtCodeFirst === 'D' && this.modifyBusinessDivision === 'C') && this.schoolOutside !== 1) {
            const grade1ValidMsg = this.grade1ValidMsg(this.modifyBusinessDivision, this.studentInfo.studentToSchoolGrade1.value);
            if (grade1ValidMsg) {
              this.$alert(grade1ValidMsg, '알림', 'warning');
              return false;
            }
          }
          let form = {
            hospitalId: this.userOrganTargetId,
            studentId: this.studentId,
            studentGender: this.valueToCode('C0005', this.studentInfo.studentGender.value),
            studentBirth: `${this.year}${this.month}${this.day}`,
            studentTel: this.studentInfo.studentTel.value,
            modifyBusinessDivision: this.valueToCode('C0003', this.modifyBusinessDivision),
          };
          let request = '';
          switch (this.dataObject.businessDivision) {
            case 'C':
              request = Hospital.studentRegistC;
              break;
            case 'F':
            case 'F1':
              request = Hospital.studentRegistF;
              break;
            case 'E':
              request = Hospital.studentRegistE;
              break;
          }
          request(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('등록되었습니다.', '알림', 'success').then(() => {
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
          let targetName;
          switch (item) {
            case 'modifyBusinessDivision':
              targetName = '검진 유형';
              break;
            case 'year':
              targetName = '생년';
              break;
            case 'month':
              targetName = '월';
              break;
            case 'day':
              targetName = '일';
              break;
            default:
              targetName = this.studentInfo[item].label;
          }
          errorMsg += `<b>${targetName}</b> : ${this.validation.firstError(validTarget[index])}`;
        }
      });
      this.$alert('', '알림', 'warning', { html: errorMsg });
    },
  },
};
</script>
