const getDefaultHospitalInfoState = () => {
  return {
    address1: '',
    hospitalInfo: {
      userOrganLoginId: '',
      hospital: {
        hospitalId: null,
        districtCode: '',
        hospitalName: '',
        hospitalRegNum: '',
        hospitalMedicalNum: '',
        hospitalCeo: '',
        hospitalLicense: '',
        hospitalTel: '',
        hospitalZipcode: '',
        hospitalAddress: '',
        hospitalLon: null,
        hospitalLat: null,
        hospitalBusinessDivisionF: '',
        hospitalBusinessDivisionE: '',
        hospitalBusinessDivisionC: '',
        hospitalTreatDisabledPerson: null,
      },
      manager: {
        userOrganManagerName: '',
        userOrganManagerTel: '',
        userOrganManagerAlarm: '',
      },
      treatTime: {
        lunchStartTime: '',
        lunchEndTime: '',
      },
      treatDateTimeList: [],
      treatClosedYoilList: [],
      holidayList: [],
      doctorList: [],
    },
  };
};

export default {
  namespaced: true,
  state: getDefaultHospitalInfoState(),
  mutations: {
    setHospitalInfo(state, payload) {
      Object.assign(state.hospitalInfo, payload);
    },
    setAddress1(state, payload) {
      state.address1 = payload;
    },
    setRepDoctor(state, payload) {
      for (const i in state.hospitalInfo.doctorList) {
        state.hospitalInfo.doctorList[i].hospitalDoctorRepresent = payload === parseInt(i) ? 'Y' : 'N';
      }
    },
    HPT_SET(state, payload) {
      for (const type in payload) {
        for (const item in payload[type]) {
          state.hospitalInfo[type][item] = payload[type][item];
        }
      }
    },
    setBusiness(state, payload) {
      for (const item in payload) {
        state.hospitalInfo.hospital[item] = payload[item];
      }
    },
    OBJECT_SET(state, payload) {
      for (const item in payload) {
        state.hospitalInfo[item].push(payload[item]);
      }
    },
    OBJECT_SPLICE(state, payload) {
      for (const item in payload) {
        state.hospitalInfo[item].splice(payload[item], 1);
      }
    },
    setItem(state, payload) {
      for (const item in payload) {
        state.hospitalInfo[item] = payload[item];
      }
    },
    resetHospitalInfo(state) {
      Object.assign(state, getDefaultHospitalInfoState());
    },
  },
};
