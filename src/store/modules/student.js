const getDefaultState = () => {
  return {
    studentInfo: {
      districtCode: {
        id: 'districtCode',
        label: '지역 코드',
        value: '',
      },
      healthCareName: {
        id: 'healthCareName',
        label: '보건소',
        value: '',
      },
      districtSiName: {
        id: 'districtSiName',
        label: '1차 보건소',
        value: '',
      },
      healthCareTel: {
        id: 'healthCareTel',
        label: '보건소 연락처',
        value: '',
      },
      studentName: {
        id: 'studentName',
        label: '성명',
        value: '',
      },
      studentBirth: {
        id: 'studentBirth',
        label: '생년월일',
        value: '',
      },
      studentGender: {
        id: 'studentGender',
        label: '성별',
        value: '',
      },
      centerId: {
        id: 'centerId',
        label: '시설(센터)',
        value: '',
      },
      centerDistrictCode: {
        id: 'centerDistrictCode',
        label: '시설(센터) 지역코드',
        value: '',
      },
      centerName: {
        id: 'centerName',
        label: '시설(센터)명',
        value: '',
      },
      schoolId: {
        id: 'schoolId',
        label: '학교',
        value: '',
      },
      schoolDistrictCode: {
        id: 'schoolDistrictCode',
        label: '학교 지역코드',
        value: '',
      },
      schoolType: {
        id: 'schoolType',
        label: '학교 유형',
        value: '',
      },
      schoolName: {
        id: 'schoolName',
        label: '학교',
        value: '',
      },
      studentToSchoolGrade1: {
        id: 'studentToSchoolGrade1',
        label: '학년',
        value: '',
      },
      studentToSchoolGrade2: {
        id: 'studentToSchoolGrade2',
        label: '반',
        value: '',
      },
      studentToSchoolGrade3: {
        id: 'studentToSchoolGrade3',
        label: '번호',
        value: '',
      },
      studentTel: {
        id: 'studentTel',
        label: '연락처',
        value: '',
      },
      studentTel2: {
        id: 'studentTel2',
        label: '추가 연락처',
        value: '',
      },
      studentInsurance: {
        id: 'studentInsurance',
        label: '보험종류',
        value: '',
      },
      studentDuplicable: {
        id: 'studentDuplicable',
        label: '중복검진 가능여부',
        value: '',
      },
      hospitalName: {
        id: 'hospitalName',
        label: '병원명',
        value: '',
      },
      schoolInfo: {
        id: 'schoolInfo',
        label: '학교',
        value: '',
      },
    },
  };
};

export default {
  namespaced: true,
  state: getDefaultState(),
  mutations: {
    resetStudentInfo(state) {
      Object.assign(state, getDefaultState());
    },
    DATA_SET(state, payload) {
      for (const item in payload) {
        if (state.studentInfo[item]) {
          state.studentInfo[item].value = payload[item] ? payload[item] : '';
        }
      }
      state.studentInfo.schoolInfo.value = state.studentInfo.studentToSchoolGrade1.value
        ? state.studentInfo.schoolName.value +
          ' (' +
          state.studentInfo.studentToSchoolGrade1.value +
          '/' +
          state.studentInfo.studentToSchoolGrade2.value +
          '/' +
          state.studentInfo.studentToSchoolGrade3.value +
          ')'
        : '';
    },
  },
  getters: {
    studentInfo(state) {
      return state.studentInfo;
    },
  },
};
