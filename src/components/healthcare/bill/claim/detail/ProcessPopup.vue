<template>
  <div class="popup_content">
    <v-popuptitle :message="config[dataObject.status].title" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <hrznt-table :data="info"></hrznt-table>
      <div v-if="billRejectFormTypeRequired && !dataObject.treatmentHospitalId" class="row flex_set mt20 flex_base ml20">
        <div class="flex_item">
          <p class="commp5 c_black2 fwb">
            반려 처리할 서식을 선택해주세요.
            <span class="c_red">*</span>
          </p>
          <p class="c_red commp fwb mt5">※ 선택한 서식은 반려가 되면 임시저장으로 상태가 변경되어 병원에서 수정이 가능합니다.</p>
          <div class="comm_radio m__putbox mt10">
            <div class="radio_box d_inblock hei100">
              <input id="formTypeN" type="radio" value="N" name="formType" class="blind" @change="billRejectFormType = $event.target.value" />
              <label for="formTypeN">
                <span class="icon"></span>
                <span class="label_t">통보서 + 내역서</span>
              </label>
            </div>
            <div class="radio_box d_inblock hei100 ml10">
              <input id="formTypeS" type="radio" value="S" name="formType" class="blind" @change="billRejectFormType = $event.target.value" />
              <label for="formTypeS">
                <span class="icon"></span>
                <span class="label_t">내역서</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div v-if="dataObject.status !== 'Y'" class="textbox" :class="{ mt20: !(billRejectFormTypeRequired && !dataObject.treatmentHospitalId) }">
        <textarea v-model="reason" cols="30" rows="10" class="comm__textarea" placeholder="사유를 작성해 주세요." style="height: 100px; width: 96%; margin-left: 2%"></textarea>
      </div>
      <p class="mt20 tac c_red scommp">※ 해당 비용청구서를 {{ config[dataObject.status].comment }}</p>
      <div class="tac mt10">
        <a href="javascript:;" :class="config[dataObject.status].class" class="d_inblock scommp btn_s_size pd__0_10" @click="process">{{ config[dataObject.status].title }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import Bill from '@/apis/Bill';
import popupTitle from '@/components/popup/PopupTitle.vue';
import HrzntTable from '@/components/common/HrzntTable.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
    HrzntTable,
  },
  props: ['dataObject'],
  computed: {
    ...mapState('status', ['bill']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode']),
    billRejectFormTypeRequired() {
      return this.districtCodeFirst === 'A' && this.dataObject.businessDivision === 'C' && this.dataObject.statementId && this.dataObject.status === 'R';
    },
  },
  data() {
    return {
      info: [],
      reason: '',
      billRejectFormType: '',
      config: {
        Y: {
          title: '처리완료 처리',
          comment: '처리완료 처리하시겠습니까?',
          class: 'comm__blue_btn',
        },
        R: {
          title: '반려 처리',
          comment: '반려 처리하시겠습니까?',
          class: 'comm__red_btn',
        },
        N: {
          title: '지급취소 처리',
          comment: '지급취소 처리하시겠습니까?',
          class: 'comm__navy_btn',
        },
      },
    };
  },
  created() {
    this.info = [
      [
        ['성명', this.dataObject.studentName],
        ['소속', this.dataObject.centerName],
      ],
      [
        ['청구금액', this.dataObject.totalClaimPrice, 'won'],
        ['처리 상황', this.bill.value[this.dataObject.billStatus]],
      ],
    ];
    if (this.dataObject.businessDivision !== 'C') {
      this.info[0][1] = [
        '학교(학년/반/번호)',
        this.dataObject.schoolName +
          (this.dataObject.studentToSchoolGrade1 ? `<br>(${this.dataObject.studentToSchoolGrade1}/${this.dataObject.studentToSchoolGrade2}/${this.dataObject.studentToSchoolGrade3})` : ''),
      ];
    }
    if (this.billRejectFormTypeRequired && this.dataObject.treatmentHospitalId) {
      this.billRejectFormType = 'S';
    }
  },
  methods: {
    process() {
      if (this.billRejectFormTypeRequired && !this.billRejectFormType) {
        this.$alert('반려 처리할 서식을 선택해 주세요.', '알림', 'warning');
        return false;
      }
      if (this.dataObject.status !== 'Y') {
        if (!this.reason) {
          this.$alert('사유를 작성해 주세요.', '알림', 'warning');
          return false;
        }
      }
      this.$store.commit('loading', true);
      let request;
      let form = {};
      if (this.dataObject.status !== 'N') {
        request = Bill.judge;
        form.billIdList = [this.dataObject.billId];
        form.billStatus = this.valueToCode('C0004', this.dataObject.status);
        if (this.dataObject.status === 'R') {
          form.billRejectReason = this.reason;
        }
        if (this.billRejectFormType) {
          form.billRejectFormType = this.valueToCode('C0010', this.billRejectFormType);
        }
      } else {
        request = Bill.billStatusRollback;
        form.billId = this.dataObject.billId;
        form.billRollbackReason = this.reason;
      }
      request(form).then(res => {
        this.$store.commit('loading', false);
        if (res && res.data.rt === 200) {
          this.$alert('처리되었습니다.', '알림', 'success').then(() => {
            this.$store.dispatch('popup/popupClose');
            if (this.dataObject.status === 'R') {
              switch (this.dataObject.businessDivision) {
                case 'C':
                  this.$router.push('/healthcare/bill/reject');
                  break;
                case 'F1':
                  this.$router.push('/healthcare/bill/reject/famdoc/first');
                  break;
                default:
                  this.$router.push('/healthcare/bill/reject/famdoc');
                  break;
              }
            } else {
              this.$store.commit('update');
            }
          });
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.pd__0_10 {
  padding: 0 10px;
}
</style>
