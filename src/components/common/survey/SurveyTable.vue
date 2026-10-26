<template>
  <fragment>
    <div class="comm__form form__row form__tit_row">
      <div class="survey__heading">
        <p class="commp5 fwb c_white">{{ surveyHeader }}</p>
      </div>
    </div>
    <!-- <div class="form__row mt10"> -->
    <div
      v-for="(item, key) in data"
      :id="setName === 'block1' ? `q_box_${item.data1.id}` : `q_box_${item.data1.id}`"
      :key="item.data1.id"
      class="comm__form form__row"
      :class="{ mt30: key === 0, mt10: key > 0 }"
      style="border-radius: 10px"
    >
      <div class="survey__item">
        <div class="question__box">
          <span class="commp5 c_black fwb" style="margin-right: 10px">{{ dataArray[key].num }}</span>
          <span class="commp c_black" v-html="item.data1.label"></span>
        </div>
        <div class="answer__box">
          <div v-if="item.data1.type === 'textarea'" class="d_block textbox mt10 ml25" style="height: 90px">
            <textarea
              :id="item.data1.id"
              :name="item.data1.name"
              :value="item.data1.value"
              class="comm__textarea wid100"
              :placeholder="item.data1.placeholder"
              @input="DATA_SET({ [item.data1.id]: $event.target.value })"
            ></textarea>
          </div>
          <div v-else :class="{ comm_radio: item.data1.type === 'radio', check_set: item.data1.type === 'checkbox' }">
            <div v-for="option in item.data1.options" :key="option.id" class="answer__item">
              <div class="">
                <input
                  :id="item.data1.id + '_' + option.id"
                  :type="item.data1.type"
                  :value="option.value"
                  :name="item.data1.name"
                  :checked="checked(option.value, item.data1.value)"
                  class="blind"
                  @change="
                    dataSet($event, item);
                    textarea($event, option.label);
                  "
                />
                <label :for="item.data1.id + '_' + option.id">
                  <span class="icon"></span>
                  <span class="label_t" :class="{ commp: item.data1.type === 'radio', c_black: item.data1.type === 'radio' }" v-html="option.label"></span>
                </label>
              </div>
            </div>
          </div>
          <div v-if="item.data2" :id="setName === 'block1' ? `textbox_${item.data2.id}` : `textbox_${item.data2.id}`" class="d_block textbox mt10 ml25 off_ver" style="height: 90px">
            <textarea
              :id="item.data2.id"
              :name="item.data2.name"
              :value="item.data2.value"
              class="comm__textarea wid100"
              disabled
              :placeholder="item.data2.placeholder"
              @input="dataSet($event, item, 'textarea')"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SurveyTable',
  props: ['dataArray', 'surveyHeader', 'setName', 'valid', 'formKind'],
  data() {
    return {
      data: [],
      textboxDisabled: true,
    };
  },
  computed: {
    ...mapState('doc', ['formContents']),
  },
  created() {
    for (const i of this.dataArray) {
      let data = { data1: this.formContents[this.formKind][i.form.data1] };
      if (i.form.data2) {
        data.data2 = this.formContents[this.formKind][i.form.data2];
      }
      this.data.push(data);
    }
  },
  methods: {
    DATA_SET(payload) {
      this.$store.commit('doc/DATA_SET', Object.assign(payload, { formKind: this.formKind }));
    },
    dataSet(e, item, type) {
      if (type === 'textarea') {
        if (this.valid) {
          // textarea red border 제거
          this.removeRedBorder(this.findParentElement(e, 'textbox_'));
        }
        // textarea 일 때 값 셋팅
        this.DATA_SET({ [item.data2.id]: e.target.value });
      } else {
        if (this.valid) {
          // check box의 textarea red border 있을 시 체크 해제 했을 때 제거
          if (e.target.id === 'q_7_7') {
            this.removeRedBorder(document.getElementById('textbox_q_7_input'));
          }
          // radio, check box red border 제거
          this.removeRedBorder(this.findParentElement(e, 'q_box'));
        }
        // radio or check box 일 때 값 셋팅
        this.DATA_SET({ [item.data1.id]: parseInt(e.target.value) });
      }
    },
    checked(optionVal, itemVal) {
      if (typeof itemVal === 'object') {
        return itemVal.indexOf(optionVal) !== -1;
      } else {
        return itemVal === optionVal;
      }
    },
    textarea(event, label) {
      // textarea disabled
      const name = event.target.name.split('[')[0] + '_input';
      const textbox = document.querySelector(`textarea[name=${name}]`);
      if (event.target.name === 'q_9') {
        if (event.target.value === 5) {
          if (event.target.checked) {
            textbox.parentElement.classList.remove('off_ver');
            textbox.disabled = false;
          }
        } else {
          // radio box의 textarea red border 있을 시 다른 번호 선택했을 때 제거
          this.removeRedBorder(document.getElementById('textbox_q_9_input'));
          textbox.parentElement.classList.add('off_ver');
          this.DATA_SET({ [name]: '' });
          textbox.disabled = true;
        }
      }
      if (label === '기타' && textbox) {
        if (event.target.checked) {
          textbox.parentElement.classList.remove('off_ver');
          textbox.disabled = false;
        } else {
          textbox.parentElement.classList.add('off_ver');
          this.DATA_SET({ [name]: '' });
          textbox.disabled = true;
        }
      }
    },
    findParentElement(e, id) {
      // id로 해당되는 부모요소 찾기
      let cmp = null;
      let parent = e.target.parentElement;
      while (parent && !cmp) {
        if (parent.id.includes(id)) {
          cmp = parent;
        }
        parent = parent.parentElement;
      }
      return cmp;
    },
    removeRedBorder(element) {
      element.classList.remove('red__border');
    },
  },
  watch: {
    update() {
      const area = document.getElementsByTagName('textarea');
      for (let i = 0; i < area.length - 1; i++) {
        if (this.formContents.questionnaire[area[i].id].value !== '') {
          area[i].parentElement.classList.remove('off_ver');
          area[i].disabled = false;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.survey__heading {
  padding: 5px 10px;
  background-color: #0868f1;
}
.survey__heading > p {
  word-spacing: 3px;
  letter-spacing: 3px;
}
.survey__item {
  padding: 20px;
}
.question__box {
  padding: 10px;
}
.answer__box {
  padding: 10px;
}
.answer__item {
  padding: 5px;
}
.answer__item:hover {
  background-color: #e0e7f1;
}
.answer__item label {
  display: block;
  cursor: pointer;
}
.comm__textarea {
  @include border-radius(10px);
}
.check_set .label_t {
  float: none;
}
.check_set label .icon {
  margin-top: 5px;
}
.red__border {
  @include border-radius(10px);

  border: 1px solid #d94f4f;
  position: relative;
}
.red__border::before {
  content: '필수 항목 입니다';
  color: #d94f4f;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  left: 40px;
  bottom: 5px;
}
</style>
