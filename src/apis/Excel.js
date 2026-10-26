import Api, { issueAccessToken } from './Api';
import axios from 'axios';
import store from '@/store';
// import slack from '@/plugins/slack';

const productionPath = 'https://dentii-excel.kai-i.com'; // 실서버 API 경로
const developmentPath = 'https://dentii2023-dev.kai-i.com'; // 개발서버 API 경로

const baseURL = process.env.NODE_ENV === 'production' ? productionPath : developmentPath;
let BaseApi = axios.create({
  baseURL: baseURL,
});

BaseApi.interceptors.response.use(
  async res => {
    if (res.data.type === 'application/json') {
      let rt;
      await res.data.text().then(json => {
        rt = JSON.parse(json).rt;
      });
      if (rt === 403) {
        // token 재발행 및 반환
        const res2 = await issueAccessToken();
        // res.data : 서버 통신 성공, res.data.rt === 200 : 통신 이후 정상 토큰 발급 성공
        if (res2.data && res2.data.rt === 200) {
          res.config.headers.Authorization = store.state.user.accessToken;
        } else {
          store.commit('isOk', true);
          return store.dispatch('user/logout');
        }
        return await BaseApi.request(res.config);
      }
    }
    return res;
  },
  () => {
    // err => {
    // if (process.env.NODE_ENV === 'production') {
    //   slack.send(err);
    // }
    alert('서버를 불러오고 있습니다. 잠시후 시도해주세요.');
    store.commit('loading', false);
  },
);

let ExcelApi = login => {
  const token = store.state.user.accessToken ? store.state.user.accessToken : localStorage.getItem('accessToken');

  if (login) {
    delete BaseApi.defaults.headers.common['Authorization'];
  } else if (token) {
    BaseApi.defaults.headers.common['Authorization'] = token;
  }

  // 지역 코드
  BaseApi.defaults.headers.common['doCode'] = store.getters['business/districtInfo'].code;
  // 운영서버 여부
  BaseApi.defaults.headers.common['isProduction'] = process.env.NODE_ENV === 'production';

  return BaseApi;
};

export default {
  businessStudentFList(form, signal) {
    // 사업관리 > 학생 치과주치의 API
    return ExcelApi().get('/excelDownload/business/student-f-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  businessStudentEList(form, signal) {
    // 사업관리 > 학생 구강검진 API
    return ExcelApi().get('/excelDownload/business/student-e-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  businessStudentCList(form, signal) {
    // 사업관리 > 아동 치과주치의 API
    return ExcelApi().get('/excelDownload/business/student-c-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  surveyList(form, signal) {
    // 사업관리 > 만족도조사
    return ExcelApi().get('/excelDownload/business/survey-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  managementStudentList(form, signal) {
    // 회원관리 > 학생 API
    return ExcelApi().get('/excelDownload/user/student-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  centerList(form, signal) {
    // 회원관리 > 센터 현황 API
    return ExcelApi().get('/excelDownload/organ/center-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  hospitalList(form, signal) {
    // 회원관리 > 병원 현황 API
    return ExcelApi().get('/excelDownload/organ/hospital-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  hospitalTempList(headers) {
    // 회원관리 > 병원 임시 계정 현황 API
    return ExcelApi().get('/excelDownload/organ/hospital-temp-list', {
      responseType: 'blob',
      headers,
    });
  },
  schoolList(form, signal) {
    // 회원관리 > 학교 현황 API
    return ExcelApi().get('/excelDownload/organ/school-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  healthcareList(form, signal) {
    // 회원관리 > 보건소 현황 API
    return ExcelApi().get('/excelDownload/organ/healthCare-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  billMonthClaimList(form, signal) {
    // 비용청구서 청구/지급 API
    return ExcelApi().get('/excelDownload/bill/month-claim-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  hospitalBillClaimList(form, signal) {
    // 병원 비용청구서 청구/세부 내역 API
    return ExcelApi().get('/excelDownload/hospital/bill/month-claim-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  schoolBillClaimList(form, signal) {
    // 학교 비용청구서 청구/세부 내역 API
    return ExcelApi().get('/excelDownload/school/bill/month-claim-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  // TODO : 아래부터는 엑셀 서버가 아닌 각 지역 운영서버로 다운로드
  schoolStudentList(form, signal) {
    // 학교 > 학생 검진 API
    return Api().get('/excelDownload/student/check-up-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  statisticsRecordGyeonggiList(form, signal) {
    // 종합실적(경기) API
    return Api().get('/excelDownload/overallPerformance/gyeonggi', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  gyeonggiQuestionnaire(form, signal) {
    // 문진표 - 경기도
    return Api().get('/excelDownload/questionnaire/gyeonggi', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  gyeonggiSurvey(form, signal) {
    // 만족도조사 - 경기도
    return Api().get('/excelDownload/survey/gyeonggi', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  gyeonggiQuestionnaireSurvey(form, signal) {
    // 사후설문조사 - 경기도
    return Api().get('/excelDownload/questionnaire-survey/gyeonggi', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  gyeonggiHealthCareSurvey(form, signal) {
    // 보건소 만족도조사 - 경기도
    return Api().get('/excelDownload/healthCare-survey/gyeonggi', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  gyeonggiHospitalSurvey(form, signal) {
    // 병원 만족도조사 - 경기도
    return Api().get('/excelDownload/hospital-survey/gyeonggi', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  gyeonggiSchoolSurvey(form, signal) {
    // 학교 만족도조사 - 경기도
    return Api().get('/excelDownload/school-survey/gyeonggi', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  schoolStatistics(form, signal) {
    // 학교별 현황 - 경기도
    return Api().get('/excelDownload/school-statistics/gyeonggi', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  schoolStatisticsDetail(form, signal) {
    // 학교별 현황 상세 - 경기도
    return Api().get('/excelDownload/school-statistics-detail/gyeonggi', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  eduSiteStatistics(form, signal) {
    // 학교용 교육 학습 현황 - 수원시
    return Api().get('/excelDownload/edu-site/suwon', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  statisticsRecordSeoulList(form, signal) {
    // 종합실적(서울) API
    return Api().get('/excelDownload/overallPerformance/seoul', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  statisticsRecordBusanList(form, signal) {
    // 종합실적(부산) API
    return Api().get('/excelDownload/overallPerformance/busan', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  statisticsRecordOtherList(form, signal) {
    // 종합실적(타지역) API
    return Api().get('/excelDownload/overallPerformance/other', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  schoolHospitalList(form, signal) {
    // 학교 계정 > 병원 목록 API
    return Api().get('/excelDownload/hospital/business-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
};
