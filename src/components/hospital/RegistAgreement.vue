<template>
  <div class="popup_content">
    <v-popuptitle message="개인정보활용동의서" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp2 fwb">개인정보활용동의서 업로드</p>
      <p class="mt10 c_red scommp">※ 동의서 업로드 시 JPG, PNG, PDF 파일이 아닌 경우 오류가 발생할 수 있습니다.</p>
      <p class="mt5 c_red scommp">※ 업로드 파일 용량은 최대 5MB의 제한이 있습니다.</p>
      <v-file-upload />
      <template v-if="districtCodeFirst === 'A'">
        <p class="commp2 fwb mt50">개인정보처리위탁동의서 업로드</p>
        <template v-if="!isSeoulChildAppAgree">
          <p class="mt10 c_red scommp">※ 동의서 업로드 시 JPG, PNG, PDF 파일이 아닌 경우 오류가 발생할 수 있습니다.</p>
          <p class="mt5 c_red scommp">※ 업로드 파일 용량은 최대 5MB의 제한이 있습니다.</p>
          <v-file-upload />
        </template>
        <p v-else class="fwb xlcommp">APP 동의 처리 완료</p>
      </template>
      <div class="comm__line mt30"></div>
      <v-popupconfirm message="업로드" :customCancel="dataObject.customCancel" @cancel="cancel" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import FileUpload from '@/components/common/FileUpload.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-file-upload': FileUpload,
  },
  props: ['dataObject'],
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  data() {
    return {
      isSeoulChildAppAgree: false,
      isFileR: false,
    };
  },
  created() {
    if (this.districtCodeFirst === 'A') {
      this.isFileR = true;
      const form = {
        studentId: this.dataObject.studentId,
        businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
      };
      Hospital.infoAgreeInfo(form).then(res => {
        if (res && res.data.rt === 200) {
          if (!!res.data.infoAgreeFileUId === !this.dataObject.update) {
            alert('잘못된 접근입니다.');
            this.$store.dispatch('popup/popupClose');
            return false;
          }
          // 서울시에서 아동치과주치의 APP 동의 시 개인정보처리위탁동의 불필요
          if (this.dataObject.businessDivision === 'C' && res.data.studentAppAgree) {
            this.isSeoulChildAppAgree = true;
            this.isFileR = false;
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
  },
  methods: {
    save() {
      if (document.getElementsByClassName('input_file')[0].value && !(this.isFileR && !document.getElementsByClassName('input_file')[1].value)) {
        this.infoAgreeRegist();
      } else {
        this.$alert('모든 파일을 업로드해주세요.', '알림', 'warning');
      }
    },
    cancel() {
      this.$store.dispatch('popup/popupOpen', { contents: this.dataObject.customCancel, params: { studentId: this.dataObject.studentId, businessDivision: this.dataObject.businessDivision } });
    },
    infoAgreeRegist() {
      this.$store.commit('loading', true);
      const form = new FormData();
      form.append('studentId', this.dataObject.studentId);
      form.append('businessDivision', this.valueToCode('C0003', this.dataObject.businessDivision));
      form.append('infoAgreeFileUFile', document.getElementsByClassName('input_file')[0].files[0]);
      if (document.getElementsByClassName('input_file')[1]) {
        form.append('infoAgreeFileRFile', document.getElementsByClassName('input_file')[1].files[0]);
      }
      const request = this.dataObject.update ? Hospital.infoAgreeUpdate : Hospital.infoAgreeRegist;
      request(form).then(res => {
        this.$store.commit('loading', false);
        if (res && res.data.rt === 200) {
          this.$alert('업로드되었습니다.', '알림', 'success').then(() => {
            this.$store.dispatch('popup/popupClose');
            this.$store.commit('update');
          });
        } else {
          if (res.data.rt === 400) {
            this.$alert(res.data.rtMsg, '알림', 'error');
          } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        }
      });
    },
  },
};
</script>
