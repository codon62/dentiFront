<template>
  <div class="popup_content">
    <v-popuptitle message="회계자료 등록" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver pt20">
      <p class="commp2 fwb">통장사본 업로드</p>
      <p class="mt10 c_red scommp">※ 업로드 시 JPG, PNG, PDF 파일이 아닌 경우 오류가 발생할 수 있습니다.</p>
      <p class="mt5 c_red scommp">※ 업로드 파일 용량은 최대 5MB의 제한이 있습니다.</p>
      <v-file-upload :file-name="fileAName" @input="fileAName = $event.name" @remove="fileAName = null" />
      <p class="commp2 fwb mt30">사업자등록증 업로드</p>
      <p class="mt10 c_red scommp">※ 업로드 시 JPG, PNG, PDF 파일이 아닌 경우 오류가 발생할 수 있습니다.</p>
      <p class="mt5 c_red scommp">※ 업로드 파일 용량은 최대 5MB의 제한이 있습니다.</p>
      <v-file-upload :file-name="fileBName" @input="fileBName = $event.name" @remove="fileBName = null" />
      <template v-if="districtCodeFirst === 'I'">
        <p class="commp2 fwb mt30">
          대표 치과의사 날인 업로드
          <a
            href="https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/3.1. 2024 전북특별자치도교육청 구강진료 지원사업 대표 치과의사 날인 가이드(2024.2.13).pdf"
            class="comm__orange_btn btn_m_size2 d_inblock wid130 commp inner--right"
            target="_blank"
            style="margin-right: 318px"
          >
            날인 첨부 가이드
          </a>
        </p>
        <p class="mt10 c_red scommp">※ 업로드 시 JPG, PNG 파일이 아닌 경우 오류가 발생할 수 있습니다.</p>
        <p class="mt5 c_red scommp">※ 업로드 파일 용량은 최대 5MB의 제한이 있습니다.</p>
        <v-file-upload :file-name="fileCName" @input="fileCName = $event.name" @remove="fileCName = null" :no-pdf="true" />
      </template>
      <div class="comm__line mt30"></div>
      <v-popupconfirm message="업로드" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import FileUpload from '@/components/common/FileUpload.vue';
import { mapGetters } from 'vuex';
import Bill from '@/apis/Bill';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-file-upload': FileUpload,
  },
  props: ['dataObject'],
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
  },
  data() {
    return {
      fileAName: null,
      fileBName: null,
      fileCName: null,
    };
  },
  created() {
    const form = {
      hospitalId: this.dataObject.hospitalId,
    };
    Bill.hospitalDocumentInfo(form).then(res => {
      if (res && res.data.rt === 200) {
        this.fileAName = res.data.fileA?.originName;
        this.fileBName = res.data.fileB?.originName;
        this.fileCName = res.data.fileC?.originName;
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    save() {
      const inputFiles = document.getElementsByClassName('input_file');
      if (!this.fileAName || !this.fileBName || (this.districtCodeFirst === 'I' && !this.fileCName)) {
        this.$alert('모든 파일을 업로드해 주세요.', '알림', 'warning');
        return false;
      }
      if (!inputFiles[0]?.value && !inputFiles[1]?.value && !inputFiles[2]?.value) {
        this.$alert('변경된 파일이 없습니다.', '알림', 'warning');
        return false;
      }
      this.hospitalDocumentRegist();
    },
    hospitalDocumentRegist() {
      const hospitalId = this.dataObject.hospitalId;
      this.$store.commit('loading', true);
      const inputFiles = document.getElementsByClassName('input_file');
      const form = new FormData();
      form.append('districtDigit1', this.districtCodeFirst);
      form.append('mode', 'M');
      form.append('hospitalId', hospitalId);
      if (inputFiles[0]?.files[0]) {
        form.append('fileA', inputFiles[0].files[0]);
      }
      if (inputFiles[1]?.files[0]) {
        form.append('fileB', inputFiles[1].files[0]);
      }
      if (inputFiles[2]?.files[0]) {
        form.append('fileC', inputFiles[2].files[0]);
      }
      Hospital.hospitalDocumentRegist(form).then(res => {
        this.$store.commit('loading', false);
        if (res && res.data.rt === 200) {
          this.$alert('업로드되었습니다.', '알림', 'success').then(() => {
            if (inputFiles[0]?.files[0]) {
              this.$store.commit('hospitalDocument/setHospitalDocumentCheck', { hospitalId, type: 'A' });
            }
            if (inputFiles[1]?.files[0]) {
              this.$store.commit('hospitalDocument/setHospitalDocumentCheck', { hospitalId, type: 'B' });
            }
            if (inputFiles[2]?.files[0]) {
              this.$store.commit('hospitalDocument/setHospitalDocumentCheck', { hospitalId, type: 'C' });
            }
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
