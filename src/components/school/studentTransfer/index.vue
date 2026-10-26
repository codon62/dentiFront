<template>
  <div class="popup_content">
    <v-popuptitle message="학생 전입" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <div v-if="!view3" class="row mb15">
        <div class="inner--left">
          <p class="commp4 fwb c_red">※ 전입을 위해서는 이전 학교의 전출이 먼저 선행되어야 합니다.</p>
          <p class="commp4 fwb c_red">※ 이전 학교명과 학생의 이름을 정확하게 입력해주세요.</p>
        </div>
        <div v-if="districtCodeFirst === 'C'" class="inner--right">
          <a
            href="https://kr.object.gov-ncloudstorage.com/dt2023-common/public/web/gyeonggi/경기도 내 학생 전입처리 가이드.pdf"
            class="comm__blue_bd_btn btn_l_size d_block wid180 commp2 mr30"
            target="_blank"
          >
            전입처리 방법 안내
          </a>
        </div>
      </div>
      <div class="row">
        <div class="inner--left">
          <p class="commp4 fwb">
            {{ topTitle }}
            <!--            <span v-if="!view3" class="c_red ml20">※ 학년, 반, 번호와 성명을 정확하게 입력해 주세요.</span>-->
          </p>
        </div>
      </div>
      <div class="row flex_set mt20">
        <v-popupinput
          title="이전 학교"
          size="m"
          :value="studentInfo.schoolName.value"
          name="input"
          :placeholder="studentInfo.schoolName.label + '명을 입력해 주세요.'"
          :is-readonly="view3"
          :required="true"
          @input="DATA_SET({ schoolName: $event })"
        ></v-popupinput>
        <v-popupinput
          title="이전 학년"
          :value="studentInfo.studentToSchoolGrade1.value"
          size="s3"
          divclass="ml10"
          name="input"
          type="number"
          :placeholder="studentInfo.studentToSchoolGrade1.label"
          :is-readonly="view3"
          :options="{
            min: 1,
            max: 6,
            maxlength: 1,
          }"
          @input="DATA_SET({ studentToSchoolGrade1: $event })"
        ></v-popupinput>
        <v-popupinput
          title="이전 반"
          :value="studentInfo.studentToSchoolGrade2.value"
          size="s3"
          divclass="ml10"
          name="input"
          :placeholder="studentInfo.studentToSchoolGrade2.label"
          :is-readonly="view3"
          @input="DATA_SET({ studentToSchoolGrade2: $event })"
        ></v-popupinput>
        <v-popupinput
          title="이전 번호"
          :value="studentInfo.studentToSchoolGrade3.value"
          size="s3"
          divclass="ml10"
          name="input"
          type="number"
          :placeholder="studentInfo.studentToSchoolGrade3.label"
          :is-readonly="view3"
          @input="DATA_SET({ studentToSchoolGrade3: $event })"
        ></v-popupinput>
      </div>
      <div class="row flex_set mt30" :class="{ flex_left: view3 }">
        <v-popupinput
          :title="studentInfo.studentName.label"
          :size="view3 ? 'm3' : 'l'"
          :value="studentInfo.studentName.value"
          name="input"
          :placeholder="studentInfo.studentName.label + '을 입력해 주세요.'"
          :is-readonly="view3"
          :required="true"
          @input="DATA_SET({ studentName: $event })"
        ></v-popupinput>
        <div v-if="!view3" class="flex_item ml10">
          <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid110" @click="search">
            <img src="@/assets/images/common/ic_search.png" />
            검색
          </a>
        </div>
      </div>
      <div v-if="view2 || view3" class="comm__line mt40"></div>
      <p v-if="view2 || view3" class="commp4 fwb mt50">{{ bottomTitle }}</p>
      <div v-if="view2" class="mt30">
        <div class="board__box">
          <v-table :data="table" cmp="schoolStudentTransfer" @vclick="studentTransfer"></v-table>
          <v-pager :data="pager" :popup="true" @vclick="transferredStudentList"></v-pager>
        </div>
        <!--//board__box-->
      </div>
      <div v-if="view3" class="row flex_set mt30">
        <v-popupinput
          title="학년"
          v-model="studentToSchoolGrade1"
          size="s3"
          name="input"
          type="number"
          placeholder="학년"
          :required="true"
          :options="{
            min: 1,
            max: 6,
            maxlength: 1,
          }"
        ></v-popupinput>
        <v-popupinput title="반" v-model="studentToSchoolGrade2" size="s3" divclass="ml10" name="input" placeholder="반" :required="true"></v-popupinput>
        <v-popupinput title="번호" v-model="studentToSchoolGrade3" size="s3" divclass="ml10" name="input" type="number" placeholder="번호" :required="true"></v-popupinput>
      </div>
      <div v-if="view3" class="comm__line mt40"></div>
      <v-popupconfirm v-if="view3" message="저장" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import popupInput from '@/components/popup/PopupInput.vue';
