<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        심화치료 통보서
      </p>
    </div>
    <!-- form__ver_1 -->
    <div class="sub__content form__ver_2 bg_white mt30">
      <div class="sub__section mt30">
        <std-info-box businessDivision="C" />
      </div>
      <div class="comm__line mt30"></div>
      <div class="sub__section">
        <div class="section_con">
          <p class="commp fwn">
            심화치료 내용
            <span class="c_red">*</span>
          </p>
          <div class="textbox mt10">
            <textarea
              cols="30"
              rows="10"
              :value="formContents.intensiveNotification.tn_contents.value"
              class="comm__textarea wid100"
              placeholder="심화치료 내용을 작성해 주세요."
              style="min-height: 300px"
              @input="TN_DATA_SET({ tn_contents: $event.target.value })"
            ></textarea>
          </div>

          <div class="row flex_set flex_left mt20">
            <div class="flex_item flex_size_m5">
              <p class="commp fwn">
                비용
                <span class="c_red">*</span>
              </p>
              <div class="mt10 wid100 m__putbox">
                <input type="number" class="comm_put" :value="formContents.intensiveNotification.examPrice.value" placeholder="0" @input="TN_DATA_SET({ examPrice: $event.target.value })" />
              </div>
            </div>
          </div>

          <p class="commp mt30 fwn">첨부파일</p>
          <p class="commp c_gray2 mt5">파일은 최대 10개만 첨부됩니다. (최대 용량 5MB)</p>
          <file-upload v-for="(file, index) in files" :key="index" :remove="true" :file-name="file.originName" @input="fileInput($event, index)" @remove="removeFile(index)" />

          <div class="comm__line mt30"></div>
          <tn-doctor-info />
        </div>
      </div>
      <!--//sub__content-->
    </div>
    <!--//sub__section-->
    <div class="flex_space_between_container mt30 mb30">
      <div>
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
import Univhpt from '@/apis/Univhpt';
import stdInfoBox from '@/components/doc/stdInfoBox';
import TnDoctorInfo from '@/components/doc/tnDoctorInfo';
import FileUpload from '@/components/common/FileUpload.vue';
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    'std-info-box': stdInfoBox,
    TnDoctorInfo,
    FileUpload,
  },
  data() {
    return {
      files: [''],
      deleteFiles: [],
    };
  },
  computed: {
    ...mapState('doc', ['formContents', 'pdfStatus']),
    ...mapState('user', ['userOrganTargetId']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
  created() {
    this.$store.commit('student/resetStudentInfo');
    this.$store.commit('doc/intensiveNotification_clear');
    this.$store.commit('doc/pdfStatusSet', false);

    const form = {
      universityHospitalId: this.userOrganTargetId,
      studentId: this.$route.query.studentId,
    };
    Univhpt.intensiveNotificationInfo(form).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
        res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
        if (res.data.intensiveNotificationInfo) {
          res.data.intensiveNotificationInfo.status = this.codeToValue(res.data.intensiveNotificationInfo.status);
        }
        // code convert end
        if (res.data.intensiveNotificationInfo && res.data.intensiveNotificationInfo.status !== 'N') {
          alert('잘못된 접근입니다.');
          this.$router.push('/');
          return false;
        }
        this.$store.commit('student/DATA_SET', res.data.studentInfo);
        this.files = res.data.files;
        if (this.files.length < 10 && this.files[this.files.length - 1] !== '') {
          this.files.push('');
        }
        if (res.data.intensiveNotificationInfo) {
          this.$store.commit('doc/TN_DATA_SET', res.data.intensiveNotificationInfo.form);
        }
        this.$store.commit('update');
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    ...mapMutations('doc', ['TN_DATA_SET']),
    submit(status) {
      let alertMsg = '';
      if (status === 'Y') {
        alertMsg = '최종제출 하시겠습니까?<br/>최종제출 시 수정이 불가능합니다.';
      } else {
        alertMsg = '임시저장 하시겠습니까?';
      }
      this.$confirm('', '알림', 'question', { html: alertMsg })
        .then(() => {
          let formData = {};
          for (const i in this.formContents.intensiveNotification) {
            formData[i] = this.formContents.intensiveNotification[i].value;
          }
          if (status === 'Y') {
            // validation
            if (this.formContents.intensiveNotification.tn_contents.value === '') {
              this.$alert('심화치료 내용을 입력해 주세요.', '알림', 'warning');
              return false;
            } else if (this.formContents.intensiveNotification.tn_doctor.value === '') {
              this.$alert('치과의사명을 입력해 주세요.', '알림', 'warning');
              return false;
            } else if (this.formContents.intensiveNotification.tn_license.value === '') {
              this.$alert('면허번호를 입력해 주세요.', '알림', 'warning');
              return false;
            }
            this.$store.commit('loading', true);
            // this.$store.dispatch('popup/popupOpen', { contents: 'viewIntensiveNotification', params: { studentId: this.$route.query.studentId, pdf: true } }); // pdf 저장
            this.intensiveNotificationRegist('Y');
          } else {
            this.$store.commit('loading', true);
            this.intensiveNotificationRegist('N');
          }
        })
        .catch(() => {});
    },
    intensiveNotificationRegist(status) {
      if (this.formContents.intensiveNotification.examPrice.value === '') {
        this.TN_DATA_SET({ examPrice: 0 }); // 검진비 빈값인 경우 0원처리
      } else {
        this.TN_DATA_SET({ examPrice: parseInt(this.formContents.intensiveNotification.examPrice.value) });
      }

      const request = {
        universityHospitalId: this.userOrganTargetId,
        studentId: this.$route.query.studentId,
        status: this.valueToCode('C0001', status),
        form: {},
        deleteFiles: this.deleteFiles,
      };
      for (const i in this.formContents.intensiveNotification) {
        request.form[i] = this.formContents.intensiveNotification[i].value;
      }

      const form = new FormData();
      form.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
      for (const i in this.files) {
        if (this.files[i] !== '' && !this.files[i].intensiveNotificationFileId) {
          form.append('files', this.files[i]);
        }
      }

      Univhpt.intensiveNotificationRegist(form).then(res => {
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
    fileInput(file, index) {
      if (this.files[index].intensiveNotificationFileId) {
        this.deleteFiles.push(this.files[index].intensiveNotificationFileId);
      }
      this.files.splice(index, 1);
      this.files.splice(index, 0, file);
      if (this.files.length < 10 && this.files[this.files.length - 1] !== '') {
        this.files.push('');
      }
    },
    removeFile(index) {
      if (this.files[index].intensiveNotificationFileId) {
        this.deleteFiles.push(this.files[index].intensiveNotificationFileId);
      }
      this.files.splice(index, 1);
      if (this.files.length < 10 && this.files[this.files.length - 1] !== '') {
        this.files.push('');
      }
    },
  },
  watch: {
    pdfStatus() {
      if (this.pdfStatus) {
        this.intensiveNotificationRegist('Y');
      }
    },
  },
};
</script>
