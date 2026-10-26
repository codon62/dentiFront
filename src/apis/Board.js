import Api from './Api';

export default {
  noticeBoardRegist(form, signal) {
    // 공지사항 등록/수정
    return Api().post('/board/noticeBoard-regist', form, { headers: { 'Content-Type': 'multipart/form-data', signal } });
  },
  noticeBoardList(form, signal) {
    // 공지사항 페이징 목록 조회
    return Api().get('/board/noticeBoard-list', { params: form, signal });
  },
  noticeBoardInfo(form, signal) {
    // 공지사항 상세정보 조회
    return Api().get('/board/noticeBoard-info', { params: form, signal });
  },
  noticeBoardDelete(form, signal) {
    // 공지사항 삭제
    return Api().delete('/board/noticeBoard-delete', { data: form, signal });
  },
  healthCenterHospitalDashBoardList(form, signal) {
    // 보건소 및 병원 대시보드 조회
    return Api().get('/dashboard/healthCareAndHospital', { params: form, signal });
  },
  schoolDashBoardList(form, signal) {
    // 학교 대시보드 조회
    return Api().get('/dashboard/school', { params: form, signal });
  },
  centerDashBoardList(form, signal) {
    // 센터 대시보드 조회
    return Api().get('/dashboard/center', { params: form, signal });
  },
  gyeonggiHealthCareAndHospitalDashBoardList(form, signal) {
    // 경기 보건소 및 병원 대시보드 조회
    return Api().get('/dashboard/healthCareAndHospital/gyeonggi', { params: form, signal });
  },
  gyeonggiSchoolDashBoardList(form, signal) {
    // 경기 학교 대시보드 조회
    return Api().get('/dashboard/school/gyeonggi', { params: form, signal });
  },
  useHealthCareAndHospitalDashBoardList(form, signal) {
    // 울산 보건소 및 병원 대시보드 조회
    return Api().get('/dashboard/healthCareAndHospital/use', { params: form, signal });
  },
  useSchoolDashBoardList(form, signal) {
    // 울산 학교 대시보드 조회
    return Api().get('/dashboard/school/use', { params: form, signal });
  },
  inquiryCategoryList(form, signal) {
    // 보건소 문의 > 카테고리 목록 조회
    return Api().get('/inquiry/category-list', { params: form, signal });
  },
  inquiryList(form, signal) {
    // 보건소 문의 > 페이징 목록 조회
    return Api().get('/inquiry/list', { params: form, signal });
  },
  inquiryInfo(form, signal) {
    // 보건소 문의 > 상세정보 조회
    return Api().get('inquiry/info', { params: form, signal });
  },
  inquiryQuestionRegist(form, signal) {
    // 보건소 문의 > 질문 등록/수정
    return Api().post('/inquiry/question-regist', form, { signal });
  },
  inquiryAnswerRegist(form, signal) {
    // 보건소 문의 > 답변 등록/수정
    return Api().post('/inquiry/answer-regist', form, { signal });
  },
  inquiryDelete(form, signal) {
    // 보건소 문의 > 삭제
    return Api().delete('/inquiry/delete', { data: form, signal });
  },
  faqRegist(form, signal) {
    // 자주하는 질문 등록/수정
    return Api().post('/faq/regist', form, { headers: { 'Content-Type': 'multipart/form-data', signal } });
  },
  faqList(form, signal) {
    // 자주하는 질문 페이징 목록 조회
    return Api().get('/faq/list', { params: form, signal });
  },
  faqInfo(form, signal) {
    // 자주하는 질문 상세정보 조회
    return Api().get('/faq/info', { params: form, signal });
  },
  faqDelete(form, signal) {
    // 자주하는 질문 삭제
    return Api().delete(`/faq/delete/${form.faqId}`, { signal });
  },
};
