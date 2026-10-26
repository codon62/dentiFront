<template>
  <div class="sub__content form__ver_1 mt30">
    <div class="browser__con">
      <div class="bg_white mt20 tac" style="width: 800px; margin: 0 auto; padding: 50px; box-sizing: border-box">
        <div class="iconbox"><img src="@/assets/images/sub/ic_hospital_o.png" /></div>
        <p class="commp3 mt15 fwb">회계 자료 등록</p>
        <div class="basic__form_box mt30">
          <p class="commp3 c_red fwb">※ 회계자료 등록 후 시스템 이용이 가능합니다.</p>
          <p class="commp c_red">※ 교육지원청에 진료 비용을 청구하기 위해 아래 서류를 모두 등록해야 합니다.</p>
          <p class="commp c_red">※ 덴티아이에 기재된 치과병의원 정보와 서류 정보가 일치하여야 합니다.</p>

          <div class="commp5 fwn tal mt50">통장사본 <span class="c_red">(최대 용량 5MB, 파일형식 : jpg, png, pdf)</span></div>
          <v-file-upload />
          <p class="commp5 fwn tal mt50">사업자등록증 <span class="c_red">(최대 용량 5MB, 파일형식 : jpg, png, pdf)</span></p>
          <v-file-upload />
          <template v-if="districtCodeFirst === 'I'">
            <div class="commp5 fwn tal mt50 hei40" style="margin-bottom: -10px">
              <div class="d_inblock mt5">대표 치과의사 날인 <span class="c_red">(최대 용량 5MB, 파일형식 : jpg, png)</span></div>
              <a
                href="https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/3.1. 2024 전북특별자치도교육청 구강진료 지원사업 대표 치과의사 날인 가이드(2024.2.13).pdf"
                class="comm__orange_btn btn_m_size2 d_inblock wid130 commp inner--right"
                target="_blank"
                >날인 첨부 가이드</a
              >
            </div>
            <v-file-upload :no-pdf="true" />
          </template>
        </div>
        <div class="row tac mt80">
          <a href="javascript:;" class="d_inblock comm__blue_btn btn_m_size2" style="width: 160px" @click="save">회계 자료 등록하기</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import FileUpload from '@/components/common/FileUpload';
import Hospital from '@/apis/Hospital';

export default {
  components: {
    'v-file-upload': FileUpload,
  },
  computed: {
    ...mapState('user', ['userOrganTargetId']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
  methods: {
    save() {
      const inputFiles = document.getElementsByClassName('input_file');
      if (inputFiles[0].value && inputFiles[1].value && (this.districtCodeFirst !== 'I' || inputFiles[2].value)) {
        this.hospitalDocumentRegist();
      } else {
        this.$alert('모든 파일을 업로드해주세요.', '알림', 'warning');
      }
    },
    hospitalDocumentRegist() {
      this.$store.commit('loading', true);
      const inputFiles = document.getElementsByClassName('input_file');
      const fileForm = new FormData();
      fileForm.append('districtDigit1', this.districtCodeFirst);
      fileForm.append('mode', 'R');
      fileForm.append('hospitalId', this.userOrganTargetId);
      fileForm.append('fileA', inputFiles[0].files[0]);
      fileForm.append('fileB', inputFiles[1].files[0]);
      if (this.districtCodeFirst === 'I') {
        fileForm.append('fileC', inputFiles[2].files[0]);
      }
      Hospital.hospitalDocumentRegist(fileForm).then(res => {
        this.$store.commit('loading', false);
        if (res && res.data.rt === 200) {
          this.$alert('업로드되었습니다.', '알림', 'success').then(() => {
            this.$emit('change');
          });
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.basic__form_box {
  padding: 0 48px;
}
</style>
