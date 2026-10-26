<template>
  <fragment>
    <div class="flex_container">
      <v-district v-if="userOrganTargetType === 'CT' || districtCodeFirst === 'C'" v-model="form.district" :clear="clear" :code="true" @input="updateData"></v-district>
      <v-input v-else :title="districtCodeFirst === 'C' ? '시군' : '보건소'" :value="districtName" class-name="read_put" :readonly="true"></v-input>
    </div>
    <p v-if="datePeriod" class="mt15 fwb" style="color: #444">기준 : 누적통계 일 단위 ({{ datePeriod }})</p>
  </fragment>
</template>

<script>
import District from '@/components/common/search/District.vue';
import { mapState, mapGetters } from 'vuex';
import Input from '@/components/common/search/Input';

export default {
  components: {
    'v-district': District,
    'v-input': Input,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
      datePeriod: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'districtName']),
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
    if (['A', 'C'].includes(this.districtCodeFirst)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const startDate = this.districtInfo.startDay
        .split('-')
        .map(o => parseInt(o))
        .join('.');
      const endDate = `${yesterday.getMonth() + 1}.${yesterday.getDate()}`;

      this.datePeriod = `${startDate} ~ ${endDate}`;
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
