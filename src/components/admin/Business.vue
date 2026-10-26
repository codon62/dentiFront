<template>
  <div class="popup_content">
    <v-popuptitle message="관리자 기능" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver pt30">
      <table class="comm__table bill__table ml60" style="width: 800px">
        <tbody>
          <tr>
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="commp2 fwb">개인정보활용동의 파일 초기화</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6">
              <a v-if="dataObject.infoAgreeFileUId" href="javascript:;" class="d_inblock wid_100 btn_m_size comm__red_btn" download @click="iafClear">초기화</a>
              <p v-else class="commp2">-</p>
            </td>
          </tr>
          <tr>
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="commp2 fwb">개인정보활용동의 APP 동의 처리</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6">
              <a v-if="!dataObject.infoAgreeFileUId && !dataObject.studentAppAgree" href="javascript:;" class="d_inblock wid_100 btn_m_size comm__blue_btn" download @click="studentAppAgreeUpdate">
                APP 동의 처리
              </a>
              <p v-else class="commp2">-</p>
            </td>
          </tr>
          <tr>
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="commp2 fwb">개인정보활용동의 APP 동의 초기화</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6">
              <a v-if="!dataObject.infoAgreeFileUId && dataObject.studentAppAgree" href="javascript:;" class="d_inblock wid_100 btn_m_size comm__red_btn" download @click="studentAppAgreeDelete">
                초기화
              </a>
              <p v-else class="commp2">-</p>
            </td>
          </tr>
          <tr>
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="commp2 fwb">APP 동의 학생 개인정보활용동의 파일 업로드</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6">
              <a
                v-if="!dataObject.infoAgreeFileUId && dataObject.studentAppAgree"
                href="javascript:;"
                class="d_inblock wid_100 btn_m_size comm__blue_btn"
                download
                @click="$store.dispatch('popup/popupOpen', { contents: 'registAgreement', params: { studentId: dataObject.studentId, businessDivision: dataObject.businessDivision } })"
              >
                업로드
              </a>
              <p v-else class="commp2">-</p>
            </td>
          </tr>
          <tr>
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="commp2 fwb">문진표 초기화</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6">
              <a v-if="dataObject.questionnaireId" href="javascript:;" class="d_inblock wid_100 btn_m_size comm__red_btn" download @click="queClear">초기화</a>
              <p v-else class="commp2">-</p>
            </td>
          </tr>
          <tr>
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="commp2 fwb">통보서 임시저장 상태로 변경</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6">
              <a v-if="dataObject.notificationStatus !== 'E' && dataObject.notificationId" href="javascript:;" class="d_inblock wid_100 btn_m_size comm__orange_btn" download @click="notClear(true)">
                변경
              </a>
              <p v-else class="commp2">-</p>
            </td>
          </tr>
          <tr>
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="commp2 fwb">통보서 초기화</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6">
              <a v-if="dataObject.notificationStatus !== 'E' && dataObject.notificationId" href="javascript:;" class="d_inblock wid_100 btn_m_size comm__red_btn" download @click="notClear(false)">
                초기화
              </a>
              <p v-else class="commp2">-</p>
            </td>
          </tr>
          <tr v-if="districtCodeFirst === 'A' && dataObject.businessDivision === 'C'">
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="commp2 fwb">진료계획서 대기중 상태로 변경</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6">
              <a
                v-if="dataObject.notificationStatus !== 'E' && dataObject.treatmentPlanStatus === 'A'"
                href="javascript:;"
                class="d_inblock wid_100 btn_m_size comm__orange_btn"
                download
                @click="ttpClear('Y')"
              >
                변경
              </a>
              <p v-else class="commp2">-</p>
            </td>
          </tr>
          <tr v-if="districtCodeFirst === 'A' && dataObject.businessDivision === 'C'">
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="commp2 fwb">진료계획서 임시저장 상태로 변경</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6">
              <a
                v-if="dataObject.notificationStatus !== 'E' && ['Y', 'A'].includes(dataObject.treatmentPlanStatus)"
                href="javascript:;"
                class="d_inblock wid_100 btn_m_size comm__orange_btn"
                download
                @click="ttpClear('N')"
              >
                변경
              </a>
              <p v-else class="commp2">-</p>
            </td>
          </tr>
          <tr v-if="dataObject.businessDivision === 'C'">
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="commp2 fwb">내역서 초기화</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6">
              <a v-if="dataObject.notificationStatus !== 'E' && dataObject.statementId" href="javascript:;" class="d_inblock wid_100 btn_m_size comm__red_btn" download @click="stmClear">초기화</a>
              <p v-else class="commp2">-</p>
            </td>
          </tr>
          <tr>
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="commp2 fwb">비용청구서 청구중 상태로 변경</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6">
              <a
                v-if="dataObject.notificationStatus !== 'E' && dataObject.billStatus === 'Y'"
                href="javascript:;"
                class="d_inblock wid_100 btn_m_size comm__orange_btn"
                download
                @click="billStatusRollback()"
              >
                변경
              </a>
              <p v-else class="commp2">-</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Admin from '@/apis/Admin';
