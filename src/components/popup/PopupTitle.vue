<template>
  <div class="titbox" :class="divclass">
    <p class="commp3 fwb">
      <img v-if="imgsrc" :src="require(`@/assets/images/${imgsrc}`)" />
      {{ message }}
    </p>
    <a href="javascript:;" class="close_btn" @click="close"><img src="@/assets/images/common/ic_close.png" /></a>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  props: ['message', 'imgsrc', 'dataObject', 'divclass'],
  computed: {
    ...mapState('doc', ['formContents']),
  },
  methods: {
    ...mapActions('popup', ['popupClose']),
    close() {
      if (this.dataObject) {
        const { docId, docValue } = this.dataObject;
        if (docId) {
          const arrayNode = document.querySelector(`[name='${docId}[]'][value='${docValue}']`);
          if (arrayNode) {
            arrayNode.checked = false;
            this.$store.commit('doc/DATA_SET', { [docId]: docValue });
          } else {
            const soloNode = document.querySelector(`[name='${docId}'][value='${docValue}']`);
            soloNode.checked = false;
            this.$store.commit('doc/DATA_SET', { [docId]: '' });
          }
        }
      }
      this.popupClose();
    },
  },
};
</script>
