<template>
  <div class="sub__content form__ver_1 bg_white mt30">
    <v-detailed-search cmp="statsReport" divclass="mt15" :disabled="userOrganTargetType !== 'CT'" @search="search"></v-detailed-search>
    <div class="comm__line mt20"></div>
    <div class="row mt30">
      <div class="flex_box inner--right">
        <a :href="manualHref" class="comm__red_btn btn_m_size2 d_block wid130 commp mr10" target="_blank">통계 기준</a>
        <a href="javascript:;" class="comm__blue_bd_btn btn_m_size2 d_block wid130 commp" @click="print">인쇄하기</a>
      </div>
    </div>
    <div id="print">
      <div class="sub__section mt10">
        <div class="titbox row">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_searchlist.png" /></span>
          <p class="commp2 d_inblock fwb ml5">{{ businessYear }}년도 아동치과주치의 종합실적 요약표({{ healthCareName }})</p>
        </div>
        <div class="section_con">
          <v-vrtcltable :table="sumTable" :class="'report__table'"></v-vrtcltable>
        </div>
      </div>
      <div class="sub__section mt30">
        <div class="titbox row">
          <span class="icon d_inblock"><img src="@/assets/images/common/ic_searchlist.png" /></span>
          <p class="commp2 d_inblock fwb ml5">{{ businessYear }}년도 아동치과주치의 종합실적 그래프({{ healthCareName }})</p>
        </div>
        <div class="section_con">
          <table class="comm__table">
            <thead>
              <tr>
                <th scope="col" colspan="4" class="fwb">통보서</th>
              </tr>
              <tr>
                <th scope="col"><p class="scommp">만 12세 영구치 우식유병률</p></th>
                <th scope="col"><p class="scommp">만 12세 유치 우식유병률</p></th>
                <th scope="col"><p class="scommp">만 12세 영구치 우식경험률</p></th>
                <th scope="col"><p class="scommp">만 12세 유치 우식경험률</p></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="inner__table">
                  <table>
                    <tr>
                      <th>있음</th>
                      <th>없음</th>
                    </tr>
                    <tr>
                      <td>{{ form.total_12old > 0 ? numberRound((form.n_2_y_detail_12old_yes / form.total_12old) * 100, 2) : 0 }}%</td>
                      <td>{{ form.total_12old > 0 ? numberRound((form.n_2_y_detail_12old_no / form.total_12old) * 100, 2) : 0 }}%</td>
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
                      <td>{{ form.total_12old > 0 ? numberRound((form.n_2_u_detail_12old_yes / form.total_12old) * 100, 2) : 0 }}%</td>
                      <td>{{ form.total_12old > 0 ? numberRound((form.n_2_u_detail_12old_no / form.total_12old) * 100, 2) : 0 }}%</td>
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
                      <td>{{ form.total_12old > 0 ? numberRound((form.n_2_y_detail_before_12old_yes / form.total_12old) * 100, 2) : 0 }}%</td>
                      <td>{{ form.total_12old > 0 ? numberRound((form.n_2_y_detail_before_12old_no / form.total_12old) * 100, 2) : 0 }}%</td>
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
                      <td>{{ form.total_12old > 0 ? numberRound((form.n_2_u_detail_before_12old_yes / form.total_12old) * 100, 2) : 0 }}%</td>
                      <td>{{ form.total_12old > 0 ? numberRound((form.n_2_u_detail_before_12old_no / form.total_12old) * 100, 2) : 0 }}%</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th scope="col">
                  <p class="scommp">만 12세 영구치 우식유병률</p>
                  <p class="sscommp c_gray3">총계({{ numberWithCommas(form.n_2_y_detail_12old_yes + form.n_2_y_detail_12old_no) }}명)</p>
                </th>
                <th scope="col">
                  <p class="scommp">만 12세 유치 우식유병률</p>
                  <p class="sscommp c_gray3">총계({{ numberWithCommas(form.n_2_u_detail_12old_yes + form.n_2_u_detail_12old_no) }}명)</p>
                </th>
                <th scope="col">
                  <p class="scommp">만 12세 영구치 우식경험률</p>
                  <p class="sscommp c_gray3">총계({{ numberWithCommas(form.n_2_y_detail_before_12old_yes + form.n_2_y_detail_before_12old_no) }}명)</p>
                </th>
                <th scope="col">
                  <p class="scommp">만 12세 유치 우식경험률</p>
                  <p class="sscommp c_gray3">총계({{ numberWithCommas(form.n_2_u_detail_before_12old_yes + form.n_2_u_detail_before_12old_no) }}명)</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div class="chart chart1"></div></td>
                <td><div class="chart chart2"></div></td>
                <td><div class="chart chart3"></div></td>
                <td><div class="chart chart4"></div></td>
              </tr>
            </tbody>
          </table>
          <table class="comm__table">
            <thead>
              <tr>
                <th scope="col" class="fwb">구강위생검사</th>
                <th scope="col" class="fwb">문진표</th>
              </tr>
              <tr>
                <th scope="col"><p class="scommp">만 12세 구강위생검사</p></th>
                <th scope="col"><p class="scommp">만 7-18세 점심 직후 칫솔질 실천율</p></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="inner__table">
                  <table>
                    <tr>
                      <th>양호</th>
                      <th>보통</th>
                      <th>개선필요</th>
                    </tr>
                    <tr>
                      <td>{{ form.n_11_yes + form.n_11_food > 0 ? numberRound((form.n_11_score_good / (form.n_11_yes + form.n_11_food)) * 100, 2) : 0 }}%</td>
                      <td>{{ form.n_11_yes + form.n_11_food > 0 ? numberRound((form.n_11_score_normal / (form.n_11_yes + form.n_11_food)) * 100, 2) : 0 }}%</td>
                      <td>{{ form.n_11_yes + form.n_11_food > 0 ? numberRound((form.n_11_score_bad / (form.n_11_yes + form.n_11_food)) * 100, 2) : 0 }}%</td>
                    </tr>
                  </table>
                </td>
                <td class="inner__table">
                  <table>
                    <tr>
                      <th>실행 (만 7-12세)</th>
                      <th>미실행 (만 7-12세)</th>
                      <th>실행 (만 13-18세)</th>
                      <th>미실행 (만 13-18세)</th>
                    </tr>
                    <tr>
                      <td>{{ form.total_7old_12old + form.total_13old_18old > 0 ? numberRound((form.q_9_lunch_7old_12old_yes / (form.total_7old_12old + form.total_13old_18old)) * 100, 2) : 0 }}%</td>
                      <td>{{ form.total_7old_12old + form.total_13old_18old > 0 ? numberRound((form.q_9_lunch_7old_12old_no / (form.total_7old_12old + form.total_13old_18old)) * 100, 2) : 0 }}%</td>
                      <td>{{ form.total_7old_12old + form.total_13old_18old > 0 ? numberRound((form.q_9_lunch_13old_18old_yes / (form.total_7old_12old + form.total_13old_18old)) * 100, 2) : 0 }}%</td>
                      <td>{{ form.total_7old_12old + form.total_13old_18old > 0 ? numberRound((form.q_9_lunch_13old_18old_no / (form.total_7old_12old + form.total_13old_18old)) * 100, 2) : 0 }}%</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </tbody>
            <thead>
              <tr>
                <th scope="col">
                  <p class="scommp">만 12세 구강위생검사</p>
                  <p class="sscommp c_gray3">총계({{ numberWithCommas(form.n_11_yes + form.n_11_food) }}명)</p>
                </th>
                <th scope="col">
                  <p class="scommp">만 7-18세 점심 직후 칫솔질 실천율</p>
                  <p class="sscommp c_gray3">총계({{ numberWithCommas(form.total_7old_12old + form.total_13old_18old) }}명)</p>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div class="chart chart5 chart-div2"></div></td>
                <td><div class="chart chart6 chart-div2"></div></td>
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
    ...mapState('user', ['userOrganTargetType', 'districtName', 'districtCode', 'cityType', 'healthCareType']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('definedCode', ['valueToCode']),
    manualHref() {
      if (this.cityType === 'E' || this.healthCareType === 'E') {
        return 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/서울시 덴티아이 시스템 통계자료(자동보고서) 가이드_교육청,치과의사회 계정.pdf';
      }
      if (this.userOrganTargetType === 'CT') {
        return 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/서울시 덴티아이 시스템 통계자료(자동보고서) 가이드_서울시 계정_240819.pdf';
      }
      if (this.districtCode === 'A0109') {
        return 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/서울시 덴티아이 시스템 통계자료(자동보고서) 가이드_노원구 보건소 계정_240819.pdf';
      }
      return 'https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/seoul/서울시 덴티아이 시스템 통계자료(자동보고서) 가이드_보건소 계정_240819.pdf';
    },
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
        tabType: this.valueToCode('C0003', 'C'),
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
              ['서비스 제공자', 1, 1, ''],
              ['참여 치과 의료기관 수', 1, 3, ''],
              [this.numberWithCommas(this.form.countHospitalBusiness) + '개소', 1, 1, ''],
            ],
            [
              ['서비스 이용자', 4, 1, ''],
              ['지역아동센터', 2, 1, ''],
              ['참여 기관 수', 1, 2, ''],
              [this.numberWithCommas(this.form.regionalChildrenCenter) + '개소', 1, 1, ''],
            ],
            [
              ['등록 아동 수', 1, 2, ''],
              [this.numberWithCommas(this.form.countRegionalChildrenCenter) + '명', 1, 1, ''],
            ],
            [
              ['기타', 2, 1, ''],
              ['참여 기관 수', 1, 2, ''],
              [this.numberWithCommas(this.form.othersCenter) + '개소', 1, 1, ''],
            ],
            [
              ['등록 아동 수', 1, 2, ''],
              [this.numberWithCommas(this.form.countOthersCenter) + '명', 1, 1, ''],
            ],
            [
              ['제공된 서비스 양', 19, 1, 'last'],
              ['구강검진', 7, 1, ''],
              ['문진 및 구강검진', 1, 2, ''],
              [this.numberWithCommas(this.form.total) + '명', 1, 1, ''],
            ],
            [
              ['치아 우식증', 4, 1, ''],
              ['충전된 치아(영구치)', 1, 1, ''],
              [this.numberWithCommas(this.form.n_1_y) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.n_1_y / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['충전된 치아(유치)', 1, 1, ''],
              [this.numberWithCommas(this.form.n_1_u) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.n_1_u / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['현재 우식치아(영구치)', 1, 1, ''],
              [this.numberWithCommas(this.form.n_2_y_detail) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.n_2_y_detail / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['현재 우식치아(유치)', 1, 1, ''],
              [this.numberWithCommas(this.form.n_2_u_detail) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.n_2_u_detail / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['치주질환', 1, 2, ''],
              [this.numberWithCommas(this.form.n_7) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.n_7 / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['치면세균막검사(PHP)', 1, 2, ''],
              [this.numberWithCommas(this.form.n_11_yes) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.n_11_yes / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['구강보건교육', 1, 1, ''],
              ['구강보건교육', 1, 2, ''],
              [
                this.numberWithCommas(this.form.totalContent) +
                  '명 (' +
                  (this.form.total > 0 ? this.numberRound((this.form.totalContent / (this.form.countRegionalChildrenCenter + this.form.countOthersCenter)) * 100, 2) : 0) +
                  '%)',
                1,
                1,
                '',
              ],
            ],
            [
              ['예방 진료', 4, 1, ''],
              ['전문가 구강위생관리', 1, 2, ''],
              [this.numberWithCommas(this.form.n_13_1) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.n_13_1 / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['불소도포', 1, 2, ''],
              [this.numberWithCommas(this.form.n_13_2) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.n_13_2 / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['치아홈메우기', 1, 2, ''],
              [this.numberWithCommas(this.form.n_13_check_1) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.n_13_check_1 / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['치석제거', 1, 2, ''],
              [this.numberWithCommas(this.form.n_13_check_2) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.n_13_check_2 / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['치료', 6, 1, 'last'],
              ['충전(아말감, 레진, Gi, 인레이, 크라운)', 1, 2, ''],
              [this.numberWithCommas(this.form.s_2) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.s_2 / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['발치', 1, 2, ''],
              [this.numberWithCommas(this.form.s_5) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.s_5 / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['유치발치', 1, 2, ''],
              [this.numberWithCommas(this.form.s_4) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.s_4 / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['치수/치근단 치료', 1, 2, ''],
              [this.numberWithCommas(this.form.s_3) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.s_3 / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['방사선 촬영', 1, 2, ''],
              [this.numberWithCommas(this.form.s_1) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.s_1 / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
            ],
            [
              ['간격유지장치', 1, 2, ''],
              [this.numberWithCommas(this.form.s_6) + '명 (' + (this.form.total > 0 ? this.numberRound((this.form.s_6 / this.form.total) * 100, 2) : 0) + '%)', 1, 1, ''],
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
        [this.form.n_2_y_detail_12old_yes, this.form.n_2_y_detail_12old_no],
        [this.form.n_2_u_detail_12old_yes, this.form.n_2_u_detail_12old_no],
        [this.form.n_2_y_detail_before_12old_yes, this.form.n_2_y_detail_before_12old_no],
        [this.form.n_2_u_detail_before_12old_yes, this.form.n_2_u_detail_before_12old_no],
        [this.form.n_11_score_good, this.form.n_11_score_normal, this.form.n_11_score_bad],
        [this.form.q_9_lunch_7old_12old_yes, this.form.q_9_lunch_7old_12old_no, this.form.q_9_lunch_13old_18old_yes, this.form.q_9_lunch_13old_18old_no],
      ];

      for (let d = 0; d < 6; d++) {
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
        ['있음', { v: data[0][0], f: this.numberWithCommas(data[0][0]) + '명' }],
        ['없음', { v: data[0][1], f: this.numberWithCommas(data[0][1]) + '명' }],
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
        ['있음', { v: data[2][0], f: this.numberWithCommas(data[2][0]) + '명' }],
        ['없음', { v: data[2][1], f: this.numberWithCommas(data[2][1]) + '명' }],
      ]);
      // chart4
      const data4 = google.visualization.arrayToDataTable([
        ['구분', '인원수'],
        ['있음', { v: data[3][0], f: this.numberWithCommas(data[3][0]) + '명' }],
        ['없음', { v: data[3][1], f: this.numberWithCommas(data[3][1]) + '명' }],
      ]);
      // chart5
      const data5 = google.visualization.arrayToDataTable([
        ['구분', '인원수'],
        ['양호', { v: data[4][0], f: this.numberWithCommas(data[4][0]) + '명' }],
        ['보통', { v: data[4][1], f: this.numberWithCommas(data[4][1]) + '명' }],
        ['개선필요', { v: data[4][2], f: this.numberWithCommas(data[4][2]) + '명' }],
      ]);
      // chart6
      const data6 = google.visualization.arrayToDataTable([
        ['구분', '인원수'],
        ['실행\n(만 7-12세)', { v: data[5][0], f: this.numberWithCommas(data[5][0]) + '명' }],
        ['미실행\n(만 7-12세)', { v: data[5][1], f: this.numberWithCommas(data[5][1]) + '명' }],
        ['실행\n(만 13-18세)', { v: data[5][2], f: this.numberWithCommas(data[5][2]) + '명' }],
        ['미실행\n(만 13-18세)', { v: data[5][3], f: this.numberWithCommas(data[5][3]) + '명' }],
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
        colors: ['#32a2dc', '#f7808b', '#fcb671', '#4ebfc6', '#f4e457', '#be88e3'],
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
        const chartData = [data1, data2, data3, data4, data5, data6];
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
    async print() {
      this.$store.commit('loading', true);
      const form = {
        studentBusinessDivision: this.valueToCode('C0003', 'C'),
      };
      DocumentFile.automaticReportLogSave(form).then(async res => {
        if (res && res.data.rt === 200) {
          const dummy = document.getElementById('clone');
          const selector = document.getElementById('print'); // 프린트 할 영역
          let clone = selector.cloneNode(true); // 프린트 영역 복제
          clone.style.margin = '10px';
          dummy.appendChild(clone);
          await this.$htmlToPdfPrint(dummy);
          dummy.innerHTML = '';
          this.$store.commit('loading', false);
        } else {
          this.$store.commit('loading', false);
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          return false;
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
  margin: -55px -18px -60px;
  transform: translateX(-25%) scale(0.6);
}
#clone .chart5 {
  transform: translateX(-12%) scale(0.6);
}
#clone .chart6 {
  transform: translateX(-12%) scale(0.6);
}
#clone .chart-div2 {
  margin-left: 38px;
}
#clone .chart.empty {
  margin-left: 0;
}
</style>
