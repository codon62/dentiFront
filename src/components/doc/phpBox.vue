<template>
  <div class="comm__form php_box_wrap mt30" :class="{ pdfBlock: pdf }">
    <template v-if="phpView">
      <p v-if="parseInt(data1.value) === 3" class="scommp c_red fwb">* 총점 [0~6점:양호, 7~12:보통, 13~18점:개선요망]</p>
      <p v-else-if="['A', 'I', 'J'].includes(districtCodeFirst)" class="scommp c_red fwb">* 총점 [0~10점:양호, 11~20:보통, 21~30점:개선요망]</p>
      <p v-else class="scommp c_red fwb">* 총점 [0~5점:우수, 6~10:보통, 11~30점:개선요망]</p>
      <p
        v-if="districtCodeFirst === 'A' && $route.query.businessDivision && $route.query.businessDivision.includes('F') && parseInt(studentInfo.studentToSchoolGrade1.value) === 1"
        class="scommp c_red"
      >
        *1학년 영구치 미 맹출시 인접 유치에 검사 가능
      </p>
    </template>
    <p v-else-if="parseInt(data1.value) === 2" class="scommp c_red">* 총점을 직접 입력해 주세요.</p>
    <div :class="phpView || parseInt(data1.value) === 2 ? 'mt10' : 'mt30'">
      <div class="form_wrap_php_box">
        <div class="">
          <p class="commp tal">
            {{ districtCodeFirst !== 'I' ? '구강환경관리능력검사' : '치면세균막검사' }}
            <template v-if="districtCodeFirst !== 'I'">
              <span class="c_red d_inblock ml5">*</span>
              <br />
              (치면세균막 검사)
            </template>
          </p>
        </div>
        <div>
          <div class="comm_radio m__putbox mt20">
            <div v-for="option in data1.options" :key="option.id" class="radio_box d_inblock hei100" :class="{ ml30: parseInt(option.id, 10) > 0 }">
              <input :id="data1.id + '_' + option.id" type="radio" :value="option.value" :checked="data1.value === option.value" :name="data1.name" class="blind" :disabled="view" @click="data1Set" />
              <label :for="data1.id + '_' + option.id">
                <span class="icon"></span>
                <span class="label_t commp c_black">{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>
        <div>
          <input :id="data4.id" type="hidden" :name="data4.name" :value="data4.value" />
          <input :id="data5.id" type="hidden" :name="data5.name" :value="data5.value" />
          <input :id="data6.id" type="hidden" :name="data6.name" :value="data6.value" />
          <input :id="data7.id" type="hidden" :name="data7.name" :value="data7.value" />
          <input :id="data8.id" type="hidden" :name="data8.name" :value="data8.value" />
          <input :id="data9.id" type="hidden" :name="data9.name" :value="data9.value" />
          <div v-if="parseInt(data1.value) === 0" class="check_set">
            <div class="d_inblock mr10">
              <p class="commp">미실시 사유 :</p>
            </div>
            <div v-if="['A', 'J'].includes(districtCodeFirst)" class="d_inblock wid200">
              <input
                v-if="!view"
                type="text"
                maxlength="100"
                class="input_box reason_box commp"
                :value="data11.value"
                @input="DATA_SET({ [data11.id]: $event.target.value })"
                :placeholder="data11.placeholder"
              />
              <div v-else class="input_box reason_box commp read_only">{{ data11.value }}</div>
            </div>
            <template v-else>
              <div v-for="option in data2.options" :key="option.id" class="radio_box d_inblock" :class="{ ml10: parseInt(option.id, 10) > 0 }">
                <input
                  :id="data2.id + '_' + option.id"
                  type="checkbox"
                  :value="option.value"
                  :checked="data2.value.indexOf(option.value) !== -1"
                  :name="data2.name"
                  class="blind"
                  :disabled="view"
                  @change="DATA_SET({ [data2.id]: parseInt($event.target.value) })"
                />
                <label :for="data2.id + '_' + option.id">
                  <span class="icon"></span>
                  <span class="label_t">{{ option.label }}</span>
                </label>
              </div>
            </template>
          </div>
          <!-- 인천시 간이 구강위생지수 -->
          <template v-else-if="parseInt(data1.value) === 2">
            <div class="number_check row">
              <div class="d_inblock mr10">
                <p class="commp">총 :</p>
              </div>
              <div class="d_inblock wid50">
                <div class="m__putbox">
                  <input
                    type="number"
                    class="input_box commp tac"
                    min="0"
                    max="18"
                    :class="{ read_only: view }"
                    :value="data10.value"
                    @keypress="n_11_simple_valid($event)"
                    @input="DATA_SET({ [data10.id]: $event.target.value ? parseInt($event.target.value) : '' })"
                    :disabled="view"
                  />
                </div>
              </div>
              <div class="d_inblock wid_100"><p class="commp ml10">점 (18점 만점)</p></div>
            </div>
            <div class="check_set">
              <div v-for="option in data10.options" :key="option.id" class="radio_box d_inblock" :class="{ ml10: parseInt(option.id, 10) > 0 }">
                <input
                  :id="data10.id + '_' + option.id"
                  type="checkbox"
                  :value="option.value"
                  :checked="(data10.value === 0 && option.id === 0) || (data10.value >= option.value * 6 - 5 && data10.value <= option.value * 6)"
                  :name="data10.name"
                  class="blind"
                  disabled
                />
                <label :for="data10.id + '_' + option.id">
                  <span class="icon"></span>
                  <span class="label_t">{{ option.label }}</span>
                </label>
              </div>
            </div>
          </template>
          <div v-if="phpView" class="number_check row">
            <div class="d_inblock mr10">
              <p class="commp">총 :</p>
            </div>
            <div class="d_inblock wid50">
              <div class="m__putbox">
                <input type="number" class="input_box commp tac" :class="{ read_only: view }" :name="data3.name" :value="data3.value" readonly />
              </div>
            </div>
            <div class="d_inblock wid_100">
              <p class="commp ml10">점 ({{ parseInt(data1.value) === 3 ? 18 : 30 }}점 만점)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tooth__con mt30">
      <div v-if="phpView" class="toothbox tac" :class="parseInt(data1.value) === 3 ? 'tooth2' : 'tooth'">
        <div v-for="(php, phpIndex) in php_tooth" :id="php.id" :key="php.id" :class="view ? 'tooth_in' : 'tooth_in_edit'">
          <p class="commp tac">{{ php.label }}</p>
          <div class="tooth_img">
            <a v-for="(toothItem, toothItemIndex) in php.tooth_img" :key="toothItem.value" href="javascript:" :class="toothItem.class" @click="!view ? phpDraw(phpIndex, toothItemIndex) : null"></a>
          </div>
          <a v-if="!view" href="javascript:" class="all_btn active comm__blue_bd_btn tac wid80 btn_m_size2 d_inblock mt10" @click="allCheck(phpIndex)">전체선택</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'PhpBoxVue',
  props: ['dataArray', 'view', 'pdf'],
  data() {
    return {
      title: '',
      data1: '',
      data2: '',
      data3: '',
      data4: '',
      data5: '',
      data6: '',
      data7: '',
      data8: '',
      data9: '',
      data10: '',
      data11: '',
    };
  },
  created() {
    this.title = this.dataArray.title;
    if (this.dataArray.year && this.dataArray.year === '2020') {
      this.data1 = this.formContents.notification2020[this.dataArray.data1];
      this.data2 = this.formContents.notification2020[this.dataArray.data2];
      this.data3 = this.formContents.notification2020[this.dataArray.data3];
      this.data4 = this.formContents.notification2020[this.dataArray.data4];
      this.data5 = this.formContents.notification2020[this.dataArray.data5];
      this.data6 = this.formContents.notification2020[this.dataArray.data6];
      this.data7 = this.formContents.notification2020[this.dataArray.data7];
      this.data8 = this.formContents.notification2020[this.dataArray.data8];
      this.data9 = this.formContents.notification2020[this.dataArray.data9];
    } else {
      this.data1 = this.formContents.notification[this.dataArray.data1];
      this.data2 = this.formContents.notification[this.dataArray.data2];
      this.data3 = this.formContents.notification[this.dataArray.data3];
      this.data4 = this.formContents.notification[this.dataArray.data4];
      this.data5 = this.formContents.notification[this.dataArray.data5];
      this.data6 = this.formContents.notification[this.dataArray.data6];
      this.data7 = this.formContents.notification[this.dataArray.data7];
      this.data8 = this.formContents.notification[this.dataArray.data8];
      this.data9 = this.formContents.notification[this.dataArray.data9];
      this.data10 = this.formContents.notification[this.dataArray.data10];
      this.data11 = this.formContents.notification[this.dataArray.data11];
    }
  },
  computed: {
    ...mapState(['update2']),
    ...mapState('doc', ['formContents', 'php_tooth']),
    ...mapState('student', ['studentInfo']),
    ...mapGetters('user', ['districtCodeFirst']),
    phpView() {
      return [1, 3].includes(parseInt(this.data1.value));
    },
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
    isNumber(e) {
      const charCode = e.which;
      if (charCode < 48 || charCode > 57) {
        e.preventDefault();
        return false;
      }
      return true;
    },
    n_11_simple_valid(e) {
      const isNumber = this.isNumber(e);
      if (!isNumber) {
        return false;
      }
      const value = parseInt(e.target.value + e.key);
      if (value > 18) {
        e.preventDefault();
        return false;
      }
      return true;
    },
    data1Set(e) {
      const value = parseInt(e.target.value);
      this.$store.commit('doc/php_clear');
      this.DATA_SET({ [this.data1.id]: this.data1.value === value ? '' : value });
      this.DATA_SET({ [this.data2.id]: [] });
      this.DATA_SET({ [this.data10.id]: '' });
      this.DATA_SET({ [this.data11.id]: '' });
      this.scoreSet();
    },
    phpDraw(phpIndex, imgIndex) {
      let phpDraw = this.php_tooth;
      const isOn = phpDraw[phpIndex].tooth_img[imgIndex].class.indexOf('on') !== -1;
      if (parseInt(this.data1.value) === 3) {
        const start = phpIndex > 2 === isOn ? 0 : imgIndex;
        const end = phpIndex > 2 === isOn ? imgIndex : 2;
        if (isOn) {
          for (let i = start; i <= end; i++) {
            phpDraw[phpIndex].tooth_img[i].class = phpDraw[phpIndex].tooth_img[i].class.filter(classData => {
              return classData !== 'on';
            });
          }
        } else {
          for (let i = start; i <= end; i++) {
            phpDraw[phpIndex].tooth_img[i].class.push('on');
          }
        }
      } else {
        if (isOn) {
          phpDraw[phpIndex].tooth_img[imgIndex].class = phpDraw[phpIndex].tooth_img[imgIndex].class.filter(classData => {
            return classData !== 'on';
          });
        } else {
          phpDraw[phpIndex].tooth_img[imgIndex].class.push('on');
        }
      }
      this.phpDataSet(phpDraw);
    },
    scoreSet() {
      let score = 0;
      let phpOneScores = [
        {
          name: this.data4.name,
        },
        {
          name: this.data5.name,
        },
        {
          name: this.data6.name,
        },
        {
          name: this.data7.name,
        },
        {
          name: this.data8.name,
        },
        {
          name: this.data9.name,
        },
      ];

      for (let index = 0; index < this.php_tooth.length; index++) {
        const { tooth_img } = this.php_tooth[index];
        let value = [];
        for (let subIndex = 0; subIndex < tooth_img.length; subIndex++) {
          if (tooth_img[subIndex].class.indexOf('on') !== -1) {
            score += 1;
            value.push(tooth_img[subIndex].value);
          }
        }
        this.DATA_SET({ [phpOneScores[index]['name']]: value });
      }
      this.DATA_SET({ [this.data3.id]: score });
    },
    allCheck(phpIndex) {
      let phpDraw = this.php_tooth;
      const { tooth_img } = phpDraw[phpIndex];
      const length = parseInt(this.data1.value) === 3 ? 3 : tooth_img.length;
      for (let subIndex = 0; subIndex < length; subIndex++) {
        if (tooth_img[subIndex].class.indexOf('on') === -1) {
          phpDraw[phpIndex].tooth_img[subIndex].class.push('on');
        }
      }
      this.phpDataSet(phpDraw);
    },
    phpDataSet(phpDraw) {
      this.$store.commit('doc/PHP_SET', phpDraw);
      this.scoreSet();
    },
  },
  watch: {
    update2() {
      const dataList = [this.data4, this.data5, this.data6, this.data7, this.data8, this.data9];
      if (this.dataArray.year && this.dataArray.year === '2020') {
        for (const i in dataList) {
          // php class on
          for (const j in this.php_tooth[i].tooth_img) {
            if (dataList[i].value[this.php_tooth[i].tooth_img[j].value - 1]) {
              // error_suppress
              // eslint-disable-next-line no-unused-vars
              const part = document.getElementsByClassName(this.php_tooth[i].tooth_img[j].class[0])[0];
              this.php_tooth[i].tooth_img[j].class.push('on');
            }
          }
        }

        return;
      }
      for (const i in dataList) {
        // php class on
        for (const j in this.php_tooth[i].tooth_img) {
          if (dataList[i].value.indexOf(this.php_tooth[i].tooth_img[j].value) !== -1) {
            // error_suppress
            // eslint-disable-next-line no-unused-vars
            const part = document.getElementsByClassName(this.php_tooth[i].tooth_img[j].class[0])[0];
            this.php_tooth[i].tooth_img[j].class.push('on');
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.reason_box {
  min-height: 40px;
  padding: 9px 10px;
}
</style>
