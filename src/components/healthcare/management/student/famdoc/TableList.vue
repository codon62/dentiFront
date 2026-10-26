<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <td v-if="userOrganTargetType === 'CT'">
      <p class="scommp">{{ districtCodeFirst === 'C' ? data.districtSiName : data.districtGunguName }}</p>
    </td>
    <td>
      <p class="scommp">{{ divName(data.businessDivision, true) }}</p>
    </td>
    <td>
      <p class="scommp">
        {{ data.studentName }}
        <br />
        ({{ studentGender[data.studentGender] }})
      </p>
    </td>
    <td v-if="districtCodeFirst === 'C'">
      <p class="scommp" :class="{ c_red: data.studentRegistUserOrganTargetType === 'HC', c_blue: data.studentRegistUserOrganTargetType === 'SC' }">
        {{ data.studentRegistAdminOrganTargetName }}
      </p>
    </td>
    <td>
      <p class="scommp">{{ data.studentBirth ? data.studentBirth : '-' }}</p>
    </td>
    <td v-if="districtCodeFirst === 'C'">
      <p class="scommp">{{ data.schoolType ? schoolType.value[data.schoolType] : '-' }}</p>
    </td>
    <td><p class="scommp" v-html="data.studentToSchoolGrade1 ? `${data.schoolName}<br>(${data.studentToSchoolGrade1}/${data.studentToSchoolGrade2}/${data.studentToSchoolGrade3})` : '학교밖'"></p></td>
    <td><p class="scommp" v-html="(data.studentTel ? data.studentTel : '-') + (data.studentTel2 ? '<br>(' + data.studentTel2 + ')' : '')"></p></td>
    <td><v-button :message="iafMsg" :tooltip="iafTooltip" @vclick="agreement"></v-button></td>
    <td><v-button :message="queMsg" :tooltip="queTooltip" @vclick="questionnaire"></v-button></td>
    <td v-if="['A', 'C'].includes(districtCodeFirst)">
      <p v-if="data.completeEduDate" class="scommp">이수</p>
      <v-button v-else message="미이수" @vclick="preventEduComplete"></v-button>
    </td>
    <td>
      <p class="scommp">{{ data.hospitalName ? data.hospitalName : '-' }}</p>
    </td>
    <td>
      <p
        class="scommp"
        v-html="
          data.userId
            ? (adminOrganType === 'AD' ? (data.userEmail ? data.userEmail : '이메일 없음') : '가입') + (data.userSnsType ? '<br>(' + userSnsType.value[data.userSnsType] + ')' : '')
            : '미가입'
        "
      ></p>
    </td>
    <td><v-button :message="data.userId ? '초기화' : '-'" @vclick="appRollback"></v-button></td>
    <td v-if="districtCodeFirst === 'C'"><v-button message="보기" @vclick="studentLogPopup"></v-button></td>
    <td><v-button message="수정" @vclick="infoModify"></v-button></td>
    <td><v-button :message="delMsg" :tooltip="delTooltip" @vclick="deleteStudent"></v-button></td>
    <td v-if="adminOrganType === 'AD'"><v-button message="보기" @vclick="admin"></v-button></td>
  </tr>
</template>