import table from '@/components/common/Table.vue';
import Pager from '@/components/common/Pager.vue';
import { mapGetters, mapMutations, mapState } from 'vuex';
import School from '@/apis/School';

Vue.use(SimpleVueValidation);
SimpleVueValidation.extendTemplates({
  required: '필수 입력 항목입니다.',
  integer: '잘못된 입력값입니다.',
  length: '잘못된 입력값입니다.',
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
        col: ['5%', '15%'],
        th: ['번호', '학교', '학년', '반', '번호', '이름', '성별', '처리'],
        list: [],
      },
      studentId: '',
      modifyBusinessDivision: '',
      studentToSchoolGrade1: '',
      studentToSchoolGrade2: '',
      studentToSchoolGrade3: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId']),
    ...mapState('popup', ['view2', 'view3']),
    ...mapState('status', ['studentGender']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode', 'codeToValueList']),
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
    'v-table': table,
    'v-pager': Pager,
  },
  validators: {
    'studentInfo.schoolName.value': value => {
      return Validator.value(value).required();
    },
    'studentInfo.studentName.value': value => {
      return Validator.value(value).required();
    },
    studentToSchoolGrade1: value => {
      return Validator.value(value).required().integer();
    },
    studentToSchoolGrade2: value => {
      return Validator.value(value).required();
    },
    studentToSchoolGrade3: value => {
      return Validator.value(value).required().integer();
    },
  },
  created() {
    this.$store.commit('student/resetStudentInfo');
    if (this.districtCodeFirst === 'C') {
      this.table.th.push('수검 여부', '통보서', '이력 보기');
    }
  },
  methods: {
    ...mapMutations('student', ['DATA_SET']),
    search() {
      // 학생 검색
      let validData = ['studentInfo.schoolName.value', 'studentInfo.studentName.value'];
      let validTitle = ['학교', '성명'];
      this.$validate(validData).then(success => {
        if (success) {
          this.transferredStudentList(1);
        } else {
          this.validError(validData, validTitle);
        }
      });
    },
    transferredStudentList(page) {
      // 전출 학생 목록 조회 API
      let form = {
        page: page,
        size: 10,
        schoolName: this.studentInfo.schoolName.value.trim(),
        studentToSchoolGrade1: this.studentInfo.studentToSchoolGrade1.value.trim(),
        studentToSchoolGrade2: this.studentInfo.studentToSchoolGrade2.value.trim(),
        studentToSchoolGrade3: this.studentInfo.studentToSchoolGrade3.value.trim(),
        studentName: this.studentInfo.studentName.value.trim(),
      };
      if (!this.divJoin('S')) {
        form.businessDivision = this.valueToCode('C0003', this.dataObject.businessDivision);
      }
      School.transferredStudentList(form).then(res => {
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
    studentTransfer(data) {
      this.topTitle = '제공된 항목';
      this.bottomTitle = '추가 항목';
      this.studentId = data.studentId;
      const form = {
        schoolName: data.schoolName ? data.schoolName : '학교밖',
        studentToSchoolGrade1: data.studentToSchoolGrade1,
        studentToSchoolGrade2: data.studentToSchoolGrade2,
        studentToSchoolGrade3: data.studentToSchoolGrade3,
        studentName: data.studentName,
        studentGender: data.studentGender,
        studentBirth: data.studentBirth,
      };
      this.DATA_SET(form);
      this.$store.commit('popup/popupView3');
    },
    save() {
      const validData = ['studentToSchoolGrade1', 'studentToSchoolGrade2', 'studentToSchoolGrade3'];
      const validTitle = ['학년', '반', '번호'];
      this.$validate(validData).then(success => {
        if (success) {
          let form = {
            studentId: this.studentId,
            schoolId: this.userOrganTargetId,
            studentToSchoolGrade1: this.studentToSchoolGrade1.trim(),
            studentToSchoolGrade2: this.studentToSchoolGrade2.trim(),
            studentToSchoolGrade3: this.studentToSchoolGrade3.trim(),
          };
          School.transfer(form).then(res => {
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
