<template>
  <tr class="tr-hover" @click="$router.push({ path: `/${userOrganTargetTypeToPath[userOrganTargetType]}/board/faq/contents`, query: { faqId: data.faqId } })">
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ faqCategory[data.faqCategory] }}</p>
    </td>
    <td class="pl20 tal">
      <p class="scommp">
        <span class="board_subject">{{ data.faqSubject }}</span
        ><span v-if="data.fileExist" class="icon_file">첨부파일</span>
      </p>
    </td>
    <td>
      <p class="scommp">{{ data.adminOrganName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.regdate }}</p>
    </td>
  </tr>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapState('status', ['faqCategory', 'userOrganTargetTypeToPath']),
    ...mapState('user', ['userOrganTargetType']),
  },
};
</script>
