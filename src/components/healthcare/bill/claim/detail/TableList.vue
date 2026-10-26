<template>
  <tr>
    <td v-if="!(!divJoin('S') && data.businessDivision === 'E')">
      <div v-if="['N', 'RN'].includes(data.billStatus)" class="check_set d_inblock">
        <input :id="`${data.billId}_c_bill`" type="checkbox" name="c_bill" class="blind" @input="checkboxAll($event)" />
        <label :for="`${data.billId}_c_bill`"><span class="icon"></span></label>
      </div>
      <p v-else class="scommp">-</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td v-if="data.businessDivision === 'C'">
      <p class="scommp">{{ data.centerName }}</p>
    </td>
    <td>
      <p class="scommp">
        {{ data.studentName }}
        <template v-if="!(districtCodeFirst === 'J' && adminOrganType !== 'AD')">
          <br />
          ({{ data.studentBirth }})
        </template>
      </p>
    </td>
    <td v-if="data.businessDivision !== 'C'">
      <p class="scommp" v-html="data.studentToSchoolGrade1 ? `${data.schoolName}<br>(${data.studentToSchoolGrade1}/${data.studentToSchoolGrade2}/${data.studentToSchoolGrade3})` : '학교밖'"></p>
    </td>
    <td v-if="!(districtCodeFirst === 'J' && adminOrganType !== 'AD')">
      <v-button :message="iafMsg" :tooltip="iafTooltip" @vclick="agreement"></v-button>
    </td>
    <td v-if="!(districtCodeFirst === 'J' && adminOrganType !== 'AD')">
      <v-button :message="data.questionnaireId ? '보기' : '-'" @vclick="questionnaire"></v-button>
    </td>
    <td v-if="!(districtCodeFirst === 'J' && adminOrganType !== 'AD')">
      <v-button :message="data.notificationId ? '보기' : '-'" @vclick="notification"></v-button>
    </td>
    <td v-if="data.businessDivision === 'C' && districtCodeFirst === 'A'">
      <v-button :message="data.treatmentRequestId ? '보기' : '-'" @vclick="treatmentRequest"></v-button>
    </td>
    <td v-if="data.businessDivision === 'C' && districtCodeFirst === 'A'">
      <v-button :message="data.treatmentPlanId ? '보기' : '-'" @vclick="treatmentPlan"></v-button>
    </td>
    <td v-if="data.businessDivision === 'C'">
      <v-button :message="data.statementId ? '보기' : '-'" @vclick="statement"></v-button>
    </td>
    <td v-if="data.businessDivision === 'C'">
      <p class="scommp">{{ numberWithCommas(data.billExamPrice) }}원</p>
    </td>
    <td v-if="data.businessDivision === 'C'">
      <p class="scommp">{{ numberWithCommas(data.billTreatPrice) }}원</p>
    </td>
    <td v-if="data.businessDivision === 'C' && districtCodeFirst === 'D'">
      <p class="scommp">{{ numberWithCommas(data.billCopayPrice) }}원</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.totalClaimPrice) }}원</p>
    </td>
    <td v-if="districtCodeFirst === 'G'">
      <p class="scommp">{{ numberWithCommas(data.billCommission) }}원</p>
    </td>
    <td>
      <p class="scommp">{{ data.notificationLastdate }}</p>
    </td>
    <td>
      <v-button :message="billMsg" :tooltip="billTooltip"></v-button>
    </td>
    <td>
      <v-button message="보기" @vclick="studentLogPopup"></v-button>
    </td>
    <td v-if="!(!divJoin('S') && data.businessDivision === 'E')">
      <template v-if="['N', 'RN'].includes(data.billStatus)">
        <v-button message="지급" @vclick="process('Y')" />
        <v-button message="반려" @vclick="process('R')" />
      </template>
      <v-button v-else-if="districtCodeFirst === 'C' && data.billStatus === 'Y'" message="지급취소" @vclick="process('N')" />
      <p v-else class="scommp">-</p>
    </td>
    <td>
      <button class="checkIcon" :class="data.checkStatus === 'Y' ? 'on' : ''" @click="billCheckToggle"></button>
    </td>
    <td v-if="data.businessDivision === 'C' && districtCodeFirst === 'A'">
      <v-button :message="data.infoAgreeFileUId ? '초기화' : '-'" @vclick="agreementReset"></v-button>
    </td>
  </tr>
</template>

