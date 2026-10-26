<template>
  <fragment>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        병원 정보
      </p>
    </div>

    <!-- form__ver_1 -->
    <div class="sub__content form__ver_1 bg_white mt30">
      <div class="sub__section mt30 mb30">
        <p class="commp2 fwb">병원 정보</p>
        <div class="row flex_set mt20 flex_left">
          <div class="flex_item">
            <p class="scommp c_black2 fwn">
              병원명
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input type="text" class="comm_put read_put wid350" placeholder="" :value="hospitalInfo.hospital.hospitalName" readonly /></div>
          </div>
          <div v-if="districtCodeFirst === 'C'" class="flex_item flex_size_m5 ml30">
            <p class="scommp c_black2 fwn">
              장애인 진료
              <span class="c_red">*</span>
            </p>
            <div class="comm_radio m__putbox mt10">
              <div v-for="(item, key) in hospitalTreatDisabledPerson.value" :key="key" class="radio_box d_inblock hei100 mt10" :class="{ ml20: key !== 'Y' }">
                <input
                  :id="'htd_' + key"
                  type="radio"
                  :value="key"
                  :checked="hospitalInfo.hospital.hospitalTreatDisabledPerson === key"
                  name="hospitalTreatDisabledPerson"
                  class="blind"
                  @change="HPT_SET({ hospital: { hospitalTreatDisabledPerson: $event.target.value } })"
                />
                <label :for="'htd_' + key">
                  <span class="icon"></span>
                  <span class="label_t">{{ item }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="row flex_set mt20 flex_left">
          <div v-if="districtCodeFirst !== 'B'" class="flex_item flex_size_m5">
            <p class="scommp c_black2 fwn">
              사업자등록번호
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10"><input type="text" class="comm_put read_put" placeholder="" :value="hospitalInfo.hospital.hospitalRegNum" readonly /></div>
          </div>
          <div class="flex_item flex_size_m5" :class="{ ml20: districtCodeFirst !== 'B' }">
            <p class="scommp c_black2 fwn">
              요양기관번호
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <input
                type="number"
                class="comm_put"
                :class="{ read_put: districtCodeFirst === 'B' }"
                :value="hospitalInfo.hospital.hospitalMedicalNum"
                placeholder="요양기관번호를 입력해 주세요."
                :readonly="districtCodeFirst === 'B'"
                @input="HPT_SET({ hospital: { hospitalMedicalNum: $event.target.value } })"
              />
            </div>
          </div>
        </div>
        <div class="row flex_set mt20 flex_left">
          <div class="flex_item flex_size_m5">
            <p class="scommp c_black2 fwn">
              대표자명
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <input
                type="text"
                class="comm_put"
                :value="hospitalInfo.hospital.hospitalCeo"
                placeholder="대표자명을 입력해 주세요."
                @input="HPT_SET({ hospital: { hospitalCeo: $event.target.value } })"
              />
            </div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="scommp c_black2 fwn">
              기관 연락처
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <input
                type="number"
                class="comm_put"
                :value="hospitalInfo.hospital.hospitalTel"
                placeholder="연락처를 입력해 주세요."
                @input="HPT_SET({ hospital: { hospitalTel: $event.target.value } })"
              />
            </div>
          </div>
        </div>

        <p class="mt20 commp c_black2 fwn">
          주소
          <span class="c_red">*</span>
        </p>
        <div class="row">
          <div class="m__putbox d_inblock mt10 wid350"><input v-model="address1" type="text" class="comm_put" placeholder="주소를 입력해 주세요." readonly /></div>
          <a href="javascript:;" class="comm__blue_bd_btn fwn commp mt10 wid135 btn_m_size2 d_inblock ml20" @click="daumPostCode">
            <img src="@/assets/images/sub/ic_search_s.png" />
            재검색
          </a>
        </div>
        <div class="row">
          <div class="m__putbox d_inblock mt10 wid350"><input v-model="address2" type="text" class="comm_put" placeholder="상세 주소를 입력해주세요." /></div>
        </div>

        <template v-if="!['C', 'I'].includes(districtCodeFirst)">
          <div class="row mt20">
            <div class="flex_item">
              <p class="scommp c_black2 fwn">병원 서브타이틀(선택)</p>
              <div class="m__putbox mt10">
                <input
                  type="text"
                  class="comm_put wid350"
                  :value="hospitalInfo.hospital.memo"
                  maxlength="50"
                  placeholder="병원 방문 시 유의사항을 입력해 주세요. (최대 50자)"
                  @input="HPT_SET({ hospital: { memo: $event.target.value } })"
                />
              </div>
            </div>
          </div>

          <div class="row mt20">
            <div class="flex_item">
              <p class="scommp c_black2 fwn">기관 홈페이지(선택)</p>
              <div class="m__putbox mt10">
                <input
                  type="text"
                  class="comm_put wid350"
                  :value="hospitalInfo.hospital.siteUrl"
                  maxlength="100"
                  placeholder="https:// 또는 http:// 부터 입력해 주세요. (최대 100자)"
                  @input="HPT_SET({ hospital: { siteUrl: $event.target.value } })"
                />
              </div>
            </div>
          </div>
        </template>

        <div class="row flex_set mt20 flex_left">
          <div class="flex_item flex_size_m5">
            <p class="scommp c_black2 fwn">
              담당자명
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <input
                type="text"
                class="comm_put"
                :value="hospitalInfo.manager.userOrganManagerName"
                placeholder="담당자명을 입력해 주세요."
                @input="HPT_SET({ manager: { userOrganManagerName: $event.target.value } })"
              />
            </div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="scommp c_black2 fwn">
              담당자 연락처
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <input
                type="number"
                class="comm_put"
                :value="hospitalInfo.manager.userOrganManagerTel"
                placeholder="담당자 연락처를 입력해 주세요."
                @input="HPT_SET({ manager: { userOrganManagerTel: $event.target.value } })"
              />
            </div>
          </div>
          <div class="flex_item flex_size_m5 ml30">
            <p class="scommp c_black2 fwn">
              알림톡 수신 여부
              <span class="c_red">*</span>
            </p>
            <div class="comm_radio m__putbox mt10">
              <div v-for="(item, key) in userOrganManagerAlarm.value" :key="key" class="radio_box d_inblock hei100 mt10" :class="{ ml20: key !== 'Y' }">
                <input
                  :id="'orm_' + key"
                  type="radio"
                  :value="key"
                  :checked="hospitalInfo.manager.userOrganManagerAlarm === key"
                  name="userOrganManagerAlarm"
                  class="blind"
                  @change="HPT_SET({ manager: { userOrganManagerAlarm: $event.target.value } })"
                />
                <label :for="'orm_' + key">
                  <span class="icon"></span>
                  <span class="label_t">{{ item }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <p class="mt20 commp c_black2 fwn">
          진료시간 설정
          <span class="c_red">*</span>
        </p>
        <div class="row">
          <div class="time__info d_inblock mt10">
            <p v-for="(day, index) in hospitalInfo.treatDateTimeList" :key="day.hospitalTreatDateTimeYoil" class="commp" :class="{ mt5: index > 0 }">
              {{ dayWeeks[day.hospitalTreatDateTimeYoil] }} &nbsp;&nbsp;{{ day.hospitalTreatDateTimeStart + ' ~ ' + day.hospitalTreatDateTimeEnd }}
            </p>
            <p v-if="hospitalInfo.treatTime.lunchStartTime && hospitalInfo.treatTime.lunchEndTime" class="commp mt5">
              점심시간 &nbsp;&nbsp;{{ hospitalInfo.treatTime.lunchStartTime + ' ~ ' + hospitalInfo.treatTime.lunchEndTime }}
            </p>
            <p v-for="yoil in hospitalInfo.treatClosedYoilList" :key="yoil" class="commp c_red mt5">{{ dayWeeks[yoil] }} &nbsp;&nbsp;휴무</p>
            <p v-for="day in hospitalInfo.holidayList" :key="day.hospitalHolidayId" class="commp c_red mt5">{{ day.hospitalHolidayStartDate + ' ~ ' + day.hospitalHolidayEndDate }} &nbsp;&nbsp;휴무</p>
          </div>
          <a href="javascript:;" class="comm__blue_bd_btn fwn commp mt10 wid160 btn_m_size2 d_inblock align_top ml10" @click="popupOpen({ contents: 'setTreatTime' })">
            <img src="@/assets/images/sub/ic_clock.png" />
            진료시간 재설정
          </a>
        </div>

        <!-- <div class="row flex_set mt20 flex_left">
                    <div class="flex_item flex_size_m5">
                        <p class="scommp c_black2 fwn">새 비밀번호</p>
                        <div class="m__putbox mt10"><input type="password" class="comm_put" value="" placeholder="새 비밀번호를 입력해 주세요."></div>
                    </div>
                </div>
                <div class="row flex_set mt20 flex_left">
                    <div class="flex_item flex_size_m5">
                        <p class="scommp c_black2 fwn">비밀번호 확인</p>
                        <div class="m__putbox mt10"><input type="password" class="comm_put" value="" placeholder="새 비밀번호를 한번 더 입력해 주세요."></div>
                    </div>
                </div> -->

        <div class="comm__line mt30"></div>
        <p class="commp2 fwb mt30">
          계좌 정보
          <span v-if="districtCodeFirst === 'C'" class="c_red ml20">검진비 받으실 계좌 변경 희망시 관할 보건소에 연락하여 관련 서류를 제출하여 주세요</span>
        </p>
        <div class="row flex_set mt20 flex_left">
          <div class="flex_item">
            <p class="scommp c_black2 fwn">
              은행
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <select v-model="bankCode" class="comm_select wid180" :class="{ read_put: districtCodeFirst === 'C' }" :disabled="districtCodeFirst === 'C'">
                <option value="">은행명</option>
                <option v-for="item in bankList" :key="item.bankCode" :value="item.bankCode">{{ item.bankName }}</option>
              </select>
            </div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="scommp c_black2 fwn">
              계좌번호
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <input
                v-model="hospitalAccount"
                type="text"
                class="comm_put"
                :class="{ read_put: districtCodeFirst === 'C' }"
                :readonly="districtCodeFirst === 'C'"
                placeholder="계좌번호를 입력해 주세요"
              />
            </div>
          </div>
          <div class="flex_item flex_size_m5 ml20">
            <p class="scommp c_black2 fwn">
              예금주
              <span class="c_red">*</span>
            </p>
            <div class="m__putbox mt10">
              <input
                v-model="hospitalDepositor"
                type="text"
                class="comm_put"
                :class="{ read_put: districtCodeFirst === 'C' }"
                :readonly="districtCodeFirst === 'C'"
                placeholder="예금주를 입력해 주세요."
              />
            </div>
          </div>
        </div>

        <div class="comm__line mt30"></div>
        <p class="commp2 fwb mt30">치과의사 정보</p>
        <p class="mt5 c_red scommp">※ 최소 한 분의 치과의사 정보를 등록해 주세요.</p>
        <div class="row mt20">
          <div class="m__putbox wid145 d_inblock"><input v-model="hospitalDoctorName" type="text" class="comm_put" placeholder="치과의사명" /></div>
          <div class="m__putbox wid250 d_inblock ml10"><input v-model="hospitalDoctorLicense" type="number" class="comm_put" placeholder="치과의사면허번호" /></div>
          <a href="javascript:;" class="d_inblock ml10 wid110 comm__blue_bd_btn btn_m_size2 commp fwn" @click="addDoctor">
            <img src="@/assets/images/sub/ic_bluecheck.png" />
            추가
          </a>
        </div>
        <p class="c_red mt20 scommp">※ 대표 치과의사를 지정해 주세요.</p>
        <div v-for="(doctor, index) in hospitalInfo.doctorList" :key="doctor.hospitalDoctorId" class="row mt20 doctor_row">
          <div class="d_inblock comm_radio p_relative s_blit_line pr30">
            <div class="radio_box">
              <input
                :id="'rep_' + doctor.hospitalDoctorLicense"
                type="radio"
                :value="doctor.hospitalDoctorLicense"
                name="repDoctor"
                :checked="doctor.hospitalDoctorRepresent === 'Y'"
                class="blind"
                @change="setRepDoctor(index)"
              />
              <label :for="'rep_' + doctor.hospitalDoctorLicense">
                <span class="icon"></span>
                <span class="label_t">대표 치과의사</span>
              </label>
            </div>
          </div>
          <div class="d_inblock ml30">
            <div class="d_inblock commp c_black2">
              <span class="">{{ doctor.hospitalDoctorName }}</span>
              <span class="ml20">{{ doctor.hospitalDoctorLicense }}</span>
            </div>
            <a href="javascript:;" class="comm__gray_bd_btn tac d_inblock wid55 btn_s_size ml10 scommp c_gray2" @click="OBJECT_SPLICE({ doctorList: index })">삭제</a>
          </div>
        </div>

        <div v-if="districtCodeFirst === 'C' && selfCheckListIsDone">
          <div class="comm__line mt30"></div>
          <p class="commp2 fwb mt30">자율점검표</p>
          <p class="c_red scommp mt5">※ 최종 제출한 자율점검표를 조회할 수 있습니다.</p>
          <button type="button" class="d_inblock mt24 wid130 comm__blue_btn btn_m_size2 commp fwn" @click="selfCheck">자율점검표 조회</button>
        </div>

        <div v-if="districtCodeFirst === 'I'">
          <div class="comm__line mt30"></div>
          <p class="commp2 fwb mt30">회계자료</p>
          <p class="c_red scommp mt5">※ 통장사본, 사업자등록증, 대표 치과의사 날인을 다운로드 또는 재등록할 수 있습니다.</p>
          <p class="c_red scommp fwb">※ 회계자료는 재등록 시 우측 하단 '저장' 버튼을 누르지 않아도 등록됩니다.</p>
          <div class="mt20 mb20">
            <a href="javascript:;" class="d_inblock comm__red_btn btn_m_size2 wid130 commp mr10" @click="popupOpen({ contents: 'registHospitalDocument', params: { hospitalId: userOrganTargetId } })">
              회계자료 재등록
            </a>
            <a href="javascript:;" class="d_inblock comm__blue_btn btn_m_size2 wid130 commp" @click="popupOpen({ contents: 'viewHospitalDocument', params: { hospitalId: userOrganTargetId } })">
              회계자료 다운로드
            </a>
          </div>
        </div>
      </div>
      <!--//sub__section-->
    </div>
    <!-- content__area -->
    <div class="btn__box mt30 mb30 row">
      <div class="inner--left">
        <a href="javascript:;" class="d_inblock comm__gray_bd_btn wid110 bg_white btn_l_size commp2 fwb off_ver" @click="$router.go(-1)">취소</a>
      </div>
      <div class="inner--right">
        <!-- 활성화시 .off_ver 제거 -->
        <a href="javascript:;" class="d_inblock comm__blue_btn wid110 btn_l_size commp2 fwb" @click="save">저장</a>
      </div>
    </div>
  </fragment>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import Hospital from '@/apis/Hospital';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import _ from 'lodash';

Vue.use(SimpleVueValidation);
SimpleVueValidation.extendTemplates({
  required: '필수 입력 항목입니다.',
  integer: '잘못된 입력값입니다.',
  minLength: '잘못된 입력값입니다.',
  maxLength: '잘못된 입력값입니다.',
});
const Validator = SimpleVueValidation.Validator;

export default {
  data() {
    return {
      hospitalDoctorName: '',
      hospitalDoctorLicense: '',
      address1: '',
      address2: '',
      treatTime: [],
      bankList: [],
      bankCode: '',
      hospitalAccount: '',
      hospitalDepositor: '',
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['userOrganTargetId', 'selfCheckListIsDone']),
    ...mapState('hospital', ['hospitalInfo']),
    ...mapState('status', ['userOrganManagerAlarm', 'dayWeeks', 'hospitalTreatDisabledPerson']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode']),
  },
  validators: {
    'hospitalInfo.hospital.hospitalMedicalNum': value => {
      return Validator.value(value).required().integer();
    },
    'hospitalInfo.hospital.hospitalCeo': value => {
      return Validator.value(value).required();
    },
    'hospitalInfo.hospital.hospitalTel': value => {
      return Validator.value(value).required().integer();
    },
    'hospitalInfo.hospital.siteUrl': value => {
      return Validator.value(value)
        .maxLength(100)
        .custom(function () {
          if (value && value !== '') {
            if (value.includes(' ') || (!value.startsWith('https://') && !value.startsWith('http://'))) {
              return `기관 홈페이지 링크를 입력할 때<br> ${value.includes(' ') ? '공백을 제외' : ''}${
                value.includes(' ') && !value.startsWith('https://') && !value.startsWith('http://') ? '하고 ' : ''
              }${!value.startsWith('https://') && !value.startsWith('http://') ? '반드시 https:// 또는 http://를 포함' : ''}해 주세요.`;
            }
          }
        });
    },
    'hospitalInfo.manager.userOrganManagerName': value => {
      return Validator.value(value).required();
    },
    'hospitalInfo.manager.userOrganManagerTel': value => {
      return Validator.value(value).required().integer().minLength(10).maxLength(11);
    },
    'hospitalInfo.manager.userOrganManagerAlarm': value => {
      return Validator.value(value).required();
    },
    bankCode: value => {
      return Validator.value(value).required();
    },
    hospitalAccount: value => {
      return Validator.value(value).required();
    },
    hospitalDepositor: value => {
      return Validator.value(value).required();
    },
  },
  created() {
    Hospital.accountInfo({ hospitalId: this.userOrganTargetId }).then(res => {
      if (res && res.data.rt === 200) {
        this.bankList = res.data.bankList;
        this.bankCode = res.data.hospitalInfo.bankCode;
        this.hospitalAccount = res.data.hospitalInfo.hospitalAccount;
        this.hospitalDepositor = res.data.hospitalInfo.hospitalDepositor;
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
    Hospital.info({ hospitalId: this.userOrganTargetId }).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.hospital.hospitalBusinessDivisionC = this.codeToValue(res.data.hospital.hospitalBusinessDivisionC);
        res.data.hospital.hospitalBusinessDivisionF = this.codeToValue(res.data.hospital.hospitalBusinessDivisionF);
        res.data.hospital.hospitalBusinessDivisionE = this.codeToValue(res.data.hospital.hospitalBusinessDivisionE);
        res.data.hospital.hospitalTreatDisabledPerson = this.codeToValue(res.data.hospital.hospitalTreatDisabledPerson);
        res.data.manager.userOrganManagerAlarm = this.codeToValue(res.data.manager.userOrganManagerAlarm);
        for (let i = 0; i < res.data.treatDateTimeList.length; i++) {
          res.data.treatDateTimeList[i].hospitalTreatDateTimeYoil = this.codeToValue(res.data.treatDateTimeList[i].hospitalTreatDateTimeYoil);
        }
        for (let i = 0; i < res.data.treatClosedYoilList.length; i++) {
          res.data.treatClosedYoilList[i] = this.codeToValue(res.data.treatClosedYoilList[i]);
        }
        for (let i = 0; i < res.data.doctorList.length; i++) {
          res.data.doctorList[i].hospitalDoctorRepresent = this.codeToValue(res.data.doctorList[i].hospitalDoctorRepresent);
        }
        // code convert end
        let hospitalInfo = res.data;
        delete hospitalInfo.rt;
        delete hospitalInfo.rtMsg;
        this.$store.commit('hospital/setHospitalInfo', hospitalInfo);
        this.address1 = res.data.hospital.hospitalAddress;
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    ...mapMutations('hospital', ['HPT_SET', 'OBJECT_SPLICE', 'setRepDoctor']),
    addDoctor() {
      if (!this.validDoctor(this.hospitalDoctorName, this.hospitalDoctorLicense)) {
        return false;
      }
      const form = {
        hospitalDoctorName: this.hospitalDoctorName,
        hospitalDoctorLicense: this.hospitalDoctorLicense,
      };
      this.$store.commit('hospital/OBJECT_SET', { doctorList: form });
      this.hospitalDoctorName = '';
      this.hospitalDoctorLicense = '';
    },
    validDoctor(hospitalDoctorName, hospitalDoctorLicense) {
      if (hospitalDoctorName === '') {
        this.$alert('치과의사명을 입력해 주세요.', '알림', 'warning');
        return false;
      }
      if (hospitalDoctorLicense === '') {
        this.$alert('치과의사면허번호를 입력해 주세요.', '알림', 'warning');
        return false;
      }
      for (const i in this.hospitalInfo.doctorList) {
        if (this.hospitalInfo.doctorList[i].hospitalDoctorLicense === hospitalDoctorLicense) {
          this.$alert('중복된 치과의사면허번호입니다.', '알림', 'error');
          return false;
        }
      }
      return true;
    },
    selfCheck() {
      this.$store.dispatch('popup/popupOpen', {
        contents: 'viewSelfCheck',
        params: { hospitalId: this.userOrganTargetId },
      });
    },
    save() {
      this.$confirm('저장하시겠습니까?', '알림', 'question')
        .then(() => {
          let validData = [
            'hospitalInfo.hospital.hospitalMedicalNum',
            'hospitalInfo.hospital.hospitalCeo',
            'hospitalInfo.hospital.hospitalTel',
            'hospitalInfo.manager.userOrganManagerName',
            'hospitalInfo.manager.userOrganManagerTel',
            'hospitalInfo.manager.userOrganManagerAlarm',
            'bankCode',
            'hospitalAccount',
            'hospitalDepositor',
          ];
          let validTitle = ['요양기관번호', '대표자명', '기관 연락처', '담당자명', '담당자 연락처', '알림톡 수신 여부', '은행', '계좌번호', '예금주'];
          if (!['C', 'I'].includes(this.districtCodeFirst)) {
            validData.push('hospitalInfo.hospital.siteUrl');
            validTitle.push('기관 홈페이지');
          }
          this.$validate(validData).then(success => {
            if (success) {
              if (!this.hospitalInfo.doctorList.length) {
                this.$alert('최소 한 분의 치과의사 정보를 등록해 주세요.', '알림', 'warning');
                return false;
              }
              const address = this.address1 + (this.address2 === '' ? '' : ' ' + this.address2);
              this.HPT_SET({ hospital: { hospitalAddress: address } });
              this.infoModify();
            } else {
              this.validError(validData, validTitle);
            }
          });
        })
        .catch(() => {});
    },
    infoModify() {
      let hospitalInfo = _.cloneDeep(this.hospitalInfo);
      // code convert
      hospitalInfo.hospital.hospitalBusinessDivisionC = this.valueToCode('C0008', hospitalInfo.hospital.hospitalBusinessDivisionC);
      hospitalInfo.hospital.hospitalBusinessDivisionF = this.valueToCode('C0008', hospitalInfo.hospital.hospitalBusinessDivisionF);
      hospitalInfo.hospital.hospitalBusinessDivisionE = this.valueToCode('C0008', hospitalInfo.hospital.hospitalBusinessDivisionE);
      hospitalInfo.hospital.hospitalTreatDisabledPerson = this.valueToCode('C0060', hospitalInfo.hospital.hospitalTreatDisabledPerson);
      hospitalInfo.manager.userOrganManagerAlarm = this.valueToCode('C0018', hospitalInfo.manager.userOrganManagerAlarm);
      for (let i = 0; i < hospitalInfo.treatDateTimeList.length; i++) {
        hospitalInfo.treatDateTimeList[i].hospitalTreatDateTimeYoil = this.valueToCode('C0011', hospitalInfo.treatDateTimeList[i].hospitalTreatDateTimeYoil);
      }
      for (let i = 0; i < hospitalInfo.treatClosedYoilList.length; i++) {
        hospitalInfo.treatClosedYoilList[i] = this.valueToCode('C0011', hospitalInfo.treatClosedYoilList[i]);
      }
      for (let i = 0; i < hospitalInfo.doctorList.length; i++) {
        hospitalInfo.doctorList[i].hospitalDoctorRepresent = this.valueToCode('C0017', hospitalInfo.doctorList[i].hospitalDoctorRepresent);
      }
      // code convert end
      Hospital.infoModify(hospitalInfo).then(res => {
        if (res && res.data.rt === 200) {
          if (this.districtCodeFirst === 'C') {
            this.$alert(`저장되었습니다.`, '알림', 'success').then(() => {
              this.$router.push('/hospital');
            });
          } else {
            const form = {
              hospitalId: this.userOrganTargetId,
              bankCode: this.bankCode,
              hospitalDepositor: this.hospitalDepositor,
              hospitalAccount: this.hospitalAccount,
            };
            Hospital.accountInfoModify(form).then(res2 => {
              if (res2 && res2.data.rt === 200) {
                this.$alert(`저장되었습니다.`, '알림', 'success').then(() => {
                  this.$router.push('/hospital');
                });
              } else {
                alert('계좌번호 저장에 실패했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res2.data.rt);
              }
            });
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    validError(validData, validTitle) {
      let errorMsg = '';
      validData.forEach((item, index) => {
        if (this.validation.hasError(validData[index])) {
          if (errorMsg !== '') {
            errorMsg += '<br/>';
          }
          errorMsg += '<b>' + validTitle[index] + '</b> : ' + this.validation.firstError(validData[index]);
        }
      });
      this.$alert('', '알림', 'warning', { html: errorMsg });
    },
    daumPostCode() {
      new daum.Postcode({
        oncomplete: data => {
          this.HPT_SET({ hospital: { hospitalZipcode: data.zonecode } }); // 우편번호
          this.address1 = data.roadAddress;

          if (!this.isDev) {
            // kakao 지도 API 권한 최대 10개 이유로 실서버에서만 위도 / 경도 설정
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.addressSearch(data.roadAddress, (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                this.HPT_SET({ hospital: { hospitalLon: result[0].x } }); // 경도
                this.HPT_SET({ hospital: { hospitalLat: result[0].y } }); // 위도
              } else {
                this.HPT_SET({ hospital: { hospitalLon: null } }); // 경도
                this.HPT_SET({ hospital: { hospitalLat: null } }); // 위도
              }
            });
          } else {
            this.HPT_SET({ hospital: { hospitalLon: null } }); // 경도
            this.HPT_SET({ hospital: { hospitalLat: null } }); // 위도
          }
        },
      }).open();
    },
  },
  watch: {
    'hospitalInfo.doctorList'() {
      if (this.hospitalInfo.doctorList.length === 1) {
        this.setRepDoctor(0);
      }
    },
  },
};
</script>
