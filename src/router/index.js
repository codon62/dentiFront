import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/index';
import Login from '@/apis/Login';

Vue.use(Router);

const organEnter = () => (from, to, next) => {
  if (!store.state.isOk) {
    return next();
  }
  switch (store.state.user.userOrganTargetType) {
    case 'HP':
      next('/hospital');
      break;
    case 'HC':
    case 'CT':
      next('/healthcare');
      break;
    case 'CE':
      next('/center');
      break;
    case 'SC':
      next('/school');
      break;
    case 'UH':
      next('/univhpt');
      break;
    default:
      next('/login');
      break;
  }
};

const organLogined = () => (form, to, next) => {
  if (process.env.NODE_ENV === 'production' && location.protocol === 'http:') {
    location.href = 'https://' + location.host;
    return false;
  }
  if (store.state.user.userOrganTargetType) {
    next('/');
  }
  next();
};

const organPass = userOrganTargetType => (form, to, next) => {
  if (!store.state.isOk) {
    return next();
  }
  if (!userOrganTargetType.includes(store.state.user.userOrganTargetType)) {
    next('/');
  }
  next();
};

const healthcareManagementStudent = () => (form, to, next) => {
  if (store.state.user.cityType === 'E' || store.state.user.healthCareType === 'E' || !store.getters['business/divJoin']('F')) {
    next('/healthcare/management/student/examine');
  } else if (!store.getters['business/divJoin']('C')) {
    next('/healthcare/management/student/famdoc');
  }
  next();
};

const healthcareBillReject = () => (form, to, next) => {
  if (!store.getters['business/divJoin']('C')) {
    next('/healthcare/bill/reject/famdoc');
  }
  next();
};

// home 화면 지역별로 지정
const home = () => (from, to, next) => {
  const path = `/${store.state.status.userOrganTargetTypeToPath[store.state.user.userOrganTargetType]}/home`;
  if (store.state.user.cityType === 'E' || store.state.user.healthCareType === 'E' || !store.getters['business/divJoin']('F')) {
    next(`${path}/examine`);
  } else if (store.state.user.business) {
    if (store.getters['business/divJoin']('C') && store.state.user.business.businessDivisionC === 'Y') {
      next();
    } else if (store.state.user.business.businessDivisionF === 'Y') {
      next(`${path}/famdoc`);
    } else if (store.getters['user/districtCodeFirst'] === 'A' && store.state.user.business.businessDivisionE === 'Y') {
      next(`${path}/examine`);
    }
  } else if (!store.getters['business/divJoin']('C')) {
    next(`${path}/famdoc`);
  }
  next();
};

// 경기도만 해당
const onlyGyeonggi = () => (from, to, next) => {
  if (store.getters['user/districtCodeFirst'] !== 'C') {
    next('/');
  }
  next();
};

// 자동보고서
const reportDistrictDivision = () => (form, to, next) => {
  switch (store.getters['user/districtCodeFirst']) {
    case 'A':
      if (store.state.user.cityType === 'E' || store.state.user.healthCareType === 'E') {
        next('/healthcare/stats/report/seoul/examine');
      } else {
        next('/healthcare/stats/report/seoul');
      }
      break;
    case 'B':
      next('/healthcare/stats/report/incheon');
      break;
    case 'C':
      next('/healthcare/stats/report/gyeonggi');
      break;
    case 'D':
      next('/healthcare/stats/report/busan');
      break;
    case 'E':
      next('/healthcare/stats/report/suncheon');
      break;
    case 'F':
      next('/healthcare/stats/report/miryang');
      break;
    case 'G':
      next('/healthcare/stats/report/suwon');
      break;
    case 'H':
      next('/healthcare/stats/report/yeosu');
      break;
    default:
      break;
  }
};

const recordDistrictDivision = () => (from, to, next) => {
  switch (store.getters['user/districtCodeFirst']) {
    case 'A':
      if (store.state.user.cityType === 'E' || store.state.user.healthCareType === 'E') {
        next('/healthcare/stats/record/seoul/examine');
      } else {
        next('/healthcare/stats/record/seoul');
      }
      break;
    case 'C':
      next('/healthcare/stats/record/gyeonggi');
      break;
    case 'D':
      next('/healthcare/stats/record/busan');
      break;
    default:
      next();
      break;
  }
};

