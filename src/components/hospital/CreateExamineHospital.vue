<template>
  <div class="sub__content form__ver_1 mt30">
    <div class="browser__con">
      <div class="bg_white mt20 tac" style="width: 800px; margin: 0 auto; padding: 50px; box-sizing: border-box">
        <div class="iconbox"><img src="@/assets/images/sub/ic_hospital_o.png" /></div>
        <p class="commp3 mt15 fwb">병원 정보 등록</p>
        <p class="commp mt15 c_black2">
          원활한 서비스 이용을 위해
          <br />
          정확한 병원 정보를 입력해 주세요.
        </p>

        <template v-if="!createHospital">
          <div class="basic__form_box mt50">
            <div class="row flex_set">
              <p class="flex_item scommp c_black2 fwn d_inblock tal fw500" style="width: 130px">사업자등록번호</p>
              <div class="flex_item m__putbox d_inblock" style="width: 345px">
                <input type="number" class="comm_put" placeholder="사업자등록번호를 입력해 주세요." @input="HPT_SET({ hospital: { hospitalRegNum: $event.target.value } })" />
              </div>
            </div>
          </div>
          <div class="row tac mt30"></div>
          <a href="javascript:;" class="d_inblock comm__blue_btn btn_m_size2" style="width: 160px" @click="hospitalRegNumCheck">중복확인</a>
        </template>

        <template v-else>
          <div class="sub__section mt30 mb30 tal">
            <div class="row flex_set flex_left">
              <div class="flex_item flex_size_m">
                <p class="scommp c_black2 fwn">
                  지역구
                  <span class="c_red">*</span>
                </p>
                <div class="m__putbox mt10">
                  <select class="comm_select" @change="HPT_SET({ hospital: { districtCode: $event.target.value } })">
                    <option value="">지역구</option>
                    <option v-for="item in secondHelList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row flex_set mt20 flex_left">
              <div class="flex_item flex_size_m5">
                <p class="scommp c_black2 fwn">
                  병원명
                  <span class="c_red">*</span>
                </p>
                <div class="m__putbox mt10">
                  <input
                    type="text"
                    class="comm_put"
                    placeholder="병원명을 입력해 주세요."
                    :value="hospitalInfo.hospital.hospitalName"
                    @input="HPT_SET({ hospital: { hospitalName: $event.target.value } })"
                  />
                </div>
              </div>
              <div v-if="districtCodeFirst !== 'B'" class="flex_item flex_size_m5 ml20">
                <p class="scommp c_black2 fwn">
                  사업자등록번호
                  <span class="c_red">*</span>
                </p>
                <div class="m__putbox mt10"><input type="text" class="comm_put read_put" placeholder="" :value="hospitalInfo.hospital.hospitalRegNum" readonly /></div>
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
                  대표치과의사 면허번호
                  <span class="c_red">*</span>
                </p>
                <div class="m__putbox mt10">
                  <input
                    type="number"
                    class="comm_put"
                    :value="hospitalInfo.hospital.hospitalLicense"
                    placeholder="대표치과의사 면허번호를 입력해 주세요."
                    @input="HPT_SET({ hospital: { hospitalLicense: $event.target.value } })"
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

            <div class="row flex_set mt20">
              <div class="flex_item">
                <p class="commp c_black2 fwn">
                  주소
                  <span class="c_red">*</span>
                </p>
                <a href="javascript:;" class="comm__blue_bd_btn fwn commp mt10 wid_100 btn_m_size2 d_inblock" @click="daumPostCode">
                  <img src="@/assets/images/sub/ic_search_s.png" />
                  검색
                </a>
              </div>
              <div class="flex_item">
                <div class="m__putbox ml10 wid260"><input v-model="address1" type="text" class="comm_put" placeholder="주소를 입력해 주세요." readonly /></div>
              </div>
              <div class="flex_item">
                <div class="m__putbox ml10 wid260"><input v-model="address2" type="text" class="comm_put" placeholder="상세 주소를 입력해주세요." /></div>
              </div>
            </div>

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
              <div class="flex_item ml20">
                <p class="scommp c_black2 fwn">
                  알림톡 수신 여부
                  <span class="c_red">*</span>
                </p>
                <div class="check_set mt10 mb10">
                  <div class="d_inblock hei100 mt10">
                    <input
                      id="alarmTypeY"
                      type="checkbox"
                      :value="'Y'"
                      :checked="hospitalInfo.manager.userOrganManagerAlarm === 'Y'"
                      name="alarmType"
                      class="blind"
                      @change="HPT_SET({ manager: { userOrganManagerAlarm: $event.target.checked ? 'Y' : '' } })"
                    />
                    <label for="alarmTypeY">
                      <span class="icon"></span>
                      <span class="label_t">알림톡 수신 허용</span>
                    </label>
                  </div>
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
                    <span class="label_t">대표치과의사</span>
                  </label>
                </div>
              </div>
              <div class="d_inblock ml30">
                <div class="d_inblock commp c_black2">
                  <span class="">{{ doctor.hospitalDoctorName }}</span>
                  <span class="ml20">{{ doctor.hospitalDoctorLicense }}</span>
                </div>
                <a href="javascript:;" class="comm__gray_bd_btn tac d_inblock wid55 btn_s_size ml10 scommp c_gray2" @click="deleteDoctor(index)">삭제</a>
              </div>
            </div>

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
          </div>
          <div class="row tac mt50"></div>
          <a href="javascript:;" class="d_inblock comm__blue_btn btn_m_size2" style="width: 160px" @click="enroll">병원 정보 등록하기</a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import { mapGetters, mapMutations, mapState } from 'vuex';
