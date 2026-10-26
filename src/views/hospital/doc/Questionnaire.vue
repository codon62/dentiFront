<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        {{ isQuestionnaireSurvey ? '사후 설문조사' : questionnaireTitle }} 작성
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
          <template v-if="formBlock.block1.length">
            <p class="commp2 fwb">구강 증상</p>
            <p v-if="isQuestionnaireSurvey" class="mt5 scommp">* 구강검진 후 구강상태 및 자기효능감을 참고하기 위하여 실시하는 것으로, 부모님(보호자)과 상의하여 정확하게 기재하여 주세요.</p>
            <p v-else class="mt5 scommp">* 최근 1년 동안 느낀 증상에 모두 표시해 주세요.</p>
            <div class="comm__form mt20">
              <question-table width="710" width2="350" :data-array="formBlock.block1" />
            </div>
          </template>
          <p class="commp2 fwb" :class="{ mt30: formBlock.block1.length }">{{ this.districtCodeFirst === 'I' ? '구강건강 관리상태 및 실천' : '구강 건강 행태' }}</p>
          <p class="mt5 scommp">* 본인의 구강 건강 상태에 해당하는 번호를 표시해 주세요.</p>
          <div class="comm__form mt20">
            <question-table width="450" width2="610" :data-array="formBlock.block2" />
          </div>

          <div>
            <p class="commp2 fwb mt30">{{ formContents.questionnaire.q_say.label }}</p>
            <div class="textbox mt20">
              <textarea
                :id="formContents.questionnaire.q_say.id"
                :name="formContents.questionnaire.q_say.name"
                :value="formContents.questionnaire.q_say.value"
                cols="30"
                rows="10"
                class="comm__textarea wid100"
                maxlength="200"
                :placeholder="formContents.questionnaire.q_say.placeholder"
                style="height: 110px"
                @input="DATA_SET({ q_say: $event.target.value })"
              ></textarea>
            </div>
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
        <!--<a v-if="districtCodeFirst === 'E'" href="javascript:;" class="black_button wid108" @click="submit('N')">임시 저장</a>-->
        <a href="javascript:;" class="blue_button wid180 ml25" @click="submit('Y')">최종 제출</a>
      </div>
    </div>
  </fragment>
</template>

