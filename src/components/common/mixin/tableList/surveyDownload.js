import { mapState } from 'vuex';
import Excel from '@/apis/Excel';

export default {
  computed: {
    ...mapState('user', ['districtCode', 'districtName']),
    ...mapState('business', ['businessYear']),
  },
  methods: {
    survey() {
      const request = Excel.surveyList;
      const fileName = '만족도조사';
      const form = { districtCode: this.districtCode };
      this.$store.commit('loading', true);

      const date = new Date();
      const now =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      let xlsxName = `${this.businessYear}년_${this.districtName}_${fileName}_${now}.xlsx`;

      request(form).then(async res => {
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
