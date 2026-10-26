<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">비용 청구서</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <v-detailed-search :cmp="cmp" divclass="mt15" @search="search"></v-detailed-search>
      <div class="comm__line mt20"></div>

      <div class="sub__section mt30">
        <div class="titbox row">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_cost.png" /></span>
          <p class="commp2 d_inblock fwb ml5">청구 금액</p>
        </div>
        <bill-table :data="billPrice"></bill-table>
      </div>

      <v-list title="비용 청구서" :cmp="cmp" divclass="mt30" :table="table" :pager="pager">
        <!--<a-->
        <!--  v-if="districtCodeFirst === 'A' && business && business.businessDivisionE === 'Y'"-->
        <!--  href="https://kr.object.gov-ncloudstorage.com/denti-i/public/web/seoul/%ED%95%99%EC%83%9D%EA%B5%AC%EA%B0%95%EA%B2%80%EC%A7%84%20%EB%B9%84%EC%9A%A9%EC%B2%AD%EA%B5%AC%EC%84%9C.hwp"-->
        <!--  class="comm__blue_btn btn_m_size2 d_block wid250 commp">-->
        <!--  학생구강검진 비용청구서 서식 다운로드-->
        <!--</a>-->
        <a
          v-if="districtCodeFirst === 'I'"
          href="https://kr.object.gov-ncloudstorage.com/dt2023-common/public/web/jbe/2023 교육지원청 구강진료 업무담당자 현황.pdf"
          class="comm__blue_btn btn_m_size2 d_block wid150 commp ml10"
          target="_blank"
        >
          교육지원청 연락처 목록
        </a>
        <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 commp ml10" @click="excel()">엑셀 다운로드</a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import Hospital from '@/apis/Hospital';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import BillTable from '@/components/common/BillTable.vue';
import List from '@/components/common/List.vue';
import { mapGetters, mapState } from 'vuex';
import excelDownload from '@/components/common/mixin/tableList/excelDownload';

export default {
  mixins: [excelDownload],
  data() {
    return {
      cmp: 'hospitalBill',
      billPrice: [[], [], [], [], ['합계', 0, 0, 0]],
      pager: null,
      table: {
        maxNum: 1,
        col: ['*'],
        th: ['번호', '보건소<br/>(연락처)', '검진 유형', '성명<br/>(생년월일)', '학교<br>(학년/반/번호)', '시설(센터)명', '청구금액', '처리 상황', '처리 일자'],
        list: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['userOrganTargetId', 'business']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName']),
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
    if (!this.divJoin('C')) {
      delete this.table.th[5];
    }
    if (this.districtCodeFirst === 'C') {
      this.table.th[1] = '관할 보건소<br/>(연락처)';
      this.table.th.splice(1, 0, '시군명');
      this.table.th.splice(-1, 1);
    } else if (this.districtCodeFirst === 'D') {
      this.table.th = [
        '번호',
        '보건소<br/>(연락처)',
        '검진 유형',
        '성명<br/>(생년월일)',
        '학교<br>(학년/반/번호)',
        '시설(센터)명',
        '검진금액',
        '심화치료금액',
        '본인부담금',
        '청구금액',
        '처리 상황',
        '처리 일자',
      ];
    } else if (this.districtCodeFirst === 'G') {
      this.table.th = ['번호', '보건소<br/>(연락처)', '검진 유형', '학교명', '검진비', '청구인원', '청구금액', '사업자등록번호', '행정실 이메일', '비용 청구서'];
    } else if (this.districtCodeFirst === 'I') {
      this.table.th = ['번호', '교육지원청<br/>(연락처)', '검진 유형', '성명<br/>(생년월일)', '학교<br>(학년/반/번호)', '청구금액', '청구일', '처리 상황'];
    } else if (this.districtCodeFirst === 'J') {
      this.table.th[1] = '교육지원청<br/>(연락처)';
    }
    this.getList();
  },
  methods: {
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        hospitalId: this.userOrganTargetId,
        page: parseInt(this.$route.query.page || 1),
        size: 10,
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      const request = this.districtCodeFirst === 'G' ? Hospital.hospitalBillSchoolList : Hospital.hospitalBillList;
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

          this.billPrice = [[], [], [], [], ['합계']];
          if (this.divJoin('C')) {
            this.billPrice[0].push(this.divName('C', true));
            this.billPrice[1].push(billPrice.studentCountC);
            this.billPrice[2].push(billPrice.claimPriceC);
            this.billPrice[3].push(billPrice.givePriceC);
          }
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
