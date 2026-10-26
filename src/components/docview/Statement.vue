<template>
  <div class="popup_content">
    <v-popuptitle divclass="bg__form_ver" message="내역서" imgsrc="sub/ic_write.png"></v-popuptitle>
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
          <div class="pdfBlock">
            <div class="lcommp tac fwb">아동치과주치의 구강 진료 내역서</div>
            <std-info-box businessDivision="C" />
          </div>

          <!--<div v-if="districtCodeFirst === 'A'">-->
          <!--  <p class="commp2 fwb mt30">진료 계획 작성 원칙</p>-->
          <!--  <p class="commp mt5 fw500">-->
          <!--    * 치과 진료는 자치구 보건소 지역협의체 회의에서 결정된 진료범위입니다. (반드시 확인요망)-->
          <!--    <br />-->
          <!--    * 예방진료 : 치아홈메우기/치석제거(부분치석제거)-->
          <!--  </p>-->
          <!--  <p class="commp mt20 c_red fw500">-->
          <!--    ※ 치석제거 전악제거가 필요시 보건소 협의하에 진행-->
          <!--    <br />-->
          <!--    ※ 불소도포는 치과의원에서 실시하더라도 청구 불가-->
          <!--    <br />-->
          <!--    ※ 예산사정상 반드시 보건소 승인 후 진료 시작하셔야 합니다.-->
          <!--  </p>-->
          <!--</div>-->

          <div class="pdfBlock mt30">
            <p class="commp2 fwb">구강진료</p>
            <div class="comm__form mt20">
              <div v-if="formBlock.block1.length" class="form_wrap_statement">
                <div style="width: 20%"><p class="commp tal">예방진료</p></div>
                <div style="width: 80%">
                  <div v-for="(block, rowIndex) in formBlock.block1" :key="rowIndex" class="row">
                    <check-and-check :data-array="form[block.form]" :divclass="rowIndex !== 0 ? 'mt15' : ''" :disabled="true" />
                  </div>
                </div>
              </div>
              <div class="form_wrap_statement" :class="{ mt20: formBlock.block1.length }">
                <div style="width: 20%"><p class="commp tal">치료</p></div>
                <div style="width: 80%">
                  <div v-for="(block, rowIndex) in formBlock.block2" :key="rowIndex" class="row">
                    <check-and-check :data-array="form[block.form]" :divclass="rowIndex !== 0 ? 'mt15' : ''" :disabled="true" />
                  </div>
                </div>
              </div>
              <template v-if="districtCodeFirst === 'A'">
                <p class="commp mt5 c_red fw500">* 아래의 항목은 진료계획 있었으나 미내원시 작성하여 주세요.</p>
                <div class="form_wrap_statement mt5">
                  <div style="width: 20%"><p class="commp tal">구강검진</p></div>
                  <div style="width: 80%">
                    <div v-for="(block, rowIndex) in formBlock.block3" :key="rowIndex" class="row">
                      <check-and-check :data-array="form[block.form]" :divclass="rowIndex !== 0 ? 'mt15' : ''" :disabled="true" />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="pdfBlock mt30">
            <p class="commp2 fwb">구강진료 내역</p>
          </div>

          <oral-care-history :data-array="{ data1: 's_tooth', data2: 'treatPrice', data3: 'copayPrice' }" :view="true" />

          <div class="pdfBlock mt20">
            <doctor-info :data-array="form.doctor" subject="검진" />
          </div>

          <div v-if="files.length" class="comm__line mt30" data-html2canvas-ignore></div>
          <p v-if="files.length" class="commp fwn mt30" data-html2canvas-ignore>
            첨부파일
            <span class="c_red">(진료기록부 사본 또는 진료 내역서)</span>
          </p>

          <div v-if="files.length" class="row mt10 file__upload" data-html2canvas-ignore>
            <div v-for="(file, index) in files" :key="file.statementFileId" class="upload_put p_relative on" :class="{ mt10: parseInt(index) > 0 }">
              <input type="text" class="upload_text upload-name ml0" readonly="readonly" :value="file.originName" />
              <a :href="file.fullPath" class="name_del"><img src="@/assets/images/common/ic_download.png" /></a>
            </div>
          </div>
          <!-- <div v-if="files.length" class="thumbnail-box row mt10" data-html2canvas-ignore>
                          <ul class="thumbnail-list clearfix">
                              <li class="list view-list" v-for="file in files" :key="file.statementFileId">
                                  <div class="list-imgBox">
                                      <pdf v-if="file.ext === 'PDF'" :src="file.fullPath"></pdf>
                                      <img v-else :src="file.fullPath">
                                  </div>
                                  <div class="list-tit">
                                      <a :href="file.fullPath"><img src="@/assets/images/sub/ic_download_20.png"></a>
                                      <span class="fileName tac">{{ file.originName }}</span>
                                  </div>
                              </li>
                          </ul>
                      </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import StdInfoBox from '@/components/docview/stdInfoBox.vue';
import DoctorInfo from '@/components/docview/doctorInfo';
import CheckAndCheck from '@/components/doc/checkAndCheck.vue';
import OralCareHistory from '@/components/doc/oralCareHistory.vue';
import { mapActions, mapGetters, mapState } from 'vuex';
import jsPDF from 'jspdf';

