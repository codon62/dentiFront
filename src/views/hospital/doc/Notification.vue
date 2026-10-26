<template>
  <notification-gyeonggi v-if="districtCodeFirst === 'C'"></notification-gyeonggi>
  <div v-else>
    <div class="titbox">
      <p class="commp3 sub_title fwb">
        <img src="@/assets/images/sub/ic_write.png" />
        {{ districtCodeFirst === 'I' ? '구강진료 결과통보서' : '통보서' }} 작성
      </p>
    </div>
    <!-- 통보서 form__ver_2 -->
    <div v-if="!fold">
      <div class="sub__content form__ver_2 bg_white mt30">
        <div v-if="!addRegist && billRejectReasonInfo" class="comm__form mt20">
          <p class="c_red d_inblock commp2 fwb ml5">※ 반려 사유</p>
          <div class="form__row mt10">
            <div class="set_table">
              <div class="set__table tal">
                <p class="commp c_red" v-html="billRejectReasonInfo.billRejectReason"></p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="treatmentPlanCancelReasonInfo" class="comm__form mt20">
          <p class="c_red d_inblock commp2 fwb ml5">※ 의뢰 취소 사유</p>
          <div class="form__row mt10">
            <div class="set_table">
              <div class="set__table tal">
                <p class="commp c_red" v-html="treatmentPlanCancelReasonInfo.treatmentPlanCancelReason"></p>
              </div>
            </div>
          </div>
        </div>
        <div class="sub__section mt30">
          <std-info-box :businessDivision="$route.query.businessDivision" :studentInsuranceNotice="districtCodeFirst === 'A' && $route.query.businessDivision === 'C' && !addRegist" />
        </div>
        <!--//sub__section-->
        <div class="comm__line mt30"></div>
        <div class="sub__section">
          <div class="section_con">
            <div v-if="districtCodeFirst === 'A' && $route.query.businessDivision === 'C'">
              <p class="commp2 fwb">진료 계획 작성 원칙</p>
              <p class="commp mt5 fw500">
                * 치과 진료는 자치구 보건소 지역협의체 회의에서 결정된 진료범위입니다. (반드시 확인요망)
                <br />
                * 예방진료 : 치아홈메우기/치석제거(부분치석제거)
              </p>
              <p class="commp mt20 c_red fw500">
                ※ 치석제거 전악제거가 필요시 보건소 협의하에 진행
                <br />
                ※ 불소도포는 치과의원에서 실시하더라도 청구 불가
                <br />
                ※ 예산사정상 반드시 보건소 승인 후 진료 시작하셔야 합니다.
              </p>
            </div>
            <template v-if="districtCodeFirst !== 'I'">
              <p class="commp2 fwb" :class="{ mt30: districtCodeFirst === 'A' && $route.query.businessDivision === 'C' }">구강검사 결과 및 판정</p>
              <p
                v-if="!((['A', 'F', 'G'].includes(districtCodeFirst) && $route.query.businessDivision === 'E') || districtCodeFirst === 'C' || districtCodeFirst === 'E' || districtCodeFirst === 'J')"
                class="mt10 commp"
              >
                * (치아번호 한번 클릭시) 파란색은 영구치,(치아번호 두번 클릭시) 빨간색은 유치를 의미합니다.
              </p>
            </template>
            <p v-else class="commp2 fwb" style="margin-bottom: -20px">치면세균막검사</p>
            <div class="comm__form mt15">
              <div v-for="(block, index) in formBlock.block1" :key="`${block.id}_${block.form}`" class="" :class="{ mt10: index > 0 }">
                <component :is="form[block.form].component" :data-array="form[block.form]" :view="addRegist" />
              </div>
              <div v-if="formBlock.block1.length" class="comm__line mt30"></div>

              <div v-for="(block, index) in formBlock.block2" :key="`${block.id}_${block.form}`" class="" :class="{ mt30: index === 0, mt10: index > 0 }">
                <component :is="form[block.form].component" :data-array="form[block.form]" :view="addRegist" />
              </div>
              <div v-if="formBlock.block2.length" class="comm__line mt30"></div>

              <php-box v-if="phpBoxView" :data-array="form.n11" :view="addRegist" />
              <div v-if="phpBoxView" class="comm__line mt30"></div>

              <p v-if="formBlock.block3.length" class="commp2 mt30 fwb">{{ districtCodeFirst === 'I' ? '구강' : '예방' }}진료 및 교육</p>
              <div v-for="block in formBlock.block3" :key="`${block.id}_${block.form}`">
                <p v-if="block.description" :class="block.class">{{ block.description }}</p>
                <div v-if="['A', 'C'].indexOf(districtCodeFirst) !== -1 && block.form === 'n12'" class="mt10">
                  <div class="form_wrap_all_check_list_box">
                    <div><p class="commp c_black tal">온라인교육</p></div>
                    <div class="row">
                      <div class="d_inblock hei100">
                        <div class="check_set">
                          <input id="basicEduDate" type="checkbox" :checked="notificationSubData.basicEduDate === 'Y'" class="blind" disabled />
                          <label for="basicEduDate">
                            <span class="icon"></span>
                            <span class="label_t">이수</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt10">
                  <component :is="form[block.form].component" :data-array="form[block.form]" :view="addRegist" />
                </div>
              </div>
              <div v-if="formBlock.block3.length" class="comm__line mt30"></div>

              <p v-if="formBlock.block4.length" class="commp2 mt30 fwb">{{ districtCodeFirst === 'I' ? '구강' : '예방' }}진료내역</p>
              <div v-for="block in formBlock.block4" :key="`${block.id}_${block.form}`">
                <component :is="form[block.form].component" :data-array="form[block.form]" :view="addRegist" />
              </div>
              <div v-if="formBlock.block4.length" class="comm__line mt30"></div>

              <p v-if="formBlock.block5.length" class="fwb commp2 mt30">종합소견</p>
              <div v-for="(block, index) in formBlock.block5" :key="`${block.id}_${block.form}`" class="" :class="{ mt20: index === 0, mt10: index > 0 }">
                <component :is="form[block.form].component" :data-array="form[block.form]" :view="addRegist" />
              </div>
              <div v-if="formBlock.block5.length" class="comm__line mt30"></div>

              <doctor-info :hospitalId="userOrganTargetId" :data-array="form.doctor" :view="addRegist" :subject="examTitle" :disabledPeriod="disabledPeriod" />
              <div v-if="(districtCodeFirst === 'A' && $route.query.businessDivision === 'C' && treatStatus !== 'Y') || districtCodeFirst === 'I'">
                <p class="fwb commp2 mt20">{{ examTitle }}비</p>
                <div class="m__putbox mt10 wid250">
                  <input
                    type="number"
                    :value="formContents.notification.examPrice.value"
                    class="comm_put"
                    :class="{ read_put: addRegist }"
                    placeholder="0"
                    @keypress="isNumber($event)"
                    :disabled="addRegist"
                    @input="DATA_SET({ examPrice: $event.target.value })"
                  />
                </div>
                <div v-if="districtCodeFirst === 'A' && !addRegist">
                  <div class="mt10">
                    <div class="set_table">
                      <div class="set__table tal">
                        <p class="commp c_red fwb">▣ 검진비(본인부담금, 보건소 청구금액) 작성해야 할 경우</p>
                        <p class="commp mt5 c_red">- 예방진료, 치과치료 계획이 없고 검진으로만 끝나는 경우</p>
                        <p class="commp mt5 c_red">- 검진과 X-RAY 촬영으로만 진료가 끝나는 경우</p>
                        <p class="commp mt5 c_red pl10">※ 본인부담금이 없어도 0원으로 작성</p>
                        <p class="commp mt5 c_red pl10">※ 예방진료, 치과치료 계획이 있다면 작성하면 안됨. (검진비 작성 시 진료계획서는 작성할 수 없습니다.)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--//sub__section-->
      </div>
      <!--//sub__content-->

      <div v-if="isAddFile" class="sub__content form__ver_2 bg_white mt30">
        <p class="c_red mt20" style="font-weight: 500">※ 타지역 학생 비용 청구 시에는 사업자등록증과 통장 사본을 등록해 주세요.</p>
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

      <div v-for="item in notificationList" :key="item.notificationId" class="sub__content form__ver_2 bg_white mt30">
        <!-- n차 통보서 view -->
        <div class="sub__section">
          <div class="section_con">
            <p class="commp2 fwb">{{ item.notificationSequence }}차 통보서</p>
            <div class="textbox mt20"><textarea cols="30" rows="10" :value="item.form.n_content" class="comm__textarea wid100 read_f2" style="height: 160px" disabled></textarea></div>
            <div class="flex_set">
              <div class="flex_item flex_size_m">
                <p class="fwb mt30 commp2">판정 치과의사</p>
                <p class="scommp c_gray2 fwn mt10">치과의사명</p>
                <!-- pdf 적용 위해 style 태그 필요 -->
                <div class="m__putbox mt10 wid250"><input type="text" class="comm_put read_put" style="background-color: #f2f2f2; padding: 0px 15px" :value="item.form.n_doctor_name" readonly /></div>
              </div>
              <div class="flex_item flex_size_m ml20">
                <p class="scommp c_gray2 fwn">면허번호</p>
                <div class="m__putbox mt10 wid250"><input type="text" class="comm_put read_put" style="background-color: #f2f2f2; padding: 0px 15px" :value="item.form.n_license" readonly /></div>
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

    <div v-show="addRegist">
      <a v-if="!fold" href="javascript:;" class="mt20 comm__blue_bd_btn tac wid100 d_block btn_m_size2 commp fwn" @click="fold = true">
        <img src="@/assets/images/common/ic_fold.png" />
        통보서 내용 접기
      </a>
      <a v-else href="javascript:;" class="mt20 comm__blue_bd_btn tac wid100 d_block btn_m_size2 commp fwn" @click="fold = false">
        <img src="@/assets/images/common/ic_unfold.png" />
        통보서 내용 펼치기
      </a>

      <div class="sub__content form__ver_2 bg_white mt30">
        <div v-if="addRegist && billRejectReasonInfo" class="comm__form mt20">
          <p class="c_red d_inblock commp2 fwb ml5">※ 반려 사유</p>
          <div class="mt10">
            <div class="set_table">
              <div class="set__table tal">
                <p class="commp c_red" v-html="billRejectReasonInfo.billRejectReason"></p>
              </div>
            </div>
          </div>
        </div>
        <div class="sub__section">
          <div class="section_con">
            <p class="commp2 fwb">{{ notNum }}차 통보서 작성</p>
            <div class="textbox mt20">
              <textarea
                cols="30"
                rows="10"
                :value="formContents.notificationAddRegist.n_content.value"
                class="comm__textarea wid100"
                :placeholder="`${notNum}차 통보서 내용을 작성해 주세요.`"
                style="height: 160px"
                @input="ADDREGIST_SET({ n_content: $event.target.value })"
              ></textarea>
            </div>
            <doctor-info :hospitalId="userOrganTargetId" :data-array="form.doctor" :add-regist="true" :view="!addRegist" :subject="examTitle" />
            <div v-if="latestTreatStatus !== 'Y'">
              <p class="fwb commp2 mt20">검진비</p>
              <div class="m__putbox mt10 wid250">
                <input
                  type="number"
                  class="comm_put"
                  :value="formContents.notificationAddRegist.examPrice.value"
                  placeholder="0"
                  @keydown="isNumber($event)"
                  @input="ADDREGIST_SET({ examPrice: $event.target.value })"
                />
              </div>
              <div class="comm__form">
                <div class="mt10">
                  <div class="set_table">
                    <div class="set__table tal">
                      <p class="commp c_red fwb">▣ 검진비(본인부담금, 보건소 청구금액) 작성해야 할 경우</p>
                      <p class="commp mt5 c_red">- 예방진료, 치과치료 계획이 없고 검진으로만 끝나는 경우</p>
                      <p class="commp mt5 c_red">- 검진과 X-RAY 촬영으로만 진료가 끝나는 경우</p>
                      <p class="commp mt5 c_red pl10">※ 본인부담금이 없어도 0원으로 작성</p>
                      <p class="commp mt5 c_red pl10">※ 예방진료, 치과치료 계획이 있다면 작성하면 안됨. (검진비 작성 시 진료계획서는 작성할 수 없습니다.)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex_space_between_container mt30 mb30">
      <div class="">
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
</template>

