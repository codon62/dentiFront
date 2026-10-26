<template>
  <div class="popup_content">
    <v-popuptitle message="병원 목록" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <div class="row flex_set">
        <div class="flex_item flex_size_m">
          <p class="commp fwb">{{ districtCodeFirst === 'C' ? '시군명' : ['I', 'J'].includes(districtCodeFirst) ? '교육지원청' : '보건소' }} 검색</p>
          <div class="m__putbox mt10">
            <select v-model="healthCareCode" class="comm_select">
              <option value="">전체</option>
              <option v-for="item in healthCareList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
            </select>
          </div>
        </div>
        <div class="flex_item flex_size_m6 ml10">
          <p class="commp fwb">병원 검색</p>
          <div class="m__putbox mt10"><input v-model="hospitalName" type="text" class="comm_put" placeholder="병원명을 입력해 주세요" @keyup.enter="hospitalBusinessList(1)" /></div>
        </div>
        <div class="flex_item ml10">
          <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid110" @click="hospitalBusinessList(1)">
            <img src="@/assets/images/common/ic_search.png" />
            검색
          </a>
        </div>
        <div class="flex_item ml10">
          <a href="javascript:;" class="comm__green_btn btn_m_size2 d_block wid130 ml30" @click="excel()">엑셀다운로드</a>
        </div>
      </div>
      <div class="board__box mt30">
        <v-table :data="table" cmp="schoolHospitalList"></v-table>
        <v-pager :data="pager" :popup="true" @vclick="hospitalBusinessList"></v-pager>
      </div>
    </div>
  </div>
</template>

<script>
import Common from '@/apis/Common';
import School from '@/apis/School';
import Excel from '@/apis/Excel';
import popupTitle from '@/components/popup/PopupTitle.vue';
import table from '@/components/common/Table.vue';
import Pager from '@/components/common/Pager.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['dataObject'],
  data() {
    return {
      pager: {},
      table: {
        maxNum: 1,
        col: ['8%', '13%', '13%', '20%', '12%', '*'],
        th: ['번호', '보건소', '검진 유형', '병원명', '전화번호', '주소'],
        list: [],
      },
      healthCareCode: '',
      hospitalName: '',
      healthCareList: [],
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'districtName']),
    ...mapState('status', ['districtCodeFirstToName', 'businessDivision']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-table': table,
    'v-pager': Pager,
  },
  created() {
    if (this.districtCodeFirst === 'C') {
      this.table.th[1] = '시군명';
    } else if (['I', 'J'].includes(this.districtCodeFirst)) {
      this.table.th[1] = '교육지원청';
    }
    Common.healthCareList({ districtCode: this.districtCodeFirst }).then(res => {
      if (res && res.data.rt === 200) {
        this.healthCareList = res.data.healthCareList;
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
    this.hospitalBusinessList(1);
  },
  methods: {
    hospitalBusinessList(page) {
      let form = {
        businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
        size: 10,
        page: page,
        hospitalName: this.hospitalName,
      };
      if (this.healthCareCode !== '') {
        form.healthCareCode = this.healthCareCode;
      }
      School.hospitalBusinessList(form).then(res => {
        if (res && res.data.rt === 200) {
          this.table.maxNum = res.data.paging.totalElements - form.size * (res.data.paging.number - 1);
          this.table.list = res.data.hospitalList;
          this.pager = res.data.paging;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    excel(payload) {
      let form = {
        businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
        healthCareCode: this.healthCareCode,
        hospitalName: this.hospitalName,
      };
      const divName = this.divName(this.dataObject.businessDivision, false);
      const request = Excel.schoolHospitalList;
      const fileName = `${this.districtCodeFirstToName[this.districtCodeFirst]}_${divName}`;
      if (payload) {
        Object.assign(form, payload);
      }
      this.$store.commit('loading', true);

      const date = new Date();
      const now =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);
      request(form).then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${date.getFullYear()}년_${fileName}_${now}.xlsx`);
        document.body.appendChild(link);
        link.click();
        this.$store.commit('loading', false);
      });
    },
  },
};
</script>
