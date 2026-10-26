<template>
  <fragment>
    <div class="flex_container">
      <v-district v-if="userOrganTargetType === 'CT'" v-model="form.district" :clear="clear" :code="true" @input="updateData"></v-district>
      <v-select v-else-if="secondHelList.length" v-model="form.districtCode" title="지역구" message="전체" size="wid180" :option-data="secondHelList" @input="updateData"></v-select>
      <v-input v-model="form.hospitalName" title="병원 검색" placeholder="병원명" @input="updateData" @enter="enter"></v-input>
      <v-input v-model="form.hospitalCeo" title="대표치과의사 성명" placeholder="대표치과의사 성명" @input="updateData" @enter="enter"></v-input>
      <v-input v-if="isTemporaryId" v-model="form.hospitalLicense" title="대표치과의사 면허번호" placeholder="대표치과의사 면허번호" @input="updateData" @enter="enter"></v-input>
      <check-toggle class="ml10" v-if="districtCodeFirst === 'C'" v-model="form.hospitalTreatDisabledPerson" status="hospitalTreatDisabledPerson" @input="updateData"></check-toggle>
    </div>
    <div class="flex_wrap_gap_container mt20">
      <v-input class="ml0mr15" v-if="districtCodeFirst !== 'B'" v-model="form.hospitalRegNum" title="사업자등록번호" placeholder="사업자등록번호" @input="updateData" @enter="enter"></v-input>
      <v-input class="ml0mr15" v-model="form.hospitalMedicalNum" title="요양기관번호" placeholder="요양기관번호" @input="updateData" @enter="enter"></v-input>
      <check-toggle
        v-if="districtCodeFirst === 'A' && cityType !== 'E' && healthCareType !== 'E'"
        v-model="form.businessDivision"
        status="businessDivision"
        @input="updateData"
        class="mr15"
      ></check-toggle>
      <check-toggle v-else-if="districtCodeFirst === 'D'" v-model="form.businessDivision" status="businessDivisionNotE" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-else-if="districtCodeFirst === 'J'" v-model="form.businessDivision" status="businessDivisionSpc" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="districtCodeFirst === 'C'" v-model="form.hospitalVideoEdu" status="hospitalVideoEdu" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-model="form.userOrganManagerAlarm" status="userOrganManagerAlarm" @input="updateData" class="mr15"></check-toggle>
      <check-toggle v-if="districtCodeFirst === 'C'" v-model="form.selfCheckListIsDone" status="selfCheckListIsDone" @input="updateData"></check-toggle>
    </div>
  </fragment>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import District from '@/components/common/search/District.vue';
import Input from '@/components/common/search/Input.vue';
import { mapGetters, mapState } from 'vuex';
import CheckToggle from '@/components/common/search/CheckToggle';
import Common from '@/apis/Common';

export default {
  components: {
    'v-select': Select,
    CheckToggle,
    'v-district': District,
    'v-input': Input,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
      secondHelList: [],
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'districtCode', 'adminOrganType', 'cityType', 'healthCareType']),
    ...mapGetters('user', ['districtCodeFirst']),
    isTemporaryId() {
      return this.districtCodeFirst === 'A' && (this.cityType === 'E' || this.healthCareType === 'E' || this.adminOrganType === 'AD');
    },
  },
  watch: {
    clear() {
      for (const i in this.form) {
        delete this.form[i];
      }
    },
  },
  created() {
    Object.assign(this.form, this.$route.query);
    if (this.districtCodeFirst === 'C' && this.userOrganTargetType !== 'CT') {
      Common.healthCareSecondList({ districtCode: this.districtCode }).then(res => {
        if (res && res.data.rt === 200) {
          this.secondHelList = res.data.healthCareList.map(item => {
            return { id: item.districtCode, name: item.healthCareName };
          });
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
  },
  methods: {
    updateData() {
      this.$emit('input', this.form);
    },
    enter() {
      this.$emit('enter');
    },
  },
};
</script>
