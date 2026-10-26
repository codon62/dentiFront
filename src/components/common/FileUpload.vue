<template>
  <div class="row mt20 file__upload">
    <div class="upload-btn_wrap">
      <button type="button" title="파일찾기">
        <span>
          <img src="@/assets/images/common/ic_filefolder.png" />
          파일찾기
        </span>
      </button>
      <input ref="inputFile" type="file" :accept="accept" class="input_file" title="파일찾기" @change="upload" />
    </div>
    <input ref="fileName" type="text" :value="fileName" class="upload_text" readonly="readonly" />
    <a v-if="remove" href="javascript:;" class="ml10" @click="removeFile"><img class="mt5" src="@/assets/images/common/ic_close.png" /></a>
  </div>
</template>

<script>
export default {
  props: ['remove', 'fileName', 'size', 'type', 'hwp', 'noPdf'],
  computed: {
    accept() {
      if (this.type === 'all') return '.gif, .jpg, .jpeg, .png, .hwp, .xls, .xlsx, .doc, .docx, .ppt, .pptx, .pdf, .txt, .zip, .rar';
      if (this.type === 'excel') return '.xls, .xlsx';
      return '.jpg, .jpeg, .png' + (this.noPdf ? '' : ', .pdf') + (this.hwp ? ', .hwp' : '');
    },
  },
  methods: {
    upload(event) {
      const fileExtionsion = `.${event.target.files[0].name.split('.').pop().toLowerCase()}`;
      if (!this.accept.includes(fileExtionsion)) {
        // 파일 확장자 검사
        event.target.value = this.$refs.fileName.value = ''; // 파일 및 파일명 출력 초기화
        this.$alert(`${this.accept.replaceAll('.', '')} 파일만 업로드 가능합니다.`, '알림', 'error');
        this.removeFile();
      } else if (event.target.files[0].size > (this.size ? this.size : 5) * 1024 * 1024) {
        // size MB or 5MB 제한
        event.target.value = this.$refs.fileName.value = ''; // 파일 및 파일명 출력 초기화
        this.$alert((this.size ? this.size : 5) + 'MB 이하만 업로드 가능합니다.', '알림', 'error');
        this.removeFile();
      } else {
        this.$refs.fileName.value = this.fileName ? this.fileName : event.target.files[0].name;
        event.target.files[0].originName = event.target.files[0].name;
        this.$emit('input', event.target.files[0]);
      }
    },
    removeFile() {
      this.$emit('remove');
    },
  },
};
</script>
