<template>
  <div class="row bill__set">
    <div class="bill_box2 inner--left row" style="width: 96%">
      <table class="comm__table bill__table">
        <tbody>
          <tr v-for="row in data" :key="row[0][0]">
            <fragment v-for="item in row" :key="item[0]">
              <td class="bg_blue">
                <p class="scommp fwb">{{ item[0] }}</p>
              </td>
              <td>
                <template v-if="item[1] && typeof item[1] === 'object'">
                  <div class="d_inblock commp fwn c_black name_block">
                    {{ item[1][0] }}
                  </div>
                  <div class="d_inblock commp fwn c_black sign-block" :style="{ backgroundImage: `url(${item[1][1]})` }"> (인) </div>
                </template>
                <p v-else class="commp fwn c_black">
                  <span v-if="item[2]" class="d_inblock icon"><img :src="require(`@/assets/images/common/ic_${item[2]}.png`)" /></span>
                  <span v-html="item[1] ? (item[2] === 'won' ? numberWithCommas(item[1]) + '원' : item[1]) : '-'"></span>
                </p>
              </td>
            </fragment>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
};
</script>

<style scoped>
.name_block {
  width: calc(100% - 50px);
}
.sign-block {
  width: 50px;
  height: 50px;
  line-height: 50px;
  background-size: 100% 100%;
}
</style>
