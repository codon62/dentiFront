<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.userSnsType ? userSnsType.value[data.userSnsType] : '이메일' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.userEmail || '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ appInfoType.value[data.appInfoType] }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.appInfoAppVersion }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.userPasswordFindQuestionLabel || '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ (districtCodeFirst === 'C' ? data.userPasswordFindInputAnswer : data.userPasswordFindAnswerLabel) || '-' }}</p>
    </td>
  </tr>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapState('status', ['userSnsType', 'appInfoType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
};
</script>
