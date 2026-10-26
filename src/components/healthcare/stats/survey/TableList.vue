<template>
  <tr>
    <td v-if="data.section" :rowspan="data.sameRow">
      <p class="scommp">{{ data.section }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.surveyName }}</p>
    </td>
    <td>
      <a href="javascript:;" class="comm__green_btn btn_m_size2 d_inblock wid130 commp" @click="surveyDownload()">엑셀 다운로드</a>
    </td>
  </tr>
</template>

<script>
import Excel from '../../../../apis/Excel';
import { mapState } from 'vuex';

export default {
  props: ['data'],
  computed: {
    ...mapState('user', ['districtCode', 'districtName']),
    ...mapState('business', ['businessYear']),
  },
  methods: {
    surveyDownload() {
      let form = { districtCode: this.districtCode };
      this.$store.commit('loading', true);

      const date = new Date();
      const now =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      const xlsxName = `${this.businessYear}년_${this.districtName}_${this.data.surveyName}_${now}.xlsx`;

      Object.assign(form, this.$route.query);
      Excel[this.data.excelType](form).then(async res => {
        if (res.data.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
          this.fileDownload(res.data, xlsxName);
        } else {
          let alertMsg = '알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.';
          if (res.data.type === 'application/json') {
            await res.data.text().then(json => {
              alertMsg += ` 오류 코드 : ${JSON.parse(json).rt}`;
            });
          }
          alert(alertMsg);
        }
        this.$store.commit('loading', false);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.comm__table td {
  border: 1px solid #d9dee8 !important;
}
.comm__table td:before {
  width: 0 !important;
}
</style>
