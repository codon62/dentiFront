export default {
  namespaced: true,
  state: {
    C0001: {
      sectionCode: 'C0001',
      sectionCodeName: '문서상태',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '임시저장', value: 'N' },
        { divisionCode: '00002', divisionCodeName: '최종제출', value: 'Y' },
        { divisionCode: '00003', divisionCodeName: '반려', value: 'R' },
        { divisionCode: '00004', divisionCodeName: '승인', value: 'A' }, // 의뢰서
        { divisionCode: '00005', divisionCodeName: '미승인', value: 'D' }, // 의뢰서
        { divisionCode: '00006', divisionCodeName: '재등록', value: 'E' }, // 통보서 추가작성 가능
        { divisionCode: '00007', divisionCodeName: '미작성', value: null },
      ],
    },
    C0002: {
      sectionCode: 'C0002',
      sectionCodeName: '진료여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '불필요', value: 'N' },
        { divisionCode: '00002', divisionCodeName: '필요', value: 'Y' },
      ],
    },
    C0003: {
      sectionCode: 'C0003',
      sectionCodeName: '학생 참여사업',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '학생치과주치의', value: 'F' },
        { divisionCode: '00002', divisionCodeName: '학생구강검진', value: 'E' },
        { divisionCode: '00003', divisionCodeName: '아동치과주치의', value: 'C' },
        { divisionCode: '00004', divisionCodeName: '1학년 학생치과주치의', value: 'F1' },
        { divisionCode: '00005', divisionCodeName: '구강교육 대상자', value: null },
        { divisionCode: '00006', divisionCodeName: '연제구 학생치과주치의', value: 'FY' },
      ],
    },
    C0004: {
      sectionCode: 'C0004',
      sectionCodeName: '청구상태',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '청구중', value: 'N' },
        { divisionCode: '00002', divisionCodeName: '처리완료', value: 'Y' },
        { divisionCode: '00003', divisionCodeName: '반려', value: 'R' },
        { divisionCode: '00004', divisionCodeName: '재청구', value: 'RN' },
      ],
    },
    C0005: {
      sectionCode: 'C0005',
      sectionCodeName: '성별',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '남성', value: 'M' },
        { divisionCode: '00002', divisionCodeName: '여성', value: 'W' },
      ],
    },
    C0006: {
      sectionCode: 'C0006',
      sectionCodeName: '회원유형',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '관리자', value: 'AD' },
        { divisionCode: '00002', divisionCodeName: '도시', value: 'CT' },
        { divisionCode: '00003', divisionCodeName: '보건소', value: 'HC' },
        { divisionCode: '00004', divisionCodeName: '센터', value: 'CE' },
        { divisionCode: '00005', divisionCodeName: '병원', value: 'HP' },
        { divisionCode: '00006', divisionCodeName: '학교', value: 'SC' },
        { divisionCode: '00007', divisionCodeName: '대학교 병원', value: 'UH' },
        { divisionCode: '00008', divisionCodeName: '학생', value: 'ST' },
        { divisionCode: '00009', divisionCodeName: '기관 전체', value: 'ALL' }, // 대학교 병원, 학생 제외
      ],
    },
    C0007: {
      sectionCode: 'C0007',
      sectionCodeName: '지역구분',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '도' },
        { divisionCode: '00002', divisionCodeName: '시' },
        { divisionCode: '00003', divisionCodeName: '군구' },
        { divisionCode: '00004', divisionCodeName: '상위 포함' },
        { divisionCode: '00005', divisionCodeName: '상위 미포함' },
        { divisionCode: '00006', divisionCodeName: '하위 포함' },
        { divisionCode: '00007', divisionCodeName: '하위 미포함' },
      ],
    },
    C0008: {
      sectionCode: 'C0008',
      sectionCodeName: '사업 참여여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '참여', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '미참여', value: 'N' },
      ],
    },
    C0009: {
      sectionCode: 'C0009',
      sectionCodeName: '승인여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '대기중', value: 'N' },
        { divisionCode: '00002', divisionCodeName: '승인', value: 'Y' },
      ],
    },
    C0010: {
      sectionCode: 'C0010',
      sectionCodeName: '문서유형',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '문진표', value: 'Q' },
        { divisionCode: '00002', divisionCodeName: '통보서', value: 'N' },
        { divisionCode: '00003', divisionCodeName: '진료계획서', value: 'T' },
        { divisionCode: '00004', divisionCodeName: '내역서', value: 'S' },
        { divisionCode: '00005', divisionCodeName: '심화치료의뢰서', value: 'TR' },
        { divisionCode: '00006', divisionCodeName: '심화치료통보서', value: 'TN' },
        { divisionCode: '00007', divisionCodeName: '비용청구서 전체 (1학년 제외)', value: 'BA' },
        { divisionCode: '00008', divisionCodeName: '비용청구서 1학년', value: 'B1' },
        { divisionCode: '00009', divisionCodeName: '비용청구서 4학년', value: 'B4' },
        { divisionCode: '00010', divisionCodeName: '비용청구서 5학년', value: 'B5' },
        { divisionCode: '00011', divisionCodeName: '비용청구서 학교밖', value: 'BNS' },
        { divisionCode: '00012', divisionCodeName: '진료의뢰서', value: 'TT' },
      ],
    },
    C0011: {
      sectionCode: 'C0011',
      sectionCodeName: '진료일',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '일요일', value: 'SU' },
        { divisionCode: '00002', divisionCodeName: '월요일', value: 'MO' },
        { divisionCode: '00003', divisionCodeName: '화요일', value: 'TU' },
        { divisionCode: '00004', divisionCodeName: '수요일', value: 'WE' },
        { divisionCode: '00005', divisionCodeName: '목요일', value: 'TH' },
        { divisionCode: '00006', divisionCodeName: '금요일', value: 'FR' },
        { divisionCode: '00007', divisionCodeName: '토요일', value: 'SA' },
        { divisionCode: '00008', divisionCodeName: '공휴일', value: 'HO' },
      ],
    },
    C0012: {
      sectionCode: 'C0012',
      sectionCodeName: '휴진여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '휴진', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '미휴진', value: 'N' },
      ],
    },
    C0013: {
      sectionCode: 'C0013',
      sectionCodeName: '보험 종류',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '미가입', value: 'N' },
        { divisionCode: '00002', divisionCodeName: '의료급여', value: 'A' },
        { divisionCode: '00003', divisionCodeName: '차상위', value: 'B' },
        { divisionCode: '00004', divisionCodeName: '건강보험', value: 'C' },
      ],
    },
    C0014: {
      sectionCode: 'C0014',
      sectionCodeName: '은행',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '한국은행' },
        { divisionCode: '00002', divisionCodeName: '산업은행' },
        { divisionCode: '00003', divisionCodeName: '기업은행' },
        { divisionCode: '00004', divisionCodeName: '국민은행' },
        { divisionCode: '00005', divisionCodeName: '외환은행' },
        { divisionCode: '00007', divisionCodeName: '수협은행' },
        { divisionCode: '00008', divisionCodeName: '수출입은행' },
        { divisionCode: '00011', divisionCodeName: '농협은행' },
        { divisionCode: '00012', divisionCodeName: '지역농축협' },
        { divisionCode: '00020', divisionCodeName: '우리은행' },
        { divisionCode: '00023', divisionCodeName: 'SC제일은행' },
        { divisionCode: '00027', divisionCodeName: '한국씨티은행' },
        { divisionCode: '00031', divisionCodeName: '대구은행' },
        { divisionCode: '00032', divisionCodeName: '부산은행' },
        { divisionCode: '00034', divisionCodeName: '광주은행' },
        { divisionCode: '00035', divisionCodeName: '제주은행' },
        { divisionCode: '00037', divisionCodeName: '전북은행' },
        { divisionCode: '00039', divisionCodeName: '경남은행' },
        { divisionCode: '00045', divisionCodeName: '새마을금고중앙회' },
        { divisionCode: '00048', divisionCodeName: '신협은행' },
        { divisionCode: '00050', divisionCodeName: '상호저축은행' },
        { divisionCode: '00071', divisionCodeName: '우체국' },
        { divisionCode: '00081', divisionCodeName: 'KEB하나은행' },
        { divisionCode: '00088', divisionCodeName: '신한은행' },
        { divisionCode: '00089', divisionCodeName: '케이뱅크' },
        { divisionCode: '00090', divisionCodeName: '카카오뱅크' },
        { divisionCode: '00238', divisionCodeName: '미래에셋대우' },
      ],
    },
    C0015: {
      sectionCode: 'C0015',
      sectionCodeName: '동영상 교육 시청 여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '시청', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '미시청', value: 'N' },
      ],
    },
    C0016: {
      sectionCode: 'C0016',
      sectionCodeName: '병원유형',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '일반병원', value: 'N' },
        { divisionCode: '00002', divisionCodeName: '보건소병원', value: 'H' },
        { divisionCode: '00003', divisionCodeName: '이동진료팀 병원', value: 'T' },
        { divisionCode: '00004', divisionCodeName: '장애인치과병원', value: 'D' },
      ],
    },
    C0017: {
      sectionCode: 'C0017',
      sectionCodeName: '대표치과의사 여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '대표 치과의사', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '일반 치과의사', value: 'N' },
      ],
    },
    C0018: {
      sectionCode: 'C0018',
      sectionCodeName: '알림톡 여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '동의', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '비동의', value: 'N' },
      ],
    },
    C0019: {
      sectionCode: 'C0019',
      sectionCodeName: '파일유형',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '사업자등록증', value: 'B' },
        { divisionCode: '00002', divisionCodeName: '통장사본', value: 'A' },
        { divisionCode: '00003', divisionCodeName: '개인정보활용동의서', value: 'U' },
        { divisionCode: '00004', divisionCodeName: '개인정보위탁동의서', value: 'R' },
        { divisionCode: '00005', divisionCodeName: '대표 치과의사 날인', value: 'C' },
      ],
    },
    C0020: {
      sectionCode: 'C0020',
      sectionCodeName: '광고대상종류',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '저학년', value: 'LG' },
        { divisionCode: '00002', divisionCodeName: '고학년"', value: 'UG' },
        { divisionCode: '00003', divisionCodeName: '교정중', value: 'PF' },
      ],
    },
    C0021: {
      sectionCode: 'C0021',
      sectionCodeName: '디바이스 종류',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '안드로이드', value: 'A' },
        { divisionCode: '00002', divisionCodeName: '아이폰', value: 'I' },
      ],
    },
    C0022: {
      sectionCode: 'C0022',
      sectionCodeName: '학교 유형',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '일반학교', value: 'A' },
        { divisionCode: '00002', divisionCodeName: '대안학교(인가)', value: 'B' },
        { divisionCode: '00003', divisionCodeName: '대안학교(비 인가)', value: 'C' },
        { divisionCode: '00004', divisionCodeName: '특수학교', value: 'D' },
        { divisionCode: '00005', divisionCodeName: '학교밖', value: 'E' },
      ],
    },
    C0023: {
      sectionCode: 'C0023',
      sectionCodeName: '점수 유형',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '양치 가이드', value: 'B' },
        { divisionCode: '00002', divisionCodeName: '오늘의 퀴즈', value: 'Q' },
        { divisionCode: '00003', divisionCodeName: '교육', value: 'E' },
      ],
    },
    C0024: {
      sectionCode: 'C0024',
      sectionCodeName: '로그인 SNS 유형',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '구글', value: 'G' },
        { divisionCode: '00002', divisionCodeName: '카카오', value: 'K' },
        { divisionCode: '00003', divisionCodeName: '네이버', value: 'N' },
        { divisionCode: '00004', divisionCodeName: '페이스북', value: 'F' },
        { divisionCode: '00005', divisionCodeName: '애플', value: 'A' },
      ],
    },
    C0025: {
      sectionCode: 'C0025',
      sectionCodeName: '관리자 권한',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: 'Super Admin', value: 'S' },
        { divisionCode: '00002', divisionCodeName: 'Admin', value: 'A' },
      ],
    },
    C0026: {
      sectionCode: 'C0026',
      sectionCodeName: '관리자 재직여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '재직중', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '퇴사', value: 'N' },
      ],
    },
    C0027: {
      sectionCode: 'C0027',
      sectionCodeName: '권한레벨',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '유저', value: 'US' },
        { divisionCode: '00002', divisionCodeName: '기관', value: 'OR' },
        { divisionCode: '00003', divisionCodeName: '관리자', value: 'AD' },
      ],
    },
    C0028: {
      sectionCode: 'C0028',
      sectionCodeName: '교육 수행 상태',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '1차 수행', value: 'A' },
        { divisionCode: '00002', divisionCodeName: '2차 수행', value: 'B' },
        { divisionCode: '00003', divisionCodeName: '3차 수행', value: 'C' },
        { divisionCode: '00004', divisionCodeName: '수행', value: 'Y' },
        { divisionCode: '00005', divisionCodeName: '미수행', value: 'N' },
      ],
    },
    C0029: {
      sectionCode: 'C0029',
      sectionCodeName: '퀴즈 교육 형태 타입',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '사전 테스트', value: 'B' },
        { divisionCode: '00002', divisionCodeName: '교육', value: 'I' },
        { divisionCode: '00003', divisionCodeName: '사후 테스트', value: 'S' },
        { divisionCode: '00004', divisionCodeName: '오늘의 퀴즈', value: 'D' },
      ],
    },
    C0030: {
      sectionCode: 'C0030',
      sectionCodeName: '중복검진 가능여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '가능', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '불가능', value: 'N' },
      ],
    },
    C0031: {
      sectionCode: 'C0031',
      sectionCodeName: '교육 종류',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '기본교육', value: 'B' },
        { divisionCode: '00002', divisionCodeName: '심화교육', value: 'D' },
        { divisionCode: '00003', divisionCodeName: '영상', value: 'VIDEO' },
        { divisionCode: '00004', divisionCodeName: '카드', value: 'CARD' },
        { divisionCode: '00005', divisionCodeName: '전체', value: 'ALL' },
      ],
    },
    C0032: {
      sectionCode: 'C0032',
      sectionCodeName: '등급기준',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '다이아', value: 'D' },
        { divisionCode: '00002', divisionCodeName: '금', value: 'G' },
        { divisionCode: '00003', divisionCodeName: '은', value: 'S' },
        { divisionCode: '00004', divisionCodeName: '동', value: 'B' },
      ],
    },
    C0033: {
      sectionCode: 'C0033',
      sectionCodeName: '교육 진행 상태',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '사전테스트', value: 'B' },
        { divisionCode: '00002', divisionCodeName: '기본교육', value: 'D' },
        { divisionCode: '00003', divisionCodeName: '사후테스트', value: 'S' },
        { divisionCode: '00004', divisionCodeName: '심화교육', value: 'A' },
        { divisionCode: '00005', divisionCodeName: '종료', value: 'F' },
      ],
    },
    C0034: {
      sectionCode: 'C0034',
      sectionCodeName: '퀴즈 정답',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: 'O가 정답', value: 'O' },
        { divisionCode: '00002', divisionCodeName: 'X가 정답', value: 'X' },
        { divisionCode: '00003', divisionCodeName: '정답', value: 'O' },
        { divisionCode: '00004', divisionCodeName: '오답', value: 'X' },
      ],
    },
    C0035: {
      sectionCode: 'C0035',
      sectionCodeName: '여부 확인',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '확인', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '미확인', value: 'N' },
      ],
    },
    C0036: {
      sectionCode: 'C0036',
      sectionCodeName: '회원관리 탭 분류',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '학생치과주치의', value: 'F' },
        { divisionCode: '00002', divisionCodeName: '학생구강검진', value: 'E' },
        { divisionCode: '00003', divisionCodeName: '아동치과주치의', value: 'C' },
        { divisionCode: '00004', divisionCodeName: '중복대상자', value: 'D' },
        { divisionCode: '00005', divisionCodeName: '특수학교', value: 'S' },
        { divisionCode: '00006', divisionCodeName: '학생치과주치의(1학년)', value: 'F1' },
        { divisionCode: '00007', divisionCodeName: '연제구 학생치과주치의', value: 'FY' },
      ],
    },
    C0037: {
      sectionCode: 'C0037',
      sectionCodeName: '알림 유형',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '공통내용', value: 'CM' },
        { divisionCode: '00002', divisionCodeName: '전체/일부 학생검진 오픈', value: 'EO' },
        { divisionCode: '00003', divisionCodeName: '통보서 등록', value: 'NR' },
        { divisionCode: '00004', divisionCodeName: '만족도 조사', value: 'SR' },
        { divisionCode: '00005', divisionCodeName: '공지사항', value: 'NT' },
      ],
    },
    C0038: {
      sectionCode: 'C0038',
      sectionCodeName: '학생 정보 수정 가능 여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '가능', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '불가능', value: 'N' },
      ],
    },
    C0039: {
      sectionCode: 'C0039',
      sectionCodeName: '인증 여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '인증', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '미인증', value: 'N' },
      ],
    },
    C0040: {
      sectionCode: 'C0040',
      sectionCodeName: '학교 구분',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '초등학교', value: 'E' },
        { divisionCode: '00002', divisionCodeName: '중학교', value: 'M' },
        { divisionCode: '00003', divisionCodeName: '고등학교', value: 'H' },
      ],
    },
    C0041: {
      sectionCode: 'C0041',
      sectionCodeName: '언어',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '영어', value: 'en' },
        { divisionCode: '00002', divisionCodeName: '중국어(간체)', value: 'ch' },
        { divisionCode: '00003', divisionCodeName: '베트남어', value: 'vi' },
        { divisionCode: '00004', divisionCodeName: '한국어', value: 'ko' },
      ],
    },
    C0042: {
      sectionCode: 'C0042',
      sectionCodeName: '수검 여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '수검', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '미수검', value: 'N' },
      ],
    },
    C0043: {
      sectionCode: 'C0043',
      sectionCodeName: '다운로드 로그',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '동의서 > 일괄 다운로드', value: 'A' },
        { divisionCode: '00002', divisionCodeName: '문진표 > 일괄 다운로드', value: 'B' },
        { divisionCode: '00003', divisionCodeName: '통보서 > 일괄 다운로드', value: 'C' },
        { divisionCode: '00004', divisionCodeName: '비용청구서 > 일괄 다운로드', value: 'D' },
        { divisionCode: '00005', divisionCodeName: '사업관리 > 아동치과주치의 > 엑셀 다운로드', value: 'E' },
        { divisionCode: '00006', divisionCodeName: '사업관리 > 학생치과주치의 > 엑셀 다운로드', value: 'F' },
        { divisionCode: '00007', divisionCodeName: '사업관리 > 학생구강검진 > 엑셀 다운로드', value: 'G' },
        { divisionCode: '00008', divisionCodeName: '통계자료 > 자동보고서 > 아동치과주치의 > 인쇄', value: 'H' },
        { divisionCode: '00009', divisionCodeName: '통계자료 > 자동보고서 > 학생치과주치의 > 인쇄', value: 'I' },
        { divisionCode: '00010', divisionCodeName: '통계자료 > 자동보고서 > 학생구강검진 > 인쇄', value: 'J' },
        { divisionCode: '00011', divisionCodeName: '통계자료 > 종합실적 > 아동치과주치의 > 엑셀 다운로드', value: 'K' },
        { divisionCode: '00012', divisionCodeName: '통계자료 > 종합실적 > 학생치과주치의 > 엑셀 다운로드', value: 'L' },
        { divisionCode: '00013', divisionCodeName: '통계자료 > 종합실적 > 학생구강검진 > 엑셀 다운로드', value: 'M' },
        { divisionCode: '00014', divisionCodeName: '만족도 조사', value: 'N' },
        { divisionCode: '00015', divisionCodeName: '검진내역(학교 정보 포함) > 엑셀 다운로드', value: 'O' },
        { divisionCode: '00016', divisionCodeName: '검진내역(학교 정보 미포함) > 엑셀 다운로드', value: 'P' },
        { divisionCode: '00017', divisionCodeName: '검진내역(나이스양식) > 엑셀 다운로드', value: 'Q' },
        { divisionCode: '00018', divisionCodeName: '검진비 지급 내역 > 엑셀 다운로드', value: 'R' },
        { divisionCode: '00019', divisionCodeName: '회원관리 > 엑셀 다운로드', value: 'S' },
        { divisionCode: '00020', divisionCodeName: '내역서 > 일괄 다운로드', value: 'T' },
        { divisionCode: '00021', divisionCodeName: '통계자료 > 학교별 현황 > 엑셀 다운로드', value: 'U' },
        { divisionCode: '00022', divisionCodeName: '통계자료 > 학교별 현황 상세 > 엑셀 다운로드', value: 'V' },
        { divisionCode: '00023', divisionCodeName: '만족도조사 결과 > 만족도 조사 > 엑셀 다운로드', value: 'W' },
        { divisionCode: '00024', divisionCodeName: '만족도조사 결과 > 사후 설문조사 > 엑셀 다운로드', value: 'X' },
        { divisionCode: '00025', divisionCodeName: '만족도조사 결과 > 문진표 > 엑셀 다운로드', value: 'Y' },
        { divisionCode: '00026', divisionCodeName: '만족도조사 결과 > 보건소 만족도 조사 > 엑셀 다운로드', value: 'Z' },
        { divisionCode: '00027', divisionCodeName: '만족도조사 결과 > 병원 만족도 조사 > 엑셀 다운로드', value: 'AA' },
        { divisionCode: '00028', divisionCodeName: '만족도조사 결과 > 학교 만족도 조사 > 엑셀 다운로드', value: 'AB' },
      ],
    },
    C0044: {
      sectionCode: 'C0044',
      sectionCodeName: '교육 완료/잠금 상태',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '완료"', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '미완료', value: 'N' },
        { divisionCode: '00003', divisionCodeName: '잠금상태', value: 'L' },
      ],
    },
    C0045: {
      sectionCode: 'C0045',
      sectionCodeName: '검진 정보 조회 (플러스)',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '통보서 리포트', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '문진표 제출', value: 'S' },
        { divisionCode: '00003', divisionCodeName: '문진표 미작성', value: 'N' },
      ],
    },
    C0046: {
      sectionCode: 'C0046',
      sectionCodeName: '기간검색유형',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '병원 등록일', value: 'HR' },
        { divisionCode: '00002', divisionCodeName: '통보서 제출일', value: 'NR' },
        { divisionCode: '00003', divisionCodeName: '내역서 제출일', value: 'SR' },
        { divisionCode: '00004', divisionCodeName: '통보서 검진일', value: 'NI' },
        { divisionCode: '00005', divisionCodeName: '내역서 검진일', value: 'SI' },
        { divisionCode: '00006', divisionCodeName: '심화치료의뢰서 제출일', value: 'TRR' },
        { divisionCode: '00007', divisionCodeName: '심화치료의뢰서 승인일', value: 'TRA' },
      ],
    },
    C0047: {
      sectionCode: 'C0047',
      sectionCodeName: '만족도 조사 상태',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '했음', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '해야함', value: 'S' },
        { divisionCode: '00003', divisionCodeName: '하지 않음', value: 'N' },
      ],
    },
    C0060: {
      sectionCode: 'C0060',
      sectionCodeName: '장애인 진료 가능 여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '가능', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '불가능', value: 'N' },
      ],
    },
    C0061: {
      sectionCode: 'C0061',
      sectionCodeName: '강제생성 여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '맞음', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '아님', value: 'N' },
      ],
    },
    C0067: {
      sectionCode: 'C0067',
      sectionCodeName: '학년',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '1학년', value: '1' },
        { divisionCode: '00002', divisionCodeName: '2학년', value: '2' },
        { divisionCode: '00003', divisionCodeName: '3학년', value: '3' },
        { divisionCode: '00004', divisionCodeName: '4학년', value: '4' },
        { divisionCode: '00005', divisionCodeName: '5학년', value: '5' },
        { divisionCode: '00006', divisionCodeName: '6학년', value: '6' },
        { divisionCode: '00007', divisionCodeName: '그 외', value: 'OTHER' },
        { divisionCode: '00008', divisionCodeName: '전학년', value: 'ALL' },
        { divisionCode: '00009', divisionCodeName: '4,5,6학년', value: '456' },
      ],
    },
    C0069: {
      sectionCode: 'C0069',
      sectionCodeName: '보건소 문의 카테고리',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '학생관리' },
        { divisionCode: '00002', divisionCodeName: '문진표' },
        { divisionCode: '00003', divisionCodeName: '통보서' },
        { divisionCode: '00004', divisionCodeName: '비용청구서' },
        { divisionCode: '00005', divisionCodeName: '기타' },
      ],
    },
    C0070: {
      sectionCode: 'C0070',
      sectionCodeName: '보건소 문의 활성화 여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '활성화', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '비활성화', value: 'N' },
      ],
    },
    C0071: {
      sectionCode: 'C0071',
      sectionCodeName: '서비스 이용 정보 동의 여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '동의', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '비동의', value: 'N' },
      ],
    },
    C0072: {
      sectionCode: 'C0072',
      sectionCodeName: '도시 유형',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '일반 도시', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '교육청', value: 'E' },
      ],
    },
    C0075: {
      sectionCode: 'C0075',
      sectionCodeName: '사업 대상자 여부',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '대상자', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '비대상자', value: 'N' },
      ],
    },
    C0077: {
      sectionCode: 'C0077',
      sectionCodeName: '사업 참여 관련 값',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '검진 진행', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '검진 진행하지 않음', value: 'N' },
      ],
    },
    C0078: {
      sectionCode: 'C0078',
      sectionCodeName: '구강교육 카테고리',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '예방', value: 'A' },
        { divisionCode: '00002', divisionCodeName: '질병', value: 'B' },
        { divisionCode: '00003', divisionCodeName: '치료', value: 'C' },
        { divisionCode: '00004', divisionCodeName: '양치', value: 'D' },
        { divisionCode: '00005', divisionCodeName: '기타', value: 'E' },
      ],
    },
    C0079: {
      sectionCode: 'C0079',
      sectionCodeName: '보건소 종류',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '일반 보건소', value: 'Y' },
        { divisionCode: '00002', divisionCodeName: '치과의사회', value: 'E' },
      ],
    },
    C0087: {
      sectionCode: 'C0087',
      sectionCodeName: '보관기관 유형',
      divisionCodeList: [
        { divisionCode: '00001', divisionCodeName: '지자체' },
        { divisionCode: '00002', divisionCodeName: '교육청' },
        { divisionCode: '00003', divisionCodeName: '보건소' },
        { divisionCode: '00004', divisionCodeName: '교육지원청' },
        { divisionCode: '00005', divisionCodeName: '학교' },
        { divisionCode: '00007', divisionCodeName: '의료기관' },
        { divisionCode: '00008', divisionCodeName: '시설' },
        { divisionCode: '00009', divisionCodeName: '센터' },
        { divisionCode: '00010', divisionCodeName: '기타' },
      ],
    },
  },
  getters: {
    codeToValue(state) {
      return code => {
        if (!code) return null;

        const sectionCode = code.substr(0, 5);
        const divisionCode = code.substr(-5);
        return state[sectionCode].divisionCodeList.find(obj => obj.divisionCode === divisionCode).value;
      };
    },
    codeToDivisionCodeName(state) {
      return code => {
        if (!code) return null;

        const sectionCode = code.substr(0, 5);
        const divisionCode = code.substr(-5);
        return state[sectionCode].divisionCodeList.find(obj => obj.divisionCode === divisionCode).divisionCodeName;
      };
    },
    valueToCode(state) {
      return (sectionCode, value) => {
        if (!value) return null;

        const divisionCode = state[sectionCode].divisionCodeList.find(obj => obj.value === value).divisionCode;
        return sectionCode + divisionCode;
      };
    },
    codeToValueList(state) {
      return list => {
        for (const object of list) {
          for (const key in object) {
            const value = object[key];
            if (typeof value === 'string' && value.startsWith('C') && value.length === 10) {
              const sectionCode = value.substr(0, 5);
              const divisionCode = value.substr(-5);
              if (state[sectionCode]) {
                const codeObject = state[sectionCode].divisionCodeList.find(obj => obj.divisionCode === divisionCode);
                if (codeObject) {
                  object[key] = codeObject.value;
                }
              }
            }
          }
        }
        return list;
      };
    },
    codeToOptionList(state) {
      return code => {
        if (!code) return null;

        const sectionCode = code.substr(0, 5);
        return state[sectionCode].divisionCodeList.map(({ divisionCode: value, divisionCodeName: label }) => ({ value: sectionCode + value, label }));
      };
    },
  },
};
