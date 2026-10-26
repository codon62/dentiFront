<template>
  <tr class="tr-hover" @click="$router.push({ path: `/${userOrganTargetTypeToPath[userOrganTargetType]}/board/inquiry/contents`, query: { inquiryId: data.inquiryId } })">
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp" v-html="data.healthCareName + (data.secondHealthCareName ? `<br/>(${data.secondHealthCareName})` : '')"></p>
    </td>
    <td>
      <p class="scommp">{{ codeToDivisionCodeName(data.inquiryCategoryCode) }}</p>
    </td>
    <td class="pl20 tal">
      <p class="scommp">{{ data.inquiryQuestionSubject }}</p>
    </td>
    <td>
      <p class="d_inblock wid60 scommp btn_s_size" :class="data.inquiryAnswerRegdate ? 'comm__blue_btn' : 'comm__red_btn'">{{ data.inquiryAnswerRegdate ? '해결' : '처리중' }}</p>
    </td>
    <td>
      <p
        class="scommp"
        v-html="
          data.inquiryQuestionAdminOrganTargetHealthCareName
            ? data.inquiryQuestionAdminOrganTargetHealthCareName +
              (data.inquiryQuestionAdminOrganTargetSecondHealthCareName ? `<br/>(${data.inquiryQuestionAdminOrganTargetSecondHealthCareName})` : '')
            : districtCodeFirstToName[districtCodeFirst]
        "
      ></p>
    </td>
    <td>
      <p class="scommp">{{ data.inquiryQuestionAdminOrganTargetName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.inquiryQuestionRegdate }}</p>
    </td>
  </tr>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapState('status', ['userOrganTargetTypeToPath', 'districtCodeFirstToName']),
    ...mapState('user', ['userOrganTargetType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['codeToDivisionCodeName']),
  },
};
</script>

<style scoped lang="scss">
.btn_s_size {
  line-height: 30px;
  font-weight: bold;
}
</style>
