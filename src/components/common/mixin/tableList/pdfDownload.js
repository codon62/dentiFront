import { mapGetters, mapState } from 'vuex';
import Pdf from '@/apis/Pdf';
import axios from 'axios';

export default {
  computed: {
    ...mapState('user', ['userOrganTargetId', 'userOrganTargetName', 'districtCode', 'districtName', 'userOrganTargetType']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('business', ['districtInfo', 'divJoin', 'divName']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  methods: {
    pdfListSlide() {
      $('#btn_wrap').find('.btn_box_pdf').stop().slideToggle(300);
    },
    pdfListSlideUp() {
      // pdf download 리스트 있을 때 밖에 클릭시 사라지게 함
      if ($('#btn_wrap').find('.btn_box_pdf')) {
        $('#btn_wrap').find('.btn_box_pdf').slideUp(300);
      }
    },
    intToString(num) {
      return num < 10 ? `0${num}` : `${num}`;
    },
    pdfDownload(businessDivision, type, subType) {
      this.$store.commit('loading', true);
      Pdf.pdfLog({ downloadLogDescription: this.valueToCode('C0043', type) }).then(res => {
        if (res && res.data.rt === 200) {
          // 크롬 보안 이슈로 인해 axios 거쳐 다운로드
          const href = this.pdfHref(businessDivision, type, subType);
          const fileName = href.substring(href.lastIndexOf('/') + 1);
          axios.get(href, { responseType: 'blob' }).then(res => {
            this.fileDownload(res.data, fileName);
            this.$store.commit('loading', false);
          });
          if (type === 'A') {
            this.$alert('', '알림', 'info', {
              html: '학생의 치과주치의사업 개인정보 동의서를 서면으로 받은 이력이<br/>없는 경우 다운로드시 파일이 존재하지 않습니다.<br/><br/>* APP으로 동의한 경우 비용청구서(엑셀파일) 세부내역에서<br/>확인 가능',
            });
          }
        } else {
          this.$store.commit('loading', false);
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    pdfHref(businessDivision, type, subType) {
      let filePath;
      let typeName;
      switch (type) {
        case 'A':
          typeName = '개인정보동의내역';
          break;
        case 'B':
          typeName = '문진표';
          break;
        case 'C':
          typeName = '통보서';
          break;
        case 'D':
          typeName = `비용청구서${subType}`;
          break;
        case 'T':
          typeName = '내역서';
          break;
      }
      switch (this.userOrganTargetType) {
        case 'HC':
          filePath = `${type === 'D' ? 'bill' : 'business'}/${this.districtCode}/${this.districtName}`;
          break;
        case 'HP':
          filePath = `hospital/${this.userOrganTargetId}/${this.userOrganTargetName}`;
          break;
        case 'SC':
          filePath = `school/${this.userOrganTargetId}/${this.userOrganTargetName}`;
          break;
      }
      if (this.divJoin('S') && ['HP', 'SC'].includes(this.userOrganTargetType)) {
        businessDivision = 'S';
      }
      let divName;
      switch (businessDivision) {
        case 'F1':
          divName = '1학년 학생치과주치의';
          break;
        case 'FY':
          divName = '연제구 학생치과주치의';
          break;
        default:
          divName = this.divName(businessDivision, false);
          break;
      }
      filePath = `https://kr.object.gov-ncloudstorage.com/dt${this.businessYear}-${this.isDev ? 'develop' : this.districtInfo.eng}/upload/zip/${filePath}${
        businessDivision ? '_' + divName : ''
      }_${typeName}.zip`;

      filePath = filePath.replaceAll('\r\n', ' ');
      filePath = filePath.replaceAll('\n', ' ');

      return filePath;
    },
  },
};
