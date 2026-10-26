<template>
  <div class="popup_content">
    <v-popuptitle message="진료 수가" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner">
      <div class="row mb10">
        <div v-if="userOrganTargetType === 'CT'" class="inner--left">
          <div class="m__putbox wid180">
            <select v-model="formDistrictCode" class="comm_select">
              <option :value="districtCode">보건소 전체</option>
              <option v-for="item in healthCareList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
            </select>
          </div>
        </div>
        <div v-if="userOrganTargetType === 'HC'" class="inner--right">
          <a href="javascript:;" class="comm__red_btn btn_m_size2 d_block wid130 commp inner--right" @click="popupOpen({ contents: 'treatmentChargeRegist' })">진료 수가 등록</a>
        </div>
      </div>
      <v-table :data="table" cmp="treatmentChargeList"></v-table>
      <v-pager :data="pager" :popup="true" @vclick="treatmentChargeList"></v-pager>
    </div>
  </div>
</template>

<script>
import Common from '@/apis/Common';
import Business from '@/apis/Business';
import popupTitle from '@/components/popup/PopupTitle.vue';
import table from '@/components/common/Table.vue';
import Pager from '@/components/common/Pager.vue';
import { mapActions, mapState } from 'vuex';

export default {
  props: ['dataObject'],
  data() {
    return {
      pager: {},
      table: {
        maxNum: 1,
        col: ['40px', '80px', '*', '125px', '200px'],
        th: ['번호', '보건소', '진료 항목', '진료 금액', '비고'],
        list: [],
      },
      healthCareList: [],
      formDistrictCode: '',
    };
  },
  computed: {
    ...mapState(['update2']),
    ...mapState('user', ['userOrganTargetType', 'districtCode']),
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-table': table,
    'v-pager': Pager,
  },
  created() {
    if (this.userOrganTargetType === 'CT') {
      Common.healthCareList({ districtCode: this.districtCode }).then(res => {
        if (res && res.data.rt === 200) {
          this.healthCareList = res.data.healthCareList;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
    if (this.userOrganTargetType === 'HC') {
      this.table.col.push('140px');
      this.table.th.push('관리');
    }
    this.formDistrictCode = this.districtCode;
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    treatmentChargeList(page) {
      const form = {
        districtCode: this.formDistrictCode,
        size: 10,
        page: page,
      };
      Business.treatmentChargeList(form).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = res.data.chargeList;
          this.pager = res.data.paging;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
  watch: {
    update2() {
      this.treatmentChargeList(1);
    },
    formDistrictCode() {
      this.treatmentChargeList(1);
    },
  },
};
</script>
