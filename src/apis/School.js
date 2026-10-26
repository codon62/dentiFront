import Api from './Api';

export default {
  info(form, signal) {
    // 학교 정보 조회
    return Api().get('/school/info', { params: form, signal });
  },
  modify(form, signal) {
    // 학교 정보 수정
    return Api().put('/school/modify', form, { signal });
  },
  emailModify(form, signal) {
    // 학교 이메일 수정
    return Api().put('/school/email-modify', form, { signal });
  },
  studentList(form, signal) {
    // 사업 별 학생 목록 조회
    return Api().get('/studentToSchool/student-list', { params: form, signal });
  },
  notScreenRegist(form, signal) {
    // 미수검 사유 등록
    return Api().post('/student/not-screen-regist', form, { signal });
  },
  hospitalBusinessList(form, signal) {
    // 사업 별 병원 목록 조회
    return Api().get('/hospital/business-list', { params: form, signal });
  },
  contractFileUpload(form, signal) {
    // 계약 서류 등록
    return Api().post('/contract-file/upload', form, { signal });
  },
  contractFileDelete(form, signal) {
    // 계약 서류 삭제
    return Api().delete('/contract-file/delete', { data: form, signal });
  },
  contractFileList(form, signal) {
    // 계약 서류 목록 조회
    return Api().get('/contract-file/list', { params: form, signal });
  },
  contractList(form, signal) {
    // 사업 신청 목록 조회(계약관리)
    return Api().get('/contract/list', { params: form, signal });
  },
  contractUpdate(form, signal) {
    // 사업 신청 승인(계약관리)
    return Api().put('/contract/update', form, { signal });
  },
  billList(form, signal) {
    // 비용청구서 목록 조회
    return Api().get('/bill/school-bill-list', { params: form, signal });
  },
  billHospitalList(form, signal) {
    // 비용청구서 병원별 목록 조회
    return Api().get('/bill/school-bill-hospital-list', { params: form, signal });
  },
  transferOut(form, signal) {
    // 학생 전출
    return Api().delete(`/studentToSchool/transfer-out/${form.studentId}`, { signal });
  },
  transferredStudentList(form, signal) {
    // 전출 학생 목록 조회
    return Api().get('/studentToSchool/transferred-student-list', { params: form, signal });
  },
  transfer(form, signal) {
    // 학생 전입
    return Api().put('/studentToSchool/transfer', form, { signal });
  },
  studentUpload(form, signal) {
    // 학교-학생 명단 업로드
    return Api().post('/studentToSchool/student-upload', form, { headers: { 'Content-Type': 'multipart/form-data', signal } });
  },
};
