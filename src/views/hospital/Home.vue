<template>
  <div class="dash_board_content">
    <div v-if="districtCodeFirst === 'C'" class="dash__comm_set row mt30" style="display: flex">
      <template v-for="(data, Object, index) in gyeonggiRowData">
        <chart-table-container v-if="index <= 1" :key="index" :title="data.title" :content-type="data.contentType" :data="data.values" chart-type="PieChart" custom-class="dash__comm_box col_span_2" />
      </template>
    </div>
    <div v-else class="dash__comm_set row mt30">
      <v-item-container
        v-for="(data, object, idx) in rowData"
        :key="idx"
        :class="{ hideDiv: (districtCodeFirst !== 'A' || businessDivisionStatus !== 'C') && idx === 1, col_2: districtCodeFirst !== 'A' || businessDivisionStatus !== 'C' }"
        :title="data.title"
        :toggle-label="getToggleData(data.values)"
        :class-name="'dash__comm_box' + (idx + 1) + ' inner--left'"
        button="바로가기"
      >
        <template v-for="(info, key, _idx) in data.values" v-slot:[key]>
          <v-item-box
            v-if="info.list"
            :key="_idx"
            :data="
              info.list.map(item => ({
                head: `${item.studentName} (${item.studentBirth || '-'})`,
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
              <GChart v-if="info.list.length" type="ColumnChart" :options="chartProps['options']" :data="chartData(info)" />
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
              $router.push('/hospital/board/notice/list');
            },
          }"
          :onrowclick="
            item => {
              $router.push({ path: '/hospital/board/notice/contents', query: { noticeBoardId: item.noticeBoardId } });
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
import ChartTableContainer from '@/components/dashboard/gyeonggi/ChartTableContainer';
import NoticeBox from '@/components/dashboard/gyeonggi/NoticeBox';
import { GChart } from 'vue-google-charts';

import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-item-container': ItemContainer,
    'v-item-box': ItemBox,
    'v-list-box': ListBox,
    'v-manual-box': ManualBox,
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
              link: 'notificationNull=Y&notificationStatusN=Y',
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
              title: '승인됨',
              total: 0,
              list: [],
              link: 'treatmentPlanStatusA=Y',
            },
            right: {
              title: '미승인됨',
              total: 0,
              list: [],
              link: 'treatmentPlanStatusD=Y',
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
              options: {
                datapick: true,
                pickEffect: 'New',
                pickCond: () => {
                  return true;
                },
              },
            },
          },
          message: '로딩중입니다.',
        },
      },
      divLink: {
        C: '/hospital/child?',
        F: '/hospital/famdoc?',
        E: '/hospital/examine?',
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
            link: '/hospital/board/inquiry/list',
            list: [],
            rowLink: '/hospital/board/inquiry/contents',
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
            link: '/hospital/board/faq/list',
            list: [],
            rowLink: '/hospital/board/faq/contents',
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
            link: '/hospital/board/notice/list',
            list: [],
            rowLink: '/hospital/board/notice/contents',
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
            link: '/hospital/board/faq/list',
            list: [],
            rowLink: '/hospital/board/faq/contents',
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
            link: '/hospital/board/notice/list',
            list: [],
            rowLink: '/hospital/board/notice/contents',
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
    };
  },

  computed: {
    ...mapState('user', ['districtCode', 'userOrganId', 'userOrganTargetType', 'business', 'userOrganTargetId', 'adminOrganType', 'surveyCheck', 'selfCheckListIsDone', 'hospitalType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['isSurveyOpen', 'endBusiness', 'notificationTitle']),
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
    if (this.districtCodeFirst === 'B' && new Date() < new Date('2024-12-01 00:00:00')) {
      // 인천
      popupContents.push('incheonBusinessClose');
    } else if (this.districtCodeFirst === 'D' && new Date() < new Date('2024-12-01 00:00:00')) {
      // 부산
      popupContents.push('busanBusinessClose');
    }
    if ((this.isDev || new Date() > new Date('2024-10-31 23:59:59')) && new Date() < new Date('2025-01-01 00:00:00')) {
      // 사업 종료 안내 팝업
      if (this.districtCodeFirst === 'C') {
        popupContents.push('gyeonggiClose');
      } else {
        popupContents.push('businessClose');
      }
    }
    // if (this.districtCode === 'A0118') popupContents.push('SeoulSongpaguHealthcareNotification');
    if ((this.isDev && !this.endBusiness('survey')) || this.isSurveyOpen) {
      // 만족도조사 안내 팝업
      if (['A', 'B', 'D', 'I', 'J'].includes(this.districtCodeFirst)) {
        popupContents.push('surveyGuide');
      }
    }
    this.$store.dispatch('popup/popupOpen', { contents: popupContents });

    this.rowData.notificationInfo.title = this.notificationTitle;

    if (this.districtCodeFirst === 'A') {
      this.manualList = [];
      if (this.hospitalType === 'H') {
        this.manualList.push([6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 서울시 아동치과주치의 서식자료.zip']);
      }
      if (this.hospitalType === 'N') {
        this.manualList.push([6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 서울시 서식_의료기관용.zip']);
      }
      if (this.business && this.business.businessDivisionC === 'Y') {
        if (this.hospitalType === 'H') {
          this.manualList.push([3, '보건소치과 아동치과주치의 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 보건소치과 전산가이드.pdf']);
        } else if (this.hospitalType !== 'N') {
          this.manualList.push([3, '아동치과주치의 전산 매뉴얼']);
        }
      }
      if (this.business && this.business.businessDivisionF === 'Y' && this.hospitalType !== 'H' && this.hospitalType !== 'N') {
        this.manualList.push([3, '학생치과주치의 전산 매뉴얼']);
      }
      if (this.business && this.business.businessDivisionE === 'Y' && this.hospitalType !== 'N') {
        this.manualList.push([3, '학생구강검진 전산 매뉴얼']);
      }
      if (this.hospitalType === 'N') {
        this.manualList.push([3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 의료기관 전산가이드.zip']);
      }
      if (this.hospitalType !== 'H') {
        this.manualList.push([
          1,
          '개인정보 파기 확약서 작성 가이드',
          'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/2024 서울시 의료기관 개인정보 파기 확약서 작성가이드.pdf',
        ]);
      }
      this.manualList.push([2, '교육영상(학생용) 보기', 'https://seoul-edu.kai-i.com/', 'blank']);
    } else if (this.districtCodeFirst === 'B') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/incheon/2024 인천시 서식.zip'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/incheon/2024 인천시 아동치과주치의 전산가이드 병원용.pdf'],
      ];
    } else if (this.districtCodeFirst === 'C') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/2024 경기도 서식.zip'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/의료기관용 덴티아이 전산매뉴얼.pdf'],
        [2, '교육영상(학생용) 보기', 'https://gyeonggi-edu.kai-i.com/', 'blank'],
        [4, '교육영상(의료기관용) 보기', '/hospital/video/manual', 'push'],
        [1, '치과주치의사업 안내서', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/2024 경기도 초등학생 치과주치의사업 안내서_의료기관용.pdf'],
        [5, '학생 사업 참여방법 영상', '/hospital/video/business', 'push'],
        [8, '치과주치의사업 포스터, 가정통신문 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/치과주치의사업 포스터, 가정통신문 다운로드.zip'],
        [9, '치과주치의사업 홍보 동영상 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/gyeonggi/2024경기도 초등학생 치과주치의사업 홍보영상.mp4'],
      ];
    } else if (this.districtCodeFirst === 'D') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/2024 부산시 서식.zip'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/busan/2024 부산시 아동(학생) 치과주치의 사용자 가이드 병원용.pdf'],
      ];
    } else if (this.districtCodeFirst === 'F') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/miryang/2024 밀양시 서식.zip'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/miryang/2024 밀양시 학생치과주치의 사용자 가이드 병원용.pdf'],
      ];
    } else if (this.districtCodeFirst === 'G') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/suwon/2024 수원시 서식.zip'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/suwon/2024 수원시 학생구강검진 병원용 사용자 가이드.pdf'],
      ];
    } else if (this.districtCodeFirst === 'I') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/2024 전북특별자치도교육청 서식.zip'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/2024 전북특별자치도교육청 구강진료 지원사업 전산가이드 병원용.pdf'],
        [3, '의료기관 날인 첨부 가이드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/jbe/2024 전북특별자치도교육청 구강진료 지원사업 대표 치과의사 날인 가이드.pdf'],
      ];
    } else if (this.districtCodeFirst === 'J') {
      this.manualList = [
        [6, '서식자료 다운로드', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/use/2024 울산광역시교육청 서식.zip'],
        [3, '의료기관 전산 매뉴얼', 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/use/2024 울산광역시교육청 학생치과주치의 사용자 가이드 병원용.pdf'],
      ];
    } else {
      this.manualList = [
        [6, '서식자료 다운로드'],
        [3, '의료기관 전산 매뉴얼'],
      ];
    }
    if (this.userOrganId) {
      // 비밀번호 변경 전 로그아웃 시 호출 방지
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
    // 서울시 아동치과주치의만 미작성 바로가기 -> 미작성, 임시저장 필터 적용
    if (this.districtCodeFirst === 'A') {
      this.rowData['notificationInfo']['values']['left']['link'] = 'notificationNull=Y&notificationStatusN=Y';
    }
    this.getDashBoardData();
    if (['A', 'C'].includes(this.districtCodeFirst)) {
      this.getFaqList();
    }
    if (this.districtCodeFirst === 'C') {
      this.getInquiryList();

      if (!this.surveyCheck && !this.endBusiness('survey') && (new Date() > new Date('2024-09-02 07:59:59') || this.isDev)) {
        // 사업 설문조사 팝업
        if (this.districtCodeFirst === 'C' && new Date() < new Date('2024-11-13')) {
          // 경기 > 이슈 정상화 안내 팝업 (~11/12 23:59)
          this.$fire({
            html: `<p>검진결과 통보서 제출 오류가 해결되어 현재 정상적으로 이용 가능합니다.<br /> 서비스 이용에 불편을 드린 점 다시 한번 사과드리며, 앞으로도 안정적인 서비스 제공을 위해 최선을 다하겠습니다. 감사합니다.</p>`,
            confirmButtonText: '확인',
          }).then(() => {
            this.$fire({
              html: '<span style="font-size: 17px">귀 기관은 현재 치과주치의사업 만족도 조사에 참여하지 않으셨습니다.<br/>참여하시겠습니까? (9문항 약 5분 소요)</span>',
              confirmButtonText: '참여하기',
              showCancelButton: true,
              cancelButtonText: '닫기',
            }).then(r => {
              if (r.value) {
                this.$router.push('/hospital/survey');
              } else {
                this.showRemainingPopup();
              }
            });
          });
        } else {
          this.$fire({
            html: '<span style="font-size: 17px">귀 기관은 현재 치과주치의사업 만족도 조사에 참여하지 않으셨습니다.<br/>참여하시겠습니까? (9문항 약 5분 소요)</span>',
            confirmButtonText: '참여하기',
            showCancelButton: true,
            cancelButtonText: '닫기',
          }).then(r => {
            if (r.value) {
              this.$router.push('/hospital/survey');
            } else {
              this.showRemainingPopup();
            }
          });
        }
      } else {
        if (this.districtCodeFirst === 'C' && new Date() < new Date('2024-11-13')) {
          // 경기 > 이슈 정상화 안내 팝업 (~11/12 23:59)
          this.$fire({
            html: `<p>검진결과 통보서 제출 오류가 해결되어 현재 정상적으로 이용 가능합니다.<br /> 서비스 이용에 불편을 드린 점 다시 한번 사과드리며, 앞으로도 안정적인 서비스 제공을 위해 최선을 다하겠습니다. 감사합니다.</p>`,
            confirmButtonText: '확인',
          }).then(() => {
            this.showRemainingPopup();
          });
        } else {
          this.showRemainingPopup();
        }
      }

      // if (new Date() < new Date('2024-05-04')) {
      //   this.$fire({
      //     html: '<p>5/2(목) 덴티아이경기 앱에서<br /> 학생 정보 등록 시 일부 학교 목록 조회가 불가한<br /> 이슈가 있었습니다.</p><p class="mt10">5/2 16:20경 조치 완료되었으며,<br /> 현재 <strong>덴티아이경기 앱 최신 버전으로 업데이트 진행</strong>하시면<br /> 학교 목록을 정상적으로 확인할 수 있습니다.</p><p class="mt10">이용에 불편을 드려 죄송합니다.</p>',
      //     confirmButtonText: '확인',
      //   });
      // }
    }
    if (this.districtCodeFirst === 'F' && new Date() > new Date('2024-04-21') && new Date() < new Date('2024-06-01')) {
      this.$fire({
        html: '<p>4월 22일부터 덴티아이 앱을 통해 동의서 및 문진표를 작성하지 않은 경우<br /> 의료기관에서 받은 <strong>개인정보 동의서를 스캔해서 올려주시거나<br /> 직접 보관 체크</strong>를 해주셔야 <strong>문진표 및 통보서 입력이 가능</strong>합니다.</p><br /><p class="commp6">* 학생 또는 보호자가 덴티아이 앱을 통해 동의서 및 문진표를 작성 하시면<br /> 의료기관에서는 바로 통보서 입력이 가능합니다.</p><p class="commp6 mt5">* 직접 보관을 선택하셨을 경우 보관기관은 의료기관을 선택하시면 됩니다.</p>',
        confirmButtonText: '확인',
      });
    }
  },

  methods: {
    // 경기도 자율점검표 팝업 노출
    showRemainingPopup() {
      if (!this.selfCheckListIsDone && ((new Date() > new Date('2024-10-06 23:59:59') && new Date() < new Date('2024-12-01 00:00:00')) || this.isDev)) {
        this.$fire({
          html: '<span style="font-size: 17px">귀 기관은 현재 치과주치의사업 의료기관 자율점검표를<br /> 작성하지 않으셨습니다.<br/>작성하시겠습니까? (17문항 약 10분 소요)</span>',
          confirmButtonText: '작성하기',
          showCancelButton: true,
          cancelButtonText: '닫기',
        }).then(r => {
          if (r.value) {
            this.$router.push('/hospital/selfCheck');
          }
        });
      }
    },

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
      if (this.$route.path === '/hospital/home/child') {
        this.businessDivisionStatus = 'C';
      } else if (this.$route.path === '/hospital/home/famdoc') {
        this.businessDivisionStatus = 'F';
      } else if (this.$route.path === '/hospital/home/examine') {
        this.businessDivisionStatus = 'E';
      }
      this.requestHandling({
        request: this.districtCodeFirst === 'C' ? Board.gyeonggiHealthCareAndHospitalDashBoardList : Board.healthCenterHospitalDashBoardList,
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
          } else {
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
          if (this.districtCodeFirst === 'A') {
            this.$emit('hasReject', {
              hasRejectC: data.hasRejectC,
              hasRejectF: data.hasRejectF,
              hasRejectE: data.hasRejectE,
            });
          } else if (this.districtCodeFirst === 'D') {
            this.$store.commit('user/setRegistrationAvailable', data.registrationAvailable);
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
          // districtCode: this.districtCode,
          inquiryQuestionAdminOrganId: this.userOrganId,
          inquiryQuestionAdminOrganType: this.valueToCode('C0006', this.adminOrganType),
          page: 1,
          size: 6,
        },
        dispatch: data => {
          this.gyeonggiNotice.values.first.list = data;
        },
        middleware: res => res.inquiryList,
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
  },
};
</script>

<style scoped>
.hideDiv {
  display: none;
}
</style>
