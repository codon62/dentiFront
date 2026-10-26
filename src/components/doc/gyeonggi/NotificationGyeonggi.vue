<template>
  <div>
    <div class="outer_title_box">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        통보서 작성
      </p>
    </div>
    <div class="notification_wrap">
      <div class="content_container">
        <div v-if="!fold">
          <div class="sub__content bg_white">
            <div v-if="!addRegist && billRejectReasonInfo" class="section_container">
              <template v-if="districtCodeFirst === 'C'">
                <p class="commp c_red">보건소명 : {{ `${studentInfo.districtSiName.value ? studentInfo.districtSiName.value + ' ' : ''}${studentInfo.healthCareName.value}` }} 보건소</p>
                <p class="commp c_red mb10">연락처 : {{ studentInfo.healthCareTel.value }}</p>
              </template>
              <div class="section_box">
                <p class="c_red">※ 반려 사유</p>
                <div>
                  <p class="commp c_red" v-html="billRejectReasonInfo.billRejectReason"></p>
                </div>
              </div>
            </div>
            <div v-if="treatmentPlanCancelReasonInfo" class="section_container">
              <div class="section_box">
                <p class="c_red">※ 의뢰 취소 사유</p>
                <div>
                  <p class="commp c_red" v-html="treatmentPlanCancelReasonInfo.treatmentPlanCancelReason"></p>
                </div>
              </div>
            </div>
            <div class="section_container">
              <std-info-box :businessDivision="$route.query.businessDivision" :studentInsuranceNotice="districtCodeFirst === 'A' && $route.query.businessDivision === 'C' && !addRegist" />
            </div>
            <div class="section_container">
              <div class="section_box">
                <p class="commp2 fwb">
                  구강검사
                  <br />
                  결과및 판정
                </p>
                <div class="comm__form">
                  <div v-for="(block, index) in formBlock.block1" :key="`${block.id}_${block.form}`" class="" :class="{ mt24: index > 0 }">
                    <component :is="form[block.form].component" :data-array="form[block.form]" :required="form[block.form].required" :view="addRegist" />
                  </div>
                  <div class="flex_wrap mt24">
                    <div v-for="(block, index) in formBlock.block2" :key="`${block.id}_${block.form}`" class="" :class="{ ml14: index > 0 && index < 4, mt24: index === 4 }" style="width: 212px">
                      <component :is="form[block.form].component" :data-array="form[block.form]" :required="form[block.form].required" :view="addRegist" />
                    </div>
                  </div>
                  <php-box v-if="phpBoxView" :required="true" :data-array="form.n11" />
                  <div class="mt24">
                    <component :is="form['n10'].component" :data-array="form['n10']" :required="form['n10'].required" :view="addRegist" />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="formBlock.block3.length" class="section_container">
              <div class="section_box">
                <p>예방진료 및 교육</p>
                <div>
                  <div v-for="(block, index) in formBlock.block3" :key="`${block.id}_${block.form}`" :class="{ mt24: index > 0 }">
                    <component :is="form[block.form].component" :data-array="form[block.form]" :required="form[block.form].required" :view="addRegist" />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="formBlock.block4.length" class="section_container">
              <div class="section_box">
                <p>예방진료내역</p>
                <div>
                  <div v-for="block in formBlock.block4" :key="`${block.id}_${block.form}`">
                    <component :is="form[block.form].component" :data-array="form[block.form]" :view="addRegist" :disabledPeriod="disabledPeriod" />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="formBlock.block5.length" class="section_container">
              <div class="section_box">
                <p>종합소견</p>
                <div v-if="$route.query.businessDivision === 'E'">
                  <div v-for="(block, index) in formBlock.block5" :key="`${block.id}_${block.form}`" :class="{ mt24: index > 0 }">
                    <component :is="form[block.form].component" :data-array="form[block.form]" :required="form[block.form].required" :view="addRegist" />
                  </div>
                </div>
                <div class="comm__form" v-else>
                  <p class="c_red commp5 fwb">※ 치아상태 및 구강위생상태는 치과주치의 검진 의료기관에서 학생의 종합적인 구강상태를 평가한 결과입니다.</p>
                  <p class="c_red commp5 fwb mb10">※ 치료할 치아가 있는 경우 개선요망을 선택해 주세요.</p>
                  <div class="flex_wrap">
                    <div v-for="(block, index) in formBlock.block5" :key="`${block.id}_${block.form}`" :class="{ ml14: index > 0 && index < 4 }" style="width: 212px">
                      <component :is="form[block.form].component" :data-array="form[block.form]" :required="form[block.form].required" :view="addRegist" />
                    </div>
                  </div>
                  <div class="mt24">
                    <component :is="form['n20'].component" :data-array="form['n20']" :required="form['n20'].required" :view="addRegist" />
                  </div>
                  <div class="mt24">
                    <component :is="form['n21'].component" :data-array="form['n21']" :required="form['n21'].required" :view="addRegist" />
                  </div>
                </div>
              </div>
            </div>

            <div class="section_container" style="border-bottom: 0">
              <div class="section_box">
                <p>판정 치과의사</p>
                <div>
                  <doctor-info :hospitalId="userOrganTargetId" :data-array="form.doctor" :view="addRegist" subject="검진" :disabledPeriod="disabledPeriod" />
                </div>
              </div>
            </div>
          </div>

          <div v-if="isAddFile" class="sub__content form__ver_2 bg_white">
            <p class="c_red" style="font-weight: 500">※ 타지역 학생 비용 청구 시에는 사업자등록증과 통장 사본을 등록해 주세요.</p>
            <p class="c_red mt5" style="font-weight: 500">※ 시스템에 기재된 계좌 정보와 통보서 제출 시 첨부되는 서류 정보가 일치하여야 합니다.</p>
            <div class="section_con">
              <div v-for="(file, index) in files" :key="index" :class="{ mt20: index !== 0 }">
                <p class="commp fwn">
                  {{ index === 0 ? '통장사본' : '사업자등록증' }}
                  <span class="c_red">(최대 용량 5MB)</span>
                </p>
                <file-upload :remove="true" :file-name="file.originName" @input="fileInput($event, index)" @remove="removeFile(index)" />
              </div>
            </div>
          </div>

          <div v-for="(item, index) in notificationList" :key="item.notificationId" class="sub__content form__ver_2 bg_white mt30">
            <!-- n차 통보서 view -->
            <div class="sub__section">
              <div class="section_con">
                <p class="commp2 fwb">{{ 2 + index }}차 통보서</p>
                <div class="textbox mt20"><textarea cols="30" rows="10" :value="item.form.n_content" class="comm__textarea wid100 read_f2" style="height: 160px" disabled></textarea></div>
                <div class="flex_set">
                  <div class="flex_item flex_size_m">
                    <p class="fwb mt30 commp2">판정 치과의사</p>
                    <p class="scommp c_gray2 fwn mt10">치과의사명</p>
                    <!-- pdf 적용 위해 style 태그 필요 -->
                    <div class="m__putbox mt10 wid250">
                      <input type="text" class="comm_put read_put" style="background-color: #f2f2f2; padding: 0px 15px" :value="item.form.n_doctor_name" readonly />
                    </div>
                  </div>
                  <div class="flex_item flex_size_m ml20">
                    <p class="scommp c_gray2 fwn">면허번호</p>
                    <div class="m__putbox mt10 wid250">
                      <input type="text" class="comm_put read_put" style="background-color: #f2f2f2; padding: 0px 15px" :value="item.form.n_license" readonly />
                    </div>
                  </div>
                  <div class="flex_item ml60">
                    <p class="fwb mt30 commp2">검진일 및 검진기관</p>
                    <p class="scommp c_gray2 fwn mt10">검진일</p>
                    <div class="m__putbox mt10 wid250"><input type="text" class="comm_put read_put" style="background-color: #f2f2f2; padding: 0px 15px" :value="item.form.n_date" readonly /></div>
                  </div>
                  <div class="flex_item flex_size_m4 ml20">
                    <p class="scommp c_gray2 fwn">검진기관명</p>
                    <div class="m__putbox mt10 wid250"><input type="text" class="comm_put read_put" style="background-color: #f2f2f2; padding: 0px 15px" :value="item.form.n_organ" readonly /></div>
                  </div>
                </div>
                <p v-if="item.treatStatus === 'N'" class="fwb commp2 mt30">검진비</p>
                <div v-if="item.treatStatus === 'N'" class="m__putbox mt20 wid250"><input type="number" class="comm_put read_put" :value="item.form.examPrice" readonly /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="button_box">
        <div>
          <a href="javascript:;" class="white_button wid108" @click="$router.go(-1)">돌아가기</a>
        </div>
        <div class="flex_box">
          <a href="javascript:;" class="black_button wid108" @click="temporary">임시 저장</a>
          <a href="javascript:;" class="blue_button wid180 ml25" @click="next">
            {{ districtCodeFirst === 'A' && $route.query.businessDivision === 'C' && latestTreatStatus !== 'Y' ? '다음' : '최종 제출' }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import stdInfoBox from '@/components/doc/gyeonggi/stdInfoBox';
import oralNotDrawBox from '@/components/doc/gyeonggi/oralNotDrawBox';
import phpBox from '@/components/doc/gyeonggi/phpBox';
import LongCheckAndBox from '@/components/doc/gyeonggi/longCheckAndBox';
import DoctorInfo from '@/components/doc/gyeonggi/doctorInfo';
import preventCareHistory from '@/components/doc/gyeonggi/preventCareHistory';
import FileUpload from '@/components/common/FileUpload.vue';
import optionSelectBox from '@/components/doc/gyeonggi/optionSelectBox';
import optionCheckListBox from '@/components/doc/gyeonggi/optionCheckListBox';
import radioExtraBox from '@/components/doc/gyeonggi/radioExtraBox';
import allCheckList from '@/components/doc/gyeonggi/allCheckList';
import noneOptionCheckList from '@/components/doc/gyeonggi/noneOptionCheckList';
import { mapGetters, mapMutations, mapState } from 'vuex';
import InputBox from '@/components/doc/gyeonggi/InputBox';

export default {
  name: 'NotificationGyeonggi',
  components: {
    'doctor-info': DoctorInfo,
    'std-info-box': stdInfoBox,
    'oral-not-draw-box': oralNotDrawBox,
    'php-box': phpBox,
    'long-check-and-box': LongCheckAndBox,
    'prevent-care-history': preventCareHistory,
    optionSelectBox,
    optionCheckListBox,
    radioExtraBox,
    allCheckList,
    noneOptionCheckList,
    FileUpload,
    InputBox,
  },
  data() {
    return {
      form: [],
      formBlock: {
        block1: [],
        block2: [],
        block3: [],
        block4: [],
        block5: [],
      },
      notificationId: '',
      notificationList: [],
      latestNotStatus: '',
      treatStatus: '',
      latestTreatStatus: '',
      infoAgreeFile: '',
      addRegist: false,
      fold: false,
      notNum: 0,
      billRejectReasonInfo: null,
      treatmentPlanCancelReasonInfo: null,
      isAddFile: false,
      files: ['', ''],
    };
  },
  computed: {
    ...mapState('doc', ['formContents', 'pdfStatus', 'billRegist', 'notificationSubData']),
    ...mapState('user', ['userOrganTargetId', 'districtCode', 'hospitalType']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName', 'defaultExamPrice']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
    phpBoxView() {
      if ((this.districtCodeFirst === 'D' || this.$route.query.businessDivision.includes('F')) && !(this.districtCodeFirst === 'F' && this.$route.query.businessDivision.includes('F'))) {
        // 부산시 or 학생치과주치의, not 밀양시 학생치과주치의
        return true;
      }
      return false;
    },
    disabledPeriod() {
      return [null, '2024-05-01'];
    },
    month() {
      return this.formContents.notification.n_date.value ? parseInt(this.formContents.notification.n_date.value.split('-')[1]) : null;
    },
  },
  created() {
    this.$store.commit('student/resetStudentInfo');
    this.$store.commit('doc/notification_clear');
    this.$store.commit('doc/pdfStatusSet', false);
    this.$store.commit('doc/billRegistSet', false);
    this.$store.commit('loading', false);

    this.$store.commit('doc/notification_set', { districtCodeFirst: this.districtCodeFirst, businessDivision: this.$route.query.businessDivision });

    this.DATA_SET({ n_2: '', n_3: '', n_4: '' }); // 형식이 바뀌어 value 설정 필요
    this.form.n1 = { component: 'optionSelectBox', required: true, title: '충전된 치아', data1: 'n_1' };
    this.form.n2 = { component: 'oral-not-draw-box', required: true, title: '우식치아', first: 'n_2', second: 'n_2_up', third: 'n_2_down' };
    this.form.n3 = { component: 'oral-not-draw-box', required: true, title: '우식발생 위험치아', first: 'n_3', second: 'n_3_up', third: 'n_3_down' };
    this.form.n4 = { component: 'oral-not-draw-box', required: true, title: '결손치아', first: 'n_4', second: 'n_4_up', third: 'n_4_down' };
    this.form.n5 = { component: 'optionSelectBox', required: true, title: '구내염 및 연조직 질환', data1: 'n_5' };
    this.form.n6 = { component: 'optionSelectBox', required: true, title: '부정교합', data1: 'n_6' };
    this.form.n7 = { component: 'noneOptionCheckList', required: true, title: '치주질환', data1: 'n_7', data2: 'n_7_check' };
    this.form.n8 = { component: 'optionSelectBox', required: true, title: '악관절 이상', data1: 'n_8' };
    this.form.n9 = { component: 'optionSelectBox', required: true, title: '구강위생상태', data1: 'n_9' };
    this.form.n10 = { component: 'optionCheckListBox', required: true, title: '그 밖의 치아상태', data1: 'n_10', data2: 'n_10_etc' };
    this.form.n11 = {
      component: 'php-box',
      required: true,
      title: 'PHP 검사',
      data1: 'n_11',
      data2: 'n_11_not',
      data3: 'n_11_score',
      data4: 'n_11_php1',
      data5: 'n_11_php2',
      data6: 'n_11_php3',
      data7: 'n_11_php4',
      data8: 'n_11_php5',
      data9: 'n_11_php6',
    };
    this.form.n12 = {
      component: 'allCheckList',
      required: true,
      title: '온라인, 구강보건교육 (아래 항목은 학생치과주치의사업에 의해 무료로 제공됩니다. 시행된 항목에 체크해 주세요.)',
      data1: 'n_12',
    };
    this.form.n13 = {
      component: 'radioExtraBox',
      required: true,
      title1: '예방진료-전문가 구강위생관리 (시행하지 않은 경우는 미진료 사유 기재란에 내용을 입력해 주세요.)',
      title2: '예방진료-불소도포(불소바니쉬) (시행하지 않은 경우는 미진료 사유 기재란에 내용을 입력해 주세요.)',
      data1: 'n_13',
      data2: ['n_13_not1', 'n_13_not2'],
    };
    this.form.n13check = { component: 'optionCheckListBox', title: '위 예방진료 및 교육 외 치과의사 판단에 따라 추가적으로 시행된 항목에 체크해 주세요.', data1: 'n_13_check' };
    this.form.n13tooth = { component: 'prevent-care-history', data1: 'n_13_tooth' };
    this.form.n15 = { component: 'optionSelectBox', required: true, title: '치아상태', data1: 'n_15' };
    this.form.n16 = { component: 'optionSelectBox', required: true, title: '구강위생상태', data1: 'n_16' };
    this.form.n17 = { component: 'long-check-and-box', title: '종합소견', required: true, data1: 'n_17', data2: 'n_17_etc' };
    this.form.n18 = { component: 'long-check-and-box', title: '가정에서의 조치사항', data1: 'n_18', data2: 'n_18_etc' };
    this.form.n20 = { component: 'optionCheckListBox', title: '재내원 계획 (재내원 계획은 환자 본인부담금이 발생하는 진료로, 보호자 동의 후 다음 내원 계획을 진행합니다.)', data1: 'n_20' };
    this.form.n21 = { component: 'inputBox', title: '기타 소견', data1: 'n_21' };
    this.form.doctor = { data1: 'n_doctor', data2: 'n_doctor_name', data3: 'n_license', data4: 'n_date', data5: 'n_organ' };

    delete this.form.n5.data2;
    delete this.form.n6.data2;
    this.form.n2.second = 'n_2_u_up';
    this.form.n2.third = 'n_2_u_down';
    this.form.n2.fourth = 'n_2_y_up';
    this.form.n2.fifth = 'n_2_y_down';
    this.form.n3.second = 'n_3_u_up';
    this.form.n3.third = 'n_3_u_down';
    this.form.n3.fourth = 'n_3_y_up';
    this.form.n3.fifth = 'n_3_y_down';
    this.formBlock.block1.push({ id: 1, form: 'n2' }, { id: 2, form: 'n3' }, { id: 3, form: 'n4' });
    this.formBlock.block2.push({ id: 1, form: 'n1' }, { id: 2, form: 'n5' }, { id: 3, form: 'n6' }, { id: 4, form: 'n9' }, { id: 5, form: 'n8' });

    if (this.$route.query.businessDivision === 'E') {
      // 학생구강검진
      this.formBlock.block5.push({ id: 1, form: 'n17' }, { id: 2, form: 'n18' });
    } else {
      // 학생치과주치의
      this.formBlock.block3.push(
        {
          id: 1,
          form: 'n12',
          class: 'mt5 c_red scommp',
          description: `* 아래 항목은 ‘${this.divName(this.$route.query.businessDivision, false)}사업’에 의해 무료로 제공되며, 시행된 항목에 체크하여 주세요.`,
        },
        { id: 2, form: 'n13', class: 'mt30 scommp c_gray2', description: '* 필수 항목을 시행하지 않은 경우는 미진료 사유 기재란에 기재하여 주세요.' },
        { id: 3, form: 'n13check', class: 'mt30 scommp c_gray2', description: '* 아래 항목은 치과의사의 판단에 따라 선택적으로 시행되며, 시행된 항목에 체크하여 주세요.' },
      );
      this.formBlock.block4.push({ id: 1, form: 'n13tooth' });
      this.formBlock.block5.push({ id: 1, form: 'n15' }, { id: 2, form: 'n16' });
    }

    let infoForm = {
      hospitalId: this.userOrganTargetId,
      studentId: this.$route.query.studentId,
      businessDivision: this.valueToCode('C0003', this.$route.query.businessDivision),
      notificationYear: this.$route.query.notificationYear,
    };
    Hospital.notificationInfo(infoForm).then(res => {
      if (!res) {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
        return;
      }
      if (res.data.rt === 200) {
        // code convert
        res.data.studentInfo.schoolType = this.codeToValue(res.data.studentInfo.schoolType);
        res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
        res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
        if (res.data.notificationInfo) {
          res.data.notificationInfo.status = this.codeToValue(res.data.notificationInfo.status);
          res.data.notificationInfo.treatStatus = this.codeToValue(res.data.notificationInfo.treatStatus);
        }
        for (const key in res.data.notificationList) {
          res.data.notificationList[key].status = this.codeToValue(res.data.notificationList[key].status);
          res.data.notificationList[key].treatStatus = this.codeToValue(res.data.notificationList[key].treatStatus);
        }
        res.data.latestNotStatus = this.codeToValue(res.data.latestNotStatus);
        res.data.basicEduDate = this.codeToValue(res.data.basicEduDate);
        res.data.infoAgreeFile = this.codeToValue(res.data.infoAgreeFile);
        // code convert end
        if (res.data.notificationInfo) {
          if (res.data.latestNotStatus === 'Y') {
            alert('잘못된 접근입니다.');
            this.$router.push('/');
            return false;
          }
        }
        this.$store.commit('doc/notificationSubDataSet', { basicEduDate: res.data.basicEduDate, hospitalTel: res.data.hospitalInfo.hospitalTel });
        this.infoAgreeFile = res.data.infoAgreeFile;
        this.billRejectReasonInfo = res.data.billRejectReasonInfo;
        if (this.billRejectReasonInfo) {
          this.billRejectReasonInfo.billRejectReason = this.billRejectReasonInfo.billRejectReason.replace(/(\n)/g, '<br>');
        }
        this.treatmentPlanCancelReasonInfo = res.data.treatmentPlanCancelReasonInfo;
        if (this.treatmentPlanCancelReasonInfo) {
          this.treatmentPlanCancelReasonInfo.treatmentPlanCancelReason = this.treatmentPlanCancelReasonInfo.treatmentPlanCancelReason.replace(/(\n)/g, '<br>');
        }
        if (['A', 'C'].indexOf(this.districtCodeFirst) !== -1 && this.notificationSubData.basicEduDate === 'Y') {
          let allValue = [];
          for (const i in this.formContents.notification.n_12.options) {
            allValue.push(this.formContents.notification.n_12.options[i].value);
          }
          this.DATA_SET({ n_12: allValue });
        }
        this.latestNotStatus = res.data.latestNotStatus;
        if (this.districtCodeFirst === 'C' && this.hospitalType !== 'T') {
          if ((!res.data.hospitalDocumentInfo.fileA || !res.data.hospitalDocumentInfo.fileB) && this.districtCode.substr(0, 3) !== res.data.studentInfo.districtCode.substr(0, 3)) {
            this.isAddFile = true;
          }
        }
        this.$store.commit('student/DATA_SET', res.data.studentInfo);
        if (res.data.notificationInfo) {
          this.$store.commit('doc/DATA_SET', res.data.notificationInfo.form);
          this.treatStatus = res.data.notificationInfo.treatStatus;
          this.latestTreatStatus = res.data.notificationInfo.treatStatus;
        }
        this.$store.commit('update2');
      } else if (res.data.rt === 400) {
        this.$alert(res.data.rtMsg?.split(':').pop(), '알림', 'error');
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET', 'ADDREGIST_SET']),
    addTreatment() {
      this.$store.dispatch('popup/popupOpen', { contents: 'addTreatment' });
    },
    formData(status) {
      if (this.$route.query.businessDivision.includes('F')) {
        // 학생치과주치의
        if (['H', 'T'].includes(this.hospitalType) && !(this.districtCodeFirst === 'C' && this.studentInfo.schoolType.value === 'D')) {
          // 보건소치과이거나 이동진료팀 병원의 경우 (경기도 특수학교 제외)
          this.DATA_SET({ examPrice: 0 }); // 검진비 0원
        } else {
          this.DATA_SET({ examPrice: this.defaultExamPrice(this.$route.query.businessDivision, this.month) }); // 검진비
        }
      } else if (this.$route.query.businessDivision === 'E') {
        // 학생구강검진
        if (this.hospitalType === 'T' && !(this.districtCodeFirst === 'C' && this.studentInfo.schoolType.value === 'D')) {
          // 이동진료팀 병원의 경우 (경기도 특수학교 제외)
          this.DATA_SET({ examPrice: 0 }); // 검진비 0원
        } else {
          this.DATA_SET({ examPrice: this.defaultExamPrice(this.$route.query.businessDivision, this.month) }); // 검진비
        }
      }
      if (this.addRegist) {
        let formData = {};
        for (const i in this.formContents.notificationAddRegist) {
          formData[i] = this.formContents.notificationAddRegist[i].value;
        }
        return {
          hospitalId: this.userOrganTargetId,
          studentId: this.$route.query.studentId,
          notificationId: this.notificationId, // 존재하면 UPDATE
          status: this.valueToCode('C0001', status),
          billRegist: status === 'Y' ? this.billRegist : false,
          form: formData,
        };
      } else {
        let formData = {};
        for (const i in this.formContents.notification) {
          formData[i] = this.formContents.notification[i].value;
        }
        return {
          districtCode: this.districtCodeFirst,
          hospitalId: this.userOrganTargetId,
          studentId: this.$route.query.studentId,
          businessDivision: this.valueToCode('C0003', this.$route.query.businessDivision),
          status: this.valueToCode('C0001', status),
          billRegist: status === 'Y' ? (this.$route.query.businessDivision !== 'C' ? true : this.billRegist) : false,
          form: formData,
        };
      }
    },
    registThen(res, status) {
      this.$store.commit('loading', false);
      if (!res) {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
        return;
      }
      if (res.data.rt === 200) {
        const msg = this.codeToValue(status) === 'Y' ? '최종제출' : '임시저장';
        this.$alert(`${msg}되었습니다.`, '알림', 'success').then(() => {
          this.$router.go(-1);
        });
      } else if (res.data.rt === 400) {
        this.$alert(res.data.rtMsg?.split(':').pop(), '알림', 'error');
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    },
    temporary() {
      if (this.isAddFile) {
        this.$confirm('', '알림', 'question', { html: '임시저장하시겠습니까?<br/>첨부파일은 임시저장되지 않습니다.' })
          .then(() => {
            this.$store.commit('loading', true);
            const form = this.formData('N');
            if (this.addRegist) {
              Hospital.notificationAddRegist(form).then(res => this.registThen(res, form.status));
            } else {
              Hospital.notificationRegist(form).then(res => this.registThen(res, form.status));
            }
          })
          .catch(() => {});
      } else {
        this.$store.commit('loading', true);
        const form = this.formData('N');
        if (this.addRegist) {
          Hospital.notificationAddRegist(form).then(res => this.registThen(res, form.status));
        } else {
          Hospital.notificationRegist(form).then(res => this.registThen(res, form.status));
        }
      }
    },
    next() {
      // 21.07.27 경기도의 경우 동의서 등록되어야 통보서 최종제출 가능
      if (this.districtCodeFirst === 'C' && this.infoAgreeFile !== 'Y') {
        this.$alert('', '알림', 'warning', { html: '최종제출 전 개인정보활용동의서를 먼저 제출해주세요.<br/>통보서 작성중인 경우, 임시저장 기능을 이용해주세요.' });
        return false;
      }
      const form = this.formData('Y');
      const contents = form.form;
      // validation
      if (!this.addRegist) {
        // 1차
        let validList = [];
        if (this.districtCodeFirst === 'C' && this.$route.query.businessDivision.includes('F')) {
          // 경기도 학생치과주치의
          validList = ['n_2', 'n_2_u_up', 'n_3', 'n_3_u_up', 'n_4', 'n_4_up', 'n_1', 'n_5', 'n_6', 'n_9', 'n_8', 'n_11', 'n_11_not', 'n_12', 'n_13_not1', 'n_13_not2', 'n_15', 'n_16'];
        } else if (this.districtCodeFirst === 'C' && this.$route.query.businessDivision === 'E') {
          // 경기도 학생구강검진
          validList = ['n_2', 'n_2_u_up', 'n_3', 'n_3_u_up', 'n_4', 'n_4_up', 'n_1', 'n_5', 'n_6', 'n_9', 'n_8', 'n_17', 'n_17_etc', 'n_18_etc'];
        }
        let validTitle = '';
        for (const i of validList) {
          switch (i) {
            case 'n_1':
              if (contents[i] === '') {
                validTitle = '충전된 치아';
              }
              break;
            case 'n_1_u':
              if (contents.n_1 == 1 && contents[i] + contents['n_1_y'] === 0) {
                validTitle = '충전된 치아 - 치아 갯수';
              }
              break;
            case 'n_2':
              if (contents[i] === '') {
                validTitle = this.form.n2.title;
              }
              break;
            case 'n_2_up':
              if (contents.n_2 == 1 && contents[i] + contents['n_2_down'] === 0) {
                validTitle = this.form.n2.title + ' - 치아 갯수';
              }
              break;
            case 'n_2_u':
              if (contents.n_2 == 1 && contents[i] + contents['n_2_y'] === 0) {
                validTitle = this.form.n2.title + ' - 치아 갯수';
              }
              break;
            case 'n_2_u_up':
              if (contents.n_2 == 1 && contents[i] + contents['n_2_u_down'] + contents['n_2_y_up'] + contents['n_2_y_down'] === 0) {
                validTitle = this.form.n2.title + ' - 치아 갯수';
              }
              break;
            case 'n_3':
              if (contents[i] === '') {
                validTitle = this.form.n3.title;
              }
              break;
            case 'n_3_up':
              if (contents.n_3 == 1 && contents[i] + contents['n_3_down'] === 0) {
                validTitle = this.form.n3.title + ' - 치아 갯수';
              }
              break;
            case 'n_3_u':
              if (contents.n_3 == 1 && contents[i] + contents['n_3_y'] === 0) {
                validTitle = this.form.n3.title + ' - 치아 갯수';
              }
              break;
            case 'n_3_u_up':
              if (contents.n_3 == 1 && contents[i] + contents['n_3_u_down'] + contents['n_3_y_up'] + contents['n_3_y_down'] === 0) {
                validTitle = this.form.n3.title + ' - 치아 갯수';
              }
              break;
            case 'n_4':
              if (contents[i] === '') {
                validTitle = this.form.n4.title;
              }
              break;
            case 'n_4_up':
              if (contents.n_4 == 1 && contents[i] + contents['n_4_down'] === 0) {
                validTitle = this.form.n4.title + ' - 치아 갯수';
              }
              break;
            case 'n_5':
              if (contents[i] === '') {
                validTitle = '구내염 및 연조직 질환';
              }
              break;
            case 'n_5_disease':
              if (contents.n_5 == 1 && contents[i] === '') {
                validTitle = '구내염 및 연조직 질환 - 질환명';
              }
              break;
            case 'n_6':
              if (contents[i] === '') {
                validTitle = '부정교합';
              }
              break;
            case 'n_6_check':
              if (contents.n_6 == 1 && !contents[i].length) {
                validTitle = '부정교합 - 항목';
              }
              break;
            case 'n_7':
              if (contents[i] === '') {
                validTitle = '치주질환';
              }
              break;
            case 'n_7_check':
              if (contents.n_7 == 1 && !contents[i].length) {
                validTitle = '치주질환 - 항목';
              }
              break;
            case 'n_8':
              if (contents[i] === '') {
                validTitle = '악관절 이상';
              }
              break;
            case 'n_9':
              if (contents[i] === '') {
                validTitle = '구강위생상태';
              }
              break;
            case 'n_11':
              if (contents[i] === '') {
                validTitle = '구강환경관리능력검사';
              }
              break;
            case 'n_11_not':
              if (contents.n_11 == 0 && !contents[i].length) {
                validTitle = '구강환경관리능력검사 - 미실시 사유';
              }
              break;
            case 'n_12':
              if (contents[i].length !== this.formContents.notification[i].options.length) {
                validTitle = '구강보건교육 - 모든 항목';
              }
              break;
            case 'n_13_not1':
              if (contents.n_13.indexOf(1) === -1 && contents.n_13.indexOf('1') === -1 && contents[i] === '') {
                validTitle = '예방진료 - 전문가 구강위생관리';
              }
              break;
            case 'n_13_not2':
              if (contents.n_13.indexOf(2) === -1 && contents.n_13.indexOf('2') === -1 && contents[i] === '') {
                validTitle = `예방진료 - 불소도포(불소바니쉬${this.districtCodeFirst === 'H' ? '/겔' : ''})`;
              }
              break;
            case 'n_13_not3':
              if (contents.n_13.indexOf(3) === -1 && contents.n_13.indexOf('3') === -1 && contents[i] === '') {
                validTitle = '예방진료 - 파노라마 촬영';
              }
              break;
            case 'n_13_not4':
              if (contents.n_13.indexOf(4) === -1 && contents.n_13.indexOf('4') === -1 && contents[i] === '') {
                validTitle = '예방진료 - 구강검진';
              }
              break;
            case 'n_13_2_radio':
              if ((contents.n_13_check.indexOf(2) !== -1 || contents.n_13_check.indexOf('2') !== -1) && contents[i] === '') {
                validTitle = '필요시제공 - 치석제거 - 항목';
              }
              break;
            case 'n_13_4_check':
              if ((contents.n_13_check.indexOf(4) !== -1 || contents.n_13_check.indexOf('4') !== -1) && !contents[i].length) {
                validTitle = '필요시제공 - 방사선 촬영 - 항목';
              }
              break;
            case 'n_15':
              if (contents[i] === '') {
                validTitle = '치아상태';
              }
              break;
            case 'n_16':
              if (contents[i] === '') {
                validTitle = '구강위생상태';
              }
              break;
            case 'n_17':
              if (!contents[i].length) {
                validTitle = '종합소견';
              }
              break;
            case 'n_17_etc':
              if ((contents.n_17.indexOf(8) !== -1 || contents.n_17.indexOf('8') !== -1) && contents[i] === '') {
                validTitle = '종합소견 - 기타';
              }
              break;
            case 'n_18_etc':
              if ((contents.n_18.indexOf(8) !== -1 || contents.n_18.indexOf('8') !== -1) && contents[i] === '') {
                validTitle = '가정에서의 조치사항 - 기타';
              }
              break;
            case 'n_deep_treat':
              if (contents[i] === '') {
                validTitle = '심화치료 여부';
              }
              break;
          }
          if (validTitle !== '') {
            break;
          }
        }
        if (validTitle !== '') {
          this.$alert('', '알림', 'warning', { html: `<strong>${validTitle}</strong> : 필수 입력 항목입니다.` });
          return false;
        }
      }
      if (this.districtCodeFirst === 'A' && this.$route.query.businessDivision === 'C' && (this.latestNotStatus === 'E' || this.latestTreatStatus !== 'Y')) {
        // 서울시 아동치과주치의 추가진료 이미 필요 상태가 아닌 경우
        this.$store.dispatch('popup/popupOpen', { contents: 'notificationNext', params: { addRegist: this.addRegist, notificationId: this.notificationId, form: form } }); // 진료 여부 설정 팝업
      } else {
        // 최종제출
        if (!this.addRegist) {
          // 1차
          if (this.districtCodeFirst === 'D') {
            // 부산시
            if (this.$route.query.businessDivision === 'C') {
              // 부산시 아동치과주치의
              if (this.formContents.notification.n_deep_treat.value == 0) {
                // 심화치료 여부에 따라 비용 청구서 발생 여부 변경
                if (this.latestTreatStatus === 'Y') {
                  this.$alert('', '알림', 'warning', { html: `<strong>심화치료 여부</strong> : 필요없음으로 변경할 수 없습니다.` });
                  return false;
                }
                this.$store.commit('doc/billRegistSet', true); // 심화치료 불필요인 경우 비용청구서 발생
              }
              form.billRegist = true;
            } else {
              // 부산시 학치 / 학구
              this.DATA_SET({ n_deep_treat: 0 });
            }
          }
        }
        this.$confirm('', '알림', 'question', { html: '최종제출 하시겠습니까?<br/>최종제출 시 수정이 불가능합니다.' })
          .then(() => {
            this.$store.commit('loading', true);
            if (!this.addRegist) {
              // 1차
              this.$store.commit('doc/notificationSubDataSet', { treatStatus: 'N' });
              if (this.isAddFile) {
                if (this.files[0] === '' || this.files[1] === '') {
                  this.$store.commit('loading', false);
                  this.$alert('통장사본 및 사업자등록증을 첨부해주세요.', '알림', 'warning');
                  return false;
                }
                const fileForm = new FormData();
                fileForm.append('districtDigit1', this.districtCodeFirst);
                fileForm.append('mode', 'R');
                fileForm.append('hospitalId', this.userOrganTargetId);
                fileForm.append('fileA', this.files[0]);
                fileForm.append('fileB', this.files[1]);
                Hospital.hospitalDocumentRegist(fileForm).then(res => {
                  if (!res) {
                    this.$store.commit('loading', false);
                    alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
                    return;
                  }
                  if (res.data.rt === 200) {
                    this.$store.dispatch('popup/popupOpen', {
                      contents: 'viewNotification',
                      params: { studentId: this.$route.query.studentId, businessDivision: this.$route.query.businessDivision, pdf: true, notificationYear: this.$route.query.notificationYear },
                    }); // pdf 저장
                    // Hospital.notificationRegist(form).then(res => this.registThen(res, form.status));
                  } else if (res.data.rt === 400) {
                    this.$store.commit('loading', false);
                    this.$alert(res.data.rtMsg?.split(':').pop(), '알림', 'error');
                  } else {
                    this.$store.commit('loading', false);
                    alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
                  }
                });
              } else {
                this.$store.dispatch('popup/popupOpen', {
                  contents: 'viewNotification',
                  params: { studentId: this.$route.query.studentId, businessDivision: this.$route.query.businessDivision, pdf: true, notificationYear: this.$route.query.notificationYear },
                }); // pdf 저장
                // Hospital.notificationRegist(form).then(res => this.registThen(res, form.status));
              }
            } else {
              const form = this.formData('Y');
              this.$store.commit('loading', false);
              Hospital.notificationAddRegist(form).then(res => this.registThen(res, form.status));
            }
          })
          .catch(() => {});
      }
    },
    fileInput(file, index) {
      this.files[index] = file;
      for (const i in this.files) {
        const fileName = document.getElementsByClassName('upload_text')[i];
        if (this.files[i].originName) {
          fileName.value = this.files[i].originName;
        } else if (this.files[i].name) {
          fileName.value = this.files[i].name;
        }
      }
    },
    removeFile(index) {
      this.files[index] = '';
      for (const i in this.files) {
        const fileName = document.getElementsByClassName('upload_text')[i];
        if (this.files[i].originName) {
          fileName.value = this.files[i].originName;
        } else if (this.files[i].name) {
          fileName.value = this.files[i].name;
        } else {
          fileName.value = '';
        }
      }
    },
  },
};
</script>
