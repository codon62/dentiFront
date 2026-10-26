<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        심화치료 진료 의뢰서
      </p>
    </div>
    <!-- form__ver_1 -->
    <div class="sub__content form__ver_2 bg_white mt30">
      <div v-if="intensiveRequestRejectInfo.length" class="comm__form mt20">
        <p class="c_red d_inblock commp2 fwb ml5">※ 미승인 사유</p>
        <div class="form__row mt10">
          <div class="set_table">
            <div class="set__table tal">
              <p class="commp c_red" v-html="intensiveRequestRejectInfo[0].intensiveRequestRejectReason"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="sub__section mt30">
        <std-info-box businessDivision="C" />
      </div>
      <div class="comm__line mt30"></div>
      <div class="sub__section">
        <div class="section_con">
          <div class="row flex_set flex_left">
            <div class="flex_item flex_size_m5">
              <p class="commp fwn">
                상병명
                <span class="c_red">*</span>
              </p>
              <div class="mt10 wid100 m__putbox">
                <input
                  type="text"
                  class="comm_put"
                  :value="formContents.intensiveRequest.tr_disease_name.value"
                  placeholder="상병명을 입력해 주세요."
                  @input="TR_DATA_SET({ tr_disease_name: $event.target.value })"
                />
              </div>
            </div>
            <div class="flex_item flex_size_m5 ml20">
              <p class="commp fwn">
                상병코드
                <span class="c_red">*</span>
              </p>
              <div class="mt10 wid100 m__putbox">
                <input
                  type="text"
                  class="comm_put"
                  :value="formContents.intensiveRequest.tr_disease_code.value"
                  placeholder="상병코드를 입력해 주세요."
                  @input="TR_DATA_SET({ tr_disease_code: $event.target.value })"
                />
              </div>
            </div>
          </div>
          <p class="commp fwn mt20">
            환자상태 및 진료의뢰내용
            <span class="c_red">*</span>
          </p>
          <div class="textbox mt10">
            <textarea
              cols="30"
              rows="10"
              :value="formContents.intensiveRequest.tr_contents.value"
              class="comm__textarea wid100"
              placeholder="환자상태 및 진료의뢰내용을 작성해 주세요."
              style="min-height: 300px"
              @input="TR_DATA_SET({ tr_contents: $event.target.value })"
            ></textarea>
          </div>

          <p class="commp mt30 fwn">첨부파일</p>
          <p class="commp c_gray2 mt5">파일은 최대 10개만 첨부됩니다. (최대 용량 5MB)</p>
          <file-upload v-for="(file, index) in files" :key="index" :remove="true" :file-name="file.originName" @input="fileInput($event, index)" @remove="removeFile(index)" />

          <div class="comm__line mt30"></div>
          <agency-info :status="status" />
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
import Business from '@/apis/Business';
import stdInfoBox from '@/components/doc/stdInfoBox';
import AgencyInfo from '@/components/doc/agencyInfo';
import FileUpload from '@/components/common/FileUpload.vue';
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    'std-info-box': stdInfoBox,
    AgencyInfo,
    FileUpload,
  },
  data() {
    return {
      status: '',
      files: [''],
      deleteFiles: [],
      intensiveRequestRejectInfo: [],
    };
  },
  computed: {
    ...mapState('doc', ['formContents', 'pdfStatus']),
    ...mapState('user', ['userOrganTargetId', 'userOrganTargetType']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
  created() {
    this.$store.commit('student/resetStudentInfo');
    this.$store.commit('doc/intensiveRequest_clear');
    this.$store.commit('doc/pdfStatusSet', false);

    const form = {
      studentId: this.$route.query.studentId,
    };
    Business.intensiveRequestInfo(form).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
        res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
        if (res.data.intensiveRequestInfo) {
          res.data.intensiveRequestInfo.status = this.codeToValue(res.data.intensiveRequestInfo.status);
        } else {
          this.TR_DATA_SET({
            tr_contents: `- 아동 이름 : ${res.data.studentInfo.studentName}\n- 주민등록번호 : \n- 주소 : \n- 연락처 : ${res.data.studentInfo.studentTel}\n- 국적(외국인일 경우만) : `,
          });
        }
        // code convert end
        if (this.userOrganTargetType !== 'HC' || (res.data.intensiveRequestInfo && ['N', 'D'].indexOf(res.data.intensiveRequestInfo.status) === -1)) {
          alert('잘못된 접근입니다.');
          this.$router.push('/');
          return false;
        }
        if (res.data.intensiveRequestRejectInfo && res.data.intensiveRequestRejectInfo.length) {
          this.intensiveRequestRejectInfo = res.data.intensiveRequestRejectInfo;
          this.intensiveRequestRejectInfo[0].intensiveRequestRejectReason = this.intensiveRequestRejectInfo[0].intensiveRequestRejectReason.replace(/(\n)/g, '<br>');
        }
        this.$store.commit('student/DATA_SET', res.data.studentInfo);
        this.files = res.data.files;
        if (this.files.length < 10 && this.files[this.files.length - 1] !== '') {
          this.files.push('');
        }
        if (res.data.intensiveRequestInfo) {
          this.$store.commit('doc/TR_DATA_SET', res.data.intensiveRequestInfo.form);
        }
        this.status = res.data.intensiveRequestInfo ? res.data.intensiveRequestInfo.status : null;
        this.$store.commit('update');
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    ...mapMutations('doc', ['TR_DATA_SET']),
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
          for (const i in this.formContents.intensiveRequest) {
            formData[i] = this.formContents.intensiveRequest[i].value;
          }
          if (status === 'Y') {
            // validation
            if (this.formContents.intensiveRequest.tr_disease_name.value === '') {
              this.$alert('상병명을 입력해 주세요.', '알림', 'warning');
              return false;
            } else if (this.formContents.intensiveRequest.tr_disease_code.value === '') {
              this.$alert('상병코드를 입력해 주세요.', '알림', 'warning');
              return false;
            } else if (this.formContents.intensiveRequest.tr_contents.value === '') {
              this.$alert('환자상태 및 진료의뢰내용을 입력해 주세요.', '알림', 'warning');
              return false;
            } else if (this.formContents.intensiveRequest.tr_orm_name.value === '') {
              this.$alert('담당 공무원명을 입력해 주세요.', '알림', 'warning');
              return false;
            } else if (this.formContents.intensiveRequest.tr_orm_tel.value === '') {
              this.$alert('전화번호를 입력해 주세요.', '알림', 'warning');
              return false;
            } else if (this.formContents.intensiveRequest.tr_orm_tel.value.length < 7 || this.formContents.intensiveRequest.tr_orm_tel.value.length > 11) {
              this.$alert('유효한 전화번호를 입력해 주세요. (7~11자리)', '알림', 'warning');
              return false;
            }
            this.$store.commit('loading', true);
            // this.$store.dispatch('popup/popupOpen', { contents: 'viewIntensiveRequest', params: { studentId: this.$route.query.studentId, pdf: true } }); // pdf 저장
            this.intensiveRequestRegist('Y');
          } else {
            this.$store.commit('loading', true);
            this.intensiveRequestRegist('N');
          }
        })
        .catch(() => {});
    },
    intensiveRequestRegist(status) {
      const request = {
        healthCareId: this.userOrganTargetId,
        studentId: this.$route.query.studentId,
        status: this.valueToCode('C0001', status),
        form: {},
        deleteFiles: this.deleteFiles,
      };
      for (const i in this.formContents.intensiveRequest) {
        request.form[i] = this.formContents.intensiveRequest[i].value;
      }

      const form = new FormData();
      form.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
      for (const i in this.files) {
        if (this.files[i] !== '' && !this.files[i].intensiveRequestFileId) {
          form.append('files', this.files[i]);
        }
      }

      Business.intensiveRequestRegist(form).then(res => {
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
      if (this.files[index].intensiveRequestFileId) {
        this.deleteFiles.push(this.files[index].intensiveRequestFileId);
      }
      this.files.splice(index, 1);
      this.files.splice(index, 0, file);
      if (this.files.length < 10 && this.files[this.files.length - 1] !== '') {
        this.files.push('');
      }
    },
    removeFile(index) {
      if (this.files[index].intensiveRequestFileId) {
        this.deleteFiles.push(this.files[index].intensiveRequestFileId);
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
        this.intensiveRequestRegist('Y');
      }
    },
  },
};
</script>
