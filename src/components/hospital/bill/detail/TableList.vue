<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ divName(data.businessDivision, true, true) }}</p>
    </td>
    <td>
      <p class="scommp">
        {{ data.studentName }}
        <br />
        ({{ data.studentBirth }})
      </p>
    </td>
    <td><p class="scommp" v-html="data.businessDivision === 'C' || schoolInfo !== '-' ? schoolInfo : '학교밖'"></p></td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.billExamPrice) }}원</p>
    </td>
    <td>
      <p class="scommp">{{ numberWithCommas(data.billCommission) }}원</p>
    </td>
    <td><v-button :message="billMsg" :tooltip="billTooltip"></v-button></td>
    <td>
      <p class="scommp">{{ data.billStatus === 'Y' ? data.billModdate : '-' }}</p>
    </td>
  </tr>
</template>

<script>
import Button from '@/components/common/Button.vue';
import { mapGetters } from 'vuex';

export default {
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
  },
};
</script>
