import Api from './Api';

export default {
  passwordReset(form, signal) {
    // 비밀번호 초기화
    return Api().put('/hospital/password-reset', form, { signal });
  },
  passwordModify(form, signal) {
    // 초기 비밀번호 변경
    return Api().put('/organ/password-modify', form, { signal });
  },
  info(form, signal) {
    // 병원 정보 조회
    return Api().get('/hospital/info', { params: form, signal });
  },
  infoModify(form, signal) {
    // 병원 정보 수정
    return Api().put('/hospital/modify', form, { signal });
  },
  accountInfo(form, signal) {
    // 병원 계좌 정보 조회
    return Api().get('/hospital/account-info', { params: form, signal });
  },
  accountInfoModify(form, signal) {
    // 병원 계좌 정보 수정
    return Api().put('/hospital/account-modify', form, { signal });
  },
  studentRegistListF(form, signal) {
    // 학생치과주치의 학생 목록 조회 (등록 전 학생)
    return Api().get('/studentToHospital/student-regist-list-f', { params: form, signal });
  },
  studentRegistListE(form, signal) {
    // 학생구강검진 학생 목록 조회 (등록 전 학생)
    return Api().get('/studentToHospital/student-regist-list-e', { params: form, signal });
  },
  studentRegistListC(form, signal) {
    // 아동치과주치의 학생 목록 조회 (등록 전 학생)
    return Api().get('/studentToHospital/student-regist-list-c', { params: form, signal });
  },
  studentRegistListS(form, signal) {
    // 선택검진 학생 목록 조회 (등록 전 학생)
    return Api().get('/studentToHospital/student-regist-list-s', { params: form, signal });
  },
  contractStudentRegistListE(form, signal) {
    // 학생구강검진 학생 목록 조회 (사업 승인 학교 등록 전 학생)
    return Api().get('/studentToHospital/contract-student-regist-list-e', { params: form, signal });
  },
  studentListF(form, signal) {
    // 학생치과주치의 학생 목록 조회 (등록 후 학생)
    return Api().get('/studentToHospital/student-list-f', { params: form, signal });
  },
  studentListE(form, signal) {
    // 학생구강검진 학생 목록 조회 (등록 후 학생)
    return Api().get('/studentToHospital/student-list-e', { params: form, signal });
  },
  studentListS(form, signal) {
    // 선택검진 학생 목록 조회 (등록 후 학생)
    return Api().get('/studentToHospital/student-list-s', { params: form, signal });
  },
  studentListC(form, signal) {
    // 아동치과주치의 학생 목록 조회 (홈화면)
    return Api().get('/studentToHospital/student-list-c', { params: form, signal });
  },
  studentRegistF(form, signal) {
    // 학생치과주치의 학생 등록 (병원 연결)
    return Api().post('/studentToHospital/student-regist-f', form, { signal });
  },
  studentRegistE(form, signal) {
    // 학생구강검진 학생 등록 (병원 연결)
    return Api().post('/studentToHospital/student-regist-e', form, { signal });
  },
  studentRegistC(form, signal) {
    // 아동치과주치의 학생 등록 (병원 연결)
    return Api().post('/studentToHospital/student-regist-c', form, { signal });
  },
  studentNewRegist(form, signal) {
    // 학생 신규 등록 및 병원 연결
    return Api().post('/studentToHospital/student-new-regist', form, { signal });
  },
  studentRegistCancel(form, signal) {
    // 학생 등록 취소
    return Api().delete('/studentToHospital/student-regist-cancel', { data: form, signal });
  },
  studentInfo(form, signal) {
    // 학생 정보 조회
    return Api().get('/student/info', { params: form, signal });
  },
  studentBusinessNoteRegist(form, signal) {
    // 미수검 사유 등록
    return Api().post('/student/studentBusinessNote-regist', form, { signal });
  },
  infoAgreeRegist(form, signal) {
    // 개인정보활용,위탁동의서 등록
    return Api().post('/info-agree/regist', form, { headers: { 'Content-Type': 'multipart/form-data', signal } });
  },
  infoAgreeInfo(form, signal) {
    // 개인정보활용,위탁동의서 조회
    return Api().get('/info-agree/info', { params: form, signal });
  },
  infoAgreeUpdate(form, signal) {
    // 개인정보활용,위탁동의서 재등록
    return Api().put('/info-agree/update', form, { headers: { 'Content-Type': 'multipart/form-data', signal } });
  },
  infoAgreeDirectRegist(form) {
    // 개인정보활용동의서 직접보관 등록
    return Api().post('/info-agree/direct/register', form);
  },
  infoAgreeDownload(form, signal) {
    // 사업관리 > 학생 치과주치의 API
    return Api().get('/info-agree/download', { params: form, responseType: 'blob', signal });
  },
  doctorList(form, signal) {
    // 의사 목록
    return Api().get('/hospital/doctor-list', { params: form, signal });
  },
  questionnaireRegist(form, signal) {
    // 문진표 등록 (임시저장, 최종제출)
    return Api().post('/questionnaire/regist', form, { signal });
  },
  questionnaireInfo(form, signal) {
    // 문진표 정보 조회
    return Api().get('/questionnaire/info', { params: form, signal });
  },
  questionnaireSurveyRegist(form, signal) {
    // 문진표 사후 설문조사 등록 (임시저장, 최종제출)
    return Api().post('/questionnaireSurvey/regist', form, { signal });
  },
  questionnaireSurveyInfo(form, signal) {
    // 문진표 사후 설문조사 정보 조회
    return Api().get('/questionnaireSurvey/info', { params: form, signal });
  },
  studentSurveyRegist(form, signal) {
    // 학생 만족도 조사 등록 (임시저장, 최종제출)
    return Api().post('/studentSurvey/regist', form, { signal });
  },
  studentSurveyInfo(form, signal) {
    // 학생 만족도 조사 정보 조회
    return Api().get('/studentSurvey/info', { params: form, signal });
  },
  notificationRegist(form, signal) {
    // 1회차 통보서 등록
    return Api().post('/notification/regist', form, { signal });
  },
  notificationAddRegist(form, signal) {
    // 2회차 이상 통보서 등록
    return Api().post('/notification/add-regist', form, { signal });
  },
  documentFileRegist(form, signal) {
    // 서식 파일 등록 (PDF)
    return Api().post('/documentFile/regist', form, { headers: { 'Content-Type': 'multipart/form-data', signal } });
  },
  notificationInfo(form, signal) {
    // 통보서 정보 조회
    return Api().get('/notification/info', { params: form, signal });
  },
  treatmentRequestRegist(form, signal) {
    // 진료의뢰서 등록 (임시저장, 최종제출)
    return Api().post('/treatmentRequest/regist', form, { signal });
  },
  treatmentRequestInfo(form, signal) {
    // 진료의뢰서 정보 조회
    return Api().get('/treatmentRequest/info', { params: form, signal });
  },
  treatmentRequestDeleteReason(form, signal) {
    // 진료의뢰서 의뢰취소 (사유 포함)
    return Api().delete('/treatmentRequest/cancel-reason', { data: form, signal });
  },
  treatmentPlanRegist(form, signal) {
    // 진료계획서 등록 (임시저장, 최종제출)
    return Api().post('/treatmentPlan/regist', form, { signal });
  },
  treatmentPlanInfo(form, signal) {
    // 진료계획서 정보 조회
    return Api().get('/treatmentPlan/info', { params: form, signal });
  },
  statementRegist(form, signal) {
    // 내역서 등록 (임시저장, 최종제출)
    return Api().post('/statement/regist', form, { headers: { 'Content-Type': 'multipart/form-data', signal } });
  },
  statementInfo(form, signal) {
    // 내역서 정보 조회
    return Api().get('/statement/info', { params: form, signal });
  },
  notificationHistory(form, signal) {
    // 회차 별 진료계획서, 내역서 목록 조회
    return Api().get('/notification/history', { params: form, signal });
  },
  hospitalBillList(form, signal) {
    // 비용청구서 목록 조회
    return Api().get('/bill/hospital-bill-list', { params: form, signal });
  },
  hospitalBillSchoolList(form, signal) {
    // 비용청구서 학교별 목록 조회
    return Api().get('/bill/hospital-bill-school-list', { params: form, signal });
  },
  hospitalBillSchoolDetailList(form, signal) {
    // 비용청구서 학교별 상세 목록 조회
    return Api().get('/bill/hospital-bill-school-detail-list', { params: form, signal });
  },
  hospitalContractYSchoolList(form, signal) {
    // 병원 계약 승인 학교 목록 조회
    return Api().get('/school/hospital-contractY-list', { params: form, signal });
  },
  contractSchoolList(form, signal) {
    // 계약관리 학교 목록 조회
    return Api().get('/school/contract-list', { params: form, signal });
  },
  contractFileList(form, signal) {
    // 계약 서류 목록 조회
    return Api().get('/contract-file/list', { params: form, signal });
  },
  contractRegist(form, signal) {
    // 계약관리 사업신청
    return Api().post('/contract/regist', form, { signal });
  },
  videoEduWatch(form, signal) {
    // 동영상 교육 시청 처리
    return Api().put('/hospital/video-edu-watch', form, { signal });
  },
  hospitalDocumentRegist(form, signal) {
    // 회계 자료 등록
    return Api().post('/hospitalDocument/regist', form, { headers: { 'Content-Type': 'multipart/form-data', signal } });
  },
  regNumHospital(form, signal) {
    // 사업자등록번호 병원 조회
    return Api().get('/hospital/regNum-hospital', { params: form, signal });
  },
  registTemporaryId(form, signal) {
    // 병원 임시계정 등록
    return Api().post('/hospital/regist-temporaryId', form, { signal });
  },
  openBusinessDivisionEAndDeleteTemporaryId(form, signal) {
    // 학생구강검진 참여 및 임시계정 삭제
    return Api().put('/hospital/businessDivisionE-deleteTemporaryId', form, { signal });
  },
  registAndDeleteTemporaryId(form, signal) {
    // 병원 등록 및 임시계정 삭제
    return Api().post('/hospital/regist-deleteTemporaryId', form, { signal });
  },
};
