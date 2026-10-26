<template>
  <div class="popup_content">
    <v-popuptitle message="개인정보활용동의서" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver pt30">
      <!-- <table class="comm__table bill__table ml60" style="width: 800px;">
        <tbody>
          <tr>
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6;"><p class="scommp fwb">개인정보활용동의서</p></td>
            <td style="border: 1px solid #cad5e6;"><p class="commp fwn c_black2 mt5">{{ infoAgreeFileUInfo.originName }}</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6;"><a :href="infoAgreeFileUInfo.fullPath" class="d_inblock wid_100 btn_m_size inner--right comm__blue_btn" download>다운로드</a></td>
          </tr>
          <tr v-if="districtCodeFirst === 'A' && infoAgreeFileRInfo.originName">
            <td class="bg_blue" style="border: 1px solid #cad5e6;"><p class="scommp fwb">개인정보처리위탁동의서</p></td>
            <td style="border: 1px solid #cad5e6;"><p class="commp fwn c_black2 mt5">{{ infoAgreeFileRInfo.originName }}</p></td>
            <td class="wid120" style="border: 1px solid #cad5e6;"><a :href="infoAgreeFileRInfo.fullPath" class="d_inblock wid_100 btn_m_size inner--right comm__blue_btn" download>다운로드</a></td>
          </tr>
        </tbody>
      </table>
      <a href="javascript:;" @click="popupOpen({contents: 'registAgreement', params: {studentId: dataObject.studentId, businessDivision: dataObject.businessDivision, update: true}})" class="comm__red_btn btn_m_size2 wid130 commp inner--right mt30 mr10">재등록</a> -->
      <template v-if="infoAgreeFileType === 'C001900006'">
        <!-- 직접 보관 조회 -->
        <a
          v-if="!endBusiness('treatment')"
          href="javascript:;"
          class="d_inblock comm__red_btn btn_m_size wid_100 commp inner--right"
          @click="popupOpen({ contents: 'checkAgreement', params: { studentId: dataObject.studentId, businessDivision: dataObject.businessDivision, update: true, customCancel: 'viewAgreement' } })"
        >
          재등록
        </a>
        <div class="float_none"></div>
        <div class="bg_white mt20" style="padding: 30px 20px">
          <p class="commp2 fwb">개인정보활용동의서 직접 보관</p>
          <p class="mt10 c_red scommp">※ 수정이 필요한 경우 [재등록] 버튼을 이용해 주세요.</p>
          <p class="commp fwb mt20">
            보관 기관
            <span class="c_red">*</span>
          </p>
          <div class="row flex_set">
            <div class="flex_item flex_size_s2">
              <div class="m__putbox mt10">
                <input type="text" class="comm_put" :value="organType" readonly />
              </div>
            </div>
            <div v-if="!!organTypeEtc" class="flex_item flex_size_m ml10">
              <div class="m__putbox mt10">
                <input type="text" class="comm_put" :value="organTypeEtc" readonly />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 파일 업로드 조회 -->
        <a v-if="districtCodeFirst === 'A'" href="javascript:;" class="d_inblock wid175 btn_m_size" :class="{ comm__blue_btn: iafUOn, comm__blue_bd_btn: !iafUOn }" @click="change(true)">
          개인정보활용동의서
        </a>
        <a v-if="districtCodeFirst === 'A'" href="javascript:;" class="d_inblock wid175 btn_m_size ml5" :class="{ comm__blue_btn: !iafUOn, comm__blue_bd_btn: iafUOn }" @click="change(false)">
          개인정보처리위탁동의서
        </a>
        <a href="javascript:;" class="d_inblock wid_100 btn_m_size inner--right comm__blue_btn" download @click="download(thisPath)">다운로드</a>
        <a
          v-if="!endBusiness('treatment')"
          href="javascript:;"
          class="d_inblock comm__red_btn btn_m_size wid_100 commp inner--right mr10"
          @click="popupOpen({ contents: 'registAgreement', params: { studentId: dataObject.studentId, businessDivision: dataObject.businessDivision, update: true, customCancel: 'viewAgreement' } })"
        >
          재등록
        </a>
        <a
          v-if="districtCodeFirst === 'A' && ['CT', 'HC'].includes(userOrganTargetType) && dataObject.businessDivision === 'C'"
          href="javascript:;"
          class="d_inblock comm__red_bd_btn btn_m_size wid_100 commp inner--right mr10"
          @click="agreementReset"
          >초기화</a
        >
        <div class="float_none"></div>
        <div v-if="!iafUPDF" v-show="iafUOn" class="mt20"><img :src="iafUPath" /></div>
        <pdf v-else v-show="iafUOn" v-for="i in uPDFPages" :key="i" :page="i" :src="iafUPath" class="mt20"></pdf>
        <template v-if="iafRLoad">
          <p v-if="isSeoulChildAppAgree && !infoAgreeFileRId" v-show="!iafUOn" class="fwb xlcommp">APP 동의 처리 완료</p>
          <template v-else>
            <div v-if="!iafRPDF" v-show="!iafUOn" class="mt20"><img :src="iafRPath" /></div>
            <pdf v-else v-show="!iafUOn" v-for="i in rPDFPages" :key="i" :page="i" :src="iafRPath" class="mt20"></pdf>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import Business from '@/apis/Business';
