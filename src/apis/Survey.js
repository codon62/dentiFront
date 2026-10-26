import Api from './Api';

export default {
  healthCareSurveyRegist(form, signal) {
    // 경기도 보건소 사업 만족도조사 등록
    return Api().post('/healthCare/survey-regist', form, { signal });
  },
  hospitalSurveyRegist(form, signal) {
    // 경기도 병원 사업 만족도조사 등록
    return Api().post('/hospital/survey-regist', form, { signal });
  },
  schoolSurveyRegist(form, signal) {
    // 경기도 학교 사업 만족도조사 등록
    return Api().post('/school/survey-regist', form, { signal });
  },
};
