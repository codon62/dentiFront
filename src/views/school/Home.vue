<template>
  <div class="sub__content dash__board mt30">
    <div class="dash_board_content">
      <div class="dash__comm_set row mt40">
        <v-status-box v-if="isStatusBoard" title="현황보드" :data="statusBoardData" :label-data="statusBoardBoxLabel" />
        <v-status-container
          v-if="districtCodeFirst === 'J'"
          :title="statusByBusinessAndGrade.title"
          :toggle-label="statusByBusinessAndGrade.toggleLabel"
          :data="statusByBusinessAndGrade.data"
          class="dash__comm_box7 inner--left"
        />
        <v-item-container
          v-if="['A', 'C'].includes(districtCodeFirst)"
          button="바로가기"
          :title="faqAndNotice.title"
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
              this.$router.push('/school/board/notice/list');
            },
          }"
          :onrowclick="
            item => {
              this.$router.push({ path: '/school/board/notice/contents', query: { noticeBoardId: item.noticeBoardId } });
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
      <div class="dash__comm_set row mt30 wid100">
        <div class="dash__comm_box dash__comm_box2 wid100">
          <div class="tit_row row flex_space_between_container">
            <p class="commp5 c_black2 fwb">{{ billChart.title }}</p>
            <p v-if="districtCodeFirst === 'J'" class="commp c_black2">※ 학년별 수검 현황을 확인하고 싶다면 아래 필터를 이용해 주세요.</p>
          </div>
          <div class="board__con bg_white mt15">
            <div class="list__con">
              <div class="m_inner row">
                <div v-if="districtCodeFirst === 'J'" class="flex_space_between_container">
                  <p class="commp c_gray3">{{ !selectedGrade ? '※ 해당 학년의 반별 수검률을 확인할 수 있습니다.' : '' }}</p>
                  <div class="flex_box">
                    <ul class="flex_box chart_legend">
                      <li>수검</li>
                      <li>미수검</li>
                    </ul>
                    <div class="m__putbox wid180">
                      <select v-model="selectedGrade" class="comm_select wid180" @change="getDashBoardData()">
                        <option value="">전체</option>
                        <option v-for="n in 6" :key="n" :value="n">{{ n }}학년</option>
                      </select>
                    </div>
                  </div>
                </div>
                <GChart v-if="billChart.list.length" type="ColumnChart" :options="chartProps['options']" :data="chartData(billChart)" :events="chartProps['events']" />
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
import ItemContainer from '@/components/dashboard/ItemContainer.vue';
import StatusBoardBox from '@/components/dashboard/StatusBoardBox.vue';
import StatusContainer from '@/components/dashboard/StatusContainer.vue';
import ListBox from '@/components/dashboard/ListBox.vue';
import ManualBox from '@/components/dashboard/ManualBox.vue';
import NoticeBox from '@/components/dashboard/gyeonggi/NoticeBox';
import { GChart } from 'vue-google-charts';

import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-item-container': ItemContainer,
    'v-status-box': StatusBoardBox,
    'v-status-container': StatusContainer,
    'v-list-box': ListBox,
    'v-manual-box': ManualBox,
    GChart,
    NoticeBox,
  },
  data() {
    return {
      isStatusBoard: false,
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
      selectedGrade: '',
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
            minValue: 0,
            // 그래프에 왼쪽 ex: '10'숫자 부분 폰트사이즈 조정
            textStyle: {
              fontSize: 15,
            },
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
        events: {
          click: e => {
            if (this.districtCodeFirst === 'J') {
              this.selectedGrade = !this.selectedGrade && (e.targetID.includes('bar') || e.targetID.includes('hAxis')) ? Number(e.targetID.charAt(e.targetID.length - 1)) + 1 : '';
              this.getDashBoardData();
            }
          },
        },
      },
      billChart: {
        title: '',
        firstTitle: '',
        secondTitle: '',
        thirdTitle: '',
        list: [],
      },
      statusBoardBoxLabel: {
        bill: 0,
        total: 0,
      },
      statusByBusinessAndGrade: {
        title: '사업별, 학년별 수검 현황',
        toggleLabel: ['사업별 수검 현황', '학년별 수검 현황'],
        data: {
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
      },
      faqAndNotice: {
        title: '공지사항',
        values: {
          first: {
            title: '자주하는 질문',
            link: '/school/board/faq/list',
            list: [],
            rowLink: '/school/board/faq/contents',
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
            link: '/school/board/notice/list',
            list: [],
            rowLink: '/school/board/notice/contents',
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
  computed: {
    ...mapState('user', ['districtCode', 'userOrganId', 'userOrganTargetType', 'userOrganTargetId', 'userOrganTargetName', 'adminOrganType', 'business', 'surveyCheck']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName', 'isSurveyOpen', 'endBusiness']),
    ...mapGetters('definedCode', ['valueToCode']),
    isDivE() {
      return this.divJoin('E') && this.business && this.business.businessDivisionE === 'Y';
    },
    statusBoardData() {
      return {
        studentBusinessDivisionFCount: {
          title: `${this.divName('F')} ${this.districtCodeFirst === 'I' ? '진료' : '수검'}`,
          unitStr: '명',
          count: 0,
          icon: require('@/assets/images/common/ic_inspection_b.png'),
        },
        studentBusinessDivisionECount: {
          title: `${this.divName('E')} ${this.districtCodeFirst === 'I' ? '진료' : '수검'}`,
          unitStr: '명',
          count: 0,
          icon: require('@/assets/images/common/ic_school_b.png'),
        },
        appCount: {
          title: '앱가입율',
          unitStr: '%',
          count: 0,
          icon: require('@/assets/images/common/ic_app.png'),
        },
        eduCount: {
          title: '교육이수율',
          unitStr: '%',
          count: 0,
          icon: require('@/assets/images/common/ic_edu_b.png'),
        },
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
    if ((this.isDev && !this.endBusiness('survey')) || this.isSurveyOpen) {
      // 만족도조사 안내 팝업
      if (['A', 'B', 'D', 'I'].includes(this.districtCodeFirst) && this.business.businessDivisionF === 'Y') {
        popupContents.push('surveyGuide');
      }
      if (this.districtCodeFirst === 'A' && this.business.businessDivisionE === 'Y') {
        popupContents.push('examineSurveyGuide');
      }
    }

    this.$store.dispatch('popup/popupOpen', { contents: popupContents });

    if (!this.divJoin('F')) {
      delete this.statusBoardData.studentBusinessDivisionFCount;
    }
    if (!this.isDivE) {
      delete this.statusBoardData.studentBusinessDivisionECount;
    }
    if (!['A', 'C'].includes(this.districtCodeFirst)) {
      delete this.statusBoardData.eduCount;
    }
    if (this.districtCodeFirst !== 'C') {
      delete this.statusBoardData.appCount;
    }

    if (this.districtCodeFirst === 'J') {
      this.chartProps.options.isStacked = 'percent';
      this.chartProps.options.chartArea.width = '93%';
      this.chartProps.options.chartArea.height = '85%';
      this.chartProps.options.vAxis.ticks = [0, 0.2, 0.4, 0.6, 0.8, 1];
      this.chartProps.options.colors = ['#4CA0FF', '#D1D4D6'];
      this.chartProps.options.legend.position = 'none';
    } else {
      this.chartProps.options.vAxis.format = "#'%'";
    }

    if (this.districtCodeFirst === 'A') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 서울시 서식_학교용.zip'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 학교용 전산가이드.pdf'],
        [1, '교육영상(학생용) 보기', 'https://seoul-edu.kai-i.com/', 'blank'],
      ];
    } else if (this.districtCodeFirst === 'B') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/incheon/2024 인천시 서식.zip'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/incheon/2024 인천시 아동치과주치의 전산가이드 학교용.pdf'],
      ];
    } else if (this.districtCodeFirst === 'C') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/2024 경기도 서식.zip'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/학교용 덴티아이 전산매뉴얼.pdf'],
        [1, '교육영상(학생용) 보기', 'https://gyeonggi-edu.kai-i.com/', 'blank'],
        [5, '학생 사업 참여방법 영상', '/school/video/business', 'push'],
        [8, '치과주치의사업 포스터, 가정통신문 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/치과주치의사업 포스터, 가정통신문 다운로드.zip'],
        [9, '치과주치의사업 홍보 동영상 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/2024경기도 초등학생 치과주치의사업 홍보영상.mp4'],
      ];
    } else if (this.districtCodeFirst === 'D') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/2024 부산시 서식.zip'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/2024 부산시 아동(학생) 치과주치의 사용자 가이드 학교용.pdf'],
      ];
    } else if (this.districtCodeFirst === 'F') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/miryang/2024 밀양시 서식.zip'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/miryang/2024 밀양시 학생치과주치의 사용자 가이드 학교용.pdf'],
      ];
    } else if (this.districtCodeFirst === 'G') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/suwon/2024 수원시 서식.zip'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/suwon/2024 수원시 학생구강검진 학교용 가이드.pdf'],
      ];
    } else if (this.districtCodeFirst === 'I') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/2024 전북특별자치도교육청 서식.zip'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/2024 전북특별자치도교육청 구강진료 지원사업 전산가이드 학교용.pdf'],
      ];
    } else if (this.districtCodeFirst === 'J') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/use/2024 울산광역시교육청 서식.zip'],
        [2, '학교 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/use/2024 울산광역시교육청 학생치과주치의 사용자 가이드 학교용.pdf'],
      ];
    } else {
      this.manualList = [
        [6, '서식자료 다운로드'],
        [2, '학교 전산 매뉴얼'],
      ];
    }
    if (this.userOrganId) {
      // 비밀번호 변경 전 로그아웃 시 호출 방지
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

    if (this.districtCodeFirst === 'C') {
      if (!this.surveyCheck && !this.endBusiness('survey') && (new Date() > new Date('2024-09-02 07:59:59') || this.isDev)) {
        this.$fire({
          html: '<span style="font-size: 17px">귀 기관은 현재 치과주치의사업 만족도 조사에 참여하지 않으셨습니다.<br/>참여하시겠습니까? (7문항 약 5분 소요)</span>',
          confirmButtonText: '참여하기',
          showCancelButton: true,
          cancelButtonText: '닫기',
        }).then(r => {
          if (r.value) {
            this.$router.push('/school/survey');
          }
        });
      }
      // if (new Date() < new Date('2024-05-04')) {
      //   this.$fire({
      //     html: '<p>5/2(목) 덴티아이경기 앱에서<br /> 학생 정보 등록 시 일부 학교 목록 조회가 불가한<br /> 이슈가 있었습니다.</p><p class="mt10">5/2 16:20경 조치 완료되었으며,<br /> 현재 <strong>덴티아이경기 앱 최신 버전으로 업데이트 진행</strong>하시면<br /> 학교 목록을 정상적으로 확인할 수 있습니다.</p><p class="mt10">이용에 불편을 드려 죄송합니다.</p>',
      //     confirmButtonText: '확인',
      //   });
      // }
    }
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
        request: this.districtCodeFirst === 'C' ? Board.gyeonggiSchoolDashBoardList : this.districtCodeFirst === 'J' ? Board.useSchoolDashBoardList : Board.schoolDashBoardList,
        param: {
          userOrganTargetType: this.valueToCode('C0006', this.userOrganTargetType),
          userOrganTargetId: this.userOrganTargetId,
          districtCode: this.districtCode,
          businessDivision: this.valueToCode('C0003', this.businessDivisionStatus),
          ...(this.districtCodeFirst === 'J' && !!this.selectedGrade && { studentToSchoolGrade1: this.selectedGrade }),
        },
        dispatch: data => {
          this.billChart.title = data.billChart.title;
          this.billChart.firstTitle = data.billChart.firstTitle;
          this.billChart.secondTitle = data.billChart.secondTitle;
          this.billChart.list = data.billChart.list;
          this.billChart['message'] = '대기건이 없습니다.';
          if (this.districtCodeFirst !== 'J') {
            for (const obj in this.statusBoardData) {
              switch (obj) {
                case 'appCount':
                case 'eduCount':
                  this.statusBoardData[obj]['count'] = data[obj] ? Math.round((data[obj] / data['totalCount']) * 100) : 0;
                  break;
                default:
                  this.statusBoardData[obj]['count'] = `${this.numberWithCommas(data[obj].bill)} / ${this.numberWithCommas(data[obj].total)}`;
                  this.statusBoardBoxLabel.bill += data[obj].bill;
                  this.statusBoardBoxLabel.total += data[obj].total;
                  break;
              }
            }
            this.isStatusBoard = true;
          } else {
            this.statusByBusinessAndGrade.data = data.divAndGradeTotal;
            this.chartProps.options.bar.groupWidth = this.billChart.list.length > 5 ? '50%' : 126;
          }
        },
      });
    },

    // 받은 chart데이터를 google chart데이터로 이용 할 수 있게 변환
    chartData(info) {
      const convertedList = [];
      info.list.forEach(obj => {
        // convertedList.push([obj.month + '월', obj.first, obj.second, obj.third, '']);
        const chartFirstData = Math.round((obj.first / (obj.first + obj.second)) * 100);
        const chartSecondData = Math.round((obj.second / (obj.first + obj.second)) * 100);
        const chartFirstRound = this.numberRound((obj.first / (obj.first + obj.second)) * 100, 2);
        const chartSecondRound = this.numberRound((obj.second / (obj.first + obj.second)) * 100, 2);
        // {v: data값, f: data표시}
        convertedList.push([
          ['C', 'J'].includes(this.districtCodeFirst)
            ? this.districtCodeFirst === 'J' && !this.selectedGrade
              ? `${obj.studentToSchoolGrade1}학년`
              : `${obj.studentToSchoolGrade1}학년 ${obj.studentToSchoolGrade2}반`
            : `${obj.month}월`,
          { v: this.districtCodeFirst === 'J' ? obj.first : chartFirstData, f: this.districtCodeFirst === 'J' ? `${obj.first}명` : `${chartFirstData}%` },
          `${this.districtCodeFirst === 'J' ? chartFirstRound : chartFirstData}%`,
          { v: this.districtCodeFirst === 'J' ? obj.second : chartSecondData, f: `${this.districtCodeFirst === 'J' ? `${obj.second}명` : chartSecondData}%` },
          `${this.districtCodeFirst === 'J' ? chartSecondRound : chartSecondData}%`,
        ]);
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