import popupTitle from '@/components/popup/PopupTitle.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
  },
  props: ['dataObject'],
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode']),
    studentName() {
      return this.dataObject.studentName ? this.dataObject.studentName : this.dataObject.name;
    },
    studentId() {
      return this.dataObject.studentId ? this.dataObject.studentId : this.dataObject.id;
    },
  },
  methods: {
    iafClear() {
      this.$confirm(`${this.studentName} 학생의 개인정보활용동의 파일을 초기화하시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            studentBusinessId: this.dataObject.studentBusinessId,
          };
          Admin.infoAgreeFileDelete(form).then(res => this.apiThen(res));
        })
        .catch(() => {});
    },
    studentAppAgreeUpdate() {
      this.$confirm(`${this.studentName} 학생의 개인정보활용동의 내역을 APP 동의로 바꾸시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            studentId: this.dataObject.studentId,
          };
          Admin.studentAppAgreeUpdate(form).then(res => this.apiThen(res));
        })
        .catch(() => {});
    },
    studentAppAgreeDelete() {
      this.$confirm(`${this.studentName} 학생의 개인정보활용동의 APP 동의 내역을 초기화하시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            studentId: this.dataObject.studentId,
          };
          Admin.studentAppAgreeDelete(form).then(res => this.apiThen(res));
        })
        .catch(() => {});
    },
    queClear() {
      this.$confirm(`${this.studentName} 학생의 문진표를 초기화하시겠습니까?`, '알림', 'question')
        .then(() => {
          Admin.questionnaireDelete({ questionnaireId: this.dataObject.questionnaireId }).then(res => this.apiThen(res));
        })
        .catch(() => {});
    },
    notClear(temporary) {
      let request = '';
      let alertMsg = `${this.studentName} 학생의 통보서를 `;
      if (temporary) {
        // 임시저장 여부 확인
        request = Admin.notificationRollback;
        alertMsg += '임시저장 상태로 변경하시겠습니까?';
      } else {
        request = Admin.notificationDelete;
        alertMsg += '초기화하시겠습니까?';
      }
      if (this.districtCodeFirst === 'A' && this.dataObject.businessDivision === 'C') {
        // 서울시 아동치과주치의
        alertMsg += '<br/>해당 학생의 진료 의뢰서, 진료 계획서, 내역서 및<br/>비용 청구서도 함께 초기화됩니다.';
      } else if (this.districtCodeFirst === 'D' && this.dataObject.businessDivision === 'C') {
        // 부산시 아동치과주치의
        alertMsg += '<br/>해당 학생의 내역서 및 비용 청구서도 함께 초기화됩니다.';
      } else {
        alertMsg += '<br/>해당 학생의 비용 청구서도 함께 초기화됩니다.';
      }
      this.$confirm('', '알림', 'question', { html: alertMsg })
        .then(() => {
          request({ notificationId: this.dataObject.notificationId }).then(res => this.apiThen(res));
        })
        .catch(() => {});
    },
    ttpClear(status) {
      let alertMsg = `${this.studentName} 학생의 진료계획서를 `;

      if (status === 'Y') {
        // 대기중
        alertMsg += '대기중';
      } else if (status === 'N') {
        // 임시저장
        alertMsg += '임시저장';
      }
      alertMsg += ' 상태로 변경하시겠습니까?<br/>해당 학생의 내역서 및 비용 청구서도 함께 초기화됩니다.';

      this.$confirm('', '알림', 'question', { html: alertMsg })
        .then(() => {
          Admin.treatmentPlanStatusUpdate({
            notificationId: this.dataObject.notificationId,
            status: this.valueToCode('C0001', status),
          }).then(res => this.apiThen(res));
        })
        .catch(() => {});
    },
    stmClear() {
      this.$confirm('', '알림', 'question', { html: `${this.studentName} 학생의 내역서를 초기화하시겠습니까?<br/>해당 학생의 비용 청구서도 함께 초기화됩니다.` })
        .then(() => {
          Admin.statementDelete({ notificationId: this.dataObject.notificationId }).then(res => this.apiThen(res));
        })
        .catch(() => {});
    },
    billStatusRollback() {
      this.$confirm(`${this.studentName} 학생의 비용청구서를 처리완료에서 청구중으로 변경하겠습니까?`, '알림', 'question')
        .then(() => {
          Admin.billStatusRollback({
            studentId: this.studentId,
            businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
          }).then(res => this.apiThen(res));
        })
        .catch(() => {});
    },
    apiThen(res) {
      if (res && res.data.rt === 200) {
        this.$alert('처리되었습니다.', '알림', 'success').then(() => {
          this.$store.dispatch('popup/popupClose');
          this.$store.commit('update');
        });
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    },
  },
};
</script>
