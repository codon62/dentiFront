<template>
  <div class="popup_content">
    <v-popuptitle message="회계자료 다운로드" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver pt30">
      <table class="comm__table bill__table ml60" style="width: 800px">
        <tbody>
          <tr>
            <td class="bg_blue wid180" style="border: 1px solid #cad5e6"><p class="scommp fwb">통장사본</p></td>
            <td style="border: 1px solid #cad5e6">
              <p class="commp fwn c_black2">{{ fileA ? fileA.originName : '-' }}</p>
            </td>
            <td class="wid130" style="border: 1px solid #cad5e6">
              <BadgeContainer v-if="fileA" :top="-3" :right="-3" :on="isUncheckedDocument(dataObject.hospitalId, 'A')">
                <a href="javascript:;" @click="download('A')" class="wid_100 btn_m_size inner--right comm__blue_btn" download>다운로드</a>
              </BadgeContainer>
              <p v-else class="commp">-</p>
            </td>
          </tr>
          <tr>
            <td class="bg_blue" style="border: 1px solid #cad5e6"><p class="scommp fwb">사업자등록증</p></td>
            <td style="border: 1px solid #cad5e6">
              <p class="commp fwn c_black2">{{ fileB ? fileB.originName : '-' }}</p>
            </td>
            <td class="wid130" style="border: 1px solid #cad5e6">
              <BadgeContainer v-if="fileB" :top="-3" :right="-3" :on="isUncheckedDocument(dataObject.hospitalId, 'B')">
                <a href="javascript:;" @click="download('B')" class="d_inblock wid_100 btn_m_size inner--right comm__blue_btn" download>다운로드</a>
              </BadgeContainer>
              <p v-else class="commp">-</p>
            </td>
          </tr>
          <tr v-if="districtCodeFirst === 'I'">
            <td class="bg_blue" style="border: 1px solid #cad5e6"><p class="scommp fwb">대표 치과의사 날인</p></td>
            <td style="border: 1px solid #cad5e6">
              <p class="commp fwn c_black2">{{ fileC ? fileC.originName : '-' }}</p>
            </td>
            <td class="wid130" style="border: 1px solid #cad5e6">
              <BadgeContainer v-if="fileC" :top="-3" :right="-3" :on="isUncheckedDocument(dataObject.hospitalId, 'C')">
                <a href="javascript:;" @click="download('C')" class="d_inblock wid_100 btn_m_size inner--right comm__blue_btn" download>다운로드</a>
              </BadgeContainer>
              <p v-else class="commp">-</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Bill from '@/apis/Bill';
import popupTitle from '@/components/popup/PopupTitle.vue';
import { mapGetters } from 'vuex';
import BadgeContainer from '@/components/common/BadgeContainer';

export default {
  components: {
    BadgeContainer,
    'v-popuptitle': popupTitle,
  },
  props: ['dataObject'],
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('hospitalDocument', ['isUncheckedDocument']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  data() {
    return {
      fileA: null,
      fileB: null,
      fileC: null,
    };
  },
  created() {
    const form = {
      hospitalId: this.dataObject.hospitalId,
    };
    Bill.hospitalDocumentInfo(form).then(res => {
      if (res && res.data.rt === 200) {
        this.fileA = res.data.fileA;
        this.fileB = res.data.fileB;
        this.fileC = res.data.fileC;
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    async download(type) {
      this.$store.commit('loading', true);
      const { hospitalId } = this.dataObject;
      if (this.isUncheckedDocument(hospitalId, type)) {
        const form = {
          hospitalId,
          hospitalDocumentType: this.valueToCode('C0019', type),
        };
        await Bill.hospitalDocumentCheck(form).then(res => {
          if (res && res.data.rt === 200) {
            this.$store.commit('hospitalDocument/setHospitalDocumentCheck', { hospitalId, type });
          } else {
            this.$store.commit('loading', false);
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            return false;
          }
        });
      }
      this.$store.commit('loading', false);
      location.href = this['file' + type].fullPath;
    },
  },
};
</script>
