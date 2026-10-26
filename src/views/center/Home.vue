<template>
  <div class="sub__content dash__board mt30">
    <div class="dash_board_content">
      <div class="dash__comm_set row mt40">
        <v-status-box title="현황보드" :data="statusBoardData" />
        <v-item-container
          v-if="['A', 'C'].includes(districtCodeFirst)"
          button="바로가기"
          title="공지사항"
          :toggle-label="getToggleData(faqAndNotice.values, false)"
          class-name="dash__comm_box4 inner--left"
        >
          <template v-for="(info, key) in faqAndNotice.values" v-slot:[key]>
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
              this.$router.push('/center/board/notice/list');
            },
          }"
          :onrowclick="
            item => {
              this.$router.push({ path: '/center/board/notice/contents', query: { noticeBoardId: item.noticeBoardId } });
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
        <v-manual-box title="사용자 매뉴얼" :data="manualList" :data-img="manualImg" />
      </div>
      <div class="dash__comm_set row mt40 wid100">
        <div class="dash__comm_box dash__comm_box2 wid100">
          <div class="tit_row row">
            <p class="commp5 c_black2 fwb">월별 수검률</p>
          </div>
          <div class="board__con bg_white mt15">
            <div class="list__con">
              <div class="m_inner row">
                <GChart v-if="billChart.list.length" type="ColumnChart" :options="chartProps['options']" :data="chartData(billChart)" />
                <div v-else v-html="billChart.message"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--//dash__comm_set-->
    </div>
  </div>
</template>

<script>
import Board from '@/apis/Board';
import StatusBoardBox from '@/components/dashboard/StatusBoardBox.vue';
import ListBox from '@/components/dashboard/ListBox.vue';
import ManualBox from '@/components/dashboard/ManualBox.vue';
import { GChart } from 'vue-google-charts';

import { mapGetters, mapState } from 'vuex';
import ItemContainer from '@/components/dashboard/ItemContainer';
import NoticeBox from '@/components/dashboard/gyeonggi/NoticeBox';

export default {
  components: {
    'v-item-container': ItemContainer,
    'v-status-box': StatusBoardBox,
    'v-list-box': ListBox,
    'v-manual-box': ManualBox,
    GChart,
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
      businessDivisionStatus: 'C',
      chartProps: {
        options: {
          height: 350,
          // 그래프 바 설명 부분 폰트사이즈 조정
          legend: { position: 'top', maxLines: 3, textStyle: { fontSize: 15 } },
          bar: { groupWidth: '25%' },
          colors: ['#e24065', '#0868f1', '#37bc56'],
          chartArea: { width: '90%' },
          width: '100%',
          seriesType: 'bars',
          vAxis: {
            minValue: 10,
            // 그래프에 왼쪽 ex: '10'숫자 부분 폰트사이즈 조정
            textStyle: {
              fontSize: 15,
            },
            format: "#'%'",
            // ticks: [0, 20, 40, 60, 80, 100],
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
      statusBoardData: {
        studentBusinessDivisionCCountTotal: {
          title: '아동치과주치의 신청자 수',
          unitStr: '명',
          count: 0,
          icon: require('@/assets/images/common/ic_child_b.png'),
        },
        studentBusinessDivisionCCountBill: {
          title: '아동치과주치의 검진자 수',
          unitStr: '명',
          count: 0,
          icon: require('@/assets/images/common/ic_school_b.png'),
        },
        intensiveRequestCount: {
          title: '심화치료 접수',
          unitStr: '명',
          count: 0,
          icon: require('@/assets/images/common/ic_file_b.png'),
        },
        appCount: {
          title: '앱가입율',
          unitStr: '%',
          count: 0,
          icon: require('@/assets/images/common/ic_app.png'),
        },
      },
      billChart: {
        title: '',
        firstTitle: '',
        secondTitle: '',
        thirdTitle: '',
        list: [],
      },

      faqAndNotice: {
        title: '공지사항',
        values: {
          first: {
            title: '자주하는 질문',
            link: '/center/board/faq/list',
            list: [],
            rowLink: '/center/board/faq/contents',
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
            link: '/center/board/notice/list',
            list: [],
            rowLink: '/center/board/notice/contents',
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
      },
    };
  },

  created() {
    let popupContents = [];
    if ((this.isDev || new Date() > new Date('2024-10-31 23:59:59')) && new Date() < new Date('2025-01-01 00:00:00')) {
      // 사업 종료 안내 팝업
      popupContents.push('businessClose');
    }
    if ((this.isDev && !this.endBusiness('survey')) || this.isSurveyOpen) {
      // 만족도조사 안내 팝업
      if (['D'].includes(this.districtCodeFirst)) {
        popupContents.push('surveyGuide');
      }
    }

    this.$store.dispatch('popup/popupOpen', { contents: popupContents });

    if (this.districtCodeFirst !== 'C') {
      delete this.statusBoardData.appCount;
    }
    if (this.districtCodeFirst === 'A') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 서울시 아동치과주치의 서식자료.zip'],
        [1, '센터 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 센터용 전산가이드.pdf'],
        [2, '교육영상(학생용) 보기', 'https://seoul-edu.kai-i.com/', 'blank'],
      ];
    } else if (this.districtCodeFirst === 'D') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/2024 부산시 서식.zip'],
        [1, '센터 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/2024 부산시 아동(학생) 치과주치의 사용자 가이드 시설(센터)용.pdf'],
      ];
    } else {
      this.manualList = [
        [6, '서식자료 다운로드'],
        [1, '센터 전산 매뉴얼'],
      ];
    }
    // 비밀번호 변경 전 로그아웃 시 호출 방지
    if (this.userOrganId) {
      // 공지사항 데이터 불러오기
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
          this.faqAndNotice.values.second.list = data;
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
  },

  computed: {
    ...mapState('user', ['districtCode', 'userOrganId', 'userOrganTargetType', 'userOrganTargetId', 'adminOrganType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['isSurveyOpen', 'endBusiness']),
    ...mapGetters('definedCode', ['valueToCode']),
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
      this.requestHandling({
        request: Board.centerDashBoardList,
        param: {
          userOrganTargetType: this.valueToCode('C0006', this.userOrganTargetType),
          userOrganTargetId: this.userOrganTargetId,
          districtCode: this.districtCode,
          businessDivision: this.valueToCode('C0003', this.businessDivisionStatus),
        },
        dispatch: data => {
          for (const obj in this.statusBoardData) {
            switch (obj) {
              case 'studentBusinessDivisionCCountTotal':
                this.statusBoardData[obj]['count'] = data['studentBusinessDivisionCCount'].total ? this.numberWithCommas(data['studentBusinessDivisionCCount'].total) : 0;
                break;
              case 'studentBusinessDivisionCCountBill':
                this.statusBoardData[obj]['count'] = data['studentBusinessDivisionCCount'].bill ? this.numberWithCommas(data['studentBusinessDivisionCCount'].bill) : 0;
                break;
              case 'intensiveRequestCount':
                // 부산일 경우 심화치료 진행 데이터로 교체
                if (this.districtCodeFirst === 'D') {
                  this.statusBoardData[obj]['title'] = '심화치료 진행';
                  this.statusBoardData[obj]['count'] = data['treatStatusCount'] ? this.numberWithCommas(data['treatStatusCount']) : 0;
                } else {
                  this.statusBoardData[obj]['count'] = data[obj] ? this.numberWithCommas(data[obj]) : 0;
                }
                break;
              case 'appCount':
                this.statusBoardData[obj]['count'] = data[obj] ? Math.round((data[obj] / data['totalCount']) * 100) : 0;
                break;
              default:
                this.statusBoardData[obj]['count'] = data[obj] ? this.numberWithCommas(data[obj]) : 0;
                break;
            }
          }
          this.billChart.firstTitle = '수검';
          this.billChart.secondTitle = '미수검';
          this.billChart.list = data.billChart.list;
          this.billChart['message'] = '대기건이 없습니다.';
        },
      });
    },

    // 받은 chart데이터를 google chart데이터로 이용 할 수 있게 변환
    chartData(info) {
      const convertedList = [];
      info.list.forEach(obj => {
        // convertedList.push([obj.month + '월', obj.first, obj.second, obj.third, '']);
        let chartFirstData = Math.round((obj.first / (obj.first + obj.second)) * 100);
        let chartSecondData = Math.round((obj.second / (obj.first + obj.second)) * 100);
        // {v: data값, f: data표시}
        convertedList.push([obj.month + '월', { v: chartFirstData, f: `${chartFirstData}%` }, `${chartFirstData}%`, { v: chartSecondData, f: `${chartSecondData}%` }, `${chartSecondData}%`]);
      });
      // return [['date', info.firstTitle, info.secondTitle, info.thirdTitle, { role: 'annotation' }], ...convertedList];
      return [['date', info.firstTitle, { role: 'annotation' }, info.secondTitle, { role: 'annotation' }], ...convertedList];
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
          this.faqAndNotice.values.first.list = data.faqList;
        },
        errorHandling: err => {
          alert(err.message);
        },
      });
    },
  },
};
</script>