import Hospital from '@/apis/Hospital';
import pdf from 'vue-pdf';
import popupTitle from '@/components/popup/PopupTitle.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  props: ['dataObject'],
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName', 'endBusiness']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToDivisionCodeName']),
  },
  data() {
    return {
      thisPath: '',
      iafUPath: '',
      iafRPath: '',
      iafUOn: true,
      thisPDF: true,
      iafRLoad: false,
      iafUPDF: true,
      iafRPDF: true,
      uPDFPages: 0,
      rPDFPages: 0,
      infoAgreeFileType: null,
      infoAgreeFileUId: null,
      infoAgreeFileRId: null,
      infoAgreeFileUInfo: {},
      infoAgreeFileRInfo: {},
      studentName: '',
      healthCareName: '',
      hospitalName: null,
      isSeoulChildAppAgree: false,
      organType: '',
      organTypeEtc: '',
    };
  },
  components: {
    pdf,
    'v-popuptitle': popupTitle,
  },
  created() {
    this.infoAgreeInfo();
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    agreementReset() {
      this.$confirm(`${this.dataObject.studentName} 아동의 개인정보활용동의 내역을 초기화하시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            studentBusinessId: this.dataObject.studentBusinessId,
          };
          Business.infoAgreeFileDelete(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('처리되었습니다.', '알림', 'success').then(() => {
                this.$store.dispatch('popup/popupClose');
                this.$store.commit('update');
              });
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
    download(url) {
      this.$store.commit('loading', true);

      const date = new Date();
      const now =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      const divName = this.divName(this.dataObject.businessDivision, false);
      const hospitalName = this.hospitalName ? `${this.hospitalName}_` : '';
      let infoName = '개인정보동의내역';
      if (this.districtCodeFirst === 'A') {
        infoName = this.iafUOn ? '개인정보활용동의서' : '개인정보처리위탁동의서';
      }

      const fileName = `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.healthCareName}_${divName}_${hospitalName}${this.studentName}_${infoName}_${now}.${url.split('.').pop()}`;

      const infoAgreeFileId = this.iafUOn ? this.infoAgreeFileUId : this.infoAgreeFileRId;
      Hospital.infoAgreeDownload({ infoAgreeFileId: infoAgreeFileId }).then(res => {
        this.fileDownload(res.data, fileName);
        this.$store.commit('loading', false);
      });
    },
    change(iafU) {
      if (!iafU) this.iafRLoad = true; // iafR 최초 접근 시 로드
      this.iafUOn = iafU;
      this.thisPath = iafU ? this.iafUPath : this.iafRPath;
      this.thisPDF = iafU ? this.iafUPDF : this.iafRPDF;
    },
    infoAgreeInfo() {
      const form = {
        studentId: this.dataObject.studentId,
        businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
      };
      Hospital.infoAgreeInfo(form).then(res => {
        if (res && res.data.rt === 200) {
          this.studentName = res.data.studentName;
          this.healthCareName = res.data.healthCareName;
          this.hospitalName = res.data.hospitalName;
          this.infoAgreeFileType = res.data.infoAgreeFileType;
          this.infoAgreeFileUId = res.data.infoAgreeFileUId;
          this.infoAgreeFileUInfo = res.data.infoAgreeFileUInfo;
          this.iafUPath = this.thisPath = res.data.infoAgreeFileUInfo.fullPath;
          this.iafUPDF = this.thisPDF = res.data.infoAgreeFileUInfo.ext === 'PDF';
          if (this.iafUPDF) {
            const uSRC = pdf.createLoadingTask(this.iafUPath);
            uSRC.promise.then(pdf => {
              this.uPDFPages = pdf.numPages;
            });
          }
          if (this.districtCodeFirst === 'A') {
            // 서울시에서 아동치과주치의 APP 동의 시 개인정보처리위탁동의 불필요
            if (this.dataObject.businessDivision === 'C' && res.data.studentAppAgree) {
              this.isSeoulChildAppAgree = true;
            }
            if (res.data.infoAgreeFileRInfo) {
              this.infoAgreeFileRId = res.data.infoAgreeFileRId;
              this.infoAgreeFileRInfo = res.data.infoAgreeFileRInfo;
              this.iafRPath = res.data.infoAgreeFileRInfo.fullPath;
              this.iafRPDF = res.data.infoAgreeFileRInfo.ext === 'PDF';
              if (this.iafRPDF) {
                const rSRC = pdf.createLoadingTask(this.iafRPath);
                rSRC.promise.then(pdf => {
                  this.rPDFPages = pdf.numPages;
                });
              }
            }
          }
          this.organType = res.data.organType ? this.codeToDivisionCodeName(res.data.organType) : '';
          this.organTypeEtc = res.data.organTypeEtc;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>
