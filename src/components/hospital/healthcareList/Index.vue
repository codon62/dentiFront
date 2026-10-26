<template>
  <div class="popup_content">
    <v-popuptitle message="시군별 연락처 안내" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <div class="row flex_set">
        <div class="flex_item flex_size_m">
          <p class="commp fwb">{{ districtCodeFirst === 'C' ? '시군' : '보건소' }} 검색</p>
          <div class="m__putbox mt10">
            <select v-model="healthCareCode" class="comm_select">
              <option value="">전체</option>
              <option v-for="item in firstHealthCareList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
            </select>
          </div>
        </div>
        <div class="flex_item ml10">
          <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid110" @click="getHealthCareList(1)">
            <img src="@/assets/images/common/ic_search.png" />
            검색
          </a>
        </div>
      </div>
      <div class="board__box mt30">
        <v-table :data="table" cmp="hospitalHealthcareList"></v-table>
        <v-pager :data="pager" :popup="true" @vclick="getHealthCareList"></v-pager>
      </div>
    </div>
  </div>
</template>

<script>
import Common from '@/apis/Common';
import popupTitle from '@/components/popup/PopupTitle.vue';
import table from '@/components/common/Table.vue';
import Pager from '@/components/common/Pager.vue';
import { mapGetters } from 'vuex';

export default {
  props: ['dataObject'],
  data() {
    return {
      pager: {},
      table: {
        maxNum: 1,
        col: ['8%', '13%', '13%', '20%'],
        th: ['번호', '시군명', '지역구명', '전화번호'],
        list: [],
      },
      healthCareCode: '',
      hospitalName: '',
      healthCareList: [],
      firstHealthCareList: [],
      fullHealthCareList: [],
    };
  },
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-table': table,
    'v-pager': Pager,
  },
  async created() {
    await Common.healthCareList({ districtCode: this.districtCodeFirst }).then(res => {
      if (res && res.data.rt === 200) {
        this.firstHealthCareList = res.data.healthCareList;
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
    await Common.healthCareSecondList({ districtCode: this.districtCodeFirst }).then(res => {
      if (res && res.data.rt === 200) {
        this.fullHealthCareList = this.firstHealthCareList.reduce((list, hel) => {
          const secondHealthCareList = res.data.healthCareList.filter(secondHel => secondHel.districtCode.startsWith(hel.districtCode));
          if (hel.healthCareTel || !secondHealthCareList.length) {
            list.push(hel);
          }
          list.push(
            ...secondHealthCareList.map(secondHel => {
              secondHel.secondHealthCareName = secondHel.healthCareName;
              secondHel.healthCareName = hel.healthCareName;
              return secondHel;
            }),
          );
          return list;
        }, []);
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
    this.getHealthCareList(1);
  },
  methods: {
    getHealthCareList(page) {
      this.healthCareList = this.fullHealthCareList.filter(hel => hel.districtCode.startsWith(this.healthCareCode));
      const size = 10;
      const startIndex = size * (page - 1);
      const paging = {
        number: page,
        totalPages: this.healthCareList.length ? parseInt((this.healthCareList.length - 1) / size) + 1 : 1,
        totalElements: this.healthCareList.length,
      };
      this.table.maxNum = paging.totalElements - startIndex;
      this.table.list = this.healthCareList.filter((hel, index) => index >= startIndex && index < startIndex + size);
      this.pager = paging;
    },
  },
};
</script>
