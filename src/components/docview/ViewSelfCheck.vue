<template>
  <div class="popup_content">
    <v-popuptitle divclass="bg__form_ver" message="자율점검표" imgsrc="common/ic_check_blue.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver">
      <div class="row">
        <div class="inner--right">
          <a v-if="adminOrganType === 'AD'" href="javascript:;" class="comm__red_bd_btn d_inblock fwn commp2 bg_white btn_l_size wid120" @click="reset">
            <img src="@/assets/images/sub/ic_reset.png" />
            초기화
          </a>
          <a href="javascript:;" class="comm__green_bd_btn d_inblock fwn commp2 bg_white btn_l_size ml10 wid120" @click="htmlToPDF">
            <img src="@/assets/images/sub/ic_download_20.png" />
            다운로드
          </a>
          <a href="javascript:;" class="comm__blue_bd_btn d_inblock fwn commp2 bg_white btn_l_size ml10 wid120" @click="htmlToPdfPrint">
            <img src="@/assets/images/sub/ic_print_20.png" />
            인쇄
          </a>
        </div>
      </div>

      <div class="bg_white mt20 pb20">
        <div class="pdf_page_wrap" ref="pdfArea" :key="pdfRefreshKey">
          <div class="lcommp tac fwb">경기도 초등학생 치과주치의사업 자율점검표</div>

          <p class="commp2 fwb mt20">등록 사항</p>
          <ColumnTable :col="2" width="180" height="46" :data="infoData" class="mt10" />

          <p class="commp2 fwb mt20">치과주치의사업 담당 인력<span class="commp fwn ml15">※ 전체 인력이 아님</span></p>
          <ColumnSingleTable width="180" height="46" :data="personnelData" class="mt10" />

          <p class="commp2 fwb mt20">치과주치의사업 참여현황<span class="commp fwn ml15">※ 계약기간 5년</span></p>
          <ColumnSingleTable width="180" height="46" :data="participationData" class="mt10" />

          <div v-for="(block, index) in hospitalSelfCheck" :key="index" :class="index > 0 ? 'mt30' : 'mt20'">
            <p v-if="index === 0" class="commp2 fwb">점검사항</p>
            <p :class="{ mt10: index === 0 }" class="commp5 fwb">{{ index + 1 }}. {{ block.title }}</p>
            <CheckTable :col="[56, '*', 200]" :thead="['연번', '점검사항', '점검결과']" :list="block.list" :options="['양호', '개선필요']" :data="checkData" :readonly="true" class="mt10" />
          </div>

          <p class="commp2 fwb mt20">서명</p>
          <ColumnTable :col="2" width="180" height="46" :data="signData" class="mt10" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';
