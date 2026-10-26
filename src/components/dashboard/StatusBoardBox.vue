<template>
  <div class="dash__comm_box dash__comm_box6 inner--left">
    <div class="tit_row row">
      <p class="commp5 c_black2 fwb">{{ title }}</p>
      <p v-if="userOrganTargetType === 'SC' && divJoin('E')" class="c_black2 label_text">
        전체 대상자
        <b>{{ numberWithCommas(labelData.total) }}명</b>
        중
        <b>{{ numberWithCommas(labelData.bill) }}명</b>
        수검
      </p>
    </div>
    <div class="board__con" :class="userOrganTargetType === 'SC' && divJoin('E') ? null : 'mt5'">
      <div class="list__con">
        <div class="m_inner row">
          <ul class="h__list">
            <li v-for="(item, key) in data" :key="key" class="mt10">
              <span class="icon d_inblock tac">
                <img :src="item.icon" />
              </span>
              <p class="commp d_inblock fwn ml20">
                {{ item.title }}
              </p>
              <p class="number_t fwb mcommp2 c_black2 d_inblock">
                {{ item.count }}
                <span class="scommp d_inblock fwn">{{ item.unitStr }}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['title', 'unitStr', 'data', 'labelData'],
  data() {
    return {};
  },
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapGetters('business', ['divJoin']),
  },
};
</script>

<style scoped>
.label_text {
  text-align: right;
  font-size: 14px;
}
.label_text > b {
  font-weight: 700;
}
</style>
