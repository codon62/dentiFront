<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        내역서 작성
      </p>
    </div>
    <!-- form__ver_1 -->
    <div class="sub__content form__ver_2 bg_white mt30">
      <div v-if="billRejectReasonInfo" class="comm__form mt20">
        <p class="c_red d_inblock commp2 fwb ml5">※ 반려 사유</p>
        <div class="form__row mt10">
          <div class="set_table">
            <div class="set__table tal">
              <p class="commp c_red" v-html="billRejectReasonInfo.billRejectReason"></p>
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

          <p class="commp2 fwb mt30">구강진료</p>
          <div class="comm__form mt20">
            <div id="defaultTreat">
              <div v-if="formBlock.block1.length" class="form_wrap_statement_edit">
                <div><p class="commp tal">예방진료</p></div>
                <div>
                  <div v-for="(row, rowIndex) in formBlock.block1" :key="rowIndex" class="flex_box">
                    <div v-for="block in row" :key="`${block.id}_${block.form}`" class="">
                      <check-and-check :data-array="form[block.form]" :divclass="rowIndex !== 0 ? 'mt15' : ''" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="form_wrap_statement_edit" :class="{ mt20: formBlock.block1.length }">
                <div><p class="commp tal">치료</p></div>
                <div>
                  <div v-for="(row, rowIndex) in formBlock.block2" :key="rowIndex" class="flex_box">
                    <div v-for="block in row" :key="`${block.id}_${block.form}`" class="">
                      <check-and-check :data-array="form[block.form]" :divclass="rowIndex !== 0 ? 'mt15' : ''" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="districtCodeFirst === 'A'" id="unvisitedTreat">
              <p class="commp mt5 c_red fw500">* 아래의 항목은 진료계획 있었으나 미내원시 작성하여 주세요.</p>
              <div class="form_wrap_statement_edit mt5">
                <div><p class="commp tal">구강검진</p></div>
                <div>
                  <div v-for="(row, rowIndex) in formBlock.block3" :key="rowIndex" class="flex_box">
                    <div v-for="block in row" :key="`${block.id}_${block.form}`" class="">
                      <check-and-check :data-array="form[block.form]" :divclass="rowIndex !== 0 ? 'mt15' : ''" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="titbox row mt30">
            <div class="inner--left">
              <p class="sub_title commp2 fwb">구강진료 내역</p>
            </div>
            <div class="inner--right">
              <a v-if="districtCodeFirst === 'A'" href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp inner--right ml10" @click="popupOpen({ contents: 'treatmentChargeList' })">
                <img src="@/assets/images/sub/ic_searchlist_r.png" />
                진료 수가표
              </a>
            </div>
          </div>
          <a v-if="districtCodeFirst === 'A'" href="javascript:;" class="mt10 comm__blue_bd_btn tac wid100 d_block btn_m_size2 commp fwn" @click="addTreatment">+ 구강진료 항목 추가</a>

          <oral-care-history :data-array="{ data1: 's_tooth', data2: 'treatPrice', data3: 'copayPrice' }" />

          <p class="commp mt30 fwn">
            첨부파일
            <span class="c_red">(진료기록부 사본 또는 진료 내역서)</span>
          </p>
          <p class="commp c_gray2 mt5">파일은 최대 10개만 첨부됩니다. (최대 용량 5MB)</p>
          <file-upload v-for="(file, index) in files" :key="file.statementFileId" :remove="true" :file-name="file.originName" @input="fileInput($event, index)" @remove="removeFile(index)" />
          <div class="comm__line mt30"></div>
          <doctor-info :hospitalId="userOrganTargetId" :data-array="form.doctor" subject="검진" />
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
import Hospital from '@/apis/Hospital';
import StdInfoBox from '@/components/doc/stdInfoBox';
import DoctorInfo from '@/components/doc/doctorInfo';
import CheckAndCheck from '@/components/doc/checkAndCheck.vue';
import OralCareHistory from '@/components/doc/oralCareHistory.vue';
import FileUpload from '@/components/common/FileUpload.vue';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    StdInfoBox,
    DoctorInfo,
    CheckAndCheck,
    OralCareHistory,
    FileUpload,
  },
  data() {
    return {
      form: {
        s1: { data1: 's_1', data2: 's_1_check' },
        s2: { data1: 's_2', data2: 's_2_check' },
        s3: { data1: 's_3' },
        s4: { data1: 's_4' },
        s5: { data1: 's_5' },
        s6: { data1: 's_6' },
        s7: { data1: 's_7' },
        s8: { data1: 's_8', data2: 's_8_radio' },
        s9: { data1: 's_9' },
        s10: { data1: 's_10' },
        s11: { data1: 's_11' },
        s12: { data1: 's_12' },
        s13: { data1: 's_13' },
        sEtc: { data1: 's_etc', data2: 's_etc_input' },
        doctor: { data1: 's_doctor', data2: 's_doctor_name', data3: 's_license', data4: 's_date', data5: 's_organ' },
      },
      formBlock: {
        block1: [],
        block2: [],
        block3: [],
      },
      files: [''],
      deleteFiles: [],
      billRejectReasonInfo: null,
    };
  },
  computed: {
    ...mapState('doc', ['formContents', 'pdfStatus']),
    ...mapState('user', ['userOrganTargetId']),
    ...mapGetters('user', ['districtCodeFirst']),
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
    this.$store.commit('doc/statement_clear');
    this.$store.commit('doc/pdfStatusSet', false);
    this.$store.commit('loading', false);

    this.$store.commit('doc/statement_set', { districtCodeFirst: this.districtCodeFirst });

    if (this.districtCodeFirst === 'A') {
      // 서울시 아동치과주치의
      this.formBlock.block1.push(
        [
          { id: 1, form: 's7' },
          { id: 2, form: 's8' },
        ],
        [
          { id: 1, form: 's9' },
          { id: 2, form: 's10' },
        ],
      );
      this.formBlock.block2.push(
        [
          { id: 1, form: 's1' },
          { id: 2, form: 's3' },
        ],
        [
          { id: 1, form: 's2' },
          { id: 2, form: 's4' },
        ],
        [
          { id: 1, form: 's5' },
          { id: 2, form: 's6' },
        ],
      );
      this.formBlock.block3.push(
        [
          { id: 1, form: 's12' },
          { id: 2, form: 's13' },
        ],
        [{ id: 1, form: 'sEtc' }],
      );
    } else {
      // 부산시 아동치과주치의
      delete this.form.sEtc.data2;
      this.formBlock.block2.push([
        { id: 1, form: 's2' },
        { id: 1, form: 'sEtc' },
      ]);
    }

    let infoForm = {
      hospitalId: this.userOrganTargetId,
      studentId: this.$route.query.studentId,
      notificationId: this.$route.query.notificationId,
    };
    Hospital.statementInfo(infoForm).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
        res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
        if (res.data.statementInfo) {
          res.data.statementInfo.status = this.codeToValue(res.data.statementInfo.status);
        }
        // code convert end
        if (res.data.statementInfo && res.data.statementInfo.status !== 'N') {
          alert('잘못된 접근입니다.');
          this.$router.push('/');
          return false;
        }
        this.billRejectReasonInfo = res.data.billRejectReasonInfo;
        if (this.billRejectReasonInfo) {
          this.billRejectReasonInfo.billRejectReason = this.billRejectReasonInfo.billRejectReason.replace(/(\n)/g, '<br>');
        }
        this.$store.commit('student/DATA_SET', res.data.studentInfo);
        if (res.data.statementInfo) {
          this.$store.commit('doc/DATA_SET', res.data.statementInfo.form);
          // s_1_radio -> s_1_check 변경으로 인한 데이터 마이그레이션
          if (res.data.statementInfo.form.s_1_radio && (!res.data.statementInfo.form.s_1_check || !res.data.statementInfo.form.s_1_check.length)) {
            this.$store.commit('doc/DATA_SET', { s_1_check: [res.data.statementInfo.form.s_1_radio] });
            this.$store.commit('doc/DATA_SET', { s_1_radio: 0 });
          }
          this.files = res.data.files;
          if (this.files.length < 10 && this.files[this.files.length - 1] !== '') {
            this.files.push('');
          }
        }
        this.$store.commit('update2');
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  mounted() {
    if (this.districtCodeFirst === 'A') {
      const unvisitedTreat = document.getElementById('unvisitedTreat');
      const defaultTreat = document.getElementById('defaultTreat');
      const defaultInput = defaultTreat.getElementsByTagName('input');
      const treatPrice = document.getElementById('treatPrice');
      defaultTreat.addEventListener('change', () => {
        treatPrice.disabled = true;
        for (let idx = 0; idx < defaultInput.length; idx++) {
          if (defaultInput[idx].checked) {
            if (!this.formContents.statement.s_tooth.value.length) {
              this.$store.commit('doc/DATA_SET', { treatPrice: 0 });
            }
            for (const i of this.formBlock.block3) {
              for (const j of i) {
                for (const k in this.form[j.form]) {
                  this.DATA_SET({ [this.form[j.form][k]]: '' });
                }
              }
            }
            return false;
          }
        }
      });
      unvisitedTreat.addEventListener('change', e => {
        if (this.formContents.statement.s_tooth.value.length) {
          this.DATA_SET({ [e.target.id]: '' });
          return false;
        }
        for (let idx = 0; idx < defaultInput.length; idx++) {
          if (defaultInput[idx].checked) {
            this.DATA_SET({ [e.target.id]: '' });
            return false;
          }
        }
      });
    }
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    ...mapMutations('doc', ['DATA_SET']),
    addTreatment() {
      if (this.districtCodeFirst === 'A') {
        const unvisitedTreat = document.getElementById('unvisitedTreat');
        const unvisitedInput = unvisitedTreat.getElementsByTagName('input');
        for (let idx = 0; idx < unvisitedInput.length; idx++) {
          if (unvisitedInput[idx].checked) {
            this.$alert('구강검진 항목을 체크 해제해 주세요.', '알림', 'warning');
            return false;
          }
        }
      }
      this.$store.dispatch('popup/popupOpen', { contents: 'addTreatment2' });
    },
    fileInput(file, index) {
      if (this.files[index].statementFileId) {
        this.deleteFiles.push(this.files[index].statementFileId);
      }
      this.files.splice(index, 1);
      this.files.splice(index, 0, file);
      if (this.files.length < 10 && this.files[this.files.length - 1] !== '') {
        this.files.push('');
      }
    },
    removeFile(index) {
      if (this.files[index].statementFileId) {
        this.deleteFiles.push(this.files[index].statementFileId);
      }
      this.files.splice(index, 1);
      if (this.files.length < 10 && this.files[this.files.length - 1] !== '') {
        this.files.push('');
      }
    },
    submit(status) {
      let alertMsg = '';
      if (status === 'Y') {
        alertMsg = '최종제출 하시겠습니까?<br/>최종제출 시 수정이 불가능합니다.';
      } else {
        alertMsg = '임시저장 하시겠습니까?';
      }
      this.$confirm('', '알림', 'question', { html: alertMsg })
        .then(() => {
          // if (status === 'Y' && this.files.length < 2) {
          //     this.$alert('최소 1개 이상의 파일을 첨부해야 합니다.', '알림', 'warning');
          //     return false;
          // }
          if (this.districtCodeFirst === 'D') {
            // 부산시 아동치과주치의
            if (this.formContents.statement.treatPrice.value > 320_000) {
              this.$alert('청구 금액 총액이 32만원을 넘을 수 없습니다.', '알림', 'warning');
              return false;
            }
            const guitarBlock = this.formContents.statement.s_tooth.value.find(o => o.contents === '기타');
            if (guitarBlock) {
              const guitarTotalPrice = guitarBlock.list.reduce((acc, curr) => acc + parseInt(curr.price), 0);
              if (guitarTotalPrice > 12_000) {
                this.$alert('기타 항목 지원금 총액이 12,000원을 넘을 수 없습니다.', '알림', 'warning');
                return false;
              }
            }
          }
          let validTitle = '';
          if (this.formContents.statement.s_8.value == 1 && this.formContents.statement.s_8_radio.value === '') {
            validTitle = '치석제거 - 항목';
          } else if (this.formContents.statement.s_1.value == 1 && !this.formContents.statement.s_1_check.value.length) {
            validTitle = '방사선 촬영 - 항목';
          } else if (this.formContents.statement.s_2.value == 1 && !this.formContents.statement.s_2_check.value.length) {
            validTitle = '충전치료 - 항목';
          } else if (this.districtCodeFirst === 'A' && this.formContents.statement.s_etc.value == 1 && this.formContents.statement.s_etc_input.value === '') {
            validTitle = '기타';
          }
          if (validTitle !== '') {
            this.$alert('', '알림', 'warning', { html: `<strong>${validTitle}</strong> : 필수 입력 항목입니다.` });
            return false;
          }
          this.$store.commit('loading', true);
          if (status === 'Y') {
            // this.$store.dispatch('popup/popupOpen', {
            //   contents: 'viewStatement',
            //   params: { studentId: this.$route.query.studentId, notificationId: this.$route.query.notificationId, pdf: true, statementYear: this.$route.query.statementYear },
            // }); // pdf 저장
            this.statementRegist(status);
          } else {
            this.statementRegist(status);
          }
        })
        .catch(() => {});
    },
    statementRegist(status) {
      const request = {
        hospitalId: this.userOrganTargetId,
        studentId: this.$route.query.studentId,
        notificationId: this.$route.query.notificationId,
        status: this.valueToCode('C0001', status),
        form: {},
        deleteFiles: this.deleteFiles,
      };
      for (const i in this.formContents.statement) {
        request.form[i] = this.formContents.statement[i].value;
      }

      const form = new FormData();
      form.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
      for (const i in this.files) {
        if (this.files[i] !== '' && !this.files[i].statementFileId) {
          form.append('files', this.files[i]);
        }
      }

      Hospital.statementRegist(form).then(res => {
        if (res && res.data.rt === 200) {
          this.$store.commit('loading', false);
          let html = `${status === 'Y' ? '최종 제출' : '임시 저장'} 되었습니다.`;
          if (status === 'Y' && this.districtCodeFirst === 'A') {
            html += `<br/>최종 제출 후 수정이 필요한 경우 관할 보건소로 문의 부탁드립니다.`;
          }
          this.$alert('', '알림', 'success', { html }).then(() => {
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
        this.statementRegist('Y');
      }
    },
  },
};
</script>