const routes = [
  {
    path: '/',
    beforeEnter: organEnter(),
  },
  {
    path: '/login',
    name: 'Login',
    beforeEnter: organLogined(),
    component: () => import('@/views/login/Organ.vue'),
    meta: { unauthorized: true },
  },
  {
    path: '/login/admin',
    name: 'LoginAdmin',
    beforeEnter: organLogined(),
    component: () => import('@/views/login/Admin.vue'),
    meta: { unauthorized: true },
  },
  {
    path: '/login/backup',
    name: 'LoginBackup',
    beforeEnter: organLogined(),
    component: () => import('@/views/login/Organ.vue'),
    meta: { unauthorized: true },
  },
  {
    path: '/hospital',
    beforeEnter: organPass(['HP']),
    component: () => import('@/views/layout/Hospital.vue'),
    children: [
      {
        path: '',
        redirect: 'home',
      },
      {
        path: 'home',
        component: () => import('@/views/hospital/HomeList.vue'),
        children: [
          {
            path: '',
            redirect: 'child',
          },
          {
            path: 'child',
            beforeEnter: home(),
            component: () => import('@/views/hospital/Home.vue'),
          },
          { path: 'famdoc', component: () => import('@/views/hospital/Home.vue') },
          { path: 'examine', component: () => import('@/views/hospital/Home.vue') },
        ],
      },
      { path: 'infoModify', component: () => import('@/views/hospital/InfoModify.vue') },
      { path: 'child', component: () => import('@/views/hospital/Child.vue') },
      { path: 'famdoc', component: () => import('@/views/hospital/Famdoc.vue') },
      { path: 'examine', component: () => import('@/views/hospital/Examine.vue') },
      { path: 'contract', component: () => import('@/views/hospital/Contract.vue') },
      { path: 'bill', component: () => import('@/views/hospital/Bill.vue') },
      { path: 'bill/detail', component: () => import('@/views/hospital/BillDetail.vue') },
      {
        path: 'board/notice',
        component: () => import('@/views/board/notice/Notice'),
        children: [
          {
            path: '',
            redirect: 'list',
          },
          { path: 'list', component: () => import('@/views/board/notice/List.vue') },
          { path: 'contents', component: () => import('@/views/board/notice/Contents.vue') },
        ],
      },
      {
        path: 'board/inquiry',
        beforeEnter: onlyGyeonggi(),
        component: () => import('@/views/board/inquiry/Inquiry'),
        children: [
          {
            path: '',
            redirect: 'list',
          },
          { path: 'list', component: () => import('@/views/board/inquiry/List.vue') },
          { path: 'enroll', component: () => import('@/views/board/inquiry/Enroll.vue') },
          { path: 'contents', component: () => import('@/views/board/inquiry/Contents.vue') },
        ],
      },
      {
        path: 'board/faq',
        component: () => import('@/views/board/faq/Faq'),
        children: [
          {
            path: '',
            redirect: 'list',
          },
          { path: 'list', component: () => import('@/views/board/faq/List.vue') },
          { path: 'enroll', component: () => import('@/views/board/faq/Enroll.vue') },
          { path: 'contents', component: () => import('@/views/board/faq/Contents.vue') },
        ],
      },
      { path: 'download', component: () => import('@/views/hospital/Download.vue') },
      { path: 'ntc', component: () => import('@/views/hospital/doc/Notification.vue') },
      { path: 'que', component: () => import('@/views/hospital/doc/Questionnaire.vue') },
      { path: 'treatmentRequest', component: () => import('@/views/hospital/doc/TreatmentRequest.vue') },
      { path: 'plan', component: () => import('@/views/hospital/doc/TreatmentPlan.vue') },
      { path: 'stm', component: () => import('@/views/hospital/doc/Statement.vue') },
      { path: 'survey', beforeEnter: onlyGyeonggi(), component: () => import('@/views/hospital/hospitalSurvey/HospitalSurvey.vue') },
      { path: 'selfCheck', beforeEnter: onlyGyeonggi(), component: () => import('@/views/hospital/hospitalSelfCheck/SelfCheckRegister.vue') },
      { path: 'video/business', beforeEnter: onlyGyeonggi(), component: () => import('@/components/common/video/GyeonggiBusiness.vue') },
      { path: 'video/manual', beforeEnter: onlyGyeonggi(), component: () => import('@/components/common/video/GyeonggiManual.vue') },
    ],
  },
  {
    path: '/healthcare',
    beforeEnter: organPass(['HC', 'CT']),
    component: () => import('@/views/layout/Healthcare.vue'),
    children: [
      {
        path: '',
        redirect: 'home',
      },
      {
        path: 'home',
        component: () => import('@/views/healthcare/HomeList.vue'),
        children: [
          {
            path: '',
            redirect: 'child',
          },
          {
            path: 'child',
            beforeEnter: home(),
            component: () => import('@/views/healthcare/Home.vue'),
          },
          { path: 'famdoc', component: () => import('@/views/healthcare/Home.vue') },
          { path: 'famdoc/first', component: () => import('@/views/healthcare/Home.vue') },
          { path: 'famdoc/yeonjegu', component: () => import('@/views/healthcare/Home.vue') },
          { path: 'examine', component: () => import('@/views/healthcare/Home.vue') },
        ],
      },
      {
        path: 'infoModify',
        beforeEnter: organPass(['HC']),
        component: () => import('@/views/healthcare/InfoModify.vue'),
      },
      { path: 'management/healthcare', component: () => import('@/views/healthcare/management/Healthcare.vue') },
      { path: 'management/center', component: () => import('@/views/healthcare/management/Center.vue') },
      { path: 'management/hospital', component: () => import('@/views/healthcare/management/Hospital.vue') },
      { path: 'management/hospitalView', component: () => import('@/views/healthcare/management/HospitalView.vue') },
      { path: 'management/school', component: () => import('@/views/healthcare/management/School.vue') },
      {
        path: 'management/student',
        component: () => import('@/views/healthcare/management/Student.vue'),
        children: [
          {
            path: '',
            beforeEnter: healthcareManagementStudent(),
            component: () => import('@/views/healthcare/management/student/Child.vue'),
          },
          { path: 'famdoc', component: () => import('@/views/healthcare/management/student/Famdoc.vue') },
          { path: 'famdoc/first', component: () => import('@/views/healthcare/management/student/FamdocFirst.vue') },
          { path: 'famdoc/yeonjegu', component: () => import('@/views/healthcare/management/student/FamdocYeonjegu.vue') },
          { path: 'examine', component: () => import('@/views/healthcare/management/student/Examine.vue') },
          { path: 'duplicate', component: () => import('@/views/healthcare/management/student/Duplicate.vue') },
          { path: 'special', component: () => import('@/views/healthcare/management/student/Special.vue') },
        ],
      },
      { path: 'management/user', component: () => import('@/views/healthcare/management/User.vue') },
      { path: 'business/famdoc', component: () => import('@/views/healthcare/business/Famdoc.vue') },
      { path: 'business/famdoc/first', component: () => import('@/views/healthcare/business/FamdocFirst.vue') },
      { path: 'business/famdoc/yeonjegu', component: () => import('@/views/healthcare/business/FamdocYeonjegu.vue') },
      { path: 'business/examine', component: () => import('@/views/healthcare/business/Examine.vue') },
      { path: 'business/child', component: () => import('@/views/healthcare/business/Child.vue') },
      { path: 'business/plan', component: () => import('@/views/healthcare/business/Plan.vue') },
      { path: 'business/deep', component: () => import('@/views/healthcare/business/Deep.vue') },
      { path: 'bill/claim', component: () => import('@/views/healthcare/bill/Claim.vue') },
      { path: 'bill/claim/detail', component: () => import('@/views/healthcare/bill/claim/Detail.vue') },
      {
        path: 'bill/reject',
        component: () => import('@/views/healthcare/bill/Reject.vue'),
        children: [
          {
            path: '',
            beforeEnter: healthcareBillReject(),
            component: () => import('@/views/healthcare/bill/reject/Child.vue'),
          },
          { path: 'famdoc', component: () => import('@/views/healthcare/bill/reject/Famdoc.vue') },
          { path: 'famdoc/first', component: () => import('@/views/healthcare/bill/reject/FamdocFirst.vue') },
          { path: 'famdoc/yeonjegu', component: () => import('@/views/healthcare/bill/reject/FamdocYeonjegu.vue') },
          { path: 'Examine', component: () => import('@/views/healthcare/bill/reject/Examine.vue') },
        ],
      },
      // 자동보고서
      {
        path: 'stats/report',
        component: () => import('@/views/healthcare/stats/Report.vue'),
        children: [
          {
            path: '',
            beforeEnter: reportDistrictDivision(),
          },
          {
            path: 'seoul',
            component: () => import('@/views/healthcare/stats/report/Seoul.vue'),
            children: [
              { path: '', component: () => import('@/views/healthcare/stats/report/SeoulChild.vue') },
              { path: 'fam', component: () => import('@/views/healthcare/stats/report/SeoulFamdoc.vue') },
              { path: 'famdoc1', component: () => import('@/views/healthcare/stats/report/SeoulFamdocFirst.vue') },
              { path: 'examine', component: () => import('@/views/healthcare/stats/report/SeoulExamine.vue') },
            ],
          },
          { path: 'incheon', component: () => import('@/views/healthcare/stats/report/Incheon.vue') },
          { path: 'gyeonggi', component: () => import('@/views/healthcare/stats/report/Gyeonggi.vue') },
          {
            path: 'busan',
            component: () => import('@/views/healthcare/stats/report/Busan.vue'),
            children: [
              { path: '', component: () => import('@/views/healthcare/stats/report/BusanChild.vue') },
              { path: 'fam', component: () => import('@/views/healthcare/stats/report/BusanFamdoc.vue') },
              { path: 'famdoc/yeonjegu', component: () => import('@/views/healthcare/stats/report/BusanFamdocYeonjegu.vue') },
            ],
          },
          { path: 'suncheon', component: () => import('@/views/healthcare/stats/report/Suncheon.vue') },
          { path: 'miryang', component: () => import('@/views/healthcare/stats/report/Miryang.vue') },
          { path: 'suwon', component: () => import('@/views/healthcare/stats/report/Suwon.vue') },
          { path: 'yeosu', component: () => import('@/views/healthcare/stats/report/Yeosu.vue') },
        ],
      },
      // 종합실적
      {
        path: 'stats/record',
        component: () => import('@/views/healthcare/stats/record/Record.vue'),
        children: [
          {
            path: '',
            beforeEnter: recordDistrictDivision(),
            component: () => import('@/views/healthcare/stats/record/RecordOther.vue'),
          },
          {
            path: 'seoul',
            component: () => import('@/views/healthcare/stats/record/RecordSeoulList.vue'),
            children: [
              {
                path: '',
                redirect: 'child',
              },
              { path: 'child', component: () => import('@/views/healthcare/stats/record/RecordSeoul.vue') },
              { path: 'famdoc', component: () => import('@/views/healthcare/stats/record/RecordSeoul.vue') },
              { path: 'famdoc/first', component: () => import('@/views/healthcare/stats/record/RecordSeoul.vue') },
              { path: 'examine', component: () => import('@/views/healthcare/stats/record/RecordSeoul.vue') },
            ],
          },
          { path: 'gyeonggi', component: () => import('@/views/healthcare/stats/record/RecordGyeonggi.vue') },
          {
            path: 'busan',
            component: () => import('@/views/healthcare/stats/record/RecordBusanList.vue'),
            children: [
              {
                path: '',
                redirect: 'child',
              },
              { path: 'child', component: () => import('@/views/healthcare/stats/record/RecordBusan.vue') },
              { path: 'famdoc', component: () => import('@/views/healthcare/stats/record/RecordBusan.vue') },
              { path: 'famdoc/yeonjegu', component: () => import('@/views/healthcare/stats/record/RecordBusan.vue') },
            ],
          },
        ],
      },
      // 학교용 교육 학습 현황
      {
        path: 'stats/edu-site',
        component: () => import('@/views/healthcare/stats/EduSite.vue'),
      },
      // 학교용 현황
      {
        path: 'stats/school-statistics',
        component: () => import('@/views/healthcare/stats/SchoolStatistics.vue'),
      },
      // 학교용 현황 상세
      {
        path: 'stats/school-statistics-detail',
        component: () => import('@/views/healthcare/stats/SchoolStatisticsDetail.vue'),
      },
      // 설문조사
      {
        path: 'stats/survey',
        component: () => import('@/views/healthcare/stats/Survey.vue'),
      },
      {
        path: 'board/notice',
        component: () => import('@/views/board/notice/Notice'),
        children: [
          {
            path: '',
            redirect: 'list',
          },
          { path: 'list', component: () => import('@/views/board/notice/List.vue') },
          { path: 'enroll', component: () => import('@/views/board/notice/Enroll.vue') },
          { path: 'contents', component: () => import('@/views/board/notice/Contents.vue') },
        ],
      },
      {
        path: 'board/inquiry',
        beforeEnter: onlyGyeonggi(),
        component: () => import('@/views/board/inquiry/Inquiry'),
        children: [
          {
            path: '',
            redirect: 'list',
          },
          { path: 'list', component: () => import('@/views/board/inquiry/List.vue') },
          { path: 'reply', component: () => import('@/views/board/inquiry/Reply.vue') },
          { path: 'contents', component: () => import('@/views/board/inquiry/Contents.vue') },
        ],
      },
      {
        path: 'board/faq',
        component: () => import('@/views/board/faq/Faq'),
        children: [
          {
            path: '',
            redirect: 'list',
          },
          { path: 'list', component: () => import('@/views/board/faq/List.vue') },
          { path: 'enroll', component: () => import('@/views/board/faq/Enroll.vue') },
          { path: 'contents', component: () => import('@/views/board/faq/Contents.vue') },
        ],
      },
      { path: 'download', component: () => import('@/views/healthcare/Download.vue') },
      { path: 'que', component: () => import('@/views/hospital/doc/Questionnaire.vue') },
      { path: 'que-survey', component: () => import('@/views/hospital/doc/Questionnaire.vue') },
      { path: 'student-survey', component: () => import('@/views/hospital/doc/StudentSurvey.vue') },
      { path: 'intensiveRequest', component: () => import('@/views/hospital/doc/IntensiveRequest.vue') },
      { path: 'survey', beforeEnter: onlyGyeonggi(), component: () => import('@/views/healthcare/healthCareSurvey/HealthCareSurvey.vue') },
      { path: 'video/business', beforeEnter: onlyGyeonggi(), component: () => import('@/components/common/video/GyeonggiBusiness.vue') },
      { path: 'video/manual', beforeEnter: onlyGyeonggi(), component: () => import('@/components/common/video/GyeonggiManual.vue') },
    ],
  },
  {
    path: '/center',
    beforeEnter: organPass(['CE']),
    component: () => import('@/views/layout/Center.vue'),
    children: [
      { path: '', component: () => import('@/views/center/Home.vue') },
      { path: 'infoModify', component: () => import('@/views/center/InfoModify.vue') },
      { path: 'child', component: () => import('@/views/center/Child.vue') },
      { path: 'que', component: () => import('@/views/hospital/doc/Questionnaire.vue') },
      {
        path: 'board/notice',
        component: () => import('@/views/board/notice/Notice'),
        children: [
          {
            path: '',
            redirect: 'list',
          },
          { path: 'list', component: () => import('@/views/board/notice/List.vue') },
          { path: 'contents', component: () => import('@/views/board/notice/Contents.vue') },
        ],
      },
      {
        path: 'board/faq',
        component: () => import('@/views/board/faq/Faq'),
        children: [
          {
            path: '',
            redirect: 'list',
          },
          { path: 'list', component: () => import('@/views/board/faq/List.vue') },
          { path: 'enroll', component: () => import('@/views/board/faq/Enroll.vue') },
          { path: 'contents', component: () => import('@/views/board/faq/Contents.vue') },
        ],
      },
    ],
  },
  {
    path: '/school',
    beforeEnter: organPass(['SC']),
    component: () => import('@/views/layout/School.vue'),
    children: [
      { path: '', component: () => import('@/views/school/Home.vue') },
      { path: 'infoModify', component: () => import('@/views/school/InfoModify.vue') },
      { path: 'famdoc', component: () => import('@/views/school/Famdoc.vue') },
      { path: 'examine', component: () => import('@/views/school/Examine.vue') },
      { path: 'contract', component: () => import('@/views/school/Contract.vue') },
      { path: 'bill', component: () => import('@/views/school/Bill.vue') },
      { path: 'bill/detail', component: () => import('@/views/school/BillDetail.vue') },
      {
        path: 'board/notice',
        component: () => import('@/views/board/notice/Notice'),
        children: [
          {
            path: '',
            redirect: 'list',
          },
          { path: 'list', component: () => import('@/views/board/notice/List.vue') },
          { path: 'enroll', component: () => import('@/views/board/notice/Enroll.vue') },
          { path: 'contents', component: () => import('@/views/board/notice/Contents.vue') },
        ],
      },
      {
        path: 'board/faq',
        component: () => import('@/views/board/faq/Faq'),
        children: [
          {
            path: '',
            redirect: 'list',
          },
          { path: 'list', component: () => import('@/views/board/faq/List.vue') },
          { path: 'enroll', component: () => import('@/views/board/faq/Enroll.vue') },
          { path: 'contents', component: () => import('@/views/board/faq/Contents.vue') },
        ],
      },
      { path: 'que', component: () => import('@/views/hospital/doc/Questionnaire.vue') },
      { path: 'que-survey', component: () => import('@/views/hospital/doc/Questionnaire.vue') },
      { path: 'student-survey', component: () => import('@/views/hospital/doc/StudentSurvey.vue') },
      { path: 'survey', beforeEnter: onlyGyeonggi(), component: () => import('@/views/school/schoolSurvey/SchoolSurvey.vue') },
      { path: 'video/business', beforeEnter: onlyGyeonggi(), component: () => import('@/components/common/video/GyeonggiBusiness.vue') },
    ],
  },
  {
    path: '/univhpt',
    beforeEnter: organPass(['UH']),
    component: () => import('@/views/layout/Univhpt.vue'),
    children: [
      { path: '', component: () => import('@/views/univhpt/Deep.vue') },
      { path: 'infoModify', component: () => import('@/views/univhpt/InfoModify.vue') },
      { path: 'intensiveNotification', component: () => import('@/views/hospital/doc/IntensiveNotification.vue') },
      { path: 'que', component: () => import('@/views/hospital/doc/Questionnaire.vue') },
    ],
  },
  { path: '/app/terms', component: () => import('@/views/app/Terms.vue'), meta: { unauthorized: true } },
  { path: '/app/policy', component: () => import('@/views/app/Policy.vue'), meta: { unauthorized: true } },
  { path: '/app/agree1', component: () => import('@/views/app/Agree1.vue'), meta: { unauthorized: true } },
  { path: '/app/agree2', component: () => import('@/views/app/Agree2.vue'), meta: { unauthorized: true } },
  {
    path: '*',
    component: () => import('@/views/PageNotFound.vue'),
  },
];

