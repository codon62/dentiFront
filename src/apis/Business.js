import Api from './Api';

export default {
  studentList(form, signal) {
    // 학생 페이징 목록 조회
    return Api().get('/business/student-list', { params: form, signal });
  },
  notificationHistory(form, signal) {
    // 회차 별 진료계획서, 내역서 목록 조회
    return Api().get('/notification/history', { params: form, signal });
  },
  studentToHospitalCancel(form, signal) {
    // 병원 지정 취소
    return Api().delete('/business/studentToHospital-cancel', { data: form, signal });
  },
  treatmentPlanApprovalOrRejection(form, signal) {
    // 진료계획서 > 승인/거절
    return Api().put('/business/treatmentPlan-approvalOrRejection', form, { signal });
  },
  treatmentPlanStudentBusinessDivisionCStudentList(form, signal) {
    // 진료계획 > 아동치과주치의학생 페이징 목록 조회
    return Api().get('/business/treatmentPlan-studentBusinessDivisionCStudent-list', { params: form, signal });
  },
  treatmentChargeList(form, signal) {
    // 진료수가 페이징 목록 조회
    return Api().get('/business/treatmentCharge-list', { params: form, signal });
  },
  treatmentChargeRegist(form, signal) {
    // 진료수가 > 등록/수정
    return Api().post('/business/treatmentCharge-regist', form, { signal });
  },
  treatmentChargeDelete(form, signal) {
    // 진료수가 삭제
    return Api().delete('/business/treatmentCharge-delete', { data: form, signal });
  },
  studentCheckToggle(form, signal) {
    // 학생 확인 토글
    return Api().post('/business/studentCheck-toggle', form, { signal });
  },
  intensiveRequestApprovalOrRejection(form, signal) {
    // 심화치료의뢰서 > 승인/거절
    return Api().put('/business/intensiveRequest-approvalOrRejection', form, { signal });
  },
  intensiveRequestStudentBusinessDivisionCStudentList(form, signal) {
    // 심화치료 페이징 목록 조회
    return Api().get('/business/intensiveRequest-studentBusinessDivisionCStudent-list', { params: form, signal });
  },
  intensiveRequestRegist(form, signal) {
    // 심화치료의뢰서 등록 (임시저장, 최종제출)
    return Api().post('/business/intensiveRequest-regist', form, { headers: { 'Content-Type': 'multipart/form-data', signal } });
  },
  intensiveRequestInfo(form, signal) {
    // 심화치료 의뢰서 정보 조회
    return Api().get('/business/intensiveRequest-info', { params: form, signal });
  },
  studentLogList(form, signal) {
    return Api().get('/business/studentLog-list', { params: form, signal });
  },
  treatmentPlanDelete(form, signal) {
    // 진료계획서 의뢰취소
    return Api().delete(`/treatmentPlan/cancel/${form.notificationId}`, { signal });
  },
  treatmentPlanDeleteReason(form, signal) {
    // 진료계획서 의뢰취소 (사유 포함)
    return Api().delete('/treatmentPlan/cancel-reason', { data: form, signal });
  },
  intensiveRequestDelete(form, signal) {
    // 심화치료 의뢰서 의뢰취소
    return Api().delete(`/business/intensiveRequest-cancel/${form.studentId}`, { signal });
  },
  intensiveRequestDeleteReason(form, signal) {
    // 심화치료 의뢰서 의뢰취소 (사유 포함)
    return Api().delete('/business/intensiveRequest-cancel-reason', { data: form, signal });
  },
  infoAgreeFileDelete(form, signal) {
    // 개인정보활용동의 삭제
    return Api().delete(`/business/infoAgreeFile/delete/${form.studentBusinessId}`, { signal });
  },
};
