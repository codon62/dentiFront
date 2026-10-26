<template>
  <div class="popup_content">
    <v-popuptitle message="병원 등록" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver">
      <p class="commp4 fwb mt30">병원 정보</p>
      <div v-if="divJoin('C') || districtCodeFirst === 'J'" class="row flex_set mt20 flex_base">
        <div class="flex_item">
          <p class="commp fwb">
            검진 유형
            <span class="c_red">*</span>
          </p>
          <div class="check_set mb10">
            <div v-for="(item, key) in divType" :key="key" class="d_inblock hei100 mt10" :class="{ ml20: key !== divFirst }">
              <input
                :id="'divType' + key"
                type="checkbox"
                :value="key"
                :checked="hospitalInfo.hospital['hospitalBusinessDivision' + key] === 'Y'"
                name="divType"
                class="blind"
                @change="setBusiness({ ['hospitalBusinessDivision' + key]: $event.target.checked ? 'Y' : 'N' })"
              />
              <label :for="'divType' + key">
                <span class="icon"></span>
                <span class="label_t">{{ item }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div v-if="firstHelList.length || secondHelList.length" class="row flex_set mt20">
        <div v-if="firstHelList.length" class="flex_item flex_size_m">
          <p class="commp fwb">
            {{ ['I', 'J'].includes(districtCodeFirst) ? '교육지원청' : '지역구' }}
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <select class="comm_select" v-model="firstDistrictCode" @change="changeFirstHelList($event.target.value)">
              <option value="">{{ districtCodeFirst === 'C' ? '시/군' : ['I', 'J'].includes(districtCodeFirst) ? '교육지원청' : '지역구' }}</option>
              <option v-for="item in firstHelList" :key="item.healthCareId" :value="item.districtCode">{{ item.healthCareName }}</option>
            </select>
          </div>
        </div>
        <div v-if="secondHelList.length" class="flex_item flex_size_m" :class="{ ml10: firstHelList.length }">
          <p v-if="!firstHelList.length" class="commp fwb">
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

      <div class="row flex_set mt20 flex_base">
        <v-popupinput
          title="병원명"
          size="m"
          :value="hospitalInfo.hospital.hospitalName"
          placeholder="병원명을 입력해 주세요."
          :required="true"
          @input="HPT_SET({ hospital: { hospitalName: $event } })"
        ></v-popupinput>
        <div v-if="districtCodeFirst !== 'B'" class="ml20">
          <v-popupinput
            title="사업자등록번호"
            type="number"
            size="m"
            :value="hospitalInfo.hospital.hospitalRegNum"
            placeholder="사업자등록번호를 입력해 주세요."
            :required="districtCodeFirst !== 'B'"
            :is-readonly="districtCodeFirst === 'B'"
            @input="HPT_SET({ hospital: { hospitalRegNum: $event } })"
          ></v-popupinput>
          <p class="mt10 c_red scommp">※ 사업자등록번호가 아이디로 설정됩니다.</p>
        </div>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput
          title="대표자"
          size="m"
          :value="hospitalInfo.hospital.hospitalCeo"
          placeholder="대표자명을 입력해 주세요."
          :required="true"
          @input="HPT_SET({ hospital: { hospitalCeo: $event } })"
        ></v-popupinput>
        <div class="ml20">
          <v-popupinput
            title="요양기관번호"
            size="m"
            type="number"
            :value="hospitalInfo.hospital.hospitalMedicalNum"
            placeholder="요양기관번호를 입력해 주세요."
            :required="true"
            @input="HPT_SET({ hospital: { hospitalMedicalNum: $event } })"
          ></v-popupinput>
          <p v-if="districtCodeFirst === 'B'" class="mt10 c_red scommp">※ 요양기관번호가 아이디 설정 됩니다.</p>
        </div>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput
          title="대표치과의사 면허번호"
          size="m"
          type="number"
          :value="hospitalInfo.hospital.hospitalLicense"
          placeholder="대표치과의사 면허번호를 입력해 주세요."
          :required="true"
          @input="HPT_SET({ hospital: { hospitalLicense: $event } })"
        ></v-popupinput>
        <v-popupinput
          divclass="ml20"
          title="기관 연락처"
          type="number"
          size="m"
          :value="hospitalInfo.hospital.hospitalTel"
          placeholder="기관 연락처를 입력해 주세요."
          :required="true"
          @input="HPT_SET({ hospital: { hospitalTel: $event } })"
        ></v-popupinput>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput
          title="담당자명"
          size="m"
          :value="hospitalInfo.manager.userOrganManagerName"
          placeholder="담당자명을 입력해 주세요."
          @input="HPT_SET({ manager: { userOrganManagerName: $event } })"
        ></v-popupinput>
        <v-popupinput
          divclass="ml20"
          title="담당자 연락처"
          type="number"
          size="m"
          :value="hospitalInfo.manager.userOrganManagerTel"
          placeholder="담당자 연락처를 입력해 주세요."
          @input="HPT_SET({ manager: { userOrganManagerTel: $event } })"
        ></v-popupinput>
        <div class="flex_item ml20">
          <p class="commp c_black2 fwb">알림톡 수신 여부</p>
          <div class="check_set mt10">
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
      <div class="row flex_set mt20">
        <div class="flex_item">
          <p class="commp fwb">
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
      <template v-if="!['C', 'I'].includes(districtCodeFirst)">
        <div class="row mt20">
          <v-popupinput
            title="병원 서브타이틀(선택)"
            size="m2"
            :value="hospitalInfo.hospital.memo"
            maxlength="50"
            placeholder="병원 방문 시 유의사항을 입력해 주세요. (최대 50자)"
            :required="false"
            @input="HPT_SET({ hospital: { memo: $event } })"
          ></v-popupinput>
        </div>
        <div class="row mt20">
          <v-popupinput
            title="기관 홈페이지(선택)"
            size="m2"
            :value="hospitalInfo.hospital.siteUrl"
            maxlength="100"
            placeholder=" https:// 또는 http:// 부터 입력해 주세요. (최대 100자)"
            :required="false"
            @input="HPT_SET({ hospital: { siteUrl: $event } })"
          ></v-popupinput>
        </div>
      </template>

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
          <a href="javascript:;" class="comm__gray_bd_btn tac d_inblock wid55 btn_s_size ml10 scommp c_gray2" @click="deleteDoctor(index)">삭제</a>
        </div>
      </div>

      <div class="comm__line mt30"></div>
      <p class="commp4 fwb mt30">계좌 정보</p>
      <div class="row flex_set mt20">
        <div class="flex_item flex_size_m">
          <p class="commp fwb">
            은행
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <select v-model="bankCode" class="comm_select">
              <option value="">은행명</option>
              <option v-for="item in bankList" :key="item.bankCode" :value="item.bankCode">{{ item.bankName }}</option>
            </select>
          </div>
        </div>
        <v-popupinput v-model="hospitalDepositor" title="예금주" divclass="ml20" size="m" placeholder="예금주명을 입력해 주세요." :required="true"></v-popupinput>
      </div>
      <div class="row flex_set mt20 flex_base">
        <v-popupinput v-model="hospitalAccount" title="계좌번호" size="m" placeholder="계좌번호를 입력해 주세요." :required="true"></v-popupinput>
      </div>
      <div class="comm__line mt30"></div>
      <v-popupconfirm message="등록" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import Management from '@/apis/Management';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import popupInput from '@/components/popup/PopupInput.vue';
import Common from '@/apis/Common';
import { mapGetters, mapMutations, mapState } from 'vuex';
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
  props: ['dataObject'],
  data() {
    return {
      hospitalDoctorName: '',
      hospitalDoctorLicense: '',
      address1: '',
      address2: '',
      bankList: [],
      bankCode: '',
      hospitalDepositor: '',
      hospitalAccount: '',
      firstDistrictCode: '',
      firstHelList: [],
      fullSecondHelList: [],
      secondHelList: [],
    };
  },
  computed: {
    ...mapState('hospital', ['hospitalInfo']),
    ...mapState('user', ['userOrganTargetId', 'districtCode', 'userOrganTargetType']),
    ...mapState('status', ['businessDivision', 'businessDivisionSpc', 'businessDivisionNotE']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin']),
    ...mapGetters('definedCode', ['valueToCode']),
    divType() {
      switch (
        this.districtCodeFirst // 사업 종류 분류
      ) {
        case 'A': //서울
          return this.businessDivision.value;
        case 'D': //부산
          return this.businessDivisionNotE.value;
        default:
          return this.businessDivisionSpc.value;
      }
    },
    divFirst() {
      return this.divJoin('C') ? 'C' : 'F';
    },
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-popupinput': popupInput,
  },
  validators: {
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
    bankCode: value => {
      return Validator.value(value).required();
    },
    hospitalDepositor: value => {
      return Validator.value(value).required();
    },
    hospitalAccount: value => {
      return Validator.value(value).required();
    },
    'hospitalInfo.hospital.hospitalRegNum': value => {
      return Validator.value(value).required().integer().length(10);
    },
    'hospitalInfo.manager.userOrganManagerAlarm': value => {
      return Validator.value(value).required();
    },
  },
  async created() {
    Common.bankList() // 은행 리스트 api 통해서 불러오기
      .then(res => {
        if (res && res.data.rt === 200) {
          this.bankList = res.data.bankList;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });

    this.$store.commit('hospital/resetHospitalInfo'); // 창 로드전 이전 정보 초기화
    if (!['C', 'I'].includes(this.districtCodeFirst)) {
      let updatedHospitalInfo = JSON.parse(JSON.stringify(this.hospitalInfo));
      let updatedHospital = { ...updatedHospitalInfo.hospital };
      updatedHospital.memo = '';
      updatedHospital.siteUrl = '';
      updatedHospitalInfo.hospital = updatedHospital;
      this.$store.commit('hospital/setHospitalInfo', updatedHospitalInfo);
    }

    if (this.userOrganTargetType === 'CT') {
      await Common.healthCareList({ districtCode: this.districtCodeFirst }).then(res => {
        if (res && res.data.rt === 200) {
          this.firstHelList = res.data.healthCareList;
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
    if (this.districtCodeFirst === 'C' || this.districtCodeFirst === 'J') {
      await Common.healthCareSecondList({ districtCode: this.userOrganTargetType === 'HC' ? this.districtCode : this.districtCodeFirst }).then(res => {
        if (res && res.data.rt === 200) {
          if (this.firstHelList.length) {
            this.fullSecondHelList = res.data.healthCareList;
          } else {
            this.secondHelList = res.data.healthCareList;
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
    if (!this.firstHelList.length && !this.fullSecondHelList.length && !this.secondHelList.length) {
      this.HPT_SET({ hospital: { districtCode: this.districtCode } });
    }
  },
  methods: {
    ...mapMutations('hospital', ['HPT_SET', 'OBJECT_SPLICE', 'setRepDoctor', 'setBusiness']),
    changeFirstHelList(districtCode) {
      if (this.fullSecondHelList.length) {
        this.setSecondHelList(districtCode);
      }
      this.HPT_SET({ hospital: { districtCode: !this.secondHelList.length ? districtCode : '' } });
    },
    setSecondHelList(districtCode) {
      this.secondHelList = districtCode ? this.fullSecondHelList.filter(hel => hel.districtCode.startsWith(districtCode)) : [];
    },
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
    save() {
      // 새 병원 정보 등록 전 validation 처리
      if (['A', 'D', 'J'].includes(this.districtCodeFirst)) {
        if (
          (['A', 'D'].includes(this.districtCodeFirst) &&
            this.hospitalInfo.hospital.hospitalBusinessDivisionC !== 'Y' &&
            this.hospitalInfo.hospital.hospitalBusinessDivisionF !== 'Y' &&
            this.hospitalInfo.hospital.hospitalBusinessDivisionE !== 'Y') ||
          (this.districtCodeFirst === 'J' && this.hospitalInfo.hospital.hospitalBusinessDivisionF !== 'Y' && this.hospitalInfo.hospital.hospitalBusinessDivisionE !== 'Y')
        ) {
          this.$alert('검진 유형을 선택해 주세요.', '알림', 'warning');
          return false;
        }
      }
      let validData = [
        'hospitalInfo.hospital.districtCode',
        'hospitalInfo.hospital.hospitalName',
        'hospitalInfo.hospital.hospitalCeo',
        'hospitalInfo.hospital.hospitalMedicalNum',
        'hospitalInfo.hospital.hospitalLicense',
        'hospitalInfo.hospital.hospitalTel',
        'hospitalInfo.hospital.hospitalAddress',
        'bankCode',
        'hospitalDepositor',
        'hospitalAccount',
      ];
      let validTitle = ['지역구', '병원명', '대표자', '요양기관번호', '대표치과의사 면허번호', '기관 연락처', '주소', '은행', '예금주', '계좌번호'];
      if (this.hospitalInfo.manager.userOrganManagerTel !== '' && this.hospitalInfo.manager.userOrganManagerAlarm === '') {
        // 만약 담당자 연락처가 있고 알림톡 수신여부 체크가 안 됐을 때 N 으로 셋팅 시킴
        this.HPT_SET({ manager: { userOrganManagerAlarm: 'N' } });
      }
      if (this.districtCodeFirst !== 'B') {
        // 인천시가 아닐 때만 사업자 등록번호 validation
        validData.splice(2, 0, 'hospitalInfo.hospital.hospitalRegNum');
        validTitle.splice(2, 0, '사업자등록번호');
      }
      if (this.hospitalInfo.manager.userOrganManagerName !== '' || this.hospitalInfo.manager.userOrganManagerTel !== '' || this.hospitalInfo.manager.userOrganManagerAlarm !== '') {
        // 담당자 정보 입력폼 중 하나라도 입력할 시 validation 체크
        validData.push('hospitalInfo.manager.userOrganManagerName', 'hospitalInfo.manager.userOrganManagerTel', 'hospitalInfo.manager.userOrganManagerAlarm');
        validTitle.push('담당자명', '담당자 연락처', '알림톡 수신여부');
      }
      if (!['C', 'I'].includes(this.districtCodeFirst)) {
        validData.push('hospitalInfo.hospital.siteUrl');
        validTitle.push('기관 홈페이지');
      }
      this.setDefaultData();
      this.$validate(validData).then(success => {
        if (success) {
          if (!this.hospitalInfo.doctorList.length) {
            this.$alert('최소 한 분의 치과의사 정보를 등록해 주세요.', '알림', 'warning');
            return false;
          }
          this.infoSave();
        } else {
          this.validError(validData, validTitle);
        }
      });
    },
    infoSave() {
      let hospitalInfo = _.cloneDeep(this.hospitalInfo);
      // code convert
      for (let i = 0; i < hospitalInfo.doctorList.length; i++) {
        hospitalInfo.doctorList[i].hospitalDoctorRepresent = this.valueToCode('C0017', hospitalInfo.doctorList[i].hospitalDoctorRepresent);
      }
      // code convert end
      const form = {
        districtCode: this.hospitalInfo.hospital.districtCode,
        hospitalName: this.hospitalInfo.hospital.hospitalName,
        memo: this.hospitalInfo.hospital.memo,
        siteUrl: this.hospitalInfo.hospital.siteUrl,
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
        hospitalBusinessDivisionC: this.valueToCode('C0008', this.hospitalInfo.hospital.hospitalBusinessDivisionC),
        hospitalBusinessDivisionF: this.valueToCode('C0008', this.hospitalInfo.hospital.hospitalBusinessDivisionF),
        hospitalBusinessDivisionE: this.valueToCode('C0008', this.hospitalInfo.hospital.hospitalBusinessDivisionE),
        userOrganManagerName: this.hospitalInfo.manager.userOrganManagerName,
        userOrganManagerTel: this.hospitalInfo.manager.userOrganManagerTel,
        userOrganManagerAlarm: this.valueToCode('C0018', this.hospitalInfo.manager.userOrganManagerAlarm),
        doctorList: hospitalInfo.doctorList,
      };
      Management.hospitalRegister(form).then(res => {
        if (res && res.data.rt === 200) {
          this.$alert('등록되었습니다.', '알림', 'success').then(() => {
            this.$store.dispatch('popup/popupClose');
            this.$store.commit('update');
          });
        } else {
          if (res.data.rt === 422) {
            this.$alert('이미 존재하는 아이디입니다.', '알림', 'error');
          } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        }
      });
    },
    validError(validData, validTitle) {
      // validation 에러 처리
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
      // daum 연계 우편번호 생성
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
    setDefaultData() {
      // address합치기, checkbox 체크 안되면 N 넣어주기
      const address = this.address1 ? this.address1 + (this.address2 === '' ? '' : ' ' + this.address2) : ''; // address1 + address2를 통합 시켜서 넣어준다.
      this.HPT_SET({ hospital: { hospitalAddress: address } });
      switch (
        this.districtCodeFirst // 지역별로 체크 안 된 사업은 'N'으로 셋팅해줌
      ) {
        case 'A': // 서울
          if (this.hospitalInfo.hospital.hospitalBusinessDivisionC === '') this.setBusiness({ hospitalBusinessDivisionC: 'N' });
          if (this.hospitalInfo.hospital.hospitalBusinessDivisionF === '') this.setBusiness({ hospitalBusinessDivisionF: 'N' });
          if (this.hospitalInfo.hospital.hospitalBusinessDivisionE === '') this.setBusiness({ hospitalBusinessDivisionE: 'N' });
          break;
        case 'D': // 부산
          if (this.hospitalInfo.hospital.hospitalBusinessDivisionC === '') this.setBusiness({ hospitalBusinessDivisionC: 'N' });
          if (this.hospitalInfo.hospital.hospitalBusinessDivisionF === '') this.setBusiness({ hospitalBusinessDivisionF: 'N' });
          break;
        default:
          break;
      }
    },
  },
};
</script>
