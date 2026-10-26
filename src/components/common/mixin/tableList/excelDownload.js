import { mapGetters, mapState } from 'vuex';
import Excel from '@/apis/Excel';

export default {
  data() {
    return {
      targetMonth: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId', 'userOrganTargetName', 'districtCode', 'districtName', 'userOrganTargetType', 'cityType', 'healthCareType']),
    ...mapState('business', ['businessYear']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName', 'healthCareTitle']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  methods: {
    excelListSlide(event) {
      $(event.target).next('.btn_box_excel').stop().slideToggle(300);
    },
    excelListSlideUp() {
      // excel download 리스트 있을 때 밖에 클릭시 사라지게 함
      if ($('#btn_wrap').find('.btn_box_excel')) {
        $('#btn_wrap').find('.btn_box_excel').slideUp(300);
      }
    },
    intToString(num) {
      return num < 10 ? `0${num}` : `${num}`;
    },
    excel(payload, changedCmp) {
      let request = '';
      let fileName = '';
      let form = { districtCode: this.districtCode };
      const districtFirstName = this.districtCodeFirstToName[this.districtCodeFirst];
      switch (this.cmp) {
        case 'managementHealthcare':
          request = Excel.healthcareList;
          fileName = '회원관리_' + this.healthCareTitle;
          break;
        case 'managementCenter':
          request = Excel.centerList;
          fileName = '회원관리_시설(센터)';
          break;
        case 'managementHospital':
          switch (changedCmp) {
            case 'temporaryId':
              request = Excel.hospitalTempList;
              fileName = '회원관리_병원_임시계정';
              form = {
                doCode: this.districtCodeFirst,
              };
              break;
            default:
              request = Excel.hospitalList;
              fileName = '회원관리_병원';
              if (this.cityType === 'E' || this.healthCareType === 'E') {
                form.businessDivisionE = 'Y';
              }
              break;
          }
          break;
        case 'managementSchool':
          request = Excel.schoolList;
          fileName = '회원관리_학교';
          break;
        case 'managementStudentChild':
          request = Excel.managementStudentList;
          fileName = `회원관리_학생_${this.divName('C', false)}`;
          form.tabType = this.valueToCode('C0036', 'C');
          break;
        case 'managementStudentFamdoc':
          request = Excel.managementStudentList;
          fileName = `회원관리_학생_${this.divName('F', false)}`;
          form.tabType = this.valueToCode('C0036', 'F');
          break;
        case 'managementStudentFamdocFirst':
          request = Excel.managementStudentList;
          fileName = '회원관리_학생_학생치과주치의_1학년';
          form.tabType = this.valueToCode('C0036', 'F1');
          break;
        case 'managementStudentFamdocYeonjegu':
          request = Excel.managementStudentList;
          fileName = '회원관리_학생_연제구_학생치과주치의';
          form.tabType = this.valueToCode('C0036', 'FY');
          break;
        case 'managementStudentExamine':
          request = Excel.managementStudentList;
          fileName = `회원관리_학생_${this.divName('E', false)}`;
          form.tabType = this.valueToCode('C0036', 'E');
          break;
        case 'managementStudentDuplicate':
          request = Excel.managementStudentList;
          fileName = '회원관리_학생_중복대상자';
          form.tabType = this.valueToCode('C0036', 'D');
          break;
        case 'managementStudentSpecial':
          request = Excel.managementStudentList;
          fileName = '회원관리_학생_특수학교';
          form.tabType = this.valueToCode('C0036', 'S');
          break;
        case 'businessFamdoc':
          request = Excel.businessStudentFList;
          fileName = `사업관리_${this.divName('F', false)}`;
          form.businessDivision = this.valueToCode('C0003', 'F');
          break;
        case 'businessFamdocFirst':
          request = Excel.businessStudentFList;
          fileName = '사업관리_학생치과주치의_1학년';
          form.businessDivision = this.valueToCode('C0003', 'F1');
          break;
        case 'businessFamdocYeonjegu':
          request = Excel.businessStudentFList;
          fileName = '사업관리_연제구_학생치과주치의';
          form.businessDivision = this.valueToCode('C0003', 'FY');
          break;
        case 'businessChild':
          request = Excel.businessStudentCList;
          fileName = `사업관리_${this.divName('C', false)}`;
          form.businessDivision = this.valueToCode('C0003', 'C');
          break;
        case 'businessExamine':
          request = Excel.businessStudentEList;
          fileName = `사업관리_${this.divName('E', false)}`;
          form.businessDivision = this.valueToCode('C0003', 'E');
          break;
        case 'billClaim':
          switch (changedCmp) {
            case 'businessFamdoc':
              request = Excel.businessStudentFList;
              fileName = `사업관리_${this.divName('F', false)}`;
              form.businessDivision = this.valueToCode('C0003', 'F');
              break;
            case 'businessExamine':
              request = Excel.businessStudentEList;
              fileName = `사업관리_${this.divName('E', false)}`;
              form.businessDivision = this.valueToCode('C0003', 'E');
              break;
            default:
              request = Excel.billMonthClaimList;
              fileName = '비용청구서_청구/지급';
              break;
          }
          break;
        case 'hospitalBill':
          request = Excel.hospitalBillClaimList;
          fileName = `${this.userOrganTargetName}_검진비지급내역`;
          form = { hospitalId: this.userOrganTargetId };
          break;
        case 'schoolBill':
          request = Excel.schoolBillClaimList;
          fileName = `${this.userOrganTargetName}_비용청구서`;
          form = { schoolId: this.userOrganTargetId };
          break;
        case 'schoolExamine':
          request = Excel.schoolStudentList;
          fileName = `${this.userOrganTargetName}_${this.divName('E', false)}`;
          form.schoolId = this.userOrganTargetId;
          form.businessDivision = this.valueToCode('C0003', 'E');
          form.adCheck = 'N';
          break;
        case 'schoolFamdoc':
          request = Excel.schoolStudentList;
          fileName = `${this.userOrganTargetName}_${this.divJoin('S') ? this.divName('S', false) : this.divName('F', false)}`;
          form.schoolId = this.userOrganTargetId;
          if (!this.divJoin('S')) {
            form.businessDivision = this.valueToCode('C0003', 'F');
          }
          form.adCheck = 'N';
          break;
        case 'hospitalExamine':
          request = Excel.schoolStudentList;
          fileName = `${this.userOrganTargetName}_${this.divName('E', false)}`;
          form.hospitalId = this.userOrganTargetId;
          form.businessDivision = this.valueToCode('C0003', 'E');
          form.adCheck = 'N';
          break;
        case 'statsRecord': //종합실적 엑셀
          switch (this.districtCodeFirst) {
            case 'A':
              request = Excel.statisticsRecordSeoulList;
              form.tabType = this.valueToCode('C0003', this.recordStbDiv);
              break;
            case 'C': {
              request = Excel.statisticsRecordGyeonggiList;
              const now = new Date();
              // 사업 년도이면 (현재 월 - 1)월 까지, 아니면 12월까지
              const targetMonth = now.getFullYear() === this.businessYear ? now.getMonth() : 12;
              form.month = this.$route.query.month ? this.$route.query.month : this.intToString(targetMonth);
              break;
            }
            case 'D':
              request = Excel.statisticsRecordBusanList;
              form.tabType = this.valueToCode('C0003', this.recordStbDiv);
              break;
            default:
              request = Excel.statisticsRecordOtherList;
              break;
          }
          if (this.districtCodeFirst === 'C') {
            fileName = `${districtFirstName} 초등학생 치과주치의 종합실적 요약표(${this.districtName}_${Number(form.month)}월)`;
          } else {
            fileName = `${districtFirstName}${districtFirstName !== this.districtName ? '_' + this.districtName : ''}_종합실적`;
          }
          break;
        case 'statsEduSite':
          request = Excel.eduSiteStatistics;
          fileName = '학교용 교육 학습 현황';
          break;
        case 'statsSchoolStatistics':
          request = Excel.schoolStatistics;
          fileName = '학교별 현황';
          break;
        case 'statsSchoolStatisticsDetail':
          request = Excel.schoolStatisticsDetail;
          fileName = '학교별 현황';
          if (payload.districtName) {
            fileName = `${payload.districtName}_${fileName}`;
          }
          break;
        default:
          this.$alert('준비중입니다.', '알림', 'warning');
          return false;
      }
      Object.assign(form, this.$route.query);
      if (payload) {
        Object.assign(form, payload);
      }
      this.$store.commit('loading', true);

      const date = new Date();
      const now =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      let xlsxName = `${this.businessYear}년_${this.districtName}_${fileName}_${now}.xlsx`;

      if (this.cmp === 'statsRecord') {
        // 종합실적만 excel 파일명변경
        if (this.districtCodeFirst === 'C') {
          xlsxName = `${date.getFullYear()}년 ${fileName}.xlsx`;
        } else {
          xlsxName = `${date.getFullYear()}년_${fileName}_${now}.xlsx`;
        }
      }

      request(form).then(async res => {
        if (res.data.type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
          this.fileDownload(res.data, xlsxName);
        } else {
          let alertMsg = '알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.';
          if (res.data.type === 'application/json') {
            await res.data.text().then(json => {
              alertMsg += ` 오류 코드 : ${JSON.parse(json).rt}`;
            });
          }
          alert(alertMsg);
        }
        this.$store.commit('loading', false);
      });
    },
  },
};
