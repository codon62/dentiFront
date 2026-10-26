<template>
  <div class="container_wrap left__menuset">
    <v-left-menu cmp="school"></v-left-menu>
    <div class="content__area bg__form_ver" :class="{ password__page: (!userOrganPasswordModify && !isDev) || (isDivE && !schoolEmail) }">
      <v-top-bar></v-top-bar>
      <change-password v-if="!userOrganPasswordModify"></change-password>
      <change-email v-else-if="isDivE && !schoolEmail"></change-email>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
import LeftMenu from '@/components/common/LeftMenu.vue';
import TopBar from '@/components/common/TopBar.vue';
import ChangePassword from '@/components/common/ChangePassword.vue';
import ChangeEmail from '@/components/school/ChangeEmail.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-left-menu': LeftMenu,
    'v-top-bar': TopBar,
    ChangePassword,
    ChangeEmail,
  },
  computed: {
    ...mapState('user', ['userOrganPasswordModify', 'schoolEmail', 'business']),
    ...mapGetters('business', ['divJoin']),
    isDivE() {
      return this.divJoin('E') && !this.divJoin('S') && this.business && this.business.businessDivisionE === 'Y';
    },
  },
};
</script>
