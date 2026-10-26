import Api from './Api';

export default {
  billMonthClaimListPdf(form, signal) {
    // 비용청구서 청구/지급 목록 PDF 다운로드
    return Api().get('/documentFile/month-claim/pdf', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  businessStudentListPdf(form, signal) {
    // [사업관리] 학생 각 서식 PDF 일괄다운로드 (보건소)
    return Api().get('/documentFile/download/business/student-pdf-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  schoolStudentListPdf(form, signal) {
    // [학교] 학생 각 서식 일괄다운로드 API
    return Api().get('/documentFile/download/school/student-pdf-list', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  hospitalFamdocStudentListPdf(form, signal) {
    // [병원] 학생치과주치의 학생 각 서식 일괄다운로드
    return Api().get('/documentFile/download/hospital/student-pdf-list-f', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  hospitalExamineStudentListPdf(form, signal) {
    // [병원] 힉생구강검진 학생 각 서식 일괄다운로드
    return Api().get('/documentFile/download/hospital/student-pdf-list-e', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  hospitalChildStudentListPdf(form, signal) {
    // [병원] 아동치과주치의 학생 각 서식 일괄다운로드
    return Api().get('/documentFile/download/hospital/student-pdf-list-c', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  hospitalSelectStudentListPdf(form, signal) {
    // [병원] 선택검진 학생 각 서식 일괄다운로드
    return Api().get('/documentFile/download/hospital/student-pdf-list-s', {
      params: form,
      responseType: 'blob',
      signal,
    });
  },
  pdfLog(form, signal) {
    // PDF 또는 각종 서식 일괄 다운로드
    return Api().get('/documentFile/download/pdf-log-save', { params: form, signal });
  },
};
