<template>
  <div :class="customClass">
    <div>
      <p class="commp5 c_black2 fwb">{{ title }}</p>
    </div>
    <div v-if="chartType === 'ColumnChart'" class="board__con bg_white mt15 column_chart_wrap">
      <div class="chart_container mt10">
        <transition name="slide-fade">
          <GChart v-if="tableList.length" type="ColumnChart" :options="chartProps['stackedBarChart']" :data="chartData()" />
          <LoadingSpinner v-else />
        </transition>
      </div>
    </div>
    <div v-else class="board__con bg_white mt15 table_chart_wrap">
      <div class="table_container">
        <ul v-for="(item, index) in tableList" :key="index">
          <li>{{ item.header }}</li>
          <li>{{ numberWithCommas(item.value) }}</li>
        </ul>
      </div>
      <div class="chart_container mt10">
        <transition name="slide-fade">
          <GChart v-if="tableList.length" type="PieChart" :options="chartProps['pieChart']" :data="chartData()" />
          <LoadingSpinner v-else />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default {
  name: 'ChartTableContainer',
  props: ['title', 'contentType', 'data', 'customClass', 'chartType'],
  data() {
    return {
      billCountTableList: {
        total: { header: '총 비용청구 건', value: 0 },
        billStatusY: { header: '처리완료', value: 0 },
        billStatusN: { header: '청구중', value: 0 },
        billStatusR: { header: '반려', value: 0 },
      },
      notificationCountTableList: {
        total: { header: '총 등록학생', value: 0 },
        notificationStatusY: { header: '최종제출', value: 0 },
        notificationStatusN: { header: '임시저장', value: 0 },
        notificationStatusNull: { header: '미등록', value: 0 },
      },
      businessDivisionCountList: [],
      tableList: [],
      chartProps: {
        pieChart: {
          height: 250,
          legend: {
            position: 'labeled',
            labeledValueText: 'value',
            textStyle: {
              fontSize: 16,
            },
          },
          fontSize: '14',
          pieSliceText: 'value',
          pieSliceTextStyle: { bold: true },
          chartArea: { width: '100%', height: '90%' },
          colors: ['#32a2dc', '#edae70', '#f7808b'],
          sliceVisibilityThreshold: 0,
        },
        stackedBarChart: {
          isStacked: true,
          height: 290,
          legend: { position: 'top', maxLines: 3 },
          colors: ['#f7808b', '#32a2dc'],
          fontSize: '15',
          chartArea: { width: '70%', height: '70%' },
          vAxis: { minValue: 10 },
          bar: {
            groupWidth: 25,
          },
        },
      },
    };
  },
  watch: {
    data() {
      this.setChartData();
    },
  },
  created() {
    this.setChartData();
  },
  components: {
    LoadingSpinner,
    GChart,
  },
  methods: {
    chartData() {
      switch (this.contentType) {
        case 'billCount':
        case 'notificationCount': {
          return this.tableList.map((item, index) => (index === 0 ? ['상태', '값'] : [item.header, { v: item.value, f: `${item.header}: ${this.numberWithCommas(item.value)}건` }]));
        }
        case 'businessDivisionCount': {
          let barChartData = [['월', '학생치과주치의', '학생구강검진']];
          this.tableList.forEach(item => {
            barChartData.push([
              `${item.month}월`,
              { v: item.businessDivisionF, f: `${this.numberWithCommas(item.businessDivisionF)}건` },
              { v: item.businessDivisionE, f: `${this.numberWithCommas(item.businessDivisionE)}건` },
            ]);
          });
          return barChartData;
        }
      }
    },
    setChartData() {
      switch (this.contentType) {
        case 'billCount': {
          let total = 0;
          for (let i in this.data) {
            this.billCountTableList[i].value = this.data[i];
            total += this.data[i];
          }
          this.billCountTableList['total'].value = total;
          this.tableList = Object.values(this.billCountTableList);
          break;
        }
        case 'notificationCount': {
          let total = 0;
          for (let i in this.data) {
            this.notificationCountTableList[i].value = this.data[i];
            total += this.data[i];
          }
          this.notificationCountTableList['total'].value = total;
          this.tableList = Object.values(this.notificationCountTableList);
          break;
        }
        case 'businessDivisionCount': {
          this.tableList = this.data;
          break;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.table_chart_wrap {
  padding: 20px 50px;
  height: 360px;
  position: relative;
}
.column_chart_wrap {
  height: 290px;
  position: relative;
}
.table_container {
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.1) 0 4px 6px -1px, rgba(0, 0, 0, 0.06) 0 2px 4px -1px;
  & > ul {
    flex: 1;
    & > li {
      display: flex;
      height: 50px;
      justify-content: center;
      align-items: center;
      //border: 1px solid #e6e6e6;
      box-shadow: rgba(149, 149, 149, 0.15) 1.95px 1.95px 2.6px;
      font-size: 14px;
    }
    & > li:first-child {
      font-weight: bold;
      background-color: #f4f4f4;
    }
  }
}
.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 1.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
