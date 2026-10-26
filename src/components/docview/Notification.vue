<template>
  <div class="popup_content">
    <v-popuptitle divclass="bg__form_ver" :message="districtCodeFirst === 'I' ? '구강진료 결과통보서' : '통보서'" imgsrc="sub/ic_write.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver">
      <div class="row">
        <div class="inner--right">
          <a href="javascript:;" class="comm__green_bd_btn d_inblock fwn commp2 bg_white btn_l_size wid120" @click="htmlToPDF">
            <img src="@/assets/images/sub/ic_download_20.png" />
            다운로드
          </a>
          <a href="javascript:;" class="comm__blue_bd_btn d_inblock fwn commp2 bg_white btn_l_size ml10 wid120" @click="htmlToPdfPrint">
            <img src="@/assets/images/sub/ic_print_20.png" />
            인쇄
          </a>
        </div>
      </div>

      <div class="bg_white mt20 pb20">
        <div class="pdf_page_wrap" ref="pdfArea" :key="pdfRefreshKey">
          <notification-gyeonggi v-if="districtCodeFirst === 'C'" :data-object="dataObject" />
          <template v-else>
            <div class="lcommp tac fwb">{{ title }}</div>
            <std-info-box :businessDivision="dataObject.businessDivision" />
            <div v-if="districtCodeFirst === 'A' && dataObject.businessDivision === 'C'">
              <p class="commp2 fwb mt20">진료 계획 작성 원칙</p>
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
              <p class="commp2 fwb mt30">구강검사 결과 및 판정</p>
              <p
                v-if="!((['A', 'F', 'G'].includes(districtCodeFirst) && dataObject.businessDivision === 'E') || districtCodeFirst === 'C' || districtCodeFirst === 'E' || districtCodeFirst === 'J')"
                class="scommp mt5"
              >
                * (치아번호 한 번 클릭시) 파란색은 영구치, (치아번호 두 번 클릭시) 빨간색은 유치를 의미합니다.
              </p>
            </template>
            <p v-else class="commp2 fwb mt30" style="margin-bottom: -20px">치면세균막검사</p>
            <div v-for="(block, index) in formBlock.block1" :key="`${block.id}_${block.form}`" :class="{ mt15: index === 0, mt10: index > 0 }">
              <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
            </div>

            <div v-for="(block, index) in formBlock.block2" :key="`${block.id}_${block.form}`" class="" :class="{ mt15: index === 0, mt10: index > 0 }">
              <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
            </div>

            <php-box v-if="phpBoxView" :data-array="form.n11" :view="true" :pdf="true" />

            <div v-for="(block, index) in formBlock.block3" :key="`${block.id}_${block.form}`" class="pdfBlock" :class="{ mt20: index === 0 }">
              <p v-if="index === 0" class="commp2 fwb">{{ districtCodeFirst === 'I' ? '구강' : '예방' }}진료 및 교육</p>
              <p v-if="block.description" :class="block.class">{{ block.description }}</p>
              <div v-if="['A', 'C'].indexOf(districtCodeFirst) !== -1 && block.form === 'n12'" class="mt10">
                <div class="form_wrap_all_check_list_box">
                  <div><p class="commp c_black tal">온라인교육</p></div>
                  <div>
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
              </div>
              <div class="mt10">
                <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
              </div>
            </div>

            <div v-if="formBlock.block4.length" class="mt20">
              <p class="commp2 fwb">{{ districtCodeFirst === 'I' ? '구강' : '예방' }}진료내역</p>
              <div v-for="block in formBlock.block4" :key="`${block.id}_${block.form}`" class="comm__form">
                <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
              </div>
            </div>

            <p v-if="formBlock.block5.length" class="fwb commp2 mt20">종합소견</p>
            <div v-for="(block, index) in formBlock.block5" :key="`${block.id}_${block.form}`" :class="{ mt20: index === 0, mt10: index > 0 }">
              <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
            </div>
            <div class="mt20">
              <doctor-info :data-array="form.doctor" :subject="examTitle" />
              <div v-if="notificationSubData.treatStatus === 'N'" class="row flex_set">
                <div class="flex_item wid100">
                  <p class="fwb commp2 mt20">{{ examTitle }}비</p>
                  <div class="m__putbox mt20 wid250">
                    <div class="input_box_view">
                      {{ formContents.notification.examPrice.value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div v-for="item in notificationList" :key="item.notificationId" class="bg_white mt20 pb20">
        <div class="pdf_page_wrap">
          <div class="sub__section">
            <p class="commp2 fwb">{{ item.notificationSequence }}차 통보서</p>
            <div class="textbox mt20">
              <div class="textarea_box" style="height: 160px" v-html="item.form.n_content.replace(/(\n)/g, '<br>')"></div>
            </div>
            <div class="row flex_set mt20">
              <div class="flex_item">
                <p class="fwb commp2">판정 치과의사</p>
                <p class="scommp c_gray2 fwn mt10">치과의사명</p>
                <!-- pdf 적용 위해 style 태그 필요 -->
                <div class="m__putbox mt10 wid170">
                  <div class="input_box_view">{{ item.form.n_doctor_name }}</div>
                </div>
              </div>
              <div class="flex_item ml20">
                <p class="scommp c_gray2 fwn">면허번호</p>
                <div class="m__putbox mt10 wid170">
                  <div class="input_box_view">{{ item.form.n_license }}</div>
                </div>
              </div>
              <div class="flex_item ml40">
                <p class="fwb commp2">검진일 및 검진기관</p>
                <p class="scommp c_gray2 fwn mt10">검진일</p>
                <div class="m__putbox mt10 wid170">
                  <div class="input_box_view">{{ item.form.n_date }}</div>
                </div>
              </div>
              <div class="flex_item ml20">
                <p class="scommp c_gray2 fwn">검진기관명</p>
                <div class="m__putbox mt10 wid170">
                  <div class="input_box_view">{{ item.form.n_organ }}</div>
                </div>
              </div>
            </div>
            <p v-if="item.treatStatus === 'N'" class="fwb commp2 mt20">검진비</p>
            <div v-if="item.treatStatus === 'N'" class="m__putbox mt20 wid250">
              <div class="input_box_view">
                {{ item.form.examPrice }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="districtCodeFirst === 'C' && ['CT', 'HC'].includes(userOrganTargetType) && ['N', 'RN'].includes(billData.billStatus)" id="btn_wrap" class="row mt20 inner--right">
        <a href="javascript:;" class="comm__blue_btn d_block btn_l_size commp2 fwn wid130" @click="billProcess('Y')">지급</a>
        <a href="javascript:;" class="comm__red_btn d_block btn_l_size commp2 fwn wid130 ml10" @click="billProcess('R')">반려</a>
      </div>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import DoctorInfo from '@/components/docview/doctorInfo';
import StdInfoBox from '@/components/docview/stdInfoBox.vue';
import oralNotDrawBox from '@/components/doc/oralNotDrawBox';
import oralDrawBox from '@/components/doc/oralDrawBox';
import checkExtendBox from '@/components/doc/checkExtendBox';
import allCheckListBox from '@/components/doc/allCheckListBox';
import phpBox from '@/components/doc/phpBox';
import checkboxList from '@/components/doc/checkboxList';
import CheckboxNotInput from '@/components/doc/checkboxNotInput';
import LongCheckAndBox from '@/components/doc/longCheckAndBox';
import preventCareHistory from '@/components/doc/preventCareHistory';
import notificationGyeonggi from '@/components/docview/gyeonggi/NotificationGyeonggi';
import { mapActions, mapGetters, mapState } from 'vuex';

import jsPDF from 'jspdf';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'doctor-info': DoctorInfo,
    'std-info-box': StdInfoBox,
    'oral-not-draw-box': oralNotDrawBox,
    'oral-draw-box': oralDrawBox,
    'check-extend-box': checkExtendBox,
    'all-check-list-box': allCheckListBox,
    'php-box': phpBox,
    'checkbox-list': checkboxList,
    'checkbox-not-input': CheckboxNotInput,
    'long-check-and-box': LongCheckAndBox,
    'prevent-care-history': preventCareHistory,
    'notification-gyeonggi': notificationGyeonggi,
  },
  props: ['dataObject'],
  data() {
    return {
      title: '',
      form: [],
      formBlock: {
        block1: [],
        block2: [],
        block3: [],
        block4: [],
        block5: [],
      },
      billData: {},
      notificationList: [],
      renderedImg: [],
      pdfRefreshKey: 0,
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetType']),
    ...mapState('doc', ['formContents', 'notificationSubData']),
    ...mapState('student', ['studentInfo']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName', 'examTitle']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
    phpBoxView() {
      if (this.districtCodeFirst === 'F') return false; // 밀양시 X
      // 아치 or 학치
      return this.dataObject.businessDivision === 'C' || this.dataObject.businessDivision.includes('F');
    },
  },
  methods: {
    ...mapActions('popup', ['popupClose']),
    billProcess(status) {
      this.billData.status = status;
      this.$store.dispatch('popup/popupOpen', { contents: 'billProcessPopup', params: this.billData });
    },
    getFileName() {
      const date = new Date();
      const now =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);

      const divName = this.divName(this.dataObject.businessDivision, false);
      const hospitalName = this.studentInfo.hospitalName.value ? `${this.studentInfo.hospitalName.value}_` : '';
      return `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.studentInfo.healthCareName.value}_${divName}_${hospitalName}통보서_${this.studentInfo.studentName.value}_${now}`;
    },
    htmlToPDF() {
      const name = this.getFileName();
      this.$htmlToPdf(this.$refs.pdfArea, name);
      this.pdfRefreshKey += 1;
    },
    htmlToPdfPrint() {
      this.$htmlToPdfPrint(this.$refs.pdfArea);
      this.pdfRefreshKey += 1;
    },
    htmlToPdfDownload() {
      const pdf = this.$htmlToPdfDownload(this.$refs.pdfArea);
      this.pdfRefreshKey += 1;
      return pdf;
    },
    notificationInfo() {
      let form = {
        hospitalId: this.dataObject.hospitalId || 0,
        studentId: this.dataObject.studentId,
        businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
        notificationId: this.dataObject.notificationId,
        notificationYear: this.dataObject.notificationYear,
      };
      Hospital.notificationInfo(form).then(res => {
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
          res.data.basicEduDate = this.codeToValue(res.data.basicEduDate);
          if (res.data.firstBillInfo) {
            res.data.firstBillInfo.billStatus = this.codeToValue(res.data.firstBillInfo.billStatus);
          }
          // code convert end
          this.$store.commit('student/DATA_SET', res.data.studentInfo);
          this.$store.commit('update2');
          this.$store.commit('doc/notificationSubDataSet', { basicEduDate: res.data.basicEduDate, hospitalTel: res.data.hospitalInfo.hospitalTel });
          if (res.data.notificationInfo) {
            this.$store.commit('doc/DATA_SET', res.data.notificationInfo.form);
            this.$store.commit('doc/notificationSubDataSet', { treatStatus: res.data.notificationInfo.treatStatus });
          }
          if (res.data.notificationList) {
            this.notificationList = res.data.notificationList;
          }
          this.billData = Object.assign({}, res.data.studentInfo, res.data.firstBillInfo);
          this.billData.businessDivision = this.dataObject.businessDivision;
          // 인천시 PHP 미실시의 경우 대응
          if (this.districtCodeFirst === 'B') {
            this.formContents.notification.n_11.options[1].value = 2;
            this.formContents.notification.n_11.options[1].label = '간이 구강위생지수';
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
    generateCanvas(i, contWidth, deferred, curList) {
      //페이지를 이미지로 만들기
      const pdfWidth = $(curList).outerWidth(true) * 0.2645, //px -> mm로 변환
        pdfHeight = $(curList).outerHeight() * 0.2645,
        fullHeight = $(curList).outerHeight(true) * 0.2645, // margin 포함
        heightCalc = (contWidth * pdfHeight) / pdfWidth, //비율에 맞게 높이 조절
        fullHeightCalc = (contWidth * fullHeight) / pdfWidth;

      html2canvas(curList, { logging: false }).then(canvas => {
        const img = canvas.toDataURL('image/jpeg', 1.0); //이미지 형식 지정
        this.renderedImg.push({ num: i, image: img, height: heightCalc, fullHeight: fullHeightCalc }); //renderedImg 배열에 이미지 데이터 저장(뒤죽박죽 방지)
        deferred.resolve(); //결과 보내기
      });
    },
    pdfDownload(print) {
      this.$store.commit('loading', true);
      // setTImeout을 하는 이유는 html2canvas를 불러오는게 너무 빨라서 앞의 js가 먹혀도 반영되지 않은 것처럼 보임
      // 따라서 0.1 초 지연 발생 시킴
      setTimeout(() => {
        print ? this.pdf(true, true) : this.pdf(true);
      }, 100);
    },
    pdf(download, print) {
      this.renderedImg = []; //이미지 배열 초기화
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      const lists = document.getElementsByClassName('pdfBlock');
      let deferreds = [];
      let doc = new jsPDF('p', 'mm', 'a4');
      const padding = 20 * 0.2645; // 상하좌우 여백(px -> mm로 변환);
      const contWidth = 210 - padding * 2; // A4 기준

      for (let i = 0; i < lists.length; i++) {
        const deferred = $.Deferred();
        deferreds.push(deferred.promise());
        this.generateCanvas(i, contWidth, deferred, lists[i]);
      }

      $.when.apply($, deferreds).then(() => {
        // 이미지 렌더링이 끝난 후
        const sorted = this.renderedImg.sort((a, b) => {
          return a.num < b.num ? -1 : 1;
        }); // 순서대로 정렬
        let curHeight = print ? 0 : padding; //위 여백 (이미지가 들어가기 시작할 y축)

        if (print) {
          // 인쇄
          let imgHtml = '';
          for (let i = 0; i < sorted.length; i++) {
            const sortedHeight = sorted[i].height, //이미지 높이
              sortedFullHeight = sorted[i].fullHeight, // margin 포함 이미지 높이
              sortedImage = sorted[i].image; //이미지

            const margin = sortedFullHeight - sortedHeight;
            imgHtml += `<img src="${sortedImage}" style="margin-top:${margin}mm;" />`;
          }
          this.$store.commit('loading', false); // 팝업 차단 대비 loading 먼저 제거
          const Pagelink = 'about:blank';
          const pwa = window.open(Pagelink, '_new');
          pwa.document.open();
          const source =
            `<html>
                                    <head>
                                        <style type="text/css" media="print">
                                            @page {
                                                margin: ${padding}mm;
                                            }
                                        </style>
                                        <script>
                                            function step1() {
                                                setTimeout("step2()", 10);
                                            }
                                            function step2() {
                                                window.print();
                                                window.close();
                                            }
                                        </scr` +
            `ipt>
                                    </head>
                                    <body onload="step1()">${imgHtml}</body>
                                    </html>`;
          pwa.document.write(source);
          pwa.document.close();
          return false;
        }
        // pdf
        for (let i = 0; i < sorted.length; i++) {
          const sortedHeight = sorted[i].height, //이미지 높이
            sortedFullHeight = sorted[i].fullHeight, // margin 포함 이미지 높이
            sortedImage = sorted[i].image; //이미지

          if (i !== 0 && curHeight + sortedFullHeight > 297 - padding) {
            // a4 높이에 맞게 남은 공간이 이미지높이보다 작을 경우 페이지 추가
            doc.addPage(); // 페이지를 추가함
            curHeight = padding; // 이미지가 들어갈 y축을 초기 여백값으로 초기화
            doc.addImage(sortedImage, 'jpeg', padding, curHeight, contWidth, sortedHeight); //이미지 넣기
            curHeight += sortedHeight; // y축 = 여백 + 새로 들어간 이미지 높이
          } else {
            // 페이지에 남은 공간보다 이미지가 작으면 페이지 추가하지 않음
            const margin = sortedFullHeight - sortedHeight;
            curHeight += margin; // 마진값만큼 높이 추가
            doc.addImage(sortedImage, 'jpeg', padding, curHeight, contWidth, sortedHeight); //이미지 넣기
            curHeight += sortedHeight; // y축 = 기존y축 + 새로들어간 이미지 높이
          }
        }
        if (download) {
          const fileName = this.getFileName();
          doc.save(`${fileName}.pdf`);
          this.$store.commit('loading', false);
        } else {
          const blob = doc.output('blob');
          const file = new Blob([blob], { type: 'application/pdf' });
          const form = new FormData();
          form.append('studentId', this.dataObject.studentId);
          form.append('businessDivision', this.dataObject.businessDivision);
          form.append('dcfType', 'N');
          form.append('file', file, `N${this.dataObject.studentId}${this.dataObject.businessDivision}.pdf`);
          Hospital.documentFileRegist(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$store.commit('doc/pdfStatusSet', true);
            } else {
              this.$store.commit('loading', false);
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        }
      });
    },
  },
  created() {
    this.title = this.districtCodeFirst === 'I' ? '구강진료 결과통보서' : `${this.divName(this.dataObject.businessDivision, false, true)} 구강검진 결과 통보서`;

    if (!this.dataObject.pdf) {
      this.$store.commit('student/resetStudentInfo');
      this.$store.commit('doc/notification_clear');
      this.$store.commit('doc/notificationSubDataClear');
    }

    this.$store.commit('doc/notification_set', { districtCodeFirst: this.districtCodeFirst, businessDivision: this.dataObject.businessDivision });

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

    if ((['A', 'F', 'G'].includes(this.districtCodeFirst) && this.dataObject.businessDivision === 'E') || ['C', 'E', 'J'].includes(this.districtCodeFirst)) {
      // 서울시 or 밀양시 or 수원시 학생구강검진 / 경기 / 순천 / 울산
      this.form.n1 = { component: 'oral-not-draw-box', title: '충전된 치아', first: 'n_1' };
      this.form.n2 = { component: 'oral-not-draw-box', title: '우식치아', first: 'n_2', second: 'n_2_up', third: 'n_2_down' };
      this.form.n3 = { component: 'oral-not-draw-box', title: '우식발생 위험치아', first: 'n_3', second: 'n_3_up', third: 'n_3_down' };
      this.form.n4 = { component: 'oral-not-draw-box', title: '결손치아', first: 'n_4', second: 'n_4_up', third: 'n_4_down' };
    }

    if (this.districtCodeFirst === 'A' && this.dataObject.businessDivision !== 'E') {
      // 서울 (학구 제외)
      this.form.n4.title = '결손치아 (영구치)';
      this.form.n4.data7 = 'n_4_reason';
      if (this.dataObject.businessDivision === 'C') {
        // 서울시 아동치과주치의
        this.form.n13.data2 = ['n_13_not2', 'n_13_not1'];
      }
      this.formBlock.block1.push({ id: 1, form: 'n1' }, { id: 2, form: 'n2' }, { id: 3, form: 'n3' }, { id: 4, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n7' }, { id: 4, form: 'n8' }, { id: 5, form: 'n10' });
    } else if ((['A', 'G'].includes(this.districtCodeFirst) && this.dataObject.businessDivision === 'E') || this.districtCodeFirst === 'J') {
      // 서울시 or 수원시 학생구강검진 / 울산
      this.form.n2.title = '충치';
      this.form.n3.title = '충치발생 위험치아';
      delete this.form.n5.data2;
      delete this.form.n6.data2;
      this.formBlock.block1.push({ id: 1, form: 'n2' }, { id: 2, form: 'n3' }, { id: 3, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n9' });
      if (this.districtCodeFirst === 'A' && this.dataObject.businessDivision === 'E') {
        // 서울시 학생구강검진
        this.formBlock.block2.push({ id: 4, form: 'n10' });
      } else if (this.districtCodeFirst === 'G' && this.dataObject.businessDivision === 'E') {
        // 수원시 학생구강검진
        this.formBlock.block2.push({ id: 4, form: 'n19' }, { id: 5, form: 'n10' });
      } else if (this.districtCodeFirst === 'J') {
        // 울산
        this.form.n13.data2 = ['n_13_not5', 'n_13_not2'];
        this.formBlock.block2.push({ id: 4, form: 'n10' });
      }
    } else if (this.districtCodeFirst === 'B' && this.dataObject.businessDivision.includes('F')) {
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
    } else if (this.districtCodeFirst === 'E' && this.dataObject.businessDivision.includes('F')) {
      // 순천시 학생치과주치의
      this.form.n2.second = 'n_2_u';
      this.form.n2.third = 'n_2_y';
      this.form.n3.second = 'n_3_u';
      this.form.n3.third = 'n_3_y';
      this.formBlock.block1.push({ id: 1, form: 'n2' }, { id: 2, form: 'n3' }, { id: 3, form: 'n4' }, { id: 4, form: 'n1' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n7' }, { id: 4, form: 'n10' }, { id: 5, form: 'n8' });
    } else if (this.districtCodeFirst === 'E' && this.dataObject.businessDivision === 'E') {
      // 순천시 학생구강검진
      delete this.form.n5.data2;
      delete this.form.n6.data2;
      this.formBlock.block1.push({ id: 1, form: 'n2' }, { id: 2, form: 'n3' }, { id: 3, form: 'n4' }, { id: 4, form: 'n1' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n9' }, { id: 4, form: 'n10' });
    } else if (this.districtCodeFirst === 'F' && this.dataObject.businessDivision.includes('F')) {
      // 밀양시 학생치과주치의
      this.form.n13.data2.splice(0, 0, 'n_13_not4');
      this.formBlock.block1.push({ id: 1, form: 'n1' }, { id: 2, form: 'n2' }, { id: 3, form: 'n3' }, { id: 4, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n7' }, { id: 4, form: 'n10' });
    } else if (this.districtCodeFirst === 'F' && this.dataObject.businessDivision === 'E') {
      // 밀양시 학생구강검진
      delete this.form.n5.data2;
      delete this.form.n6.data2;
      this.formBlock.block1.push({ id: 1, form: 'n1' }, { id: 2, form: 'n2' }, { id: 3, form: 'n3' }, { id: 4, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n9' }, { id: 4, form: 'n10' });
    } else if (this.districtCodeFirst === 'H' && this.dataObject.businessDivision.includes('F')) {
      // 여수시 학생치과주치의
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

    if (this.dataObject.businessDivision === 'E') {
      // 학생구강검진
      this.formBlock.block5.push({ id: 1, form: 'n17' }, { id: 2, form: 'n18' });
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
            description: `* 아래 항목은 ‘${this.divName(this.dataObject.businessDivision, false)}사업’에 의해 무료로 제공되며, 시행된 항목에 체크하여 주세요.`,
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

      if (this.districtCodeFirst === 'H' && this.dataObject.businessDivision.includes('F')) {
        // 여수시 학생치과주치의
        this.formBlock.block5.push({ id: 1, form: 'n16' }, { id: 2, form: 'n17' });
      } else if (this.districtCodeFirst === 'J') {
        // 울산
        this.formBlock.block5.push({ id: 1, form: 'n17' }, { id: 2, form: 'n18' });
      } else if (this.districtCodeFirst !== 'I') {
        // 학생치과주치의, 아동치과주치의 (여수시, 전북 학생치과주치의 제외)
        this.formBlock.block5.push({ id: 1, form: 'n15' }, { id: 2, form: 'n16' });
      }
      // // 통보서 보기 폼에서는 나타나지 않음
      // if (this.districtCodeFirst === 'A' && this.dataObject.businessDivision.includes('F')) {
      //   // 서울시 학생치과주치의
      //   this.formBlock.block5.push({ id: 13, form: 'nHealthyTooth' });
      // }
    }

    if (['D', 'E'].includes(this.districtCodeFirst)) {
      // 부산시, 순천시
      this.formBlock.block5.push({ id: 3, form: 'n20' });
    }
    if (this.districtCodeFirst === 'D' && this.dataObject.businessDivision === 'C') {
      // 부산시 아동치과주치의
      this.formBlock.block5.push({ id: 4, form: 'ndeepTreat' });
    }

    if (!this.dataObject.pdf) {
      this.notificationInfo();
    }
  },
  mounted() {
    if (this.dataObject.pdf) {
      this.$store.commit('update2');
      const view = document.querySelector('.container_wrap');
      view.style.zIndex = 99;
      setTimeout(async () => {
        const pdf = await this.htmlToPdfDownload();
        const file = new Blob([pdf], { type: 'application/pdf' });
        const form = new FormData();
        form.append('studentId', this.dataObject.studentId);
        form.append('businessDivision', this.valueToCode('C0003', this.dataObject.businessDivision));
        form.append('documentFileType', this.valueToCode('C0010', 'N'));
        form.append('file', file, `N${this.dataObject.studentId}${this.dataObject.businessDivision}.pdf`);
        Hospital.documentFileRegist(form).then(res => {
          if (res && res.data.rt === 200) {
            this.$store.commit('doc/pdfStatusSet', true);
          } else {
            this.$store.commit('loading', false);
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        });
        this.popupClose();
        view.style.zIndex = '';
      }, 500);
    }
  },
};
</script>

<style scoped lang="scss">
#btn_wrap {
  position: relative;
  display: flex;
}
</style>
