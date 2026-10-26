import VueCookies from 'vue-cookies/vue-cookies';
import store from '@/store/index';

const getDefaultState = () => {
  return {
    contents: '',
    afterContents: [],
    params: {},
    view: false,
    view2: false,
    view3: false,
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    popupClear(state) {
      Object.assign(state, getDefaultState());
    },
    popupView(state, payload) {
      const { contents, params, afterContents } = payload;
      state.contents = contents;
      if (params) state.params = params;
      if (afterContents) state.afterContents = afterContents;
      state.view = true;
    },
    popupView2(state) {
      state.view2 = true;
    },
    popupView3(state) {
      state.view2 = false;
      state.view3 = true;
    },
    popupNext(state) {
      state.contents = state.afterContents.shift();
    },
  },
  actions: {
    popupOpen({ commit }, payload) {
      // 팝업 열기
      const { contents } = payload;
      let firstContents = '';
      let afterContents = [];
      if (typeof contents === 'object') {
        for (const val of contents) {
          if (!VueCookies.isKey(`${val}Popup_${store.state.user.userOrganId}_${store.state.user.adminOrganType}`)) {
            if (firstContents === '') {
              firstContents = val;
            } else {
              afterContents.push(val);
            }
          }
        }
      } else if (!VueCookies.isKey(`${contents}Popup_${store.state.user.userOrganId}_${store.state.user.adminOrganType}`)) {
        firstContents = contents;
      }
      if (firstContents !== '') {
        payload.contents = firstContents;
        payload.afterContents = afterContents;
        commit('popupView', payload);
        document.querySelector('body').classList.add('hidden');
      }
    },
    popupClose({ state, commit }) {
      // 팝업 닫기
      if (state.afterContents.length) {
        commit('popupNext');
      } else {
        commit('popupClear');
        document.querySelector('body').classList.remove('hidden');
      }
    },
    todayClose({ state, commit }) {
      // 오늘 하루 보지 않기
      VueCookies.set(`${state.contents}Popup_${store.state.user.userOrganId}_${store.state.user.adminOrganType}`, 'Y', '1d');
      if (state.afterContents.length) {
        commit('popupNext');
      } else {
        commit('popupClear');
        document.querySelector('body').classList.remove('hidden');
      }
    },
    customClose({ state, commit }, endDate) {
      // 지정한 일자까지 보지 않기
      const endDateWithTime = new Date(endDate);
      endDateWithTime.setHours(23, 59, 59);
      const count = Math.ceil((endDateWithTime - new Date()) / (1000 * 60 * 60 * 24));
      VueCookies.set(`${state.contents}Popup_${store.state.user.userOrganId}_${store.state.user.adminOrganType}`, 'Y', `${count}d`);
      if (state.afterContents.length) {
        commit('popupNext');
      } else {
        commit('popupClear');
        document.querySelector('body').classList.remove('hidden');
      }
    },
  },
};
