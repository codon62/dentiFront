<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">비용 청구서</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <div class="sub__section mt30">
        <div class="titbox row">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_cost.png" /></span>
          <p class="commp2 d_inblock fwb ml5">청구기관</p>
        </div>
        <div class="section_con">
          <hrznt-table :data="billOrgan"></hrznt-table>
        </div>
      </div>

      <div class="comm__line mt20"></div>
      <div class="sub__section mt30">
        <div class="titbox row">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_cost.png" /></span>
          <p class="commp2 d_inblock fwb ml5">청구 금액</p>
        </div>
        <title-and-table :data="billPrice"></title-and-table>
      </div>

      <div class="comm__line mt20"></div>
      <v-list title="학생" :cmp="cmp" divclass="mt30" :table="table">
        <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid130 commp" @click="billJudge">선택 지급</a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import HrzntTable from '@/components/common/HrzntTable.vue';
import TitleAndTable from '@/components/common/TitleAndTable.vue';
import List from '@/components/common/List.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import bill from '@/components/common/mixin/tableList/bill';
import Bill from '@/apis/Bill';

export default {
  mixins: [bill],
  data() {
    return {
      cmp: 'schoolBillDetail',
      month: null,
      billOrgan: [],
      billPrice: [],
      table: {
        maxNum: 1,
        col: ['*'],
        th: ['c_bill', '번호', '검진 유형', '학년/반/번호', '성명<br/>(생년월일)', '검진 병원', '검진일', '청구일', '청구금액', '처리 상황', '처리'],
        list: [],
      },
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode', 'userOrganTargetId']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode', 'codeToValueList']),
  },
  components: {
    'v-list': List,
    HrzntTable,
    TitleAndTable,
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        districtCode: this.districtCode,
        schoolId: this.userOrganTargetId,
        hospitalId: this.$route.query.hospitalId,
        businessDivision: this.valueToCode('C0003', this.$route.query.businessDivision),
        billStatusN: this.$route.query.billStatusN,
        billStatusY: this.$route.query.billStatusY,
        studentToSchoolGrade1: this.$route.query.studentToSchoolGrade1,
        studentToSchoolNull: this.$route.query.studentToSchoolNull,
      };
      Bill.claimInfoList(form).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.billInfo.businessDivision = this.codeToValue(res.data.billInfo.businessDivision);
          res.data.billInfo.hospitalType = this.codeToValue(res.data.billInfo.hospitalType);
          // code convert end
          this.table.maxNum = res.data.billList.length;
          this.table.list = this.codeToValueList(res.data.billList);
          if (!this.table.list.length) {
            this.$router.go(-1); // 검색 > 청구중 필터 걸린 상태에서 지급완료하여 list 개수 없는 경우 대응
          }
          const data = res.data.billInfo;
          const claimInfo = data.claimInfo;
          this.month = parseInt(data.claimMonth);
          this.billOrgan = [
            [
              ['보건소', data.districtGunguName],
              ['병원명', data.hospitalName],
            ],
            [
              ['병원 전화번호', data.hospitalTel],
              ['사업자등록번호', data.hospitalRegNum],
            ],
            [
              ['소재지', data.hospitalAddress],
              ['지급계좌', data.bankName + '/' + data.hospitalAccount + '/' + data.hospitalDepositor],
            ],
          ];
          if (this.districtCodeFirst === 'C') {
            this.billOrgan[0][0] = ['시군명', data.districtSiName];
          }
          const title = this.divName(data.businessDivision, true);
          this.billPrice = {
            title: title,
            th: [title + ' 청구금액(A)', '실시 인원(B)', '청구금액(원) (AxB)'],
            td: claimInfo.claimList.map(item => [
              [item.billPrice, 'won'],
              [item.countPersonnel + '명', 'person'],
              [item.totalPrice, 'won'],
            ]),
          };
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
        this.$store.commit('tableLoading', false);
      });
    },
  },
  watch: {
    '$route.query'() {
      this.getList();
    },
    update() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>
