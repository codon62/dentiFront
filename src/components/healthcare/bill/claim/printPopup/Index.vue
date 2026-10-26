<template>
  <div class="popup_content">
    <v-popuptitle divclass="bg__form_ver" message="비용 청구서" imgsrc="sub/ic_write.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver">
      <div class="row mb20">
        <div class="inner--right">
          <a href="javascript:;" class="comm__green_bd_btn d_inblock fwn commp2 bg_white btn_l_size wid120" @click="htmlToPDF">
            <img src="@/assets/images/sub/ic_download_20.png" />
            다운로드
          </a>
          <a href="javascript:;" class="comm__blue_bd_btn d_inblock fwn commp2 bg_white btn_l_size ml10 wid120" @click="htmlToPdfPrint">
            <img src="@/assets/images/sub/ic_print_20.png" />
            인쇄
          </a>
        </div>
      </div>
      <div ref="pdfArea" :key="pdfRefreshKey" class="bg_white comm__inner">
        <div class="sub__section">
          <div class="titbox row">
            <span class="icon d_inblock"><img src="@/assets/images/common/ic_cost.png" /></span>
            <p class="commp2 d_inblock fwb ml5">청구기관</p>
          </div>
          <div class="section_con">
            <hrznt-table :data="billOrgan"></hrznt-table>
          </div>
        </div>

        <div class="comm__line mt20"></div>
        <div class="sub__section mt30">
          <div class="titbox row">
            <span class="icon d_inblock"><img src="@/assets/images/common/ic_cost.png" /></span>
            <p class="commp2 d_inblock fwb ml5">청구 금액</p>
          </div>
          <title-and-table :data="billPrice"></title-and-table>
        </div>

        <template v-if="['CT', 'HC'].includes(userOrganTargetType)">
          <div class="comm__line mt20"></div>
          <v-list :title="['I', 'J'].includes(districtCodeFirst) ? '학교' : '학생'" :cmp="cmp" divclass="mt30" :table="table"></v-list>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';