<script>
import Hospital from '@/apis/Hospital';
import stdInfoBox from '@/components/doc/stdInfoBox';
import questionTable from '@/components/doc/questionTable';
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    'std-info-box': stdInfoBox,
    'question-table': questionTable,
  },
  computed: {
    ...mapState('user', ['adminOrganType']),
    ...mapState('doc', ['formContents', 'pdfStatus']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['endBusiness', 'questionnaireTitle']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
    isQuestionnaireSurvey() {
      return this.districtCodeFirst === 'C' && this.$route.path.endsWith('que-survey');
    },
  },
  data() {
    return {
      form: ['q_1', 'q_2', 'q_3', 'q_4', 'q_5', 'q_6', 'q_7', 'q_8', 'q_9', 'q_9_1', 'q_10', 'q_11'],
      formBlock: {
        block1: [],
        block2: [],
      },
    };
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
    submit(status) {
      let formData = {};
      for (const i in this.formContents.questionnaire) {
        formData[i] = this.formContents.questionnaire[i].value;
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
          for (const i in this.formContents.questionnaire) {
            formData[i] = this.formContents.questionnaire[i].value;
          }
          if (status === 'Y') {
            // validation
            let valid = false;
            for (const i in this.formBlock) {
              for (const block of this.formBlock[i]) {
                if (this.districtCodeFirst === 'A' && this.$route.query.businessDivision !== 'E' && block.form.data1 === 'q_22') {
                  continue;
                }
                if (block.form.data1 === 'q_9_1') {
                  if (
                    formData.q_9.indexOf(3) === -1 &&
                    formData.q_9.indexOf('3') === -1 &&
                    formData.q_9.indexOf(4) === -1 &&
                    formData.q_9.indexOf('4') === -1 &&
                    formData.q_9.indexOf(5) === -1 &&
                    formData.q_9.indexOf('5') === -1 &&
                    formData[block.form.data1] === ''
                  ) {
                    valid = true;
                  }
                } else if (block.form.data1 === 'q_15_4') {
                  if (formData.q_15_3 == 1 && formData[block.form.data1] === '') {
                    valid = true;
                  }
                } else if (block.form.data1 === 'q_23_1') {
                  if (parseInt(formData.q_23) === 0 && formData[block.form.data1] === '') {
                    valid = true;
                  }
                } else if (typeof formData[block.form.data1] === 'object' && !formData[block.form.data1].length) {
                  valid = true;
                } else if (formData[block.form.data1] === '') {
                  valid = true;
                }
                if (valid) {
                  this.$alert('', '알림', 'warning', { html: `<strong>${block.num}번 문항</strong> : 필수 입력 항목입니다.` });
                  return false;
                }
                if (block.form.data2 === 'q_10_input' && (formData.q_10.indexOf(10) !== -1 || formData.q_10.indexOf('10') !== -1) && formData[block.form.data2] === '') {
                  valid = true;
                } else if (block.form.data2 === 'q_13_input' && (formData.q_13.indexOf(4) !== -1 || formData.q_13.indexOf('4') !== -1) && formData[block.form.data2] === '') {
                  valid = true;
                }
                if (valid) {
                  this.$alert('', '알림', 'warning', { html: `<strong>${block.num}번 문항 - 기타</strong> : 필수 입력 항목입니다.` });
                  return false;
                }
              }
            }

            this.$store.commit('loading', true);
            if (!this.isQuestionnaireSurvey) {
              // this.$store.dispatch('popup/popupOpen', {
              //   contents: 'viewQuestionnaire',
              //   params: { studentId: this.$route.query.studentId, businessDivision: this.$route.query.businessDivision, pdf: true },
              // }); // pdf 저장
              this.questionnaireRegist(status, formData);
            } else {
              this.questionnaireRegist(status, formData);
            }
          } else {
            this.$store.commit('loading', true);
            this.questionnaireRegist(status, formData);
          }
        })
        .catch(() => {});
    },
    questionnaireInfo() {
      const form = {
        studentId: this.$route.query.studentId,
        businessDivision: this.valueToCode('C0003', this.$route.query.businessDivision),
      };
      const request = this.isQuestionnaireSurvey ? Hospital.questionnaireSurveyInfo : Hospital.questionnaireInfo;
      request(form).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
          res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
          let info = this.isQuestionnaireSurvey ? res.data.questionnaireSurveyInfo : res.data.questionnaireInfo;
          if (info) {
            info.status = this.codeToValue(info.status);
          }
          // code convert end
          if (info && info.status !== 'N') {
            alert('잘못된 접근입니다.');
            this.$router.push('/');
            return false;
          }
          this.$store.commit('student/DATA_SET', res.data.studentInfo);
          this.$store.commit('update');
          if (info) {
            this.$store.commit('doc/DATA_SET', info.form);
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    questionnaireRegist(status, formData) {
      const form = {
        studentId: this.$route.query.studentId,
        businessDivision: this.valueToCode('C0003', this.$route.query.businessDivision),
        status: this.valueToCode('C0001', status),
        form: formData,
      };
      const request = this.isQuestionnaireSurvey ? Hospital.questionnaireSurveyRegist : Hospital.questionnaireRegist;
      request(form).then(res => {
        if (res && res.data.rt === 200) {
          this.$store.commit('loading', false);
          const label = status === 'Y' ? '최종제출' : '임시저장';
          this.$alert(`${label}되었습니다.`, '알림', 'success').then(() => {
            this.$router.go(-1);
          });
        } else {
          this.$store.commit('loading', false);
          this.$store.commit('doc/pdfStatusSet', false);
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
  watch: {
    pdfStatus() {
      if (this.pdfStatus) {
        let formData = {};
        for (const i in this.formContents.questionnaire) {
          formData[i] = this.formContents.questionnaire[i].value;
        }
        this.questionnaireRegist('Y', formData);
      }
    },
  },
  created() {
    if (this.adminOrganType !== 'AD' && this.endBusiness(this.districtCodeFirst === 'C' ? 'notification' : this.districtCodeFirst === 'D' ? 'billPromotion' : 'treatment')) {
      alert('잘못된 접근입니다.');
      this.$router.push('/');
      return false;
    }

    this.$store.commit('student/resetStudentInfo');
    this.$store.commit('doc/questionnaire_clear');
    this.$store.commit('doc/pdfStatusSet', false);
    this.$store.commit('loading', false);

    this.form.q1 = { data1: 'q_1' };
    this.form.q2 = { data1: 'q_2' };
    this.form.q3 = { data1: 'q_3' };
    this.form.q4 = { data1: 'q_4' };
    this.form.q5 = { data1: 'q_5' };
    this.form.q6 = { data1: 'q_6' };
    this.form.q7 = { data1: 'q_7' };
    this.form.q8 = { data1: 'q_8' };
    this.form.q9 = { data1: 'q_9' };
    this.form.q9_1 = { data1: 'q_9_1' };
    this.form.q10 = { data1: 'q_10', data2: 'q_10_input' };
    this.form.q11 = { data1: 'q_11' };
    this.form.q12 = { data1: 'q_12' };
    this.form.q13 = { data1: 'q_13', data2: 'q_13_input' };
    this.form.q14 = { data1: 'q_14' };
    this.form.q15_1 = { data1: 'q_15_1' };
    this.form.q15_2 = { data1: 'q_15_2' };
    this.form.q15_3 = { data1: 'q_15_3' };
    this.form.q15_4 = { data1: 'q_15_4' };
    this.form.q15_5 = { data1: 'q_15_5' };
    this.form.q15_6 = { data1: 'q_15_6' };
    this.form.q15_7 = { data1: 'q_15_7' };
    this.form.q16 = { data1: 'q_16' };
    this.form.q17 = { data1: 'q_17' };
    this.form.q18 = { data1: 'q_18' };
    this.form.q19 = { data1: 'q_19' };
    this.form.q20 = { data1: 'q_20' };
    this.form.q21 = { data1: 'q_21' };
    this.form.q22 = { data1: 'q_22' };
    this.form.q23 = { data1: 'q_23' };
    this.form.q23_1 = { data1: 'q_23_1' };

    this.$store.commit('doc/questionnaire_set', { districtCodeFirst: this.districtCodeFirst, businessDivision: this.$route.query.businessDivision });

    if (!this.isQuestionnaireSurvey && this.districtCodeFirst !== 'I') {
      // 모든 지역 공통 (사후 설문조사, 전북 제외)
      this.formBlock.block1.push(
        { id: 1, form: this.form.q1, num: 1 },
        { id: 2, form: this.form.q2, num: 2 },
        { id: 3, form: this.form.q3, num: 3 },
        { id: 4, form: this.form.q4, num: 4 },
        { id: 5, form: this.form.q5, num: 5 },
        { id: 6, form: this.form.q6, num: 6 },
      );
    }

    if (this.districtCodeFirst === 'A' && this.$route.query.businessDivision !== 'E') {
      // 서울 (학구 제외)
      this.formBlock.block2.push(
        { id: 1, form: this.form.q7, num: 7 },
        { id: 2, form: this.form.q8, num: 8 },
        { id: 3, form: this.form.q9, num: 9 },
        { id: 4, form: this.form.q9_1, num: '9-1' },
        { id: 5, form: this.form.q22, num: 10 },
        { id: 6, form: this.form.q10, num: 11 },
        { id: 7, form: this.form.q11, num: 12 },
      );
    } else if (['A', 'G'].includes(this.districtCodeFirst) && this.$route.query.businessDivision === 'E') {
      // 서울시, 수원시 학생구강검진
      this.formBlock.block2.push({ id: 1, form: this.form.q18, num: 7 }, { id: 2, form: this.form.q12, num: 8 }, { id: 3, form: this.form.q7, num: 9 }, { id: 4, form: this.form.q8, num: 10 });
    } else if (this.districtCodeFirst === 'B') {
      // 인천시
      this.formBlock.block2.push(
        { id: 1, form: this.form.q10, num: 7 },
        { id: 2, form: this.form.q12, num: 8 },
        { id: 3, form: this.form.q7, num: 9 },
        { id: 4, form: this.form.q13, num: 10 },
        { id: 5, form: this.form.q11, num: 11 },
        { id: 6, form: this.form.q21, num: 12 },
      );
    } else if (this.districtCodeFirst === 'C') {
      // 경기도
      this.formBlock.block2.push(
        { id: 1, form: this.form.q10, num: this.isQuestionnaireSurvey ? 1 : 7 },
        { id: 2, form: this.form.q12, num: this.isQuestionnaireSurvey ? 2 : 8 },
        { id: 3, form: this.form.q13, num: this.isQuestionnaireSurvey ? 3 : 9 },
        { id: 4, form: this.form.q14, num: this.isQuestionnaireSurvey ? 4 : 10 },
        { id: 5, form: this.form.q15_1, num: this.isQuestionnaireSurvey ? '5-1' : '11-1' },
        { id: 6, form: this.form.q15_2, num: this.isQuestionnaireSurvey ? '5-2' : '11-2' },
        { id: 7, form: this.form.q15_3, num: this.isQuestionnaireSurvey ? '5-3' : '11-3' },
        { id: 8, form: this.form.q15_4, num: this.isQuestionnaireSurvey ? '5-3-1' : '11-3-1' },
        { id: 9, form: this.form.q15_5, num: this.isQuestionnaireSurvey ? '5-4' : '11-4' },
        { id: 10, form: this.form.q15_6, num: this.isQuestionnaireSurvey ? '5-5' : '11-5' },
        { id: 11, form: this.form.q15_7, num: this.isQuestionnaireSurvey ? '5-6' : '11-6' },
        { id: 12, form: this.form.q16, num: this.isQuestionnaireSurvey ? 6 : 12 },
        { id: 13, form: this.form.q17, num: this.isQuestionnaireSurvey ? 7 : 13 },
      );
    } else if (['D', 'F'].indexOf(this.districtCodeFirst) !== -1) {
      // 부산 / 밀양
      this.formBlock.block2.push(
        { id: 1, form: this.form.q7, num: 7 },
        { id: 2, form: this.form.q8, num: 8 },
        { id: 3, form: this.form.q9, num: 9 },
        { id: 4, form: this.form.q9_1, num: '9-1' },
        { id: 5, form: this.form.q10, num: 10 },
        { id: 6, form: this.form.q11, num: 11 },
      );
    } else if (this.districtCodeFirst === 'E') {
      // 순천시
      this.formBlock.block2.push(
        { id: 1, form: this.form.q7, num: 7 },
        { id: 2, form: this.form.q8, num: 8 },
        { id: 3, form: this.form.q12, num: 9 },
        { id: 4, form: this.form.q13, num: 10 },
        { id: 5, form: this.form.q10, num: 11 },
        { id: 6, form: this.form.q11, num: 12 },
      );
    } else if (this.districtCodeFirst === 'H') {
      // 여수시
      delete this.form.q13.data2;
      this.formBlock.block2.push(
        { id: 1, form: this.form.q19, num: 7 },
        { id: 2, form: this.form.q7, num: 8 },
        { id: 3, form: this.form.q20, num: 9 },
        { id: 4, form: this.form.q8, num: 10 },
        { id: 5, form: this.form.q13, num: 11 },
        { id: 6, form: this.form.q12, num: 12 },
        { id: 7, form: this.form.q14, num: 13 },
        { id: 8, form: this.form.q18, num: 14 },
        { id: 9, form: this.form.q11, num: 15 },
      );
    } else if (this.districtCodeFirst === 'I') {
      // 전북
      this.formBlock.block2.push(
        { id: 1, form: this.form.q10, num: 1 },
        { id: 2, form: this.form.q16, num: 2 },
        { id: 3, form: this.form.q12, num: 3 },
        { id: 4, form: this.form.q17, num: 4 },
        { id: 5, form: this.form.q15_5, num: '5-1' },
        { id: 6, form: this.form.q15_6, num: '5-2' },
        { id: 7, form: this.form.q15_7, num: '5-3' },
      );
    } else if (this.districtCodeFirst === 'J') {
      // 울산
      this.formBlock.block2.push(
        { id: 1, form: this.form.q18, num: 7 },
        { id: 2, form: this.form.q12, num: 8 },
        { id: 3, form: this.form.q7, num: 9 },
        { id: 4, form: this.form.q8, num: 10 },
        { id: 5, form: this.form.q23, num: 11 },
        { id: 6, form: this.form.q23_1, num: '11-1' },
      );
    }

    this.questionnaireInfo();
  },
};
</script>
