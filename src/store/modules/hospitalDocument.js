const getDefaultState = () => {
  return {
    uncheckedHospitalCount: 0,
    hospitalDocumentCheckList: [],
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetState(state) {
      Object.assign(state, getDefaultState());
    },
    setHospitalDocumentCheckList(state, payload) {
      state.hospitalDocumentCheckList = payload;

      const hospitalSet = new Set(state.hospitalDocumentCheckList.filter(o => o.hospitalDocumentCheck === 'N').map(o => o.hospitalId));
      state.uncheckedHospitalCount = hospitalSet.size;
    },
    setHospitalDocumentCheck(state, payload) {
      const { hospitalId, type } = payload;
      const hospitalDocument = state.hospitalDocumentCheckList.find(o => o.hospitalId === hospitalId && o.hospitalDocumentType === type);
      if (hospitalDocument) {
        hospitalDocument.hospitalDocumentCheck = 'Y';
      }

      const hospitalSet = new Set(state.hospitalDocumentCheckList.filter(o => o.hospitalDocumentCheck === 'N').map(o => o.hospitalId));
      state.uncheckedHospitalCount = hospitalSet.size;
    },
  },
  getters: {
    isUncheckedHospital(state) {
      return hospitalId => {
        return state.hospitalDocumentCheckList.find(o => o.hospitalId === hospitalId && o.hospitalDocumentCheck === 'N');
      };
    },
    isUncheckedDocument(state) {
      return (hospitalId, type) => {
        const hospitalDocument = state.hospitalDocumentCheckList.find(o => o.hospitalId === hospitalId && o.hospitalDocumentType === type);
        if (!hospitalDocument) {
          return false;
        }
        return hospitalDocument.hospitalDocumentCheck === 'N';
      };
    },
  },
};
