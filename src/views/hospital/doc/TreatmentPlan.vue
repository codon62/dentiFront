<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        진료 계획서
      </p>
    </div>
    <!-- form__ver_1 -->
    <div class="sub__content form__ver_2 bg_white mt30">
      <div v-if="treatmentPlanRejectInfo" class="comm__form mt20">
        <p class="c_red d_inblock commp2 fwb ml5">※ 미승인 사유</p>
        <div class="form__row mt10">
          <div class="set_table">
            <div class="set__table tal">
              <p class="commp c_red" v-html="treatmentPlanRejectInfo.treatmentPlanRejectReason"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="sub__section mt30">
        <std-info-box businessDivision="C" />
      </div>
      <!--//sub__section-->
      <div class="comm__line mt30"></div>
      <div class="sub__section">
        <div class="section_con mt10">
          <p class="commp2 fwb">진료 계획 작성 원칙</p>
          <p class="commp mt5 fw500">
            * 치과 진료는 자치구 보건소 지역협의체 회의에서 결정된 진료범위입니다. (반드시 확인요망)
            <br />
            * 예방진료 : 치아홈메우기/치석제거(부분치석제거)
          </p>
          <p class="commp mt20 c_red fw500">
            ※ 치석제거 전악제거가 필요시 보건소 협의하에 진행
            <br />
            ※ 불소도포는 치과의원에서 실시하더라도 청구 불가
            <br />
            ※ 예산사정상 반드시 보건소 승인 후 진료 시작하셔야 합니다.
          </p>

          <p class="commp2 fwb mt30">구강 진료 계획</p>
          <div class="textbox mt20">
            <textarea
              cols="30"
              rows="10"
              :value="formContents.treatmentPlan.t_contents.value"
              class="comm__textarea wid100"
              placeholder="구강 진료 계획을 작성해 주세요."
              style="min-height: 300px"
              @input="DATA_SET({ t_contents: $event.target.value })"
            ></textarea>
          </div>
          <div class="comm__line mt30"></div>
          <doctor-info :hospitalId="userOrganTargetId" :data-array="form.doctor" subject="작성" />
        </div>
      </div>
      <!--//sub__content-->
    </div>
    <!--//sub__section-->
    <div class="flex_space_between_container mt30 mb30">
      <div class="inner--left">
        <a href="javascript:;" class="white_button wid108" @click="$router.go(-1)">돌아가기</a>
      </div>
      <div class="flex_box">
        <a href="javascript:;" class="black_button wid108" @click="submit('N')">임시 저장</a>
        <a href="javascript:;" class="blue_button wid180 ml25" @click="submit('Y')">최종 제출</a>
      </div>
    </div>
  </fragment>
</template>

<script>
import Hospital from '@/apis/Hospital';
import stdInfoBox from '@/components/doc/stdInfoBox';
import DoctorInfo from '@/components/doc/doctorInfo';
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    'std-info-box': stdInfoBox,
    DoctorInfo,
  },
  data() {
    return {
      form: {
        doctor: { data1: 't_doctor', data2: 't_doctor_name', data3: 't_license', data4: 't_date', data5: 't_organ' },
      },
      treatmentPlanRejectInfo: null,
    };
  },
  computed: {
    ...mapState('doc', ['formContents', 'pdfStatus']),
    ...mapState('user', ['userOrganTargetId']),
    ...mapGetters('business', ['endBusiness']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
  created() {
    if (this.endBusiness('bill')) {
      alert('잘못된 접근입니다.');
      this.$router.push('/');
      return false;
    }

    this.$store.commit('doc/treatmentPlan_clear');
    this.$store.commit('doc/pdfStatusSet', false);

    let infoForm = {
      hospitalId: this.userOrganTargetId,
      studentId: this.$route.query.studentId,
      notificationId: this.$route.query.notificationId,
    };
    Hospital.treatmentPlanInfo(infoForm).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
        res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
        if (res.data.treatmentPlanInfo) {
          res.data.treatmentPlanInfo.status = this.codeToValue(res.data.treatmentPlanInfo.status);
        }
        // code convert end
        if (res.data.treatmentPlanInfo && res.data.treatmentPlanInfo.status !== 'N') {
          alert('잘못된 접근입니다.');
          this.$router.push('/');
          return false;
        }
        this.$store.commit('student/DATA_SET', res.data.studentInfo);
        if (res.data.treatmentPlanInfo) {
          this.$store.commit('doc/DATA_SET', res.data.treatmentPlanInfo.form);
          if (res.data.treatmentPlanInfo.treatmentPlanRejectList.length) {
            this.treatmentPlanRejectInfo = res.data.treatmentPlanInfo.treatmentPlanRejectList[0];
            this.treatmentPlanRejectInfo.treatmentPlanRejectReason = this.treatmentPlanRejectInfo.treatmentPlanRejectReason.replace(/(\n)/g, '<br>');
          }
        }
        this.$store.commit('update2');
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
    submit(status) {
      let label = '';
      let alertMsg = '';
      if (status === 'Y') {
        label = '최종제출';
        alertMsg = `${label} 하시겠습니까?<br/>${label} 시 수정이 불가능합니다.`;
      } else {
        label = '임시저장';
        alertMsg = `${label} 하시겠습니까?`;
      }
      this.$confirm('', '알림', 'question', { html: alertMsg })
        .then(() => {
          let formData = {};
          for (const i in this.formContents.treatmentPlan) {
            formData[i] = this.formContents.treatmentPlan[i].value;
          }
          if (status === 'Y') {
            // validation
            if (this.formContents.treatmentPlan.t_contents.value === '') {
              this.$alert('구강 진료 계획을 입력해 주세요.', '알림', 'warning');
              return false;
            }
            this.$store.commit('loading', true);
            // this.$store.dispatch('popup/popupOpen', { contents: 'viewTreatmentPlan', params: { studentId: this.$route.query.studentId, notificationId: this.$route.query.notificationId, pdf: true } }); // pdf 저장
            this.treatmentPlanRegist('Y');
          } else {
            this.$store.commit('loading', true);
            this.treatmentPlanRegist('N');
          }
        })
        .catch(() => {});
    },
    treatmentPlanRegist(status) {
      let formData = {};
      for (const i in this.formContents.treatmentPlan) {
        formData[i] = this.formContents.treatmentPlan[i].value;
      }
      const form = {
        hospitalId: this.userOrganTargetId,
        studentId: this.$route.query.studentId,
        notificationId: this.$route.query.notificationId,
        status: this.valueToCode('C0001', status),
        form: formData,
      };
      Hospital.treatmentPlanRegist(form).then(res => {
        if (res && res.data.rt === 200) {
          this.$store.commit('loading', false);
          const label = status === 'Y' ? '최종제출' : '임시저장';
          this.$alert(`${label}되었습니다.`, '알림', 'success').then(() => {
            this.$router.go(-1);
          });
        } else {
          this.$store.commit('loading', false);
          this.$store.commit('doc/pdfStatusSet', false);
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
  watch: {
    pdfStatus() {
      if (this.pdfStatus) {
        this.treatmentPlanRegist('Y');
      }
    },
  },
};
</script>
