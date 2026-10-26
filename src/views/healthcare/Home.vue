<template>
  <div class="dash_board_content">
    <div v-if="districtCodeFirst === 'C'" class="dash__comm_set row mt30">
      <div class="mt20 flex_box">
        <div v-for="(data, index) in gyeonggiBusinessDivisionBill" :key="index" class="dash__comm_box col_span_2 flex_box bg_white" style="justify-content: space-between; padding: 20px 50px">
          <p class="fwb commp3" style="line-height: 72px">{{ data.title }}</p>
          <div>
            <p class="fwb tar">총 비용청구 건 : {{ numberWithCommas(data.values.Bill) }}명</p>
            <p class="fwb tar">총 등록학생 건 : {{ numberWithCommas(data.values.Total) }}명</p>
            <p class="fwb tar">청구율 : {{ Number(data.values.Total) && data.values.Total !== 0 ? ((data.values.Bill * 100) / data.values.Total).toFixed(0) : '-' }}%</p>
          </div>
        </div>
      </div>
      <div class="mt20 flex_box">
        <template v-for="(data, Object, index) in gyeonggiRowData">
          <chart-table-container
            v-if="index <= 1"
            :key="index"
            :title="data.title"
            :content-type="data.contentType"
            :data="data.values"
            chart-type="PieChart"
            custom-class="dash__comm_box col_span_2"
          />
        </template>
      </div>
    </div>
    <div v-else-if="districtCodeFirst === 'J'" class="dash__comm_set row mt30">
      <div class="dash__comm_box inner--left">
        <div class="tit_row row">
          <p class="commp5 c_black2 fwb">사업별 참여 현황</p>
        </div>
        <v-status-by-business :type="1" :data="useData" class="bg_white mt15" />
      </div>
      <div class="dash__comm_box col_span_2 inner--left">
        <div class="tit_row row">
          <p class="commp5 c_black2 fwb">학년별 참여 현황</p>
        </div>
        <v-status-by-grade :type="3" :data="useData" class="bg_white mt15" />
      </div>
    </div>
    <div v-else class="dash__comm_set row mt30">
      <v-item-container
        v-for="(data, object, idx) in rowData"
        :key="idx"
        :class="{ hideDiv: (districtCodeFirst !== 'A' || businessDivisionStatus !== 'C') && idx === 1, col_2: districtCodeFirst !== 'A' || businessDivisionStatus !== 'C' }"
        :title="data.title"
        :toggle-label="getToggleData(data.values)"
        :class-name="'dash__comm_box' + (idx + 1) + ' inner--left'"
        :button="!divJoin('S') ? '바로가기' : ''"
      >
        <template v-for="(info, key, _idx) in data.values" v-slot:[key]>
          <v-item-box
            v-if="info.list"
            :key="_idx"
            :data="
              info.list.map(item => ({
                head: `${item.studentName} (${item.studentBirth})`,
                body: item.userOrganTargetName ? item.userOrganTargetName : '없음',
                foot: idx === 2 ? numberWithCommas(item.totalBillPrice) : item.moddate ? item.moddate : '미작성',
              }))
            "
            :icon="{
              head: require('@/assets/images/common/ic_person_s.png'),
              ...(idx === 2 ? { foot: require('@/assets/images/common/ic_won_s.png') } : null),
            }"
            :msg="data.message"
          />
        </template>
      </v-item-container>
    </div>
    <!--//dash__comm_set-->
    <div class="dash__comm_set row mt40">
      <template v-if="districtCodeFirst === 'C'">
        <chart-table-container
          :title="gyeonggiRowData['businessDivisionCount'].title"
          :content-type="gyeonggiRowData['businessDivisionCount'].contentType"
          :data="gyeonggiRowData['businessDivisionCount'].values"
          chart-type="ColumnChart"
          custom-class="dash__comm_box inner--left"
        />
        <v-item-container button="바로가기" title="공지사항" :toggle-label="getToggleData(gyeonggiNotice.values, false)" class-name="dash__comm_box4 inner--left">
          <template v-for="(info, key) in gyeonggiNotice.values" v-slot:[key]>
            <notice-box
              :data="info.list"
              :title="info.title"
              :key="key"
              :onrowclick="
                item => {
                  info.title.includes('문의')
                    ? $router.push({ path: `${info.rowLink}`, query: { inquiryId: item.inquiryId } })
                    : info.title === '자주하는 질문'
                    ? $router.push({ path: `${info.rowLink}`, query: { faqId: item.faqId } })
                    : $router.push({ path: `${info.rowLink}`, query: { noticeBoardId: item.noticeBoardId } });
                }
              "
              :options="info.options"
            ></notice-box>
          </template>
        </v-item-container>
      </template>
      <template v-else>
        <v-item-container title="사업현황" :toggle-label="getToggleData(billChart.values, false)" class-name="dash__comm_box4 inner--left">
          <template v-for="(info, key, idx) in billChart.values" v-slot:[key]>
            <div v-if="info.list" :key="idx" class="m_inner row">
              <GChart v-if="info.list.length" type="ColumnChart" :options="chartProps['options']" :data="chartData(info)" target="gp__box1" />
              <div v-else v-html="billChart.message"></div>
            </div>
          </template>
        </v-item-container>
        <v-item-container v-if="districtCodeFirst === 'A'" button="바로가기" title="공지사항" :toggle-label="getToggleData(seoulNotice.values, false)" class-name="dash__comm_box4 inner--left">
          <template v-for="(info, key) in seoulNotice.values" v-slot:[key]>
            <notice-box
              :data="info.list"
              :title="info.title"
              :key="key"
              :onrowclick="
                item => {
                  info.title.includes('문의')
                    ? $router.push({ path: `${info.rowLink}`, query: { inquiryId: item.inquiryId } })
                    : info.title === '자주하는 질문'
                    ? $router.push({ path: `${info.rowLink}`, query: { faqId: item.faqId } })
                    : $router.push({ path: `${info.rowLink}`, query: { noticeBoardId: item.noticeBoardId } });
                }
              "
              :options="info.options"
            ></notice-box>
          </template>
        </v-item-container>
        <v-list-box
          v-else
          title="공지사항"
          :data="noticeList"
          :button="{
            label: '바로가기',
            action: () => {
              $router.push('/healthcare/board/notice/list');
            },
          }"
          :onrowclick="
            item => {
              $router.push({ path: '/healthcare/board/notice/contents', query: { noticeBoardId: item.noticeBoardId } });
            }
          "
          :options="{
            baseIcon: require('@/assets/images/common/ic_loudspeaker.png'),
            datapick: true,
            pickEffect: 'New',
            pickCond: item => {
              let target = Date.parse(item.regdate);
              return target > pastDate.getTime() && target < nowDate.getTime();
            },
          }"
        />
      </template>
      <v-manual-box title="사용자 매뉴얼" :data="manualList" :data-img="manualImg" />
    </div>
  </div>
