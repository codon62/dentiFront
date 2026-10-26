<template>
  <fragment>
    <div class="pdfBlock">
      <div class="lcommp tac fwb">{{ title }}</div>
      <std-info-box :businessDivision="dataObject.businessDivision" />
      <p class="commp2 fwb mt30">구강검사 결과 및 판정</p>
      <div class="comm__form mt15 flex_wrap_container border__all border__side">
        <div
          v-for="(block, index) in formBlock.block1"
          :key="`${block.id}_${block.form}`"
          class="border__all border__top_bot"
          :class="{ border__except_top: index > 0, wid__100: index < 3, wid__50: index === 3, mid__box: index === 3 }"
        >
          <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
        </div>
        <div
          v-for="(block, index) in formBlock.block2"
          :key="`${block.id}_${block.form}`"
          class="border__all border__bottom"
          :class="{ border__left: index === 0 || index === 2, wid__50: index < 3, wid__100: index >= 3, mid__box: index === 0 }"
        >
          <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
        </div>
      </div>
      <php-box v-if="phpBoxView" :data-array="form.n11" :view="true" :pdf="true" />
    </div>
    <div v-for="(block, index) in formBlock.block3" :key="`${block.id}_${block.form}`" class="pdfBlock mt30">
      <p v-if="index === 0" class="commp2 fwb">예방진료 및 교육</p>
      <div v-if="block.form === 'n12'" class="comm__form form__row mt10 border__all border__except_bottom">
        <div class="flex_wrap_container pd__10_10">
          <div class="wid120 flex__item_fix"><p class="commp c_black tal fwb">온라인교육</p></div>
          <div class="ml40">
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
      <div class="comm__form form__row border__all" :class="{ mt10: form[block.form].component !== 'all-check-list-box' }">
        <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
      </div>
    </div>
    <div v-if="formBlock.block4.length" class="pdfBlock mt30">
      <p class="commp2 fwb">예방진료내역</p>
      <div v-for="block in formBlock.block4" :key="`${block.id}_${block.form}`" class="comm__form">
        <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
      </div>
    </div>
    <p class="pdfBlock mt30 fwb commp2">종합소견</p>
    <template v-if="dataObject.businessDivision.includes('F')">
      <p class="pdfBlock c_red commp5 fwb">※ 치아상태 및 구강위생상태는 치과주치의 검진 의료기관에서 학생의 종합적인 구강상태를 평가한 결과입니다.</p>
    </template>
    <div
      v-for="(block, index) in formBlock.block5"
      :key="`${block.id}_${block.form}`"
      class="pdfBlock comm__form form__row bg_white border__all"
      :class="{ mt10: index === 0, 'mb-1': index < formBlock.block5.length - 1 }"
    >
      <component :is="form[block.form].component" :data-array="form[block.form]" :view="true" />
    </div>
    <div class="pdfBlock mt20">
      <doctor-info-bill :data-array="form.doctor" subject="검진" />
    </div>
  </fragment>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';
import oralDrawBox from '@/components/doc/oralDrawBox';
import StdInfoBox from '@/components/docview/gyeonggi/stdInfoBox';
import DoctorInfoBill from '@/components/docview/gyeonggi/doctorInfoBill';
import phpBox from '@/components/docview/gyeonggi/phpBox';
import LongCheckAndBox from '@/components/docview/gyeonggi/longCheckAndBox';
import preventCareHistory from '@/components/docview/gyeonggi/preventCareHistory';
import oralNotDrawBox from '@/components/docview/gyeonggi/oralNotDrawBox';
import checkExtendBox from '@/components/docview/gyeonggi/checkExtendBox';
import allCheckListBox from '@/components/docview/gyeonggi/allCheckListBox';
import CheckboxNotInput from '@/components/docview/gyeonggi/CheckboxNotInput';
import checkboxList from '@/components/docview/gyeonggi/checkboxList';
import { mapGetters, mapState } from 'vuex';
import InputBox from '@/components/docview/gyeonggi/InputBox';

