<template>
  <fragment>
    <div class="flex_container">
      <v-district v-if="userOrganTargetType === 'CT'" v-model="form.district" :clear="clear" :code="true" @input="updateData"></v-district>
      <v-select v-else-if="secondHelList.length" v-model="form.districtCode" title="지역구" message="전체" size="wid180" :option-data="secondHelList" @input="updateData"></v-select>
      <v-select
        v-if="districtCodeFirst === 'C'"
        v-model="form.schoolType"
        title="학교 구분"
        each="schoolType"
        size="wid180"
        :option-data="schoolTypeNotNullEach"
        message="전체"
        @input="updateData"
      ></v-select>
      <v-input v-model="form.schoolName" title="학교명" placeholder="학교명" @input="updateData" @enter="enter"></v-input>
      <check-toggle v-model="form.userOrganManagerAlarm" status="userOrganManagerAlarm" @input="updateData" class="ml15 mr15"></check-toggle>
      <check-toggle v-if="districtCodeFirst === 'A'" v-model="form.businessDivision" status="businessDivisionSpc" @input="updateData" class="ml15"></check-toggle>
    </div>
  </fragment>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import District from '@/components/common/search/District.vue';
import Input from '@/components/common/search/Input.vue';
import CheckToggle from '@/components/common/search/CheckToggle';
import { mapGetters, mapState } from 'vuex';
import Common from '@/apis/Common';

export default {
  components: {
    'v-select': Select,
    'v-district': District,
    'v-input': Input,
    CheckToggle,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
      secondHelList: [],
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'districtCode']),
    ...mapState('status', ['schoolTypeNotNullEach']),
    ...mapGetters('user', ['districtCodeFirst']),
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
