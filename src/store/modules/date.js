import store from '@/store';

export default {
  namespaced: true,
  state: {
    months: [
      { id: '01', name: '01' },
      { id: '02', name: '02' },
      { id: '03', name: '03' },
      { id: '04', name: '04' },
      { id: '05', name: '05' },
      { id: '06', name: '06' },
      { id: '07', name: '07' },
      { id: '08', name: '08' },
      { id: '09', name: '09' },
      { id: '10', name: '10' },
      { id: '11', name: '11' },
      { id: '12', name: '12' },
    ],
    days: [
      { id: '01', name: '01' },
      { id: '02', name: '02' },
      { id: '03', name: '03' },
      { id: '04', name: '04' },
      { id: '05', name: '05' },
      { id: '06', name: '06' },
      { id: '07', name: '07' },
      { id: '08', name: '08' },
      { id: '09', name: '09' },
      { id: '10', name: '10' },
      { id: '11', name: '11' },
      { id: '12', name: '12' },
      { id: '13', name: '13' },
      { id: '14', name: '14' },
      { id: '15', name: '15' },
      { id: '16', name: '16' },
      { id: '17', name: '17' },
      { id: '18', name: '18' },
      { id: '19', name: '19' },
      { id: '20', name: '20' },
      { id: '21', name: '21' },
      { id: '22', name: '22' },
      { id: '23', name: '23' },
      { id: '24', name: '24' },
      { id: '25', name: '25' },
      { id: '26', name: '26' },
      { id: '27', name: '27' },
      { id: '28', name: '28' },
      { id: '29', name: '29' },
      { id: '30', name: '30' },
      { id: '31', name: '31' },
    ],
  },
  getters: {
    getStudentYears() {
      let yearList = [];
      const businessYear = store.state.business.businessYear;
      for (let i = 0; i < 30; i++) {
        const year = businessYear - i;
        yearList.push({ id: year, name: year });
      }
      return yearList;
    },
    getStudentMonths(state) {
      return state.months;
    },
    getStudentDays(state) {
      return state.days;
    },
    getStudentYearByGrade1() {
      return studentToSchoolGrade1 => {
        if (!studentToSchoolGrade1) return '';
        const grade1 = parseInt(studentToSchoolGrade1);
        if (grade1 >= 1 && grade1 <= 6) {
          return store.state.business.businessYear - 6 - grade1;
        }
        return '';
      };
    },
  },
};
