<template>
  <div class="popup_content">
    <v-popuptitle divclass="bg__form_ver" message="통보서" imgsrc="sub/ic_write.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver">
      <div class="row">
        <div class="inner--right">
          <a href="javascript:;" class="comm__green_bd_btn d_inblock fwn commp2 bg_white btn_l_size wid120" @click="pdfDownload()">
            <img src="@/assets/images/sub/ic_download_20.png" />
            다운로드
          </a>
          <a href="javascript:;" class="comm__blue_bd_btn d_inblock fwn commp2 bg_white btn_l_size ml10 wid120" @click="pdfDownload(true)">
            <img src="@/assets/images/sub/ic_print_20.png" />
            인쇄
          </a>
        </div>
      </div>

      <div class="bg_white comm__inner mt20">
        <div class="pdfBlock">
          <div class="lcommp tac fwb">{{ title }}</div>
          <std-info-box :businessDivision="dataObject.businessDivision" />
          <div class="comm__line mt30"></div>
          <div v-if="districtCodeFirst === 'A' && dataObject.businessDivision === 'C'">
            <p class="commp2 fwb mt30">진료 계획 작성 원칙</p>
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

          <p class="commp2 fwb mt30">구강검사 결과 및 판정</p>
          <p class="scommp mt5">* (치아번호 한 번 클릭시) 파란색은 영구치, (치아번호 두 번 클릭시) 빨간색은 유치를 의미합니다.</p>
          <div class="comm__form mt15">
            <div v-for="(block, index) in formBlock.block1" :key="`${block.id}_${block.form}`" class="form__row" :class="{ mt10: index > 0 }">
              <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
            </div>
          </div>
          <div class="comm__line mt30"></div>
        </div>

        <div v-for="(block, index) in formBlock.block2" :key="`${block.id}_${block.form}`" class="pdfBlock comm__form form__row" :class="{ mt30: index === 0, mt10: index > 0 }">
          <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
        </div>
        <div class="pdfBlock comm__line mt30"></div>

        <php-box v-if="phpBoxView" :data-array="form.nphp" :view="true" :pdf="true" />
        <div v-if="phpBoxView" class="pdfBlock comm__line mt30"></div>

        <div v-for="(block, index) in formBlock.block3" :key="`${block.id}_${block.form}`" class="pdfBlock" :class="{ mt30: index === 0 }">
          <p v-if="index === 0" class="commp2 fwb">예방진료 및 교육</p>
          <p :class="block.class">{{ block.description }}</p>
          <div class="comm__form form__row mt10">
            <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
          </div>
        </div>
        <div v-if="formBlock.block3.length" class="pdfBlock comm__line mt30"></div>

        <div v-if="formBlock.block4.length" class="pdfBlock mt30">
          <p class="commp2 fwb">예방진료내역</p>
          <div v-for="block in formBlock.block4" :key="`${block.id}_${block.form}`" class="comm__form">
            <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
          </div>
          <div class="comm__line mt30"></div>
        </div>

        <p v-if="districtCodeFirst === 'D'" class="pdfBlock fwb commp2 mt30">심화치료 여부</p>
        <p v-else class="pdfBlock fwb commp2 mt30">추가진료 여부</p>
        <div v-for="(block, index) in formBlock.block5" :key="`${block.id}_${block.form}`" class="pdfBlock comm__form form__row" :class="{ mt20: index === 0, mt10: index > 0 }">
          <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
        </div>
        <div class="pdfBlock comm__line mt30"></div>

        <p v-if="districtCodeFirst === 'D'" class="pdfBlock fwb commp2 mt30">종합소견 및 재내원 계획</p>
        <template v-else>
          <p class="pdfBlock fwb commp2 mt30">종합소견 및 수정사유</p>
          <p class="pdfBlock scommp mt5">* 병원별, 진료의사별 진단 결과는 상이할 수 있습니다.</p>
        </template>
        <div v-for="(block, index) in formBlock.block6" :key="`${block.id}_${block.form}`" class="pdfBlock comm__form form__row" :class="{ mt20: index === 0, mt10: index > 0 }">
          <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
        </div>

        <div class="pdfBlock comm__line mt30"></div>
        <div class="pdfBlock mt20">
          <div class="row flex_set">
            <div class="flex_item">
              <p class="fwb commp2">판정 치과의사</p>
              <p class="scommp c_gray2 fwn mt10">치과의사명</p>
              <!-- pdf 적용 위해 style 태그 필요 -->
              <div class="m__putbox mt10 wid200">
                <input type="text" class="comm_put read_put" style="background-color: #f2f2f2; padding: 0px 15px" :value="formContents[notificationName]['doctor_name'].value" readonly />
              </div>
            </div>
            <div class="flex_item ml20">
              <p class="scommp c_gray2 fwn">면허번호</p>
              <div class="m__putbox mt10 wid200">
                <input type="text" class="comm_put read_put" style="background-color: #f2f2f2; padding: 0px 15px" :value="formContents[notificationName]['hpt_license'].value" readonly />
              </div>
            </div>
            <div class="flex_item ml40">
              <p class="fwb commp2">검진일 및 검진기관</p>
              <p class="scommp c_gray2 fwn mt10">검진일</p>
              <div class="m__putbox mt10 wid200">
                <input type="text" class="comm_put read_put" style="background-color: #f2f2f2; padding: 0px 15px" :value="formContents[notificationName]['std_date'].value" readonly />
              </div>
            </div>
            <div class="flex_item ml20">
              <p class="scommp c_gray2 fwn">검진기관명</p>
              <div class="m__putbox mt10 wid200">
                <input type="text" class="comm_put read_put" style="background-color: #f2f2f2; padding: 0px 15px" :value="formContents[notificationName]['hpt_name'].value" readonly />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
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
import preventCareHistory2020 from '@/components/doc/preventCareHistory2020';
import textBox2020 from '@/components/doc/textBox2020';
import { mapActions, mapGetters, mapState } from 'vuex';

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
    'prevent-care-history-2020': preventCareHistory2020,
    'text-box-2020': textBox2020,
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
        block6: [],
      },
      renderedImg: [],
      notificationName: 'notification2020',
    };
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapState('student', ['studentInfo']),
    ...mapState('status', ['districtCodeFirstToName', 'businessDivision']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName']),
    phpBoxView() {
      if ((this.districtCodeFirst === 'D' || this.dataObject.businessDivision.includes('F')) && !(this.districtCodeFirst === 'F' && this.dataObject.businessDivision.includes('F'))) {
        // 부산시 or 학생치과주치의, not 밀양시 학생치과주치의
        return true;
      }
      return false;
    },
  },
  created() {
    this.title = `${this.divName(this.dataObject.businessDivision, false, true)} 구강검진 결과 통보서`;

    if (!this.dataObject.pdf) {
      this.$store.commit('student/resetStudentInfo');
      this.$store.commit('doc/notification2020_clear');
    }
    this.$store.commit('doc/notification2020_set', { districtCodeFirst: this.districtCodeFirst });

    this.form.n1 = { component: 'oral-not-draw-box', year: '2020', title: '충전된 치아', first: 'n_1', second: 'n_1_up1', third: 'n_1_up2' };
    this.form.n2 = { component: 'oral-draw-box', year: '2020', title: '우식치아', data1: 'n_2_tooth', data2: 'n_2', data3: 'n_2_up', data4: 'n_2_down' };
    this.form.n3 = { component: 'oral-draw-box', year: '2020', title: '우식발생 위험치아', data1: 'n_3_tooth', data2: 'n_3', data3: 'n_3_up', data4: 'n_3_down' };
    this.form.n4 = { component: 'oral-draw-box', year: '2020', title: '결손치아', data1: 'n_4_tooth', data2: 'n_4', data3: 'n_4_up', data4: 'n_4_down' };

    this.form.n5 = { component: 'check-extend-box', year: '2020', title: '구내염 및 <br/>연조직 질환', data1: 'n_5', data2: 'n_5_1_etc' };
    this.form.n6 = { component: 'check-extend-box', year: '2020', title: '부정교합', data1: 'n_6', data2: 'n_6_check' };
    this.form.n7 = { component: 'check-extend-box', year: '2020', title: '치주질환', data1: 'n_7', data2: 'n_7_check' };
    this.form.n8 = { component: 'check-extend-box', year: '2020', title: '그 밖의 치아상태', data1: 'n_8', data2: 'n_8_etc' };
    this.form.n9 = { component: 'check-extend-box', year: '2020', title: '악관절 이상', data1: 'n_9' };
    this.form.n10 = { component: 'all-check-list-box', year: '2020', title: '구강보건교육', data1: 'n_10' };
    const data2_111217 = this.districtCodeFirst === 'D' ? ['n_11_non', 'n_12_non'] : ['n_27_non', 'n_12_non'];
    this.form.n111227 = { component: 'checkbox-not-input', year: '2020', title: '예방진료', data1: 'n_111227_check', data2: data2_111217 };
    this.form.n13check = { component: 'checkbox-list', year: '2020', title: '필요시제공', data1: 'n_13_check' };
    this.form.n17 = { component: 'check-extend-box', year: '2020', title: '종합소견<br/>치아상태', data1: 'n_17' };
    this.form.n18 = { component: 'check-extend-box', year: '2020', title: '종합소견<br/>구강위생상태', data1: 'n_18' };
    this.form.n19 = { component: 'check-extend-box', year: '2020', title: '재내원 계획<br/>치료', data1: 'n_19' };
    this.form.nphp = {
      component: 'php-box',
      year: '2020',
      title: 'PHP 검사',
      data1: 'n_php',
      data2: 'n_php_check',
      data3: 'n_php_score',
      data4: 'tooth01',
      data5: 'tooth02',
      data6: 'tooth03',
      data7: 'tooth04',
      data8: 'tooth05',
      data9: 'tooth06',
    };
    this.form.naddtreat = { component: 'check-extend-box', year: '2020', title: '추가진료 여부', data1: 'n_addtreat' };
    this.form.nmodifyreason = { component: 'text-box-2020', year: '2020', title: '수정사유', data1: 'n_modify_reason' };
    this.form.ntotalopinion = { component: 'text-box-2020', year: '2020', title: '종합소견', data1: 'n_total_opinion' };
    this.form.ntreatment = { component: 'prevent-care-history-2020', data1: 'n_treatment' };

    if (this.districtCodeFirst === 'A' && this.dataObject.businessDivision === 'C') {
      // 서울시 아동치과주치의
      this.formBlock.block1.push({ id: 1, form: 'n1' }, { id: 2, form: 'n2' }, { id: 3, form: 'n3' }, { id: 4, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n7' }, { id: 4, form: 'n8' }, { id: 5, form: 'n9' });
      this.formBlock.block3.push(
        { id: 1, form: 'n10', class: 'mt5 c_red scommp', description: `* 아래 항목은 ‘아동치과주치의사업’에 의해 무료로 제공되며, 시행된 항목에 체크하여 주세요.` },
        { id: 2, form: 'n111227', class: 'mt30 scommp c_gray2', description: '* 필수 항목을 시행하지 않은 경우는 미진료 사유 기재란에 기재하여 주세요.' },
        { id: 3, form: 'n13check', class: 'mt30 scommp c_gray2', description: '* 아래 항목은 치과의사의 판단에 따라 선택적으로 시행되며, 시행된 항목에 체크하여 주세요.' },
      );
      this.formBlock.block4.push({ id: 1, form: 'ntreatment' });
      this.formBlock.block5.push({ id: 1, form: 'naddtreat' });
      this.formBlock.block6.push({ id: 1, form: 'ntotalopinion' }, { id: 2, form: 'nmodifyreason' });
    } else if (this.districtCodeFirst === 'D' && this.dataObject.businessDivision === 'C') {
      // 부산시 아동치과주치의
      this.formBlock.block1.push({ id: 1, form: 'n1' }, { id: 2, form: 'n2' }, { id: 3, form: 'n3' }, { id: 4, form: 'n4' });
      this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n7' }, { id: 4, form: 'n8' }, { id: 5, form: 'n9' });
      this.formBlock.block3.push(
        { id: 1, form: 'n10', class: 'mt5 c_red scommp', description: `* 아래 항목은 ‘아동치과주치의사업’에 의해 무료로 제공되며, 시행된 항목에 체크하여 주세요.` },
        { id: 2, form: 'n111227', class: 'mt30 scommp c_gray2', description: '* 필수 항목을 시행하지 않은 경우는 미진료 사유 기재란에 기재하여 주세요.' },
        { id: 3, form: 'n13check', class: 'mt30 scommp c_gray2', description: '* 아래 항목은 치과의사의 판단에 따라 선택적으로 시행되며, 시행된 항목에 체크하여 주세요.' },
      );
      this.formBlock.block4.push({ id: 1, form: 'ntreatment' });
      this.form.naddtreat.title = '심화치료 여부';
      this.formBlock.block5.push({ id: 1, form: 'naddtreat' });
      this.formBlock.block6.push({ id: 1, form: 'n17' }, { id: 2, form: 'n18' }, { id: 3, form: 'n19' });
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
      setTimeout(() => {
        this.pdf();
        this.popupClose();
        view.style.zIndex = '';
      }, 500);
    }
  },
  methods: {
    ...mapActions('popup', ['popupClose']),
    notificationInfo() {
      let form = {
        hospitalId: this.dataObject.hospitalId || 0,
        studentId: this.dataObject.studentId,
        businessDivision: this.dataObject.businessDivision,
        notificationId: this.dataObject.notificationId,
        notificationYear: this.dataObject.notificationYear,
      };
      Hospital.notificationInfo(form).then(res => {
        if (res && res.data.rt === 200) {
          this.$store.commit('student/DATA_SET', res.data.studentInfo);
          this.$store.commit('update2');
          if (res.data.notificationInfo) {
            let notForm = res.data.notificationInfo.form;
            // 추가 진료 여부(서울)도 같이 vuex의 notification2020에 저장
            if (res.data.notificationInfo.treatStatus) notForm.n_treatStatus = res.data.notificationInfo.treatStatus === 'Y' ? 1 : -1;
            this.$store.commit('doc/NOTIFICATION2020_DATA_SET', notForm);
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
          const fileName = `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.studentInfo.healthCareName.value}_${divName}_${hospitalName}통보서_${
            this.studentInfo.studentName.value
          }_${now}.pdf`;

          doc.save(fileName);
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
};
</script>