import Bill from '@/apis/Bill';
import HrzntTable from '@/components/common/HrzntTable.vue';
import TitleAndTable from '@/components/common/TitleAndTable.vue';
import List from '@/components/common/List.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import Hospital from '@/apis/Hospital';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-list': List,
    HrzntTable,
    TitleAndTable,
  },
  props: ['dataObject'],
  computed: {
    ...mapState('user', ['districtCode', 'userOrganTargetType', 'userOrganTargetName', 'adminOrganType']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode', 'codeToValueList']),
  },
  data() {
    return {
      cmp: 'billPrintPopup',
      healthCareName: '',
      hospitalName: '',
      schoolName: '',
      businessDivision: '',
      month: '',
      billOrgan: [],
      billPrice: [],
      table: {
        maxNum: 1,
        col: ['*'],
        th: [],
        list: [],
      },
      pdfRefreshKey: 0,
    };
  },
  created() {
    this.$store.commit('loading', true);
    const form = {
      districtCode: this.dataObject.districtCode ? this.dataObject.districtCode : this.userOrganTargetType === 'HP' ? this.districtCodeFirst : this.districtCode,
      printable: true,
      billMonthId: this.dataObject.billMonthId,
      schoolId: this.dataObject.schoolId,
      hospitalId: this.dataObject.hospitalId,
      businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
      billStatusN: this.dataObject.billStatusN,
      billStatusY: this.dataObject.billStatusY,
      studentToSchoolGrade1: this.dataObject.studentToSchoolGrade1,
      studentToSchoolNull: this.$route.query.studentToSchoolNull,
    };
    const request = this.userOrganTargetType === 'HP' ? Hospital.hospitalBillSchoolDetailList : Bill.claimInfoList;
    request(form).then(res => {
      this.$store.commit('loading', false);
      if (res && res.data.rt === 200) {
        // code convert
        res.data.billInfo.businessDivision = this.codeToValue(res.data.billInfo.businessDivision);
        res.data.billInfo.hospitalType = this.codeToValue(res.data.billInfo.hospitalType);
        res.data.billInfo.schoolType = this.codeToValue(res.data.billInfo.schoolType);
        // code convert end
        for (const i in res.data.billList) {
          res.data.billList[i].businessDivision = res.data.billInfo.businessDivision; // businessDivision 삽입
          res.data.billList[i].hospitalId = res.data.billInfo.hospitalId; // hospitalId 삽입
        }
        if (['I', 'J'].includes(this.districtCodeFirst)) {
          const billList = this.codeToValueList(res.data.billList);
          let list = [];
          billList.forEach(item => {
            const obj = list.find(o => o.schoolId === item.schoolId);
            if (obj) {
              obj.studentCount++;
              obj.totalClaimPrice += item.totalClaimPrice;
            } else {
              list.push({
                schoolId: item.schoolId,
                businessDivision: item.businessDivision,
                schoolName: item.schoolName,
                studentCount: 1,
                totalClaimPrice: item.totalClaimPrice,
              });
            }
          });
          this.table.maxNum = list.length;
          this.table.list = list;
        } else {
          this.table.maxNum = res.data.billList.length;
          this.table.list = this.codeToValueList(res.data.billList);
        }
        const data = res.data.billInfo;
        this.healthCareName = data.districtCodeFirst === 'C' ? data.districtSiName : data.districtGunguName;
        this.hospitalName = data.hospitalName;
        this.schoolName = data.schoolName;
        this.businessDivision = data.businessDivision;
        this.month = parseInt(data.claimMonth);

        if (this.userOrganTargetType === 'HP') {
          this.billOrgan = [
            [
              [this.districtCodeFirst === 'C' ? '시군명' : this.districtCodeFirst === 'I' ? '교육지원청' : this.districtCodeFirst === 'J' ? '지역구' : '보건소', data.districtGunguName],
              ['학교명', data.schoolName],
            ],
            [
              ['학교 사업자등록번호', data.schoolRegNum],
              ['행정실 이메일', data.schoolEmail],
            ],
          ];
        } else if (this.userOrganTargetType === 'SC') {
          this.billOrgan = [
            [
              [this.districtCodeFirst === 'C' ? '시군명' : this.districtCodeFirst === 'I' ? '교육지원청' : this.districtCodeFirst === 'J' ? '지역구' : '보건소', data.districtGunguName],
              ['병원명', data.hospitalName],
            ],
            [
              ['병원 전화번호', data.hospitalTel],
              ['사업자등록번호', data.hospitalRegNum],
            ],
            [
              ['소재지', data.hospitalAddress],
              ['지급계좌', data.bankName + '/' + data.hospitalAccount + '/' + data.hospitalDepositor],
            ],
          ];
        } else {
          this.billOrgan = [
            [
              [this.districtCodeFirst === 'C' ? '시군명' : this.districtCodeFirst === 'I' ? '교육지원청' : this.districtCodeFirst === 'J' ? '지역구' : '보건소', data.districtGunguName],
              ['청구 월', `${this.districtCodeFirst === 'I' ? this.businessYear + '년 ' : ''}${parseInt(data.claimMonth)}월`],
            ],
            [
              [this.districtCodeFirst === 'I' ? '치과병의원명' : '치과의원명', data.hospitalName],
              ['전화번호', data.hospitalTel],
            ],
            [
              ['사업자등록번호', data.hospitalRegNum],
              ['요양기관번호', data.hospitalMedicalNum],
            ],
            [
              ['소재지', data.hospitalAddress],
              ['지급계좌', data.bankName + '/' + data.hospitalAccount + '/' + data.hospitalDepositor],
            ],
          ];
        }
        if (this.districtCodeFirst === 'C') {
          this.billOrgan[0][0] = ['시군명', data.districtSiName];
        }
        if (this.districtCodeFirst === 'I') {
          this.billOrgan[2][1] = ['대표자명', [data.hospitalCeo, data.hospitalCeoSignPath]];
        }
        const title = this.divName(data.businessDivision, true);
        const claimInfo = data.claimInfo;
        this.billPrice = {
          ...(!(this.districtCodeFirst === 'A' && this.businessDivision.includes('F')) && { title: title }),
          th: [
            ...(this.districtCodeFirst === 'A' && this.businessDivision.includes('F') ? [title] : []),
            ...(this.districtCodeFirst === 'C' ? ['학교 구분'] : []),
            title + ' 청구금액(A)',
            '실시 인원(B)',
            '청구금액(원) (AxB)',
          ],
          td:
            this.userOrganTargetType === 'HP'
              ? [
                  [
                    [data.totalBillPrice, 'won'],
                    [data.countBillPersonnel + '명', 'person'],
                    [data.totalClaimPrice, 'won'],
                  ],
                ]
              : claimInfo.claimList.map(item => [
                  ...(this.districtCodeFirst === 'A' && this.businessDivision.includes('F') ? [[item.billPrice == 48000 ? '서울시 사업' : '복지부 시범사업']] : []),
                  ...(this.districtCodeFirst === 'C' ? [[item.schoolType, 'schoolType']] : []),
                  ['I', 'J'].includes(this.districtCodeFirst)
                    ? [this.numberWithCommas(item.schoolCount) + '개교']
                    : ['A', 'D'].includes(this.districtCodeFirst) && data.businessDivision === 'C'
                    ? ['-']
                    : [item.billPrice, 'won'],
                  [item.countPersonnel + '명', 'person'],
                  [item.totalPrice, 'won'],
                ]),
        };
        if (this.billPrice.td.length > 1) {
          this.billPrice.td.push([['합계'], [claimInfo.totalClaimPersonnel + '명', 'person'], [claimInfo.totalClaimPrice, 'won']]);
        }
        if (data.businessDivision === 'C') {
          // 아동치과주치의
          this.billPrice.th = [title + ' 청구금액', '실시 인원', '청구금액(원)'];
          if (this.districtCodeFirst === 'A') {
            // 서울
            this.table.th = ['번호', '검진유형', '시설(센터)명', '생년월일', '아동이름', '검진금액', '진료금액', '청구금액'];
          } else if (this.districtCodeFirst === 'D') {
            // 부산
            this.table.th = ['번호', '검진유형', '시설(센터)명', '생년월일', '아동이름', '검진금액', '심화치료금액', '본인부담금', '청구금액'];
          }
        } else {
          this.table.th = ['번호', '검진유형', '학교', '학년', '반', '번호', '생년월일', '학생이름', '청구금액'];
        }
        if (this.districtCodeFirst === 'I') {
          // 전북
          this.table.th = ['번호', '진료유형', '학교', '진료 완료 인원', '청구금액'];
          this.billPrice.th = ['진료 학교 수(개교)', '실시 인원(명)', '청구금액(원)'];
        } else if (this.districtCodeFirst === 'J') {
          // 울산
          this.table.th = ['번호', '검진유형', '학교명', '검진 완료 인원(학교별)', '청구금액(학교별)'];
          this.billPrice.th = ['검진 참여 학교 수(개교)', '실시 인원(명)', '청구금액(원)'];
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    ...mapActions('popup', ['popupClose']),
    htmlToPDF() {
      const name = this.getFileName();
      this.$htmlToPdfNotBreak(this.$refs.pdfArea, name);
      this.pdfRefreshKey += 1;
    },
    htmlToPdfPrint() {
      this.$htmlToPdfPrintNotBreak(this.$refs.pdfArea);
      this.pdfRefreshKey += 1;
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

      const divName = this.divName(this.businessDivision, false);
      let fileName;
      switch (this.userOrganTargetType) {
        case 'HP':
          fileName = `${this.healthCareName}_${this.schoolName}_${divName}_${this.userOrganTargetName}_비용청구서_${now}.pdf`;
          break;
        case 'SC':
          fileName = `${this.healthCareName}_${this.hospitalName}_${divName}_${this.userOrganTargetName}_비용청구서_${now}.pdf`;
          break;
        default:
          fileName = `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.healthCareName}_${divName}_${this.hospitalName}_${this.month}월_비용청구서_${now}.pdf`;
          break;
      }
      return fileName;
    },
  },
};
</script>
