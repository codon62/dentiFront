import store from '@/store/index';

export default {
  namespaced: true,
  state: {
    businessYear: 2024,
    district: {
      seoul: {
        code: 'A',
        eng: 'seoul',
        name: '서울시',
        startDay: '2024-03-25', // 시스템 오픈일
        statistics: '2024-05-02', // 통계자료 오픈일
        bulkDownloadStartDay: '2024-12-16', // 일괄 다운로드 시작일
        surveyStartDay: '2024-11-01', // 만족도조사 시작일
        endDays: {
          treatment: '2024-11-30', // 검진 종료일 : 병원 신규 학생 등록 및 동의서, 문진표 등록 불가
          treatmentPromotion: '2024-11-30', // 검진 종료일 홍보 일정
          notification: '2024-12-05', // 의료기관 통보서 제출 종료일
          notificationPromotion: '2024-12-05', // 의료기관 통보서 제출 종료일 홍보 일정
          bill: '2024-12-09', // 의료기관 통보서 재제출 종료일 : 의료기관에서 반려된 통보서에 한함
          billPromotion: '2024-12-09', // 의료기관 통보서 재제출 종료일 홍보 일정
          survey: '2024-11-30', // 만족도조사 종료일
          system: '2024-12-31', // 시스템 접속 종료일
        },
      },
      incheon: {
        code: 'B',
        eng: 'incheon',
        name: '인천시',
        startDay: '2024-03-11',
        statistics: '2024-05-02',
        bulkDownloadStartDay: '2024-12-23',
        surveyStartDay: '2024-11-01',
        endDays: {
          treatment: '2024-12-07',
          notification: '2024-12-07',
          bill: '2024-12-13',
          survey: '2024-11-30',
          system: '2024-12-31',
        },
      },
      gyeonggi: {
        code: 'C',
        eng: 'gyeonggi',
        name: '경기도',
        startDay: '2024-05-02',
        statistics: '2024-06-03',
        bulkDownloadStartDay: '2024-12-23',
        endDays: {
          treatment: '2024-11-30',
          notification: '2024-12-06',
          bill: '2024-12-13',
          survey: '2024-11-30',
          system: '2024-12-31',
        },
      },
      busan: {
        code: 'D',
        eng: 'busan',
        name: '부산시',
        startDay: '2024-04-08',
        statistics: '2024-05-02',
        bulkDownloadStartDay: '2024-12-23',
        surveyStartDay: '2024-11-05',
        endDays: {
          treatment: '2024-12-05',
          notification: '2024-12-06',
          notificationPromotion: '2024-12-06',
          bill: '2024-12-13',
          billPromotion: '2024-12-13',
          survey: '2024-12-05',
          system: '2024-12-31',
        },
      },
      suncheon: {
        // 사업 진행 X
        code: 'E',
        eng: 'suncheon',
        name: '순천시',
        startDay: '2024-05-02',
        bulkDownloadStartDay: '2024-12-22',
        endDays: {
          treatment: '2024-11-30',
          notification: '2024-12-15',
          bill: '2024-12-15',
          system: '2024-12-31',
        },
      },
      miryang: {
        code: 'F',
        eng: 'miryang',
        name: '밀양시',
        startDay: '2024-04-01',
        statistics: '2024-05-02',
        bulkDownloadStartDay: '2024-12-18',
        endDays: {
          treatment: '2024-11-30',
          notification: '2024-12-07',
          bill: '2024-12-13',
          survey: '2024-12-31',
          system: '2024-12-31',
        },
      },
      suwon: {
        code: 'G',
        eng: 'suwon',
        name: '수원시',
        startDay: '2024-05-02',
        statistics: '2024-06-03',
        bulkDownloadStartDay: '2024-12-23',
        endDays: {
          treatment: '2024-11-30',
          treatmentPromotion: '2024-10-31',
          notification: '2024-12-06',
          bill: '2024-12-13',
          survey: '2024-12-31',
          system: '2024-12-31',
        },
      },
      yeosu: {
        // 사업 진행 X
        code: 'H',
        eng: 'yeosu',
        name: '여수시',
        endDays: {
          treatment: '2024-12-10',
          notification: '2024-12-14',
          notificationPromotion: '2024-12-10',
          bill: '2024-12-16',
          system: '2024-12-31',
        },
      },
      jbe: {
        code: 'I',
        eng: 'jbe',
        name: '전북특별자치도교육청',
        startDay: '2024-03-04',
        statistics: '2024-06-03',
        surveyStartDay: '2024-11-01',
        endDays: {
          treatment: '2024-12-31',
          treatmentPromotion: '2024-11-30',
          notification: '2024-12-31',
          bill: '2024-12-31',
          survey: '2024-11-30',
          system: '2024-12-31',
        },
      },
      use: {
        code: 'J',
        eng: 'use',
        name: '울산광역시교육청',
        startDay: '2024-04-04',
        statistics: '2024-06-03',
        bulkDownloadStartDay: '2024-12-23',
        surveyStartDay: '2024-11-04',
        endDays: {
          treatment: '2024-11-30',
          notification: '2024-12-04',
          bill: '2024-12-13',
          survey: '2024-11-30',
          system: '2024-12-31',
        },
      },
    },
    divJoin: {
      C: ['A', 'D'],
      F: ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J'],
      F1: ['A0109'],
      FY: ['D0101'],
      E: ['A', 'C', 'F', 'G', 'J'],
      S: ['C', 'F', 'J'], // 선택검진
    },
  },
  getters: {
    /**
     * 기본 검진비
     */
    defaultExamPrice() {
      return (div, month) => {
        switch (div.charAt(0)) {
          case 'C':
            return store.getters['user/districtCodeFirst'] === 'D' ? 48000 : 0;
          case 'F':
            return ['E', 'F', 'I'].includes(store.getters['user/districtCodeFirst'])
              ? 40000
              : store.getters['user/districtCodeFirst'] === 'J'
              ? 38000
              : store.getters['user/districtCodeFirst'] === 'A' && month >= 7
              ? 4500
              : store.getters['user/districtCodeFirst'] === 'C' && store.getters['student/studentInfo'].schoolType.value === 'D'
              ? 63000
              : 48000;
          case 'E':
            return 8120;
          default:
            return 0;
        }
      };
    },
    /**
     * 지역 정보 추출
     */
    districtInfo(state) {
      const host = location.hostname;
      for (const key in state.district) {
        if (host.includes(key)) {
          return state.district[key];
        }
      }
      return state.district.seoul; // localhost
    },
    /**
     * 사업명 추출
     * div : 사업 div
     * space : 공백 포함 여부
     * noSub : true 시 서브 사업명 불포함
     */
    divName() {
      return (div, space, noSub) => {
        if (noSub) {
          return store.getters['business/divName'](div.charAt(0), space, false);
        }
        let divName = '';
        switch (div) {
          case 'C':
            divName = '아동 치과주치의';
            break;
          case 'F':
            switch (store.getters['user/districtCodeFirst']) {
              case 'B':
                divName = '아동 치과주치의';
                break;
              case 'I':
                divName = '구강진료 지원사업';
                break;
              default:
                divName = '학생 치과주치의';
                break;
            }
            break;
          case 'F1':
            divName = '학생 치과주치의 (1학년)';
            break;
          case 'FY':
            divName = '연제구 학생 치과주치의';
            break;
          case 'E':
            divName = '학생 구강검진';
            break;
          case 'S':
            divName = '학생 검진';
            break;
        }
        return space ? divName : divName.replaceAll(' ', '');
      };
    },
    /**
     * 사업 참여 여부
     * div : 사업 div
     */
    divJoin(state) {
      return div => {
        return state.divJoin[div].includes(store.getters['user/districtCodeFirst']) || state.divJoin[div].find(districtCode => districtCode.startsWith(store.state.user.districtCode));
      };
    },
    /**
     * 학년별 사업 참여 여부
     */
    grade1ValidMsg() {
      return (businessDivision, grade1) => {
        if (!grade1) {
          return '학년 정보를 입력해 주세요.';
        }
        const grade1Int = parseInt(grade1);
        if (grade1Int < 1 || grade1Int > 6) {
          return '학년은 1 ~ 6 사이로 입력해 주세요.';
        }
        switch (store.getters['user/districtCodeFirst']) {
          case 'J':
            // 울산 : 학치는 1, 4학년 / 학구 전학년
            if (businessDivision === 'F' && ![1, 4].includes(grade1Int)) {
              return '1, 4학년만 학생 치과주치의 참여가 가능합니다.';
            }
            break;
        }
        return null; // TODO : 울산 제외한 지역구는 아직 적용되지 않음
      };
    },
    /**
     * 보건소 워딩
     */
    healthCareTitle() {
      switch (store.getters['user/districtCodeFirst']) {
        case 'C':
          return '시군';
        case 'I':
        case 'J':
          return '교육지원청';
        default:
          return '보건소';
      }
    },
    /**
     * 검진 워딩
     */
    examTitle() {
      return store.getters['user/districtCodeFirst'] === 'I' ? '진료' : '검진';
    },
    /**
     * 문진표 워딩
     */
    questionnaireTitle() {
      return store.getters['user/districtCodeFirst'] === 'I' ? '사전 설문조사' : '문진표';
    },
    /**
     * 통보서 워딩
     */
    notificationTitle() {
      return store.getters['user/districtCodeFirst'] === 'I' ? '구강진료 결과통보서' : '통보서';
    },
    /**
     * 일괄 다운로드 시작 일자 조회
     */
    getBulkDownloadStartDay() {
      const dateString = store.getters['business/districtInfo'].bulkDownloadStartDay;
      if (!dateString) return '';

      const dateSplit = dateString.split('-');
      return `${parseInt(dateSplit[1])}월 ${parseInt(dateSplit[2])}일`;
    },
    /**
     * 사업 종료 일자 조회
     * type : 종료 구분
     * isPromotion : 홍보 일정 여부
     * yoil : 요일 출력 여부
     */
    getEndDay() {
      return (type, isPromotion, yoil) => {
        const dateType = isPromotion && store.getters['business/districtInfo'].endDays[type + 'Promotion'] ? type + 'Promotion' : type;
        const dateString = `${store.getters['business/districtInfo'].endDays[dateType]}`;
        const dateSplit = dateString.split('-');
        let dateKr = `${parseInt(dateSplit[1])}월 ${parseInt(dateSplit[2])}일`;
        if (yoil) {
          const date = new Date(`${store.getters['business/districtInfo'].endDays[dateType].replaceAll('-', '/')} 00:00:00`);
          let dayOfWeek = '';
          switch (date.getDay()) {
            case 0:
              dayOfWeek = '일';
              break;
            case 1:
              dayOfWeek = '월';
              break;
            case 2:
              dayOfWeek = '화';
              break;
            case 3:
              dayOfWeek = '수';
              break;
            case 4:
              dayOfWeek = '목';
              break;
            case 5:
              dayOfWeek = '금';
              break;
            case 6:
              dayOfWeek = '토';
              break;
          }
          dateKr += `(${dayOfWeek})`;
        }
        return dateKr;
      };
    },
    /**
     * 만족도조사 시작 여부
     */
    isSurveyOpen() {
      if (!store.getters['business/districtInfo'].surveyStartDay) return false;
      const date = new Date(`${store.getters['business/districtInfo'].surveyStartDay.replaceAll('-', '/')} 00:00:00`);
      return !(new Date() < new Date(date)) && !store.getters['business/endBusiness']('survey');
    },
    /**
     * 사업 종료 여부
     * type : 종료 구분
     * isPromotion : 홍보 일정 여부
     */
    endBusiness() {
      return (type, isPromotion) => {
        if (type !== 'survey' && process.env.NODE_ENV !== 'production') return false; // 설문조사 제외 개발서버는 사업 종료 X
        if (type !== 'survey' && type !== 'system' && store.state.isKaii) return false; // 설문조사, 시스템 제외 카이아이 IP는 사업 종료 X

        // 전북교육청 전 계정 12/15(금) 18:00까지 이용할 수 있도록 계정 오픈
        if (store.getters['business/districtInfo'].code === 'I') {
          const newDate = new Date('2023/12/15 18:00:00');
          if (new Date() < new Date(newDate)) return false;
        }

        const dateType = isPromotion && store.getters['business/districtInfo'].endDays[type + 'Promotion'] ? type + 'Promotion' : type;
        const date = new Date(`${store.getters['business/districtInfo'].endDays[dateType].replaceAll('-', '/')} 00:00:00`);
        date.setDate(date.getDate() + 1);
        return !(new Date() < new Date(date));
      };
    },
    /**
     * 사업 시작 여부
     */
    isOpen() {
      return () => {
        if (!store.getters['business/districtInfo'].startDay) return false;
        const date = new Date(`${store.getters['business/districtInfo'].startDay.replaceAll('-', '/')} 00:00:00`);
        return !(new Date() < new Date(date)) && !store.getters['business/endBusiness']('system');
      };
    },
    /**
     * 사업 시작 월
     */
    startMonth() {
      if (!store.getters['business/districtInfo'].startDay) return 1;
      const date = new Date(`${store.getters['business/districtInfo'].startDay.replaceAll('-', '/')} 00:00:00`);
      return date.getMonth() + 1;
    },
    /**
     * 통계자료 오픈 여부
     */
    openStatistics() {
      if (!store.getters['business/districtInfo'].statistics) return false;
      const date = new Date(store.getters['business/districtInfo'].statistics);
      return date <= new Date();
    },
    /**
     * 일괄 다운로드 시작 여부
     */
    isBulkDownloadStart() {
      if (!store.getters['business/districtInfo'].bulkDownloadStartDay) return false;
      const date = new Date(`${store.getters['business/districtInfo'].bulkDownloadStartDay.replaceAll('-', '/')} 00:00:00`);
      return !(new Date() < new Date(date));
    },
  },
};
