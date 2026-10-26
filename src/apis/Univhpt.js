import Api from './Api';

export default {
  intensiveNotificationInfo(form, signal) {
    // 심화치료 통보서 정보 조회
    return Api().get('/intensiveNotification/info', { params: form, signal });
  },
  deepTreatStudentList(form, signal) {
    // 심화치료 학생 목록 조회
    return Api().get('/student/deep-treat-student-list', { params: form, signal });
  },
  intensiveNotificationRegist(form, signal) {
    // 심화치료 통보서 등록 (임시저장, 최종제출)
    return Api().post('/intensiveNotification/regist', form, { headers: { 'Content-Type': 'multipart/form-data', signal } });
  },
};
