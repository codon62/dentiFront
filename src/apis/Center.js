import Api from './Api';

export default {
  centerInfo(form, signal) {
    // 센터 정보 조회
    return Api().get('/center/info', { params: form, signal });
  },
  centerModify(form, signal) {
    // 센터 정보 수정
    return Api().put('/center/modify', form, { signal });
  },
  studentList(form, signal) {
    // 학생 목록 조회
    return Api().get('/studentToCenter/student-list', { params: form, signal });
  },
  studentRegist(form, signal) {
    // 학생 신규 등록 (입소)
    return Api().post('/studentToCenter/student-regist', form, { signal });
  },
};
