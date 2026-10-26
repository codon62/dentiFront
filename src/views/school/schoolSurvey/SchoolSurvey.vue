<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">사업 설문조사</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <div class="comm__form mt30">
        <survey-table :data-array="formBlock.block1" survey-header="사업 수행 인프라 (사업 운영)" set-name="block1" :valid="valid" :form-kind="formKind" />
      </div>
      <div class="comm__form mt30">
        <survey-table :data-array="formBlock.block2" survey-header="사업 인식 및 태도" set-name="block2" :valid="valid" :form-kind="formKind" />
      </div>
      <div class="btn__box mt30 mb30 row submit__btn_box">
        <div>
          <a href="javascript:;" class="d_inblock wid145 btn_l_size ml10 commp2 fwb submit__btn" @click="submit('Y')">최종 제출</a>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import Survey from '@/apis/Survey';
import surveyTable from '@/components/common/survey/SurveyTable';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'schoolSurvey',
  components: {
    'survey-table': surveyTable,
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapState('user', ['userOrganTargetId', 'surveyCheck']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
  data() {
    return {
      formKind: 'gyeonggiSurvey',
      formBlock: {
        block1: [],
        block2: [],
      },
      valid: false,
    };
  },
  created() {
    if (this.districtCodeFirst !== 'C') {
      alert('잘못된 접근입니다.');
      this.$router.push('/');
      return false;
    }
    if (this.surveyCheck) {
      alert('설문조사 참여가 완료되었습니다.');
      this.$router.push('/').catch(() => {});
      return false;
    }
    this.$store.commit('doc/gyeonggiSurvey_clear');
    this.formContents.gyeonggiSurvey.q_1.label = this.formContents.gyeonggiSurvey.q_1.label.replace('{0}', '경기도청, 시군보건소, 치과주치의 사업문의센터');
    this.$store.commit('loading', false);
    this.formBlock.block1.push({ id: 1, form: { data1: 'q_1' }, num: 1 }, { id: 2, form: { data1: 'q_4' }, num: 2 });
    this.formBlock.block2.push(
      { id: 3, form: { data1: 'q_5' }, num: 3 },
      { id: 4, form: { data1: 'q_6' }, num: 4 },
      { id: 5, form: { data1: 'q_7', data2: 'q_7_input' }, num: 5 },
      { id: 6, form: { data1: 'q_8' }, num: 6 },
      { id: 7, form: { data1: 'q_say' }, num: 7 },
    );
  },
  methods: {
    submit(status) {
      let alertMsg = '';
      if (status === 'Y') {
        alertMsg = '최종제출 하시겠습니까?<br/>최종제출 시 수정이 불가능합니다.';
      }
      this.$confirm('', '알림', 'question', { html: alertMsg })
        .then(() => {
          let formData = {};
          for (const i in this.formContents.gyeonggiSurvey) {
            formData[i] = this.formContents.gyeonggiSurvey[i].value;
          }
          if (status === 'Y') {
            // validation
            this.valid = false;
            for (const i in this.formBlock) {
              for (const block of this.formBlock[i]) {
                let qName = block.form.data1;
                if (qName === 'q_say') continue;
                if (typeof formData[qName] === 'object' && !formData[qName].length) {
                  this.valid = true;
                } else if (formData[qName] === '') {
                  this.valid = true;
                }
                if (this.valid) {
                  // radio, checkbox red border class 부여
                  const e = document.getElementById(`q_box_${block.form.data1}`);
                  this.highlightRedBorder(e);
                  this.$alert('', '알림', 'warning', {
                    html: `<strong>${block.num}번 문항</strong> : 필수 입력 항목입니다.`,
                    onAfterClose: () => {
                      e.scrollIntoView();
                    },
                  });
                  return false;
                }

                if (block.form.data2 === 'q_7_input' && (formData.q_7.indexOf(8) !== -1 || formData.q_7.indexOf('8') !== -1) && formData[block.form.data2] === '') {
                  this.valid = true;
                } else if (block.form.data2 === 'q_9_input' && formData.q_9 === 5 && formData[block.form.data2] === '') {
                  this.valid = true;
                }
                if (this.valid) {
                  // Textarea red border class 부여
                  const e = document.querySelector(`div[id=q_box_${block.form.data1}] textarea`).parentElement;
                  this.highlightRedBorder(e);
                  this.$alert('', '알림', 'warning', {
                    html: `<strong>${block.num}번 문항 - 기타</strong> : 필수 입력 항목입니다.`,
                    onAfterClose: () => {
                      e.scrollIntoView();
                    },
                  });
                  return false;
                }
              }
            }
            this.$store.commit('loading', true);
            this.schoolSurveyRegist(status, formData);
          }
        })
        .catch(() => {});
    },
    schoolSurveyRegist(status, formData) {
      const form = {
        schoolId: this.userOrganTargetId,
        form: formData,
      };
      Survey.schoolSurveyRegist(form).then(res => {
        if (res && res.data.rt === 200) {
          this.$store.commit('loading', false);
          const label = status === 'Y' ? '최종제출' : '임시저장';
          this.$alert(`${label}되었습니다.`, '알림', 'success').then(() => {
            this.$store.commit('user/setSurveyCheck', true);
            this.$router.go(-1);
          });
        } else {
          this.$store.commit('loading', false);
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    highlightRedBorder(element) {
      element.scrollIntoView(); // 해당 에러 부분으로 스크롤 이동
      element.classList.add('red__border');
    },
    removeRedBorder(element) {
      element.classList.remove('red__border');
    },
  },
};
</script>

<style scoped lang="scss">
.info__box {
  padding: 20px 50px;
  text-align: center;
  border: 1px solid #e6e6e6;
}
.submit__btn {
  @include transition(all 0.5s ease);
  @include border-radius(8px);

  border: 1px solid #0868f1;
  background-color: #fff;
  color: #0868f1;
  text-align: center;
}
.submit__btn:hover {
  background-color: #0868f1;
  color: #fff;
}
.submit__btn_box {
  display: flex;
  justify-content: center;
}
#select__container {
  padding: 10px 10px 30px;
}
.red__border {
  @include border-radius(10px);

  border: 1px solid #d94f4f;
  position: relative;
}
.red__border::before {
  content: '필수 항목 입니다';
  color: #d94f4f;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  bottom: 5px;
}
</style>
