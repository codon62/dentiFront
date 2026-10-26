<template>
  <div class="section_con">
    <div class="row bill__set">
      <div class="bill_box1 inner--left" style="width: 8%">
        <div class="set_table">
          <div class="set__table">
            <p class="scommp c_gray2 fwn">구분</p>
          </div>
        </div>
        <div class="set_table">
          <div class="set__table">
            <p class="scommp c_gray2 fwn">실시 인원</p>
          </div>
        </div>
        <div class="set_table">
          <div class="set__table">
            <p class="scommp c_gray2 fwn">청구 금액</p>
          </div>
        </div>
        <div class="set_table">
          <div class="set__table">
            <p class="scommp c_gray2 fwn">처리 완료</p>
          </div>
        </div>
      </div>
      <div class="bill_box2 inner--left row" style="width: 65%">
        <table class="comm__table bill__table">
          <tbody>
            <tr>
              <th v-for="(item, index) in data[0]" :key="index" class="bg_blue">
                <p class="scommp fwb">{{ item }}</p>
              </th>
            </tr>
            <tr>
              <td v-for="(item, index) in data[1]" :key="index">
                <p class="commp fwn c_black2">
                  <span class="d_inblock icon"><img src="@/assets/images/common/ic_person.png" /></span>
                  {{ numberWithCommas(item) }}명
                </p>
              </td>
            </tr>
            <tr>
              <td v-for="(item, index) in data[2]" :key="index">
                <p class="commp fwn c_black2">
                  <span class="d_inblock icon"><img src="@/assets/images/common/ic_won.png" /></span>
                  {{ numberWithCommas(item) }}원
                </p>
              </td>
            </tr>
            <tr class="bill_lt">
              <td v-for="(item, index) in data[3]" :key="index">
                <p class="commp c_blue fwn bg_blue">{{ numberWithCommas(item) }}원</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bill_box3 inner--left row" style="width: 23%">
        <table class="comm__table bill__table">
          <tbody>
            <tr>
              <th class="bg_blue2">
                <p class="scommp fwb c_white">{{ data[4][0] }}</p>
              </th>
            </tr>
            <tr>
              <td>
                <p class="commp fwn c_black2">
                  <span class="d_inblock icon"><img src="@/assets/images/common/ic_person.png" /></span>
                  {{ numberWithCommas(data[4][1]) }}명
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <p class="commp fwn c_black2">
                  <span class="d_inblock icon"><img src="@/assets/images/common/ic_won.png" /></span>
                  {{ numberWithCommas(data[4][2]) }}원
                </p>
              </td>
            </tr>
            <tr class="bill_lt">
              <td>
                <p class="commp c_blue fwn bg_blue">{{ numberWithCommas(data[4][3]) }}원</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
};
</script>
