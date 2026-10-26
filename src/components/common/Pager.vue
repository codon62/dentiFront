<template>
  <div v-if="!popup" id="pager" class="mt30 tac">
    <router-link :to="{ query: Object.assign({}, $route.query, { page: 1 }) }"><img src="@/assets/images/common/bt_bback_p.png" /></router-link>
    <router-link :to="{ query: Object.assign({}, $route.query, { page: data.number === 1 ? 1 : data.number - 1 }) }"><img src="@/assets/images/common/bt_back_p.png" /></router-link>
    <router-link v-for="item in pager" :key="item" :to="{ query: Object.assign({}, $route.query, { page: item }) }" class="pager_number" :class="{ on: item === data.number }">{{ item }}</router-link>
    <router-link :to="{ query: Object.assign({}, $route.query, { page: data.number === data.totalPages ? data.totalPages : data.number + 1 }) }">
      <img src="@/assets/images/common/bt_forward_p.png" />
    </router-link>
    <router-link :to="{ query: Object.assign({}, $route.query, { page: data.totalPages }) }"><img src="@/assets/images/common/bt_fforward_p.png" /></router-link>
  </div>
  <div v-else id="pager" class="mt30 tac">
    <a href="javascript:;" @click="vclick((data.number = 1))"><img src="@/assets/images/common/bt_bback_p.png" /></a>
    <a href="javascript:;" @click="vclick((data.number = data.number === 1 ? 1 : data.number - 1))"><img src="@/assets/images/common/bt_back_p.png" /></a>
    <a v-for="item in pager" :key="item" href="javascript:;" class="pager_number" :class="{ on: item === data.number }" @click="vclick((data.number = item))">{{ item }}</a>
    <a href="javascript:;" @click="vclick((data.number = data.number === data.totalPages ? data.totalPages : data.number + 1))"><img src="@/assets/images/common/bt_forward_p.png" /></a>
    <a href="javascript:;" @click="vclick((data.number = data.totalPages))"><img src="@/assets/images/common/bt_fforward_p.png" /></a>
  </div>
</template>

<script>
export default {
  props: ['data', 'popup'],
  data() {
    return {
      pager: [],
    };
  },
  watch: {
    data() {
      this.paging();
    },
  },
  mounted() {
    this.paging();
  },
  methods: {
    paging() {
      let before; // 나타낼 이전 페이지 개수
      if (this.data.number <= 3) {
        before = this.data.number - 1;
      } else if (this.data.totalPages - this.data.number < 2) {
        if (this.data.number === 4 || this.data.totalPages - this.data.number === 1) {
          before = 3;
        } else {
          before = 4;
        }
      } else {
        before = 2;
      }

      this.pager = [];
      for (let i = this.data.number - before; i < this.data.number - before + 5; i++) {
        this.pager.push(i);
        if (i >= this.data.totalPages) {
          break;
        }
      }
    },
    vclick(page) {
      this.$emit('vclick', page);
    },
  },
};
</script>
