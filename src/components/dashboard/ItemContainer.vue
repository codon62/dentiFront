<template>
  <div class="dash__comm_box" :class="className">
    <div class="tit_row row">
      <div class="inner--left">
        <p class="commp5 c_black2 fwb">{{ title }}</p>
      </div>
      <div v-if="button" class="inner--right">
        <a href="" class="d_block scommp c_gray3" @click="() => this.$router.push(toggleLabel[display].link)" @click.prevent>
          {{ button }}
          <span class="icon"><img src="@/assets/images/common/ic_seeall.png" :alt="button.label" /></span>
        </a>
      </div>
    </div>
    <div class="board__con bg_white mt15">
      <div class="sub__tab">
        <ul class="sub__tab_list">
          <li
            v-for="(toggle, idx) in toggleLabel"
            :key="toggle.value"
            :class="toggle.value !== toggleLabel[display].value || 'on'"
            @click="toggleView(idx)"
            :style="`width: ${100 / toggleLabel.length}%`"
          >
            <a href="javascript:;">
              {{ toggle.title }}
              <span>{{ toggle.total >= 0 ? numberWithCommas(toggle.total) + '건' + (toggle && toggle.datapick ? '&nbsp;' : '') : null }}</span>
              <span v-if="toggle && toggle.datapick" class="new_badge d_inblock ml5">
                {{ toggle.pickEffect }}
              </span>
            </a>
          </li>
        </ul>
      </div>
      <!-- eslint-disable vue/no-use-v-if-with-v-for,vue/no-confusing-v-for-v-if -->
      <div class="list__con">
        <slot v-for="toggle in toggleLabel" v-if="toggle.value === toggleLabel[display].value" :name="toggle.value" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'toggleLabel', 'button', 'table', 'pager', 'className'],
  data() {
    return {
      display: 0,
    };
  },
  computed: {
    console: () => console,
  },
  methods: {
    toggleView(target) {
      this.display = target;
    },
  },
};
</script>

<style scoped>
.list__con {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}
.dash__comm_box .board__con {
  height: auto;
}
</style>
