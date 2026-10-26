<template>
  <div class="page__comm_top tar">
    <p class="commp4 fwb d_inblock mr10">{{ userOrganTargetName }}</p>
    <a v-if="isHealthCareHospitalChange" href="javascript:;" class="d_inblock wid135 ml10 btn_m_size2 comm__red_bd_btn" @click="change">
      <img src="@/assets/images/common/ic_hospital_m.png" alt="계정 전환" />
      계정 전환
    </a>
    <template v-if="userOrganTargetType !== 'CT'">
      <a
        v-if="deldate || !['HP', 'HC', 'CE', 'SC'].includes(userOrganTargetType)"
        href="javascript:;"
        class="d_inblock wid135 ml20 btn_m_size2 comm__blue_bd_btn"
        @click="$alert(deldate ? '사업 해지된 기관은 정보 수정 기능을 이용할 수 없습니다.' : '준비중입니다.', '알림', 'warning')"
      >
        <img src="@/assets/images/common/ic_settings.png" alt="정보수정" />
        정보수정
      </a>
      <router-link v-else-if="!(isDev && !isKaii)" :to="`/${userOrganTargetTypeToPath[userOrganTargetType]}/infoModify`" class="d_inblock wid135 ml10 btn_m_size2 comm__blue_bd_btn">
        <img src="@/assets/images/common/ic_settings.png" alt="정보수정" />
        정보수정
      </router-link>
    </template>
    <a href="javascript:;" class="d_inblock wid135 ml10 btn_m_size2 comm__blue_btn" @click="logout">
      <img src="@/assets/images/common/ic_power.png" alt="로그아웃" />
      로그아웃
    </a>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import Login from '@/apis/Login';

export default {
  data() {
    return {
      ip: '',
    };
  },
  computed: {
    ...mapState('ip', ['isKaii']),
    ...mapState('user', ['userOrganTargetName', 'userOrganTargetType', 'deldate', 'healthCareType', 'hospitalType']),
    ...mapState('status', ['userOrganTargetTypeToPath', 'userOrganTargetTypeToName']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['districtInfo']),
    ...mapGetters('definedCode', ['codeToValue']),
    isHealthCareHospitalChange() {
      if (this.districtCodeFirst !== 'A') return false;
      if (this.userOrganTargetType === 'HC' && this.healthCareType === 'Y') return true;
      if (this.userOrganTargetType === 'HP' && this.hospitalType === 'H') return true;
      return false;
    },
  },
  methods: {
    ...mapActions('user', ['logout']),
    change() {
      this.$confirm(`보건소${this.userOrganTargetType === 'HC' ? '치과' : ''} 계정으로 전환하시겠습니까?`, '알림', 'question')
        .then(() => {
          Login.healthCareHospitalChange().then(res => {
            if (res && res.data.rt === 200) {
              // code convert
              res.data.loginUserInfo.userOrganTargetType = this.codeToValue(res.data.loginUserInfo.userOrganTargetType);
              res.data.loginUserInfo.hospitalType = this.codeToValue(res.data.loginUserInfo.hospitalType);
              res.data.loginUserInfo.cityType = this.codeToValue(res.data.loginUserInfo.cityType);
              res.data.loginUserInfo.healthCareType = this.codeToValue(res.data.loginUserInfo.healthCareType);
              res.data.loginUserInfo.hospitalVideoEdu = this.codeToValue(res.data.loginUserInfo.hospitalVideoEdu);
              if (res.data.loginUserInfo.business) {
                res.data.loginUserInfo.business.businessDivisionC = this.codeToValue(res.data.loginUserInfo.business.businessDivisionC);
                res.data.loginUserInfo.business.businessDivisionF = this.codeToValue(res.data.loginUserInfo.business.businessDivisionF);
                res.data.loginUserInfo.business.businessDivisionE = this.codeToValue(res.data.loginUserInfo.business.businessDivisionE);
              }
              // code convert end
              this.$store.dispatch('user/updateInfo', Object.assign(res.data.loginUserInfo, { adminOrganType: 'ALL' }));
              if (!this.isDev) {
                Gitple('update', {
                  // 깃플챗 로그인
                  id: `${this.districtInfo.eng}${this.businessYear}${this.isDev ? 'dev' : ''}@${res.data.loginUserInfo.userOrganTargetType}@${res.data.loginUserInfo.userOrganTargetId}@${
                    res.data.loginUserInfo.userOrganId
                  }`,
                  name: res.data.loginUserInfo.userOrganTargetName,
                  meta: {
                    도시: this.districtInfo.name,
                    지역구: res.data.loginUserInfo.districtName,
                    기관유형: this.userOrganTargetTypeToName[res.data.loginUserInfo.userOrganTargetType],
                    기관명: res.data.loginUserInfo.userOrganTargetName,
                  },
                });
              }
              this.$router.push('/').catch(() => {});
            } else {
              if (res.data.rt === 400) {
                this.$alert(res.data.rtMsg, '알림', 'error');
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
