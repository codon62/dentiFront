<template>
  <div class="popup">
    <transition name="fade" appear>
      <div class="dim"></div>
    </transition>
    <transition name="fade" appear>
      <div class="popup_box">
        <div class="set_table">
          <div class="set__table">
            <component :is="contents" :data-object="params"></component>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('popup', ['contents', 'params']),
  },
  components: {
    privacyPolicy: () => import('@/components/common/PrivacyPolicy.vue'),
    hospitalStudentEnrollment: () => import('@/components/hospital/studentEnrollment/index.vue'),
    hospitalStudentInfoModify: () => import('@/components/hospital/StudentInfoModify.vue'),
    resetHospitalPassword: () => import('@/components/hospital/ResetHospitalPassword.vue'),
    setTreatTime: () => import('@/components/hospital/SetTreatTime.vue'),
    checkAgreement: () => import('@/components/hospital/CheckAgreement.vue'),
    registAgreement: () => import('@/components/hospital/RegistAgreement.vue'),
    keepAgreement: () => import('@/components/hospital/KeepAgreement.vue'),
    viewAgreement: () => import('@/components/hospital/ViewAgreement.vue'),
    addTreatment: () => import('@/components/doc/addTreatment.vue'),
    addTreatment2: () => import('@/components/doc/addTreatment2.vue'),
    viewQuestionnaire: () => import('@/components/docview/Questionnaire.vue'),
    viewStudentSurvey: () => import('@/components/docview/StudentSurvey.vue'),
    viewNotification: () => import('@/components/docview/Notification.vue'),
    viewNotification2020: () => import('@/components/docview/Notification2020.vue'),
    viewTreatmentRequest: () => import('@/components/docview/TreatmentRequest.vue'),
    viewTreatmentPlan: () => import('@/components/docview/TreatmentPlan.vue'),
    viewStatement: () => import('@/components/docview/Statement.vue'),
    viewStatement2020: () => import('@/components/docview/Statement2020.vue'),
    viewIntensiveRequest: () => import('@/components/docview/IntensiveRequest.vue'),
    viewIntensiveNotification: () => import('@/components/docview/IntensiveNotification.vue'),
    notificationNext: () => import('@/components/doc/notificationNext.vue'),
    viewSelfCheck: () => import('@/components/docview/ViewSelfCheck.vue'),
    historyPopup: () => import('@/components/common/historyPopup/Index.vue'),
    childInfoModify: () => import('@/components/common/ChildInfoModify.vue'),
    centerChildStudentEnrollment: () => import('@/components/common/ChildInfoModify.vue'),
    managementHealthcareInfoModify: () => import('@/components/healthcare/management/healthcare/InfoModify.vue'),
    managementHospitalInfoModify: () => import('@/components/healthcare/management/hospital/InfoModify.vue'),
    managementCenterInfoModify: () => import('@/components/healthcare/management/center/InfoModify.vue'),
    managementSchoolInfoModify: () => import('@/components/healthcare/management/school/InfoModify.vue'),
    managementStudentChildStudentEnrollment: () => import('@/components/common/ChildInfoModify.vue'),
    managementStudentStudentEnrollment: () => import('@/components/healthcare/management/student/StudentEnrollment.vue'),
    hptDesignation: () => import('@/components/healthcare/management/HptDesignation.vue'),
    billProcessPopup: () => import('@/components/healthcare/bill/claim/detail/ProcessPopup.vue'),
    billPrintPopup: () => import('@/components/healthcare/bill/claim/printPopup/Index.vue'),
    registHospitalDocument: () => import('@/components/healthcare/bill/claim/detail/RegistHospitalDocument.vue'),
    viewHospitalDocument: () => import('@/components/healthcare/bill/claim/detail/ViewHospitalDocument.vue'),
    treatmentChargeList: () => import('@/components/common/treatmentCharge/List.vue'),
    treatmentChargeRegist: () => import('@/components/common/treatmentCharge/Regist.vue'),
    contractFileList: () => import('@/components/school/contract/file/List.vue'),
    HospitalContractFileList: () => import('@/components/hospital/contract/file/List.vue'),
    contractFileRegist: () => import('@/components/school/contract/file/Regist.vue'),
    studentBusinessNoteRegist: () => import('@/components/hospital/StudentBusinessNoteRegist.vue'),
    notScreenRegist: () => import('@/components/school/NotScreenRegist.vue'),
    schoolInfoUpload: () => import('@/components/school/SchoolInfoUpload.vue'),
    schoolHospitalList: () => import('@/components/school/hospitalList/Index.vue'),
    schoolHospitalLocation: () => import('@/components/school/contract/HospitalLocation.vue'),
    hospitalHealthcareList: () => import('@/components/hospital/healthcareList/Index.vue'),
    gyeonggiHospitalFamdoc: () => import('@/components/popup/contents/GyeonggiHospitalFamdoc.vue'),
    gyeonggiHealthcare: () => import('@/components/popup/contents/GyeonggiHealthcare.vue'),
    gyeonggiSchool: () => import('@/components/popup/contents/GyeonggiSchool.vue'),
    surveyGuide: () => import('@/components/popup/contents/SurveyGuide.vue'),
    examineSurveyGuide: () => import('@/components/popup/contents/ExamineSurveyGuide.vue'),
    businessClose: () => import('@/components/popup/contents/BusinessClose.vue'),
    gyeonggiClose: () => import('@/components/popup/contents/GyeonggiClose.vue'),
    gyeonggiStats: () => import('@/components/popup/contents/GyeonggiStats.vue'),
    jbeBill: () => import('@/components/popup/contents/JbeBill.vue'),
    seoulBusinessClose: () => import('@/components/popup/contents/SeoulBusinessClose.vue'),
    seoulBusinessInfo: () => import('@/components/popup/contents/SeoulBusinessInfo.vue'),
    busanBusinessClose: () => import('@/components/popup/contents/BusanBusinessClose.vue'),
    incheonBusinessClose: () => import('@/components/popup/contents/IncheonBusinessClose.vue'),
    useSettlement: () => import('@/components/popup/contents/UseSettlement.vue'),
    adminBusiness: () => import('@/components/admin/Business.vue'),
    adminManagement: () => import('@/components/admin/Management.vue'),
    studentLogPopup: () => import('@/components/common/studentLogPopup/Index.vue'),
    hospitalEnrollment: () => import('@/components/healthcare/management/hospital/HospitalEnrollment.vue'),
    schoolEnrollment: () => import('@/components/healthcare/management/school/SchoolEnrollment.vue'),
    centerEnrollment: () => import('@/components/healthcare/management/center/CenterEnrollment.vue'),
    gitpleLogin: () => import('@/components/popup/contents/GitpleLogin.vue'),
    schoolStudentTransfer: () => import('@/components/school/studentTransfer/index.vue'),
    SeoulSongpaguHealthcareNotification: () => import('@/components/popup/contents/SeoulSongpaguHealthcareNotification'),
  },
};
</script>
