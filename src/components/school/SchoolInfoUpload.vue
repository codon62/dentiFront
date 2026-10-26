<template>
  <div class="popup_content">
    <v-popuptitle message="학생 정보 업로드" imgsrc="common/ic_agreement.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver pt20">
      <div class="row">
        <div class="inner--left">
          <p class="c_red commp fwb">※ 나이스 시스템 > 학적 > 기본학적관리 > 전체 명렬표 출력 (학적 권한이 없는 경우 나이스 담당에게 권한 요청)</p>
          <p class="c_red commp fwb mt5">※ '학년'에서 해당 학년 조회 후 '명렬표내용선택' 클릭 > '성별' 추가 및 '선택' 클릭 (사용자 가이드 참조)</p>
          <p class="c_red commp fwb mt5">※ '엑셀 내려받기' 클릭하여 엑셀 다운로드 > A열 삽입 후 '학년' 입력(학년/반/번호/성명/성별 순서에 맞춰 정리)</p>
          <p class="c_red commp fwb mt5">※ 아래 {{ examTitle }} 유형이 정확한지 확인 > 학년 입력 후 아래 파일찾기 버튼을 통해 엑셀 업로드 (입력한 학년만 인식)</p>
        </div>
        <div class="inner--right">
          <a href="https://kr.object.gov-ncloudstorage.com/dt2024-common/public/web/common/학생 정보 업로드(명렬표) 서식.xlsx" class="comm__green_btn btn_l_size d_block wid180 commp2 mr30">
            전체 명렬표 다운로드
          </a>
        </div>
      </div>
      <div v-if="divJoin('S')" class="row flex_set mt20">
        <div class="flex_item">
          <p class="commp fwb">
            검진 유형
            <span class="c_red">*</span>
          </p>
          <div class="comm_radio mt10">
            <div
              v-for="(item, key) in districtCodeFirst === 'J' ? businessDivisionSpcJ.value : businessDivisionSpc.value"
              :key="item"
              class="radio_box d_inblock hei100"
              :class="{ ml20: key !== 'F' }"
            >
              <input :id="'div_' + key" type="radio" :value="key" :checked="modifyBusinessDivision === key" name="div" class="blind" @change="modifyBusinessDivision = key" />
              <label :for="'div_' + key">
                <span class="icon"></span>
                <span class="label_t">{{ item }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <template v-else>
        <p class="commp2 fwb mt10">{{ examTitle }} 유형</p>
        <div class="row flex_set flex_base">
          <div class="flex_item flex_size_s2">
            <div class="m__putbox mt10">
              <input class="comm_put read_put" disabled :value="divName(dataObject.businessDivision, true)" />
            </div>
          </div>
        </div>
      </template>
      <p class="commp2 fwb mt20">학교 정보</p>
      <div class="row flex_set mt10 flex_base">
        <div class="flex_item flex_size_m">
          <p class="commp fwb">
            학교
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <input class="comm_put read_put" disabled :value="userOrganTargetName" />
          </div>
        </div>
        <div class="flex_item flex_size_s ml10">
          <p class="commp fwb">
            학년
            <span class="c_red">*</span>
          </p>
          <div class="m__putbox mt10">
            <input
              type="number"
              v-model="studentToSchoolGrade1"
              class="comm_put"
              placeholder="학년"
              @input="
                isNumber($event, {
                  min: 1,
                  max: 6,
                  maxlength: 1,
                })
              "
            />
          </div>
        </div>
      </div>
      <p class="commp2 fwb mt20">학생 정보 업로드</p>
      <v-file-upload type="excel" />
      <div class="comm__line mt30"></div>
      <v-popupconfirm message="업로드" @save="upload"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import FileUpload from '@/components/common/FileUpload.vue';
import { mapGetters, mapState } from 'vuex';
import School from '@/apis/School';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
    'v-file-upload': FileUpload,
  },
  props: ['dataObject'],
  data() {
    return {
      modifyBusinessDivision: '',
      studentToSchoolGrade1: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetName', 'userOrganTargetId', 'districtCode']),
    ...mapState('status', ['businessDivisionSpc', 'businessDivisionSpcJ']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin', 'divName', 'examTitle', 'grade1ValidMsg']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  created() {
    this.modifyBusinessDivision = this.dataObject.businessDivision;
  },
  methods: {
    isNumber(e, options) {
      let value = e.target.value.replace(/[^0-9]/g, '');
      value = value.length > options?.maxlength ? value.charAt(value.length - 1) : value;
      value = value < options?.min || value > options?.max ? '' : value;
      e.target.value = value;
    },
    upload() {
      const grade1ValidMsg = this.grade1ValidMsg(this.modifyBusinessDivision, this.studentToSchoolGrade1);
      if (grade1ValidMsg) {
        this.$alert(grade1ValidMsg, '알림', 'warning');
        return false;
      }

      const file = document.getElementsByClassName('input_file')[0].files[0];
      if (!file) {
        this.$alert('파일을 업로드해 주세요.', '알림', 'warning');
        return false;
      }
      this.$store.commit('loading', true);
      // 1학년, 연제구 학생치과주치의 대응
      let businessDivision = this.dataObject.businessDivision;
      if (this.dataObject.businessDivision === 'F') {
        const grade1Int = parseInt(this.studentToSchoolGrade1);
        if (this.districtCode === 'A0109' && grade1Int === 1) {
          businessDivision = 'F1';
          this.modifyBusinessDivision = businessDivision;
        } else if (this.districtCode === 'D0101' && (grade1Int === 4 || grade1Int === 6)) {
          businessDivision = 'FY';
          this.modifyBusinessDivision = businessDivision;
        }
      }
      let request = {
        schoolId: this.userOrganTargetId,
        businessDivision: this.valueToCode('C0003', businessDivision),
        studentToSchoolGrade1: this.studentToSchoolGrade1,
      };
      if (this.divJoin('S')) {
        request.businessDivision = this.valueToCode('C0003', this.modifyBusinessDivision);
      }

      const form = new FormData();
      form.append('file', file);
      form.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
      School.studentUpload(form).then(res => {
        this.$store.commit('loading', false);
        if (res && res.data.rt === 200) {
          this.$alert('처리되었습니다.', '알림', 'success').then(() => {
            this.$store.commit('update');
            this.$store.dispatch('popup/popupClose');
          });
        } else {
          if ([400, 422].includes(res.data.rt)) {
            this.$alert(res.data.errors.message, '알림', 'error');
            return false;
          } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        }
      });
    },
  },
};
</script>
