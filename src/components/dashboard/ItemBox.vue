<template>
  <fragment>
    <div v-if="data.length" class="m_inner row">
      <div v-for="(item, idx) of data" :key="idx" class="nm__box inner--left">
        <p class="c_black2 scommp fwn">
          <span v-if="icon && icon.head" class="icon"><img :src="icon.head" /></span>
          {{ item.head }}
        </p>
        <p class="mt10 sscommp c_gray3">{{ item.body }}</p>
        <p class="mt5 sscommp2 c_gray3 fwn">
          <span v-if="icon && icon.foot" class="d_inblock mr5"><img :src="icon.foot" /></span>
          {{ item.foot }}
        </p>
      </div>
    </div>
    <div v-else class="m_inner row">
      <span class="m_inner_text" v-html="msg"></span>
    </div>
  </fragment>
</template>
<script>
export default {
  props: {
    data: Array,
    icon: [String, Object],
    count: Number,
    msg: {
      type: String,
      default: '로딩중입니다.',
    },
  },
};
</script>
<style scoped>
.m_inner {
  display: table;
  width: calc(100% - 25px);
  min-height: 289.75px;
  margin: 0;
}
.m_inner_text {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.nm__box {
  height: 90px;
}
</style>