export default {
  components: {
    'v-popuptitle': popupTitle,
    StdInfoBox,
    DoctorInfo,
    CheckAndCheck,
    OralCareHistory,
  },
  props: ['dataObject'],
  data() {
    return {
      form: {
        s1: { data1: 's_1', data2: 's_1_check' },
        s2: { data1: 's_2', data2: 's_2_check' },
        s3: { data1: 's_3' },
        s4: { data1: 's_4' },
        s5: { data1: 's_5' },
        s6: { data1: 's_6' },
        s7: { data1: 's_7' },
        s8: { data1: 's_8', data2: 's_8_radio' },
        s9: { data1: 's_9' },
        s10: { data1: 's_10' },
        s11: { data1: 's_11' },
        s12: { data1: 's_12' },
        s13: { data1: 's_13' },
        sEtc: { data1: 's_etc', data2: 's_etc_input' },
        doctor: { data1: 's_doctor', data2: 's_doctor_name', data3: 's_license', data4: 's_date', data5: 's_organ' },
      },
      formBlock: {
        block1: [],
        block2: [],
        block3: [],
      },
      files: [],
      pdfRefreshKey: 0,
    };
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapState('student', ['studentInfo']),
    ...mapState('status', ['districtCodeFirstToName']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['codeToValue']),
  },
  methods: {
    ...mapActions('popup', ['popupClose']),
    getFileName() {
      const date = new Date();
      const now =
        date.getFullYear() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        ('0' + date.getHours()).slice(-2) +
        ('0' + date.getMinutes()).slice(-2) +
        ('0' + date.getSeconds()).slice(-2);
      return `${this.districtCodeFirstToName[this.districtCodeFirst]}_${this.studentInfo.healthCareName.value}_아동치과주치의_내역서_${this.studentInfo.studentName.value}_${now}`;
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
    statementInfo() {
      const form = {
        hospitalId: this.dataObject.hospitalId,
        studentId: this.dataObject.studentId,
        notificationId: this.dataObject.notificationId,
        statementId: this.dataObject.statementId,
        statementYear: this.dataObject.statementYear,
      };
      Hospital.statementInfo(form).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.studentInfo.studentGender = this.codeToValue(res.data.studentInfo.studentGender);
          res.data.studentInfo.studentInsurance = this.codeToValue(res.data.studentInfo.studentInsurance);
          if (res.data.statementInfo) {
            res.data.statementInfo.status = this.codeToValue(res.data.statementInfo.status);
          }
          // code convert end
          this.$store.commit('student/DATA_SET', res.data.studentInfo);
          if (res.data.statementInfo) {
            this.$store.commit('doc/DATA_SET', res.data.statementInfo.form);
            // s_1_radio -> s_1_check 변경으로 인한 데이터 마이그레이션
            if (res.data.statementInfo.form.s_1_radio && (!res.data.statementInfo.form.s_1_check || !res.data.statementInfo.form.s_1_check.length)) {
              this.$store.commit('doc/DATA_SET', { s_1_check: [res.data.statementInfo.form.s_1_radio] });
              this.$store.commit('doc/DATA_SET', { s_1_radio: 0 });
            }
            this.files = res.data.files;
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

          if (i !== 0 && curHeight + sortedFullHeight > 297 - padding * 2) {
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
          form.append('businessDivision', 'C');
          form.append('dcfType', 'S');
          form.append('notificationId', this.dataObject.notificationId);
          form.append('file', file, `S${this.dataObject.studentId}C${this.dataObject.notificationId}.pdf`);
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
    if (!this.dataObject.pdf) {
      this.$store.commit('student/resetStudentInfo');
      this.$store.commit('doc/statement_clear');
    }
    this.$store.commit('doc/statement_set', { districtCodeFirst: this.districtCodeFirst });

    if (this.districtCodeFirst === 'A') {
      this.formBlock.block1.push({ id: 1, form: 's7' }, { id: 2, form: 's8' }, { id: 3, form: 's9' }, { id: 4, form: 's10' });
      this.formBlock.block2.push({ id: 1, form: 's1' }, { id: 2, form: 's3' }, { id: 3, form: 's2' }, { id: 4, form: 's4' }, { id: 5, form: 's5' }, { id: 6, form: 's6' });
      this.formBlock.block3.push({ id: 1, form: 's12' }, { id: 2, form: 's13' }, { id: 3, form: 'sEtc' });
    } else {
      // 부산시 아동치과주치의
      delete this.form.sEtc.data2;
      this.formBlock.block2.push({ id: 1, form: 's2' }, { id: 1, form: 'sEtc' });
    }
    if (!this.dataObject.pdf) {
      this.statementInfo();
    }
  },
  mounted() {
    if (this.dataObject.pdf) {
      const view = document.querySelector('.container_wrap');
      view.style.zIndex = 99;
      setTimeout(() => {
        this.pdf();
        this.popupClose();
        view.style.zIndex = '';
      }, 500);
    }
  },
};
</script>
