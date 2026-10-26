<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb"><img src="@/assets/images/common/ic_check.png" />경기도 초등학생 치과주치의사업 의료기관 자율점검표 (보건소제출용)</p>
    </div>
    <div class="bg_white mt30">
      <div class="pt30 pr30 pl30">
        <p class="commp2 fwb c_red2">※ 의료기관 대표자께서 점검하시고 점검결과란에 <u>직접 기재</u>하여 주십시오.</p>
        <div class="section_container">
          <div class="section_box">
            <p>등록사항</p>
            <div class="form">
              <ColumnTable :col="2" width="150" height="40" :data="infoData" />

              <p class="commp fwb mt35">
                국가검진기관 지정 여부
                <span class="c_red d_inblock ml5">*</span>
              </p>
              <div class="radio_button mt24">
                <div class="comm_radio">
                  <div class="radio_box d_inblock hei100">
                    <input
                      type="radio"
                      v-model="form.registrationDetails.nationInspectionAgencyDesignation"
                      name="nationInspectionAgencyDesignation"
                      id="nationInspectionAgencyDesignation_0"
                      :value="0"
                      class="blind"
                    />
                    <label for="nationInspectionAgencyDesignation_0" class="pl55 pr65">
                      <span class="icon"></span>
                      <span class="label_t">지정 O</span>
                    </label>
                  </div>
                  <div class="radio_box d_inblock hei100 ml25">
                    <input
                      type="radio"
                      v-model="form.registrationDetails.nationInspectionAgencyDesignation"
                      name="nationInspectionAgencyDesignation"
                      id="nationInspectionAgencyDesignation_1"
                      :value="1"
                      class="blind"
                    />
                    <label for="nationInspectionAgencyDesignation_1" class="pl55 pr65">
                      <span class="icon"></span>
                      <span class="label_t">지정 X</span>
                    </label>
                  </div>
                </div>
              </div>

              <p class="commp fwb mt32">
                치과주치의사업 담당 인력
                <span class="c_red d_inblock ml5">*</span>
                <span class="sscommp fwn ml25">※ 전체 인력이 아님</span>
              </p>
              <div class="flex_wrap mt10">
                <div class="flex_item flex_size_s4 mt15 mr40">
                  <p class="scommp c_gray">치과의사</p>
                  <div class="flex_space_between_container mt8">
                    <input type="text" v-model="form.registrationDetails.responsiblePersonnel.dentist" maxlength="3" class="text_box tac wid170" placeholder="예) 1" @input="counting" />
                    <p class="scommp c_gray">명</p>
                  </div>
                </div>
                <div class="flex_item flex_size_s4 mt15 mr40">
                  <p class="scommp c_gray">간호사</p>
                  <div class="flex_space_between_container mt8">
                    <input type="text" v-model="form.registrationDetails.responsiblePersonnel.nurse" maxlength="3" class="text_box tac wid170" placeholder="예) 1" @input="counting" />
                    <p class="scommp c_gray">명</p>
                  </div>
                </div>
                <div class="flex_item flex_size_s4 mt15 mr40">
                  <p class="scommp c_gray">치위생사</p>
                  <div class="flex_space_between_container mt8">
                    <input type="text" v-model="form.registrationDetails.responsiblePersonnel.dentalHygienist" maxlength="3" class="text_box tac wid170" placeholder="예) 1" @input="counting" />
                    <p class="scommp c_gray">명</p>
                  </div>
                </div>
                <div class="flex_item flex_size_s4 mt15 mr40">
                  <p class="scommp c_gray">간호조무사</p>
                  <div class="flex_space_between_container mt8">
                    <input type="text" v-model="form.registrationDetails.responsiblePersonnel.nursingAssistant" maxlength="3" class="text_box tac wid170" placeholder="예) 1" @input="counting" />
                    <p class="scommp c_gray">명</p>
                  </div>
                </div>
                <div class="flex_item flex_size_s4 mt15 mr40">
                  <p class="scommp c_gray">기타</p>
                  <div class="flex_space_between_container mt8">
                    <input type="text" v-model="form.registrationDetails.responsiblePersonnel.others" class="text_box tac wid170" maxlength="3" placeholder="예) 1" @input="counting" />
                    <p class="scommp c_gray">명</p>
                  </div>
                </div>
                <div class="flex_item flex_size_s4 mt15 mr40">
                  <p class="scommp c_gray">총 합계</p>
                  <div class="flex_space_between_container mt8">
                    <input type="text" v-model="form.registrationDetails.responsiblePersonnel.total" class="text_box read_border_put tac wid170" placeholder="예) 1" disabled />
                    <p class="scommp c_gray">명</p>
                  </div>
                </div>
              </div>

              <p class="commp fwb mt32">
                치과주치의사업 참여현황
                <span class="c_red d_inblock ml5">*</span>
                <span class="sscommp fwn ml25">※ 계약기간 5년</span>
              </p>
              <div class="flex_wrap mt24">
                <div class="flex_item flex_size_s4 mr40">
                  <p class="scommp c_gray">1. 계약일</p>
                  <DateInput
                    v-model="form.registrationDetails.participationStatus.contractDate"
                    :data="form.registrationDetails.participationStatus.contractDate"
                    :customEnabled="contractEnabledDate"
                    class="mt15"
                    @input="changeContractDate"
                  />
                </div>
                <div class="flex_item flex_size_s4 mr40">
                  <p class="scommp c_gray">2. 종료일(예정)</p>
                  <DateInput
                    v-model="form.registrationDetails.participationStatus.expectedEndDate"
                    :data="form.registrationDetails.participationStatus.expectedEndDate"
                    :customEnabled="expectedEndEnabledDate"
                    :enabledFuture="true"
                    class="mt15"
                  />
                </div>
              </div>
              <div class="mt15">
                <p class="scommp c_gray">3. 비고 (선택)</p>
                <input type="text" v-model="form.registrationDetails.participationStatus.etc" maxlength="100" class="text_box mt8" placeholder="기타 사항이 있을 경우 작성해 주세요. (최대 100자)" />
              </div>
            </div>
          </div>
        </div>

        <div class="section_container">
          <div class="section_box">
            <p>점검사항</p>
            <div class="std_container">
              <div v-for="(block, index) in hospitalSelfCheck" :key="index" :class="{ mt32: index > 0 }">
                <p class="commp fwb">
                  {{ index + 1 }}. {{ block.title }}
                  <span class="c_red d_inblock ml5">*</span>
                </p>
                <CheckTable
                  :col="[80, '*', 360]"
                  :thead="['연번', '점검사항', '점검결과']"
                  :list="block.list"
                  :options="['양호', '개선필요']"
                  :data="form.checkItems"
                  class="mt24"
                  @change="getCheckItems"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="section_container">
          <div class="section_box">
            <p>서명</p>
            <div class="std_container">
              <p class="commp fwb">상기 자율점검 내용은 사실과 틀림없습니다.</p>
              <dl class="readonly_box mt24">
                <dt>최종 제출일</dt>
                <dd>{{ formatDate(today, '.') }}</dd>
              </dl>
              <dl class="readonly_box mt15">
                <dt>위 점검자(대표자)</dt>
                <dd>{{ infoData.대표자명 }}</dd>
              </dl>
              <p class="commp fwb mt24">{{ healthCareDistrictName }} 보건소장 귀하</p>
            </div>
          </div>
        </div>

        <div class="flex_space_between_container mt40 pb45">
          <div>
            <button type="button" class="white_button wid108" @click="$router.go(-1)">돌아가기</button>
          </div>
          <div class="flex_box">
            <button type="button" class="black_button wid108" @click="submit('C000100001')">임시 저장</button>
            <button type="button" class="blue_button wid180 ml25" @click="submit('C000100002')">최종 제출</button>
          </div>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import ColumnTable from '@/components/common/ColumnTable';
