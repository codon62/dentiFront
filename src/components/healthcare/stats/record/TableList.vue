<template>
  <component :is="cmp" :data="data"></component>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  components: {
    seoul: () => import('@/components/healthcare/stats/record/table/TableSeoul.vue'),
    seoulChild: () => import('@/components/healthcare/stats/record/table/TableSeoulChild.vue'),
    gyeonggi: () => import('@/components/healthcare/stats/record/table/TableGyeonggi.vue'),
    busan: () => import('@/components/healthcare/stats/record/table/TableBusan.vue'),
    busanChild: () => import('@/components/healthcare/stats/record/table/TableBusanChild.vue'),
    other: () => import('@/components/healthcare/stats/record/table/TableOther.vue'),
  },
  props: ['data'],
  data() {
    return {
      cmp: '',
    };
  },
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
  },
  created() {
    // TableList 지역 별 분기 처리
    switch (this.districtCodeFirst) {
      case 'A':
        if (this.$route.path === '/healthcare/stats/record/seoul/child') {
          this.cmp = 'seoulChild';
        } else {
          this.cmp = 'seoul';
        }
        break;
      case 'C':
        this.cmp = 'gyeonggi';
        break;
      case 'D':
        if (this.$route.path === '/healthcare/stats/record/busan/child') {
          this.cmp = 'busanChild';
        } else {
          this.cmp = 'busan';
        }
        break;
      default:
        this.cmp = 'other';
        break;
    }
  },
};
</script>
