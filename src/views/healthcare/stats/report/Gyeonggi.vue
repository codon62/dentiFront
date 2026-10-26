<template>
  <div class="sub__content form__ver_1 bg_white mt30">
    <v-detailed-search cmp="statsReport" divclass="mt15" :disabled="userOrganTargetType !== 'CT' && districtCodeFirst !== 'C'" @search="search"></v-detailed-search>
    <div class="comm__line mt20"></div>
    <div class="row mt30">
      <div class="inner--right">
        <a href="javascript:;" class="comm__blue_bd_btn btn_m_size2 d_block wid130 commp inner--right ml10" @click="print(true)">저장(인쇄)하기</a>
      </div>
    </div>
    <div id="print">
      <div class="sub__section mt10">
        <div class="titbox">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_searchlist.png" /></span>
          <span class="commp2 d_inblock fwb ml5">{{ businessYear }}년도 학생치과주치의 종합실적 요약표({{ healthCareName + healthCareName2 }})</span>
          <span class="commp2 d_inblock fwb inner--right">기준 : 누적통계 일 단위 ({{ datePeriod }})</span>
        </div>
        <div class="section_con">
          <v-vrtcltable :table="sumTable" :class="'report__table'"></v-vrtcltable>
        </div>
      </div>
      <div class="sub__section mt30">
        <div class="titbox row">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_searchlist.png" /></span>
          <p class="commp2 d_inblock fwb ml5">{{ businessYear }}년도 학생치과주치의 종합실적 그래프({{ healthCareName + healthCareName2 }})</p>
        </div>
        <div class="section_con">
          <table class="comm__table">
            <thead>
              <tr>
                <th scope="col"><p class="scommp">수검 / 미수검</p></th>
                <th scope="col"><p class="scommp">수검자 비율</p></th>
                <th scope="col"><p class="scommp">참여자 남녀비율</p></th>
                <th scope="col"><p class="scommp">선택진료 항목 비율</p></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="inner__table">
                  <table>
                    <tr>
                      <th>전체 대상자</th>
                      <td>{{ numberWithCommas(form.countStudent) }}명</td>
                    </tr>
                    <tr>
                      <th>수검자</th>
                      <td>{{ numberWithCommas(form.gyeonggiTotalBillY) }}명</td>
                    </tr>
                    <tr>
                      <th>미수검자</th>
                      <td>{{ numberWithCommas(form.gyeonggiTotalBillIsNull) }}명</td>
                    </tr>
                  </table>
                </td>
                <td class="inner__table">
                  <table>
                    <tr>
                      <th>전체 수검자</th>
                      <td>{{ numberWithCommas(form.gyeonggiTotal) }}명</td>
                    </tr>
                    <tr>
                      <th>학생치과주치의</th>
                      <td>{{ numberWithCommas(form.gyeonggiTotalF) }}명</td>
                    </tr>
                    <tr>
                      <th>학생구강검진</th>
                      <td>{{ numberWithCommas(form.gyeonggiTotalE) }}명</td>
                    </tr>
                  </table>
                </td>
                <td class="inner__table">
                  <table>
                    <tr>
                      <th>전체 참여자</th>
                      <td>{{ numberWithCommas(form.gyeonggiTotalGender) }}명</td>
                    </tr>
                    <tr>
                      <th>남자</th>
                      <td>{{ numberWithCommas(form.gyeonggiTotalGenderM) }}명</td>
                    </tr>
                    <tr>
                      <th>여자</th>
                      <td>{{ numberWithCommas(form.gyeonggiTotalGenderW) }}명</td>
                    </tr>
                  </table>
                </td>
                <td class="inner__table">
                  <table>
                    <tr>
                      <th>선택진료(총합계)</th>
                      <td>{{ numberWithCommas(form.gyeonggiN_13_check_total) }}건</td>
                    </tr>
                    <tr>
                      <th class="fwn">파노라마</th>
                      <td>{{ numberWithCommas(form.gyeonggiN_13_check_4) }}건 / {{ numberWithCommas(form.gyeonggiN_13_check_4_per) }}%</td>
                    </tr>
                    <tr>
                      <th class="fwn">치석제거</th>
                      <td>{{ numberWithCommas(form.gyeonggiN_13_check_3) }}건 / {{ numberWithCommas(form.gyeonggiN_13_check_3_per) }}%</td>
                    </tr>
                    <tr>
                      <th class="fwn">실란트</th>
                      <td>{{ numberWithCommas(form.gyeonggiN_13_check_1) }}건 / {{ numberWithCommas(form.gyeonggiN_13_check_1_per) }}%</td>
                    </tr>
                  </table>
                  <p class="sscommp mt10">
                    (한 학생이 1가지 이상의 선택진료
                    <span class="d_inblock2">중복으로 받을 수 있음)</span>
                  </p>
                </td>
              </tr>
              <tr>
                <td><div class="chart chart1"></div></td>
                <td><div class="chart chart2"></div></td>
                <td><div class="chart chart3"></div></td>
                <td><div class="chart chart4"></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 적용 보류 -->
      <!--      <div v-if="userOrganTargetType === 'CT'" class="sub__section mt30 blind">-->
      <!--        <div class="titbox row">-->
      <!--          <span class="icon d_inblock"><img src="@/assets/images/common/ic_searchlist.png" /></span>-->
      <!--          <p class="commp2 d_inblock fwb ml5">{{ businessYear }}년도 학생치과주치의 - 상세 분석 결과({{ healthCareName + healthCareName2 }})</p>-->
      <!--        </div>-->
      <!--        <div class="section_con">-->
      <!--          <v-vrtcltable :table="resultTable"></v-vrtcltable>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <div id="clone"></div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import DetailedSearch from '@/components/common/DetailedSearch.vue';
