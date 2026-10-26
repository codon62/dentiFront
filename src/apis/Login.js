import Api from './Api';

export default {
  organ(form, ip) {
    // 기관회원 로그인
    return Api(true).post('/login/organ', form, { headers: { 'LOGIN-IP': ip } });
  },
  organInfo() {
    // 기관회원 로그인 정보 업데이트
    return Api().put('/login/organ-info');
  },
  healthCareHospitalChange() {
    // 보건소치과 계정 전환
    return Api().put('/login/healthCare-hospital-change');
  },
  admin(form, ip) {
    // 관리자회원 로그인
    return Api(true).post('/login/admin', form, { headers: { 'LOGIN-IP': ip } });
  },
  adminInfo() {
    // 관리자회원 로그인 정보 업데이트
    return Api().put('/login/admin-info');
  },
};
