import Api from './Api';

export default {
  automaticReportLogSave(form, signal) {
    // 자동보고서 인쇄 로그 저장
    return Api().get('/documentFile/log-save/automatic-report', { params: form, signal });
  },
};
