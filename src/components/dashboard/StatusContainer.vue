<template>
  <div class="dash__comm_box">
    <div class="tit_row row">
      <div class="inner--left">
        <p class="commp5 c_black2 fwb">{{ title }}</p>
      </div>
    </div>
    <div class="board__con bg_white mt15">
      <div class="sub__tab">
        <ul class="sub__tab_list">
          <li v-for="(toggle, index) in toggleLabel" :key="index" :class="index !== display || 'on'" @click="toggleView(index)" :style="`width: ${100 / toggleLabel.length}%`">
            <a href="javascript:;">
              {{ toggle }}
            </a>
          </li>
        </ul>
      </div>
      <v-status-by-business v-if="display === 0" :type="2" :data="data" />
      <v-status-by-grade v-else :type="4" :data="data" />
    </div>
  </div>
</template>

<script>
import StatusByBusiness from './StatusByBusiness.vue';
import StatusByGrade from './StatusByGrade.vue';

export default {
  components: {
    'v-status-by-business': StatusByBusiness,
    'v-status-by-grade': StatusByGrade,
  },
  props: ['title', 'toggleLabel', 'data'],
  data() {
    return {
      display: 0,
    };
  },
  methods: {
    toggleView(target) {
      this.display = target;
    },
  },
};
</script>

<style scoped></style>
