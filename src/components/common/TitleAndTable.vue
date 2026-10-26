<template>
  <div class="section_con">
    <div class="row bill__set">
      <div class="bill_box4 inner--left row" style="width: 96%">
        <table class="comm__table">
          <tbody>
            <tr>
              <th v-if="data.title" :rowspan="data.td.length + 1" class="bg_blue border_right">
                <p class="scommp fwb">{{ data.title }}</p>
              </th>
              <th v-for="item in data.th" :key="item" class="bg_blue">
                <p class="scommp fwb">{{ item }}</p>
              </th>
            </tr>
            <tr v-for="(td, trIndex) in data.td" :key="trIndex">
              <td v-for="(item, index) in td" :colspan="['A', 'C'].includes(districtCodeFirst) && trIndex > 1 && trIndex === data.td.length - 1 && index === 0 ? 2 : 1" :key="index">
                <p class="commp fwn c_black2">
                  <span v-if="item[1] && item[1] !== 'schoolType'" class="d_inblock icon"
                    ><img :src="require(`@/assets/images/common/ic_${item[1] && item[1].includes('won') ? 'won' : item[1]}.png`)"
                  /></span>
                  {{
                    item[1] && item[1].includes('won')
                      ? numberWithCommas(item[0]) + '원' + (item[1] === 'wonLow' ? ' 이하' : '')
                      : item[1] && item[1] === 'schoolType'
                      ? codeToDivisionCodeName(item[0]).split('(')[0]
                      : item[0]
                  }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['data'],
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['codeToDivisionCodeName']),
  },
};
</script>
