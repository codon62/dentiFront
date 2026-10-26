<template>
  <div class="sub__section" :class="divclass">
    <div class="titbox" style="height: 40px">
      <div>
        <span class="icon d_inblock"><img src="@/assets/images/common/ic_searchlist.png" /></span>
        <p v-if="title" class="commp2 d_inblock fwb ml5">{{ title }} 목록</p>
        <p v-if="fullTitle" class="commp2 d_inblock fwb ml5" v-html="fullTitle"></p>
        <p v-if="subTitle" class="scommp ml5 mt5" v-html="subTitle"></p>
      </div>
      <div id="btn_wrap">
        <slot></slot>
      </div>
    </div>
    <div class="section_con search__ver">
      <div class="board__box">
        <v-table :data="table" :cmp="cmp"></v-table>
        <v-pager v-if="pager" :data="pager"></v-pager>
      </div>
    </div>
  </div>
</template>

<script>
import Table from '@/components/common/Table.vue';
import Pager from '@/components/common/Pager.vue';

export default {
  components: {
    'v-pager': Pager,
    'v-table': Table,
  },
  props: ['title', 'cmp', 'divclass', 'table', 'pager', 'fullTitle', 'subTitle'],
};
</script>

<style scoped lang="scss">
.titbox {
  display: flex;
  justify-content: space-between;
}
#btn_wrap {
  position: relative;
  display: flex;
}
#btn_wrap > a,
#btn_wrap > div {
  min-width: 130px;
}
.btn_box {
  @include box-sizing(border-box);

  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #dbdbdb;
  z-index: 999;
  overflow-y: auto;
}
.btn_box a {
  @include box-sizing(border-box);

  display: block;
  padding: 0 8px;
  line-height: 40px;
  white-space: nowrap;
  letter-spacing: 0;
  color: #4f4f4f;
}

.btn_box a + a {
  border-top: 1px solid #dbdbdb;
}
.btn_box_excel a:hover,
.btn_box_excel a:active {
  background-color: #eef9f8;
  color: #0f7e7a;
}
.btn_box_pdf a:hover,
.btn_box_pdf a:active {
  background-color: #ffeed8;
  color: #ff852c;
}
.btn_box_survey a:hover,
.btn_box_survey a:active {
  background-color: #caedfd;
  color: #6fb5e7;
}
.pd__0_20 {
  padding: 0 20px;
}
</style>
