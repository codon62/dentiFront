import axios from 'axios';
import store from '@/store/index';
import VueSimpleAlert from 'vue-simple-alert';
// import slack from '@/plugins/slack';

const productionPath = `https://dentii2023-${store.getters['business/districtInfo'].eng}.kai-i.com`; // 실서버 API 경로
const developmentPath = 'https://dentii2023-dev.kai-i.com'; // 개발서버 API 경로
const accessTokenPath = '/login/access-token';

const baseURL = process.env.NODE_ENV === 'production' ? productionPath : developmentPath;
let BaseApi = axios.create({
  baseURL: baseURL,
});

BaseApi.defaults.headers.common['Content-Type'] = 'application/json';
BaseApi.defaults.timeout = 600000; // 600초

BaseApi.interceptors.response.use(
  async res => {
    if (res.data.rt === 403) {
      // token 재발행 및 반환
      const res2 = await issueAccessToken();
      // res.data : 서버 통신 성공, res.data.rt === 200 : 통신 이후 정상 토큰 발급 성공
      if (res2.data && res2.data.rt === 200) {
        res.config.headers.Authorization = store.state.user.accessToken;
      } else {
        store.commit('isOk', true);
        return store.dispatch('user/logout');
      }
      return await BaseApi.request(res.config);
    }
    return res;
  },
  err => {
    if (err.config.url === '/studentToSchool/student-upload') {
      store.commit('loading', false);
      VueSimpleAlert.alert('', '알림', 'error', { html: '파일이 변경되었습니다.<br/>파일찾기 버튼을 통해 다시 업로드해 주세요.' }).then(() => {});
      return false;
    }
    // if (process.env.NODE_ENV === 'production') {
    //   slack.send(err);
    // }
    alert('서버를 불러오고 있습니다. 잠시후 시도해주세요.');
    store.commit('loading', false);
  },
);

// accessToken 재발급
export async function issueAccessToken() {
  try {
    const refreshToken = store.state.user.refreshToken ? store.state.user.refreshToken : localStorage.getItem('refreshToken');
    const res = await axios.put(baseURL + accessTokenPath, null, { headers: { RefreshToken: refreshToken } });
    store.commit('user/setAccessToken', res.data.accessToken);
    return res;
  } catch (err) {
    return err;
  }
}

let Api = login => {
  const token = store.state.user.accessToken ? store.state.user.accessToken : localStorage.getItem('accessToken');

  if (login) {
    delete BaseApi.defaults.headers.common['Authorization'];
  } else if (token) {
    BaseApi.defaults.headers.common['Authorization'] = token;
  }

  // 지역 코드
  BaseApi.defaults.headers.common['doCode'] = store.getters['business/districtInfo'].code;

  return BaseApi;
};

export default Api;
