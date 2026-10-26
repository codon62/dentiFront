import Bill from '@/apis/Bill';
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState('user', ['adminOrganType']),
    ...mapGetters('business', ['endBusiness']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  methods: {
    billJudge() {
      if (this.adminOrganType !== 'AD' && this.endBusiness('bill')) {
        this.$alert('비용청구서 처리가 마감되었습니다.', '알림', 'warning');
        return false;
      }
      const checkbox = document.getElementsByName('c_bill');
      let billIdList = [];
      for (const item of checkbox) {
        if (item.checked) {
          billIdList.push(item.id.split('_')[0]);
        }
      }
      if (!billIdList.length) {
        this.$alert('지급할 비용청구서를 선택해 주세요.', '알림', 'warning');
        return false;
      }
      this.$confirm('선택하신 비용청구서를 지급하시겠습니까?', '알림', 'question')
        .then(() => {
          this.$store.commit('loading', true);
          const form = {
            billIdList: billIdList,
            billStatus: this.valueToCode('C0004', 'Y'),
          };
          Bill.judge(form).then(res => {
            this.$store.commit('loading', false);
            if (res && res.data.rt === 200) {
              this.$alert('처리 완료되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
                document.getElementById('c_bill_all').checked = false;
                for (const item of checkbox) {
                  item.checked = false;
                }
              });
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
  },
};
