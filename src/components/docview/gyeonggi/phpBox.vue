<template>
  <div class="comm__form mt30">
    <p v-if="phpView" class="scommp c_red">* 총점 [0~5점:우수, 6~10:보통, 11~30점:개선요망]</p>
    <div class="form__row pd__10_20 border__all" :class="phpView ? 'mt10' : 'mt30'">
      <div class="flex_set">
        <div style="flex-shrink: 0">
          <p class="commp c_black tal fwb">
            구강환경관리능력검사
            <span class="c_red d_inblock ml5">*</span>
            <br />
            (치면세균막 검사)
          </p>
        </div>
        <div class="ml10">
          <div class="comm_radio">
            <div v-for="option in data1.options" :key="option.id" class="radio_box d_inblock" :class="{ ml30: parseInt(option.id, 10) > 0 }">
              <input
                :id="data1.id + '_' + option.id"
                type="radio"
                :value="option.value"
                :checked="data1.value === option.value"
                :name="data1.name"
                class="blind"
                :disabled="view"
                @change="DATA_SET({ [data1.id]: parseInt($event.target.value) })"
              />
              <label :for="data1.id + '_' + option.id">
                <span class="icon"></span>
                <span class="label_t">{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="ml10">
          <input :id="data4.id" type="hidden" :name="data4.name" :value="data4.value" />
          <input :id="data5.id" type="hidden" :name="data5.name" :value="data5.value" />
          <input :id="data6.id" type="hidden" :name="data6.name" :value="data6.value" />
          <input :id="data7.id" type="hidden" :name="data7.name" :value="data7.value" />
          <input :id="data8.id" type="hidden" :name="data8.name" :value="data8.value" />
          <input :id="data9.id" type="hidden" :name="data9.name" :value="data9.value" />
          <div v-if="parseInt(this.data1.value) === 0" class="check_set">
            <div class="d_inblock wid_100">
              <p class="commp c_black fwb">미실시 사유 :</p>
            </div>
            <div v-for="option in data2.options" :key="option.id" class="radio_box d_inblock" :class="{ ml30: parseInt(option.id, 10) > 0 }">
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
          </div>
          <div v-if="phpView" class="number_check row">
            <div class="d_inblock wid30">
              <p class="commp c_black fwb">총 :</p>
            </div>
            <div class="d_inblock wid_100">
              <p class="commp">{{ data3.value }} 점 (30점 만점)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="phpView" class="tooth__con border__all border__except_top">
      <div class="toothwrap tac">
        <div class="toothbox tooth">
          <p class="commp fwb">상악</p>
          <div v-for="(php, phpIndex) in php_tooth.slice(0, 3)" :id="php.id" :key="php.id" class="tooth_in d_inblock">
            <p class="commp tac">{{ php.label }}</p>
            <div class="tooth_img">
              <a v-for="(toothItem, toothItemIndex) in php.tooth_img" :key="toothItem.value" href="javascript:" :class="toothItem.class" @click="!view ? phpDraw(phpIndex, toothItemIndex) : null"></a>
            </div>
            <a v-if="!view" href="javascript:" class="all_btn active comm__blue_bd_btn tac wid80 btn_m_size2 d_inblock" @click="allCheck(phpIndex)">전체선택</a>
          </div>
        </div>
        <div class="toothbox tooth">
          <p class="commp fwb">하악</p>
          <div v-for="(php, phpIndex) in php_tooth.slice(3, 6)" :id="php.id" :key="php.id" class="tooth_in d_inblock">
            <p class="commp tac">{{ php.label }}</p>
            <div class="tooth_img">
              <a v-for="(toothItem, toothItemIndex) in php.tooth_img" :key="toothItem.value" href="javascript:" :class="toothItem.class" @click="!view ? phpDraw(phpIndex, toothItemIndex) : null"></a>
            </div>
            <a v-if="!view" href="javascript:" class="all_btn active comm__blue_bd_btn tac wid80 btn_m_size2 d_inblock" @click="allCheck(phpIndex)">전체선택</a>
          </div>
        </div>
      </div>
    </div>
    <p v-if="phpView" class="scommp c_red mt10">* 빨간색으로 표시된 부분은 치면세균막이 있는 부분이니 양치질에 신경써 주세요.</p>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'PhpBox',
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
    };
  },
  created() {
    this.title = this.dataArray.title;
    this.data1 = this.formContents.notification[this.dataArray.data1];
    this.data2 = this.formContents.notification[this.dataArray.data2];
    this.data3 = this.formContents.notification[this.dataArray.data3];
    this.data4 = this.formContents.notification[this.dataArray.data4];
    this.data5 = this.formContents.notification[this.dataArray.data5];
    this.data6 = this.formContents.notification[this.dataArray.data6];
    this.data7 = this.formContents.notification[this.dataArray.data7];
    this.data8 = this.formContents.notification[this.dataArray.data8];
    this.data9 = this.formContents.notification[this.dataArray.data9];
  },
  computed: {
    ...mapState(['update2']),
    ...mapState('doc', ['formContents', 'php_tooth']),
    phpView() {
      return this.data1.value === 1;
    },
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
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
.pd__10_20 {
  padding: 10px 20px;
}
.flex_set {
  align-items: center;
}
.wid20 {
  width: 20px;
}
input[type='number'] {
  letter-spacing: 0;
}
.border__all {
  border: 1px solid #e6e6e6;
}
.border__except_top {
  border-top-width: 0;
}
.toothwrap {
  display: flex;
}
.toothbox {
  padding: 10px;
  flex-basis: 50%;
}
.toothbox:nth-child(1) {
  border-right: 1px solid #e6e6e6;
}
.toothbox > p {
  padding-bottom: 10px;
}
.tooth_in {
  padding: 0 !important;
}
</style>
