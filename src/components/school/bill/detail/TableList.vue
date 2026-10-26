<template>
  <tr>
    <td>
      <div v-if="['N', 'RN'].includes(data.billStatus)" class="check_set d_inblock">
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
      <v-button v-if="['N', 'RN'].includes(data.billStatus)" message="지급" @vclick="process('Y')" />
      <p v-else class="scommp">-</p>
    </td>
  </tr>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { mapGetters } from 'vuex';
import Bill from '@/apis/Bill';
import bill from '@/components/common/mixin/tableList/bill';

export default {
  mixins: [bill],
  components: {
    'v-button': Button,
  },
  props: ['num', 'data'],
  data() {
    return {
      billMsg: '',
      billTooltip: '',
    };
  },
  computed: {
    ...mapGetters('business', ['divName']),
    schoolInfo() {
      if (this.data.businessDivision !== 'C') {
        let html = this.data.schoolName;
        if (this.data.studentToSchoolGrade1) {
          html += `<br/>(${this.data.studentToSchoolGrade1}/${this.data.studentToSchoolGrade2}/${this.data.studentToSchoolGrade3})`;
        }
        return html;
      } else {
        return '-';
      }
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
  },
};
</script>
