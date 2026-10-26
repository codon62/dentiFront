import Api from './Api';

export default {
  reportListGyeonggi(form, signal) {
    // 종합 실적 조회 - 경기도
    return Api().get('/statistics/overallPerformance/gyeonggi', { params: form, signal });
  },
  eduSiteStatistics(form, signal) {
    // 학교용 교육 학습 현황 - 수원시
    return Api().get('/statistics/edu-site/suwon', { params: form, signal });
  },
  schoolStatistics(form, signal) {
    // 학교별 현황 - 경기도
    return Api().get('/statistics/school-statistics/gyeonggi', { params: form, signal });
  },
  schoolStatisticsDetail(form, signal) {
    // 학교별 현황 상세 - 경기도
    return Api().get('/statistics/school-statistics-detail/gyeonggi', { params: form, signal });
  },
  survey(form, signal) {
    // 설문조사 - 경기도
    return Api().get('/statistics/survey/gyeonggi', { params: form, signal });
  },
  automaticReport(form, signal) {
    // 자동보고서 조회
    return Api().get('/statistics/automatic-report', { params: form, signal });
  },
  reportListSeoul(form, signal) {
    // 종합 실적 조회 - 서울
    return Api().get('/statistics/overallPerformance/seoul', { params: form, signal });
  },
  reportListBusan(form, signal) {
    // 종합 실적 조회 - 부산
    return Api().get('/statistics/overallPerformance/busan', { params: form, signal });
  },
  reportListOther(form, signal) {
    // 종합 실적 조회 - 타지역
    return Api().get('/statistics/overallPerformance/other', { params: form, signal });
  },
};
