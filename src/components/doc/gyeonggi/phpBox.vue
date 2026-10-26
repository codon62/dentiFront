<template>
  <div class="comm__form php_box_wrap mt24" :class="{ pdfBlock: pdf }">
    <p class="content_title">
      구강환경관리능력검사(치면세균막검사) 총점 (0~5점: 우수, 6~10: 보통, 11~30점: 개선요망)
      <i v-if="required" class="red_dot ml10"></i>
    </p>
    <div class="flex_box mt5">
      <div v-for="option in data1.options" :key="option.id" class="radio_button" :class="{ ml14: parseInt(option.id, 10) > 0 }">
        <input :id="data1.id + '_' + option.id" type="radio" :value="option.value" :checked="data1.value === option.value" :name="data1.name" class="blind" @change="data1Set" />
        <label :for="data1.id + '_' + option.id">
          <span class="icon"></span>
          <span class="label_t">{{ option.label }}</span>
        </label>
      </div>
      <transition name="slide-fade">
        <div v-if="phpView" class="number_check row ml50">
          <div class="d_inblock mr10">
            <p class="content_sub_title score_text">총 :</p>
          </div>
          <div class="d_inblock wid50">
            <input type="number" class="text_box tac" style="padding: 0 10px" :name="data3.name" :value="data3.value" readonly />
          </div>
          <div class="d_inblock wid_100"><p class="content_sub_title score_text ml10">점 (30점 만점)</p></div>
        </div>
      </transition>
    </div>
    <input :id="data4.id" type="hidden" :name="data4.name" :value="data4.value" />
    <input :id="data5.id" type="hidden" :name="data5.name" :value="data5.value" />
    <input :id="data6.id" type="hidden" :name="data6.name" :value="data6.value" />
    <input :id="data7.id" type="hidden" :name="data7.name" :value="data7.value" />
    <input :id="data8.id" type="hidden" :name="data8.name" :value="data8.value" />
    <input :id="data9.id" type="hidden" :name="data9.name" :value="data9.value" />
    <transition name="fade">
      <div v-if="parseInt(this.data1.value) <= 0" class="mt14">
        <p class="content_title">미실시 사유 :</p>
        <div class="flex_box mt5">
          <div v-for="option in data2.options" :key="option.id" class="check_button" :class="{ ml14: parseInt(option.id, 10) > 0 }">
            <input
              :id="data2.id + '_' + option.id"
              type="checkbox"
              :value="option.value"
              :checked="data2.value.indexOf(option.value) !== -1"
              :name="data2.name"
              class="blind"
              @change="DATA_SET({ [data2.id]: parseInt($event.target.value) })"
            />
            <label :for="data2.id + '_' + option.id">
              <span class="icon"></span>
              <span class="label_t">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="phpView" class="tooth__con mt30" style="position: relative">
        <div class="flex_box">
          <p class="tooth_text_container commp fwb">상악</p>
          <p class="tooth_text_container commp fwb">하악</p>
        </div>
        <div class="flex_box mt10 tooth" style="justify-content: space-between">
          <div v-for="(php, phpIndex) in php_tooth" :id="php.id" :key="php.id" class="tooth_in" :class="{ line_break: phpIndex === 4 }">
            <p class="commp tac">{{ php.label }}</p>
            <div class="tooth_img">
              <a v-for="(toothItem, toothItemIndex) in php.tooth_img" :key="toothItem.value" href="javascript:" :class="toothItem.class" @click="phpDraw(phpIndex, toothItemIndex)"></a>
            </div>
            <a href="javascript:" class="all_btn active comm__blue_bd_btn tac wid80 btn_m_size2 d_inblock" @click="allCheck(phpIndex)">전체선택</a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'PhpBox',
  props: ['dataArray', 'required', 'pdf'],
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
    }
  },
  computed: {
    ...mapState(['update2']),
    ...mapState('doc', ['formContents', 'php_tooth']),
    phpView() {
      return this.data1.value == 1;
    },
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
    data1Set(e) {
      this.$store.commit('doc/php_clear');
      this.DATA_SET({ [this.data1.id]: parseInt(e.target.value) });
      this.DATA_SET({ [this.data2.id]: [] });
      this.scoreSet();
    },
    phpDraw(phpIndex, imgIndex) {
      let phpDraw = this.php_tooth;
      if (phpDraw[phpIndex].tooth_img[imgIndex].class.indexOf('on') !== -1) {
        phpDraw[phpIndex].tooth_img[imgIndex].class = phpDraw[phpIndex].tooth_img[imgIndex].class.filter(classData => {
          return classData !== 'on';
        });
      } else {
        phpDraw[phpIndex].tooth_img[imgIndex].class.push('on');
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
      for (let subIndex = 0; subIndex < tooth_img.length; subIndex++) {
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
.score_text {
  color: #767a83;
}
.tooth_text_container {
  text-align: center;
  flex-basis: 50%;
}
.tooth_container > p {
  padding-bottom: 10px;
}
.tooth_in {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.line_break::before {
  content: '';
  width: 1px;
  position: absolute;
  top: 0;
  left: 50%;
  bottom: 0;
  background-color: #e6e6e6;
}
</style>
