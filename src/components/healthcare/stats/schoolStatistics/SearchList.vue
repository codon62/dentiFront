<template>
  <fragment>
    <div class="flex_container">
      <v-district v-model="form.district" :clear="clear" :code="true" @input="updateData"></v-district>
    </div>
    <p class="mt15 fwb" style="color: #444">기준 : 누적통계 일 단위 ({{ datePeriod }})</p>
  </fragment>
</template>

<script>
import District from '@/components/common/search/District.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    'v-district': District,
  },
  props: ['clear'],
  data() {
    return {
      form: {},
      datePeriod: '',
    };
  },
  computed: {
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