<script>
import Bill from '@/apis/Bill';
import Business from '@/apis/Business';
import Button from '@/components/common/Button.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-button': Button,
  },
  props: ['num', 'data'],
  data() {
    return {
      iafMsg: '',
      iafTooltip: '',
      billMsg: '',
      billTooltip: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'adminOrganType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'endBusiness']),
  },
  watch: {
    data() {
      this.status();
    },
  },
  created() {
    this.status();
  },
  methods: {
    checkboxAll(e) {
      const checkbox = document.getElementsByName(e.target.name);
      const checkAll = document.getElementById(e.target.name + '_all');
      for (const item of checkbox) {
        if (!item.checked) {
          checkAll.checked = false;
          return false;
        }
      }
      checkAll.checked = true;
    },
    status() {
      this.iafMsg = this.data.infoAgreeFileUId
        ? '보기'
        : this.data.studentAppAgree
        ? this.districtCodeFirst === 'A' && this.data.businessDivision === 'C' && (this.adminOrganType === 'AD' || !this.endBusiness('treatment'))
          ? 'APP 동의 버튼'
          : 'APP 동의'
        : '등록';
      this.iafTooltip = this.districtCodeFirst === 'A' && this.data.businessDivision === 'E' && this.iafMsg === '등록' ? '학생구강검진의 개인정보동의서 등록은 필수 사항이 아닙니다.' : '';
      if (this.adminOrganType !== 'AD' && this.iafMsg === '등록' && this.endBusiness('treatment')) {
        this.iafMsg = '등록불가';
        this.iafTooltip = '동의서 등록이 마감되었습니다.';
      }
      this.billMsg = this.billStatusToMsg(this.data.billStatus);
      this.billTooltip = this.billMsg === '처리완료' ? '실제 지급일과 처리 일자는 다를 수 있습니다.' : '';
    },
    billStatusToMsg(status) {
      switch (status) {
        case 'N':
          return '제출완료<br>(청구중)';
        case 'Y':
          return '처리완료';
        case 'RN':
          return '제출완료<br>(재청구중)';
        case null:
          return '-';
      }
    },
    agreement() {
      if (this.iafMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewAgreement',
          params: { studentId: this.data.studentId, studentName: this.data.studentName, businessDivision: this.data.businessDivision },
        });
      } else {
        this.$store.dispatch('popup/popupOpen', {
          contents: this.districtCodeFirst === 'F' ? 'checkAgreement' : 'registAgreement',
          params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision },
        });
      }
    },
    agreementReset() {
      this.$confirm(`${this.data.studentName} ${this.data.businessDivision === 'C' ? '아동' : '학생'}의 개인정보활용동의 내역을 초기화하시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            studentBusinessId: this.data.studentBusinessId,
          };
          Business.infoAgreeFileDelete(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('처리되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
              });
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
    questionnaire() {
      this.$store.dispatch('popup/popupOpen', { contents: 'viewQuestionnaire', params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision } });
    },
    notification() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewNotification',
        params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision, notificationYear: this.data.notificationYear },
      });
    },
    treatmentRequest() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewTreatmentRequest',
        params: { hospitalId: this.data.treatmentHospitalId, studentId: this.data.studentId, notificationId: this.data.notificationId },
      });
    },
    treatmentPlan() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewTreatmentPlan',
        params: { hospitalId: this.data.treatmentHospitalId || this.data.hospitalId, studentId: this.data.studentId, notificationId: this.data.notificationId },
      });
    },
    statement() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewStatement',
        params: { studentId: this.data.studentId, notificationId: this.data.notificationId, statementYear: this.data.statementYear },
      });
    },
    process(status) {
      if (this.adminOrganType !== 'AD' && this.endBusiness('bill')) {
        this.$alert('비용청구서 처리가 마감되었습니다.', '알림', 'warning');
        return false;
      }
      this.data.status = status;
      this.$store.dispatch('popup/popupOpen', { contents: 'billProcessPopup', params: this.data });
    },
    billCheckToggle() {
      const form = {
        billId: this.data.billId,
      };
      Bill.billCheckToggle(form).then(res => {
        if (res && res.data.rt === 200) {
          this.data.checkStatus = this.data.checkStatus !== 'Y' ? 'Y' : 'N';
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    studentLogPopup() {
      this.$store.dispatch('popup/popupOpen', { contents: 'studentLogPopup', params: this.data });
    },
  },
};
</script>
