<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        만족도조사 작성
      </p>
    </div>
    <!-- form__ver_1 -->
    <div class="sub__content form__ver_1 bg_white mt30">
      <div class="sub__section mt30">
        <std-info-box :businessDivision="$route.query.businessDivision" />
      </div>
      <!--//sub__section-->
      <div class="sub__section">
        <div class="section_con">
          <p class="scommp">* 더 나은 치과 서비스 개선 등 제도 개선을 위한 기초 자료로 활용될 예정이오니, 아래 문항을 읽고 일치하는 내용에 표시해 주세요.</p>
          <div class="comm__form mt20">
            <student-survey-table width="710" width2="350" :data-array="formBlock.block1" />
          </div>
        </div>
      </div>
      <!--//sub__content-->
    </div>
    <!--//sub__section-->
    <div class="flex_space_between_container mt30 mb30">
      <div>
        <a href="javascript:;" class="white_button wid108" @click="$router.go(-1)">돌아가기</a>
      </div>
      <div class="flex_box">
        <!--        <a href="javascript:;" class="black_button wid108" @click="submit('N')">임시 저장</a>-->
        <a href="javascript:;" class="blue_button wid180 ml25" @click="submit('Y')">최종 제출</a>
      </div>
    </div>
  </fragment>
</template>

<script>
import Hospital from '@/apis/Hospital';
import stdInfoBox from '@/components/doc/stdInfoBox';
import studentSurveyTable from '@/components/doc/studentSurveyTable';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'std-info-box': stdInfoBox,
    studentSurveyTable,
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
  data() {
    return {
      form: ['q_1', 'q_2', 'q_3', 'q_4', 'q_5', 'q_6', 'q_7', 'q_8', 'q_9', 'q_9_1'],
      formBlock: {
        block1: [],
        block2: [],
      },
    };
  },
  methods: {
    submit(status) {
      let formData = {};
      for (const i in this.formContents.studentSurvey) {
        formData[i] = this.formContents.studentSurvey[i].value;
      }

      let alertMsg = '';
      if (status === 'Y') {
        alertMsg = '최종제출 하시겠습니까?<br/>최종제출 시 수정이 불가능합니다.';
      } else {
        alertMsg = '임시저장 하시겠습니까?';
      }
      this.$confirm('', '알림', 'question', { html: alertMsg })
        .then(() => {
          let formData = {};
          for (const i in this.formContents.studentSurvey) {
            formData[i] = this.formContents.studentSurvey[i].value;
          }
          if (status === 'Y') {
            // validation
            let valid = false;
            for (const i in this.formBlock) {
              for (const block of this.formBlock[i]) {
                if (typeof formData[block.form.data1] === 'object' && !formData[block.form.data1].length) {
                  valid = true;
                } else if (formData[block.form.data1] === '') {
                  valid = true;
                }
                if (valid) {
                  this.$alert('', '알림', 'warning', { html: `<strong>${block.num}번 문항</strong> : 필수 입력 항목입니다.` });
                  return false;
                }
                if (block.form.data2 === 'q_4_input' && (formData.q_4.indexOf(5) !== -1 || formData.q_4.indexOf('5') !== -1) && formData[block.form.data2] === '') {
                  valid = true;
                } else if (block.form.data2 === 'q_9_1_input' && (formData.q_9_1.indexOf(8) !== -1 || formData.q_9_1.indexOf('8') !== -1) && formData[block.form.data2] === '') {
                  valid = true;
                }
                if (valid) {
                  this.$alert('', '알림', 'warning', { html: `<strong>${block.num}번 문항 - 기타</strong> : 필수 입력 항목입니다.` });
                  return false;
                }
                if (block.form.data1 === 'q_9_1' && formData[block.form.data1].length > 3) {
                  this.$alert('', '알림', 'warning', { html: `<strong>${block.num}번 문항</strong> : 최대 3개까지 선택할 수 있습니다.` });
                  return false;
                }
              }
            }
          }
          this.$store.commit('loading', true);
          this.studentSurveyRegist(status, formData);
        })
        .catch(() => {});
    },
    studentSurveyInfo() {
      const form = {
        studentId: this.$route.query.studentId,
        businessDivision: this.valueToCode('C0003', this.$route.query.businessDivision),
      };
      Hospital.studentSurveyInfo(form).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
          res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
          if (res.data.studentSurveyInfo) {
            res.data.studentSurveyInfo.status = this.codeToValue(res.data.studentSurveyInfo.status);
          }
          // code convert end
          if (res.data.studentSurveyInfo && res.data.studentSurveyInfo.status !== 'N') {
            alert('잘못된 접근입니다.');
            this.$router.push('/');
            return false;
          }
          this.$store.commit('student/DATA_SET', res.data.studentInfo);
          this.$store.commit('update');
          if (res.data.studentSurveyInfo) {
            this.$store.commit('doc/STUDENTSURVEY_DATA_SET', res.data.studentSurveyInfo.form);
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    studentSurveyRegist(status, formData) {
      const form = {
        studentId: this.$route.query.studentId,
        businessDivision: this.valueToCode('C0003', this.$route.query.businessDivision),
        status: this.valueToCode('C0001', status),
        form: formData,
      };
      Hospital.studentSurveyRegist(form).then(res => {
        if (res && res.data.rt === 200) {
          this.$store.commit('loading', false);
          const label = status === 'Y' ? '최종제출' : '임시저장';
          this.$alert(`${label}되었습니다.`, '알림', 'success').then(() => {
            this.$router.go(-1);
          });
        } else {
          this.$store.commit('loading', false);
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
  created() {
    this.$store.commit('student/resetStudentInfo');
    this.$store.commit('doc/studentSurvey_clear');
    this.$store.commit('loading', false);

    this.form.q1 = { data1: 'q_1' };
    this.form.q2 = { data1: 'q_2' };
    this.form.q3 = { data1: 'q_3' };
    this.form.q4 = { data1: 'q_4', data2: 'q_4_input' };
    this.form.q5 = { data1: 'q_5' };
    this.form.q6 = { data1: 'q_6' };
    this.form.q7 = { data1: 'q_7' };
    this.form.q8 = { data1: 'q_8' };
    this.form.q9 = { data1: 'q_9' };
    this.form.q9_1 = { data1: 'q_9_1', data2: 'q_9_1_input' };

    this.$store.commit('doc/studentSurvey_set', { districtCodeFirst: this.districtCodeFirst, businessDivision: this.$route.query.businessDivision });

    this.formBlock.block1.push(
      { id: 1, form: this.form.q1, num: 1 },
      { id: 2, form: this.form.q2, num: 2 },
      { id: 3, form: this.form.q3, num: 3 },
      { id: 4, form: this.form.q4, num: 4 },
      { id: 5, form: this.form.q5, num: 5 },
      { id: 6, form: this.form.q6, num: 6 },
      { id: 7, form: this.form.q7, num: 7 },
      { id: 8, form: this.form.q8, num: 8 },
      { id: 9, form: this.form.q9, num: 9 },
      { id: 10, form: this.form.q9_1, num: 10 },
    );

    this.studentSurveyInfo();
  },
};
</script>