export default {
  name: 'NotificationGyeonggi',
  components: {
    'v-popuptitle': popupTitle,
    'oral-draw-box': oralDrawBox,
    'doctor-info-bill': DoctorInfoBill,
    'std-info-box': StdInfoBox,
    'oral-not-draw-box': oralNotDrawBox,
    'check-extend-box': checkExtendBox,
    'all-check-list-box': allCheckListBox,
    'php-box': phpBox,
    'checkbox-list': checkboxList,
    'checkbox-not-input': CheckboxNotInput,
    'long-check-and-box': LongCheckAndBox,
    'prevent-care-history': preventCareHistory,
    'input-box': InputBox,
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
      notificationList: [],
      renderedImg: [],
    };
  },
  computed: {
    ...mapState('doc', ['formContents', 'notificationSubData']),
    ...mapState('student', ['studentInfo']),
    ...mapState('status', ['districtCodeFirstToName', 'businessDivision']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divName']),
    phpBoxView() {
      return this.dataObject.businessDivision.includes('F');
    },
  },
  created() {
    this.title = '경기도 초등학생 치과주치의사업 구강검진 결과 통보서';

    this.form.n1 = { component: 'oral-not-draw-box', title: '충전된 치아', first: 'n_1' };
    this.form.n2 = { component: 'oral-not-draw-box', title: '우식치아', first: 'n_2', second: 'n_2_up', third: 'n_2_down' };
    this.form.n3 = { component: 'oral-not-draw-box', title: '우식발생 위험치아', first: 'n_3', second: 'n_3_up', third: 'n_3_down' };
    this.form.n4 = { component: 'oral-not-draw-box', title: '결손치아', first: 'n_4', second: 'n_4_up', third: 'n_4_down' };
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
    };
    this.form.n12 = { component: 'all-check-list-box', title: '구강보건교육<span class="c_red d_inblock ml5">*</span>', data1: 'n_12' };
    this.form.n13 = { component: 'checkbox-not-input', title: '예방진료', data1: 'n_13', data2: ['n_13_not1', 'n_13_not2'] };
    this.form.n13check = { component: 'checkbox-list', title: '필요시제공', data1: 'n_13_check' };
    this.form.n13tooth = { component: 'prevent-care-history', data1: 'n_13_tooth' };
    this.form.n15 = { component: 'check-extend-box', title: '치아상태<span class="c_red d_inblock ml5">*</span>', titleWidth: '160px', data1: 'n_15' };
    this.form.n16 = { component: 'check-extend-box', title: '구강위생상태<span class="c_red d_inblock ml5">*</span>', titleWidth: '160px', data1: 'n_16' };
    this.form.n17 = { component: 'long-check-and-box', title: '종합소견<span class="c_red d_inblock ml5">*</span>', data1: 'n_17', data2: 'n_17_etc' };
    this.form.n18 = { component: 'long-check-and-box', title: '가정에서의 조치사항', data1: 'n_18', data2: 'n_18_etc' };
    this.form.n20 = { component: 'checkbox-list', title: '재내원 계획', data1: 'n_20' };
    this.form.n21 = { component: 'input-box', title: '기타 소견', data1: 'n_21' };
    this.form.nend = { component: 'check-extend-box', title: '제공 항목', data1: 'n_end' };
    this.form.ndeepTreat = { component: 'check-extend-box', title: '심화치료 여부<span class="c_red d_inblock ml5">*</span>', data1: 'n_deep_treat' };
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
    this.formBlock.block1.push({ id: 1, form: 'n2' }, { id: 2, form: 'n3' }, { id: 3, form: 'n4' }, { id: 4, form: 'n1' });
    this.formBlock.block2.push({ id: 1, form: 'n5' }, { id: 2, form: 'n6' }, { id: 3, form: 'n9' }, { id: 4, form: 'n8' }, { id: 5, form: 'n10' });

    if (this.dataObject.businessDivision === 'E') {
      // 학생구강검진
      this.formBlock.block5.push({ id: 1, form: 'n17' }, { id: 2, form: 'n18' });
    } else {
      // 학생치과주치의
      this.formBlock.block3.push(
        {
          id: 1,
          form: 'n12',
          class: 'mt5 c_red scommp',
          description: `* 아래 항목은 ‘${this.divName(this.dataObject.businessDivision, false)}사업’에 의해 무료로 제공되며, 시행된 항목에 체크하여 주세요.`,
        },
        { id: 2, form: 'n13', class: 'mt30 scommp c_gray2', description: '* 필수 항목을 시행하지 않은 경우는 미진료 사유 기재란에 기재하여 주세요.' },
        { id: 3, form: 'n13check', class: 'mt30 scommp c_gray2', description: '* 아래 항목은 치과의사의 판단에 따라 선택적으로 시행되며, 시행된 항목에 체크하여 주세요.' },
      );
      this.formBlock.block4.push({ id: 1, form: 'n13tooth' });
      this.formBlock.block5.push({ id: 1, form: 'n15' }, { id: 2, form: 'n16' }, { id: 3, form: 'n20' }, { id: 4, form: 'n21' });
    }
  },
};
</script>

<style scoped lang="scss">
.border__all {
  border: 1px solid #e6e6e6;
}
.border__top_bot {
  border-width: 1px 0;
}
.border__side {
  border-width: 0 1px;
}
.border__left {
  border-left-width: 1px !important;
}
.border__bottom {
  border-width: 0 0 1px 0;
}
.border__except_top {
  border-top-width: 0px;
}
.border__except_bottom {
  border-bottom-width: 0px;
}
.mb-1 {
  margin-bottom: -1px;
}
.wid__100 {
  width: 100%;
}
.wid__50 {
  width: 50%;
}
.comm__form.mt15.flex_wrap_container > div {
  @include box-sizing(border-box);
}
.pd__10_10 {
  padding: 10px;
  background-color: #fff;
}
.pd__0_10 {
  padding: 0 10px;
  background-color: #fff;
}
.flex__box_center {
  display: flex;
  align-items: center;
}
.flex__item_fix {
  flex-shrink: 0;
}
</style>
