<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td>
      <p class="scommp">{{ districtCodeFirst === 'C' ? data.districtSiName : data.districtGunguName }}</p>
    </td>
    <td>
      <p class="scommp">
        {{ data.hospitalName }}
        <br />
        ({{ districtCodeFirst === 'B' ? data.hospitalMedicalNum : data.hospitalRegNum }})
      </p>
    </td>
    <td>
      <p class="scommp" v-html="`${data.hospitalCeo}${isTemporaryId ? '</br/>(' + data.hospitalLicense + ')' : ''}`"></p>
    </td>
    <td v-if="(divJoin('C') && cityType !== 'E' && healthCareType !== 'E') || this.districtCodeFirst === 'J'"><p class="scommp" v-html="divList"></p></td>
    <template v-if="districtCodeFirst === 'C'">
      <td>
        <p class="scommp">{{ data.hospitalTreatDisabledPerson ? hospitalTreatDisabledPerson.value[data.hospitalTreatDisabledPerson] : '불가능' }}</p>
      </td>
      <td>
        <p class="scommp">{{ data.hospitalVideoEdu ? hospitalVideoEdu.value[data.hospitalVideoEdu] : '미이수' }}</p>
      </td>
    </template>
    <td>
      <p class="scommp">{{ data.userOrganManagerAlarm ? userOrganManagerAlarm.value[data.userOrganManagerAlarm] : '-' }}</p>
    </td>
    <td v-if="districtCodeFirst === 'C'">
      <v-button v-if="data.selfCheckListIsDone" message="보기" @vclick="selfCheck(data.hospitalId)"></v-button>
      <template v-else>-</template>
    </td>
    <td v-if="isTemporaryId">
      <p class="scommp" v-html="data.temporaryLoginIdList.length ? data.temporaryLoginIdList.join('<br/>') : '-'"></p>
    </td>
    <td><v-button message="수정" @vclick="popupOpen({ contents: 'managementHospitalInfoModify', params: { hospitalId: data.hospitalId } })"></v-button></td>
    <td><v-button message="초기화" @vclick="passwordReset"></v-button></td>
    <template v-if="adminOrganType === 'AD'">
      <td><v-button :message="modMsg" :tooltip="modTooltip" @vclick="changeId"></v-button></td>
      <td><v-button message="취소" @vclick="deleteHospital"></v-button></td>
    </template>
  </tr>
</template>

<script>
import Admin from '@/apis/Admin';
import Management from '@/apis/Management';
import Button from '@/components/common/Button.vue';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  components: {
    'v-button': Button,
  },
  props: ['num', 'data'],
  data() {
    return {
      modMsg: '',
      modTooltip: '',
    };
  },
  computed: {
    ...mapState('user', ['adminOrganType', 'cityType', 'healthCareType']),
    ...mapState('status', ['userOrganManagerAlarm', 'hospitalVideoEdu', 'hospitalTreatDisabledPerson']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName']),
    ...mapGetters('definedCode', ['valueToCode']),
    isTemporaryId() {
      return ['A', 'I'].includes(this.districtCodeFirst) && (this.cityType === 'E' || this.healthCareType === 'E' || this.adminOrganType === 'AD');
    },
    divList() {
      let divList = '';
      if (this.data.businessDivisionC === 'Y') {
        divList += this.divName('C', true);
      }
      if (this.data.businessDivisionF === 'Y') {
        if (divList !== '') {
          divList += '<br>';
        }
        divList += this.divName('F', true);
      }
      if (this.data.businessDivisionE === 'Y') {
        if (divList !== '') {
          divList += '<br>';
        }
        divList += this.divName('E', true);
      }
      return divList;
    },
  },
  watch: {
    data() {
      this.status();
    },
  },
  created() {
    this.status();
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    selfCheck(hospitialId) {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewSelfCheck',
        params: { hospitalId: hospitialId },
      });
    },
    status() {
      this.modMsg = this.data.hospitalType === 'H' ? '수정불가' : '수정';
      this.modTooltip = this.modMsg === '수정불가' ? '보건소치과는 사업자등록번호를 변경할 수 없습니다.' : '';
    },
    passwordReset() {
      this.$confirm('비밀번호를 초기화하시겠습니까?', '알림', 'question')
        .then(() => {
          const form = {
            userOrganTargetId: this.data.hospitalId,
            userOrganTargetType: this.valueToCode('C0006', 'HP'),
          };
          Management.passwordReset(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('초기화되었습니다.', '알림', 'success');
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
    changeId() {
      const hptNum = this.districtCodeFirst === 'B' ? this.data.hospitalMedicalNum : this.data.hospitalRegNum;
      const title = this.districtCodeFirst === 'B' ? '요양기관번호' : '사업자등록번호';
      this.$prompt('', hptNum, title + ' 변경', '', { html: `변경할 ${title}를 입력해주세요.<br/>병원의 아이디도 같이 변경됩니다.` })
        .then(res => {
          const modifyHospitalRegNum = res.replace(/[^0-9]/g, ''); // 숫자만 통과
          const goodLength = this.districtCodeFirst === 'B' ? 8 : 10;
          if (modifyHospitalRegNum.length !== goodLength) {
            this.$alert('잘못된 입력값입니다.', '알림', 'warning');
            return false;
          }
          const form = {
            hospitalId: this.data.hospitalId,
            modifyHospitalRegNum: modifyHospitalRegNum,
            doType: this.districtCodeFirst,
          };
          Admin.hptNumModify(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('변경되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
              });
            } else {
              if (res.data.rt === 422) {
                this.$alert('중복된 데이터가 존재합니다.', '알림', 'error');
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            }
          });
        })
        .catch(() => {});
    },
    deleteHospital() {
      this.$confirm(`${this.data.hospitalName} 병원을 삭제하시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            userType: this.valueToCode('C0006', 'HP'),
            userId: this.data.hospitalId,
          };
          Management.delete(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('삭제되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
              });
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
