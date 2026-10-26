import Api from './Api';

export default {
  healthcareList(form, signal) {
    // 보건소 페이징 목록 조회
    return Api().get('/management/healthCare-list', { params: form, signal });
  },
  centerList(form, signal) {
    // 센터 페이징 목록 조회
    return Api().get('/management/center-list', { params: form, signal });
  },
  schoolList(form, signal) {
    // 학교 페이징 목록 조회
    return Api().get('/management/school-list', { params: form, signal });
  },
  hospitalList(form, signal) {
    // 병원 페이징 목록 조회
    return Api().get('/management/hospital-list', { params: form, signal });
  },
  studentList(form, signal) {
    // 학생 페이징 목록 조회
    return Api().get('/management/student-list', { params: form, signal });
  },
  userList(form, signal) {
    // 앱 가입 페이징 목록 조회
    return Api().get('/management/user-list', { params: form, signal });
  },
  appointHospitalList(form, signal) {
    // 학생 > 병원 지정 > 병원 페이징 목록 조회
    return Api().get('/management/appoint-hospital-list', { params: form, signal });
  },
  studentToHospitalRegist(form, signal) {
    // 학생 > 병원 지정 > 등록
    return Api().post('/management/studentToHospital-regist', form, { signal });
  },
  passwordReset(form, signal) {
    // 비밀번호 초기화
    return Api().put('/management/password-reset', form, { signal });
  },
  eduRegist(form, signal) {
    // 학생 > 예방보건교육 이수 처리
    return Api().put('/management/prophylaxisHealthCareEdu-regist', form, { signal });
  },
  hospitalModify(form, signal) {
    // 병원 > 수정
    return Api().put('/management/hospital-modify', form, { signal });
  },
  healthCareModify(form, signal) {
    // 보건소 > 수정
    return Api().put('/management/healthCare-modify', form, { signal });
  },
  centerModify(form, signal) {
    // 센터 > 수정
    return Api().put('/management/center-modify', form, { signal });
  },
  schoolModify(form, signal) {
    // 학교 > 수정
    return Api().put('/management/school-modify', form, { signal });
  },
  healthCareInfo(form, signal) {
    // 보건소 상세정보 조회
    return Api().get('/management/healthCare-info', { params: form, signal });
  },
  delete(form, signal) {
    // 회원 삭제(비활성화)
    return Api().delete(`/management/delete/${form.userType}/${form.userId}`, { signal });
  },
  studentRegister(form, signal) {
    // 학생 신규 등록
    return Api().post('/student/register', form, { signal });
  },
  studentModify(form, signal) {
    // 학생 정보 수정 (검진유형 변경 포함)
    return Api().put('/student/modify', form, { signal });
  },
  hospitalRegister(form, signal) {
    //병원 신규 등록
    return Api().post('/hospital/regist', form, { signal });
  },
  beforeDeleteInfo(form, signal) {
    // 학생 > 삭제 시 고려 정보 조회
    return Api().get('/student/before-delete-info', { params: form, signal });
  },
  studentAppRollback(form, signal) {
    // 회원관리 > 학생 > 앱 연동 해제 (초기화)
    return Api().delete('/management/student-app/rollback', { data: form, signal });
  },
  schoolRegist(form, signal) {
    // 학교 신규 등록
    return Api().post('/school/regist', form, { signal });
  },
  centerRegist(form, signal) {
    // 센터 신규 등록
    return Api().post('/center/regist', form, { signal });
  },
};
