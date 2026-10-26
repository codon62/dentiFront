import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import popup from './modules/popup';
import student from './modules/student';
import doc from './modules/doc';
import status from './modules/status';
import hospital from './modules/hospital';
import business from './modules/business';
import definedCode from './modules/definedCode';
import date from './modules/date';
import hospitalDocument from '@/store/modules/hospitalDocument';
import ip from '@/store/modules/ip';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isOk: true,
    update: false,
    update2: false,
    isLoading: false,
    tableIsLoading: false,
  },
  mutations: {
    isOk(state, payload) {
      state.isOk = payload;
    },
    update(state) {
      state.update = !state.update;
    },
    update2(state) {
      state.update2 = !state.update2;
    },
    loading(state, payload) {
      state.isLoading = payload;
    },
    tableLoading(state, payload) {
      state.tableIsLoading = payload;
    },
  },
  modules: {
    user,
    popup,
    student,
    doc,
    status,
    hospital,
    hospitalDocument,
    business,
    definedCode,
    date,
    ip,
  },
});
