<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        진료 의뢰서
      </p>
    </div>
    <!-- form__ver_1 -->
    <div class="sub__content form__ver_2 bg_white mt30">
      <div class="sub__section mt30">
        <std-info-box businessDivision="C" />
      </div>
      <!--//sub__section-->
      <div class="comm__line mt30"></div>
      <div class="sub__section">
        <div class="section_con">
          <p class="commp fwn">
            환자상태 및 진료의뢰내용
            <span class="c_red">*</span>
          </p>
          <div class="textbox mt10">
            <textarea
              cols="30"
              rows="10"
              :value="formContents.treatmentRequest.tt_contents.value"
              class="comm__textarea wid100"
              :placeholder="formContents.treatmentRequest.tt_contents.placeholder"
              style="min-height: 300px"
              @input="DATA_SET({ tt_contents: $event.target.value })"
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
        <a href="javascript:;" class="blue_button wid180 ml25" @click="submit('Y')">다음</a>
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
        doctor: { data1: 'tt_doctor', data2: 'tt_doctor_name', data3: 'tt_license', data4: 'tt_date', data5: 'tt_organ' },
      },
    };
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapState('user', ['userOrganTargetId']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('business', ['endBusiness']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
  created() {
    if (this.endBusiness('bill')) {
      alert('잘못된 접근입니다.');
      this.$router.push('/');
      return false;
    }

    this.$store.commit('student/resetStudentInfo');
    this.$store.commit('doc/treatmentRequest_clear');

    let infoForm = {
      studentId: this.$route.query.studentId,
      notificationId: this.$route.query.notificationId,
    };
    Hospital.treatmentRequestInfo(infoForm).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
        res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
        if (res.data.treatmentRequestInfo) {
          res.data.treatmentRequestInfo.status = this.codeToValue(res.data.treatmentRequestInfo.status);
        }
        // code convert end
        if (res.data.treatmentRequestInfo && res.data.treatmentRequestInfo.status !== 'N') {
          alert('잘못된 접근입니다.');
          this.$router.push('/');
          return false;
        }
        this.$store.commit('student/DATA_SET', res.data.studentInfo);
        if (res.data.treatmentRequestInfo) {
          this.$store.commit('doc/DATA_SET', res.data.treatmentRequestInfo.form);
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
      let formData = {};
      for (const i in this.formContents.treatmentRequest) {
        formData[i] = this.formContents.treatmentRequest[i].value;
      }
      const form = {
        studentId: this.$route.query.studentId,
        notificationId: this.$route.query.notificationId,
        status: this.valueToCode('C0001', status),
        form: formData,
      };
      if (status === 'Y') {
        // validation
        if (this.formContents.treatmentRequest.tt_contents.value === '') {
          this.$alert('진료 의뢰 내용을 입력해 주세요.', '알림', 'warning');
          return false;
        }
        const designationInfo = {
          businessDivision: 'C',
          districtCode: this.studentInfo.districtCode.value,
          designationType: 'treatmentRequest',
          form,
        };
        this.$store.dispatch('popup/popupOpen', { contents: 'hptDesignation', params: designationInfo });
      } else {
        this.$store.commit('loading', true);
        Hospital.treatmentRequestRegist(form).then(res => {
          this.$store.commit('loading', false);
          if (res && res.data.rt === 200) {
            this.$alert(`임시저장되었습니다.`, '알림', 'success').then(() => {
              this.$router.go(-1);
            });
          } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        });
      }
    },
  },
};
</script>
