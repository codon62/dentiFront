import 'es6-promise/auto';
import Vue from 'vue';
import VueSimpleAlert from 'vue-simple-alert';
import VueCookies from 'vue-cookies';
import Fragment from 'vue-fragment';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store/index';
import VueGoogleCharts from 'vue-google-charts';
import htmlToPdf from '@/plugins/htmlToPdf';
import VTooltip from 'v-tooltip';

Vue.use(VueSimpleAlert);
Vue.use(VueCookies);
Vue.use(Fragment.Plugin);
Vue.use(VueGoogleCharts);
Vue.use(htmlToPdf);
Vue.use(VTooltip);

window.$ = window.jQuery = require('jquery');

/**
 * 전역 변수 선언부
 */
// 개발서버면 true, 실서버면 false
Vue.prototype.isDev = process.env.NODE_ENV !== 'production';

/**
 * 전역 함수 선언부
 */
// 숫자 3자리마다 콤마 삽입
Vue.prototype.numberWithCommas = num => {
  return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0';
};
// 소수점 자릿수에 맞춰서 반올림
Vue.prototype.numberRound = (num, digit) => {
  const digit10 = Math.pow(10, digit);
  return Math.round((num + Number.EPSILON) * digit10) / digit10;
};
// 네트워크 통신 후 파일 다운로드
Vue.prototype.fileDownload = (blob, fileName) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
};

// new Vue({
//   el: '#app',
//   router, // router 설정
//   store,
//   render: h => h(App),
// });

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
