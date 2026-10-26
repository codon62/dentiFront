<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">비용 청구서</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>

      <div v-if="districtCodeFirst === 'G'" class="sub__section mt30">
        <div class="titbox row">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_cost.png" /></span>
          <p class="commp2 d_inblock fwb ml5">청구 금액</p>
        </div>
        <bill-table :data="billPrice"></bill-table>
      </div>

      <v-list :title="districtCodeFirst === 'G' ? '비용 청구서' : '학생'" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
        <a v-if="districtCodeFirst !== 'G'" href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid130 commp" @click="billJudge">선택 지급</a>
        <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp ml10" @click="excel()">엑셀 다운로드</a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import School from '@/apis/School';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import List from '@/components/common/List.vue';
import { mapGetters, mapState } from 'vuex';
import bill from '@/components/common/mixin/tableList/bill';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';
import BillTable from '@/components/common/BillTable';

export default {
  mixins: [bill, excelDownload],
  data() {
    return {
      cmp: 'schoolBill',
      billPrice: [[], [], [], [], ['합계', 0, 0, 0]],
      pager: null,
      table: {
        maxNum: 1,
        col: ['*'],
        th: ['c_bill', '번호', '검진 유형', '학년/반/번호', '성명<br/>(생년월일)', '검진 병원', '검진일', '청구일', '청구금액', '처리 상황', '처리'],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['userOrganTargetId', 'business']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin']),
    ...mapGetters('definedCode', ['codeToValueList']),
  },
  components: {
    'v-detailed-search': DetailedSearch,
    'v-list': List,
    BillTable,
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
    if (this.districtCodeFirst === 'G') {
      this.table.th = ['번호', '보건소<br/>(연락처)', '검진 유형', '병원명', '검진비', '청구인원', '청구금액', '은행명<br/>(예금주)', '계좌번호', '비용 청구서'];
    }
    this.getList();
  },
  methods: {
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        schoolId: this.userOrganTargetId,
        page: parseInt(this.$route.query.page || 1),
        size: 10,
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      const request = this.districtCodeFirst === 'G' ? School.billHospitalList : School.billList;
      request(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          if (this.districtCodeFirst === 'G') {
            this.table.maxNum = res.data.billList.length;
          } else {
            this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
            this.pager = res.data.paging;
          }
          this.table.list = this.codeToValueList(res.data.billList);
          const billPrice = res.data.billPrice;

          if (this.districtCodeFirst === 'G') {
            this.billPrice = [[], [], [], [], ['합계']];
            if (this.divJoin('F')) {
              this.billPrice[0].push(this.divName('F', true));
              this.billPrice[1].push(billPrice.studentCountF);
              this.billPrice[2].push(billPrice.claimPriceF);
              this.billPrice[3].push(billPrice.givePriceF);
            }
            if (this.divJoin('E') && this.business && this.business.businessDivisionE === 'Y') {
              this.billPrice[0].push(this.divName('E', true));
              this.billPrice[1].push(billPrice.studentCountE);
              this.billPrice[2].push(billPrice.claimPriceE);
              this.billPrice[3].push(billPrice.givePriceE);
            }
            for (let i = 1; i <= 3; i++) {
              let total = 0;
              for (const item of this.billPrice[i]) {
                total += item;
              }
              this.billPrice[4].push(total);
            }
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
        this.$store.commit('tableLoading', false);
      });
    },
    search(searchData) {
      let query = {};
      for (const i in searchData) {
        if (typeof searchData[i] === 'object') {
          for (const j in searchData[i]) {
            if (searchData[i][j]) {
              query[j] = searchData[i][j];
            } else {
              delete query[j];
            }
          }
        } else {
          if (searchData[i]) {
            query[i] = searchData[i];
          } else {
            delete query[i];
          }
        }
      }
      this.abortController?.abort();
      if (JSON.stringify(query) !== JSON.stringify(this.$route.query)) {
        this.$router.push({ query: query });
      } else {
        this.getList();
      }
    },
  },
};
</script>
