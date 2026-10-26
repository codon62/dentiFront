import Api from './Api';

export default {
  notificationRollback(form, signal) {
    // 회원관리 > 학생 > 통보서 임시저장
    return Api().put(`/admin/notification/rollback/${form.notificationId}`, { signal });
  },
  studentAppRollback(form, signal) {
    // 회원관리 > 학생 > 앱 연동 해제 (초기화)
    return Api().delete('/admin/student-app/rollback', { data: form, signal });
  },
  hptNumModify(form, signal) {
    // 회원관리 > 병원 > 사업자 번호 변경 + 로그인 아이디 변경
    return Api().put('/admin/hospital/business-num-modify', form, { signal });
  },
  infoAgreeFileDelete(form, signal) {
    // 개인정보활용동의 삭제
    return Api().delete(`/admin/infoAgreeFile/delete/${form.studentBusinessId}`, { signal });
  },
  studentAppAgreeUpdate(form, signal) {
    // 개인정보활용동의 APP동의 처리
    return Api().put('/admin/studentApp/agree-update', form, { signal });
  },
  studentAppAgreeDelete(form, signal) {
    // 개인정보활용동의 삭제
    return Api().delete(`/admin/studentApp/agree-delete/${form.studentId}`, { signal });
  },
  questionnaireDelete(form, signal) {
    // 문진표 삭제
    return Api().delete(`/admin/questionnaire/delete/${form.questionnaireId}`, { signal });
  },
  notificationDelete(form, signal) {
    // 통보서 삭제
    return Api().delete(`/admin/notification/delete/${form.notificationId}`, { signal });
  },
  treatmentPlanStatusUpdate(form, signal) {
    // 진료계획서 상태값 변경
    return Api().put('/admin/treatment-plan/status-update', form, { signal });
  },
  statementDelete(form, signal) {
    // 내역서 삭제
    return Api().delete(`/admin/statement/delete/${form.notificationId}`, { signal });
  },
  billStatusRollback(form, signal) {
    // 비용청구서 처리완료 -> 청구중으로 변경
    return Api().put('/admin/bill/status-rollback', form, { signal });
  },
  passwordModify(form, signal) {
    // 초기 비밀번호 변경
    return Api().put('/admin/password-modify', form, { signal });
  },
  gyeonggiReport(form, signal) {
    // 종합실적(경기) 보고 데이터 엑셀 다운로드 API
    return Api().get('/admin/excelDownload/gyeonggi-report', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  gyeonggiReportData(signal) {
    // 종합실적(경기) 성과 보고 엑셀 다운로드 API
    return Api().get('/admin/excelDownload/gyeonggi-report-data', {
      responseType: 'blob',
      signal,
    });
  },
  authIp(form) {
    // IP 인가 검사 API
    return Api().get('/admin/auth/ip', { params: form });
  },
};
