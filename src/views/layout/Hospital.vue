<template>
  <div class="container_wrap left__menuset">
    <v-left-menu cmp="hospital"></v-left-menu>
    <div class="content__area bg__form_ver" :class="{ password__page: (!userOrganPasswordModify && !isDev) || ac || info || videoEdu, hat: !userOrganTargetId }">
      <v-top-bar></v-top-bar>
      <create-examine-hospital v-if="!userOrganTargetId"></create-examine-hospital>
      <change-password v-else-if="!userOrganPasswordModify"></change-password>
      <change-account v-else-if="ac" :bank-list="bankList" @change="ac = false"></change-account>
      <set-hospital-info v-else-if="info" @change="info = false"></set-hospital-info>
      <set-first-treat-time v-else-if="treatTime" @change="treatTime = false"></set-first-treat-time>
      <set-document-file v-else-if="documentFile" @change="documentFile = false"></set-document-file>
      <watch-video-edu v-else-if="videoEdu" @change="videoEdu = false"></watch-video-edu>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import LeftMenu from '@/components/common/LeftMenu.vue';
import TopBar from '@/components/common/TopBar.vue';
import ChangePassword from '@/components/common/ChangePassword.vue';
import ChangeAccount from '@/components/hospital/ChangeAccount.vue';
import SetHospitalInfo from '@/components/hospital/SetHospitalInfo.vue';
import SetFirstTreatTime from '@/components/hospital/SetFirstTreatTime.vue';
import WatchVideoEdu from '@/components/hospital/WatchVideoEdu.vue';
import { mapGetters, mapState } from 'vuex';
import CreateExamineHospital from '@/components/hospital/CreateExamineHospital';
import Bill from '@/apis/Bill';
import SetDocumentFile from '@/components/hospital/SetDocumentFile';

export default {
  components: {
    'v-left-menu': LeftMenu,
    'v-top-bar': TopBar,
    CreateExamineHospital,
    ChangePassword,
    ChangeAccount,
    SetHospitalInfo,
    SetFirstTreatTime,
    SetDocumentFile,
    WatchVideoEdu,
  },
  data() {
    return {
      ac: false,
      info: false,
      treatTime: false,
      documentFile: false,
      videoEdu: false,
      bankList: [],
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId', 'userOrganPasswordModify', 'hospitalType', 'hospitalVideoEdu', 'deldate']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['codeToValue']),
  },
  created() {
    let form = {
      hospitalId: this.userOrganTargetId,
    };
    if (!this.deldate && this.userOrganTargetId) {
      Hospital.accountInfo(form).then(res => {
        if (res && res.data.rt === 200) {
          if (!res.data.hospitalInfo.bankCode || !res.data.hospitalInfo.hospitalDepositor || !res.data.hospitalInfo.hospitalAccount) {
            this.ac = true;
            this.bankList = res.data.bankList;
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
      Hospital.info(form).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.hospital.hospitalBusinessDivisionC = this.codeToValue(res.data.hospital.hospitalBusinessDivisionC);
          res.data.hospital.hospitalBusinessDivisionF = this.codeToValue(res.data.hospital.hospitalBusinessDivisionF);
          res.data.hospital.hospitalBusinessDivisionE = this.codeToValue(res.data.hospital.hospitalBusinessDivisionE);
          res.data.hospital.hospitalTreatDisabledPerson = this.codeToValue(res.data.hospital.hospitalTreatDisabledPerson);
          res.data.manager.userOrganManagerAlarm = this.codeToValue(res.data.manager.userOrganManagerAlarm);
          for (let i = 0; i < res.data.treatDateTimeList.length; i++) {
            res.data.treatDateTimeList[i].hospitalTreatDateTimeYoil = this.codeToValue(res.data.treatDateTimeList[i].hospitalTreatDateTimeYoil);
          }
          for (let i = 0; i < res.data.treatClosedYoilList.length; i++) {
            res.data.treatClosedYoilList[i] = this.codeToValue(res.data.treatClosedYoilList[i]);
          }
          for (let i = 0; i < res.data.doctorList.length; i++) {
            res.data.doctorList[i].hospitalDoctorRepresent = this.codeToValue(res.data.doctorList[i].hospitalDoctorRepresent);
          }
          // code convert end

          let hospitalInfo = res.data;
          delete hospitalInfo.rt;
          delete hospitalInfo.rtMsg;
          this.$store.commit('hospital/setHospitalInfo', hospitalInfo);
          this.$store.commit('hospital/setAddress1', res.data.hospital.hospitalAddress);
          if (
            !res.data.hospital.hospitalAddress ||
            !res.data.hospital.hospitalZipcode ||
            !res.data.manager.userOrganManagerName ||
            !res.data.manager.userOrganManagerTel ||
            !res.data.manager.userOrganManagerAlarm ||
            (!this.isDev && (!res.data.hospital.hospitalLon || !res.data.hospital.hospitalLat))
          ) {
            // kakao 지도 API 권한 최대 10개 이유로 실서버에서만 위도 / 경도 설정
            this.$store.commit('hospital/HPT_SET', { hospital: { hospitalAddress: '' } });
            this.$store.commit('hospital/setAddress1', '');
            this.info = true;
          }
          this.treatTime = !hospitalInfo.treatTime.lunchStartTime || !hospitalInfo.treatTime.lunchEndTime;
          if (this.districtCodeFirst === 'C' && this.hospitalType !== 'T') {
            this.videoEdu = this.hospitalVideoEdu !== 'Y';
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
      if (this.districtCodeFirst === 'I') {
        Bill.hospitalDocumentInfo(form).then(res => {
          if (res && res.data.rt === 200) {
            if (!res.data.fileA || !res.data.fileB || !res.data.fileC) {
              this.documentFile = true;
            }
          } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        });
      }
    }
  },
};
</script>

<style scoped lang="scss">
.hat {
  height: auto !important;
}
</style>