const router = new Router({
  mode: 'history',
  routes,
});

const isDev = process.env.NODE_ENV !== 'production';

router.beforeEach(async (to, from, next) => {
  // 로그인 이후 새로고침 시
  if (!store.state.user.accessToken && localStorage.getItem('accessToken')) {
    store.commit('isOk', false);
    const adminOrganType = store.state.user.adminOrganType ? store.state.user.adminOrganType : localStorage.getItem('adminOrganType');

    const request = adminOrganType === 'AD' ? await Login.adminInfo() : await Login.organInfo();
    const res = await request;
    // res.data : 서버 통신 성공
    if (res && res.data) {
      // res.data.rt === 200 : 통신 이후 정상 상태 확인 성공
      if (res.data.rt === 200) {
        // 유저 정보 업데이트
        if (adminOrganType === 'AD') {
          store.commit('user/setLoginUserInfo', { districtCode: store.getters['business/districtInfo'].code });
          const user = {
            accessToken: res.data.loginUserInfo.accessToken,
            refreshToken: res.data.loginUserInfo.refreshToken,
            userOrganId: res.data.loginUserInfo.userAdminId,
            userOrganTargetType: 'CT',
            districtName: store.getters['business/districtInfo'].name,
            userOrganTargetId: 0,
            userOrganTargetName: res.data.loginUserInfo.userAdminName,
            userOrganPasswordModify: res.data.loginUserInfo.userAdminPasswordModify,
            business: {
              businessDivisionC: store.getters['business/divJoin']('C') ? 'Y' : 'N',
              businessDivisionF: store.getters['business/divJoin']('F') ? 'Y' : 'N',
              businessDivisionE: store.getters['business/divJoin']('E') ? 'Y' : 'N',
            },
            adminOrganType: 'AD',
          };
          store.dispatch('user/updateInfo', user);
          if (!isDev) {
            Gitple('update', {
              // 깃플챗 로그인
              id: `${store.getters['business/districtInfo'].eng}${store.state.business.businessYear}${isDev ? 'dev' : ''}@AD@${res.data.loginUserInfo.userAdminId}`,
              name: res.data.loginUserInfo.userOrganTargetName,
              meta: {
                도시: store.getters['business/districtInfo'].name,
                지역구: store.getters['business/districtInfo'].name,
                기관유형: store.state.status.userOrganTargetTypeToName.CT,
                기관명: '관리자',
              },
            });
          }
        } else {
          // code convert
          res.data.loginUserInfo.userOrganTargetType = store.getters['definedCode/codeToValue'](res.data.loginUserInfo.userOrganTargetType);
          res.data.loginUserInfo.hospitalType = store.getters['definedCode/codeToValue'](res.data.loginUserInfo.hospitalType);
          res.data.loginUserInfo.cityType = store.getters['definedCode/codeToValue'](res.data.loginUserInfo.cityType);
          res.data.loginUserInfo.healthCareType = store.getters['definedCode/codeToValue'](res.data.loginUserInfo.healthCareType);
          res.data.loginUserInfo.hospitalVideoEdu = store.getters['definedCode/codeToValue'](res.data.loginUserInfo.hospitalVideoEdu);
          if (res.data.loginUserInfo.business) {
            res.data.loginUserInfo.business.businessDivisionC = store.getters['definedCode/codeToValue'](res.data.loginUserInfo.business.businessDivisionC);
            res.data.loginUserInfo.business.businessDivisionF = store.getters['definedCode/codeToValue'](res.data.loginUserInfo.business.businessDivisionF);
            res.data.loginUserInfo.business.businessDivisionE = store.getters['definedCode/codeToValue'](res.data.loginUserInfo.business.businessDivisionE);
          }
          // code convert end
          store.dispatch('user/updateInfo', Object.assign(res.data.loginUserInfo, { adminOrganType: 'ALL' }));
          if (!isDev) {
            Gitple('update', {
              // 깃플챗 로그인
              id: `${store.getters['business/districtInfo'].eng}${store.state.business.businessYear}${isDev ? 'dev' : ''}@${res.data.loginUserInfo.userOrganTargetType}@${
                res.data.loginUserInfo.userOrganTargetId
              }@${res.data.loginUserInfo.userOrganId}`,
              name: res.data.loginUserInfo.userOrganTargetName,
              meta: {
                도시: store.getters['business/districtInfo'].name,
                지역구: res.data.loginUserInfo.districtName,
                기관유형: store.state.status.userOrganTargetTypeToName[res.data.loginUserInfo.userOrganTargetType],
                기관명: res.data.loginUserInfo.userOrganTargetName,
              },
            });
          }
        }
        store.commit('isOk', true);
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        store.commit('isOk', true);
        return store.dispatch('user/logout');
      }
    } else {
      // 서버 통신 실패 시 정상 페이지 이동, 해당 페이지 내 API 통신에서 서버 오류 alert
      return next();
    }
  }

  // 인증이 필요한 페이지에서 토큰이 없는 경우 로그인 페이지로 이동
  if (!to.matched.some(record => record.meta.unauthorized) && !store.state.user.accessToken) {
    const adminOrganType = store.state.user.adminOrganType ? store.state.user.adminOrganType : localStorage.getItem('adminOrganType');

    return next(adminOrganType === 'AD' ? '/login/admin' : '/login');
  }

  next();
});

export default router;