<script>
import Hospital from '@/apis/Hospital';
import stdInfoBox from '@/components/doc/stdInfoBox';
import oralNotDrawBox from '@/components/doc/oralNotDrawBox';
import oralDrawBox from '@/components/doc/oralDrawBox';
import checkExtendBox from '@/components/doc/checkExtendBox';
import allCheckListBox from '@/components/doc/allCheckListBox';
import phpBox from '@/components/doc/phpBox';
import checkboxList from '@/components/doc/checkboxList';
import CheckboxNotInput from '@/components/doc/checkboxNotInput';
import LongCheckAndBox from '@/components/doc/longCheckAndBox';
import DoctorInfo from '@/components/doc/doctorInfo';
import preventCareHistory from '@/components/doc/preventCareHistory';
import FileUpload from '@/components/common/FileUpload.vue';
import NotificationGyeonggi from '@/components/doc/gyeonggi/NotificationGyeonggi';
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    'doctor-info': DoctorInfo,
    'std-info-box': stdInfoBox,
    'oral-not-draw-box': oralNotDrawBox,
    'oral-draw-box': oralDrawBox,
    'check-extend-box': checkExtendBox,
    'all-check-list-box': allCheckListBox,
    'php-box': phpBox,
    'checkbox-list': checkboxList,
    'checkbox-not-input': CheckboxNotInput,
    'long-check-and-box': LongCheckAndBox,
    'prevent-care-history': preventCareHistory,
    FileUpload,
    NotificationGyeonggi,
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
    ...mapGetters('business', ['divName', 'endBusiness', 'examTitle', 'defaultExamPrice']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
    phpBoxView() {
      if (this.districtCodeFirst === 'F') return false; // 밀양시 X
      // 아치 or 학치
      return this.$route.query.businessDivision === 'C' || this.$route.query.businessDivision.includes('F');
    },
    disabledPeriod() {
      // 서울 학치 2024-07-01 ~ 2024-07-29 검진일 선택 불가
      return this.districtCodeFirst === 'A' && this.$route.query.businessDivision === 'F' ? ['2024-07-01', '2024-07-29'] : null;
    },
    month() {
      return this.formContents.notification.n_date.value ? parseInt(this.formContents.notification.n_date.value.split('-')[1]) : null;
    },
  },
  created() {
    if (this.endBusiness('bill')) {
      alert('잘못된 접근입니다.');
      this.$router.push('/');
      return false;
    }

    if (this.districtCodeFirst === 'C') return;

    this.$store.commit('student/resetStudentInfo');
    this.$store.commit('doc/notification_clear');
    this.$store.commit('doc/pdfStatusSet', false);
    this.$store.commit('doc/billRegistSet', false);
    this.$store.commit('loading', false);

    this.$store.commit('doc/notification_set', { districtCodeFirst: this.districtCodeFirst, businessDivision: this.$route.query.businessDivision });

    this.form.n1 = { component: 'oral-not-draw-box', title: '충전된 치아', first: 'n_1', second: 'n_1_u', third: 'n_1_y' };
    this.form.n2 = { component: 'oral-draw-box', title: '우식치아', data1: 'n_2_tooth', data2: 'n_2', data3: 'n_2_up', data4: 'n_2_down', data5: 'n_2_u_up', data6: 'n_2_u_down' };
    this.form.n3 = { component: 'oral-draw-box', title: '우식발생 위험치아', data1: 'n_3_tooth', data2: 'n_3', data3: 'n_3_up', data4: 'n_3_down', data5: 'n_3_u_up', data6: 'n_3_u_down' };
    this.form.n4 = { component: 'oral-draw-box', title: '결손치아', data1: 'n_4_tooth', data2: 'n_4', data3: 'n_4_up', data4: 'n_4_down' };
    this.form.n5 = { component: 'check-extend-box', title: '구내염 및 <br/>연조직 질환<span class="c_red d_inblock ml5">*</span>', data1: 'n_5', data2: 'n_5_disease' };
    this.form.n6 = { component: 'check-extend-box', title: '부정교합<span class="c_red d_inblock ml5">*</span>', data1: 'n_6', data2: 'n_6_check' };
    this.form.n7 = { component: 'check-extend-box', title: '치주질환<span class="c_red d_inblock ml5">*</span>', data1: 'n_7', data2: 'n_7_check' };
    this.form.n8 = { component: 'check-extend-box', title: '악관절 이상<span class="c_red d_inblock ml5">*</span>', data1: 'n_8' };
    this.form.n9 = { component: 'check-extend-box', title: '구강위생상태<span class="c_red d_inblock ml5">*</span>', data1: 'n_9' };
    this.form.n10 = { component: 'check-extend-box', title: '그 밖의 치아상태', data1: 'n_10', data2: 'n_10_etc' };
    this.form.n11 = {
      component: 'php-box',
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
      data10: 'n_11_simple',
      data11: 'n_11_reason',
    };
    this.form.n12 = { component: 'all-check-list-box', title: '구강보건교육<span class="c_red d_inblock ml5">*</span>', data1: 'n_12' };
    this.form.n13 = { component: 'checkbox-not-input', title: '예방진료<span class="c_red d_inblock ml5">*</span>', data1: 'n_13', data2: ['n_13_not1', 'n_13_not2'] };
    this.form.n13check = { component: 'checkbox-list', title: '필요시제공', data1: 'n_13_check' };
    this.form.n13tooth = { component: 'prevent-care-history', data1: 'n_13_tooth' };
    this.form.n15 = { component: 'check-extend-box', title: '치아상태<span class="c_red d_inblock ml5">*</span>', data1: 'n_15' };
    this.form.n16 = { component: 'check-extend-box', title: '구강위생상태<span class="c_red d_inblock ml5">*</span>', data1: 'n_16' };
    this.form.n17 = { component: 'long-check-and-box', title: '종합소견<span class="c_red d_inblock ml5">*</span>', data1: 'n_17', data2: this.districtCodeFirst === 'F' ? null : 'n_17_etc' };
    this.form.n18 = { component: 'long-check-and-box', title: '가정에서의 조치사항', data1: 'n_18', data2: this.districtCodeFirst === 'F' ? null : 'n_18_etc' };
    this.form.n19 = { component: 'check-extend-box', title: '양치습관<span class="c_red d_inblock ml5">*</span>', data1: 'n_19' };
    this.form.n20 = { component: 'checkbox-list', title: '재내원 계획', data1: 'n_20' };
    this.form.n22 = { component: 'long-check-and-box', title: '기타 진료 및<br/>보호자 안내사항', data1: 'n_22', data2: 'n_22_etc' };
    this.form.nend = { component: 'check-extend-box', title: '제공 항목', data1: 'n_end' };
    this.form.ndeepTreat = { component: 'check-extend-box', title: '심화치료 여부<span class="c_red d_inblock ml5">*</span>', data1: 'n_deep_treat' };
    this.form.nHealthyTooth = { component: 'check-extend-box', title: '건치 아동 추천<span class="c_red d_inblock ml5">*</span>', data1: 'n_healthy_tooth' };
    this.form.doctor = { data1: 'n_doctor', data2: 'n_doctor_name', data3: 'n_license', data4: 'n_date', data5: 'n_organ' };

    if ((['A', 'F', 'G'].includes(this.districtCodeFirst) && this.$route.query.businessDivision === 'E') || ['C', 'E', 'J'].includes(this.districtCodeFirst)) {
      // 서울시 or 밀양시 or 수원시 학생구강검진 / 경기 / 순천 / 울산
      this.DATA_SET({ n_2: '', n_3: '', n_4: '' }); // 형식이 바뀌어 value 설정 필요
      this.form.n1 = { component: 'oral-not-draw-box', title: '충전된 치아', first: 'n_1' };
      this.form.n2 = { component: 'oral-not-draw-box', title: '우식치아', first: 'n_2', second: 'n_2_up', third: 'n_2_down' };
      this.form.n3 = { component: 'oral-not-draw-box', title: '우식발생 위험치아', first: 'n_3', second: 'n_3_up', third: 'n_3_down' };
      this.form.n4 = { component: 'oral-not-draw-box', title: '결손치아', first: 'n_4', second: 'n_4_up', third: 'n_4_down' };
    }

    if (this.districtCodeFirst === 'A' && this.$route.query.businessDivision !== 'E') {
      // 서울 (학구 제외)
      this.form.n4.title = '결손치아 (영구치)';
      this.form.n4.data7 = 'n_4_reason';
      if (this.$route.query.businessDivision === 'C') {
        // 서울시 아동치과주치의
        this.form.n13.data2 = ['n_13_not2', 'n_13_not1'];
      }
      this.formBlock.block1.push({ id: 1, form: 'n1' }, { id: 2, form: 'n2' }, { id: 3, form: 'n3' }, { id: 4, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n7' }, { id: 4, form: 'n8' }, { id: 5, form: 'n10' });
    } else if ((['A', 'G'].includes(this.districtCodeFirst) && this.$route.query.businessDivision === 'E') || this.districtCodeFirst === 'J') {
      // 서울시 or 수원시 학생구강검진 / 울산
      this.form.n2.title = '충치';
      this.form.n3.title = '충치발생 위험치아';
      delete this.form.n5.data2;
      delete this.form.n6.data2;
      this.formBlock.block1.push({ id: 1, form: 'n2' }, { id: 2, form: 'n3' }, { id: 3, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n9' });
      if (this.districtCodeFirst === 'A' && this.$route.query.businessDivision === 'E') {
        // 서울시 학생구강검진
        this.formBlock.block2.push({ id: 4, form: 'n10' });
      } else if (this.districtCodeFirst === 'G' && this.$route.query.businessDivision === 'E') {
        // 수원시 학생구강검진
        this.formBlock.block2.push({ id: 4, form: 'n19' }, { id: 5, form: 'n10' });
      } else if (this.districtCodeFirst === 'J') {
        // 울산
        this.form.n13.data2 = ['n_13_not5', 'n_13_not2'];
        this.formBlock.block2.push({ id: 4, form: 'n10' });
      }
    } else if (this.districtCodeFirst === 'B' && this.$route.query.businessDivision.includes('F')) {
      // 인천시 학생치과주치의 (워딩만 아동치과주치의)
      this.form.n13.data2.push('n_13_not3');
      this.formBlock.block1.push({ id: 1, form: 'n1' }, { id: 2, form: 'n2' }, { id: 3, form: 'n3' }, { id: 4, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n9' }, { id: 4, form: 'n10' }, { id: 5, form: 'n7' }, { id: 6, form: 'n8' });
    } else if (this.districtCodeFirst === 'C') {
      // 경기도 (학생치과주치의, 학생구강검진 같음)
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
      this.formBlock.block1.push({ id: 1, form: 'n2' }, { id: 2, form: 'n3' }, { id: 3, form: 'n4' }, { id: 4, form: 'n1' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n9' }, { id: 4, form: 'n10' }, { id: 5, form: 'n8' });
    } else if (this.districtCodeFirst === 'D') {
      // 부산시 (아동치과주치의, 학생치과주치의 같음)
      this.form.n13.data2.push('n_13_not3');
      this.formBlock.block1.push({ id: 1, form: 'n1' }, { id: 2, form: 'n2' }, { id: 3, form: 'n3' }, { id: 4, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n7' }, { id: 4, form: 'n10' });
    } else if (this.districtCodeFirst === 'E' && this.$route.query.businessDivision.includes('F')) {
      // 순천시 학생치과주치의
      this.form.n2.second = 'n_2_u';
      this.form.n2.third = 'n_2_y';
      this.form.n3.second = 'n_3_u';
      this.form.n3.third = 'n_3_y';
      this.formBlock.block1.push({ id: 1, form: 'n2' }, { id: 2, form: 'n3' }, { id: 3, form: 'n4' }, { id: 4, form: 'n1' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n7' }, { id: 4, form: 'n10' }, { id: 5, form: 'n8' });
    } else if (this.districtCodeFirst === 'E' && this.$route.query.businessDivision === 'E') {
      // 순천시 학생구강검진
      delete this.form.n5.data2;
      delete this.form.n6.data2;
      this.formBlock.block1.push({ id: 1, form: 'n2' }, { id: 2, form: 'n3' }, { id: 3, form: 'n4' }, { id: 4, form: 'n1' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n9' }, { id: 4, form: 'n10' });
    } else if (this.districtCodeFirst === 'F' && this.$route.query.businessDivision.includes('F')) {
      // 밀양시 학생치과주치의
      this.form.n13.data2.splice(0, 0, 'n_13_not4');
      this.formBlock.block1.push({ id: 1, form: 'n1' }, { id: 2, form: 'n2' }, { id: 3, form: 'n3' }, { id: 4, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n7' }, { id: 4, form: 'n10' });
    } else if (this.districtCodeFirst === 'F' && this.$route.query.businessDivision === 'E') {
      // 밀양시 학생구강검진
      delete this.form.n5.data2;
      delete this.form.n6.data2;
      this.formBlock.block1.push({ id: 1, form: 'n1' }, { id: 2, form: 'n2' }, { id: 3, form: 'n3' }, { id: 4, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n9' }, { id: 4, form: 'n10' });
    } else if (this.districtCodeFirst === 'H' && this.$route.query.businessDivision.includes('F')) {
      // 여수시 학생치과주치의
      this.DATA_SET({ n_2: '', n_3: '' }); // 형식이 바뀌어 value 설정 필요
      this.form.n2 = { component: 'oral-not-draw-box', title: '우식치아', first: 'n_2', second: 'n_2_up', third: 'n_2_down' };
      this.form.n3 = { component: 'oral-not-draw-box', title: '우식발생 위험치아', first: 'n_3', second: 'n_3_up', third: 'n_3_down' };
      this.form.n17.title = '종합소견';
      delete this.form.n6.data2;
      delete this.form.n17.data1;
      this.form.n2.second = 'n_2_u';
      this.form.n2.third = 'n_2_y';
      this.form.n3.second = 'n_3_u';
      this.form.n3.third = 'n_3_y';
      this.formBlock.block1.push({ id: 1, form: 'n1' }, { id: 2, form: 'n2' }, { id: 3, form: 'n3' }, { id: 4, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n7' }, { id: 4, form: 'n8' }, { id: 5, form: 'n10' });
    }

    if (this.$route.query.businessDivision === 'E') {
      // 학생구강검진
      this.formBlock.block5.push({ id: 1, form: 'n17' }, { id: 2, form: 'n18' });
      if (this.districtCodeFirst === 'A') {
        // 서울시
        this.DATA_SET({ n_healthy_tooth: 0 }); // 기본값 : 아니오
        this.formBlock.block5.push({ id: 13, form: 'nHealthyTooth' });
      }
    } else {
      if (this.districtCodeFirst === 'I') {
        // 전북
        this.form.n12 = { component: 'checkbox-list', title: '구강보건교육', data1: 'n_12' };
        this.form.n13check = { component: 'checkbox-list', title: '예방진료', data1: 'n_13_check' };
        this.form.n13check2 = { component: 'checkbox-list', title: '치아우식 초기진료', data1: 'n_13_check', data1Options2: true };
        this.formBlock.block3.push(
          { id: 1, form: 'n13check', class: 'mt30 scommp c_gray2' },
          { id: 2, form: 'n13check2', class: 'mt30 scommp c_gray2' },
          { id: 3, form: 'n12', class: 'mt5 c_red scommp' },
          { id: 4, form: 'n22' },
        );
      } else {
        // 학생치과주치의, 아동치과주치의 (전북 제외)
        this.formBlock.block3.push(
          {
            id: 1,
            form: 'n12',
            class: 'mt5 c_red scommp',
            description: `* 아래 항목은 ‘${this.divName(this.$route.query.businessDivision, false)}사업’에 의해 무료로 제공되며, 시행된 항목에 체크하여 주세요.`,
          },
          { id: 2, form: 'n13', class: 'mt30 scommp c_gray2', description: '* 필수 항목을 시행하지 않은 경우는 미진료 사유 기재란에 기재하여 주세요.' },
        );
        if (this.districtCodeFirst !== 'J') {
          // 울산 제외
          this.formBlock.block3.push({
            id: 3,
            form: 'n13check',
            class: 'mt30 scommp c_gray2',
            description: '* 아래 항목은 치과의사의 판단에 따라 선택적으로 시행되며, 시행된 항목에 체크하여 주세요.',
          });
        }
      }
      this.formBlock.block4.push({ id: 1, form: 'n13tooth' });

      if (this.districtCodeFirst === 'H' && this.$route.query.businessDivision.includes('F')) {
        // 여수시 학생치과주치의
        this.formBlock.block5.push({ id: 1, form: 'n16' }, { id: 2, form: 'n17' });
      } else if (this.districtCodeFirst === 'J') {
        // 울산
        this.formBlock.block5.push({ id: 1, form: 'n17' }, { id: 2, form: 'n18' });
      } else if (this.districtCodeFirst !== 'I') {
        // 학생치과주치의, 아동치과주치의 (여수시, 전북 학생치과주치의 제외)
        this.formBlock.block5.push({ id: 1, form: 'n15' }, { id: 2, form: 'n16' });
      }
      if (this.districtCodeFirst === 'A' && this.$route.query.businessDivision.includes('F')) {
        // 서울시 학생치과주치의
        this.DATA_SET({ n_healthy_tooth: 0 }); // 기본값 : 아니오
        this.formBlock.block5.push({ id: 13, form: 'nHealthyTooth' });
      }
    }

    if (['D', 'E'].includes(this.districtCodeFirst)) {
      // 부산시, 순천시
      this.formBlock.block5.push({ id: 3, form: 'n20' });
    }
    if (this.districtCodeFirst === 'D' && this.$route.query.businessDivision === 'C') {
      // 부산시 아동치과주치의
      this.formBlock.block5.push({ id: 4, form: 'ndeepTreat' });
    }

    let infoForm = {
      hospitalId: this.userOrganTargetId,
      studentId: this.$route.query.studentId,
      businessDivision: this.valueToCode('C0003', this.$route.query.businessDivision),
      notificationYear: this.$route.query.notificationYear,
    };
    Hospital.notificationInfo(infoForm).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
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
        if (this.districtCodeFirst === 'C') {
          if ((!res.data.hospitalDocumentInfo.fileA || !res.data.hospitalDocumentInfo.fileB) && this.districtCode.substr(0, 3) !== res.data.studentInfo.districtCode.substr(0, 3)) {
            this.isAddFile = true;
          }
        }
        this.$store.commit('student/DATA_SET', res.data.studentInfo);
        if (res.data.notificationInfo) {
          this.$store.commit('doc/DATA_SET', res.data.notificationInfo.form);
          this.treatStatus = res.data.notificationInfo.treatStatus;
          this.latestTreatStatus = res.data.notificationInfo.treatStatus;
          if (
            this.districtCodeFirst === 'A' &&
            (res.data.notificationInfo.hospitalId !== this.userOrganTargetId || res.data.notificationInfo.status !== 'N') &&
            (res.data.notificationList.length || res.data.latestNotStatus !== 'N')
          ) {
            this.addRegist = true;
            this.latestTreatStatus = null;
            this.notNum = 2;
            if (res.data.notificationList) {
              this.notificationList = res.data.notificationList;
              if (this.notificationList.length) {
                this.notNum = this.notificationList[this.notificationList.length - 1].notificationSequence + 1;
              }
            }
            if (res.data.latestNotStatus === 'N') {
              this.ADDREGIST_SET(res.data.notificationList[res.data.notificationList.length - 1].form);
              this.notificationId = res.data.notificationList[res.data.notificationList.length - 1].notificationId;
              this.latestTreatStatus = res.data.notificationList[res.data.notificationList.length - 1].treatStatus;
              if (this.notificationList.length) {
                this.notificationList.splice(this.notificationList.length - 1, 1);
                this.notNum--;
              }
            }
          }
        }
        // 인천시 PHP 미실시의 경우 해제 처리
        if (this.districtCodeFirst === 'B') {
          this.formContents.notification.n_11.options[1].value = 2;
          this.formContents.notification.n_11.options[1].label = '간이 구강위생지수';
        }
        this.$store.commit('update2');
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET', 'ADDREGIST_SET']),
    isNumber(e) {
      const charCode = e.which;
      if (charCode < 48 || charCode > 57) {
        e.preventDefault();
      } else {
        return true;
      }
    },
    addTreatment() {
      this.$store.dispatch('popup/popupOpen', { contents: 'addTreatment' });
    },
    formData(status) {
      if (this.districtCodeFirst === 'A' && this.$route.query.businessDivision === 'C') {
        // 서울시 아동치과주치의
        if (this.addRegist) {
          if (this.formContents.notificationAddRegist.examPrice.value === '') {
            this.ADDREGIST_SET({ examPrice: 0 }); // 검진비 빈값인 경우 0원처리
          } else {
            this.ADDREGIST_SET({ examPrice: parseInt(this.formContents.notificationAddRegist.examPrice.value) });
          }
        } else {
          if (this.formContents.notification.examPrice.value === '') {
            this.DATA_SET({ examPrice: 0 }); // 검진비 빈값인 경우 0원처리
          } else {
            this.DATA_SET({ examPrice: parseInt(this.formContents.notification.examPrice.value) });
          }
        }
      } else if (this.districtCodeFirst === 'D' && this.$route.query.businessDivision === 'C') {
        // 부산시 아동치과주치의
        this.DATA_SET({ examPrice: this.defaultExamPrice(this.$route.query.businessDivision, this.month) }); // 검진비
      } else if (this.districtCodeFirst !== 'I' && this.$route.query.businessDivision.includes('F')) {
        // 학생치과주치의 (전북 제외)
        if (['H', 'T'].includes(this.hospitalType) && !(this.districtCodeFirst === 'C' && this.studentInfo.schoolType.value === 'D')) {
          // 보건소치과이거나 이동진료팀 병원의 경우 (경기도 특수학교 제외)
          this.DATA_SET({ examPrice: 0 }); // 검진비 0원
        } else {
          this.DATA_SET({ examPrice: this.defaultExamPrice(this.$route.query.businessDivision, this.month) }); // 검진비
        }
      } else if (this.$route.query.businessDivision === 'E') {
        if (this.hospitalType === 'T' && !(this.districtCodeFirst === 'C' && this.studentInfo.schoolType.value === 'D')) {
          // 이동진료팀 병원의 경우 (경기도 특수학교 제외)
          this.DATA_SET({ examPrice: 0 }); // 검진비 0원
        } else {
          this.DATA_SET({ examPrice: this.defaultExamPrice(this.$route.query.businessDivision, this.month) }); // 검진비
        }
      } else if (this.formContents.notification.examPrice.value === '') {
        this.DATA_SET({ examPrice: 0 }); // 검진비 빈값인 경우 0원처리
      }
      if (this.addRegist) {
        let formData = {};
        for (const i in this.formContents.notificationAddRegist) {
          formData[i] = this.formContents.notificationAddRegist[i].value;
        }
        const form = {
          hospitalId: this.userOrganTargetId,
          studentId: this.$route.query.studentId,
          notificationId: this.notificationId, // 존재하면 UPDATE
          status: this.valueToCode('C0001', status),
          billRegist: status === 'Y' ? this.billRegist : false,
          form: formData,
        };
        return form;
      } else {
        let formData = {};
        for (const i in this.formContents.notification) {
          formData[i] = this.formContents.notification[i].value;
        }
        const form = {
          districtCode: this.districtCodeFirst,
          hospitalId: this.userOrganTargetId,
          studentId: this.$route.query.studentId,
          businessDivision: this.valueToCode('C0003', this.$route.query.businessDivision),
          status: this.valueToCode('C0001', status),
          billRegist: status === 'Y' ? (this.$route.query.businessDivision !== 'C' ? true : this.billRegist) : false,
          form: formData,
        };
        return form;
      }
    },
    registThen(res, status) {
      this.$store.commit('loading', false);
      if (!res) {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
        return;
      }
      if (res.data.rt === 200) {
        let html = `${this.codeToValue(status) === 'Y' ? '최종 제출' : '임시 저장'} 되었습니다.`;
        if (this.codeToValue(status) === 'Y' && this.districtCodeFirst === 'A') {
          if (this.$route.query.businessDivision === 'F' && (this.isDev || new Date() > new Date('2024-07-29 23:59:59'))) {
            html = '<div class="tal d_inblock2">보건소 사업비 청구가 완료되었습니다.<br> 건강보험공단 청구를 진행해 주세요.<br><br>- 서울시(관할 보건소): 4,500원<br>- 건강보험공단: 40,500원</div>';
          } else {
            html += `<br/>최종 제출 후 수정이 필요한 경우 ${this.$route.query.businessDivision === 'E' ? '계약된 학교' : '관할 보건소'}로 문의 부탁드립니다.`;
          }
        }
        this.$alert('', '알림', 'success', { html }).then(() => {
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
            // const form = this.formData('N');

            // if (this.addRegist) {
            //   Hospital.notificationAddRegist(form).then(res => this.registThen(res, form.status));
            // } else {
            //   Hospital.notificationRegist(form).then(res => this.registThen(res, form.status));
            // }
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
        if (this.districtCodeFirst === 'A' && this.$route.query.businessDivision === 'C') {
          // 서울시 아동치과주치의
          validList = [
            'n_1',
            'n_1_u',
            'n_4_reason',
            'n_5',
            'n_5_disease',
            'n_6',
            'n_6_check',
            'n_7',
            'n_7_check',
            'n_8',
            'n_11',
            'n_11_reason',
            'n_12',
            'n_13',
            'n_13_not1',
            'n_13_not2',
            'n_13_2_radio',
            'n_13_4_check',
            'n_15',
            'n_16',
          ];
        } else if (this.districtCodeFirst === 'A' && this.$route.query.businessDivision.includes('F')) {
          // 서울시 학생치과주치의
          validList = [
            'n_1',
            'n_1_u',
            'n_4_reason',
            'n_5',
            'n_5_disease',
            'n_6',
            'n_6_check',
            'n_7',
            'n_7_check',
            'n_8',
            'n_11',
            'n_11_reason',
            'n_12',
            'n_13_not1',
            'n_13_not2',
            'n_13_2_radio',
            'n_13_4_check',
            'n_15',
            'n_16',
          ];
        } else if (this.districtCodeFirst === 'D') {
          // 부산시
          validList = ['n_1', 'n_1_u', 'n_5', 'n_5_disease', 'n_6', 'n_6_check', 'n_7', 'n_7_check', 'n_11', 'n_11_not', 'n_12', 'n_13_not1', 'n_13_not2', 'n_13_not3', 'n_15', 'n_16'];
          if (this.$route.query.businessDivision === 'C') {
            // 부산시 아동치과주치의
            validList.push('n_deep_treat');
          }
        } else if (this.districtCodeFirst === 'A' && this.$route.query.businessDivision === 'E') {
          // 서울시 학생구강검진
          validList = ['n_2', 'n_2_up', 'n_3', 'n_3_up', 'n_4', 'n_4_up', 'n_5', 'n_6', 'n_9', 'n_17', 'n_17_etc', 'n_18_etc'];
        } else if (this.districtCodeFirst === 'G' && this.$route.query.businessDivision === 'E') {
          // 수원시 학생구강검진
          validList = ['n_2', 'n_2_up', 'n_3', 'n_3_up', 'n_4', 'n_4_up', 'n_5', 'n_6', 'n_9', 'n_19', 'n_17', 'n_17_etc', 'n_18_etc'];
        } else if (this.districtCodeFirst === 'B' && this.$route.query.businessDivision.includes('F')) {
          // 인천시 학생치과주치의 (워딩만 아동치과주치의)
          validList = [
            'n_1',
            'n_1_u',
            'n_5',
            'n_5_disease',
            'n_6',
            'n_6_check',
            'n_9',
            'n_7',
            'n_7_check',
            'n_8',
            'n_11',
            'n_11_simple',
            'n_12',
            'n_13_not1',
            'n_13_not2',
            'n_13_not3',
            'n_15',
            'n_16',
          ];
        } else if (this.districtCodeFirst === 'C' && this.$route.query.businessDivision.includes('F')) {
          // 경기도 학생치과주치의
          validList = ['n_2', 'n_2_u_up', 'n_3', 'n_3_u_up', 'n_4', 'n_4_up', 'n_1', 'n_5', 'n_6', 'n_9', 'n_8', 'n_11', 'n_11_not', 'n_12', 'n_13_not1', 'n_13_not2', 'n_15', 'n_16'];
        } else if (this.districtCodeFirst === 'C' && this.$route.query.businessDivision === 'E') {
          // 경기도 학생구강검진
          validList = ['n_2', 'n_2_u_up', 'n_3', 'n_3_u_up', 'n_4', 'n_4_up', 'n_1', 'n_5', 'n_6', 'n_9', 'n_8', 'n_17', 'n_17_etc', 'n_18_etc'];
        } else if (this.districtCodeFirst === 'E' && this.$route.query.businessDivision.includes('F')) {
          // 순천시 학생치과주치의
          validList = [
            'n_2',
            'n_2_u',
            'n_3',
            'n_3_u',
            'n_4',
            'n_4_up',
            'n_1',
            'n_5',
            'n_5_disease',
            'n_6',
            'n_6_check',
            'n_7',
            'n_7_check',
            'n_8',
            'n_11',
            'n_11_not',
            'n_12',
            'n_13_not1',
            'n_13_not2',
            'n_15',
            'n_16',
          ];
        } else if (this.districtCodeFirst === 'E' && this.$route.query.businessDivision === 'E') {
          // 순천시 학생구강검진
          validList = ['n_2', 'n_2_up', 'n_3', 'n_3_up', 'n_4', 'n_4_up', 'n_1', 'n_5', 'n_6', 'n_9', 'n_17', 'n_17_etc', 'n_18_etc'];
        } else if (this.districtCodeFirst === 'F' && this.$route.query.businessDivision.includes('F')) {
          // 밀양시 학생치과주치의
          validList = ['n_1', 'n_1_u', 'n_5', 'n_5_disease', 'n_6', 'n_6_check', 'n_7', 'n_7_check', 'n_12', 'n_13_not4', 'n_13_not1', 'n_13_not2', 'n_15', 'n_16'];
        } else if (this.districtCodeFirst === 'F' && this.$route.query.businessDivision === 'E') {
          // 밀양시 학생구강검진
          validList = ['n_1', 'n_2', 'n_2_up', 'n_3', 'n_3_up', 'n_4', 'n_4_up', 'n_5', 'n_6', 'n_9', 'n_17', 'n_17_etc', 'n_18_etc'];
        } else if (this.districtCodeFirst === 'H' && this.$route.query.businessDivision.includes('F')) {
          // 여수시 학생치과주치의
          validList = ['n_1', 'n_1_u', 'n_2', 'n_2_u', 'n_3', 'n_3_u', 'n_5', 'n_5_disease', 'n_6', 'n_7', 'n_7_check', 'n_8', 'n_11', 'n_11_not', 'n_12', 'n_13_not1', 'n_13_not2', 'n_16'];
        } else if (this.districtCodeFirst === 'I') {
          // 전북
          validList = ['n_22_etc'];
        } else if (this.districtCodeFirst === 'J' && this.$route.query.businessDivision.includes('F')) {
          // 울산 학생치과주치의
          validList = ['n_2', 'n_2_up', 'n_3', 'n_3_up', 'n_4', 'n_4_up', 'n_5', 'n_6', 'n_9', 'n_11', 'n_11_reason', 'n_12', 'n_13_not5', 'n_13_not2', 'n_17', 'n_17_etc', 'n_18_etc'];
        } else if (this.districtCodeFirst === 'J' && this.$route.query.businessDivision === 'E') {
          // 울산 학생구강검진
          validList = ['n_2', 'n_2_up', 'n_3', 'n_3_up', 'n_4', 'n_4_up', 'n_5', 'n_6', 'n_9', 'n_17', 'n_17_etc', 'n_18_etc'];
        }

        let validTitle = '';
        for (const i of validList) {
          const parent = this.formContents.notification[i].parent;
          switch (i) {
            case 'n_1':
            case 'n_2':
            case 'n_3':
            case 'n_4':
              if (contents[i] === '') {
                validTitle = this.form[i.replace('_', '')].title;
              }
              break;
            case 'n_1_u':
            case 'n_2_u':
            case 'n_3_u':
              if (contents[parent] == 1 && contents[i] + contents[`${parent}_y`] === 0) {
                validTitle = '충전된 치아 - 치아 갯수';
              }
              break;
            case 'n_2_up':
            case 'n_3_up':
            case 'n_4_up':
              if (contents[parent] == 1 && contents[i] + contents[`${parent}_down`] === 0) {
                validTitle = `${this.form[parent.replace('_', '')].title} - 치아 갯수`;
              }
              break;
            case 'n_2_u_up':
            case 'n_3_u_up':
              if (contents[parent] == 1 && contents[i] + contents[`${parent}_down`] + contents[`${parent}_y_up`] + contents[`${parent}_y_down`] === 0) {
                validTitle = `${this.form[parent.replace('_', '')].title} - 치아 갯수`;
              }
              break;
            case 'n_5':
            case 'n_6':
            case 'n_7':
            case 'n_8':
            case 'n_9':
            case 'n_11':
            case 'n_15':
            case 'n_16':
            case 'n_19':
            case 'n_deep_treat':
              if (contents[i] === '') {
                validTitle = this.formContents.notification[i].label;
              }
              break;
            case 'n_4_reason':
            case 'n_5_disease':
              if (contents[parent] == 1 && contents[i] === '') {
                validTitle = this.formContents.notification[i].label;
              }
              break;
            case 'n_6_check':
            case 'n_7_check':
              if (contents[parent] == 1 && !contents[i].length) {
                validTitle = this.formContents.notification[i].label;
              }
              break;
            case 'n_11_not':
              if (contents[parent] == 0 && !contents[i].length) {
                validTitle = this.formContents.notification[i].label;
              }
              break;
            case 'n_11_reason':
              if (contents[parent] == 0 && contents[i] === '') {
                validTitle = this.formContents.notification[i].label;
              }
              break;
            case 'n_11_simple':
              if (contents[parent] == 2) {
                if (contents[i] === '') {
                  validTitle = `${this.formContents.notification[i].label} - 총점`;
                } else if (!(contents[i] >= 0 && contents[i] <= 18)) {
                  this.$alert('', '알림', 'warning', { html: `<strong>${this.formContents.notification[i].label} - 총점</strong> : 잘못된 입력값입니다.` });
                  return false;
                }
              }
              break;
            case 'n_12':
              if (contents[i].length !== this.formContents.notification[i].options.length) {
                validTitle = `${this.formContents.notification[i].label} - 모든 항목`;
              }
              break;
            case 'n_13_not1':
              if (contents[parent].indexOf(1) === -1 && contents[parent].indexOf('1') === -1 && contents[i] === '') {
                validTitle = `${this.formContents.notification[parent].label} - ${this.formContents.notification[parent].options.find(o => o.value === 1).label}`;
              }
              break;
            case 'n_13_not2':
              if (contents[parent].indexOf(2) === -1 && contents[parent].indexOf('2') === -1 && contents[i] === '') {
                validTitle = `${this.formContents.notification[parent].label} - ${this.formContents.notification[parent].options.find(o => o.value === 2).label}`;
              }
              break;
            case 'n_13_not3':
              if (contents[parent].indexOf(3) === -1 && contents[parent].indexOf('3') === -1 && contents[i] === '') {
                validTitle = `${this.formContents.notification[parent].label} - ${this.formContents.notification[parent].options.find(o => o.value === 3).label}`;
              }
              break;
            case 'n_13_not4':
              if (contents[parent].indexOf(4) === -1 && contents[parent].indexOf('4') === -1 && contents[i] === '') {
                validTitle = `${this.formContents.notification[parent].label} - ${this.formContents.notification[parent].options.find(o => o.value === 4).label}`;
              }
              break;
            case 'n_13_not5':
              if (contents[parent].indexOf(5) === -1 && contents[parent].indexOf('5') === -1 && contents[i] === '') {
                validTitle = `${this.formContents.notification[parent].label} - ${this.formContents.notification[parent].options.find(o => o.value === 5).label}`;
              }
              break;
            case 'n_13_2_radio':
              if ((contents[parent].indexOf(2) !== -1 || contents[parent].indexOf('2') !== -1) && contents[i] === '') {
                validTitle = `${this.formContents.notification[parent].label} - ${this.formContents.notification[parent].options.find(o => o.value === 2).label} - 항목`;
              }
              break;
            case 'n_13_4_check':
              if ((contents[parent].indexOf(4) !== -1 || contents[parent].indexOf('4') !== -1) && !contents[i].length) {
                validTitle = `${this.formContents.notification[parent].label} - ${this.formContents.notification[parent].options.find(o => o.value === 4).label} - 항목`;
              }
              break;
            case 'n_17':
              if (!contents[i].length) {
                validTitle = this.formContents.notification[i].label;
              }
              break;
            case 'n_17_etc':
            case 'n_18_etc':
            case 'n_22_etc':
              if ((contents[parent].indexOf(8) !== -1 || contents[parent].indexOf('8') !== -1) && contents[i] === '') {
                validTitle = `${this.formContents.notification[parent].label} - ${this.formContents.notification[parent].options.find(o => o.value === 8).label}`;
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
                form.billRegist = true;
              }
            }
          } else if (this.districtCodeFirst === 'I') {
            if (this.formContents.notification.examPrice.value > this.defaultExamPrice(this.$route.query.businessDivision, this.month)) {
              this.$alert('진료비는 최대 4만원까지 작성할 수 있습니다.', '알림', 'warning');
              return false;
            }
          }
        }
        let submitHtml = '최종제출 하시겠습니까?<br/>최종제출 시 수정이 불가능합니다.';
        if (this.districtCodeFirst === 'I') {
          submitHtml = `${this.studentInfo.studentName.value} 학생의 진료가 끝나셨나요?<br/>추가 진료가 필요한 경우에는 '임시 저장'을 클릭하시고,<br/>비용 청구를 원할 경우에만 아래 'OK' 버튼을 눌러 주세요.<br/>최종 제출 시 수정이 불가합니다.`;
        }
        this.$confirm('', '알림', 'question', { html: submitHtml })
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
                  if (res && res.data.rt === 200) {
                    // this.$store.dispatch('popup/popupOpen', {
                    //   contents: 'viewNotification',
                    //   params: { studentId: this.$route.query.studentId, businessDivision: this.$route.query.businessDivision, pdf: true, notificationYear: this.$route.query.notificationYear },
                    // }); // pdf 저장
                    Hospital.notificationRegist(form).then(res => this.registThen(res, form.status));
                  } else {
                    this.$store.commit('loading', false);
                    alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
                  }
                });
              } else {
                // this.$store.dispatch('popup/popupOpen', {
                //   contents: 'viewNotification',
                //   params: { studentId: this.$route.query.studentId, businessDivision: this.$route.query.businessDivision, pdf: true, notificationYear: this.$route.query.notificationYear },
                // }); // pdf 저장
                Hospital.notificationRegist(form).then(res => this.registThen(res, form.status));
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
  watch: {
    pdfStatus() {
      if (this.pdfStatus) {
        const form = this.formData('Y');
        Hospital.notificationRegist(form).then(res => {
          this.$store.commit('loading', false);
          if (!res) {
            this.$store.commit('doc/pdfStatusSet', false);
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.');
            return;
          }
          if (res && res.data.rt === 200) {
            this.$alert(`최종제출되었습니다.`, '알림', 'success').then(() => {
              this.$router.go(-1);
            });
          } else if (res.data.rt === 400) {
            this.$store.commit('doc/pdfStatusSet', false);
            this.$alert(res.data.rtMsg?.split(':').pop(), '알림', 'error');
          } else {
            this.$store.commit('doc/pdfStatusSet', false);
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        });
      }
    },
  },
};
</script>
