<template>
  <vue-html2pdf @hasDownloaded="hasDownloaded($event)" :preview-modal="true" :paginate-elements-by-height="1400" :html-to-pdf-options="htmlToPdfOptions" ref="html2Pdf">
    <section slot="pdf-content">
      <slot></slot>
    </section>
  </vue-html2pdf>
</template>

<script>
import VueHtml2pdf from 'vue-html2pdf';

export default {
  name: 'VuePdf',
  props: ['status'],
  components: {
    VueHtml2pdf,
  },
  data() {
    return {
      htmlToPdfOptions: {
        margin: [15, 0, 15, 0],
        filename: 'document.pdf',
        pagebreak: { mode: 'avoid-all' },
        image: {
          type: 'jpeg',
          quality: 1,
        },
        html2canvas: {
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          scale: 1,
          dpi: 300,
          letterRendering: true,
          allowTaint: false, //useCORS를 true로 설정 시 반드시 allowTaint를 false처리 해주어야함
        },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      },
      start: false,
    };
  },
  methods: {
    generate() {
      this.$refs.html2Pdf.generatePdf();
    },
    hasDownloaded() {
      this.$emit('restore');
    },
  },
};
</script>

<style scoped></style>
