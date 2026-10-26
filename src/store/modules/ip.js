const getDefaultState = () => {
  return {
    ip: '',
    isKaii: false,
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    setIp(state, payload) {
      state.ip = payload;
    },
    setIsKaii(state, payload) {
      state.isKaii = payload;
    },
  },
  getters: {
    getKaiiIp() {
      return '121.170.215.95';
    },
  },
};