</template>

<script>
import Board from '@/apis/Board';
import ItemContainer from '@/components/dashboard/ItemContainer.vue';
import ItemBox from '@/components/dashboard/ItemBox.vue';
import ListBox from '@/components/dashboard/ListBox.vue';
import ManualBox from '@/components/dashboard/ManualBox.vue';
import StatusByBusiness from '@/components/dashboard/StatusByBusiness.vue';
import StatusByGrade from '@/components/dashboard/StatusByGrade.vue';
import ChartTableContainer from '@/components/dashboard/gyeonggi/ChartTableContainer';
import NoticeBox from '@/components/dashboard/gyeonggi/NoticeBox';
import { GChart } from 'vue-google-charts';
import { mapGetters, mapState } from 'vuex';
import Vue from 'vue';
import VTooltip from 'v-tooltip';

Vue.use(VTooltip);

export default {
  components: {
    'v-item-container': ItemContainer,
    'v-item-box': ItemBox,
    'v-list-box': ListBox,
    'v-manual-box': ManualBox,
    'v-status-by-business': StatusByBusiness,
    'v-status-by-grade': StatusByGrade,
    GChart,
    ChartTableContainer,
    NoticeBox,
  },

  data() {
    return {
      noticeList: [],
      manualList: [],
      manualImg: {
        1: 'ic_center_m',
        2: 'ic_green',
        3: 'ic_hospital_m',
        4: 'ic_publichealth_m',
        5: 'ic_seoulhospital_m',
        6: 'ic_filedownload_m',
        7: 'ic_edu_b',
        8: 'ic_doc',
        9: 'ic_video',
      },
      nowDate: new Date(),
      pastDate: new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), //7일 전 (21.09.06에 변경)
      businessDivisionStatus: 'F',
      chartProps: {
        options: {
          height: 250,
          // 그래프 바 설명 부분 폰트사이즈 조정
          legend: { position: 'top', maxLines: 3, textStyle: { fontSize: 15 } },
          bar: { groupWidth: '25%' },
          colors: ['#1c92a8', '#fd9b44'],
          chartArea: { width: '80%' },
          width: '100%',
          vAxis: {
            minValue: 10,
            // 그래프에 왼쪽 ex: '10'숫자 부분 폰트사이즈 조정
            textStyle: {
              fontSize: 15,
            },
            // ticks: [0, 25, 50, 75, 100, 125],
          },
          // 그래프에 하단 ex: '4월' 부분 폰트사이즈 조정
          hAxis: {
            textStyle: {
              fontSize: 15,
            },
          },
          // 그래프에 마우스 포인터 가져갔을 때 나오는 툴팁 폰트사이즈 조정
          tooltip: {
            textStyle: {
              fontSize: 15,
            },
          },
          // 그래프위 숫자와 단위 표시
          annotations: {
            textStyle: {
              fontSize: 13,
            },
          },
        },
        columns: [0, 1, 2, { calc: 'stringify', sourceColumn: 1, type: 'string', role: 'annotation' }],
      },
      rowData: {
        notificationInfo: {
          title: '통보서',
          values: {
            left: {
              title: '미작성',
              total: 0,
              list: [],
              link: 'notificationStatusNull=Y',
            },
            right: {
              title: '최종제출',
              total: 0,
              list: [],
              link: 'notificationStatusY=Y',
            },
          },
          message: '로딩중입니다.',
        },
        treatmentPlanInfo: {
          title: '진료계획서', // 서울만
          values: {
            left: {
              title: '대기중',
              total: 0,
              list: [],
              link: 'treatmentPlanStatusY=Y',
            },
            right: {
              title: '승인됨',
              total: 0,
              list: [],
              link: 'treatmentPlanStatusA=Y',
            },
          },
          message: '로딩중입니다.',
        },
        billInfo: {
          title: '비용청구서',
          values: {
            left: {
              title: '청구중',
              total: 0,
              list: [],
              link: 'billStatusN=Y&billStatusRN=Y',
            },
            right: {
              title: '반려됨',
              total: 0,
              list: [],
              link: 'billStatusR=Y',
            },
          },
          message: '로딩중입니다.',
        },
      },
      divLink: {
        C: '/healthcare/business/child?',
        F: '/healthcare/business/famdoc?',
        F1: '/healthcare/business/famdoc/first?',
        FY: '/healthcare/business/famdoc/yeonjegu?',
        E: '/healthcare/business/examine?',
      },
      useData: {
        totalFBillCount: 0,
        totalFCount: 0,
        totalFRate: 0,
        totalEBillCount: 0,
        totalECount: 0,
        totalERate: 0,
        totalF1BillCount: 0,
        totalF1Count: 0,
        totalF1Rate: 0,
        totalE1BillCount: 0,
        totalE1Count: 0,
        totalE1Rate: 0,
        totalE2BillCount: 0,
        totalE2Count: 0,
        totalE2Rate: 0,
        totalE3BillCount: 0,
        totalE3Count: 0,
        totalE3Rate: 0,
        totalF4BillCount: 0,
        totalF4Count: 0,
        totalF4Rate: 0,
        totalE4BillCount: 0,
        totalE4Count: 0,
        totalE4Rate: 0,
        totalE5BillCount: 0,
        totalE5Count: 0,
        totalE5Rate: 0,
        totalE6BillCount: 0,
        totalE6Count: 0,
        totalE6Rate: 0,
      },
      gyeonggiRowData: {
        billCount: {
          title: '비용청구 현황',
          contentType: '',
          values: {},
        },
        notificationCount: {
          title: '통보서 현황',
          contentType: '',
          values: {},
        },
        businessDivisionCount: {
          title: '수검 현황',
          contentType: '',
          values: [],
        },
      },
      gyeonggiNotice: {
        title: '공지사항',
        values: {
          first: {
            title: '보건소 문의',
            link: '/healthcare/board/inquiry/list',
            list: [],
            rowLink: '/healthcare/board/inquiry/contents',
            options: {
              baseIcon: require('@/assets/images/common/ic_loudspeaker.png'),
              datapick: true,
              pickEffect: 'New',
              pickCond: item => {
                let target = Date.parse(item.inquiryQuestionRegdate);
                return target > this.pastDate.getTime() && target < this.nowDate.getTime();
              },
            },
          },
          second: {
            title: '자주하는 질문',
            link: '/healthcare/board/faq/list',
            list: [],
            rowLink: '/healthcare/board/faq/contents',
            options: {
              baseIcon: require('@/assets/images/common/ic_loudspeaker.png'),
              datapick: true,
              pickEffect: 'New',
              pickCond: item => {
                let target = Date.parse(item.regdate);
                return target > this.pastDate.getTime() && target < this.nowDate.getTime();
              },
            },
          },
          third: {
            title: '공지사항',
            link: '/healthcare/board/notice/list',
            list: [],
            rowLink: '/healthcare/board/notice/contents',
            options: {
              baseIcon: require('@/assets/images/common/ic_loudspeaker.png'),
              datapick: true,
              pickEffect: 'New',
              pickCond: item => {
                let target = Date.parse(item.regdate);
                return target > this.pastDate.getTime() && target < this.nowDate.getTime();
              },
            },
          },
        },
        message: '로딩중입니다.',
      },
      seoulNotice: {
        title: '공지사항',
        values: {
          first: {
            title: '자주하는 질문',
            link: '/healthcare/board/faq/list',
            list: [],
            rowLink: '/healthcare/board/faq/contents',
            options: {
              baseIcon: require('@/assets/images/common/ic_loudspeaker.png'),
              datapick: true,
              pickEffect: 'New',
              pickCond: item => {
                let target = Date.parse(item.regdate);
                return target > this.pastDate.getTime() && target < this.nowDate.getTime();
              },
            },
          },
          second: {
            title: '공지사항',
            link: '/healthcare/board/notice/list',
            list: [],
            rowLink: '/healthcare/board/notice/contents',
            options: {
              baseIcon: require('@/assets/images/common/ic_loudspeaker.png'),
              datapick: true,
              pickEffect: 'New',
              pickCond: item => {
                let target = Date.parse(item.regdate);
                return target > this.pastDate.getTime() && target < this.nowDate.getTime();
              },
            },
          },
        },
        message: '로딩중입니다.',
      },
      gyeonggiBusinessDivisionBill: {
        businessDivisionF: {
          title: '학생치과주치의',
          values: {
            Bill: '-',
            Total: '-',
          },
        },
        businessDivisionE: {
          title: '학생구강검진',
          values: {
            Bill: '-',
            Total: '-',
          },
        },
      },
    };
  },

  computed: {
    ...mapState('user', ['districtCode', 'userOrganId', 'userOrganTargetType', 'adminOrganType', 'userOrganTargetId', 'cityType', 'healthCareType']),
    ...mapState('hospitalDocument', ['uncheckedHospitalCount']),
    ...mapGetters('user', ['districtCodeFirst', 'secondHealthCareList', 'healthCareSurveyCheck']),
    ...mapGetters('business', ['divJoin', 'isSurveyOpen', 'endBusiness', 'notificationTitle']),
    ...mapGetters('definedCode', ['valueToCode']),
    billChart() {
      return {
        title: '사업현황',
        values: {
          left: {
            title: `${this.districtCodeFirst === 'I' ? '구강진료 ' : '수검'}현황`,
            firstTitle: this.districtCodeFirst === 'I' ? '진료' : '수검',
            secondTitle: '',
            thirdTitle: '',
            column: ['date', this.districtCodeFirst === 'I' ? '진료' : '수검', { role: 'annotation' }],
            list: [],
          },
          right: {
            title: '비용청구현황',
            firstTitle: '청구중',
            secondTitle: '처리완료',
            thirdTitle: '',
            column: ['date', '청구중', { role: 'annotation' }, '처리완료', { role: 'annotation' }],
            list: [],
          },
        },
        message: '로딩중입니다.',
      };
    },
  },

  created() {
    let popupContents = [];
    if ((this.isDev || new Date() > new Date('2024-10-31 23:59:59')) && new Date() < new Date('2025-01-01 00:00:00')) {
      // 사업 종료 안내 팝업
      if (this.districtCodeFirst === 'C') {
        popupContents.push('gyeonggiClose');
      } else {
        popupContents.push('businessClose');
      }
    }
    // if (this.districtCodeFirst === 'C') {
    //   popupContents.push('gyeonggiStats');
    // }
    if ((this.isDev && !this.endBusiness('survey')) || this.isSurveyOpen) {
      // 만족도조사 안내 팝업
      if (['A', 'B', 'D', 'I'].includes(this.districtCodeFirst) && this.userOrganTargetType === 'HC' && this.healthCareType !== 'E') {
        popupContents.push('surveyGuide');
      }
    }

    this.$store.dispatch('popup/popupOpen', { contents: popupContents });

    this.rowData.notificationInfo.title = this.notificationTitle;
    if (this.districtCodeFirst === 'A') {
      this.manualList = [];
      // 관리자, 지자체, 보건소 계정에서 보여야 함
      if (this.cityType === 'Y' || this.healthCareType === 'Y' || this.adminOrganType === 'AD') {
        this.manualList.push([6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 서울시 서식_지자체,보건소용.zip']);
      }
      // 서울시교육청, 서울시치과의사회 계정에서 보여야 함
      if (this.cityType === 'E' || this.healthCareType === 'E') {
        this.manualList.push([6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 서울시 학생구강검진 서식자료.zip']);
      }
      this.manualList.push([4, '보건소 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 보건소용 전산가이드.zip']);
      // 서울시교육청, 서울시치과의사회 계정에서 보이면 안됨
      if (this.cityType !== 'E' && this.healthCareType !== 'E') {
        this.manualList.push([3, '보건소치과 아동치과주치의 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 보건소치과 전산가이드.pdf']);
      }

      this.manualList.push(
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 의료기관 전산가이드.zip'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 학교용 전산가이드.pdf'],
        [1, '개인정보 파기 확약서 작성 가이드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 서울시 의료기관 개인정보 파기 확약서 작성가이드.pdf'],
        [2, '교육영상(학생용) 보기', 'https://seoul-edu.kai-i.com/', 'blank'],
      );

      if (this.cityType !== 'E' && this.healthCareType !== 'E') {
        this.manualList.splice(3, 0, [1, '센터 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 센터용 전산가이드.pdf']);
        this.manualList.splice(5, 0, [5, '서울대의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 서울대치과병원용 전산가이드.pdf']);
      }
    } else if (this.districtCodeFirst === 'B') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/incheon/2024 인천시 서식.zip'],
        [4, '보건소 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/incheon/2024 인천시 아동치과주치의 전산가이드 보건소용.pdf'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/incheon/2024 인천시 아동치과주치의 전산가이드 병원용.pdf'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/incheon/2024 인천시 아동치과주치의 전산가이드 학교용.pdf'],
      ];
    } else if (this.districtCodeFirst === 'C') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/2024 경기도 서식.zip'],
        [4, '보건소 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/보건소용 덴티아이 전산매뉴얼.pdf'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/의료기관용 덴티아이 전산매뉴얼.pdf'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/학교용 덴티아이 전산매뉴얼.pdf'],
        [7, '교육영상(학생용) 보기', 'https://gyeonggi-edu.kai-i.com/', 'blank'],
        [3, '교육영상(의료기관용) 보기', '/healthcare/video/manual', 'push'],
        [1, '치과주치의사업 안내서', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/2024 경기도 초등학생 치과주치의사업 안내서_보건소용.pdf'],
        [5, '학생 사업 참여방법 영상', '/healthcare/video/business', 'push'],
        [8, '치과주치의사업 포스터, 가정통신문 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/치과주치의사업 포스터, 가정통신문 다운로드.zip'],
        [9, '치과주치의사업 홍보 동영상 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/2024경기도 초등학생 치과주치의사업 홍보영상.mp4'],
      ];
    } else if (this.districtCodeFirst === 'D') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/2024 부산시 서식.zip'],
        [4, '보건소 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/2024 부산시 아동(학생) 치과주치의 사용자 가이드 보건소용.pdf'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/2024 부산시 아동(학생) 치과주치의 사용자 가이드 병원용.pdf'],
        [1, '센터 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/2024 부산시 아동(학생) 치과주치의 사용자 가이드 시설(센터)용.pdf'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/2024 부산시 아동(학생) 치과주치의 사용자 가이드 학교용.pdf'],
        [7, '교육영상(학생용) 보기', 'https://busan-edu.kai-i.com/', 'blank'],
      ];
    } else if (this.districtCodeFirst === 'F') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/miryang/2024 밀양시 서식.zip'],
        [4, '보건소 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/miryang/2024 밀양시 학생치과주치의 사용자 가이드 보건소용.pdf'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/miryang/2024 밀양시 학생치과주치의 사용자 가이드 병원용.pdf'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/miryang/2024 밀양시 학생치과주치의 사용자 가이드 학교용.pdf'],
      ];
    } else if (this.districtCodeFirst === 'G') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/suwon/2024 수원시 서식.zip'],
        [4, '치과의사회 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/suwon/2024 수원시 학생구강검진 치과의사회용 사용자 가이드.pdf'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/suwon/2024 수원시 학생구강검진 병원용 사용자 가이드.pdf'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/suwon/2024 수원시 학생구강검진 학교용 가이드.pdf'],
      ];
    } else if (this.districtCodeFirst === 'I') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/2024 전북특별자치도교육청 서식.zip'],
        [4, '교육지원청 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/2024 전북특별자치도교육청 구강진료 지원사업 전산가이드 교육지원청용.pdf'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/2024 전북특별자치도교육청 구강진료 지원사업 전산가이드 병원용.pdf'],
        [3, '의료기관 날인 첨부 가이드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/2024 전북특별자치도교육청 구강진료 지원사업 대표 치과의사 날인 가이드.pdf'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/2024 전북특별자치도교육청 구강진료 지원사업 전산가이드 학교용.pdf'],
      ];
    } else if (this.districtCodeFirst === 'J') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/use/2024 울산광역시교육청 서식.zip'],
        [4, '교육지원청 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/use/2024 울산광역시교육청 학생치과주치의 사용자 가이드 교육지원청용.pdf'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/use/2024 울산광역시교육청 학생치과주치의 사용자 가이드 병원용.pdf'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/use/2024 울산광역시교육청 학생치과주치의 사용자 가이드 학교용.pdf'],
      ];
    } else {
      this.manualList = [
        [6, '서식자료 다운로드'],
        [4, '보건소 전산 매뉴얼'],
        [3, '의료기관 전산 매뉴얼'],
        [2, '학교 전산 매뉴얼'],
      ];
    }
    if (this.districtCode) {
      this.requestHandling({
        request: Board.noticeBoardList,
        param: {
          districtCode: this.districtCode,
          adminOrganId: this.userOrganId,
          adminOrganType: this.valueToCode('C0006', this.adminOrganType),
          userOrganTargetType: this.valueToCode('C0006', this.userOrganTargetType),
          page: 1,
          size: 6,
        },
        dispatch: data => {
          this.gyeonggiNotice.values.third.list = data;
          this.seoulNotice.values.second.list = data;
          this.noticeList = data;
        },
        middleware: res => res.noticeList,
        errorHandling: err => {
          alert(err.message);
        },
      });
    }
    this.getDashBoardData();
    if (['A', 'C'].includes(this.districtCodeFirst)) {
      this.getFaqList();
    }
    if (this.districtCodeFirst === 'C') {
      // if (this.userOrganTargetType === 'HC' && new Date() < new Date('2024-05-04')) {
      //   this.$fire({
      //     html: '<p>5/2(목) 덴티아이경기 앱에서<br /> 학생 정보 등록 시 일부 학교 목록 조회가 불가한<br /> 이슈가 있었습니다.</p><p class="mt10">5/2 16:20경 조치 완료되었으며,<br /> 현재 <strong>덴티아이경기 앱 최신 버전으로 업데이트 진행</strong>하시면<br /> 학교 목록을 정상적으로 확인할 수 있습니다.</p><p class="mt10">이용에 불편을 드려 죄송합니다.</p>',
      //     confirmButtonText: '확인',
      //   }).then(() => {
      //     this.getInquiryList();
      //   });
      // } else {
      //   this.getInquiryList();
      // }
      this.getInquiryList();
    }
    this.showHospitalDocumentPopup();
  },

  methods: {
    // API 호출
    requestHandling: ({ request, param = null, dispatch, middleware = data => data, errorHandling = data => data }) => {
      request(param)
        .then(res => {
          if (res && res.data.rt === 200) dispatch(middleware(res.data));
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 422) errorHandling({ message: '대기건이 없습니다.' });
            else errorHandling({ message: err.response.data.rtMsg + '<br/>관리자에게 문의해주세요' });
          } else if (err.request) {
            errorHandling({ message: '네트워크 오류입니다. 관리자에게 문의해주세요' });
          }
        });
    },

    // 데이터의 title과 link 연결
    getToggleData(form, visibleCount = true) {
      return Object.keys(form).map(key => ({
        value: key,
        title: form[key].title,
        datapick: form[key].options?.datapick && form[key].list.length && form[key].options.pickCond(form[key].list[0]),
        pickEffect: form[key].options?.pickEffect,
        link: form[key].link,
        ...(visibleCount && { total: form[key]['total'] }),
      }));
    },

    // 대시보드 데이터 호출 및 vue 데이터에 삽입
    getDashBoardData() {
      if (this.$route.path === '/healthcare/home/child') {
        this.businessDivisionStatus = 'C';
      } else if (this.$route.path === '/healthcare/home/famdoc') {
        this.businessDivisionStatus = 'F';
      } else if (this.$route.path === '/healthcare/home/famdoc/first') {
        this.businessDivisionStatus = 'F1';
      } else if (this.$route.path === '/healthcare/home/famdoc/yeonjegu') {
        this.businessDivisionStatus = 'FY';
      } else if (this.$route.path === '/healthcare/home/examine') {
        this.businessDivisionStatus = 'E';
        if (!this.divJoin('E') || (this.districtCodeFirst === 'A' && this.userOrganTargetType === 'HC' && this.healthCareType !== 'E')) {
          alert('잘못된 접근입니다.');
          this.$router.push('/').catch(() => {});
          return false;
        }
      }
      this.requestHandling({
        request:
          this.districtCodeFirst === 'C'
            ? Board.gyeonggiHealthCareAndHospitalDashBoardList
            : this.districtCodeFirst === 'J'
            ? Board.useHealthCareAndHospitalDashBoardList
            : Board.healthCenterHospitalDashBoardList,
        param: {
          userOrganTargetType: this.valueToCode('C0006', this.userOrganTargetType),
          userOrganTargetId: this.userOrganTargetId,
          districtCode: this.districtCode,
          businessDivision: this.valueToCode('C0003', this.businessDivisionStatus),
        },
        dispatch: data => {
          if (this.districtCodeFirst === 'C') {
            for (let item in this.gyeonggiRowData) {
              this.gyeonggiRowData[item]['contentType'] = item;
              this.gyeonggiRowData[item]['values'] = data[item];
            }
            for (let division in this.gyeonggiBusinessDivisionBill) {
              for (let item in this.gyeonggiBusinessDivisionBill[division]['values']) {
                this.gyeonggiBusinessDivisionBill[division]['values'][item] = data['businessDivisionBill'][`${division}${item}`];
              }
            }
          } else {
            if (this.districtCodeFirst === 'J') {
              this.useData = data.divAndGradeTotal;
            }
            this.billChart['message'] = '대기건이 없습니다.';
            this.billChart['values']['left'] = { ...this.billChart['values']['left'], ...data['billChart'].left };
            this.billChart['values']['right'] = { ...this.billChart['values']['right'], ...data['billChart'].right };
            if (this.districtCodeFirst === 'I') {
              delete this.billChart['values']['right'];
            }
            for (let container in this.rowData) {
              if (data[container] === null) {
                this.rowData[container]['values']['left']['total'] = 0;
                this.rowData[container]['values']['left']['list'] = [];
                this.rowData[container]['values']['right']['total'] = 0;
                this.rowData[container]['values']['right']['list'] = [];
              } else {
                this.rowData[container]['message'] = '대기건이 없습니다.';
                this.rowData[container]['values']['left'] = { ...this.rowData[container]['values']['left'], ...data[container].left };
                this.rowData[container]['values']['right'] = { ...this.rowData[container]['values']['right'], ...data[container].right };
              }
              // 사업(businessDivisionStatus)별 바로가기 링크 주소 변경
              this.rowData[container]['values']['left']['link'] = this.divLink[this.businessDivisionStatus] + this.rowData[container]['values']['left']['link'];
              this.rowData[container]['values']['right']['link'] = this.divLink[this.businessDivisionStatus] + this.rowData[container]['values']['right']['link'];
            }
          }
        },
      });
    },

    // 받은 chart데이터를 google chart데이터로 이용 할 수 있게 변환
    chartData(info) {
      const convertedList = [];
      // 수검현황 > 미수검 항목 삭제에 따른 조건문
      if (!info.secondTitle) {
        info.list.forEach(obj => {
          convertedList.push([obj.month + '월', { v: obj.first, f: `${obj.first}건` }, `${obj.first}건`]);
        });
      } else {
        info.list.forEach(obj => {
          convertedList.push([obj.month + '월', { v: obj.first, f: `${obj.first}건` }, `${obj.first}건`, { v: obj.second, f: `${obj.second}건` }, `${obj.second}건`]);
        });
      }
      return [info.column, ...convertedList];
    },

    getInquiryList() {
      this.requestHandling({
        request: Board.inquiryList,
        param: {
          districtCode: this.districtCode,
          page: 1,
          size: 6,
        },
        dispatch: data => {
          this.gyeonggiNotice.values.first.list = data.inquiryList;
          if (this.userOrganTargetType === 'HC') {
            if (this.districtCodeFirst === 'C' && new Date() < new Date('2024-11-13')) {
              // 경기 > 이슈 정상화 안내 팝업 (~11/12 23:59)
              this.$fire({
                html: `<p>검진결과 통보서 제출 오류가 해결되어 현재 정상적으로 이용 가능합니다.<br /> 서비스 이용에 불편을 드린 점 다시 한번 사과드리며, 앞으로도 안정적인 서비스 제공을 위해 최선을 다하겠습니다. 감사합니다.</p>`,
                confirmButtonText: '확인',
              }).then(() => {
                // 사업 설문조사 팝업 먼저 -> 처리중인 보건소 문의 안내 팝업
                if (!this.healthCareSurveyCheck && !this.endBusiness('survey') && (new Date() > new Date('2024-09-02 07:59:59') || this.isDev)) {
                  let html = '<span style="font-size: 17px">귀 기관은 현재 치과주치의사업 만족도 조사에 참여하지 않으셨습니다.<br/>참여하시겠습니까? (9문항 약 5분 소요)';
                  if (this.secondHealthCareList.length > 0) {
                    const requiredHealthCareName = this.secondHealthCareList
                      .filter(healthCare => !healthCare.healthCareSurveyId)
                      .map(healthCare => healthCare.healthCareName)
                      .join(', ');
                    html += `<br/>※ 미작성 : ${requiredHealthCareName}</span>`;
                  }
                  this.$fire({
                    html: html,
                    confirmButtonText: '참여하기',
                    showCancelButton: true,
                    cancelButtonText: '닫기',
                  }).then(r => {
                    if (r.value) {
                      this.$router.push('/healthcare/survey');
                    } else if (data.inquiryNoAnswerCount > 0) {
                      this.showRemainingInquiryPopup(data.inquiryNoAnswerCount);
                    }
                  });
                } else if (data.inquiryNoAnswerCount > 0) {
                  this.showRemainingInquiryPopup(data.inquiryNoAnswerCount);
                }
              });
            } else {
              // 사업 설문조사 팝업 먼저 -> 처리중인 보건소 문의 안내 팝업
              if (!this.healthCareSurveyCheck && !this.endBusiness('survey') && (new Date() > new Date('2024-09-02 07:59:59') || this.isDev)) {
                let html = '<span style="font-size: 17px">귀 기관은 현재 치과주치의사업 만족도 조사에 참여하지 않으셨습니다.<br/>참여하시겠습니까? (9문항 약 5분 소요)';
                if (this.secondHealthCareList.length > 0) {
                  const requiredHealthCareName = this.secondHealthCareList
                    .filter(healthCare => !healthCare.healthCareSurveyId)
                    .map(healthCare => healthCare.healthCareName)
                    .join(', ');
                  html += `<br/>※ 미작성 : ${requiredHealthCareName}</span>`;
                }
                this.$fire({
                  html: html,
                  confirmButtonText: '참여하기',
                  showCancelButton: true,
                  cancelButtonText: '닫기',
                }).then(r => {
                  if (r.value) {
                    this.$router.push('/healthcare/survey');
                  } else if (data.inquiryNoAnswerCount > 0) {
                    this.showRemainingInquiryPopup(data.inquiryNoAnswerCount);
                  }
                });
              } else if (data.inquiryNoAnswerCount > 0) {
                this.showRemainingInquiryPopup(data.inquiryNoAnswerCount);
              }
            }
            // 처리중인 보건소 문의 안내 팝업만
            // if (data.inquiryNoAnswerCount > 0) {
            //   this.showRemainingInquiryPopup(data.inquiryNoAnswerCount);
            // }
          } else {
            // 경기 > 이슈 정상화 안내 팝업 (~11/12 23:59)
            if (this.districtCodeFirst === 'C' && new Date() < new Date('2024-11-13')) {
              this.$fire({
                html: `<p>검진결과 통보서 제출 오류가 해결되어 현재 정상적으로 이용 가능합니다.<br /> 서비스 이용에 불편을 드린 점 다시 한번 사과드리며, 앞으로도 안정적인 서비스 제공을 위해 최선을 다하겠습니다. 감사합니다.</p>`,
                confirmButtonText: '확인',
              });
            }
          }
        },
        errorHandling: err => {
          alert(err.message);
        },
      });
    },
    getFaqList() {
      this.requestHandling({
        request: Board.faqList,
        param: {
          districtCode: this.districtCode,
          page: 1,
          size: 6,
        },
        dispatch: data => {
          this.gyeonggiNotice.values.second.list = data.faqList;
          this.seoulNotice.values.first.list = data.faqList;
        },
        errorHandling: err => {
          alert(err.message);
        },
      });
    },

    showRemainingInquiryPopup(val) {
      this.$fire({
        html: `처리중인 보건소 문의가 <b>${val}</b>건이 있습니다.`,
        confirmButtonText: '이동',
        showCancelButton: true,
        cancelButtonText: '확인',
        padding: '40px',
      }).then(r => {
        if (r.value) {
          this.$router.push('/healthcare/board/inquiry/list');
        }
      });
    },

    showHospitalDocumentPopup() {
      if (this.uncheckedHospitalCount > 0) {
        this.$fire({
          html: `${this.uncheckedHospitalCount}곳의 치과병의원에서 회계자료(사업자등록증,<br/>통장사본, 대표 치과의사 날인)를 (재)등록했습니다.<br/>비용 청구서 화면에서 회계자료를 다운로드해 주세요.`,
          confirmButtonText: '이동',
          showCancelButton: true,
          cancelButtonText: '확인',
          padding: '40px',
        }).then(r => {
          if (r.value) {
            this.$router.push('/healthcare/bill/claim');
          }
        });
      }
    },
  },
  watch: {
    uncheckedHospitalCount() {
      this.showHospitalDocumentPopup();
    },
  },
};
</script>

<style scoped>
.hideDiv {
  display: none;
}
</style>
