<template>
  <div class="popup_content">
    <v-popuptitle message="계약서류 업로드" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp2 fwb">계약서류 업로드</p>
      <p class="mt10 c_red scommp">※ 첨부파일 업로드 시 JPG, PNG, PDF, hwp 파일이 아닌 경우 오류가 발생할 수 있습니다.</p>
      <p class="mt5 c_red scommp">※ 업로드 파일 용량은 최대 5MB의 제한이 있습니다.</p>
      <v-file-upload :hwp="true" />
      <div class="titbox row mt30">
        <div class="inner--left">
          <a href="javascript:;" class="comm__gray_bd_btn btn_m_size2 d_block wid130 commp inner--right ml10" @click="popupOpen({ contents: 'contractFileList' })">취소</a>
        </div>
        <div class="inner--right">
          <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid130 commp inner--right" @click="save">저장</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import School from '@/apis/School';
import popupTitle from '@/components/popup/PopupTitle.vue';
import FileUpload from '@/components/common/FileUpload.vue';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-file-upload': FileUpload,
  },
  props: ['dataObject'],
  computed: {
    ...mapState('user', ['userOrganTargetId']),
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    save() {
      if (document.getElementsByClassName('input_file')[0].value) {
        const form = new FormData();
        form.append('schoolId', this.userOrganTargetId);
        form.append('file', document.getElementsByClassName('input_file')[0].files[0]);
        School.contractFileUpload(form).then(res => {
          if (res && res.data.rt === 200) {
            this.$alert('업로드되었습니다.', '알림', 'success').then(() => {
              this.popupOpen({ contents: 'contractFileList' });
            });
          } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        });
      } else {
        this.$alert('파일을 업로드해주세요.', '알림', 'warning');
      }
    },
  },
};
</script>
