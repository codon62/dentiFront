import axios from 'axios';
import Api from './Api';

export default {
  getIp() {
    return axios.get('https://api.ip.pe.kr/');
  },
  healthCareList(form, signal) {
    // 보건소 목록 조회
    return Api().get('/healthCare/web-list', { params: form, signal });
  },
  healthCareSecondList(form, signal) {
    // 2차 보건소 목록 조회
    return Api().get('/healthCare/second-list', { params: form, signal });
  },
  healthCareBusinessList(form, signal) {
    // 참여 사업 별 보건소 목록 조회
    return Api().get('/healthCare/business-list', { params: form, signal });
  },
  centerList(form, signal) {
    // 센터 리스트 조회
    return Api().get('/center/web-list', { params: form, signal });
  },
  hospitalList(form, signal) {
    // 병원 목록 조회
    return Api().get('/hospital/web-list', { params: form, signal });
  },
  schoolList(form, signal) {
    // 학교 목록 조회
    return Api().get('/school/web-list', { params: form, signal });
  },
  bankList() {
    // 은행 리스트 조회
    return Api().get('/hospital/bank-list');
  },
};
