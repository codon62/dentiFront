<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td v-if="['C', 'J'].includes(districtCodeFirst)">
      <p class="scommp" v-html="data.districtSiName + (districtCodeFirst === 'J' && data.healthCareTel ? `<br/>(${data.healthCareTel})` : '')"></p>
    </td>
    <td v-if="districtCodeFirst !== 'J'">
      <p class="scommp" v-html="data.healthCareName + (data.healthCareTel ? `<br/>(${data.healthCareTel})` : '')"></p>
    </td>
    <td>
      <p class="scommp">{{ divName(data.businessDivision, true, true) }}</p>
    </td>
    <template v-if="districtCodeFirst === 'G'">
      <td>
        <p class="scommp">{{ data.schoolName }}</p>
      </td>
      <td>
        <p class="scommp">{{ numberWithCommas(defaultExamPrice('E', month)) }}원</p>
      </td>
      <td>
        <p class="scommp">{{ numberWithCommas(data.countBillPersonnel) }}명</p>
      </td>
      <td>
        <p class="scommp">{{ numberWithCommas(data.totalBillPrice) }}원</p>
      </td>
      <td>
        <p class="scommp">{{ data.schoolRegNum ? data.schoolRegNum : '-' }}</p>
      </td>
      <td>
        <p class="scommp">{{ data.schoolEmail ? data.schoolEmail : '-' }}</p>
      </td>
      <td>
        <a href="javascript:;" class="mr10" style="vertical-align: bottom" @click="printPopup"><img src="@/assets/images/sub/ic_print_20.png" /></a>
        <v-button message="보기" @vclick="viewDetail" />
      </td>
    </template>
    <template v-else>
      <td>
        <p class="scommp">
          {{ data.studentName }}
          <br />
          ({{ data.studentBirth }})
        </p>
      </td>
      <td><p class="scommp" v-html="data.businessDivision !== 'C' ? schoolInfo : '-'"></p></td>
      <td v-if="divJoin('C')">
        <p class="scommp">{{ data.businessDivision === 'C' ? data.centerName : '-' }}</p>
      </td>
      <td v-if="districtCodeFirst === 'D'">
        <p class="scommp">{{ numberWithCommas(data.examPrice) }}원</p>
      </td>
      <td v-if="districtCodeFirst === 'D'">
        <p class="scommp">{{ numberWithCommas(data.treatPrice + data.copayPrice) }}원</p>
      </td>
      <td v-if="districtCodeFirst === 'D'">
        <p class="scommp">{{ numberWithCommas(data.copayPrice) }}원</p>
      </td>
      <td>
        <p class="scommp">{{ numberWithCommas(data.claimPrice) }}원</p>
      </td>
      <td v-if="districtCodeFirst === 'I'">
        <p class="scommp">{{ data.notificationLastdate }}</p>
      </td>
      <td><v-button :message="billMsg" :tooltip="billTooltip"></v-button></td>
      <td v-if="!['C', 'I'].includes(districtCodeFirst)">
        <p class="scommp">{{ data.billStatus === 'Y' ? data.billModdate : '-' }}</p>
      </td>
    </template>
  </tr>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-button': Button,
  },
  props: ['num', 'data', 'month'],
  data() {
    return {
      billMsg: '',
      billTooltip: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName', 'defaultExamPrice']),
    schoolInfo() {
      let html = this.data.schoolName;
      if (this.data.studentToSchoolGrade1) {
        html += `<br/>(${this.data.studentToSchoolGrade1}/${this.data.studentToSchoolGrade2}/${this.data.studentToSchoolGrade3})`;
      }
      return html;
    },
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
    status() {
      this.billMsg = this.billStatusToMsg(this.data.billStatus);
      this.billTooltip = this.billMsg === '처리완료' ? '실제 지급일과 처리 일자는 다를 수 있습니다.' : '';
    },
    billStatusToMsg(status) {
      switch (status) {
        case 'N':
          return '제출완료<br>(청구중)';
        case 'Y':
          return '처리완료';
        case 'R':
          return '반려됨';
        case 'RN':
          return '제출완료<br>(재청구중)';
        case null:
          return '-';
      }
    },
    viewDetail() {
      let form = {
        schoolId: this.data.schoolId,
        businessDivision: 'E',
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
      this.$router.push({ path: '/hospital/bill/detail', query: form });
    },
    printPopup() {
      let form = {
        hospitalId: this.userOrganTargetId,
        schoolId: this.data.schoolId,
        businessDivision: 'E',
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
  },
};
</script>
