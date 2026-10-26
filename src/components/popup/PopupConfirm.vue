<template>
  <div class="row mt30">
    <div class="inner--left">
      <a href="javascript:;" class="comm__gray_bd_btn d_block btn_l_size commp2 fwn wid110" @click="cancel">취소</a>
    </div>
    <div class="inner--right">
      <a href="javascript:;" class="comm__blue_btn d_block btn_l_size commp2 fwn wid130" @click="save">{{ message }}</a>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message', 'dataObject', 'html', 'customCancel'],
  methods: {
    cancel() {
      if (this.customCancel) {
        this.$emit('cancel');
      } else {
        this.$confirm('취소하시겠습니까?', '알림', 'warning')
          .then(() => {
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
            this.$store.dispatch('popup/popupClose');
          })
          .catch(() => {});
      }
    },
    save() {
      let msg = this.message + '하시겠습니까?';
      if (this.html) {
        msg += this.html;
      }
      this.$confirm('', '알림', 'question', { html: msg })
        .then(() => {
          this.$emit('save');
        })
        .catch(() => {});
    },
  },
};
</script>