import VrtclTable from '@/components/common/VrtclTable.vue';
import Common from '@/apis/Common';
import Statistic from '@/apis/Statistic';
import { mapGetters, mapState } from 'vuex';
import DocumentFile from '@/apis/DocumentFile';

export default {
  components: {
    'v-detailed-search': DetailedSearch,
    'v-vrtcltable': VrtclTable,
  },
  data() {
    return {
      healthCareName: '',
      healthCareName2: '',
      healthCareList: [],
      secondHealthCareList: [],
      form: [],
      datePeriod: '',
      sumTable: {
        // span, width
        col: [
          [4, '*'],
          [1, '25%'],
        ],
        // title, rowspan, colspan, class
        thead: [
          [
            ['구분', 1, 1, ''],
            ['세부내용', 1, 3, ''],
            ['결과', 1, 1, ''],
          ],
        ],
        tbody: [],
      },
      resultTable: {
        col: [[1, '*']],
        thead: [[['PHP 지수 15점 이하(3명) 유병률', 1, 1, '']]],
        tbody: [],
      },
      abortController: null,
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'districtName', 'districtCode']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['districtInfo']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  watch: {
    '$route.query'() {
      if (!this.isDev && this.$route.query.districtCode?.includes('99')) {
        alert('테스트 지역구 자동보고서는 제공되지 않습니다.');
        this.$router.go(-1);
        return false;
      }
      this.getName(this.$route.query.districtCode);
      this.getData();
    },
    update() {
      this.getData();
    },
  },
  created() {
    if (!this.isDev && this.districtCode.includes('99')) {
      alert('테스트 지역구 자동보고서는 제공되지 않습니다.');
      this.$router.go(-1);
      return false;
    }
    this.getData();
    this.getName(this.$route.query.districtCode);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const startDate = this.districtInfo.startDay
      .split('-')
      .map(o => parseInt(o))
      .join('.');
    const endDate = `${yesterday.getMonth() + 1}.${yesterday.getDate()}`;

    this.datePeriod = `${startDate} ~ ${endDate}`;
  },
  methods: {
    async getName(code) {
      if (code) {
        if (!this.healthCareList.length) {
          await Common.healthCareList({ districtCode: this.districtCode }).then(res => {
            if (res && res.data.rt === 200) {
              this.healthCareList = res.data.healthCareList;
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        }
        this.healthCareName = this.healthCareList.find(hel => hel.districtCode === code.substring(0, 3)).healthCareName;

        if (code.length > 3) {
          if (!this.secondHealthCareList.length) {
            await Common.healthCareSecondList({ districtCode: this.districtCode }).then(res => {
              if (res && res.data.rt === 200) {
                this.secondHealthCareList = res.data.healthCareList;
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            });
          }
          this.healthCareName2 = ' ' + this.secondHealthCareList.find(hel => hel.districtCode === code).healthCareName;
        } else {
          this.healthCareName2 = '';
        }
      } else {
        this.healthCareName = this.districtName;
        this.healthCareName2 = '';
      }
    },
    getData() {
      let form = {
        districtCode: this.districtCode,
        tabType: this.valueToCode('C0003', 'F'),
      };
      for (const i in this.$route.query) {
        form[i] = this.$route.query[i];
      }
      this.abortController = new AbortController();
      Statistic.automaticReport(form, this.abortController.signal).then(res => {
        if (res && res.data.rt === 200) {
          google.charts.load('current', { packages: ['corechart'] });
          google.charts.setOnLoadCallback(this.drawChart);

          this.form = res.data.form;
          this.sumTable.tbody = [
            [
              ['서비스 제공자', 2, 1, ''],
              ['참여 치과 의료기관 수', 1, 3, ''],
              [this.numberWithCommas(this.form.countHospitalBusiness) + '개소', 1, 1, ''],
            ],
            [
              ['치과주치의 수', 1, 3, ''],
              [this.numberWithCommas(this.form.countHospitalDoctor) + '명', 1, 1, ''],
            ],
            [
              ['서비스 이용자', 2, 1, ''],
              ['참여 학교 수', 1, 3, ''],
              [this.numberWithCommas(this.form.countSchool) + '개교', 1, 1, ''],
            ],
            [
              ['참여 학생 수', 1, 3, ''],
              [this.numberWithCommas(this.form.countStudent) + '명', 1, 1, ''],
            ],
            [
              ['제공된 서비스 양', 14, 1, 'last'],
              ['구강검진', 8, 1, ''],
              ['문진 및 구강검진 / 참여율(%)', 1, 2, ''],
              [this.numberWithCommas(this.form.total) + '명 / ' + this.numberWithCommas(this.form.joinTotal) + '%', 1, 1, ''],
            ],
            [
              ['치아 우식증', 4, 1, ''],
              ['충전된 치아', 1, 1, ''],
              [this.numberWithCommas(this.form.n_1_yes) + '명', 1, 1, ''],
            ],
            [
              ['현재 우식치아', 1, 1, ''],
              [this.numberWithCommas(this.form.n_2_yes) + '명', 1, 1, ''],
            ],
            [
              ['현재 우식치아(영구치)', 1, 1, ''],
              [this.numberWithCommas(this.form.n_2_y) + '명', 1, 1, ''],
            ],
            [
              ['현재 우식치아(유치)', 1, 1, ''],
              [this.numberWithCommas(this.form.n_2_u) + '명', 1, 1, ''],
            ],
            [
              ['우식발생위험치아', 1, 2, ''],
              [this.numberWithCommas(this.form.n_3) + '명', 1, 1, ''],
            ],
            [
              ['부정교합', 1, 2, ''],
              [this.numberWithCommas(this.form.n_6_1 + this.form.n_6_2 + this.form.n_6_3) + '명', 1, 1, ''],
            ],
            [
              ['치면세균막검사(PHP)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_11_yes) + '명', 1, 1, ''],
            ],
            [
              ['구강보건교육', 1, 1, ''],
              ['구강보건교육', 1, 2, ''],
              [this.numberWithCommas(this.form.totalContent) + '명', 1, 1, ''],
            ],
            [
              ['예방 진료', 2, 1, ''],
              ['전문가 구강위생관리', 1, 2, ''],
              [this.numberWithCommas(this.form.n_13_1) + '명', 1, 1, ''],
            ],
            [
              ['불소도포(불소바니쉬)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_13_2) + '명', 1, 1, ''],
            ],
            [
              ['선택 진료\n (한 학생이 1가지 이상의 선택진료 중복으로 받을 수 있음)', 5, 1, 'last'],
              ['치아홈메우기', 1, 2, ''],
              [this.numberWithCommas(this.form.n_13_check_1) + '명', 1, 1, ''],
            ],
            [
              ['부분 치석제거', 1, 2, ''],
              [this.numberWithCommas(this.form.n_13_check_3) + '명', 1, 1, ''],
            ],
            [
              ['파노라마 촬영', 1, 2, ''],
              [this.numberWithCommas(this.form.n_13_check_4) + '명', 1, 1, ''],
            ],
          ];

          this.resultTable.tbody = [[[this.form.php_15_under, 1, 1, 'tal']]];
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    search(searchData) {
      let query = {};
      for (const i in searchData) {
        if (typeof searchData[i] === 'object') {
          for (const j in searchData[i]) {
            if (searchData[i][j]) {
              query[j] = searchData[i][j];
            } else {
              delete query[j];
            }
          }
        } else {
          if (searchData[i]) {
            query[i] = searchData[i];
          } else {
            delete query[i];
          }
        }
      }
      this.abortController?.abort();
      if (JSON.stringify(query) !== JSON.stringify(this.$route.query)) {
        this.$router.push({ query: query });
      } else {
        this.getData();
      }
    },
    drawChart() {
      // chart data
      const data = [
        [this.form.gyeonggiTotalBillY, this.form.gyeonggiTotalBillIsNull],
        [this.form.gyeonggiTotalF, this.form.gyeonggiTotalE],
        [this.form.gyeonggiTotalGenderM, this.form.gyeonggiTotalGenderW],
        [this.form.gyeonggiN_13_check_4, this.form.gyeonggiN_13_check_3, this.form.gyeonggiN_13_check_1],
      ];

      for (let d = 0; d < 4; d++) {
        let sum = 0;
        for (let s = 0; s < data[d].length; s++) sum += data[d][s];
        if (sum === 0) {
          document.querySelector('.chart' + (d + 1) + '').classList.add('empty');
        } else {
          document.querySelector('.chart' + (d + 1) + '').classList.remove('empty');
        }
      }

      // chart1
      const data1 = google.visualization.arrayToDataTable([
        ['구분', '인원수'],
        ['수검자', { v: data[0][0], f: this.numberWithCommas(data[0][0]) + '명' }],
        ['미수검자', { v: data[0][1], f: this.numberWithCommas(data[0][1]) + '명' }],
      ]);
      // chart2
      const data2 = google.visualization.arrayToDataTable([
        ['구분', '인원수'],
        ['학생치과주치의', { v: data[1][0], f: this.numberWithCommas(data[1][0]) + '명' }],
        ['학생구강검진', { v: data[1][1], f: this.numberWithCommas(data[1][1]) + '명' }],
      ]);
      // chart3
      const data3 = google.visualization.arrayToDataTable([
        ['구분', '인원수'],
        ['남자', { v: data[2][0], f: this.numberWithCommas(data[2][0]) + '명' }],
        ['여자', { v: data[2][1], f: this.numberWithCommas(data[2][1]) + '명' }],
      ]);
      // chart4
      const data4 = google.visualization.arrayToDataTable([
        ['구분', '건수', { role: 'style' }, { role: 'annotation' }],
        ['파노라마', data[3][0], '#32a2dc', this.numberWithCommas(data[3][0]) + '건'],
        ['치석제거', data[3][1], '#f7808b', this.numberWithCommas(data[3][1]) + '건'],
        ['실란트', data[3][2], '#fcb671', this.numberWithCommas(data[3][2]) + '건'],
      ]);

      const pieOptions = {
        height: 260,
        backgroundColor: 'transparent',
        fontName: 'inherit',
        fontSize: 12.8,
        chartArea: {
          top: '20%',
          left: '8%',
          width: '84%',
          height: '60%',
        },
        colors: ['#32a2dc', '#f7808b'],
        legend: {
          position: 'labeled',
          labeledValueText: 'value',
        },
        tooltip: {
          trigger: 'none',
        },
        pieSliceText: 'none',
        sliceVisibilityThreshold: 0,
      };

      const columnOptions = {
        height: 260,
        backgroundColor: 'transparent',
        fontName: 'inherit',
        fontSize: 12,
        chartArea: {
          top: '20%',
          left: '15%',
          width: '70%',
          height: '60%',
        },
        legend: 'none',
        tooltip: {
          trigger: 'none',
        },
        annotations: {
          alwaysOutside: true,
          textStyle: {
            auraColor: '#fff',
          },
        },
        vAxis: {
          minValue: this.form.gyeonggiN_13_check_total,
        },
        bar: {
          groupWidth: '30%',
        },
      };

      function draw() {
        const chartData = [data1, data2, data3];
        chartData.forEach((data, index) => {
          let pieChart = new google.visualization.PieChart(document.querySelector(`.chart${index + 1}`));
          pieChart.draw(data, pieOptions);
        });

        const column = new google.visualization.ColumnChart(document.querySelector('.chart4'));
        column.draw(data4, columnOptions);
      }
      draw();
      window.addEventListener('resize', function () {
        draw();
      });
    },
    print(img) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      const dummy = document.getElementById('clone');
      dummy.style.position = 'absolute';
      dummy.style.top = '-999em';
      dummy.style.left = '-999em';
      dummy.style.width = '920px';
      const selector = document.getElementById('print'); // 프린트 할 영역
      let clone = selector.cloneNode(true); // 프린트 영역 복제
      clone.setAttribute('id', '');
      dummy.appendChild(clone);
      window.html2canvas = html2canvas; // Vue.js 특성상 window 객체에 직접 할당해야한다.
      let doc = new jsPDF('p', 'mm', 'a4');
      let canvas = doc.canvas;
      const pageWidth = 210; // 캔버스 너비 mm
      const pageHeight = 295; // 캔버스 높이 mm
      canvas.width = pageWidth;

      let ele = document.querySelector('#clone');
      let width = ele.offsetWidth; // 셀렉트한 요소의 px 너비
      let height = ele.offsetHeight; // 셀렉트한 요소의 px 높이
      let imgHeight = (pageWidth * height) / width; // 이미지 높이값 px to mm 변환

      if (!ele) {
        console.warn('#print is not exist.');
        return false;
      }
      html2canvas(ele).then(canvas => {
        while (clone.firstChild) clone.removeChild(clone.firstChild); // clone 비우기

        let position = 0;
        const imgData = canvas.toDataURL('image/png');
        if (img) {
          const form = {
            studentBusinessDivision: this.valueToCode('C0003', 'F'),
          };
          DocumentFile.automaticReportLogSave(form).then(res => {
            if (res && res.data.rt === 200) {
              var Pagelink = 'about:blank';
              var pwa = window.open(Pagelink, '_new');
              pwa.document.open();
              const source =
                `<html>
								<head>
									<style type="text/css" media="print">
										@page {
                      size: A4;
											margin-top: 10px;
											margin-bottom: 0;
											margin-left: 20px;
											margin-right: 20px;
										}
									</style>
									<script>
										function step1() {
											setTimeout("step2()", 10);
										}
										function step2() {
											window.print();
											window.close();
										}
									</scr` +
                `ipt>
								</head>
								<body onload="step1()">
									<img src="${imgData}" width="920" />
								</body>
								</html>`;

              pwa.document.write(source);
              pwa.document.close();
              return false;
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              return false;
            }
          });
        }
        doc.addImage(imgData, 'png', 0, position, pageWidth, imgHeight, undefined, 'slow');

        //Paging 처리
        let heightLeft = imgHeight; // 페이징 처리를 위해 남은 페이지 높이 세팅.
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'png', 0, position, pageWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      });
    },
  },
};
</script>

<style scoped>
.chart {
  margin: 0 auto;
  width: 380px;
  max-width: 100%;
}
.chart.empty {
  position: relative;
  transform: translateX(0) !important;
}
.chart.empty::before {
  content: '데이터가 없습니다.';
  z-index: 10;
  position: absolute;
  top: calc(50% - 15px);
  right: 0;
  left: 0;
  line-height: 30px;
  font-size: 13px;
}
#clone .mt30 {
  margin-top: 10px !important;
}
#clone .chart {
  margin: -55px 0 -60px;
  transform: translateX(-20%) scale(0.6);
}
</style>
