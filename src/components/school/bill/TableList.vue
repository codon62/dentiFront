<template>
  <tr v-if="districtCodeFirst !== 'G'">
    <td>
      <div v-if="['N', 'RN'].includes(data.status)" class="check_set d_inblock">
        <input :id="`${data.billId}_c_bill`" type="checkbox" name="c_bill" class="blind" @input="checkboxAll($event)" />
        <label :for="`${data.billId}_c_bill`"><span class="icon"></span></label>
      </div>
      <p v-else class="scommp">-</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ divName(data.businessDivision, true, true) }}</p>
    </td>
    <td>
      <p class="scommp">{{ `${data.studentToSchoolGrade1}학년 ${data.studentToSchoolGrade2}반 ${data.studentToSchoolGrade3}번` }}</p>
    </td>
    <td>
      <p class="scommp">
        {{ data.studentName }}
        <br />
        ({{ data.studentBirth }})
      </p>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalName ? data.hospitalName : '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.treatDate }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.notificationLastdate }}</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.claimPrice) }}원</p>
    </td>
    <td><v-button :message="billMsg" :tooltip="billTooltip"></v-button></td>
    <td>
      <v-button v-if="['N', 'RN'].includes(data.status)" message="지급" @vclick="process('Y')" />
      <p v-else class="scommp">-</p>
    </td>
  </tr>
  <tr v-else>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td><p class="scommp" v-html="data.healthCareName + (data.healthCareTel ? `<br/>(${data.healthCareTel})` : '')"></p></td>
    <td>
      <p class="scommp">{{ divName(data.businessDivision, true, true) }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalName ? data.hospitalName : '-' }}</p>
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
      <v-button message="보기" @vclick="viewDetail" />
    </td>
  </tr>
</template>

<script>
import Bill from '@/apis/Bill';
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
    ...mapState('status', ['businessDivision']),
    ...mapGetters('definedCode', ['valueToCode']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName', 'defaultExamPrice']),
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
    billStatusToMsg(status) {
      switch (status) {
        case 'N':
          return '제출완료<br>(청구중)';
        case 'Y':
          return '처리완료';
        case null:
          return '-';
      }
    },
    status() {
      this.billMsg = this.billStatusToMsg(this.data.status);
      this.billTooltip = this.billMsg === '처리완료' ? '실제 지급일과 처리 일자는 다를 수 있습니다.' : '';
    },
    process(status) {
      if (status === 'Y') {
        this.$confirm('해당 비용청구서를 처리완료 처리하시겠습니까?', '알림', 'question')
          .then(() => {
            const form = {
              billIdList: [this.data.billId],
              billStatus: this.valueToCode('C0004', status),
            };
            Bill.judge(form).then(res => {
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
      }
    },
    viewDetail() {
      let form = {
        hospitalId: this.data.hospitalId,
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
      this.$router.push({ path: '/school/bill/detail', query: form });
    },
    printPopup() {
      let form = {
        schoolId: this.userOrganTargetId,
        hospitalId: this.data.hospitalId,
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
