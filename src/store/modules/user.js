import router from '@/router';
import store from '@/store/index';

const getDefaultState = () => {
  return {
    accessToken: '',
    refreshToken: '',
    userOrganId: '',
    userOrganTargetType: '',
    districtCode: '',
    districtName: '',
    userOrganTargetId: '',
    userOrganTargetName: '',
    userOrganPasswordModify: null,
    business: null,
    schoolEmail: null,
    hospitalVideoEdu: null,
    hospitalType: null,
    cityType: null,
    healthCareType: null,
    healthCareList: null,
    surveyCheck: null,
    selfCheckListIsDone: null,
    adminOrganType: '', // 관리자 : AD, 기관 : ALL
    deldate: null,
    registrationAvailable: null,
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetUserState(state) {
      Object.assign(state, getDefaultState());
    },
    setLoginUserInfo(state, payload) {
      Object.assign(state, payload);
    },
    setAccessToken(state, payload) {
      state.accessToken = payload;
    },
    setUserOrganPasswordModify(state, payload) {
      state.userOrganPasswordModify = payload;
    },
    setSchoolEmail(state, payload) {
      state.schoolEmail = payload;
    },
    setHospitalVideoEdu(state, payload) {
      state.hospitalVideoEdu = payload;
    },
    setSurveyCheck(state, payload) {
      state.surveyCheck = payload;
    },
    setHealthCareSurveyId(state, payload) {
      state.healthCareList.find(healthCare => healthCare.districtCode === payload.districtCode).healthCareSurveyId = payload.healthCareSurveyId;
    },
    setSelfCheckListIsDone(state, payload) {
      state.selfCheckListIsDone = payload;
    },
    setRegistrationAvailable(state, payload) {
      state.registrationAvailable = payload;
    },
  },
  actions: {
    updateInfo({ commit }, payload) {
      commit('setLoginUserInfo', payload);
      localStorage.setItem('adminOrganType', payload.adminOrganType);
      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
    },
    logout({ state, commit }) {
      const adminOrganType = state.adminOrganType ? state.adminOrganType : localStorage.getItem('adminOrganType');
      commit('resetUserState');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      commit('popup/popupClear', null, { root: true });
      if (process.env.NODE_ENV === 'production') {
        Gitple('update'); // 깃플챗 로그아웃
      }
      router.push(adminOrganType === 'AD' ? '/login/admin' : '/login').catch(() => {});
    },
  },
  getters: {
    districtCodeFirst(state) {
      return state.districtCode.charAt(0);
    },
    secondHealthCareList(state) {
      return state.healthCareList?.filter(healthCare => healthCare.healthCareDepth === 2);
    },
    healthCareSurveyCheck(state) {
      const healthCareList = store.getters['user/secondHealthCareList'].length > 0 ? store.getters['user/secondHealthCareList'] : state.healthCareList;
      return healthCareList.filter(healthCare => !healthCare.healthCareSurveyId).length === 0;
    },
  },
};