import Hospital from '@/apis/Hospital';
import Common from '@/apis/Common';
import _ from 'lodash';

Vue.use(SimpleVueValidation);
SimpleVueValidation.extendTemplates({
  required: '필수 입력 항목입니다.',
  integer: '잘못된 입력값입니다.',
  length: '잘못된 입력값입니다.',
  minLength: '잘못된 입력값입니다.',
  maxLength: '잘못된 입력값입니다.',
});
const Validator = SimpleVueValidation.Validator;

export default {
  data() {
    return {
      hospitalDoctorName: '',
      hospitalDoctorLicense: '',
      createHospital: false,
      address1: '',
      address2: '',
      bankList: [],
      bankCode: '',
      hospitalAccount: '',
      hospitalDepositor: '',
      secondHelList: [],
    };
  },
  computed: {
    ...mapState('hospital', ['hospitalInfo']),
    ...mapState('business', ['businessYear']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  validators: {
    'hospitalInfo.hospital.hospitalRegNum': value => {
      return Validator.value(value).required().integer().length(10);
    },
    'hospitalInfo.hospital.districtCode': value => {
      return Validator.value(value).required();
    },
    'hospitalInfo.hospital.hospitalName': value => {
      return Validator.value(value).required();
    },
    'hospitalInfo.hospital.hospitalCeo': value => {
      return Validator.value(value).required();
    },
    'hospitalInfo.hospital.hospitalMedicalNum': value => {
      return Validator.value(value).required().integer().length(8);
    },
    'hospitalInfo.hospital.hospitalLicense': value => {
      return Validator.value(value).required().integer().minLength(4).maxLength(5);
    },
    'hospitalInfo.hospital.hospitalTel': value => {
      return Validator.value(value).required().integer().minLength(7).maxLength(12);
    },
    'hospitalInfo.manager.userOrganManagerName': value => {
      return Validator.value(value).required();
    },
    'hospitalInfo.manager.userOrganManagerTel': value => {
      return Validator.value(value).required().integer().minLength(10).maxLength(11);
    },
    'hospitalInfo.hospital.hospitalAddress': value => {
      return Validator.value(value).required();
    },
    bankCode: value => {
      return Validator.value(value).required();
    },
    hospitalDepositor: value => {
      return Validator.value(value).required();
    },
    hospitalAccount: value => {
      return Validator.value(value).required();
    },
  },
  methods: {
    ...mapMutations('hospital', ['HPT_SET', 'OBJECT_SPLICE', 'setRepDoctor']),
    addDoctor() {
      if (!this.validDoctor(this.hospitalDoctorName, this.hospitalDoctorLicense)) {
        return false;
      }
      const form = {
        hospitalDoctorName: this.hospitalDoctorName,
        hospitalDoctorLicense: this.hospitalDoctorLicense,
        hospitalDoctorRepresent: this.hospitalInfo.doctorList.find(doctor => doctor.hospitalDoctorRepresent === 'Y') ? 'N' : 'Y',
      };
      this.$store.commit('hospital/OBJECT_SET', { doctorList: form });
      this.hospitalDoctorName = '';
      this.hospitalDoctorLicense = '';
    },
    deleteDoctor(index) {
      this.OBJECT_SPLICE({ doctorList: index });
      if (this.hospitalInfo.doctorList.length && !this.hospitalInfo.doctorList.find(doctor => doctor.hospitalDoctorRepresent === 'Y')) {
        this.setRepDoctor(0);
      }
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
    getBankList() {
      Common.bankList().then(res => {
        if (res && res.data.rt === 200) {
          this.bankList = res.data.bankList;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    getSecondHelList() {
      Common.healthCareList({ districtCode: this.districtCodeFirst }).then(res => {
        if (res && res.data.rt === 200) {
          this.secondHelList = res.data.healthCareList.filter(o => this.isDev || !o.districtCode.includes('99')); // 운영서버 테스트 지역구 제외
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    hospitalRegNumCheck() {
      const validData = ['hospitalInfo.hospital.hospitalRegNum'];
      const validTitle = ['사업자등록번호'];
      this.$validate(validData).then(success => {
        if (success) {
          const form = {
            districtDigit1: this.districtCodeFirst,
            hospitalRegNum: this.hospitalInfo.hospital.hospitalRegNum,
          };
          // 사업자등록번호로 병원 조회
          Hospital.regNumHospital(form).then(res => {
            if (res && res.data.rt === 200) {
              if (!res.data.hospitalId) {
                this.getBankList();
                this.getSecondHelList();
                this.createHospital = true;
              } else {
                const msg = `<b>병원명</b> : ${res.data.hospitalName}<br/>해당 병원 사용자가 맞습니까?`;
                this.$confirm('', '알림', 'question', {
                  allowEnterKey: false,
                  html: msg,
                })
                  .then(() => {
                    this.openBusinessDivisionE(res.data.hospitalId);
                  })
                  .catch(() => {
                    this.$alert('정확한 사업자등록번호를 입력해 주세요.', '알림', 'warning');
                  });
              }
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        } else {
          this.validError(validData, validTitle);
        }
      });
    },
    openBusinessDivisionE(hospitalId) {
      // 학생구강검진 참여 및 임시계정 삭제
      Hospital.openBusinessDivisionEAndDeleteTemporaryId({
        hospitalId: hospitalId,
      }).then(res => {
        if (res && res.data.rt === 200) {
          this.$alert('', '알림', 'success', {
            html: '학생구강검진 참여 처리가 완료되었습니다.<br/>현재 아이디는 삭제 처리되며, 사업자등록번호로 다시 로그인해 주세요.',
          }).then(() => {
            this.$store.dispatch('user/logout');
          });
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    enroll() {
      if (!this.hospitalInfo.manager.userOrganManagerAlarm) {
        this.HPT_SET({ manager: { userOrganManagerAlarm: 'N' } });
      }
      const address = this.address1 ? this.address1 + (this.address2 === '' ? '' : ' ' + this.address2) : '';
      this.HPT_SET({ hospital: { hospitalAddress: address } });

      const validData = [
        'hospitalInfo.hospital.districtCode',
        'hospitalInfo.hospital.hospitalName',
        'hospitalInfo.hospital.hospitalCeo',
        'hospitalInfo.hospital.hospitalMedicalNum',
        'hospitalInfo.hospital.hospitalLicense',
        'hospitalInfo.hospital.hospitalTel',
        'hospitalInfo.hospital.hospitalAddress',
        'hospitalInfo.manager.userOrganManagerName',
        'hospitalInfo.manager.userOrganManagerTel',
        'bankCode',
        'hospitalDepositor',
        'hospitalAccount',
      ];
      const validTitle = ['지역구', '병원명', '대표자', '요양기관번호', '대표치과의사 면허번호', '기관 연락처', '주소', '담당자명', '담당자 연락처', '은행', '예금주', '계좌번호'];

      this.$validate(validData).then(success => {
        if (success) {
          if (!this.hospitalInfo.doctorList.length) {
            this.$alert('최소 한 분의 치과의사 정보를 등록해 주세요.', '알림', 'warning');
            return false;
          }
          let hospitalInfo = _.cloneDeep(this.hospitalInfo);
          // code convert
          for (let i = 0; i < hospitalInfo.doctorList.length; i++) {
            hospitalInfo.doctorList[i].hospitalDoctorRepresent = this.valueToCode('C0017', hospitalInfo.doctorList[i].hospitalDoctorRepresent);
          }
          // code convert end
          const form = {
            districtCode: this.hospitalInfo.hospital.districtCode,
            hospitalName: this.hospitalInfo.hospital.hospitalName,
            hospitalRegNum: this.hospitalInfo.hospital.hospitalRegNum,
            hospitalMedicalNum: this.hospitalInfo.hospital.hospitalMedicalNum,
            hospitalCeo: this.hospitalInfo.hospital.hospitalCeo,
            hospitalLicense: this.hospitalInfo.hospital.hospitalLicense,
            hospitalTel: this.hospitalInfo.hospital.hospitalTel,
            hospitalAddress: this.hospitalInfo.hospital.hospitalAddress,
            hospitalZipcode: this.hospitalInfo.hospital.hospitalZipcode,
            hospitalLon: this.hospitalInfo.hospital.hospitalLon,
            hospitalLat: this.hospitalInfo.hospital.hospitalLat,
            bankCode: this.bankCode,
            hospitalDepositor: this.hospitalDepositor,
            hospitalAccount: this.hospitalAccount,
            hospitalBusinessDivisionC: this.valueToCode('C0008', 'N'),
            hospitalBusinessDivisionF: this.valueToCode('C0008', 'N'),
            hospitalBusinessDivisionE: this.valueToCode('C0008', 'Y'), // 학생구강검진만 참여 처리
            userOrganManagerName: this.hospitalInfo.manager.userOrganManagerName,
            userOrganManagerTel: this.hospitalInfo.manager.userOrganManagerTel,
            userOrganManagerAlarm: this.valueToCode('C0018', this.hospitalInfo.manager.userOrganManagerAlarm),
            doctorList: hospitalInfo.doctorList,
          };
          Hospital.registAndDeleteTemporaryId(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('', '알림', 'success', {
                html: `병원 등록이 완료되었습니다.<br/>현재 아이디는 삭제 처리되며, 사업자등록번호로 다시 로그인해 주세요.<br/>초기 비밀번호 : ${this.businessYear}`,
              }).then(() => {
                this.$store.dispatch('user/logout');
              });
            } else {
              if (res.data.rt === 422) {
                this.$alert('이미 존재하는 아이디입니다.', '알림', 'error');
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            }
          });
        } else {
          this.validError(validData, validTitle);
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
};
</script>
