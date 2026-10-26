import store from '@/store';

const optionsList = {
  A: [
    {
      id: 0,
      label: '없음',
      value: 0,
    },
    {
      id: 1,
      label: '있음',
      value: 1,
    },
  ],
  B: [
    {
      id: 0,
      label: '없음',
      value: 0,
    },
    {
      id: 1,
      label: '있음',
      value: 1,
    },
    {
      id: 2,
      label: '교정중',
      value: 3,
    },
  ],
  C: [
    {
      id: 0,
      label: '무턱',
      value: 1,
    },
    {
      id: 1,
      label: '주걱턱',
      value: 2,
    },
    {
      id: 2,
      label: '총생',
      value: 3,
    },
    {
      id: 3,
      label: '반대교합',
      value: 4,
    },
    {
      id: 4,
      label: '기타',
      value: 5,
    },
  ],
  D: [
    {
      id: 0,
      label: '치은출혈/비대',
      value: 1,
    },
    {
      id: 1,
      label: '치석형성',
      value: 2,
    },
    {
      id: 2,
      label: '치주낭형성',
      value: 3,
    },
    {
      id: 3,
      label: '기타',
      value: 4,
    },
  ],
  E: [
    {
      id: 0,
      label: '과잉치',
      value: 1,
    },
    {
      id: 1,
      label: '유치잔존',
      value: 2,
    },
  ],
  F: [
    {
      id: 0,
      label: '구강위생관리(칫솔질/치실질)',
      value: 1,
    },
    {
      id: 1,
      label: '바른 식습관',
      value: 2,
    },
    {
      id: 2,
      label: '불소이용법',
      value: 3,
    },
    {
      id: 3,
      label: '금연·금주',
      value: 4,
    },
  ],
  G: [
    {
      id: 0,
      label: '우수',
      value: 1,
    },
    {
      id: 1,
      label: '보통',
      value: 2,
    },
    {
      id: 2,
      label: '개선요망',
      value: 3,
    },
  ],
  H: [
    {
      id: 0,
      label: '실시',
      value: 1,
    },
    {
      id: 1,
      label: '미실시',
      value: 0,
    },
  ],
  I: [
    {
      id: 0,
      label: '협조 불가능',
      value: 1,
    },
    {
      id: 1,
      label: '보호자 거부',
      value: 2,
    },
    {
      id: 2,
      label: '병원 사유',
      value: 3,
    },
  ],
  J: [
    {
      id: 0,
      label: '전문가 구강위생관리',
      value: 1,
      appendTable: true,
    },
    {
      id: 1,
      label: '불소도포(불소바니쉬)',
      value: 2,
      appendTable: true,
    },
  ],
  K: [
    {
      id: 0,
      label: '치아홈메우기',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '치석제거',
      value: 2,
      appendTable: true,
    },
    {
      id: 2,
      label: '방사선 촬영',
      value: 4,
      appendTable: true,
    },
  ],
  L: [
    {
      id: 0,
      label: '정상',
      value: 1,
    },
    {
      id: 1,
      label: '주의',
      value: 2,
    },
    {
      id: 2,
      label: '치료필요',
      value: 3,
    },
  ],
  M: [
    {
      id: 0,
      label: '있다',
      value: 1,
    },
    {
      id: 1,
      label: '없다',
      value: 0,
    },
  ],
  N: [
    {
      id: 0,
      label: '그렇다',
      value: 1,
    },
    {
      id: 1,
      label: '아니다',
      value: 0,
    },
    {
      id: 2,
      label: '모르겠다',
      value: 2,
    },
  ],
  O: [
    {
      id: 0,
      label: '아침 식사 전',
      value: 1,
    },
    {
      id: 1,
      label: '아침 식사 후',
      value: 2,
    },
    {
      id: 2,
      label: '점심 식사 후<br/>(주 1~2회)',
      value: 3,
    },
    {
      id: 3,
      label: '점심 식사 후<br/>(주 3~4회)',
      value: 4,
    },
    {
      id: 4,
      label: '점심 식사 후<br/>(주 5회 이상)',
      value: 5,
    },
    {
      id: 5,
      label: '저녁 식사 후',
      value: 6,
    },
    {
      id: 6,
      label: '잠자기 직전',
      value: 7,
    },
    {
      id: 7,
      label: '간식 후',
      value: 8,
    },
  ],
  P: [
    {
      id: 0,
      label: '필요성을 못 느껴서',
      value: 1,
    },
    {
      id: 1,
      label: '칫솔, 치약을 가지고 다니기 귀찮아서',
      value: 2,
    },
    {
      id: 2,
      label: '시설이 부족해서',
      value: 3,
    },
    {
      id: 3,
      label: '시간이 없어서',
      value: 4,
    },
  ],
  Q: [
    {
      id: 0,
      label: '구강검진(치과의사 검사, 방사선 촬영)',
      value: 1,
    },
    {
      id: 1,
      label: '예방진료(치아홈메우기, 불소도포 등)',
      value: 2,
    },
    {
      id: 2,
      label: '구강보건교육(칫솔질, 치실, 치간칫솔 사용 방법 등)',
      value: 3,
    },
    {
      id: 3,
      label: '치면세균막검사',
      value: 4,
    },
    {
      id: 4,
      label: '충치치료(발치, 아말감, 레진, 신경치료 등)',
      value: 5,
    },
    {
      id: 5,
      label: '잇몸병치료',
      value: 6,
    },
    {
      id: 6,
      label: '치아외상치료',
      value: 7,
    },
    {
      id: 7,
      label: '치아교정치료',
      value: 8,
    },
    {
      id: 8,
      label: '방문한적 없음',
      value: 0,
    },
    {
      id: 9,
      label: '기타',
      value: 10,
    },
  ],
  R: [
    {
      id: 0,
      label: '구강검진',
      value: 1,
    },
    {
      id: 1,
      label: '충치예방(불소도포)',
      value: 2,
    },
    {
      id: 2,
      label: '치아홈메우기',
      value: 3,
    },
    {
      id: 3,
      label: '충치치료 및 발치',
      value: 4,
    },
    {
      id: 4,
      label: '치면세균막 교육',
      value: 5,
    },
    {
      id: 5,
      label: '칫솔질 교육',
      value: 6,
    },
    {
      id: 6,
      label: '치실사용 교육',
      value: 7,
    },
    {
      id: 7,
      label: '바른식습관 교육',
      value: 8,
    },
    {
      id: 8,
      label: '불소이용교육',
      value: 9,
    },
    {
      id: 9,
      label: '방문한적 없음',
      value: 0,
    },
  ],
  S: [
    {
      id: 0,
      label: '있다',
      value: 1,
    },
    {
      id: 1,
      label: '없다',
      value: 0,
    },
    {
      id: 2,
      label: '모르겠다',
      value: 2,
    },
  ],
  T: [
    {
      id: 0,
      label: '아침 식사 전',
      value: 1,
    },
    {
      id: 1,
      label: '아침 식사 후',
      value: 2,
    },
    {
      id: 2,
      label: '점심 식사 전',
      value: 3,
    },
    {
      id: 3,
      label: '점심 식사 후',
      value: 4,
    },
    {
      id: 4,
      label: '저녁 식사 전',
      value: 5,
    },
    {
      id: 5,
      label: '저녁 식사 후',
      value: 6,
    },
    {
      id: 6,
      label: '간식 후',
      value: 7,
    },
    {
      id: 7,
      label: '잠자기 전',
      value: 8,
    },
    {
      id: 8,
      label: '칫솔질하지 않음',
      value: 0,
    },
  ],
  U: [
    {
      id: 0,
      label: '치실',
      value: 1,
    },
    {
      id: 1,
      label: '구강양치액',
      value: 2,
    },
    {
      id: 2,
      label: '전동칫솔',
      value: 3,
    },
    {
      id: 3,
      label: '없음',
      value: 0,
    },
    {
      id: 4,
      label: '기타',
      value: 4,
    },
  ],
  V: [
    {
      id: 0,
      label: '30초 이내',
      value: 1,
    },
    {
      id: 1,
      label: '1분 정도',
      value: 2,
    },
    {
      id: 2,
      label: '2분 정도',
      value: 3,
    },
    {
      id: 3,
      label: '3분 정도',
      value: 4,
    },
    {
      id: 4,
      label: '3분 이상',
      value: 5,
    },
  ],
  W: [
    {
      id: 0,
      label: '그렇다',
      value: 1,
    },
    {
      id: 1,
      label: '그렇지 않다',
      value: 0,
    },
    {
      id: 2,
      label: '모르겠다',
      value: 2,
    },
  ],
  X: [
    {
      id: 0,
      label: '매우 그렇다',
      value: 1,
    },
    {
      id: 1,
      label: '그렇다',
      value: 2,
    },
    {
      id: 2,
      label: '그렇지 않다',
      value: 3,
    },
    {
      id: 3,
      label: '전혀 그렇지 않다',
      value: 4,
    },
  ],
  Y: [
    {
      id: 0,
      label: '매우 건강하다',
      value: 1,
    },
    {
      id: 1,
      label: '건강하다',
      value: 2,
    },
    {
      id: 2,
      label: '건강하지 않다',
      value: 3,
    },
    {
      id: 3,
      label: '매우 건강하지 않다',
      value: 4,
    },
  ],
  Z: [
    {
      id: 0,
      label: '치근단',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '파노라마',
      value: 2,
      appendTable: true,
    },
  ],
  AA: [
    {
      id: 0,
      label: '아말감',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '레진',
      value: 2,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 2,
      label: 'G.I',
      value: 3,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 3,
      label: '인레이',
      value: 4,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 4,
      label: '크라운',
      value: 5,
      popup: 'enable',
      appendTable: true,
    },
  ],
  AA2020: [
    {
      id: 0,
      label: 'G.I',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '레진',
      value: 2,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 2,
      label: '아말감',
      value: 3,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 5,
      label: '인레이',
      value: 6,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 6,
      label: '크라운',
      value: 7,
      popup: 'enable',
      appendTable: true,
    },
  ],
  AB: [
    {
      id: 0,
      label: '부분',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '전체',
      value: 2,
      appendTable: true,
    },
  ],
  AC: [
    {
      id: 0,
      label: '필요없음 (검진비용 48,000원 청구)',
      value: 0,
    },
    {
      id: 1,
      label: '필요 (보건소 유선 승인 후 심화치료 및 비용청구)',
      value: 1,
    },
  ],
  AD: [
    {
      id: 0,
      label: '아침식사 전',
      value: 1,
    },
    {
      id: 1,
      label: '아침식사 후',
      value: 2,
    },
    {
      id: 2,
      label: '점심식사 후',
      value: 4,
    },
    {
      id: 3,
      label: '저녁식사 후',
      value: 6,
    },
    {
      id: 4,
      label: '잠자기 직전',
      value: 8,
    },
    {
      id: 5,
      label: '간식섭취 후',
      value: 7,
    },
  ],
  AE: [
    {
      id: 0,
      label: '그렇다',
      value: 1,
    },
    {
      id: 1,
      label: '보통이다',
      value: 3,
    },
    {
      id: 2,
      label: '아니다',
      value: 0,
    },
  ],
  AF: [
    {
      id: 0,
      label: '예',
      value: 1,
    },
    {
      id: 1,
      label: '아니오',
      value: 0,
    },
    {
      id: 2,
      label: '불소치약이 무엇인지 모름',
      value: 2,
    },
  ],
  AG: [
    {
      id: 0,
      label: '1회',
      value: 1,
    },
    {
      id: 1,
      label: '2회',
      value: 2,
    },
    {
      id: 2,
      label: '3회',
      value: 3,
    },
    {
      id: 3,
      label: '4회',
      value: 4,
    },
    {
      id: 4,
      label: '5회 이상',
      value: 5,
    },
  ],
  AH: [
    {
      id: 0,
      label: '아침 식사 전',
      value: 1,
    },
    {
      id: 1,
      label: '아침 식사 후',
      value: 2,
    },
    {
      id: 2,
      label: '점심 식사 후',
      value: 4,
    },
    {
      id: 3,
      label: '간식 후',
      value: 7,
    },
    {
      id: 4,
      label: '저녁 식사 후',
      value: 6,
    },
    {
      id: 5,
      label: '잠자기 전',
      value: 8,
    },
  ],
  AI: [
    {
      id: 0,
      label: '치실',
      value: 1,
    },
    {
      id: 1,
      label: '구강청결제',
      value: 2,
    },
    {
      id: 2,
      label: '불소양치용액',
      value: 5,
    },
    {
      id: 3,
      label: '없음',
      value: 0,
    },
  ],
  AJ: [
    {
      id: 0,
      label: '없음',
      value: 0,
    },
    {
      id: 1,
      label: '교정필요',
      value: 1,
    },
    {
      id: 2,
      label: '교정중',
      value: 3,
    },
  ],
  AK: [
    {
      id: 0,
      label: '없음',
      value: 0,
    },
    {
      id: 1,
      label: '있음',
      value: 2,
    },
    {
      id: 2,
      label: '교정중',
      value: 3,
    },
  ],
  AL: [
    {
      id: 0,
      label: '없음',
      value: 0,
    },
    {
      id: 1,
      label: '요교정',
      value: 2,
    },
    {
      id: 2,
      label: '교정중',
      value: 3,
    },
  ],
  AM: [
    {
      id: 0,
      label: '치아홈메우기',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '치석제거',
      value: 2,
      appendTable: true,
    },
  ],
  AN: [
    {
      id: 0,
      label: '치아홈메우기',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '부분 치석제거',
      value: 3,
      appendTable: true,
    },
    {
      id: 2,
      label: '파노라마 촬영',
      value: 4,
      appendTable: true,
    },
  ],
  AO: [
    {
      id: 0,
      label: '치아홈메우기',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '단순 치석제거',
      value: 2,
      appendTable: true,
    },
    {
      id: 2,
      label: '파노라마 촬영',
      value: 4,
      appendTable: true,
    },
  ],
  AP: [
    {
      id: 0,
      label: '구강위생관리(칫솔질/치실질)',
      value: 1,
    },
    {
      id: 1,
      label: '바른 식습관',
      value: 2,
    },
    {
      id: 2,
      label: '불소이용법',
      value: 3,
    },
  ],
  AQ: [
    {
      id: 0,
      label: '전문가 구강위생관리',
      value: 1,
      appendTable: true,
    },
    {
      id: 1,
      label: '불소도포(불소바니쉬)',
      value: 2,
      appendTable: true,
    },
    {
      id: 2,
      label: '파노라마 촬영',
      value: 3,
      appendTable: true,
    },
  ],
  AR: [
    {
      id: 0,
      label: '모두정상 : 구강검진결과 모든 치아 상태가 양호함으로 치아 위생 상태를 유지하여 건강한 학교생활을 영위하시기 바랍니다.',
      label_G_1: '모두정상',
      label_G_2: ': 구강검진결과 모든 치아 상태가 양호함으로 치아 위생 상태를 유지하여 건강한 학교생활을 영위하시기 바랍니다.',
      value: 0,
    },
    {
      id: 1,
      label: '충치 : 내원하여 치료요망',
      value: 1,
    },
    {
      id: 2,
      label: '충치발생 위험치아 : 내원하여 치료요망',
      value: 2,
    },
    {
      id: 3,
      label: '결손치아 : 내원하여 치료요망',
      value: 3,
    },
    {
      id: 4,
      label: '구내염 : 내원하여 치료요망',
      value: 4,
    },
    {
      id: 5,
      label: '치주질환 : 내원하여 치료요망',
      value: 5,
    },
    {
      id: 6,
      label: '부정교합 : 내원하여 치료요망',
      value: 6,
    },
    {
      id: 7,
      label: '치아위생상태 : 구강위생상태에 신경쓰시기 바랍니다.',
      value: 7,
    },
    {
      id: 8,
      label: '기타',
      value: 8,
    },
    {
      id: 9,
      label: '인접면충치 : 육안으로 보이지 않을 수 있습니다.',
      value: 9,
    },
  ],
  AS: [
    {
      id: 0,
      label: '관리 상태가 양호합니다.',
      value: 1,
    },
    {
      id: 1,
      label: '좀 더 열심히 칫솔질을 해야 합니다.',
      value: 2,
    },
    {
      id: 2,
      label: '즉시 내원하여 치료 요망',
      value: 3,
    },
    {
      id: 3,
      label: '금일간 치과에 내원하여 치료 요함',
      value: 4,
    },
    {
      id: 4,
      label: '하루 3회 양치질 / 3개월에 한 번씩 구강검진 요함',
      value: 5,
    },
    {
      id: 5,
      label: '하루 3회 양치질 / 6개월에 한 번씩 구강검진 요함',
      value: 6,
    },
    {
      id: 6,
      label: '실런트(치아홈메우기) 포함한 예방진료 요함',
      value: 7,
    },
    {
      id: 7,
      label: '기타',
      value: 8,
    },
  ],
  AT: [
    {
      id: 0,
      label: '정상',
      value: 1,
    },
    {
      id: 1,
      label: '정상(경계)',
      value: 2,
    },
    {
      id: 2,
      label: '개선요망',
      value: 3,
    },
  ],
  AU: [
    {
      id: 0,
      label: '단순 치석제거',
      value: 2,
      appendTable: true,
    },
    {
      id: 1,
      label: '방사선 촬영',
      value: 4,
      appendTable: true,
    },
    {
      id: 2,
      label: '치아홈메우기',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
  ],
  AV: [
    {
      id: 0,
      label: '구강검진',
      value: 4,
      appendTable: true,
    },
    {
      id: 1,
      label: '전문가 구강위생관리',
      value: 1,
      appendTable: true,
    },
    {
      id: 2,
      label: '불소도포(불소바니쉬)',
      value: 2,
      appendTable: true,
    },
  ],
  AW: [
    {
      id: 0,
      label: '인레이',
      value: 4,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '크라운',
      value: 5,
      popup: 'enable',
      appendTable: true,
    },
  ],
  AX: [
    {
      id: 0,
      label: 'X-ray',
      value: 1,
    },
    {
      id: 1,
      label: '불소도포',
      value: 2,
    },
  ],
  AY: [
    {
      id: 0,
      label: '안한다',
      value: 1,
    },
    {
      id: 1,
      label: '주 1~2회 한다',
      value: 2,
    },
    {
      id: 2,
      label: '주 3~4회 한다',
      value: 3,
    },
    {
      id: 3,
      label: '매일 한다',
      value: 4,
    },
  ],
  AZ: [
    {
      id: 0,
      label: '치아홈메우기',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '치석제거',
      value: 2,
      sub: 'n_13_2_radio',
    },
    {
      id: 2,
      label: '방사선 촬영',
      value: 4,
      sub: 'n_13_4_check',
    },
  ],
  BA: [
    {
      id: 0,
      label: '아침 식사 전',
      value: 1,
    },
    {
      id: 1,
      label: '아침 식사 후',
      value: 2,
    },
    {
      id: 2,
      label: '점심 식사 후',
      value: 4,
    },
    {
      id: 3,
      label: '저녁 식사 후',
      value: 6,
    },
    {
      id: 4,
      label: '잠자기 직전',
      value: 8,
    },
    {
      id: 5,
      label: '간식 후',
      value: 7,
    },
  ],
  BB: [
    {
      id: 0,
      label: '치실',
      value: 1,
    },
    {
      id: 1,
      label: '치간칫솔',
      value: 6,
    },
    {
      id: 2,
      label: '구강청결제',
      value: 2,
    },
    {
      id: 3,
      label: '불소용액',
      value: 5,
    },
    {
      id: 4,
      label: '없음',
      value: 0,
    },
  ],
  BC: [
    {
      id: 0,
      label: '하지 않음',
      value: 1,
    },
    {
      id: 1,
      label: '주 1~2회',
      value: 2,
    },
    {
      id: 2,
      label: '주 3~4회',
      value: 3,
    },
    {
      id: 3,
      label: '주 4~5회',
      value: 5,
    },
  ],
  BD: [
    {
      id: 0,
      label: '전문가 구강위생관리',
      value: 1,
      appendTable: true,
    },
    {
      id: 1,
      label: '불소도포(불소바니쉬/겔)',
      value: 2,
      appendTable: true,
    },
  ],
  BE: [
    {
      id: 0,
      label: '문진 및 구강검사',
      value: 1,
    },
    {
      id: 1,
      label: '구강위생검사 (PHP index)',
      value: 2,
    },
    {
      id: 2,
      label: '구강교육',
      value: 3,
    },
    {
      id: 3,
      label: '불소도포',
      value: 4,
    },
    {
      id: 4,
      label: '치아홈메우기',
      value: 5,
    },
    {
      id: 5,
      label: '방사선촬영',
      value: 6,
    },
    {
      id: 6,
      label: '치석제거',
      value: 7,
    },
    {
      id: 7,
      label: '기타',
      value: 8,
    },
  ],
  BF: [
    {
      id: 0,
      label: '사업 매뉴얼 (사업운영지침)',
      value: 1,
    },
    {
      id: 1,
      label: '사업에 대한 사전교육 (충분한 사업 안내)',
      value: 2,
    },
    {
      id: 2,
      label: '전산프로그램 편의성',
      value: 3,
    },
    {
      id: 3,
      label: '비용 청구 및 지급 절차',
      value: 4,
    },
    {
      id: 4,
      label: '기타',
      value: 5,
    },
  ],
  BG: [
    {
      id: 0,
      label: '없음',
      value: -1,
    },
    {
      id: 1,
      label: '있음',
      value: 1,
    },
  ],
  BH: [
    {
      id: 0,
      label: '없음',
      value: -1,
    },
    {
      id: 1,
      label: '있음',
      value: 1,
    },
    {
      id: 2,
      label: '교정중',
      value: 2,
    },
  ],
  BI: [
    {
      id: 0,
      label: '큐스캔 교육',
      value: 27,
      appendTable: true,
    },
    {
      id: 1,
      label: '불소도포(불소바니쉬)',
      value: 12,
      appendTable: true,
    },
  ],
  BJ: [
    {
      id: 0,
      label: '치아홈메우기',
      value: 13,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '치석제거',
      value: 14,
      appendTable: true,
    },
    {
      id: 2,
      label: '파노라마 촬영',
      label_busan: '방사선 촬영',
      value: 15,
      appendTable: true,
    },
    {
      id: 3,
      label: '치근단 촬영',
      value: 16,
      appendTable: true,
    },
  ],
  BK: [
    {
      id: 0,
      label: '충치치료',
      value: 1,
    },
    {
      id: 1,
      label: '발치',
      value: 2,
    },
    {
      id: 2,
      label: '치수/치근단 치료',
      value: 3,
    },
    {
      id: 3,
      label: '기타',
      value: 4,
    },
  ],
  BL: [
    {
      id: 0,
      label: '실시',
      value: 1,
    },
    {
      id: 1,
      label: '미실시',
      value: -1,
    },
  ],
  BM: [
    {
      id: 0,
      label: '필요없음',
      value: -1,
    },
    {
      id: 1,
      label: '필요',
      value: 1,
    },
  ],
  BN: [
    {
      id: 0,
      label: '전문가 구강위생관리',
      value: 11,
      appendTable: true,
    },
    {
      id: 1,
      label: '불소도포(불소바니쉬)',
      value: 12,
      appendTable: true,
    },
  ],
  BO: [
    {
      id: 0,
      label: '레진',
      value: 2,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '인레이',
      value: 6,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 2,
      label: '크라운',
      value: 7,
      popup: 'enable',
      appendTable: true,
    },
  ],
  BP: [
    {
      id: 0,
      label: '예',
      value: 1,
    },
    {
      id: 1,
      label: '아니오',
      value: 0,
    },
  ],
  BQ: [
    {
      id: 0,
      label: '상',
      value: 1,
    },
    {
      id: 1,
      label: '중',
      value: 2,
    },
    {
      id: 2,
      label: '하',
      value: 3,
    },
  ],
  BR: [
    {
      id: 0,
      label: '실시',
      value: 1,
    },
    {
      id: 1,
      label: '간이 구강위생지수',
      value: 2,
    },
  ],
  BS: [
    {
      id: 0,
      label: '양호(0~6점)',
      value: 1,
    },
    {
      id: 1,
      label: '보통(7~12점)',
      value: 2,
    },
    {
      id: 2,
      label: '개선필요(13~18점)',
      value: 3,
    },
  ],
  BT: [
    {
      id: 0,
      label: '매우 그렇다',
      value: 1,
    },
    {
      id: 1,
      label: '대체로 그렇다',
      value: 2,
    },
    {
      id: 2,
      label: '대체로 그렇지 않다',
      value: 3,
    },
    {
      id: 3,
      label: '전혀 그렇지 않다',
      value: 4,
    },
  ],
  BU: [
    {
      id: 0,
      label: '학교 안내',
      value: 1,
    },
    {
      id: 1,
      label: '주변 지인의 권유',
      value: 2,
    },
    {
      id: 2,
      label: '치과의사의 권유',
      value: 3,
    },
    {
      id: 3,
      label: '보건소 방문을 계기로',
      value: 4,
    },
    {
      id: 4,
      label: '기타',
      value: 5,
    },
  ],
  BV: [
    {
      id: 0,
      label: '적절하다',
      value: 1,
    },
    {
      id: 1,
      label: '적절하지 않다',
      value: 0,
    },
  ],
  BW: [
    {
      id: 0,
      label: '의료/진료 서비스',
      value: 1,
    },
    {
      id: 1,
      label: '적정 진료시간 할애 (충분한 진료, 상담, 주의사항 설명 등)',
      value: 2,
    },
    {
      id: 2,
      label: '예약 편리성 (야간, 휴일 등 원하는 시간에 이용)',
      value: 3,
    },
    {
      id: 3,
      label: '병원 내 대기시간',
      value: 4,
    },
    {
      id: 4,
      label: '의료진의 태도 (친절도 등)',
      value: 5,
    },
    {
      id: 5,
      label: '접근성 (이용 가능한 치과와의 거리 등)',
      value: 6,
    },
    {
      id: 6,
      label: '병원 내 환경 (시설, 장비 등)',
      value: 7,
    },
    {
      id: 7,
      label: '기타',
      value: 8,
    },
  ],
  BX: [
    {
      id: 0,
      label: '치아홈메우기',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 1,
      label: '간단한 치석제거',
      value: 2,
      appendTable: true,
    },
    {
      id: 2,
      label: '기타',
      value: 0,
      popup: 'enable',
      appendTable: true,
    },
  ],
  BY: [
    {
      id: 0,
      label: '실시',
      value: 1,
    },
    {
      id: 1,
      label: '음식물잔사지수',
      value: 3,
    },
    {
      id: 2,
      label: '미실시',
      value: 0,
    },
  ],
  BZ: [
    {
      id: 0,
      label: '양호',
      value: 1,
    },
    {
      id: 1,
      label: '보통',
      value: 2,
    },
    {
      id: 2,
      label: '개선요망',
      value: 3,
    },
  ],
  CA: [
    {
      id: 0,
      label: '전문가 구강위생관리',
      value: 1,
      appendTable: true,
    },
    {
      id: 1,
      label: '불소도포(불소바니쉬 등)',
      value: 2,
      appendTable: true,
    },
    {
      id: 2,
      label: '파노라마(방사선) 촬영',
      value: 3,
      appendTable: true,
    },
  ],
  CB: [
    {
      id: 0,
      label: '0번',
      value: 0,
    },
    {
      id: 1,
      label: '1번',
      value: 1,
    },
    {
      id: 2,
      label: '2번',
      value: 2,
    },
    {
      id: 3,
      label: '3번',
      value: 3,
    },
    {
      id: 4,
      label: '4번',
      value: 4,
    },
    {
      id: 5,
      label: '5번',
      value: 5,
    },
    {
      id: 6,
      label: '6번',
      value: 6,
    },
    {
      id: 7,
      label: '7번',
      value: 7,
    },
    {
      id: 8,
      label: '8번',
      value: 8,
    },
    {
      id: 9,
      label: '9번 이상',
      value: 9,
    },
  ],
  CC: [
    {
      id: 0,
      label: '우식',
      value: 1,
    },
    {
      id: 1,
      label: '선천적',
      value: 2,
    },
    {
      id: 2,
      label: '사고',
      value: 3,
    },
  ],
  CD: [
    {
      id: 0,
      label: '구강검진',
      value: 1,
    },
    {
      id: 1,
      label: '충치예방(불소도포)',
      value: 2,
    },
    {
      id: 2,
      label: '치아홈메우기',
      value: 3,
    },
    {
      id: 3,
      label: '충치치료 및 발치',
      value: 4,
    },
    {
      id: 4,
      label: '치면세균막 교육',
      value: 5,
    },
    {
      id: 5,
      label: '칫솔질 교육',
      value: 6,
    },
    {
      id: 6,
      label: '치실사용 교육',
      value: 7,
    },
    {
      id: 7,
      label: '바른식습관 교육',
      value: 8,
    },
    {
      id: 8,
      label: '불소이용교육',
      value: 9,
    },
    {
      id: 9,
      label: '방문한적 없음',
      value: 0,
    },
    {
      id: 10,
      label: '기타',
      value: 10,
    },
  ],
  CE: [
    {
      id: 0,
      label: '불소도포(불소바니쉬)',
      value: 2,
      appendTable: true,
    },
    {
      id: 1,
      label: '전문가 구강위생관리',
      value: 1,
      appendTable: true,
    },
  ],
  CF: [
    {
      id: 1,
      label: '치아홈메우기',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 2,
      label: '치석제거',
      value: 2,
      sub: 'n_13_2_radio',
      divide: true,
    },
    {
      id: 3,
      label: '방사선 촬영',
      value: 4,
      sub: 'n_13_4_check',
    },
  ],
  CG: [
    {
      id: 0,
      label: '아침 식사 전',
      value: 1,
    },
    {
      id: 1,
      label: '아침 식사 후',
      value: 2,
    },
    {
      id: 2,
      label: '점심 식사 후',
      value: 4,
    },
    {
      id: 3,
      label: '저녁 식사 후',
      value: 6,
    },
    {
      id: 4,
      label: '간식 후',
      value: 7,
    },
    {
      id: 5,
      label: '잠자기 전',
      value: 8,
    },
    {
      id: 6,
      label: '칫솔질하지 않음',
      value: 0,
    },
  ],
  CH: [
    {
      id: 0,
      label: '불소도포(불소바니쉬 등)',
      value: 6,
      appendTable: true,
    },
    {
      id: 1,
      label: '치아홈메우기',
      value: 1,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 2,
      label: '치석제거',
      value: 2,
      popup: 'enable',
      appendTable: true,
    },
  ],
  CI: [
    {
      id: 0,
      label: '실시',
      value: 1,
    },
    {
      id: 1,
      label: '음식물잔사지수',
      value: 3,
    },
  ],
  CJ: [
    {
      id: 0,
      label: '구강위생관리 교육, 칫솔질/치실질, 바른 식습관, 불소이용법',
      value: 0,
    },
  ],
  CK: [
    {
      id: 0,
      label: '치아우식증(충치) 치료 필요',
      value: 1,
    },
    {
      id: 1,
      label: '발치 필요',
      value: 2,
    },
    {
      id: 2,
      label: '치아홈메우기 필요',
      value: 3,
    },
    {
      id: 3,
      label: '치석제거 필요',
      value: 4,
    },
    {
      id: 4,
      label: '기타',
      value: 5,
    },
  ],
  CL: [
    {
      id: 3,
      label: 'GI',
      value: 7,
      popup: 'enable',
      appendTable: true,
    },
    {
      id: 4,
      label: '레진',
      value: 8,
      popup: 'enable',
      appendTable: true,
    },
  ],
  CM: [
    {
      id: 0,
      label: '매우 그렇다',
      value: 1,
    },
    {
      id: 1,
      label: '그렇다',
      value: 2,
    },
    {
      id: 2,
      label: '보통이다',
      value: 3,
    },
    {
      id: 3,
      label: '그렇지 않다',
      value: 4,
    },
  ],
  CN: [
    {
      id: 0,
      label: '치태 및 치면세균막 제거',
      value: 5,
      appendTable: true,
    },
    {
      id: 1,
      label: '불소도포(불소바니쉬)',
      value: 2,
      appendTable: true,
    },
  ],
};
const questionnaire = () => {
  return {
    q_1: {
      name: 'q_1',
      id: 'q_1',
      label: '치아가 깨지거나 부러짐',
      value: '',
      options: optionsList.M,
      type: 'radio',
    },
    q_2: {
      name: 'q_2',
      id: 'q_2',
      label: '차갑고 뜨거운 음료를 마시거나 음식을 먹을 때 치아가 아픔',
      value: '',
      options: optionsList.M,
      type: 'radio',
    },
    q_3: {
      name: 'q_3',
      id: 'q_3',
      label: '가만히 있을 때에도 치아와 잇몸 주변이 쑤시고 욱신거리고 아픔',
      value: '',
      options: optionsList.M,
      type: 'radio',
    },
    q_4: {
      name: 'q_4',
      id: 'q_4',
      label: '칫솔질할 때, 입안에서 피가 남',
      value: '',
      options: optionsList.M,
      type: 'radio',
    },
    q_5: {
      name: 'q_5',
      id: 'q_5',
      label: '혀 또는 입 안쪽 뺨이 욱신거리며 아픔',
      value: '',
      options: optionsList.M,
      type: 'radio',
    },
    q_6: {
      name: 'q_6',
      id: 'q_6',
      label: '불쾌한 입 냄새가 남',
      value: '',
      options: optionsList.M,
      type: 'radio',
    },
    q_7: {
      name: 'q_7',
      id: 'q_7',
      label: '과자 등 단 음식, 탄산음료 등을 즐겨 먹습니까?',
      value: '',
      options: optionsList.N,
      type: 'radio',
    },
    q_8: {
      name: 'q_8',
      id: 'q_8',
      label: '현재 사용 중인 치약에 불소가 들어있습니까?',
      value: '',
      options: optionsList.N,
      type: 'radio',
    },
    q_9: {
      name: 'q_9[]',
      id: 'q_9',
      label: '한 주 동안 칫솔질한 때를 모두 표시해 주세요.<br/>(‘점심 식사 후’ 항목 중 하나라도 표시한 경우에는 다음 문항을 건너뛰세요)',
      value: [],
      options: optionsList.O,
      type: 'checkbox',
    },
    q_9_1: {
      name: 'q_9_1',
      id: 'q_9_1',
      label: '점심 식사 후 칫솔질을 하지 않는 경우,<br/>그 이유는 무엇입니까?',
      value: '',
      options: optionsList.P,
      type: 'radio',
    },
    q_10: {
      name: 'q_10[]',
      id: 'q_10',
      label: '지난 1년간 치과병의원에서 받은 진료와 교육에 모두 표시해주세요.',
      value: [],
      options: optionsList.Q,
      type: 'checkbox',
    },
    q_10_input: {
      name: 'q_10_input',
      id: 'q_10_input',
      label: '기타',
      value: '',
      placeholder: '기타 사항이 있을 경우 작성해 주세요. (최대 100자)',
      type: 'textarea',
    },
    q_11: {
      name: 'q_11',
      id: 'q_11',
      label: '담배 또는 술로 입냄새, 잇몸손상, 구강암, 염증 등이 발생될 수 있다고 듣거나 배운 적이 있습니까?',
      value: '',
      options: optionsList.S,
      type: 'radio',
    },
    q_12: {
      name: 'q_12[]',
      id: 'q_12',
      label: '어제 하루 동안 칫솔질한 때를 모두 표시해주세요.',
      value: [],
      options: optionsList.T,
      type: 'checkbox',
    },
    q_13: {
      name: 'q_13[]',
      id: 'q_13',
      label: '칫솔, 치약 외 사용하는 것에 모두 표시해주세요.',
      value: [],
      options: optionsList.U,
      type: 'checkbox',
    },
    q_13_input: {
      name: 'q_13_input',
      id: 'q_13_input',
      label: '기타',
      value: '',
      placeholder: '기타 사항이 있을 경우 작성해 주세요. (최대 100자)',
      type: 'textarea',
    },
    q_14: {
      name: 'q_14',
      id: 'q_14',
      label: '칫솔질할 때 얼마나 오래 닦나요?',
      value: '',
      options: optionsList.V,
      type: 'radio',
    },
    q_15_1: {
      name: 'q_15_1',
      id: 'q_15_1',
      label: '칫솔질을 할 때 위는 아래 방향으로, 아래는 위 방향으로 회전해서 닦고 있나요?',
      value: '',
      options: optionsList.W,
      type: 'radio',
    },
    q_15_2: {
      name: 'q_15_2',
      id: 'q_15_2',
      label: '칫솔은 칫솔모가 옆으로 휘어지기 전에 새것으로 교체하나요?',
      value: '',
      options: optionsList.W,
      type: 'radio',
    },
    q_15_3: {
      name: 'q_15_3',
      id: 'q_15_3',
      label: '설탕이 포함된 과자, 사탕, 젤리, 아이스크림, 콜라 등을 즐겨 먹나요?',
      value: '',
      options: optionsList.W,
      type: 'radio',
    },
    q_15_4: {
      name: 'q_15_4',
      id: 'q_15_4',
      label: '(3번 문항에 "그렇다"고 응답한 경우) 1주일에 ( ) 회',
      value: '',
      options: optionsList.AG,
      type: 'radio',
    },
    q_15_5: {
      name: 'q_15_5',
      id: 'q_15_5',
      label: '이에 좋은 음식과 나쁜 음식을 구별할 수 있나요?',
      value: '',
      options: optionsList.W,
      type: 'radio',
    },
    q_15_6: {
      name: 'q_15_6',
      id: 'q_15_6',
      label: '불소를 도포하면 충치를 예방할 수 있을까요?',
      value: '',
      options: optionsList.W,
      type: 'radio',
    },
    q_15_7: {
      name: 'q_15_7',
      id: 'q_15_7',
      label: '치과에 정기적으로 가서 검진(진료)을 받아야 할까요?',
      value: '',
      options: optionsList.W,
      type: 'radio',
    },
    q_16: {
      name: 'q_16',
      id: 'q_16',
      label: '올바른 칫솔질, 바른 식습관을 통해 내 치아를 잘 관리할 자신이 있나요?',
      value: '',
      options: optionsList.X,
      type: 'radio',
    },
    q_17: {
      name: 'q_17',
      id: 'q_17',
      label: '치아와 잇몸 등 스스로의 구강건강상태가 어떤 편이라고 생각하나요?',
      value: '',
      options: optionsList.Y,
      type: 'radio',
    },
    q_18: {
      name: 'q_18',
      id: 'q_18',
      label: '지난 1년간 치과병(의)원에 간 적이 있습니까?',
      value: '',
      options: optionsList.S,
      type: 'radio',
    },
    q_19: {
      name: 'q_19',
      id: 'q_19',
      label: '자신의 치아와 잇몸이 건강하다고 생각하나요?',
      value: '',
      options: optionsList.N,
      type: 'radio',
    },
    q_20: {
      name: 'q_20',
      id: 'q_20',
      label: '불소가 치아건강에 도움을 준다고 생각하나요?',
      value: '',
      options: optionsList.N,
      type: 'radio',
    },
    q_21: {
      name: 'q_21',
      id: 'q_21',
      label: '술이 입 냄새, 잇몸손상, 구강암, 염증 등이 발생될 수 있다고 들었거나 배운 적이 있습니까?',
      value: '',
      options: optionsList.S,
      type: 'radio',
    },
    q_22: {
      name: 'q_22',
      id: 'q_22',
      label: '어제 하루동안 칫솔질을 몇 번 하였습니까?',
      value: '',
      options: optionsList.CB,
      type: 'radio',
    },
    q_23: {
      name: 'q_23',
      id: 'q_23',
      label: '최근 일주일 동안 학교에서 급식 후 칫솔질을 하고 있습니까?',
      value: '',
      options: optionsList.BP,
      type: 'radio',
    },
    q_23_1: {
      name: 'q_23_1',
      id: 'q_23_1',
      label: '(11번에 아니오로 답한 경우에만)<br/>학교 급식 후 칫솔질을 하지 않는 경우, 그 이유는 무엇입니까?',
      value: '',
      options: optionsList.P,
      type: 'radio',
    },
    q_say: {
      name: 'q_say',
      id: 'q_say',
      label: '치과의사 선생님께 하고 싶은 말을 작성해 주세요.',
      value: '',
      type: 'textarea',
      placeholder: '하고 싶은 말을 작성해 주세요. (최대 200자)',
    },
  };
};
const studentSurvey = () => {
  return {
    q_1: {
      name: 'q_1',
      id: 'q_1',
      label: '귀하의 자녀는 정기적으로/정해놓고 이용하는 동네 치과 의료기관이 있습니까?',
      value: '',
      options: optionsList.M,
      type: 'radio',
    },
    q_2: {
      name: 'q_2',
      id: 'q_2',
      label: '귀하의 {{divName}} 서비스를 받기 전, 3개월 내 아이(자녀)의 구강건강 및 질병과 관련하여 치과의사와 상담의 필요성을 느낀적이 있습니까?',
      value: '',
      options: optionsList.M,
      type: 'radio',
    },
    q_3: {
      name: 'q_3',
      id: 'q_3',
      label: '귀하는 동네 치과의원 가운데 아이(자녀)의 건강관리를 전담으로 상담해주는 치과의사가 필요하다고 생각하십니까?',
      value: '',
      options: optionsList.BT,
      type: 'radio',
    },
    q_4: {
      name: 'q_4[]',
      id: 'q_4',
      label: '귀하(보호자)의 아이(자녀)가 {{divName}} 서비스를 이용하게 된 계기는 무엇입니까?<br/>(복수응답 가능)',
      value: [],
      options: optionsList.BU,
      type: 'checkbox',
    },
    q_4_input: {
      name: 'q_4_input',
      id: 'q_4_input',
      label: '기타',
      value: '',
      placeholder: '기타 사항이 있을 경우 작성해 주세요. (최대 100자)',
      type: 'textarea',
    },
    q_5: {
      name: 'q_5',
      id: 'q_5',
      label: '귀하(보호자)께서는 아이(자녀)가 제공받은 {{divName}} 서비스가 필요하다고 생각하십니까?',
      value: '',
      options: optionsList.BT,
      type: 'radio',
    },
    q_6: {
      name: 'q_6',
      id: 'q_6',
      label: '{{divName}} 서비스가 귀하의 자녀의 구강건강관리에 도움이 되었습니까?',
      value: '',
      options: optionsList.BT,
      type: 'radio',
    },
    q_7: {
      name: 'q_7',
      id: 'q_7',
      label: '귀하(보호자)께서는 {{divName}} 서비스를 주변 사람에게 권유하시겠습니까?',
      value: '',
      options: optionsList.BT,
      type: 'radio',
    },
    q_8: {
      name: 'q_8',
      id: 'q_8',
      label:
        '경기도 초등학생 {{divName}} 사업은 1인 {{price}}원의 비용을 지원하고 있습니다.<br/>귀하(보호자)께서는 {{divName}} 서비스 금액({{price}}원/1인)이 적절하다고 생각하십니까?<br/><br/>' +
        '<b>{{divName}} 제공서비스 ({{price}}원/1인)</b><br/>' +
        '<span class="wid_100 d_inblock2 c_gray3 mt5">① 구강검진</span>문진 및 기본 구강검사<br/>' +
        '{{q_8_label_1}}' +
        '<span class="wid_100 d_inblock2 c_gray3 mt5">② 구강보건교육</span><span style="letter-spacing: -2.4px">구강위생관리 (칫솔질, 치실질)</span><br/>' +
        '<span class="wid_100 d_inblock2"></span>바른 식습관<br/>' +
        '<span class="wid_100 d_inblock2"></span>불소 이용법<br/>' +
        '{{q_8_label_2}}',
      value: '',
      options: optionsList.BV,
      type: 'radio',
    },
    q_9: {
      name: 'q_9',
      id: 'q_9',
      label: '귀하(보호자)께서는 아이(자녀)가 제공받은 치과주치의 서비스에 대해 전체적으로 만족하십니까?',
      value: '',
      options: optionsList.X,
      type: 'radio',
    },
    q_9_1: {
      name: 'q_9_1[]',
      id: 'q_9_1',
      label: '향후 {{divName}} 사업의 발전을 위해 개선되어야 할 부분은 무엇입니까?<br/>(복수응답, 최대 3개까지 선택 가능)',
      value: [],
      options: optionsList.BW,
      type: 'checkbox',
    },
    q_9_1_input: {
      name: 'q_9_1_input',
      id: 'q_9_1_input',
      label: '기타',
      value: '',
      placeholder: '기타 사항이 있을 경우 작성해 주세요. (최대 100자)',
      type: 'textarea',
    },
  };
};
const gyeonggiSurvey = () => {
  return {
    q_1: {
      name: 'q_1',
      id: 'q_1',
      label: '경기도({0})에서는 치과주치의 <b>사업 운영에 필요한 정보를 충분/적절하게 지원</b>해주었습니까?',
      value: '',
      options: optionsList.X,
      type: 'radio',
    },
    q_2: {
      name: 'q_2',
      id: 'q_2',
      label: '치과주치의 사업을 운영함에 있어 경기도교육청 및 초등학교와의 협의가 적절하게 이루어진다고 생각하십니까?',
      value: '',
      options: optionsList.X,
      type: 'radio',
    },
    q_3: {
      name: 'q_3',
      id: 'q_3',
      label: '치과주치의 사업을 운영함에 있어 지역 치과의사회 및 지역 치과 의료기관과의 협의가 적절하게 이루어진다고 생각하십니까?',
      value: '',
      options: optionsList.X,
      type: 'radio',
    },
    q_4: {
      name: 'q_4',
      id: 'q_4',
      label: '치과주치의사업 전산프로그램(덴티아이)이 주치의사업에 도움이 되었습니까?',
      value: '',
      options: optionsList.X,
      type: 'radio',
    },
    q_5: {
      name: 'q_5',
      id: 'q_5',
      label: '치과주치의 사업이 <b>필요하다고 생각하십니까?</b>',
      value: '',
      options: optionsList.X,
      type: 'radio',
    },
    q_6: {
      name: 'q_6',
      id: 'q_6',
      label: '치과주치의 사업이 <b>학생의 구강 건강 관리 향상에 도움이 된다고 생각하십니까?</b>',
      value: '',
      options: optionsList.X,
      type: 'radio',
    },
    q_7: {
      name: 'q_7[]',
      id: 'q_7',
      label: '치과주치의 사업에서 이루어지고 있는 서비스 항목 중 <b>가장 필요한 항목</b>은 무엇이라고 생각하십니까? (복수응답 가능)',
      value: [],
      options: optionsList.BE,
      type: 'checkbox',
    },
    q_7_input: {
      name: 'q_7_input',
      id: 'q_7_input',
      label: '기타',
      value: '',
      placeholder: '기타 사항이 있을 경우 작성해 주세요. (최대 100자)',
      type: 'textarea',
    },
    q_8: {
      name: 'q_8',
      id: 'q_8',
      label: '치과주치의 사업에 대해 <b>전체적으로 만족하십니까?</b>',
      value: '',
      options: optionsList.X,
      type: 'radio',
    },
    q_9: {
      name: 'q_9',
      id: 'q_9',
      label: '향후 치과주치의 사업의 발전을 위해 <b>개선되어야 할 부분</b>은 무엇입니까?',
      value: '',
      options: optionsList.BF,
      type: 'radio',
    },
    q_9_input: {
      name: 'q_9_input',
      id: 'q_9_input',
      label: '기타',
      value: '',
      placeholder: '기타 사항이 있을 경우 작성해 주세요. (최대 100자)',
      type: 'textarea',
    },
    q_10: {
      name: 'q_10',
      id: 'q_10',
      label: '귀하께서는 치과주치의 서비스 사업을 <b>지속해서 참여하실 의향</b>이 있으십니까?',
      value: '',
      options: optionsList.X,
      type: 'radio',
    },
    q_11: {
      name: 'q_11',
      id: 'q_11',
      label: '치과주치의 사업 <b>지원 금액(48,000원/1인)이 충분/적절하다고</b> 생각하십니까?',
      value: '',
      options: optionsList.X,
      type: 'radio',
    },
    q_say: {
      name: 'q_say',
      id: 'q_say',
      label: '치과주치의 사업의 발전을 위해 개선되어야 하는 점이 있으면 의견작성 부탁드립니다.',
      value: '',
      type: 'textarea',
      placeholder: '하고 싶은 말을 작성해 주세요.',
    },
  };
};
const notification = () => {
  return {
    n_1: {
      name: 'n_1',
      id: 'n_1',
      label: '충전된 치아',
      value: '',
      options: optionsList.A,
    },
    n_1_u: {
      name: 'n_1_u',
      id: 'n_1_u',
      label: '유치',
      value: 0,
      parent: 'n_1',
    },
    n_1_y: {
      name: 'n_1_y',
      id: 'n_1_y',
      label: '영구치',
      value: 0,
      parent: 'n_1',
    },
    n_1_up: {
      name: 'n_1_up',
      id: 'n_1_up',
      label: '상',
      value: 0,
      parent: 'n_1',
    },
    n_1_down: {
      name: 'n_1_down',
      id: 'n_1_down',
      label: '하',
      value: 0,
      parent: 'n_1',
    },
    n_2_tooth: {
      name: 'n_2_tooth',
      id: 'n_2_tooth',
      label: '우식치아',
      value: {
        leftTop: [],
        rightTop: [],
        leftBottom: [],
        rightBottom: [],
      },
    },
    n_2: {
      name: 'n_2',
      id: 'n_2',
      label: '우식치아',
      value: 0,
    },
    n_2_up: {
      name: 'n_2_up',
      id: 'n_2_up',
      label: '상',
      value: 0,
      parent: 'n_2',
    },
    n_2_down: {
      name: 'n_2_down',
      id: 'n_2_down',
      label: '하',
      value: 0,
      parent: 'n_2',
    },
    n_2_u: {
      name: 'n_2_u',
      id: 'n_2_u',
      label: '유치',
      value: 0,
      parent: 'n_2',
    },
    n_2_y: {
      name: 'n_2_y',
      id: 'n_2_y',
      label: '영구치',
      value: 0,
      parent: 'n_2',
    },
    n_2_u_up: {
      name: 'n_2_u_up',
      id: 'n_2_u_up',
      label: '상',
      value: 0,
      parent: 'n_2',
    },
    n_2_u_down: {
      name: 'n_2_u_down',
      id: 'n_2_u_down',
      label: '하',
      value: 0,
      parent: 'n_2',
    },
    n_2_y_up: {
      name: 'n_2_y_up',
      id: 'n_2_y_up',
      label: '상',
      value: 0,
      parent: 'n_2',
    },
    n_2_y_down: {
      name: 'n_2_y_down',
      id: 'n_2_y_down',
      label: '하',
      value: 0,
      parent: 'n_2',
    },
    n_3_tooth: {
      name: 'n_3_tooth',
      id: 'n_3_tooth',
      label: '우식발생 위험치아',
      value: {
        leftTop: [],
        rightTop: [],
        leftBottom: [],
        rightBottom: [],
      },
    },
    n_3: {
      name: 'n_3',
      id: 'n_3',
      label: '우식발생 위험치아',
      value: 0,
    },
    n_3_up: {
      name: 'n_3_up',
      id: 'n_3_up',
      label: '상',
      value: 0,
      parent: 'n_3',
    },
    n_3_down: {
      name: 'n_3_down',
      id: 'n_3_down',
      label: '하',
      value: 0,
      parent: 'n_3',
    },
    n_3_u: {
      name: 'n_3_u',
      id: 'n_3_u',
      label: '유치',
      value: 0,
      parent: 'n_3',
    },
    n_3_y: {
      name: 'n_3_y',
      id: 'n_3_y',
      label: '영구치',
      value: 0,
      parent: 'n_3',
    },
    n_3_u_up: {
      name: 'n_3_u_up',
      id: 'n_3_u_up',
      label: '상',
      value: 0,
      parent: 'n_3',
    },
    n_3_u_down: {
      name: 'n_3_u_down',
      id: 'n_3_u_down',
      label: '하',
      value: 0,
      parent: 'n_3',
    },
    n_3_y_up: {
      name: 'n_3_y_up',
      id: 'n_3_y_up',
      label: '상',
      value: 0,
      parent: 'n_3',
    },
    n_3_y_down: {
      name: 'n_3_y_down',
      id: 'n_3_y_down',
      label: '하',
      value: 0,
      parent: 'n_3',
    },
    n_4_tooth: {
      name: 'n_4_tooth',
      id: 'n_4_tooth',
      label: '결손치아',
      value: {
        leftTop: [],
        rightTop: [],
        leftBottom: [],
        rightBottom: [],
      },
    },
    n_4: {
      name: 'n_4',
      id: 'n_4',
      label: '결손치아',
      value: 0,
    },
    n_4_up: {
      name: 'n_4_up',
      id: 'n_4_up',
      label: '상',
      value: 0,
      parent: 'n_4',
    },
    n_4_down: {
      name: 'n_4_down',
      id: 'n_4_down',
      label: '하',
      value: 0,
      parent: 'n_4',
    },
    n_4_reason: {
      name: 'n_4_reason',
      id: 'n_4_reason',
      label: '결손치아 (영구치) 발생 사유',
      value: '',
      options: optionsList.CC,
      type: 'radio',
      parent: 'n_4',
    },
    n_5: {
      name: 'n_5',
      id: 'n_5',
      label: '구내염 및 연조직 질환',
      value: '',
      options: optionsList.A,
      type: 'radio',
    },
    n_5_disease: {
      name: 'n_5_disease',
      id: 'n_5_disease',
      label: '구내염 및 연조직 질환 - 질환명',
      value: '',
      placeholder: "'있음'의 경우 질환명을 입력해 주세요. (최대 100자)",
      type: 'textarea',
      parent: 'n_5',
    },
    n_6: {
      name: 'n_6',
      id: 'n_6',
      label: '부정교합',
      value: '',
      options: optionsList.B,
      type: 'radio',
    },
    n_6_check: {
      name: 'n_6_check[]',
      id: 'n_6_check',
      label: '부정교합 - 항목',
      value: [],
      options: optionsList.C,
      type: 'checkbox',
      parent: 'n_6',
    },
    n_7: {
      name: 'n_7',
      id: 'n_7',
      label: '치주질환',
      value: '',
      options: optionsList.A,
      type: 'radio',
    },
    n_7_check: {
      name: 'n_7_check[]',
      id: 'n_7_check',
      label: '치주질환 - 항목',
      value: [],
      options: optionsList.D,
      type: 'checkbox',
      parent: 'n_7',
    },
    n_8: {
      name: 'n_8',
      id: 'n_8',
      label: '악관절 이상',
      value: '',
      options: optionsList.A,
      type: 'radio',
    },
    n_9: {
      name: 'n_9',
      id: 'n_9',
      label: '구강위생상태',
      value: '',
      options: optionsList.G,
      type: 'radio',
    },
    n_10: {
      name: 'n_10[]',
      id: 'n_10',
      label: '그 밖의 치아상태',
      value: [],
      options: optionsList.E,
      type: 'checkbox',
    },
    n_10_etc: {
      name: 'n_10_etc',
      id: 'n_10_etc',
      label: '그 밖의 치아상태 - 기타',
      value: '',
      options: optionsList.E,
      type: 'textarea',
      placeholder: '기타 (최대 100자)',
      active: true,
      parent: 'n_10',
    },
    n_11: {
      name: 'n_11',
      id: 'n_11',
      label: '구강환경관리능력검사',
      value: '',
      options: optionsList.H,
    },
    n_11_not: {
      name: 'n_11_not',
      id: 'n_11_not',
      label: '구강환경관리능력검사 - 미실시 사유',
      value: [],
      options: optionsList.I,
      type: 'checkbox',
      parent: 'n_11',
    },
    n_11_reason: {
      name: 'n_11_reason',
      id: 'n_11_reason',
      label: '구강환경관리능력검사 - 미실시 사유',
      value: '',
      placeholder: '미실시 사유를 입력해 주세요. (최대 100자)',
      parent: 'n_11',
    },
    n_11_score: {
      name: 'n_11_score',
      id: 'n_11_score',
      label: 'PHP 점수',
      value: 0,
    },
    n_11_php1: {
      name: 'n_11_php1',
      id: 'n_11_php1',
      label: '16(협)',
      value: [],
    },
    n_11_php2: {
      name: 'n_11_php2',
      id: 'n_11_php2',
      label: '11(순)',
      value: [],
    },
    n_11_php3: {
      name: 'n_11_php3',
      id: 'n_11_php3',
      label: '26(협)',
      value: [],
    },
    n_11_php4: {
      name: 'n_11_php4',
      id: 'n_11_php4',
      label: '46(설)',
      value: [],
    },
    n_11_php5: {
      name: 'n_11_php5',
      id: 'n_11_php5',
      label: '31(순)',
      value: [],
    },
    n_11_php6: {
      name: 'n_11_php6',
      id: 'n_11_php6',
      label: '36(설)',
      value: [],
    },
    n_11_simple: {
      name: 'n_11_simple',
      id: 'n_11_simple',
      label: '간이 구강위생지수',
      options: optionsList.BS,
      value: '',
      parent: 'n_11',
    },
    n_12: {
      name: 'n_12[]',
      id: 'n_12',
      label: '구강보건교육',
      value: [],
      options: optionsList.AP,
      type: 'checkbox',
    },
    n_13: {
      name: 'n_13[]',
      id: 'n_13',
      label: '예방진료',
      value: [],
      options: optionsList.J,
      type: 'checkbox',
    },
    n_13_not1: {
      name: 'n_13_not1',
      id: 'n_13_not1',
      label: '미진료사유',
      value: '',
      placeholder: '미진료사유를 입력해주세요. (최대 100자)',
      parent: 'n_13',
    },
    n_13_not2: {
      name: 'n_13_not2',
      id: 'n_13_not2',
      label: '미진료사유',
      value: '',
      placeholder: '미진료사유를 입력해주세요. (최대 100자)',
      parent: 'n_13',
    },
    n_13_not3: {
      name: 'n_13_not3',
      id: 'n_13_not3',
      label: '미진료사유',
      value: '',
      placeholder: '미진료사유를 입력해주세요. (최대 100자)',
      parent: 'n_13',
    },
    n_13_not4: {
      name: 'n_13_not4',
      id: 'n_13_not4',
      label: '미진료사유',
      value: '',
      placeholder: '미진료사유를 입력해주세요.',
      parent: 'n_13',
    },
    n_13_not5: {
      name: 'n_13_not5',
      id: 'n_13_not5',
      label: '미진료사유',
      value: '',
      placeholder: '미진료사유를 입력해주세요.',
      parent: 'n_13',
    },
    n_13_check: {
      name: 'n_13_check[]',
      id: 'n_13_check',
      label: '필요시제공',
      value: [],
      options: optionsList.K,
      options2: [],
      type: 'checkbox',
      parent: 'n_13',
    },
    n_13_2_radio: {
      name: 'n_13_2_radio',
      id: 'n_13_2_radio',
      label: '치석제거 - 항목',
      value: '',
      options: optionsList.AB,
      type: 'radio',
      parent: 'n_13_check',
    },
    n_13_4_check: {
      name: 'n_13_4_check[]',
      id: 'n_13_4_check',
      label: '방사선 촬영 - 항목',
      value: [],
      options: optionsList.Z,
      type: 'checkbox',
      parent: 'n_13_check',
    },
    n_13_tooth: {
      name: 'n_13_tooth[]',
      id: 'n_13_tooth',
      label: '치식 팝업',
      value: [],
    },
    n_15: {
      name: 'n_15',
      id: 'n_15',
      label: '치아상태',
      value: '',
      options: optionsList.L,
      type: 'radio',
    },
    n_16: {
      name: 'n_16',
      id: 'n_16',
      label: '구강위생상태',
      value: '',
      options: optionsList.G,
      type: 'radio',
    },
    n_17: {
      name: 'n_17[]',
      id: 'n_17',
      label: '종합소견',
      value: [],
      options: optionsList.AR.filter(data => data.id !== 9),
      type: 'checkbox',
    },
    n_17_etc: {
      name: 'n_17_etc',
      id: 'n_17_etc',
      label: '기타',
      value: '',
      placeholder: '기타 사항이 있을 경우 작성해 주세요. (최대 100자)',
      type: 'textarea',
      parent: 'n_17',
    },
    n_18: {
      name: 'n_18[]',
      id: 'n_18',
      label: '가정에서의 조치사항',
      value: [],
      options: optionsList.AS,
      type: 'checkbox',
    },
    n_18_etc: {
      name: 'n_18_etc',
      id: 'n_18_etc',
      label: '기타',
      value: '',
      placeholder: '기타 사항이 있을 경우 작성해 주세요. (최대 100자)',
      type: 'textarea',
      parent: 'n_18',
    },
    n_19: {
      name: 'n_19',
      id: 'n_19',
      label: '양치습관',
      value: '',
      options: optionsList.BQ,
      type: 'radio',
    },
    n_20: {
      name: 'n_20[]',
      id: 'n_20',
      label: '재내원 계획',
      value: [],
      options: optionsList.BK,
      type: 'checkbox',
    },
    n_21: {
      name: 'n_21',
      id: 'n_21',
      label: '기타 소견',
      value: '',
      placeholder: '기타 사항이 있을 경우 작성해 주세요. (최대 100자)',
    },
    n_22: {
      name: 'n_22',
      id: 'n_22',
      label: '기타 진료 및 보호자 안내사항',
      value: [],
      options: optionsList.CK,
      type: 'checkbox',
    },
    n_22_etc: {
      name: 'n_22_etc',
      id: 'n_22_etc',
      label: '기타',
      value: '',
      placeholder: '기타 사항이 있을 경우 작성해 주세요. (최대 100자)',
      type: 'textarea',
      parent: 'n_22',
    },
    n_end: {
      name: 'n_end[]',
      id: 'n_end',
      label: '제공 항목',
      value: [],
      options: optionsList.AX,
      type: 'checkbox',
    },
    n_healthy_tooth: {
      name: 'n_healthy_tooth',
      id: 'n_healthy_tooth',
      label: '건치 아동 추천',
      value: '',
      options: optionsList.BP,
      type: 'radio',
    },
    n_doctor: {
      name: 'n_doctor',
      id: 'n_doctor',
      label: '치과의사 고유번호',
      value: '',
    },
    n_doctor_name: {
      name: 'n_doctor_name',
      id: 'n_doctor_name',
      label: '치과의사명',
      value: '',
    },
    n_license: {
      name: 'n_license',
      id: 'n_license',
      label: '면허번호',
      value: '',
    },
    n_date: {
      name: 'n_date',
      id: 'n_date',
      label: '검진일',
      value: '',
    },
    n_organ: {
      name: 'n_organ',
      id: 'n_organ',
      label: '검진기관명',
      value: '',
    },
    n_deep_treat: {
      name: 'n_deep_treat',
      id: 'n_deep_treat',
      label: '심화치료 여부',
      value: '',
      options: optionsList.AC,
      type: 'radio',
    },
    examPrice: {
      name: 'examPrice',
      id: 'examPrice',
      label: '검진비',
      value: '',
    },
  };
};
const notification2020 = () => {
  return {
    n_1: {
      name: 'n_1',
      id: 'n_1',
      label: '충전된 치아',
      value: '',
      options: optionsList.BG,
    },
    n_1_up1: {
      name: 'n_1_up1',
      id: 'n_1_up1',
      label: '유치',
      value: 0,
    },
    n_1_up2: {
      name: 'n_1_up2',
      id: 'n_1_up2',
      label: '영구치',
      value: 0,
    },
    n_2_tooth: {
      name: 'n_2_tooth',
      id: 'n_2_tooth',
      label: '우식치아',
      value: {
        leftTop: [],
        rightTop: [],
        leftBottom: [],
        rightBottom: [],
      },
    },
    n_2: {
      name: 'n_2',
      id: 'n_2',
      label: '우식치아',
      value: 0,
    },
    n_2_up: {
      name: 'n_2_up',
      id: 'n_2_up',
      label: '상',
      value: 0,
    },
    n_2_down: {
      name: 'n_2_down',
      id: 'n_2_down',
      label: '하',
      value: 0,
    },
    n_3_tooth: {
      name: 'n_3_tooth',
      id: 'n_3_tooth',
      label: '우식발생 위험치아',
      value: {
        leftTop: [],
        rightTop: [],
        leftBottom: [],
        rightBottom: [],
      },
    },
    n_3: {
      name: 'n_3',
      id: 'n_3',
      label: '우식발생 위험치아',
      value: 0,
    },
    n_3_up: {
      name: 'n_3_up',
      id: 'n_3_up',
      label: '상',
      value: 0,
    },
    n_3_down: {
      name: 'n_3_down',
      id: 'n_3_down',
      label: '하',
      value: 0,
    },
    n_4_tooth: {
      name: 'n_4_tooth',
      id: 'n_4_tooth',
      label: '결손치아',
      value: {
        leftTop: [],
        rightTop: [],
        leftBottom: [],
        rightBottom: [],
      },
    },
    n_4: {
      name: 'n_4',
      id: 'n_4',
      label: '결손치아',
      value: 0,
    },
    n_4_up: {
      name: 'n_4_up',
      id: 'n_4_up',
      label: '상',
      value: 0,
    },
    n_4_down: {
      name: 'n_4_down',
      id: 'n_4_down',
      label: '하',
      value: 0,
    },
    n_5: {
      name: 'n_5',
      id: 'n_5',
      label: '구내염 및 연조직 질환',
      value: '',
      options: optionsList.BG,
      type: 'radio',
    },
    n_5_1_etc: {
      name: 'n_5_1_etc',
      id: 'n_5_1_etc',
      label: '구내염 및 연조직 질환 있음 시',
      value: '',
      placeholder: "'있음'의 경우 질환명을 입력해 주세요.",
      type: 'textarea',
    },
    n_6: {
      name: 'n_6',
      id: 'n_6',
      label: '부정교합',
      value: '',
      options: optionsList.BH,
      type: 'radio',
    },
    n_6_check: {
      name: 'n_6_check[]',
      id: 'n_6_check',
      label: '부정교합 - 있음',
      value: [],
      options: optionsList.C,
      type: 'checkbox',
    },
    n_7: {
      name: 'n_7',
      id: 'n_7',
      label: '치주질환',
      value: '',
      options: optionsList.BG,
      type: 'radio',
    },
    n_7_check: {
      name: 'n_7_check[]',
      id: 'n_7_check',
      label: '치주질환 - 있음',
      value: [],
      options: optionsList.D,
      type: 'checkbox',
    },
    n_8: {
      name: 'n_8',
      id: 'n_8',
      label: '그 밖의 치아상태',
      value: '',
      options: optionsList.E,
      type: 'radio',
    },
    n_8_etc: {
      name: 'n_8_etc',
      id: 'n_8_etc',
      label: '그 밖의 치아상태 - 기타',
      value: '',
      options: optionsList.E,
      type: 'textarea',
      placeholder: '기타',
      active: true,
    },
    n_9: {
      name: 'n_9',
      id: 'n_9',
      label: '악관절',
      value: '',
      options: optionsList.BG,
      type: 'radio',
    },
    n_10: {
      name: 'n_10[]',
      id: 'n_10',
      label: '구강보건교육',
      value: [],
      options: optionsList.F,
      type: 'checkbox',
    },
    // 2020 - n_11, n_27, n_12
    n_111227_check: {
      name: 'n_111227_check[]',
      id: 'n_111227_check',
      label: '예방진료',
      value: [],
      options: optionsList.BI,
      type: 'checkbox',
    },
    // 2020 - n_11_non
    n_11_non: {
      name: 'n_11_non',
      id: 'n_11_non',
      label: '미진료사유',
      value: '',
      placeholder: '미진료사유를 입력해주세요.',
    },
    // 2020 - n_12_non
    n_12_non: {
      name: 'n_12_non',
      id: 'n_12_non',
      label: '미진료사유',
      value: '',
      placeholder: '미진료사유를 입력해주세요.',
    },
    // 2020 - n_27_non
    n_27_non: {
      name: 'n_27_non',
      id: 'n_27_non',
      label: '미진료사유',
      value: '',
      placeholder: '미진료사유를 입력해주세요.',
    },
    n_13_not4: {
      name: 'n_13_not4',
      id: 'n_13_not4',
      label: '미진료사유',
      value: '',
      placeholder: '미진료사유를 입력해주세요.',
    },
    // 2020 - n_13, n_14, n_15, n_16
    n_13_check: {
      name: 'n_13_check[]',
      id: 'n_13_check',
      label: '예방진료-필요시제공',
      value: [],
      options: optionsList.BJ,
      type: 'checkbox',
    },
    n_17: {
      name: 'n_17',
      id: 'n_17',
      label: '치아상태',
      value: '',
      options: optionsList.L,
      type: 'radio',
    },
    n_18: {
      name: 'n_18',
      id: 'n_18',
      label: '구강위생상태',
      value: '',
      options: optionsList.G,
      type: 'radio',
    },
    n_19: {
      name: 'n_19',
      id: 'n_19',
      label: '재내원 계획',
      value: '',
      options: optionsList.BK,
      type: 'radio',
    },
    n_php: {
      name: 'n_php',
      id: 'n_php',
      label: '구강위생검사',
      value: '',
      options: optionsList.BL,
    },
    n_php_check: {
      name: 'n_php_check[]',
      id: 'n_php_check',
      label: '미실시사유',
      value: [],
      options: optionsList.I,
      type: 'checkbox',
    },
    n_php_score: {
      name: 'n_php_score',
      id: 'n_php_score',
      label: 'PHP 점수',
      value: 0,
    },
    tooth01: {
      name: 'tooth01',
      id: 'tooth01',
      label: '16(협)',
      value: [],
    },
    tooth02: {
      name: 'tooth02',
      id: 'tooth02',
      label: '11(순)',
      value: [],
    },
    tooth03: {
      name: 'tooth03',
      id: 'tooth03',
      label: '26(협)',
      value: [],
    },
    tooth04: {
      name: 'tooth04',
      id: 'tooth04',
      label: '46(설)',
      value: [],
    },
    tooth05: {
      name: 'tooth05',
      id: 'tooth05',
      label: '31(순)',
      value: [],
    },
    tooth06: {
      name: 'tooth06',
      id: 'tooth06',
      label: '36(설)',
      value: [],
    },
    n_regdate: {
      name: 'n_regdate',
      id: 'n_regdate',
      label: '통보서 등록일',
      value: '',
    },
    n_regtime: {
      name: 'n_regtime',
      id: 'n_regtime',
      label: '통보서 등록시간',
      value: '',
    },
    n_addtreat: {
      name: 'n_addtreat',
      id: 'n_addtreat',
      label: '추가진료 여부',
      label_busan: '심화치료 여부',
      value: '',
      options: optionsList.BM,
      type: 'radio',
    },
    n_modify_reason: {
      name: 'n_modify_reason',
      id: 'n_modify_reason',
      label: '통보서 수정사유',
      value: '',
    },
    n_total_opinion: {
      name: 'n_total_opinion',
      id: 'n_total_opinion',
      label: '종합 소견',
      value: '',
    },
    hpt_name: {
      name: 'hpt_name',
      id: 'hpt_name',
      label: '검진기관명',
      value: '',
    },
    std_date: {
      name: 'std_date',
      id: 'std_date',
      label: '검진일',
      value: '',
    },
    doctor_name: {
      name: 'doctor_name',
      id: 'doctor_name',
      label: '치과의사명',
      value: '',
    },
    hpt_license: {
      name: 'hpt_license',
      id: 'hpt_license',
      label: '면허번호',
      value: '',
    },
    n_treatment: {
      name: 'n_treatment[]',
      id: 'n_treatment',
      label: '치식 팝업',
      value: [],
    },
  };
};
const treatmentRequest = () => {
  return {
    tt_contents: {
      name: 'tt_contents',
      id: 'tt_contents',
      label: '구강 진료 의뢰',
      value: '',
      placeholder: '구강 진료 의뢰 내용을 작성해 주세요.',
      type: 'textarea',
    },
    tt_doctor: {
      name: 'tt_doctor',
      id: 'tt_doctor',
      label: '치과의사 고유번호',
      value: '',
    },
    tt_doctor_name: {
      name: 'tt_doctor_name',
      id: 'tt_doctor_name',
      label: '치과의사명',
      value: '',
    },
    tt_license: {
      name: 'tt_license',
      id: 'tt_license',
      label: '면허번호',
      value: '',
    },
    tt_date: {
      name: 'tt_date',
      id: 'tt_date',
      label: '의뢰일',
      value: '',
    },
    tt_organ: {
      name: 'tt_organ',
      id: 'tt_organ',
      label: '검진기관명',
      value: '',
    },
  };
};
const treatmentPlan = () => {
  return {
    t_contents: {
      name: 't_contents',
      id: 't_contents',
      label: '구강 진료 계획',
      value: '',
      placeholder: '구강 진료 계획을 작성해 주세요.',
      type: 'textarea',
    },
    t_doctor: {
      name: 't_doctor',
      id: 't_doctor',
      label: '치과의사 고유번호',
      value: '',
    },
    t_doctor_name: {
      name: 't_doctor_name',
      id: 't_doctor_name',
      label: '치과의사명',
      value: '',
    },
    t_license: {
      name: 't_license',
      id: 't_license',
      label: '면허번호',
      value: '',
    },
    t_date: {
      name: 't_date',
      id: 't_date',
      label: '의뢰일',
      value: '',
    },
    t_organ: {
      name: 't_organ',
      id: 't_organ',
      label: '검진기관명',
      value: '',
    },
  };
};
const notificationAddRegist = () => {
  return {
    n_content: {
      name: 'n_content',
      id: 'n_content',
      label: '진료 내용',
      value: '',
    },
    n_doctor: {
      name: 'n_doctor',
      id: 'n_doctor',
      label: '치과의사 고유번호',
      value: '',
    },
    n_doctor_name: {
      name: 'n_doctor_name',
      id: 'n_doctor_name',
      label: '치과의사명',
      value: '',
    },
    n_license: {
      name: 'n_license',
      id: 'n_license',
      label: '면허번호',
      value: '',
    },
    n_date: {
      name: 'n_date',
      id: 'n_date',
      label: '검진일',
      value: '',
    },
    n_organ: {
      name: 'n_organ',
      id: 'n_organ',
      label: '검진기관명',
      value: '',
    },
    examPrice: {
      name: 'examPrice',
      id: 'examPrice',
      label: '검진비',
      value: '',
    },
  };
};

const statement = () => {
  return {
    s_1: {
      name: 's_1',
      id: 's_1',
      label: '방사선 촬영',
      value: 0,
    },
    s_1_radio: {
      name: 's_1_radio',
      id: 's_1_radio',
      parent: 's_1',
      label: '방사선 촬영 항목',
      value: '',
      options: optionsList.Z,
      type: 'radio',
      appendTable: true,
    },
    s_1_check: {
      name: 's_1_check[]',
      id: 's_1_check',
      parent: 's_1',
      label: '방사선 촬영 항목',
      value: [],
      options: optionsList.Z,
      type: 'checkbox',
      appendTable: true,
    },
    s_2: {
      name: 's_2',
      id: 's_2',
      label: '충전치료',
      value: 0,
    },
    s_2_check: {
      name: 's_2_check[]',
      id: 's_2_check',
      parent: 's_2',
      label: '충전치료 항목',
      value: [],
      options: optionsList.AA,
      type: 'checkbox',
      appendTable: true,
    },
    s_3: {
      name: 's_3',
      id: 's_3',
      label: '치수/치근단 치료',
      value: 0,
      popup: 'enable',
      appendTable: true,
    },
    s_4: {
      name: 's_4',
      id: 's_4',
      label: '유치발치',
      value: 0,
      popup: 'enable',
      appendTable: true,
    },
    s_5: {
      name: 's_5',
      id: 's_5',
      label: '발치',
      value: 0,
      popup: 'enable',
      appendTable: true,
    },
    s_6: {
      name: 's_6',
      id: 's_6',
      label: '간격유지장치',
      value: 0,
      popup: 'enable',
      appendTable: true,
    },
    s_7: {
      name: 's_7',
      id: 's_7',
      label: '치아홈메우기',
      value: 0,
      popup: 'enable',
      appendTable: true,
    },
    s_8: {
      name: 's_8',
      id: 's_8',
      label: '치석제거',
      value: 0,
    },
    s_8_radio: {
      name: 's_8_radio',
      id: 's_8_radio',
      parent: 's_8',
      label: '치석제거 항목',
      value: '',
      options: optionsList.AB,
      type: 'radio',
      appendTable: true,
    },
    s_9: {
      name: 's_9',
      id: 's_9',
      label: '전문가 구강위생관리',
      value: 0,
      appendTable: true,
    },
    s_10: {
      name: 's_10',
      id: 's_10',
      label: '불소도포',
      value: 0,
      appendTable: true,
    },
    s_11: {
      name: 's_11',
      id: 's_11',
      label: '신경치료',
      value: 0,
      popup: 'enable',
      appendTable: true,
    },
    s_12: {
      name: 's_12',
      id: 's_12',
      label: '구강검진',
      value: 0,
    },
    s_13: {
      name: 's_13',
      id: 's_13',
      label: '구강검진, X-ray',
      value: 0,
    },
    s_etc: {
      name: 's_etc',
      id: 's_etc',
      label: '기타',
      value: 0,
    },
    s_etc_input: {
      name: 's_etc_input',
      id: 's_etc_input',
      label: '기타 내용',
      value: '',
    },
    s_tooth: {
      name: 's_tooth[]',
      id: 's_tooth',
      label: '구강진료내역 목록',
      value: [],
    },
    treatPrice: {
      name: 'treatPrice',
      id: 'treatPrice',
      label: '청구 금액 총액',
      value: 0,
    },
    copayPrice: {
      name: 'copayPrice',
      id: 'copayPrice',
      label: '본인부담금',
      value: 0,
    },
    s_doctor: {
      name: 's_doctor',
      id: 's_doctor',
      label: '치과의사 고유번호',
      value: '',
    },
    s_doctor_name: {
      name: 's_doctor_name',
      id: 's_doctor_name',
      label: '치과의사명',
      value: '',
    },
    s_license: {
      name: 's_license',
      id: 's_license',
      label: '면허번호',
      value: '',
    },
    s_date: {
      name: 's_date',
      id: 's_date',
      label: '검진일',
      value: '',
    },
    s_organ: {
      name: 's_organ',
      id: 's_organ',
      label: '검진기관명',
      value: '',
    },
  };
};
const statement2020 = () => {
  return {
    s_1: {
      name: 's_1',
      id: 's_1',
      label: '치아홈메우기',
      value: 0,
    },
    s_2: {
      name: 's_2',
      id: 's_2',
      label: '치석제거',
      value: 0,
    },
    s_3: {
      name: 's_3',
      id: 's_3',
      label: '파노라마 촬영',
      value: 0,
    },
    s_5: {
      name: 's_5',
      id: 's_5',
      label: '치근단 촬영',
      value: 0,
    },
    s_4: {
      name: 's_4',
      id: 's_4',
      label: '충치치료',
      value: 0,
    },
    s_4_check: {
      name: 's_4_check[]',
      id: 's_4_check',
      parent: 's_4',
      label: '충전치료 항목',
      value: [],
      options: optionsList.AA2020,
      type: 'checkbox',
      appendTable: true,
    },
    s_4_4: {
      name: 's_4_4',
      id: 's_4_4',
      index: 4,
      label: '발치',
      value: 0,
    },
    s_4_5: {
      name: 's_4_5',
      id: 's_4_5',
      index: 5,
      label: '치수/치근단 치료',
      value: 0,
    },
    s_4_8: {
      name: 's_4_8',
      id: 's_4_8',
      index: 8,
      label: '기타',
      value: 0,
    },
    s_treatment: {
      name: 's_treatment[]',
      id: 's_treatment',
      label: '구강진료내역 목록',
      value: [],
    },
    s_price: {
      name: 's_price',
      id: 's_price',
      label: '청구금액 총액',
      value: 0,
    },
    s_price_reason: {
      name: 's_price_reason',
      id: 's_price_reason',
      label: '청구금액 수정 사유',
      value: '',
    },
    // s_doctor: {
    //     name: 's_doctor',
    //     id: 's_doctor',
    //     label: '치과의사 고유번호',
    //     value: ''
    // },
    doctor_name: {
      name: 'doctor_name',
      id: 'doctor_name',
      label: '치과의사명',
      value: '',
    },
    hpt_license: {
      name: 'hpt_license',
      id: 'hpt_license',
      label: '면허번호',
      value: '',
    },
    std_date: {
      name: 'std_date',
      id: 'std_date',
      label: '검진일',
      value: '',
    },
    hpt_name: {
      name: 'hpt_name',
      id: 'hpt_name',
      label: '검진기관명',
      value: '',
    },
  };
};

const intensiveRequest = () => {
  return {
    tr_disease_name: {
      name: 'tr_disease_name',
      id: 'tr_disease_name',
      label: '상병명',
      value: '',
    },
    tr_disease_code: {
      name: 'tr_disease_code',
      id: 'tr_disease_code',
      label: '상병코드',
      value: '',
    },
    tr_contents: {
      name: 'tr_contents',
      id: 'tr_contents',
      label: '환자상태 및 진료의뢰내용',
      value: '',
      placeholder: '환자상태 및 진료의뢰내용을 작성해 주세요.',
      type: 'textarea',
    },
    tr_hel_name: {
      name: 'tr_hel_name',
      id: 'tr_hel_name',
      label: '보건소명',
      value: '',
    },
    tr_orm_name: {
      name: 'tr_orm_name',
      id: 'tr_orm_name',
      label: '담당 공무원명',
      value: '',
    },
    tr_orm_tel: {
      name: 'tr_orm_tel',
      id: 'tr_orm_tel',
      label: '전화번호',
      value: '',
    },
    tr_fax: {
      name: 'tr_fax',
      id: 'tr_fax',
      label: 'FAX',
      value: '',
    },
    tr_date: {
      name: 'tr_date',
      id: 'tr_date',
      label: '진료의뢰일',
      value: '',
    },
  };
};
const intensiveNotification = () => {
  return {
    tn_contents: {
      name: 'tn_contents',
      id: 'tn_contents',
      label: '심화치료 내용',
      value: '',
      placeholder: '심화치료 내용을 작성해 주세요.',
      type: 'textarea',
    },
    examPrice: {
      name: 'examPrice',
      id: 'examPrice',
      label: '비용',
      value: '',
    },
    tn_doctor: {
      name: 'tn_doctor',
      id: 'tn_doctor',
      label: '치과의사명',
      value: '',
    },
    tn_license: {
      name: 'tn_license',
      id: 'tn_license',
      label: '면허번호',
      value: '',
    },
    tn_date: {
      name: 'tn_date',
      id: 'tn_date',
      label: '검진일',
      value: '',
    },
    tn_organ: {
      name: 'tn_organ',
      id: 'tn_organ',
      label: '검진기관명',
      value: '',
    },
  };
};
const php_tooth = () => {
  return [
    {
      label: '16(협)',
      id: 'tooth_01',
      tooth_img: [
        {
          class: ['tooth_a_1'],
          value: 1,
        },
        {
          class: ['tooth_a_2'],
          value: 2,
        },
        {
          class: ['tooth_a_3'],
          value: 3,
        },
        {
          class: ['tooth_a_4'],
          value: 4,
        },
        {
          class: ['tooth_a_5'],
          value: 5,
        },
      ],
    },
    {
      label: '11(순)',
      id: 'tooth_02',
      tooth_img: [
        {
          class: ['tooth_b_1'],
          value: 1,
        },
        {
          class: ['tooth_b_2'],
          value: 2,
        },
        {
          class: ['tooth_b_3'],
          value: 3,
        },
        {
          class: ['tooth_b_4'],
          value: 4,
        },
        {
          class: ['tooth_b_5'],
          value: 5,
        },
      ],
    },
    {
      label: '26(협)',
      id: 'tooth_03',
      tooth_img: [
        {
          class: ['tooth_c_1'],
          value: 1,
        },
        {
          class: ['tooth_c_2'],
          value: 2,
        },
        {
          class: ['tooth_c_3'],
          value: 3,
        },
        {
          class: ['tooth_c_4'],
          value: 4,
        },
        {
          class: ['tooth_c_5'],
          value: 5,
        },
      ],
    },
    {
      label: '46(설)',
      id: 'tooth_04',
      tooth_img: [
        {
          class: ['tooth_d_1'],
          value: 1,
        },
        {
          class: ['tooth_d_2'],
          value: 2,
        },
        {
          class: ['tooth_d_3'],
          value: 3,
        },
        {
          class: ['tooth_d_4'],
          value: 4,
        },
        {
          class: ['tooth_d_5'],
          value: 5,
        },
      ],
    },
    {
      label: '31(순)',
      id: 'tooth_05',
      tooth_img: [
        {
          class: ['tooth_e_1'],
          value: 1,
        },
        {
          class: ['tooth_e_2'],
          value: 2,
        },
        {
          class: ['tooth_e_3'],
          value: 3,
        },
        {
          class: ['tooth_e_4'],
          value: 4,
        },
        {
          class: ['tooth_e_5'],
          value: 5,
        },
      ],
    },
    {
      label: '36(설)',
      id: 'tooth_06',
      tooth_img: [
        {
          class: ['tooth_f_1'],
          value: 1,
        },
        {
          class: ['tooth_f_2'],
          value: 2,
        },
        {
          class: ['tooth_f_3'],
          value: 3,
        },
        {
          class: ['tooth_f_4'],
          value: 4,
        },
        {
          class: ['tooth_f_5'],
          value: 5,
        },
      ],
    },
  ];
};
const notificationSubData = () => {
  return {
    basicEduDate: '',
    treatStatus: '',
    hospitalTel: '',
  };
};
const hospitalSelfCheck = [
  {
    title: '일반사항',
    list: [
      {
        id: 'sc_1',
        label: '「경기도 초등학생 치과주치의사업 의료기관 표찰」을 방문자가 잘 보이는 곳에 게시한다.',
      },
      {
        id: 'sc_2',
        label: '사업 안내 및 참여방법에 대한 포스터를 게시하고 안내한다.',
      },
      {
        id: 'sc_3',
        label: '보건소에서 배부된 사업 안내서를 의료기관내 치과주치의사업 인력 모두 공유 및 숙지한다.',
      },
      {
        id: 'sc_4',
        label: '사업 시작전 덴티아이경기 시스템에 접속하여 사전교육을 이수한다.',
      },
    ],
  },
  {
    title: '치과주치의 대상 학생 방문시 (반드시 서비스 전 실시)',
    list: [
      {
        id: 'sc_5',
        label: '사업대상자가 방문하면 보호자에게「치과주치의사업 참여방법」에 대하여 자세히 안내한다.',
      },
      {
        id: 'sc_6',
        label: '반드시 치과주치의 서비스 전 전산시스템에 접속하여 학생등록을 완료한다.',
        subLabel: [
          '- 덴티아이경기앱에 가입이 안된 경우, 포스터 및 동영상 등 참고하여 가입 하도록 안내한다.',
          '- 대상학생(보호자)이 스마트폰 사용이 불가할 경우, 종이 문진표로 작성하도록 한다.',
          '- 대상 학생은 지역(시군), 학교명, 학년, 반, 번호 등 인적사항을 정확히 확인한다.',
        ],
      },
    ],
  },
  {
    title: '치과주치의 서비스 실시 (순서는 의료기관 상황에 맞게 실시)',
    list: [
      {
        id: 'sc_7',
        label: '학생이 작성한 문진표를 확인하고 구강검사를 실시한다.',
      },
      {
        id: 'sc_8',
        label: 'PHP 검사를 실시한다. 치면에 부착되어 있는 음식물 잔사 및 플라그를 학생(학부모)이 직접 확인하도록 보여주고 점수를 계산한다.',
      },
      {
        id: 'sc_9',
        label: '칫솔질/치실질(칫솔사용권장) 교육 후 전문가 구강위생관리를 실시한다. ( ※ 리플렛 활용 )',
      },
      {
        id: 'sc_10',
        label: '바른 식습관 및 불소이용법 교육을 실시한다. ( ※ 리플렛 활용 )',
      },
      {
        id: 'sc_11',
        label: '필요한 학생에게 치석제거, 치아홈메우기, 파노라마 촬영을 실시한다.',
      },
      {
        id: 'sc_12',
        label: '불소도포를 실시하고 주의사항을 설명한다. ( ※ 리플렛 활용 )',
      },
    ],
  },
  {
    title: '치과주치의 서비스 후 서비스',
    list: [
      {
        id: 'sc_13',
        label: '학생 및 보호자에게 서비스 내용 설명하고 구강검사결과통보서는 즉시 배부 또는 덴티아이경기앱(입력시 확인가능)을 통해 확인 안내한다.',
        subLabel: ['- 필요시 추가 진료 예약 및 다음 검진(6개월) 안내한다.'],
      },
      {
        id: 'sc_14',
        label: '전산시스템에 구강검사 결과통보서 입력한다. (검진비 자동청구)',
      },
    ],
  },
  {
    title: '기록보존',
    list: [
      {
        id: 'sc_15',
        label: '검진자료 다운로드 및 암호화 후 보관해야 함을 알고 있다.',
        subLabel: ['- 수시 다운 가능 및 일괄 다운 ( ※ 일괄 다운로드 기간 24.12.23~31 예정 )'],
      },
    ],
  },
  {
    title: '비용상환',
    list: [
      {
        id: 'sc_16',
        label: '치과주치의 검진비는 본인부담 무료로 대상학생(보호자)에게 청구하지 않음을 알고 있다.',
        subLabel: ['※ 치과주치의 서비스외 치료는 본인부담이며 필요할 경우 사전안내한다.'],
      },
      {
        id: 'sc_17',
        label: '전산시스템을 통해 검진비 청구를 관할 보건소로 청구함을 알고 있다.',
        subLabel: ['- 보완이 필요할 경우 관할 보건소에서 반려할 수 있음.'],
      },
    ],
  },
];

function formContentsKind(item) {
  if (item.charAt(0) === 'q') {
    return 'questionnaire';
  } else if (item.charAt(0) === 'n' || item === 'examPrice') {
    return 'notification';
  } else if (item.charAt(0) === 's' || item === 'treatPrice' || item === 'copayPrice') {
    return 'statement';
  } else if (item.split('_')[0] === 'tt') {
    return 'treatmentRequest';
  } else if (item.charAt(0) === 't') {
    return 'treatmentPlan';
  }
}

export default {
  namespaced: true,
  state: {
    pdfStatus: false,
    billRegist: false,
    php_tooth: php_tooth(),
    formContents: {
      notification: notification(),
      notification2020: notification2020(),
      notificationAddRegist: notificationAddRegist(),
      questionnaire: questionnaire(),
      treatmentRequest: treatmentRequest(),
      treatmentPlan: treatmentPlan(),
      statement: statement(),
      statement2020: statement2020(),
      intensiveRequest: intensiveRequest(),
      intensiveNotification: intensiveNotification(),
      gyeonggiSurvey: gyeonggiSurvey(),
      studentSurvey: studentSurvey(),
    },
    notificationSubData: notificationSubData(),
    hospitalSelfCheck,
  },
  mutations: {
    pdfStatusSet(state, payload) {
      state.pdfStatus = payload;
    },
    billRegistSet(state, payload) {
      state.billRegist = payload;
    },
    notificationSubDataClear(state) {
      Object.assign(state.notificationSubData, notificationSubData());
    },
    notificationSubDataSet(state, payload) {
      for (const item in payload) {
        state.notificationSubData[item] = payload[item];
      }
    },
    ADDREGIST_SET(state, payload) {
      // 2차 이상 통보서 작성
      for (const item in payload) {
        state.formContents.notificationAddRegist[item].value = payload[item];
      }

      // for (const i in state.formContents.notificationAddRegist) {
      //     console.log(i, state.formContents.notificationAddRegist[i].value)
      // }
    },
    DATA_SET(state, payload) {
      // let consoleKind = ''; // console용 kind
      const formKind = payload.formKind;
      delete payload.formKind;
      for (const item in payload) {
        const kind = formKind || formContentsKind(item);
        // consoleKind = kind; // console용 kind
        if (state.formContents[kind][item]) {
          const typeOf = typeof state.formContents[kind][item].value;
          const itemTypeOf = typeof payload[item];
          if (typeOf === 'object' && itemTypeOf !== 'object') {
            const arrayValue = state.formContents[kind][item].value;
            let idx = arrayValue.indexOf(payload[item]);
            if (idx === -1) {
              const intValue = parseInt(payload[item]);
              if (!isNaN(intValue) && payload[item].length === intValue.toString().length) {
                idx = arrayValue.indexOf(intValue);
              }
            }
            if (idx !== -1) {
              state.formContents[kind][item].value.splice(idx, 1);
            } else {
              state.formContents[kind][item].value.push(payload[item]);
            }
          } else {
            if (payload[item] !== null) {
              state.formContents[kind][item].value = payload[item];
            }
          }
        }
      }
      // let t = {}
      // for (const item in state.formContents[consoleKind]) {
      //     t[item] = state.formContents[consoleKind][item].value
      // }
      // console.log(t)
    },
    STUDENTSURVEY_DATA_SET(state, payload) {
      store.commit('doc/DATA_SET', Object.assign(payload, { formKind: 'studentSurvey' }));
    },
    // 2020 내역서 data set
    STATEMENT2020_DATA_SET(state, payload) {
      for (const item in payload) {
        if (item.slice(-3) === 'non') {
          if (payload[item]) state.formContents['statement2020'][item.slice(0, -4)].value = 1;
        } else if (state.formContents['statement2020'][item]) {
          // s_4 배열에 충전치료와 다른게 같이 포함되서 분리
          if (item === 's_4') {
            if (payload[item]) {
              payload[item].forEach(val => {
                if (state.formContents['statement2020'][`${item}_${val}`]) {
                  state.formContents['statement2020'][`${item}_${val}`].value = 1;
                } else {
                  state.formContents['statement2020'][item].value = 1;
                  state.formContents['statement2020'][`${item}_check`].value.push(val);
                }
              });
            }
          } else if (Array.isArray(payload[item]) && Array.isArray(state.formContents['statement2020'][item].value) === false) {
            // s_1, s_2, s_3, s_5는 배열로 들어와 값이 있으면 state의 같은 속성에는 1만 대입
            if (payload[item]) state.formContents['statement2020'][item].value = 1;
          } else {
            if (payload[item]) state.formContents['statement2020'][item].value = payload[item];
          }
        }
      }
      // 청구 금액 총액이 s_treatment배열에 담겨있으므로 분리
      if (payload['s_treatment'][0]['s_price']) state.formContents['statement2020']['s_price'].value = payload['s_treatment'][0]['s_price'];
    },
    // 2020 통보서 data set
    NOTIFICATION2020_DATA_SET(state, payload) {
      for (const item in payload) {
        if (payload[item]) {
          switch (item) {
            case 'n_2_tooth':
            case 'n_3_tooth':
            case 'n_4_tooth':
              state.formContents['notification2020'][item].value.leftTop = payload[item]['up_right'];
              state.formContents['notification2020'][item].value.rightTop = payload[item]['up_left'];
              state.formContents['notification2020'][item].value.leftBottom = payload[item]['low_right'];
              state.formContents['notification2020'][item].value.rightBottom = payload[item]['low_left'];
              break;
            case 'n_11':
            case 'n_12':
            case 'n_27':
              if (payload[item].includes(1)) state.formContents['notification2020']['n_111227_check'].value.push(Number(item.slice(-2)));
              break;
            case 'n_13':
            case 'n_14':
            case 'n_15':
            case 'n_16':
              if (payload[item].includes(1)) state.formContents['notification2020']['n_13_check'].value.push(Number(item.slice(-2)));
              break;
            case 'php_tooth':
              for (const tooth in payload[item]) {
                state.formContents['notification2020'][tooth].value = payload[item][tooth];
              }
              break;
            default:
              if (state.formContents['notification2020'][item]) {
                if (payload[item]) state.formContents['notification2020'][item].value = payload[item];
              }
          }
        }
      }
    },
    TR_DATA_SET(state, payload) {
      for (const item in payload) {
        if (payload[item] !== null) {
          state.formContents.intensiveRequest[item].value = payload[item];
        }
      }
      // let t = {}
      // for (const item in state.formContents.intensiveRequest) {
      //     t[item] = state.formContents.intensiveRequest[item].value
      // }
      // console.log(t)
    },
    TN_DATA_SET(state, payload) {
      for (const item in payload) {
        if (payload[item] !== null) {
          state.formContents.intensiveNotification[item].value = payload[item];
        }
      }
      // let t = {}
      // for (const item in state.formContents.intensiveNotification) {
      //     t[item] = state.formContents.intensiveNotification[item].value
      // }
      // console.log(t)
    },
    OBJECT_SET(state, payload) {
      for (const item in payload) {
        const kind = formContentsKind(item);
        state.formContents[kind][item].value.push(payload[item]);
      }
    },
    OBJECT_SPLICE(state, payload) {
      for (const item in payload) {
        const kind = formContentsKind(item);
        state.formContents[kind][item].value.splice(payload[item], 1);
      }
    },
    OBJECT_MODIFY(state, payload) {
      // payload data : id, index, form
      const kind = formContentsKind(payload.id);
      for (const item in payload.form) {
        state.formContents[kind][payload.id].value[payload.index][item] = payload.form[item];
      }
    },
    LIST_SET(state, payload) {
      // payload data : id, contentsIndex, form
      let kind = '';
      if (payload.id.charAt(0) === 's') {
        kind = 'statement';
      } else {
        return false;
      }
      state.formContents[kind][payload.id].value[payload.contentsIndex].list.push(payload.form);
    },
    LIST_SPLICE(state, payload) {
      // payload data : id, contentsIndex, listIndex
      const kind = formContentsKind(payload.id);
      state.formContents[kind][payload.id].value[payload.contentsIndex].list.splice(payload.listIndex, 1);
    },
    LIST_MODIFY(state, payload) {
      // payload data : id, contentsIndex, listIndex, form
      const kind = formContentsKind(payload.id);
      for (const item in payload.form) {
        state.formContents[kind][payload.id].value[payload.contentsIndex].list[payload.listIndex][item] = payload.form[item];
      }
    },
    questionnaire_clear(state) {
      Object.assign(state.formContents.questionnaire, questionnaire());
    },
    studentSurvey_clear(state) {
      Object.assign(state.formContents.studentSurvey, studentSurvey());
    },
    gyeonggiSurvey_clear(state) {
      Object.assign(state.formContents.gyeonggiSurvey, gyeonggiSurvey());
    },
    php_clear(state) {
      state.php_tooth = php_tooth();
    },
    notification_clear(state) {
      Object.assign(state.formContents.notification, notification());
      Object.assign(state.formContents.notificationAddRegist, notificationAddRegist());
      state.php_tooth = php_tooth();
    },
    notification2020_clear(state) {
      Object.assign(state.formContents.notification2020, notification2020());
      Object.assign(state.formContents.notificationAddRegist, notificationAddRegist());
      state.php_tooth = php_tooth();
    },
    treatmentRequest_clear(state) {
      Object.assign(state.formContents.treatmentRequest, treatmentRequest());
    },
    treatmentPlan_clear(state) {
      Object.assign(state.formContents.treatmentPlan, treatmentPlan());
    },
    statement_clear(state) {
      Object.assign(state.formContents.statement, statement());
    },
    statement2020_clear(state) {
      Object.assign(state.formContents.statement2020, statement2020());
    },
    intensiveRequest_clear(state) {
      Object.assign(state.formContents.intensiveRequest, intensiveRequest());
    },
    intensiveNotification_clear(state) {
      Object.assign(state.formContents.intensiveNotification, intensiveNotification());
    },
    PHP_SET(state, payload) {
      state.php_tooth = payload;
    },
    UPDATE_TOOTH(state, payload) {
      const { id, position, number, e, useId, topId, bottomId, reasonId } = payload;
      const classList = e.target.getAttribute('class');
      const redCheck = classList.indexOf('on2');
      const blueCheck = classList.indexOf('on1');

      let blueNum = 0;
      let redNum = 0;
      switch (position) {
        case 'rightTop':
          blueNum = 1;
          redNum = 5;
          break;
        case 'leftTop':
          blueNum = 2;
          redNum = 6;
          break;
        case 'leftBottom':
          blueNum = 3;
          redNum = 7;
          break;
        case 'rightBottom':
          blueNum = 4;
          redNum = 8;
          break;
      }
      const blueVal = blueNum + String(number);
      const redVal = redNum + String.fromCharCode(64 + number);

      let valueSet = state.formContents.notification[id].value[position];

      if (blueCheck !== -1) {
        valueSet.push(blueVal);
      } else {
        valueSet = valueSet.filter(value => value !== blueVal);
        if (redCheck !== -1) {
          valueSet.push(redVal);
        } else {
          valueSet = valueSet.filter(value => value !== redVal);
        }
      }

      state.formContents.notification[id].value[position] = valueSet;

      const topCount = state.formContents.notification[id].value.leftTop.length + state.formContents.notification[id].value.rightTop.length;
      const bottomCount = state.formContents.notification[id].value.leftBottom.length + state.formContents.notification[id].value.rightBottom.length;

      state.formContents.notification[topId].value = topCount;
      state.formContents.notification[bottomId].value = bottomCount;

      if (topCount > 0 || bottomCount > 0) {
        state.formContents.notification[useId].value = 1;
      } else {
        state.formContents.notification[useId].value = 0;
        if (reasonId) {
          state.formContents.notification[reasonId].value = '';
        }
      }
    },
    studentSurvey_set(state, payload) {
      const texts = {
        divName: payload.businessDivision !== 'E' ? '치과주치의' : '학생 구강검진',
        price: payload.businessDivision !== 'E' ? '48,000' : '7,990',
        q_8_label_1: payload.businessDivision !== 'E' ? '<span class="wid_100 d_inblock2"></span><span style="letter-spacing: -1.3px">구강위생검사 (PHP Index)</span><br/>' : '',
        q_8_label_2:
          payload.businessDivision !== 'E'
            ? '<span class="wid_100 d_inblock2 c_gray3 mt5">③ 예방진료</span><span style="letter-spacing: -1.7px">(필수) 전문가 구강위생관리</span><br/>' +
              '<span class="wid_100 d_inblock2"></span><span style="letter-spacing: -1.7px">(필수) 불소도포</span><br/>' +
              '<span class="wid_100 d_inblock2"></span><span style="letter-spacing: -1.7px">(필요시 제공) 치아 홈메우기</span><br/>' +
              '<span class="wid_100 d_inblock2"></span><span style="letter-spacing: -1.7px">(필요시 제공) 치석제거</span><br/>' +
              '<span class="wid_100 d_inblock2"></span><span style="letter-spacing: -1.7px">(필요시 제공) 파노라마 촬영</span>'
            : '',
      };

      for (const key in state.formContents.studentSurvey) {
        for (const textKey in texts) {
          state.formContents.studentSurvey[key].label = state.formContents.studentSurvey[key].label.replaceAll(`{{${textKey}}}`, texts[textKey]);
        }
      }
    },
    questionnaire_set(state, payload) {
      let options = {};
      if (['A', 'G'].includes(payload.districtCodeFirst) && payload.businessDivision === 'E') {
        // 서울시, 수원시 학생구강검진
        state.formContents.questionnaire.q_3.label = '치아와 잇몸 주변이 쑤시고 욱신거리고 아픔';
        state.formContents.questionnaire.q_4.label = '잇몸이 아프거나 피가 남';
        state.formContents.questionnaire.q_7.label = '과자 등 단음식이나 콜라 등 청량음료를 즐겨 먹습니까?';
        state.formContents.questionnaire.q_12.label = '어제 하루 동안 이를 닦은 때를 모두 표시해주세요.';
        options.q_12 = optionsList.AD;
        options.q_7 = optionsList.AE;
        options.q_8 = optionsList.AF;
      } else if (payload.districtCodeFirst === 'A') {
        // 서울시
        options.q_11 = optionsList.M;
      } else if (payload.districtCodeFirst === 'B') {
        // 인천시
        state.formContents.questionnaire.q_3.label = '치아가 쑤시고 욱신거리고 아픔';
        state.formContents.questionnaire.q_4.label = '잇몸이 아프거나 피가 남';
        state.formContents.questionnaire.q_11.label = '담배로 입 냄새, 잇몸손상, 구강암 등이 발생 될 수 있다고 들었거나 배운 적 있습니까?';
        options.q_10 = optionsList.R;
        options.q_12 = optionsList.AH;
        options.q_7 = optionsList.AE;
        options.q_13 = optionsList.AI;
      } else if (payload.districtCodeFirst === 'C') {
        // 경기도
        options.q_10 = optionsList.CD;
      } else if (payload.districtCodeFirst === 'E') {
        // 순천시
        state.formContents.questionnaire.q_14.label = '학교에서 점심 식후에 칫솔질을 하나요?';
        options.q_12 = optionsList.AH;
        options.q_13 = optionsList.AI;
        options.q_14 = optionsList.AY;
      } else if (payload.districtCodeFirst === 'H') {
        // 여수시
        state.formContents.questionnaire.q_3.label = '치아와 잇몸 주변이 쑤시고 욱신거리고 아픔';
        state.formContents.questionnaire.q_4.label = '잇몸이 아프거나 피가 남';
        state.formContents.questionnaire.q_14.label = '학교에서 점심식사 후 칫솔질을 하는 횟수를 표시해주세요.';
        options.q_12 = optionsList.BA;
        options.q_13 = optionsList.BB;
        options.q_14 = optionsList.BC;
      } else if (payload.districtCodeFirst === 'I') {
        // 전북
        options.q_10 = optionsList.CD;
        options.q_12 = optionsList.CG;
        options.q_15_5 = optionsList.CM;
        options.q_15_6 = optionsList.CM;
        options.q_15_7 = optionsList.CM;
      } else if (payload.districtCodeFirst === 'J') {
        // 울산
        options.q_12 = optionsList.AD;
        options.q_7 = optionsList.AE;
        options.q_8 = optionsList.AF;
      }
      for (const item in options) {
        state.formContents.questionnaire[item].options = options[item];
      }
    },
    notification_set(state, payload) {
      let options = {};
      if (['A', 'D'].includes(payload.districtCodeFirst)) {
        // 서울, 부산
        options.n_12 = optionsList.F;
      }
      if (payload.districtCodeFirst === 'A') {
        // 서울시
        options.n_11 = optionsList.BY;
        if (payload.businessDivision !== 'E') {
          // 서울시 학생치과주치의 or 아동치과주치의
          options.n_16 = optionsList.BZ;
        }
        if (payload.businessDivision.includes('F')) {
          // 서울시 학생치과주치의
          options.n_13_check = optionsList.AZ;
        }
        if (payload.businessDivision === 'C') {
          // 서울시 아동치과주치의
          options.n_13 = optionsList.CE;
          options.n_13_check = optionsList.CF;
        }
      }
      if ((['A', 'F', 'G'].includes(payload.districtCodeFirst) && payload.businessDivision === 'E') || ['C', 'E', 'J'].includes(payload.districtCodeFirst)) {
        // 서울시 or 밀양시 or 수원시 학생구강검진 / 경기 / 순천 / 울산
        options.n_2 = optionsList.A;
        options.n_3 = optionsList.A;
        options.n_4 = optionsList.A;
      }
      if (['A', 'G'].includes(payload.districtCodeFirst)) {
        // 서울시, 수원시
        options.n_6 = optionsList.AJ;
      } else if (payload.districtCodeFirst === 'C' && payload.businessDivision.includes('F')) {
        // 경기도 학생치과주치의
        options.n_6 = optionsList.AJ;
        options.n_13_check = optionsList.AN;
        options.n_15 = optionsList.AT;
        options.n_16 = optionsList.AT;
      } else if (payload.districtCodeFirst === 'C' && payload.businessDivision === 'E') {
        // 경기도 학생구강검진
        options.n_6 = optionsList.AJ;
      } else if (payload.districtCodeFirst === 'B') {
        // 인천시
        options.n_11 = optionsList.BR;
        options.n_13 = optionsList.AQ;
        options.n_13_check = optionsList.AM;
      } else if (payload.districtCodeFirst === 'D') {
        // 부산시
        options.n_13 = optionsList.CA;
        options.n_13_check = optionsList.BX;
      } else if (payload.districtCodeFirst === 'E' && payload.businessDivision.includes('F')) {
        // 순천시 학생치과주치의
        options.n_13 = optionsList.BD;
      } else if (payload.districtCodeFirst === 'F' && payload.businessDivision.includes('F')) {
        // 밀양시 학생치과주치의
        options.n_6 = optionsList.A;
        options.n_13 = optionsList.AV;
        options.n_13_check = optionsList.AU;
        options.n_15 = optionsList.AT;
      } else if (payload.districtCodeFirst === 'F' && payload.businessDivision === 'E') {
        // 밀양시 학생구강검진
        options.n_6 = optionsList.AL;
        options.n_17 = optionsList.AR.filter(data => data.id !== 8);
        options.n_18 = optionsList.AS.filter(data => data.id !== 7);
      } else if (payload.districtCodeFirst === 'H' && payload.businessDivision.includes('F')) {
        // 여수시 학생치과주치의
        options.n_2 = optionsList.A;
        options.n_3 = optionsList.A;
        options.n_13 = optionsList.BD;
        state.formContents.notification.n_17_etc.placeholder = '종합소견 (최대 100자)';
      } else if (payload.districtCodeFirst === 'I') {
        // 전북
        options.n_11 = optionsList.CI;
        options.n_12 = optionsList.CJ;
        options.n_13_check = optionsList.CH;
        state.formContents.notification.n_13_check.options2 = optionsList.CL;
      } else if (payload.districtCodeFirst === 'J') {
        // 울산
        options.n_6 = optionsList.AJ;
        options.n_11 = optionsList.BY;
        options.n_13 = optionsList.CN;
      }
      for (const item in options) {
        state.formContents.notification[item].options = options[item];
      }
    },
    notification2020_set(state, payload) {
      let options = {};
      if (payload.districtCodeFirst === 'D') {
        // 부산시
        options.n_111227_check = optionsList.BN;
      }
      for (const item in options) {
        state.formContents.notification2020[item].options = options[item];
      }
    },
    statement_set(state, payload) {
      let options = {};
      if (payload.districtCodeFirst === 'D') {
        // 부산시 아동치과주치의
        options.s_2_check = optionsList.AW;
        state.formContents.statement.s_etc.popup = 'enable';
        state.formContents.statement.s_etc.appendTable = true;
      }
      for (const item in options) {
        state.formContents.statement[item].options = options[item];
      }
    },
    statement2020_set(state, payload) {
      let options = {};
      if (payload.districtCodeFirst === 'D') {
        // 부산시
        options.s_4_check = optionsList.BO;
      }
      for (const item in options) {
        state.formContents.statement2020[item].options = options[item];
      }
    },
  },
  actions: {
    // eslint-disable-next-line no-empty-pattern
    toothClass({}, payload) {
      const { useId, number, e } = payload;
      const classList = e.target.getAttribute('class');
      const redCheck = classList.indexOf('on2');
      const blueCheck = classList.indexOf('on1');

      if (redCheck !== -1) {
        e.target.classList.remove('on2');
      } else if (blueCheck !== -1) {
        e.target.classList.remove('on1');
        if (number <= 5 && useId !== 'n_4') {
          e.target.classList.add('on2');
        }
      } else {
        e.target.classList.add('on1');
      }
    },
    updateTooth({ commit, dispatch }, payload) {
      dispatch('toothClass', payload);
      commit('UPDATE_TOOTH', payload);
    },
    listSplice({ commit, state }, payload) {
      const kind = formContentsKind(payload.id);
      if (state.formContents[kind][payload.id].value[payload.contentsIndex].list.length === 1 && payload.listIndex === 0) {
        commit('OBJECT_SPLICE', { [payload.id]: payload.contentsIndex });
      } else {
        commit('LIST_SPLICE', payload);
      }
    },
  },
};
