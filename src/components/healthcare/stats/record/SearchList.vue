<template>
  <fragment>
    <div class="flex_container">
      <!-- 년도 검색은 아직... -->
      <!-- <v-select v-if="districtCodeFirst === 'A' && $route.path === '/healthcare/stats/record/seoul/child'" title="년도" message="전체" v-model="form.year" size="wid180" @input="updateData" :optionData="year"></v-select> -->

      <div class="comm_radio" style="margin-top: -15px">
        <template v-if="districtCodeFirst !== 'C'">
          <div v-for="(no, key) in type.order" :key="key" class="radio_box d_inblock hei100 mt10" :class="{ ml20: no !== 'Y' }">
            <input :id="'type_' + no" v-model="form.type" type="radio" :value="no" :checked="form.type === no" name="type" class="blind" @input="updateData" />
            <label :for="'type_' + no">
              <span class="icon"></span>
              <span class="label_t">{{ type.value[no] }}</span>
            </label>
          </div>
        </template>
        <transition name="fade">
          <v-select
            v-show="form.type === '0'"
            ref="selectMonth"
            v-model="form.month"
            title="월별"
            size="wid180"
            :option-data="selectBoxMonth"
            :clear="clear"
            style="margin: 15px 15px 0"
            @input="updateData"
          ></v-select>
        </transition>
      </div>
    </div>
    <p v-if="districtCodeFirst === 'C'" class="mt15 fwb" style="color: #444">기준 : 누적통계 월 단위 ({{ datePeriod }})</p>
    <p v-else class="mt15 fwb" style="color: #444">{{ description }}</p>
    <p v-if="districtCodeFirst === 'C' && targetMonth <= 10" class="fwb" style="color: #444">{{ excelButtonIntroTxt }}</p>
  </fragment>
</template>

<script>
import Select from '@/components/common/search/Select.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-select': Select,
  },
  props: ['clear', 'description'],
  data() {
    return {
      form: {
        month: '',
        type: '',
      },
      selectBoxMonth: {},
      targetMonth: '',
      datePeriod: '',
      excelButtonIntroTxt: '',
      type: {
        value: {
          0: '월별 검색',
          1: '주별 검색',
          2: '일별 검색',
        },
        order: this.districtCodeFirst !== 'C' ? ['2', '1', '0'] : ['0'],
      },
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'districtCode']),
    ...mapState('status', ['month', 'year']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['startMonth', 'districtInfo']),
  },
  watch: {
    '$route.query'() {
      if (this.districtCodeFirst === 'C') {
        this.form.month = this.$route.query.month;
        this.updateDateTxt();
      }
    },
    clear() {
      const now = new Date();
      // 사업 년도이면 (현재 월 - 1)월 까지, 아니면 12월까지
      this.targetMonth = now.getFullYear() === this.businessYear ? now.getMonth() : 12;
      this.form.month = this.form.month ? this.form.month : this.intToString(this.targetMonth);
      this.form.type = this.districtCodeFirst === 'C' ? '0' : this.form.type ? this.form.type : '2';

      // 초기화 시 월별 검색 초기값 설정
      this.$refs.selectMonth.$el.getElementsByClassName('comm_select')[0].value = this.intToString(this.targetMonth);
    },
  },
  created() {
    Object.assign(this.form, this.$route.query);

    const now = new Date();
    // 사업 년도이면 (현재 월 - 1)월 까지, 아니면 12월까지
    this.targetMonth = now.getFullYear() === this.businessYear ? now.getMonth() : 12;
    this.form.month = this.form.month ? this.form.month : this.$route.query.month ? this.$route.query.month : this.intToString(this.targetMonth);
    this.form.type = this.districtCodeFirst === 'C' ? '0' : this.$route.query.type ? this.$route.query.type : '2';

    this.selectBoxMonth = this.month.filter(element => {
      const monthNum = Number(element.id);
      return monthNum >= this.startMonth && monthNum <= this.targetMonth;
    });

    this.updateDateTxt();
    this.excelButtonIntroTxt = `${this.targetMonth + 1}월 다운로드 적용일 : ${this.targetMonth + 2}월 첫째주`;
  },
  methods: {
    updateData() {
      this.$emit('input', this.form);
    },
    updateDateTxt() {
      const dateTxtMonth = this.form.month ? Number(this.form.month) : this.targetMonth;
      const dateTxtDay = new Date(this.businessYear, dateTxtMonth, 0).getDate();

      const startDate = this.districtInfo.startDay
        .split('-')
        .map(o => parseInt(o))
        .join('.');
      const endDate = `${dateTxtMonth}.${dateTxtDay}`;

      this.datePeriod = `${startDate} ~ ${endDate}`;
    },
    intToString(num) {
      return num < 10 ? `0${num}` : `${num}`;
    },
  },
};
</script>
<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  @include transition(opacity 0.2s);
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  @include opacity(0);
}
.comm_radio .label_t {
  font-size: 15px;
  font-weight: 500;
  color: #0868f1;
}
</style>
