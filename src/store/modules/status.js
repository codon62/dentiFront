export default {
  namespaced: true,
  state: {
    month: [
      { id: '01', name: '1월' },
      { id: '02', name: '2월' },
      { id: '03', name: '3월' },
      { id: '04', name: '4월' },
      { id: '05', name: '5월' },
      { id: '06', name: '6월' },
      { id: '07', name: '7월' },
      { id: '08', name: '8월' },
      { id: '09', name: '9월' },
      { id: '10', name: '10월' },
      { id: '11', name: '11월' },
      { id: '12', name: '12월' },
    ],
    year: [
      { id: '2022', name: '2022년' },
      { id: '2021', name: '2021년' },
      { id: '2020', name: '2020년' },
    ],
    dayWeeks: {
      MO: '월요일',
      TU: '화요일',
      WE: '수요일',
      TH: '목요일',
      FR: '금요일',
      SA: '토요일',
      SU: '일요일',
      HO: '공휴일',
    },
    districtCodeFirstToName: {
      A: '서울시',
      B: '인천시',
      C: '경기도',
      D: '부산시',
      E: '순천시',
      F: '밀양시',
      G: '수원시',
      H: '여수시',
      I: '전북특별자치도교육청',
      J: '울산광역시교육청',
    },
    userOrganTargetTypeToName: {
      CT: '도시',
      HC: '보건소',
      CE: '지역아동센터',
      HP: '의료기관',
      UH: '대학병원',
      SC: '학교',
    },
    userOrganTargetTypeToPath: {
      HP: 'hospital',
      CT: 'healthcare',
      HC: 'healthcare',
      CE: 'center',
      SC: 'school',
      UH: 'univhpt',
    },
    oralCareItemsSeoul: [
      // '구강진료예시1',
      // '구강진료예시2',
      // '구강진료예시3',
    ],
    oralCareItemsBusan: ['레진', '아말감', '발치', '신경치료'],
    studentGender: {
      M: '남성',
      W: '여성',
    },
    studentInsurance: {
      N: '미가입',
      A: '의료급여',
      B: '차상위',
      C: '건강보험',
    },
    schoolQuestionnaire: {
      id: 'questionnaire',
      title: '문진표',
      value: {
        Null: '미작성',
        StatusY: '작성완료',
      },
    },
    schoolQuestionnaireI: {
      id: 'questionnaire',
      title: '사전 설문조사',
      value: {
        Null: '미작성',
        StatusY: '작성완료',
      },
    },
    schoolNotification: {
      id: 'notification',
      title: '통보서',
      value: {
        Null: '미작성',
        StatusY: '최종제출',
      },
    },
    schoolNotificationI: {
      id: 'notification',
      title: '구강진료 결과통보서',
      value: {
        Null: '미작성',
        StatusN: '진료중',
        StatusY: '최종제출',
      },
    },
    questionnaire: {
      id: 'questionnaire',
      title: '문진표',
      value: {
        Null: '미작성',
        NotNull: '작성완료',
      },
    },
    questionnaireI: {
      id: 'questionnaire',
      title: '사전 설문조사',
      value: {
        Null: '미작성',
        NotNull: '작성완료',
      },
    },
    notification: {
      id: 'notification',
      title: '통보서',
      value: {
        Null: '미작성',
        StatusN: '임시저장',
        StatusY: '최종제출',
      },
    },
    notificationI: {
      id: 'notification',
      title: '구강진료 결과통보서',
      value: {
        Null: '미작성',
        StatusN: '임시저장',
        StatusY: '최종제출',
      },
    },
    notificationC: {
      id: 'notification',
      title: '통보서',
      value: {
        Null: '미작성',
        StatusN: '임시저장',
        StatusY: '최종제출',
      },
    },
    ttr: {
      id: 'treatmentRequestStatus',
      title: '진료 의뢰서',
      value: {
        Null: '미작성',
        N: '임시저장',
        Y: '최종제출',
      },
    },
    ttp: {
      id: 'treatmentPlanStatus',
      title: '진료 계획서',
      value: {
        Null: '미작성',
        N: '임시저장',
        Y: '대기중',
        A: '승인됨',
        D: '미승인됨',
      },
    },
    stm: {
      id: 'statementStatus',
      title: '내역서',
      value: {
        Null: '미작성',
        N: '임시저장',
        Y: '최종제출',
      },
    },
    bill: {
      id: 'billStatus',
      title: '처리 상황',
      value: {
        N: '제출완료(청구중)',
        Y: '처리완료',
        R: '반려됨',
        RN: '제출완료(재청구중)',
      },
    },
    claimBillStatus: {
      id: 'billStatus',
      title: '처리 상황',
      value: {
        N: '청구중',
        Y: '처리완료',
      },
    },
    billStatusExReject: {
      id: 'billStatus',
      title: '처리 상황',
      value: {
        N: '제출완료(청구중)',
        Y: '처리완료',
      },
    },
    billStatusWithReject: {
      id: 'billStatus',
      title: '처리 상황',
      value: {
        N: '제출완료(청구중)',
        Y: '처리완료',
        R: '반려됨',
      },
    },
    userOrganManagerAlarm: {
      id: 'userOrganManagerAlarm',
      title: '알림톡 수신',
      radio: true,
      sectionCode: 'C0018',
      value: {
        Y: '동의',
        N: '미동의',
      },
    },
    selfCheckListIsDone: {
      id: 'selfCheckListIsDone',
      title: '자율점검표 등록',
      radio: true,
      value: {
        Y: '등록',
        N: '미등록',
      },
    },
    hospitalTreatDisabledPerson: {
      id: 'hospitalTreatDisabledPerson',
      title: '장애인 진료',
      value: {
        Y: '가능',
        N: '불가능',
      },
    },
    div: {
      id: 'div',
      title: '검진 유형',
      value: {
        F: '학생 치과주치의',
        E: '학생 구강검진',
      },
    },
    businessDivisionRadio: {
      id: 'businessDivision',
      title: '검진 유형',
      radio: true,
      sectionCode: 'C0003',
      value: {
        F: '학생 치과주치의',
        E: '학생 구강검진',
      },
    },
    businessDivision: {
      id: 'businessDivision',
      title: '검진 유형',
      value: {
        C: '아동 치과주치의',
        F: '학생 치과주치의',
        E: '학생 구강검진',
      },
    },
    businessDivisionF1NotE: {
      id: 'businessDivision',
      title: '검진 유형',
      value: {
        C: '아동 치과주치의',
        F: '학생 치과주치의',
        F1: '학생 치과주치의 (1학년)',
      },
    },
    businessDivisionFY: {
      id: 'businessDivision',
      title: '검진 유형',
      value: {
        C: '아동 치과주치의',
        F: '학생 치과주치의',
        FY: '연제구 학생 치과주치의',
      },
    },
    businessDivisionNotE: {
      id: 'businessDivision',
      title: '검진 유형',
      value: {
        C: '아동 치과주치의',
        F: '학생 치과주치의',
      },
    },
    businessDivisionSpc: {
      id: 'businessDivision',
      title: '검진 유형',
      value: {
        F: '학생 치과주치의',
        E: '학생 구강검진',
      },
    },
    businessDivisionSpcJ: {
      id: 'businessDivision',
      title: '검진 유형',
      value: {
        F: '학생 치과주치의 (1·4학년)',
        E: '학생 구강검진 (2·3·5·6학년)',
      },
    },
    businessDivisionSpcRadio: {
      id: 'businessDivision',
      title: '검진 유형',
      radio: true,
      sectionCode: 'C0003',
      value: {
        F: '학생 치과주치의',
        E: '학생 구강검진',
      },
    },
    billStudentBusinessDivision: {
      id: 'billStudentBusinessDivision',
      title: '검진 여부',
      value: {
        C: '아동 치과주치의',
        F: '학생 치과주치의',
      },
    },
    studentToHospital: {
      id: 'studentToHospital',
      title: '병원 지정',
      radio: true,
      value: {
        Y: '지정',
        N: '미지정',
      },
    },
    studentToHospital2: {
      id: 'studentToHospital',
      title: '병원 등록',
      radio: true,
      value: {
        Y: '등록',
        N: '미등록',
      },
    },
    userToStudent: {
      id: 'userToStudent',
      title: 'APP 가입 여부',
      radio: true,
      value: {
        Y: '가입',
        N: '미가입',
      },
    },
    userToStudent2: {
      id: 'userToStudent',
      title: 'APP 가입 여부',
      value: {
        Y: '가입',
        N: '미가입',
      },
    },
    userSnsType: {
      id: 'userSnsType',
      title: '가입 유형',
      value: {
        K: '카카오',
        G: '구글',
        N: '네이버',
        A: '애플',
        Null: '이메일',
      },
    },
    appInfoType: {
      id: 'appInfoType',
      title: '디바이스 종류',
      value: {
        A: '안드로이드',
        I: '아이폰',
      },
    },
    iafView: {
      id: 'infoAgreeFileStatus',
      title: '개인정보활용동의서',
      value: {
        N: '미등록',
        Y: '등록',
      },
    },
    queView: {
      id: 'questionnaireStatus',
      title: '문진표',
      value: {
        Null: '미작성',
        Y: '작성완료',
      },
    },
    queIView: {
      id: 'questionnaireStatus',
      title: '사전 설문조사',
      value: {
        Null: '미작성',
        Y: '작성완료',
      },
    },
    queViewNY: {
      id: 'questionnaireStatus',
      title: '문진표',
      value: {
        N: '미작성',
        Y: '작성완료',
      },
    },
    notView: {
      id: 'notificationStatus',
      title: '통보서',
      value: {
        Null: '미작성',
        Y: '작성완료',
      },
    },
    notIView: {
      id: 'notificationStatus',
      title: '구강진료 결과통보서',
      value: {
        Null: '미작성',
        Y: '작성완료',
      },
    },
    notViewNY: {
      id: 'notificationStatus',
      title: '통보서',
      value: {
        N: '미작성',
        Y: '작성완료',
      },
    },
    ttrView: {
      id: 'treatmentRequestStatus',
      title: '진료 의뢰서',
      value: {
        Null: '미작성',
        Y: '작성완료',
      },
    },
    ttpView: {
      id: 'treatmentPlanStatus',
      title: '진료 계획서',
      value: {
        Null: '미작성',
        Y: '대기중',
        A: '승인됨',
        D: '미승인됨',
      },
    },
    stmView: {
      id: 'statementStatus',
      title: '내역서',
      value: {
        Null: '미작성',
        Y: '작성완료',
      },
    },
    stmViewNY: {
      id: 'statementStatus',
      title: '내역서',
      value: {
        N: '미작성',
        Y: '작성완료',
      },
    },
    billView: {
      id: 'billStatus',
      title: '처리 상황',
      value: {
        Null: '미청구',
        N: '제출완료(청구중)',
        Y: '처리완료',
        R: '반려됨',
        RN: '제출완료(재청구중)',
      },
    },
    treatStatus: {
      id: 'treatStatus',
      title: '진료 여부',
      value: {
        N: '불필요',
        Y: '필요',
      },
    },
    treatStatus2: {
      id: 'treatStatus',
      title: '심화치료',
      value: {
        N: '불필요',
        Y: '필요',
      },
    },
    screenStatus: {
      id: 'screenStatus',
      title: '수검 여부',
      value: {
        N: '미수검',
        Y: '수검',
      },
    },
    screenStatusI: {
      id: 'screenStatus',
      title: '진료 여부',
      value: {
        N: '미진료',
        Y: '진료',
      },
    },
    studentBusinessNotTreatReason: {
      id: 'studentBusinessNotTreatReason',
      title: '미수검 사유 등록 여부',
      value: {
        N: '미등록',
        Y: '등록',
      },
    },
    studentBusinessNotTreatReasonI: {
      id: 'studentBusinessNotTreatReason',
      title: '미진료 사유 등록 여부',
      value: {
        N: '미등록',
        Y: '등록',
      },
    },
    intensiveRequestStatus: {
      id: 'intensiveRequestStatus',
      title: '심화치료 의뢰서',
      value: {
        Y: '대기중',
        A: '승인됨',
        D: '미승인됨',
      },
    },
    intensiveNotificationStatus: {
      id: 'intensiveNotification',
      title: '진료상태',
      value: {
        Null: '대기중',
        StatusN: '진료중',
        StatusY: '진료완료',
      },
    },
    intensiveNotificationStatusHc: {
      id: 'intensiveNotificationStatus',
      title: '심화치료 진료 상태',
      value: {
        Null: '대기중',
        N: '진료중',
        Y: '진료완료',
      },
    },
    dateType: [
      { id: 'C004600002', name: '통보서 제출일' },
      { id: 'C004600004', name: '검진일' },
    ],
    dateTypeI: [
      { id: 'C004600002', name: '통보서 제출일' },
      { id: 'C004600004', name: '진료일' },
    ],
    dateTypeC: [
      { id: 'C004600002', name: '통보서 제출일' },
      { id: 'C004600003', name: '내역서 제출일' },
      { id: 'C004600004', name: '통보서 검진일' },
      { id: 'C004600005', name: '내역서 검진일' },
    ],
    intensiveRequestDateType: [
      { id: 'C004600006', name: '의뢰서 제출일' },
      { id: 'C004600007', name: '의뢰서 승인일' },
    ],
    schoolType: {
      id: 'schoolType',
      title: '학교 구분',
      value: {
        A: '일반학교',
        D: '특수학교',
        B: '대안학교',
        // C: '대안학교(비인가)',
        E: '학교밖',
      },
    },
    schoolTypeEach: [
      { id: 'schoolTypeA', name: '일반학교' },
      { id: 'schoolTypeD', name: '특수학교' },
      { id: 'schoolTypeB', name: '대안학교' },
      { id: 'schoolTypeE', name: '학교밖' },
    ],
    schoolTypeNotNull: {
      id: 'schoolType',
      title: '학교 구분',
      value: {
        A: '일반학교',
        D: '특수학교',
        B: '대안학교',
        // C: '대안학교(비인가)',
      },
    },
    schoolTypeNotNullEach: [
      { id: 'schoolTypeA', name: '일반학교' },
      { id: 'schoolTypeD', name: '특수학교' },
      { id: 'schoolTypeB', name: '대안학교' },
    ],
    completeEduDate: {
      id: 'completeEduDate',
      title: '교육 이수',
      radio: true,
      value: {
        Y: '이수',
        N: '미이수',
      },
    },
    eduStatus: {
      id: 'eduStatus',
      title: '교육 이수',
      value: {
        Y: '이수',
        N: '미이수',
      },
    },
    noticeBoardReceiver: {
      HC: '보건소 전체',
      HP: '병원 전체',
      SC: '학교 전체',
      CE: '센터 전체',
    },
    noticeBoardReceiverI: {
      HC: '교육지원청 전체',
      HP: '병원 전체',
      SC: '학교 전체',
      CE: '센터 전체',
    },
    faqCategory: {
      HC: '보건소',
      HP: '병원',
      SC: '학교',
      CE: '시설(센터)',
      ST: '학생/학부모',
    },
    contractStatus: {
      id: 'contractStatus',
      title: '사업 신청',
      value: {
        N: '대기중',
        Y: '승인완료',
      },
    },
    hospitalVideoEdu: {
      id: 'hospitalVideoEdu',
      title: '동영상 교육',
      value: {
        Y: '이수',
        N: '미이수',
      },
    },
    studentBusinessTarget: {
      id: 'studentBusinessTarget',
      title: '사업 대상자 여부',
      value: {
        Y: '대상자',
        N: '비대상자 (앱 가입자)',
      },
    },
    forceCreateStatus: {
      id: 'forceCreateStatus',
      title: '계정 유형',
      value: {
        Y: '강제생성 (병원 연결 시 자동 생성)',
        N: '앱 가입',
      },
    },
    isExamToExamine: {
      id: 'isExam',
      title: '자격 여부',
      radio: true,
      sectionCode: 'C0077',
      value: {
        N: '구강교육 대상자',
        Y: '학생 구강검진',
      },
    },
    billCheck: {
      id: 'check',
      title: '확인 여부',
      value: {
        N: '미확인',
        Y: '확인',
      },
    },
    studentCheck: {
      id: 'studentCheck',
      title: '확인 여부',
      value: {
        N: '미확인',
        Y: '확인',
      },
    },
  },
};
