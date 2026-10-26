<template>
  <tr class="tr-hover" @click="$router.push({ path: `/${userOrganTargetTypeToPath[userOrganTargetType]}/board/notice/contents`, query: { noticeBoardId: data.noticeBoardId } })">
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.districtName }}</p>
    </td>
    <td>
      <p class="scommp" v-html="receiver"></p>
    </td>
    <td class="pl20 tal">
      <p class="scommp">
        <span class="board_subject">{{ data.noticeBoardSubject }}</span
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
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapState('status', ['noticeBoardReceiver', 'noticeBoardReceiverI', 'userOrganTargetTypeToPath']),
    ...mapState('user', ['userOrganTargetType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin']),
    receiver() {
      let obj = {
        HC: this.data.noticeBoardHealthCare,
        HP: this.data.noticeBoardHospital,
        SC: this.data.noticeBoardSchool,
      };
      if (this.divJoin('C')) {
        obj.CE = this.data.noticeBoardCenter;
      }

      let list = [];
      let objCount = 0;
      for (let key in obj) {
        objCount++;
        if (obj[key] === 'Y') {
          list.push(key);
        }
      }
      if (objCount === list.length) {
        return '전체';
      }
      return list.map(value => this[['I', 'J'].includes(this.districtCodeFirst) ? 'noticeBoardReceiverI' : 'noticeBoardReceiver'][value]).join('<br/>');
    },
  },
};
</script>
