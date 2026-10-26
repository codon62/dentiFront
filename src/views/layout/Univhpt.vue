<template>
  <div class="container_wrap left__menuset">
    <v-left-menu cmp="univhpt"></v-left-menu>
    <div class="content__area bg__form_ver" :class="{ password__page: !userOrganPasswordModify && !isDev }">
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
import { mapState } from 'vuex';

export default {
  components: {
    'v-left-menu': LeftMenu,
    'v-top-bar': TopBar,
    ChangePassword,
  },
  computed: {
    ...mapState('user', ['userOrganPasswordModify']),
  },
};
</script>
