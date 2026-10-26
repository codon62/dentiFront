import Api from './Api';

export default {
  monthClaimList(form, signal) {
    // 청구/지급 페이징 목록 조회
    return Api().get('/bill/month-claim-list', { params: form, signal });
  },
  claimInfoList(form, signal) {
    // 청구/지급 > 상세 목록 조회
    return Api().get('/bill/claim-info-list', { params: form, signal });
  },
  judge(form, signal) {
    // 지급/반려 처리 (일괄 지급 포함)
    return Api().put('/bill/judge', form, { signal });
  },
  billMonthJudge(form, signal) {
    // 월별 비용청구서 지급/반려 처리
    return Api().put('/bill/billMonth-judge', form, { signal });
  },
  rejectList(form, signal) {
    // 반려 페이징 목록 조회
    return Api().get('/bill/reject-list', { params: form, signal });
  },
  hospitalDocumentInfo(form, signal) {
    // 회계 자료 조회
    return Api().get('/hospitalDocument/info', { params: form, signal });
  },
  hospitalDocumentCheckList(form, signal) {
    // 회계 자료 확인 목록 조회
    return Api().get('/hospitalDocument/check-list', { params: form, signal });
  },
  hospitalDocumentCheck(form, signal) {
    // 회계 자료 확인
    return Api().put('/hospitalDocument/check', form, { signal });
  },
  billMonthCheckToggle(form, signal) {
    // 월 별 비용청구서 확인 토글
    return Api().post('/bill/billMonthCheck-toggle', form, { signal });
  },
  billCheckToggle(form, signal) {
    // 비용청구서 확인 토글
    return Api().post('/bill/billCheck-toggle', form, { signal });
  },
  billRejectReason(form, signal) {
    // 비용청구서 최신 반려 사유 조회
    return Api().get('/bill/latest-BillRejectReason-info', { params: form, signal });
  },
  billStatusRollback(form, signal) {
    // 비용청구서 청구중 롤백
    return Api().put('/bill/status-rollback', form, { signal });
  },
};
