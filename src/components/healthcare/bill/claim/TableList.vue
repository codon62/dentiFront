<template>
  <tr>
    <td v-if="(divJoin('C') || divJoin('F')) && cityType !== 'E' && healthCareType !== 'E'">
      <div v-if="!(districtCodeFirst === 'A' && data.businessDivision === 'E') && data.countBillStatusN > 0" class="check_set d_inblock">
        <input :id="`${data.billMonthId}_c_bill`" type="checkbox" name="c_bill" class="blind" @input="checkboxAll($event)" />
        <label :for="`${data.billMonthId}_c_bill`"><span class="icon"></span></label>
      </div>
      <p v-else class="scommp">-</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ divName(data.businessDivision, true) }}</p>
    </td>
    <td>
      <p class="scommp" v-html="data.districtName + (districtCodeFirst === 'J' && data.healthCareTel ? `<br/>(${data.healthCareTel})` : '')"></p>
    </td>
    <td>
      <p class="scommp" v-html="`${data.hospitalName}${districtCodeFirst === 'C' ? `<br>(${data.hospitalDistrictName})` : ''}`"></p>
    </td>
    <td>
      <p class="scommp">{{ parseInt(data.claimMonth) }}월</p>
    </td>
    <td v-if="districtCodeFirst === 'I'">
      <p class="scommp">{{ numberWithCommas(data.schoolCount) }}개교</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.countBillMonthPersonnel) }}명</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.totalBillPrice) }}원</p>
    </td>
    <td v-if="districtCodeFirst === 'G'">
      <p class="scommp">{{ numberWithCommas(data.totalBillCommission) }}원</p>
    </td>
    <td>
      <p class="scommp">
        {{ data.bankName }}
        <br />
        ({{ data.hospitalDepositor }})
      </p>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalAccount }}</p>
    </td>
    <td>
      <a href="javascript:;" class="mr10" style="vertical-align: bottom" @click="printPopup"><img src="@/assets/images/sub/ic_print_20.png" /></a>
      <BadgeContainer :on="isUncheckedHospital(data.hospitalId)">
        <v-button message="보기" @vclick="viewDetail"></v-button>
      </BadgeContainer>
    </td>
    <td>
      <p class="scommp">{{ data.countBillStatusN ? '청구중(' + data.countBillStatusN + '명)' : '처리완료' }}</p>
    </td>
    <td><button class="checkIcon" :class="data.checkStatus === 'Y' ? 'on' : ''" @click="billMonthCheckToggle"></button></td>
  </tr>
</template>

<script>
import Bill from '@/apis/Bill';
import Button from '@/components/common/Button.vue';
import { mapGetters, mapState } from 'vuex';
import BadgeContainer from '@/components/common/BadgeContainer';

export default {
  components: {
    BadgeContainer,
    'v-button': Button,
  },
  props: ['num', 'data', 'month'],
  computed: {
    ...mapState('user', ['userOrganTargetType', 'cityType', 'healthCareType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName']),
    ...mapGetters('hospitalDocument', ['isUncheckedHospital']),
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
    viewDetail() {
      let form = {
        billMonthId: this.data.billMonthId,
        districtCode: this.data.districtCode,
      };
      if (this.$route.query.districtCode) {
        form.districtCode = this.$route.query.districtCode;
      }
      if (this.$route.query.billStatusN) {
        form.billStatusN = this.$route.query.billStatusN;
      }
      if (this.$route.query.billStatusY) {
        form.billStatusY = this.$route.query.billStatusY;
      }
      if (this.$route.query.studentToSchoolGrade1) {
        form.studentToSchoolGrade1 = this.$route.query.studentToSchoolGrade1;
      }
      if (this.$route.query.studentToSchoolNull) {
        form.studentToSchoolNull = this.$route.query.studentToSchoolNull;
      }
      this.$router.push({ path: '/healthcare/bill/claim/detail', query: form });
    },
    printPopup() {
      let form = {
        billMonthId: this.data.billMonthId,
        districtCode: this.data.districtCode,
      };
      if (this.$route.query.districtCode) {
        form.districtCode = this.$route.query.districtCode;
      }
      if (this.$route.query.billStatusN) {
        form.billStatusN = this.$route.query.billStatusN;
      }
      if (this.$route.query.billStatusY) {
        form.billStatusY = this.$route.query.billStatusY;
      }
      if (this.$route.query.studentToSchoolGrade1) {
        form.studentToSchoolGrade1 = this.$route.query.studentToSchoolGrade1;
      }
      if (this.$route.query.studentToSchoolNull) {
        form.studentToSchoolNull = this.$route.query.studentToSchoolNull;
      }
      this.$store.dispatch('popup/popupOpen', { contents: 'billPrintPopup', params: form });
    },
    billMonthCheckToggle() {
      const form = {
        billMonthId: this.data.billMonthId,
        districtCode: this.data.districtCode,
      };
      Bill.billMonthCheckToggle(form).then(res => {
        if (res && res.data.rt === 200) {
          this.data.checkStatus = this.data.checkStatus !== 'Y' ? 'Y' : 'N';
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>