<script>
import Management from '@/apis/Management';
import Button from '@/components/common/Button.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapState('user', ['userOrganTargetType', 'adminOrganType']),
    ...mapState('status', ['studentGender', 'userSnsType', 'schoolType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName', 'endBusiness', 'questionnaireTitle']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
  components: {
    'v-button': Button,
  },
  data() {
    return {
      iafMsg: '',
      iafTooltip: '',
      queMsg: '',
      queTooltip: '',
      delMsg: '',
      delTooltip: '',
    };
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
    statusToMsg(status, rule) {
      switch (status) {
        case 'Y':
          return '보기';
        case 'N':
          return rule ? '임시저장' : '임시저장불가';
        case null:
          return rule ? '등록' : '등록불가';
      }
    },
    status() {
      this.iafMsg = this.data.infoAgreeFileUId ? '보기' : this.data.studentAppAgree ? 'APP 동의' : '등록';
      this.iafTooltip = '';
      if (this.adminOrganType !== 'AD' && this.iafMsg === '등록' && this.endBusiness('treatment')) {
        this.iafMsg = '등록불가';
        this.iafTooltip = '동의서 등록이 마감되었습니다.';
      }
      this.queMsg = this.statusToMsg(this.data.questionnaireStatus, !(['F'].includes(this.districtCodeFirst) && this.iafMsg === '등록'));
      this.queTooltip = this.queMsg.includes('불가') ? '개인정보활용동의서 등록 후 작성 가능합니다.' : '';
      if (this.adminOrganType !== 'AD' && this.queMsg === '등록' && this.endBusiness('treatment')) {
        this.queMsg = '등록불가';
        this.queTooltip = `${this.questionnaireTitle} 등록이 마감되었습니다.`;
      }
      this.delMsg = this.adminOrganType !== 'AD' && this.data.deletable === 'N' ? '취소불가' : '취소';
      this.delTooltip = this.delMsg === '취소불가' ? 'APP 가입 또는 지정된 병원이 있는 학생은 삭제할 수 없습니다.' : '';
      if (this.adminOrganType !== 'AD' && this.delMsg === '취소' && this.endBusiness('treatment')) {
        this.delMsg = '취소불가';
        this.delTooltip = '학생 삭제가 마감되었습니다.';
      }
    },
    agreement() {
      if (this.iafMsg === '보기') {
        this.$store.dispatch('popup/popupOpen', {
          contents: 'viewAgreement',
          params: { studentId: this.data.studentId, studentName: this.data.studentName, businessDivision: this.data.businessDivision },
        });
      } else {
        this.$store.dispatch('popup/popupOpen', {
          contents: this.districtCodeFirst === 'F' ? 'checkAgreement' : 'registAgreement',
          params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision },
        });
      }
    },
    questionnaire() {
      if (this.queMsg === '등록' || this.queMsg === '임시저장') {
        this.$router.push({ path: '/healthcare/que', query: { studentId: this.data.studentId, businessDivision: this.data.businessDivision } });
      } else {
        this.$store.dispatch('popup/popupOpen', { contents: 'viewQuestionnaire', params: { studentId: this.data.studentId, businessDivision: this.data.businessDivision } });
      }
    },
    preventEduComplete() {
      this.$confirm('"구강보건교육"을 이수로 처리하시겠습니까?', '알림', 'question')
        .then(() => {
          const form = {
            studentId: this.data.studentId,
          };
          Management.eduRegist(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('처리되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
              });
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
    appRollback() {
      this.$confirm(`${this.data.studentName} 학생의 APP 가입을 초기화하시겠습니까?`, '알림', 'question')
        .then(() => {
          const form = {
            studentId: this.data.studentId,
            userId: this.data.userId,
          };
          Management.studentAppRollback(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('처리되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
              });
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
    studentLogPopup() {
      this.$store.dispatch('popup/popupOpen', { contents: 'studentLogPopup', params: this.data });
    },
    infoModify() {
      this.$store.dispatch('popup/popupOpen', { contents: 'managementStudentStudentEnrollment', params: this.data });
    },
    deleteStudent() {
      Management.beforeDeleteInfo({ studentId: this.data.studentId }).then(res => {
        if (res && res.data.rt === 200) {
          let msg = `${this.data.studentName} 학생을 삭제하시겠습니까?`;

          if (res.data.businessDivisionList.length > 1) {
            const businessDivisionList = res.data.businessDivisionList.map(item => this.divName(this.codeToValue(item)));
            msg += `<br/><span style="color: red">※ 주의 : 학생이 참여하고 있는 모든 사업에서 삭제됩니다.<br/>참여중인 사업 : ${businessDivisionList.join(', ')}</span>`;
          }

          this.$confirm('', '알림', 'question', { html: msg })
            .then(() => {
              const form = {
                userType: this.valueToCode('C0006', 'ST'),
                userId: this.data.studentId,
              };
              Management.delete(form).then(res2 => {
                if (res2 && res2.data.rt === 200) {
                  this.$alert('삭제되었습니다.', '알림', 'success').then(() => {
                    this.$store.commit('update');
                  });
                } else {
                  alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res2.data.rt);
                }
              });
            })
            .catch(() => {});
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    admin() {
      this.$store.dispatch('popup/popupOpen', { contents: 'adminManagement', params: this.data });
    },
  },
};
</script>
