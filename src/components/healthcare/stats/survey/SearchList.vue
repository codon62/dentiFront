<template>
  <fragment>
    <div class="flex_container">
      <v-district v-if="userOrganTargetType === 'CT'" v-model="form.district" :clear="clear" :code="true" @input="updateData"></v-district>
      <v-select v-else-if="secondHelList.length" v-model="form.districtCode" title="지역구" message="전체" size="wid180" :option-data="secondHelList" @input="updateData"></v-select>
    </div>
    <p class="mt15 fwb" style="color: #444">기준 : 누적통계 일 단위 ({{ datePeriod }})</p>
  </fragment>
</template>

<script>
import Common from '@/apis/Common';
import Select from '@/components/common/search/Select.vue';
import District from '@/components/common/search/District.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-select': Select,
    'v-district': District,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
      secondHelList: [],
      datePeriod: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'districtCode']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['districtInfo']),
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

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const startDate = this.districtInfo.startDay
      .split('-')
      .map(o => parseInt(o))
      .join('.');
    const endDate = `${yesterday.getMonth() + 1}.${yesterday.getDate()}`;

    this.datePeriod = `${startDate} ~ ${endDate}`;

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
