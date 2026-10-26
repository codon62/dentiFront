import Api from './Api';

export default {
  hospitalSelfCheckInfo(hospitalId, signal) {
    // 병원 자율점검표 조회
    return Api().get(`/hospital/self-check-list/${hospitalId}`, { signal });
  },
  hospitalSelfCheckRegist(form, signal) {
    // 병원 자율점검표 등록 및 수정
    return Api().post('/hospital/self-check-list', form, { signal });
  },
  hospitalSelfCheckReset(hospitalId, signal) {
    // 병원 자율점검표 초기화
    return Api().delete(`/admin/self-check-list/reset/${hospitalId}`, { signal });
  },
};
