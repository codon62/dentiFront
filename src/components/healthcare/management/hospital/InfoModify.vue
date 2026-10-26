<template>
  <div class="popup_content">
    <v-popuptitle message="정보 수정" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <p class="commp4 fwb">계정 정보</p>
      <div class="row flex_set mt20">
        <v-popupinput title="회원 구분" size="m" value="병원" :is-readonly="true"></v-popupinput>
      </div>
      <div class="row flex_set mt20">
        <v-popupinput title="아이디" size="m" :value="hospitalInfo.userOrganLoginId" :is-readonly="true"></v-popupinput>
        <v-popupinput v-model="password" divclass="ml20" title="비밀번호" size="m" type="password" placeholder="비밀번호를 입력해 주세요." :is-readonly="passwordChange !== 'Y'"></v-popupinput>
        <div class="flex_item flex_size_m5 ml20">
          <div class="check_set mb10">
            <input id="passwordChange" type="checkbox" value="Y" class="blind" @change="passwordChangeCheck($event.target)" />
            <label for="passwordChange">
              <span class="icon"></span>
              <span class="label_t">변경</span>
            </label>
          </div>
        </div>
      </div>
      <p class="mt10 c_red scommp tal" style="margin-left: 270px">※ 비밀번호 규칙 : 영문 + 숫자 + 특수문자가 혼합된 8~15자리</p>
      <div class="comm__line mt30"></div>
      <p class="commp4 fwb mt30">병원 정보</p>
      <div class="row flex_set mt20 flex_base">
        <div class="flex_item">
          <p v-if="!divJoin('S') || districtCodeFirst === 'J'" class="scommp c_black2 fwb">
            {{ examTitle }} 유형
            <span class="c_red">*</span>
          </p>
          <div v-if="divJoin('C') || districtCodeFirst === 'J'" class="check_set mb10">
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
          <div v-else-if="!divJoin('S')" class="comm_radio m__putbox mt10">
            <div v-if="divJoin('F')" class="radio_box d_inblock hei100 mt10">
              <input
                id="divTypeF"
                type="radio"
                :value="'Y'"
                :checked="hospitalInfo.hospital.hospitalBusinessDivisionF === 'Y'"
                name="divType"
                class="blind"
                @change="setBusiness({ hospitalBusinessDivisionF: $event.target.checked ? 'Y' : 'N' })"
              />
              <label for="divTypeF">
                <span class="icon"></span>
                <span class="label_t">{{ divName('F', true) }}</span>
              </label>
            </div>
            <div v-else-if="divJoin('E')" class="radio_box d_inblock hei100 mt10">
              <input
                id="divTypeE"
                type="radio"
                :value="'Y'"
                :checked="hospitalInfo.hospital.hospitalBusinessDivisionE === 'Y'"
                name="divType"
                class="blind"
                @change="setBusiness({ hospitalBusinessDivisionE: $event.target.checked ? 'Y' : 'N' })"
              />
              <label for="divTypeE">
                <span class="icon"></span>
                <span class="label_t">{{ divName('E', true) }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="row flex_set flex_base" :class="{ mt20: !divJoin('S') || districtCodeFirst === 'J' }">
        <v-popupinput
          title="병원명"
          size="m"
          :value="hospitalInfo.hospital.hospitalName"
          placeholder="병원명을 입력해 주세요."
          :required="true"
          @input="HPT_SET({ hospital: { hospitalName: $event } })"
        ></v-popupinput>
        <v-popupinput v-if="districtCodeFirst !== 'B'" divclass="ml20" title="사업자등록번호" type="number" size="m" :value="hospitalInfo.hospital.hospitalRegNum" :is-readonly="true"></v-popupinput>
        <div v-if="districtCodeFirst === 'C'" class="flex_item flex_size_m5 ml30">
          <p class="commp fwb">
            장애인 진료
            <span class="c_red">*</span>
          </p>
          <div class="comm_radio m__putbox mt10">
            <div v-for="(item, key) in hospitalTreatDisabledPerson.value" :key="key" class="radio_box d_inblock hei100" :class="{ ml20: key !== 'Y' }">
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
      <div class="row flex_set mt20 flex_base">
        <v-popupinput
          title="대표자"
          size="m"
          :value="hospitalInfo.hospital.hospitalCeo"
          placeholder="대표자명을 입력해 주세요."
          :required="true"
          @input="HPT_SET({ hospital: { hospitalCeo: $event } })"
        ></v-popupinput>
        <v-popupinput
          title="요양기관번호"
          divclass="ml20"
          size="m"
          type="number"
          :value="hospitalInfo.hospital.hospitalMedicalNum"
          placeholder="요양기관번호를 입력해 주세요."
          :required="districtCodeFirst !== 'B'"
          :is-readonly="districtCodeFirst === 'B'"
          @input="HPT_SET({ hospital: { hospitalMedicalNum: $event } })"
        ></v-popupinput>
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
          :required="true"
          @input="HPT_SET({ manager: { userOrganManagerName: $event } })"
        ></v-popupinput>
        <v-popupinput
          divclass="ml20"
          title="담당자 연락처"
          type="number"
          size="m"
          :value="hospitalInfo.manager.userOrganManagerTel"
          placeholder="담당자 연락처를 입력해 주세요."
          :required="true"
          @input="HPT_SET({ manager: { userOrganManagerTel: $event } })"
        ></v-popupinput>
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
      <p class="commp2 fwb mt30">요일별 진료시간</p>
      <div v-for="(day, key) in dayWeeks" :key="key" class="mt10 row">
        <div class="d_inblock mcommp2 c_black2 mr20">
          {{ day }}
        </div>
        <div class="time__box" :style="treatYoil[key].closed ? 'background-color: #ebebeb;' : null">
          <input :id="`${key}_treat1`" type="text" :value="treatYoil[key].time[0]" :disabled="treatYoil[key].closed" maxlength="2" @input="valid(`${key}_treat1`, 23, `${key}_treat2`)" />
          <span>:</span>
          <input :id="`${key}_treat2`" type="text" :value="treatYoil[key].time[1]" :disabled="treatYoil[key].closed" maxlength="2" @input="valid(`${key}_treat2`, 59, `${key}_treat3`)" />
        </div>
        <div class="d_inblock time__blit">~</div>
        <div class="time__box" :style="treatYoil[key].closed ? 'background-color: #ebebeb;' : null">
          <input :id="`${key}_treat3`" type="text" :value="treatYoil[key].time[2]" :disabled="treatYoil[key].closed" maxlength="2" @input="valid(`${key}_treat3`, 23, `${key}_treat4`)" />
          <span>:</span>
          <input :id="`${key}_treat4`" type="text" :value="treatYoil[key].time[3]" :disabled="treatYoil[key].closed" maxlength="2" @input="valid(`${key}_treat4`, 59)" />
        </div>
        <div class="d_inblock ml20">
          <div class="check_set">
            <input :id="`${key}_closed`" type="checkbox" value="Y" class="blind" :checked="treatYoil[key].closed" @change="treatClose(key, $event.target.checked)" />
            <label :for="`${key}_closed`">
              <span class="icon"></span>
              <span class="label_t fwb">휴진</span>
            </label>
          </div>
        </div>
      </div>
      <p class="commp2 fwb mt30">점심시간</p>
      <div class="mt20 row">
        <div class="d_inblock">
          <div class="time__box">
            <input id="lunch1" type="number" class="comm__put" :value="lunchTime[0]" maxlength="2" @input="valid('lunch1', 23, 'lunch2')" />
            <span>:</span>
            <input id="lunch2" type="number" class="comm__put" :value="lunchTime[1]" maxlength="2" @input="valid('lunch2', 59, 'lunch3')" />
          </div>
          <div class="d_inblock time__blit">~</div>
          <div class="time__box">
            <input id="lunch3" type="number" class="comm__put" :value="lunchTime[2]" maxlength="2" @input="valid('lunch3', 23, 'lunch4')" />
            <span>:</span>
            <input id="lunch4" type="number" class="comm__put" :value="lunchTime[3]" maxlength="2" @input="valid('lunch4', 59)" />
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
      <v-popupconfirm message="수정" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import SimpleVueValidation from 'simple-vue-validator';
import Management from '@/apis/Management';
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import popupInput from '@/components/popup/PopupInput.vue';
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
      password: '',
      passwordChange: '',
      address1: '',
      address2: '',
      bankList: [],
      bankCode: '',
      hospitalDepositor: '',
      hospitalAccount: '',
      treatYoil: {
        MO: { time: ['', '', '', ''], closed: false },
        TU: { time: ['', '', '', ''], closed: false },
        WE: { time: ['', '', '', ''], closed: false },
        TH: { time: ['', '', '', ''], closed: false },
        FR: { time: ['', '', '', ''], closed: false },
        SA: { time: ['', '', '', ''], closed: false },
        SU: { time: ['', '', '', ''], closed: false },
        HO: { time: ['', '', '', ''], closed: false },
      },
      lunchTime: ['', '', '', ''],
    };
  },
  computed: {
    ...mapState('hospital', ['hospitalInfo']),
    ...mapState('status', ['businessDivision', 'businessDivisionSpc', 'hospitalTreatDisabledPerson', 'dayWeeks']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName', 'examTitle']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode']),
    divType() {
      return this.divJoin('C') ? this.businessDivision.value : this.businessDivisionSpc.value;
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
  },
  created() {
    Hospital.info({ hospitalId: this.dataObject.hospitalId }).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.hospital.hospitalBusinessDivisionC = this.codeToValue(res.data.hospital.hospitalBusinessDivisionC);
        res.data.hospital.hospitalBusinessDivisionF = this.codeToValue(res.data.hospital.hospitalBusinessDivisionF);
        res.data.hospital.hospitalBusinessDivisionE = this.codeToValue(res.data.hospital.hospitalBusinessDivisionE);
        res.data.hospital.hospitalTreatDisabledPerson = this.codeToValue(res.data.hospital.hospitalTreatDisabledPerson);
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

        for (const yoil in this.treatYoil) {
          const treatDateTime = hospitalInfo.treatDateTimeList.find(o => o.hospitalTreatDateTimeYoil === yoil);
          if (treatDateTime) {
            const start = treatDateTime.hospitalTreatDateTimeStart.split(':');
            const end = treatDateTime.hospitalTreatDateTimeEnd.split(':');
            this.treatYoil[yoil] = {
              time: [start[0], start[1], end[0], end[1]],
              closed: false,
            };
            continue;
          }
          const closedYoil = hospitalInfo.treatClosedYoilList.find(o => o === yoil);
          if (closedYoil) {
            this.treatYoil[yoil].closed = true;
          }
        }
        this.lunchTime = ((hospitalInfo.treatTime.lunchStartTime || ':') + ':' + (hospitalInfo.treatTime.lunchEndTime || ':')).split(':');
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
    Hospital.accountInfo({ hospitalId: this.dataObject.hospitalId }).then(res => {
      if (res && res.data.rt === 200) {
        this.bankList = res.data.bankList;
        this.bankCode = res.data.hospitalInfo.bankCode || '';
        this.hospitalDepositor = res.data.hospitalInfo.hospitalDepositor;
        this.hospitalAccount = res.data.hospitalInfo.hospitalAccount;
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    ...mapMutations('hospital', ['HPT_SET', 'OBJECT_SPLICE', 'setRepDoctor', 'setBusiness']),
    valid(id, max, next) {
      const ele = document.getElementById(id);
      ele.value = ele.value.replace(/[^0-9]/g, ''); // 숫자만 통과
      if (ele.value > max) {
        // 최댓값 제한
        ele.value = '';
      }
      if (id.indexOf('lunch') !== -1) {
        // 점심시간 data 업데이트
        this.lunchTime[id.charAt(5) - 1] = ele.value;
      } else if (id.indexOf('treat') !== -1) {
        // 진료시간 data 업데이트
        const idSplit = id.split('_treat');
        this.treatYoil[idSplit[0]].time[idSplit[1] - 1] = ele.value;
      }
      if (next && ele.value.length === ele.maxLength) {
        // 포커스 이동
        document.getElementById(next).focus();
      }
    },
    treatClose(yoil, checked) {
      this.treatYoil[yoil] = { time: ['', '', '', ''], closed: checked };
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
    passwordChangeCheck(target) {
      this.password = '';
      this.passwordChange = target.checked ? target.value : '';
    },
    save() {
      if (this.passwordChange === 'Y') {
        const num = /[0-9]/;
        const eng = /[a-zA-Z]/;
        // eslint-disable-next-line
        const spc = /[\!\"#$%\&'()\*\+,\-\.\/\:;<>=\?@\[\]\\\^\_`\{|\}~]/;
        const check = this.password.length >= 8 && this.password.length <= 15 && eng.test(this.password) && num.test(this.password) && spc.test(this.password);
        if (this.password === '') {
          this.$alert('비밀번호를 입력해 주세요.', '알림', 'warning');
          return false;
        } else if (!check) {
          this.$alert('비밀번호 조건에 맞지 않습니다.', '알림', 'error');
          return false;
        }
      }
      if (
        this.hospitalInfo.hospital.hospitalBusinessDivisionC !== 'Y' &&
        this.hospitalInfo.hospital.hospitalBusinessDivisionF !== 'Y' &&
        this.hospitalInfo.hospital.hospitalBusinessDivisionE !== 'Y'
      ) {
        this.$alert('검진 유형을 선택해 주세요.', '알림', 'warning');
        return false;
      }
      const address = this.address1 ? this.address1 + (this.address2 === '' ? '' : ' ' + this.address2) : '';
      this.HPT_SET({ hospital: { hospitalAddress: address } });
      let validData = [
        'hospitalInfo.hospital.hospitalName',
        'hospitalInfo.hospital.hospitalCeo',
        'hospitalInfo.hospital.hospitalMedicalNum',
        'hospitalInfo.hospital.hospitalLicense',
        'hospitalInfo.hospital.hospitalTel',
        'hospitalInfo.manager.userOrganManagerName',
        'hospitalInfo.manager.userOrganManagerTel',
        'hospitalInfo.hospital.hospitalAddress',
        'bankCode',
        'hospitalDepositor',
        'hospitalAccount',
      ];
      let validTitle = ['병원명', '대표자', '요양기관번호', '대표치과의사 면허번호', '기관 연락처', '담당자명', '담당자 연락처', '주소', '은행', '예금주', '계좌번호'];
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
          if (this.treatTimeValid()) {
            this.infoModify();
          }
        } else {
          this.validError(validData, validTitle);
        }
      });
    },
    treatTimeValid() {
      let treatDateTimeList = [];
      let treatClosedYoilList = [];
      for (const yoil in this.treatYoil) {
        if (!this.treatYoil[yoil].closed) {
          if (this.treatYoil[yoil].time.filter(value => value === '').length === this.treatYoil[yoil].time.length) {
            continue;
          }
          for (let i = 0; i < this.treatYoil[yoil].time.length; i++) {
            if (this.treatYoil[yoil].time[i].length !== 2) {
              this.$alert('휴진이 아닌 모든 진료시간을 2자리로 입력해 주세요.', '알림', 'warning');
              return false;
            }
          }
          treatDateTimeList.push({
            hospitalTreatDateTimeYoil: yoil,
            hospitalTreatDateTimeStart: `${this.treatYoil[yoil].time[0]}:${this.treatYoil[yoil].time[1]}`,
            hospitalTreatDateTimeEnd: `${this.treatYoil[yoil].time[2]}:${this.treatYoil[yoil].time[3]}`,
          });
        } else {
          treatClosedYoilList.push(yoil);
        }
      }
      if (this.lunchTime.filter(value => value === '').length !== this.lunchTime.length) {
        for (const i in this.lunchTime) {
          if (this.lunchTime[i].length !== 2) {
            this.$alert('점심시간의 각 항목을 2자리로 입력해 주세요.', '알림', 'warning');
            return false;
          }
        }
        const treatTime = {
          lunchStartTime: this.lunchTime[0] + ':' + this.lunchTime[1],
          lunchEndTime: this.lunchTime[2] + ':' + this.lunchTime[3],
        };
        this.$store.commit('hospital/HPT_SET', { treatTime: treatTime });
      }

      const items = {
        treatDateTimeList: treatDateTimeList,
        treatClosedYoilList: treatClosedYoilList,
        holidayList: this.holidayList,
      };
      this.$store.commit('hospital/setItem', items);
      return true;
    },
    infoModify() {
      let hospitalInfo = _.cloneDeep(this.hospitalInfo);
      // code convert
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
      const form = {
        districtCode: this.hospitalInfo.hospital.districtCode,
        passwordChange: this.passwordChange,
        newPassword: this.password,
        hospitalBusinessDivisionF: this.valueToCode('C0008', this.hospitalInfo.hospital.hospitalBusinessDivisionF),
        hospitalBusinessDivisionE: this.valueToCode('C0008', this.hospitalInfo.hospital.hospitalBusinessDivisionE),
        hospitalBusinessDivisionC: this.valueToCode('C0008', this.hospitalInfo.hospital.hospitalBusinessDivisionC),
        hospitalId: this.hospitalInfo.hospital.hospitalId,
        hospitalName: this.hospitalInfo.hospital.hospitalName,
        memo: this.hospitalInfo.hospital.memo,
        siteUrl: this.hospitalInfo.hospital.siteUrl,
        hospitalMedicalNum: this.hospitalInfo.hospital.hospitalMedicalNum,
        hospitalCeo: this.hospitalInfo.hospital.hospitalCeo,
        hospitalLicense: this.hospitalInfo.hospital.hospitalLicense,
        hospitalTel: this.hospitalInfo.hospital.hospitalTel,
        hospitalZipcode: this.hospitalInfo.hospital.hospitalZipcode,
        hospitalAddress: this.hospitalInfo.hospital.hospitalAddress,
        hospitalLon: this.hospitalInfo.hospital.hospitalLon,
        hospitalLat: this.hospitalInfo.hospital.hospitalLat,
        hospitalTreatDisabledPerson: this.valueToCode('C0060', this.hospitalInfo.hospital.hospitalTreatDisabledPerson),
        bankCode: this.bankCode,
        hospitalDepositor: this.hospitalDepositor,
        hospitalAccount: this.hospitalAccount,
        userOrganManagerName: this.hospitalInfo.manager.userOrganManagerName,
        userOrganManagerTel: this.hospitalInfo.manager.userOrganManagerTel,
        treatTime: hospitalInfo.treatTime,
        treatDateTimeList: hospitalInfo.treatDateTimeList,
        treatClosedYoilList: hospitalInfo.treatClosedYoilList,
        doctorList: hospitalInfo.doctorList,
      };
      Management.hospitalModify(form).then(res => {
        if (res && res.data.rt === 200) {
          this.$alert('변경되었습니다.', '알림', 'success').then(() => {
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
