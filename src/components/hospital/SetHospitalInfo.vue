<template>
  <div class="sub__content form__ver_1 mt30">
    <div class="browser__con">
      <div class="bg_white mt20 tac" style="width: 800px; margin: 0 auto; padding: 50px; box-sizing: border-box">
        <div class="iconbox"><img src="@/assets/images/sub/ic_hospital_o.png" /></div>
        <p class="commp3 mt15 fwb">병원 정보 설정</p>
        <p class="commp mt15 c_black2">
          알림톡 전송 및 병원 안내를 위해
          <br />
          정확한 담당자 정보와 병원 주소를 입력해주세요.
        </p>
        <div class="basic__form_box mt50">
          <div class="row flex_set">
            <p class="flex_item scommp c_black2 fwb d_inblock tal fw500" style="width: 130px">병원 담당자명</p>
            <div class="flex_item m__putbox d_inblock" style="width: 345px">
              <input
                type="text"
                :value="hospitalInfo.manager.userOrganManagerName"
                class="comm_put"
                placeholder="병원 담당자명을 입력해 주세요."
                @input="HPT_SET({ manager: { userOrganManagerName: $event.target.value } })"
              />
            </div>
          </div>
          <div class="row flex_set mt20">
            <p class="flex_item scommp c_black2 fwb d_inblock tal fw500" style="width: 130px">담당자 연락처</p>
            <div class="flex_item m__putbox d_inblock" style="width: 345px">
              <input
                type="number"
                :value="hospitalInfo.manager.userOrganManagerTel"
                class="comm_put"
                placeholder="담당자 연락처를 입력해 주세요."
                @input="HPT_SET({ manager: { userOrganManagerTel: $event.target.value } })"
              />
            </div>
          </div>
          <p class="mt10 sscommp c_gray2 tal ml135" style="width: 355px">
            <strong>* 예약 및 통보서 결과등의 시스템 알림이 담당자 연락처</strong>
            로 알림톡으로
            <br />
            &ensp; 전송될 예정이오니, 정확한 휴대전화 번호를 입력해 주세요.
            <br />
            <strong>* 우측 상단의 정보 수정 페이지</strong>
            에서 알림톡 수신 여부 설정이 가능합니다.
            <br />
            <strong>* 우측 상단의 정보 수정 페이지</strong>
            에서 담당자 정보 및 비밀번호 변경이
            <br />
            &ensp; 가능합니다.
          </p>

          <div id="addressFirst">
            <div class="row flex_set mt30">
              <p class="flex_item scommp c_black2 fwb d_inblock tal fw500" style="width: 130px">주소</p>
              <div class="flex_item m__putbox d_inblock" style="width: 345px">
                <a href="javascript:;" class="comm__blue_bd_btn fwn commp wid135 btn_m_size2 d_block" @click="daumPostCode">
                  <img src="@/assets/images/sub/ic_search_s.png" />
                  주소 검색
                </a>
              </div>
            </div>
          </div>
          <div id="addressSecond" style="display: none">
            <div class="row flex_set mt30">
              <p class="flex_item scommp c_black2 fwb d_inblock tal fw500" style="width: 130px">주소</p>
              <div class="flex_item m__putbox d_inblock" style="width: 345px">
                <input v-model="address1" type="text" class="comm_put" readonly />
              </div>
            </div>
            <div class="row flex_set mt10">
              <p class="flex_item scommp c_black2 fwb d_inblock tal fw500" style="width: 130px"></p>
              <div class="flex_item m__putbox d_inblock" style="width: 345px">
                <input v-model="address2" type="text" class="comm_put" placeholder="상세 주소를 입력해주세요." />
              </div>
            </div>
            <div class="row flex_set mt10">
              <p class="flex_item scommp c_black2 fwb d_inblock tal fw500" style="width: 130px"></p>
              <div class="flex_item m__putbox d_inblock" style="width: 345px">
                <a href="javascript:;" class="comm__blue_bd_btn fwn commp wid135 btn_m_size2 d_block" @click="daumPostCode">
                  <img src="@/assets/images/sub/ic_search_s.png" />
                  재검색
                </a>
              </div>
            </div>
          </div>
          <p class="mt10 sscommp c_gray2 tal ml135" style="width: 355px">
            <strong>* 환자에게 정확한 병원 위치 정보</strong>
            를 안내 드리고자 하오니,
            <br />
            &ensp; 정확한 병원 주소 정보를 입력해 주세요.
            <br />
            <strong>* 우측 상단의 정보 수정 페이지</strong>
            에서 주소 정보 수정이 가능합니다.
          </p>
        </div>
        <div class="row tac mt30"></div>
        <a href="javascript:;" class="d_inblock comm__blue_btn btn_m_size2" style="width: 160px" @click="enroll">병원 정보 등록하기</a>
      </div>
    </div>
  </div>
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
      address1: '',
      address2: '',
    };
  },
  computed: {
    ...mapState('hospital', ['hospitalInfo']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  validators: {
    'hospitalInfo.manager.userOrganManagerName': value => {
      return Validator.value(value).required();
    },
    'hospitalInfo.manager.userOrganManagerTel': value => {
      return Validator.value(value).required().integer().minLength(10).maxLength(11);
    },
    'hospitalInfo.hospital.hospitalAddress': value => {
      return Validator.value(value).required();
    },
  },
  methods: {
    ...mapActions('popup', ['popupOpen']),
    ...mapMutations('hospital', ['HPT_SET']),
    enroll() {
      const address = this.address1 + (this.address2 === '' ? '' : ' ' + this.address2);
      this.HPT_SET({ hospital: { hospitalAddress: address } });
      let validData = ['hospitalInfo.manager.userOrganManagerName', 'hospitalInfo.manager.userOrganManagerTel', 'hospitalInfo.hospital.hospitalAddress'];
      let validTitle = ['병원 담당자명', '담당자 연락처', '주소'];
      this.$validate(validData).then(success => {
        if (success) {
          // 알림톡 수신 설정
          this.HPT_SET({ manager: { userOrganManagerAlarm: 'Y' } });
          this.infoModify();
        } else {
          this.validError(validData, validTitle);
        }
      });
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
          this.$alert('등록되었습니다.', '알림', 'success').then(() => {
            this.$emit('change');
          });
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
          document.getElementById('addressFirst').style.display = 'none';
          document.getElementById('addressSecond').style.display = 'block';

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
