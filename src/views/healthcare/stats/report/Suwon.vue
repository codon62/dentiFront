<template>
  <div class="sub__content form__ver_1 bg_white mt30">
    <v-detailed-search cmp="statsReport" divclass="mt15" :disabled="userOrganTargetType !== 'CT'" @search="search"></v-detailed-search>
    <div class="comm__line mt20"></div>
    <div class="row mt30">
      <div class="inner--right">
        <a href="javascript:;" class="comm__blue_bd_btn btn_m_size2 d_block wid130 commp inner--right ml10" @click="print(true)">인쇄하기</a>
      </div>
    </div>
    <div id="print">
      <div class="sub__section mt10">
        <div class="titbox row">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_searchlist.png" /></span>
          <p class="commp2 d_inblock fwb ml5">{{ businessYear }}년도 학생구강검진 종합실적 요약표({{ healthCareName }})</p>
        </div>
        <div class="section_con">
          <v-vrtcltable :table="sumTable" :class="'report__table'"></v-vrtcltable>
        </div>
      </div>
      <div class="sub__section mt30">
        <div class="titbox row">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_searchlist.png" /></span>
          <p class="commp2 d_inblock fwb ml5">{{ businessYear }}년도 학생구강검진 종합실적 그래프({{ healthCareName }})</p>
        </div>
        <div class="section_con">
          <table class="comm__table">
            <thead>
              <tr>
                <th scope="col" colspan="2" class="fwb">통보서</th>
                <th scope="col" class="fwb">문진표</th>
              </tr>
              <tr>
                <th scope="col"><p class="scommp">구강위생상태</p></th>
                <th scope="col"><p class="scommp">충치발생 위험치아</p></th>
                <th scope="col"><p class="scommp">칫솔질 횟수 실천율</p></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="inner__table">
                  <table>
                    <tr>
                      <th>우수</th>
                      <th>보통</th>
                      <th>개선요망</th>
                    </tr>
                    <tr>
                      <td>{{ form.n_9_1_per }}%</td>
                      <td>{{ form.n_9_2_per }}%</td>
                      <td>{{ form.n_9_3_per }}%</td>
                    </tr>
                  </table>
                </td>
                <td class="inner__table">
                  <table>
                    <tr>
                      <th>있음</th>
                      <th>없음</th>
                    </tr>
                    <tr>
                      <td>{{ form.n_3_yes_per }}%</td>
                      <td>{{ form.n_3_no_per }}%</td>
                    </tr>
                  </table>
                </td>
                <td class="inner__table">
                  <table>
                    <tr>
                      <th>1점</th>
                      <th>2점</th>
                      <th>3점</th>
                    </tr>
                    <tr>
                      <td>{{ form.q_12_1_per }}%</td>
                      <td>{{ form.q_12_2_per }}%</td>
                      <td>{{ form.q_12_3_per }}%</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th scope="col">
                  <p class="scommp">구강위생상태</p>
                  <p class="sscommp c_gray3">우수({{ numberWithCommas(form.n_9_1) }}명) 보통({{ numberWithCommas(form.n_9_2) }}명) 개선요망({{ numberWithCommas(form.n_9_3) }}명)</p>
                </th>
                <th scope="col">
                  <p class="scommp">충치발생 위험치아</p>
                  <p class="sscommp c_gray3">있음({{ numberWithCommas(form.n_3_yes) }}명) 없음({{ numberWithCommas(form.n_3_no) }}명)</p>
                </th>
                <th scope="col">
                  <p class="scommp">칫솔질 횟수 실천율</p>
                  <p class="sscommp c_gray3">총계({{ numberWithCommas(form.q_12_total) }}명)</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div class="chart chart1"></div></td>
                <td><div class="chart chart2"></div></td>
                <td><div class="chart chart3"></div></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
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
      healthCareList: [],
      form: [],
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
      abortController: null,
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType', 'districtName', 'districtCode']),
    ...mapState('business', ['businessYear']),
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
        this.healthCareName = this.healthCareList.find(hel => hel.districtCode === code).healthCareName;
      } else {
        this.healthCareName = this.districtName;
      }
    },
    getData() {
      let form = {
        districtCode: this.districtCode,
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
              ['제공된 서비스 양', 15, 1, ''],
              ['구강검진', 15, 1, ''],
              ['문진 및 구강검진', 1, 2, ''],
              [this.numberWithCommas(this.form.total) + '명', 1, 1, ''],
            ],
            [
              ['충치(있음)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_2_yes) + '명', 1, 1, ''],
            ],
            [
              ['충치(없음)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_2_no) + '명', 1, 1, ''],
            ],
            [
              ['충치발생 위험치아(있음)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_3_yes) + '명', 1, 1, ''],
            ],
            [
              ['충치발생 위험치아(없음)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_3_no) + '명', 1, 1, ''],
            ],
            [
              ['결손치아(있음)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_4_yes) + '명', 1, 1, ''],
            ],
            [
              ['결손치아(없음)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_4_no) + '명', 1, 1, ''],
            ],
            [
              ['구내염 및 연조직 질환(있음)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_5_yes) + '명', 1, 1, ''],
            ],
            [
              ['구내염 및 연조직 질환(없음)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_5_no) + '명', 1, 1, ''],
            ],
            [
              ['부정교합(없음)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_6_0) + '명', 1, 1, ''],
            ],
            [
              ['부정교합(교정필요)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_6_1) + '명', 1, 1, ''],
            ],
            [
              ['부정교합(교정중)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_6_3) + '명', 1, 1, ''],
            ],
            [
              ['그 밖의 치아상태(과잉치)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_10_1) + '명', 1, 1, ''],
            ],
            [
              ['그 밖의 치아상태(유치잔존)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_10_2) + '명', 1, 1, ''],
            ],
            [
              ['그 밖의 치아상태(기타)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_10_etc) + '명', 1, 1, ''],
            ],
          ];
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
        [this.form.n_9_1, this.form.n_9_2, this.form.n_9_3],
        [this.form.n_3_yes, this.form.n_3_no],
        [this.form.q_12_1, this.form.q_12_2, this.form.q_12_3],
      ];

      for (let d = 0; d < 3; d++) {
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
        ['우수', { v: data[0][0], f: this.numberWithCommas(data[0][0]) + '명' }],
        ['보통', { v: data[0][1], f: this.numberWithCommas(data[0][1]) + '명' }],
        ['개선요망', { v: data[0][2], f: this.numberWithCommas(data[0][2]) + '명' }],
      ]);
      // chart2
      const data2 = google.visualization.arrayToDataTable([
        ['구분', '인원수'],
        ['있음', { v: data[1][0], f: this.numberWithCommas(data[1][0]) + '명' }],
        ['없음', { v: data[1][1], f: this.numberWithCommas(data[1][1]) + '명' }],
      ]);
      // chart3
      const data3 = google.visualization.arrayToDataTable([
        ['구분', '인원수'],
        ['1점: 일1~2회', { v: data[2][0], f: this.numberWithCommas(data[2][0]) + '명' }],
        ['2점: 일3~4회', { v: data[2][1], f: this.numberWithCommas(data[2][1]) + '명' }],
        ['3점 이상: \n일5회 이상', { v: data[2][2], f: this.numberWithCommas(data[2][2]) + '명' }],
      ]);

      const options = {
        height: 260,
        backgroundColor: 'transparent',
        fontName: 'inherit',
        fontSize: 12.8,
        chartArea: {
          top: '20%',
          left: '10%',
          width: '80%',
          height: '60%',
        },
        colors: ['#32a2dc', '#f7808b', '#fcb671'],
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

      function draw() {
        const chartData = [data1, data2, data3];
        chartData.forEach((data, index) => {
          let chart = new google.visualization.PieChart(document.querySelector(`.chart${index + 1}`));
          chart.draw(data, options);
        });
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
            studentBusinessDivision: this.valueToCode('C0003', 'E'),
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
  transform: translateX(-10%) scale(0.6);
}
</style>