import ColumnTable from '@/components/common/ColumnTable';
import ColumnSingleTable from '@/components/common/ColumnSingleTable';
import CheckTable from '@/components/common/CheckTable';
import SelfCheck from '@/apis/SelfCheck';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'ViewSelfCheck',
  props: ['dataObject'],
  components: {
    'v-popuptitle': popupTitle,
    ColumnTable,
    ColumnSingleTable,
    CheckTable,
  },
  computed: {
    ...mapState('doc', ['hospitalSelfCheck']),
    ...mapState('user', ['userOrganTargetType', 'adminOrganType', 'selfCheckListIsDone']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
  data() {
    return {
      infoData: {
        기관명: '',
        요양기관번호: '',
        대표자명: '',
        전화번호: '',
        '주소 (소재지)': '',
        '국가검진기관 지정 여부': '',
      },
      signData: {
        '최종 제출일': '',
        '위 점검자(대표자)': '',
      },
      personnelData: [
        {
          head: '담당 인력',
          col: 2,
          body: [],
          highlight: [5],
        },
      ],
      participationData: [
        {
          head: '계약기간',
          col: 2,
          body: [],
        },
        {
          head: '비고',
          col: 1,
          body: [],
        },
      ],
      checkData: {
        sc_1: null,
        sc_2: null,
        sc_3: null,
        sc_4: null,
        sc_5: null,
        sc_6: null,
        sc_7: null,
        sc_8: null,
        sc_9: null,
        sc_10: null,
        sc_11: null,
        sc_12: null,
        sc_13: null,
        sc_14: null,
        sc_15: null,
        sc_16: null,
        sc_17: null,
      },
      healthCareName: '',
      pdfRefreshKey: 0,
    };
  },
  created() {
    if (this.districtCodeFirst !== 'C') {
      alert('잘못된 접근입니다.');
      this.$router.push('/');
      return false;
    }
    if (this.userOrganTargetType === 'HP' && !this.selfCheckListIsDone) {
      alert('자율점검표 제출 전입니다.');
      this.$router.push('/').catch(() => {});
      return false;
    }
    this.fetchInfo();
  },
  methods: {
    fetchInfo() {
      this.$store.commit('loading', true);
      SelfCheck.hospitalSelfCheckInfo(this.dataObject.hospitalId).then(res => {
        this.$store.commit('loading', false);
        if (!res) {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
          this.$router.push('/');
          return;
        }
        if (res.data.rt === 200) {
          this.healthCareDistrictName = res.data.healthCareDistrictName;
          this.infoData.기관명 = res.data.hospitalName;
          this.infoData.요양기관번호 = res.data.hospitalMedicalNum;
          this.infoData.대표자명 = res.data.hospitalCeo;
          this.infoData.전화번호 = res.data.hospitalTel;
          this.infoData['주소 (소재지)'] = res.data.hospitalAddress;
          this.infoData['국가검진기관 지정 여부'] = res.data.form.registrationDetails.nationInspectionAgencyDesignation > 0 ? '지정 X' : '지정 O';

          this.signData['최종 제출일'] = res.data.lastdate;
          this.signData['위 점검자(대표자)'] = res.data.hospitalCeo;

          this.personnelData[0].body.push(`치과의사: &nbsp;${res.data.form.registrationDetails.responsiblePersonnel.dentist || 0}명`);
          this.personnelData[0].body.push(`간호사: &nbsp;${res.data.form.registrationDetails.responsiblePersonnel.nurse || 0}명`);
          this.personnelData[0].body.push(`치과위생사: &nbsp;${res.data.form.registrationDetails.responsiblePersonnel.dentalHygienist || 0}명`);
          this.personnelData[0].body.push(`간호조무사: &nbsp;${res.data.form.registrationDetails.responsiblePersonnel.nursingAssistant || 0}명`);
          this.personnelData[0].body.push(`기타: &nbsp;${res.data.form.registrationDetails.responsiblePersonnel.others || 0}명`);
          this.personnelData[0].body.push(`합계: &nbsp;${res.data.form.registrationDetails.responsiblePersonnel.total || 0}명`);

          this.participationData[0].body.push(`계약일: &nbsp;${res.data.form.registrationDetails.participationStatus.contractDate.replaceAll('-', '.')}`);
          this.participationData[0].body.push(`종료일(예정): &nbsp;${res.data.form.registrationDetails.participationStatus.expectedEndDate.replaceAll('-', '.')}`);
          this.participationData[1].body.push(res.data.form.registrationDetails.participationStatus.etc || '-');

          this.checkData = res.data.form.checkItems;

          this.healthCareName = res.data.healthCareDistrictName;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          this.$router.push('/');
        }
      });
    },
    getFileName() {
      const date = new Date();
      const now =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      return `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.healthCareName.replaceAll(' ', '_')}_${this.infoData.기관명}_자율점검표_${now}`;
    },
    htmlToPDF() {
      const name = this.getFileName();
      this.$htmlToPdf(this.$refs.pdfArea, name);
      this.pdfRefreshKey += 1;
    },
    htmlToPdfPrint() {
      this.$htmlToPdfPrint(this.$refs.pdfArea);
      this.pdfRefreshKey += 1;
    },
    htmlToPdfDownload() {
      const pdf = this.$htmlToPdfDownload(this.$refs.pdfArea);
      this.pdfRefreshKey += 1;
      return pdf;
    },
    reset() {
      this.$confirm('자율점검표를 초기화하시겠습니까?', '알림', 'question')
        .then(() => {
          this.$store.commit('loading', true);
          SelfCheck.hospitalSelfCheckReset(this.dataObject.hospitalId).then(res => {
            this.$store.commit('loading', false);
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
  },
};
</script>

<style></style>
