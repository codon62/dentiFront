<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">청구/지급</p>
    </div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <div class="sub__section mt30">
        <div class="titbox row">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_cost.png" /></span>
          <p class="commp2 d_inblock fwb ml5">청구기관</p>
          <div v-if="isAccountingData" class="inner--right">
            <BadgeContainer :top="-3" :right="-3" :on="isUncheckedHospital(hospitalId)" class="inner--right">
              <a href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid130 commp" @click="popupOpen({ contents: 'viewHospitalDocument', params: { hospitalId: hospitalId } })">
                회계자료 다운로드
              </a>
            </BadgeContainer>
            <BadgeContainer :top="-3" :right="-3" class="inner--right mr10">
              <a href="javascript:;" class="d_inblock comm__red_btn btn_m_size2 wid130 commp" @click="popupOpen({ contents: 'registHospitalDocument', params: { hospitalId: hospitalId } })">
                회계자료 재등록
              </a>
            </BadgeContainer>
          </div>
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
        <title-and-table :month="month" :data="billPrice"></title-and-table>
      </div>

      <div class="comm__line mt20"></div>
      <v-list title="학생" :cmp="cmp" divclass="mt30" :table="table">
        <a v-if="!(!divJoin('S') && businessDivision === 'E')" href="javascript:;" class="comm__blue_btn btn_m_size2 d_block wid130 commp" @click="billJudge">선택 지급</a>
      </v-list>
    </div>
  </fragment>
</template>

<script>
import Bill from '@/apis/Bill';
import HrzntTable from '@/components/common/HrzntTable.vue';
import TitleAndTable from '@/components/common/TitleAndTable.vue';
import List from '@/components/common/List.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import bill from '@/components/common/mixin/tableList/bill';
import BadgeContainer from '@/components/common/BadgeContainer';

export default {
  mixins: [bill],
  data() {
    return {
      month: null,
      businessDivision: '',
      cmp: 'billClaimDetail',
      billDistrictCode: '',
      hospitalId: '',
      hospitalType: '',
      hospitalDistrictCode: '',
      billOrgan: [],
      billPrice: [],
      table: {
        maxNum: 1,
        col: ['*'],
        th: [],
        list: [],
      },
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['districtCode', 'adminOrganType']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName', 'questionnaireTitle', 'notificationTitle']),
    ...mapGetters('definedCode', ['codeToValue', 'codeToValueList']),
    ...mapGetters('hospitalDocument', ['isUncheckedHospital']),
    isAccountingData() {
      return this.districtCodeFirst === 'I' || (this.districtCodeFirst === 'C' && this.hospitalType !== 'T' && this.billDistrictCode.substring(0, 3) !== this.hospitalDistrictCode.substring(0, 3));
    },
  },
  components: {
    BadgeContainer,
    'v-list': List,
    HrzntTable,
    TitleAndTable,
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    getList() {
      this.$store.commit('tableLoading', true);
      let form = {
        districtCode: this.$route.query.districtCode ? this.$route.query.districtCode : this.districtCode,
        billMonthId: this.$route.query.billMonthId,
        billStatusN: this.$route.query.billStatusN,
        billStatusY: this.$route.query.billStatusY,
        studentToSchoolGrade1: this.$route.query.studentToSchoolGrade1,
        studentToSchoolNull: this.$route.query.studentToSchoolNull,
      };
      Bill.claimInfoList(form).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.billInfo.businessDivision = this.codeToValue(res.data.billInfo.businessDivision);
          res.data.billInfo.hospitalType = this.codeToValue(res.data.billInfo.hospitalType);
          // code convert end
          this.table.maxNum = res.data.billList.length;
          this.table.list = this.codeToValueList(res.data.billList);
          if (!this.table.list.length) {
            this.$router.go(-1); // 검색 > 청구중 필터 걸린 상태에서 지급완료하여 list 개수 없는 경우 대응
          }
          const data = res.data.billInfo;
          this.month = parseInt(data.claimMonth);
          this.businessDivision = data.businessDivision;
          this.billDistrictCode = data.districtCode;
          this.hospitalId = data.hospitalId;
          this.hospitalType = data.hospitalType;
          this.hospitalDistrictCode = data.hospitalDistrictCode;
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
          if (this.districtCodeFirst === 'I') {
            this.billOrgan[2][1] = ['대표자명', data.hospitalCeo];
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
            td: claimInfo.claimList.map(item => [
              ...(this.districtCodeFirst === 'A' && this.businessDivision.includes('F') ? [[item.billPrice == 48000 ? '서울시 사업' : '복지부 시범사업']] : []),
              ...(this.districtCodeFirst === 'C' ? [[item.schoolType, 'schoolType']] : []),
              ['A', 'D'].includes(this.districtCodeFirst) && data.businessDivision === 'C' ? ['-'] : this.districtCodeFirst === 'I' ? [40000, 'wonLow'] : [item.billPrice, 'won'],
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
              this.table.th = [
                'c_bill',
                '번호',
                '시설(센터)명',
                '학생이름<br>(생년월일)',
                '개인정보<br>활용동의',
                this.questionnaireTitle,
                this.notificationTitle,
                '진료 의뢰서',
                '진료 계획서',
                '내역서',
                '검진금액',
                '진료금액',
                '청구금액',
                '청구일',
                '처리 상황',
                '이력 보기',
                '처리',
                '확인',
                '개인정보<br>활용동의<br>초기화',
              ];
            } else if (this.districtCodeFirst === 'D') {
              // 부산
              this.table.th = [
                'c_bill',
                '번호',
                '시설(센터)명',
                '학생이름<br>(생년월일)',
                '개인정보<br>활용동의',
                this.questionnaireTitle,
                this.notificationTitle,
                '내역서',
                '검진금액',
                '심화치료금액',
                '본인부담금',
                '청구금액',
                '청구일',
                '처리 상황',
                '이력 보기',
                '처리',
                '확인',
              ];
            }
          } else {
            if (this.districtCodeFirst === 'J' && this.adminOrganType !== 'AD') {
              this.table.th = ['c_bill', '번호', '학생이름', '학교<br>(학년/반/번호)', '청구금액', '청구일', '처리 상황', '이력 보기', '처리', '확인'];
            } else {
              this.table.th = [
                'c_bill',
                '번호',
                '학생이름<br>(생년월일)',
                '학교<br>(학년/반/번호)',
                '개인정보<br/>활용동의',
                this.questionnaireTitle,
                this.notificationTitle,
                '청구금액',
                '청구일',
                '처리 상황',
                '이력 보기',
                '처리',
                '확인',
              ];
            }
            if (data.businessDivision.includes('F')) {
              // 학생치과주치의
              if (this.districtCodeFirst === 'I') {
                this.billPrice.th = [title + ' 청구금액', '실시 인원', '청구금액(원)'];
              }
            } else if (data.businessDivision === 'E') {
              // 학생구강검진
              if (this.districtCodeFirst === 'G') {
                this.table.th.splice(8, 0, '수수료');
              }
              if (!this.divJoin('S')) {
                delete this.table.th[0]; // 선택검진이 아닌 학생구강검진은 체크박스 필요 없음
                this.table.th.splice(-2, 1); // 선택검진이 아닌 학생구강검진은 처리 버튼 필요 없음
              }
            }
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
        this.$store.commit('tableLoading', false);
      });
    },
  },
  watch: {
    '$route.query'() {
      this.getList();
    },
    update() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>
