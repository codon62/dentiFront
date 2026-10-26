<template>
  <div class="container_wrap left__menuset">
    <v-left-menu cmp="healthcare"></v-left-menu>
    <div class="content__area bg__form_ver" :class="{ password__page: !userOrganPasswordModify && (!isDev || adminOrganType === 'AD') }">
      <v-top-bar></v-top-bar>
      <change-password v-if="!userOrganPasswordModify"></change-password>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
import LeftMenu from '@/components/common/LeftMenu.vue';
import TopBar from '@/components/common/TopBar.vue';
import ChangePassword from '@/components/common/ChangePassword.vue';
import { mapGetters, mapState } from 'vuex';
import Bill from '@/apis/Bill';

export default {
  components: {
    'v-left-menu': LeftMenu,
    'v-top-bar': TopBar,
    ChangePassword,
  },
  computed: {
    ...mapState('user', ['districtCode', 'userOrganPasswordModify', 'adminOrganType', 'userOrganTargetType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['codeToValueList']),
  },
  created() {
    this.$store.commit('hospitalDocument/resetState');
    if (this.districtCodeFirst === 'I' && this.userOrganTargetType === 'HC') {
      Bill.hospitalDocumentCheckList({ districtCode: this.districtCode }).then(res => {
        if (res && res.data.rt === 200) {
          this.$store.commit('hospitalDocument/setHospitalDocumentCheckList', this.codeToValueList(res.data.hospitalDocumentCheckList));
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
  },
};
</script>