import CheckTable from '@/components/common/CheckTable';
import DateInput from '@/components/doc/gyeonggi/DateInput';
import SelfCheck from '@/apis/SelfCheck';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'hospitalSelfCheck',
  components: {
    ColumnTable,
    CheckTable,
    DateInput,
  },
  computed: {
    ...mapState('doc', ['hospitalSelfCheck']),
    ...mapState('user', ['userOrganTargetId', 'selfCheckListIsDone']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['codeToValue']),
  },
  data() {
    return {
      today: new Date(),
      currentYear: new Date().getFullYear(),
      contractEnabledDate: [null, null],
      expectedEndEnabledDate: [null, null],
      healthCareDistrictName: '',
      infoData: {
        기관명: '',
        요양기관번호: '',
        대표자명: '',
        사업자등록번호: '',
        '주소 (소재지)': '',
        전화번호: '',
      },
      form: {
        registrationDetails: {
          nationInspectionAgencyDesignation: null,
          responsiblePersonnel: {
            dentist: null,
            nurse: null,
            dentalHygienist: null,
            nursingAssistant: null,
            others: null,
            total: 0,
          },
          participationStatus: {
            contractDate: '',
            expectedEndDate: '',
            etc: '',
          },
        },
        checkItems: {
          sc_1: null,
          sc_2: null,
          sc_3: null,
          sc_4: null,
          sc_5: null,
          sc_6: null,
          sc_7: null,
          sc_8: null,
          sc_9: null,
          sc_10: null,
          sc_11: null,
          sc_12: null,
          sc_13: null,
          sc_14: null,
          sc_15: null,
          sc_16: null,
          sc_17: null,
        },
      },
    };
  },
  created() {
    if (this.districtCodeFirst !== 'C') {
      alert('잘못된 접근입니다.');
      this.$router.push('/');
      return false;
    }
    if (this.selfCheckListIsDone) {
      alert('자율점검표 제출이 완료되었습니다.');
      this.$router.push('/').catch(() => {});
      return false;
    }
    this.fetchInfo();
  },
  methods: {
    counting() {
      const list = this.form.registrationDetails.responsiblePersonnel;

      this.form.registrationDetails.responsiblePersonnel.total =
        (list.dentist ? Number(list.dentist) : 0) +
        (list.nurse ? Number(list.nurse) : 0) +
        (list.dentalHygienist ? Number(list.dentalHygienist) : 0) +
        (list.nursingAssistant ? Number(list.nursingAssistant) : 0) +
        (list.others ? Number(list.others) : 0);
    },
    getCheckItems(form) {
      Object.keys(form).forEach(key => {
        this.form.checkItems[key] = form[key];
      });
    },
    formatDate(date, split = '-') {
      const yyyy = date.getFullYear();
      let mm = date.getMonth() + 1; // January is 0
      let dd = date.getDate();

      if (mm < 10) {
        mm = '0' + mm;
      }
      if (dd < 10) {
        dd = '0' + dd;
      }
      return `${yyyy}${split}${mm}${split}${dd}`;
    },
    isLeapYear(year) {
      return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    },
    calculateSixYearsAgo(date) {
      const sixYearsAgo = new Date(date);
      sixYearsAgo.setFullYear(date.getFullYear() - 6);

      if (date.getMonth() === 1 && date.getDate() === 29 && !this.isLeapYear(sixYearsAgo.getFullYear())) {
        sixYearsAgo.setDate(28);
      }
      return this.formatDate(sixYearsAgo);
    },
    calculateTomorrow(date) {
      if (!date) return null;
      const tomorrow = new Date(date);
      tomorrow.setDate(date.getDate() + 1);
      return this.formatDate(tomorrow);
    },
    calculateFiveYearsLater(date) {
      if (!date) return null;
      const fiveYearLater = new Date(date);
      fiveYearLater.setFullYear(date.getFullYear() + 5);
      fiveYearLater.setDate(fiveYearLater.getDate() - 1);

      if (date.getMonth() === 1 && date.getDate() === 29 && !this.isLeapYear(fiveYearLater.getFullYear())) {
        fiveYearLater.setDate(28);
      }

      return this.formatDate(fiveYearLater);
    },
    setEnabledDate() {
      this.contractEnabledDate = [this.calculateSixYearsAgo(this.today), this.formatDate(this.today)];
      const contractDate = new Date(this.form.registrationDetails.participationStatus.contractDate);
      this.expectedEndEnabledDate = [this.calculateTomorrow(contractDate), this.calculateFiveYearsLater(contractDate)];
    },
    changeContractDate() {
      this.setEnabledDate();
      this.form.registrationDetails.participationStatus.expectedEndDate = this.calculateFiveYearsLater(new Date(this.form.registrationDetails.participationStatus.contractDate));
    },
    fetchInfo() {
      this.$store.commit('loading', true);
      SelfCheck.hospitalSelfCheckInfo(this.userOrganTargetId).then(res => {
        this.$store.commit('loading', false);
        if (!res) {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
          this.$router.push('/');
          return;
        }
        if (res.data.rt === 200) {
          this.healthCareDistrictName = res.data.healthCareDistrictName;
          this.infoData.기관명 = res.data.hospitalName;
          this.infoData.요양기관번호 = res.data.hospitalMedicalNum;
          this.infoData.대표자명 = res.data.hospitalCeo;
          this.infoData.사업자등록번호 = res.data.hospitalRegNum;
          this.infoData['주소 (소재지)'] = res.data.hospitalAddress;
          this.infoData.전화번호 = res.data.hospitalTel;
          if (res.data.form) {
            this.form = res.data.form;
          }
          if (!this.form.registrationDetails.participationStatus.contractDate) {
            this.form.registrationDetails.participationStatus.contractDate = this.formatDate(new Date(this.currentYear, 0, 1));
          }
          if (!this.form.registrationDetails.participationStatus.expectedEndDate) {
            this.form.registrationDetails.participationStatus.expectedEndDate = new Date(this.currentYear + 4, 11, 31);
          }
          this.setEnabledDate();
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          this.$router.push('/');
        }
      });
    },
    getValidLabel(key) {
      switch (key) {
        case 'nationInspectionAgencyDesignation':
          return '국가검진기관 지정 여부';
        case 'responsiblePersonnel':
          return '치과주치의사업 담당 인력';
        case 'sc_1':
        case 'sc_2':
        case 'sc_3':
        case 'sc_4':
          return `1. 일반사항 - 연번${key.split('_').pop()}`;
        case 'sc_5':
        case 'sc_6':
          return `2. 치과주치의 대상 학생 방문시 - 연번${key.split('_').pop() - 4}`;
        case 'sc_7':
        case 'sc_8':
        case 'sc_9':
        case 'sc_10':
        case 'sc_11':
        case 'sc_12':
          return `3. 치과주치의 서비스 실시 - 연번${key.split('_').pop() - 6}`;
        case 'sc_13':
        case 'sc_14':
          return `4. 치과주치의 서비스 후 서비스 - 연번${key.split('_').pop() - 12}`;
        case 'sc_15':
          return `5. 기록보존 - 연번${key.split('_').pop() - 14}`;
        case 'sc_16':
        case 'sc_17':
          return `6. 비용상환 - 연번${key.split('_').pop() - 15}`;
        default:
          return key;
      }
    },
    validError(key) {
      this.$alert(`${this.getValidLabel(key)}: 필수 입력 항목입니다.`, '알림', 'error');
    },
    validator() {
      const checkProperties = (obj, countKey) => {
        if (countKey) {
          if (obj['total'] === 0) {
            this.validError(countKey);
            return false;
          }
        } else {
          for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key) && key !== 'etc') {
              if (obj[key] === null || obj[key] === '') {
                this.validError(key);
                return false;
              }
            }
          }
        }
        return true;
      };

      if (
        !checkProperties(this.form.registrationDetails) ||
        !checkProperties(this.form.registrationDetails.responsiblePersonnel, 'responsiblePersonnel') ||
        !checkProperties(this.form.registrationDetails.participationStatus) ||
        !checkProperties(this.form.checkItems)
      ) {
        return false;
      }
      return true;
    },
    regist(status) {
      this.$store.commit('loading', true);

      SelfCheck.hospitalSelfCheckRegist({
        hospitalId: this.userOrganTargetId,
        status,
        form: this.form,
      }).then(res => this.registThen(res, status));
    },
    registThen(res, status) {
      this.$store.commit('loading', false);
      if (!res) {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
        return;
      }
      if (res.data.rt === 200) {
        const isTemporary = this.codeToValue(status) !== 'Y';
        if (!isTemporary) {
          this.$store.commit('user/setSelfCheckListIsDone', true);
        }
        const msg = !isTemporary ? '최종제출' : '임시저장';
        this.$alert(`${msg}되었습니다.`, '알림', 'success').then(() => {
          if (!isTemporary) this.$router.go(-1);
        });
      } else if (res.data.rt === 400 || res.data.rt === 417) {
        this.$alert(res.data.rtMsg?.split(':').pop(), '알림', 'error');
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    },
    submit(status) {
      if (status === 'C000100002') {
        if (!this.validator()) return;
        this.$confirm('', '알림', 'question', {
          html: '최종제출 하시겠습니까?<br/>최종제출 시 수정이 불가능합니다.<br /> <span class="scommp">(제출된 자율점검표는 우측 상단 [정보수정]에서 확인할 수 있습니다.)</span>',
        }).then(() => this.regist(status));
      } else {
        this.regist(status);
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
