<template>
  <fragment>
    <div class="form_wrap_question_table mt20 top_container" :class="{ pdfBlock: pdf, form_print_wrap: view }" :style="view ? 'width: 760px' : ''">
      <div class="question_th">
        <div><p class="commp c_black fwb">문항</p></div>
        <div><p class="commp c_black fwb">질문 사항</p></div>
        <div><p class="commp c_black fwb">체크 사항</p></div>
      </div>
    </div>
    <div v-for="(item, index) in data" :key="item.id" class="form_wrap_question_table" :class="{ pdfBlock: pdf, form_print_wrap: view }" :style="view ? 'width: 760px' : ''">
      <div class="question_td">
        <div>
          <p class="commp c_black fwn">{{ dataArray[index].num }}</p>
        </div>
        <div><p class="commp c_black fwn" v-html="item.data1.label"></p></div>
        <div>
          <div
            class="input_container"
            :class="{
              comm_radio: item.data1.type === 'radio',
              check_set: item.data1.type === 'checkbox',
              two_block: item.data1.options.length === 4 && districtCodeFirst === 'J',
              three_block: item.data1.options.length === 3 || item.data1.options.length >= 5,
              four_block: item.data1.options.length === 4 && districtCodeFirst !== 'J',
            }"
          >
            <fragment v-for="option in item.data1.options" :key="option.id">
              <div :class="{ other_box: item.data2 && option.label === '기타' }">
                <input
                  :id="item.data1.id + '_' + option.id"
                  :type="item.data1.type"
                  :value="option.value"
                  :name="item.data1.name"
                  :checked="checked(option.value, item.data1.value)"
                  class="blind"
                  :disabled="view"
                  @change="
                    dataSet($event, item);
                    textarea($event, option.label);
                  "
                />
                <label :for="item.data1.id + '_' + option.id">
                  <span class="icon"></span>
                  <span class="label_t fwn" :class="{ commp: item.data1.type === 'radio', c_black: item.data1.type === 'radio' }" v-html="option.label"></span>
                </label>
                <div v-if="item.data2 && option.label === '기타'" class="textbox" :class="{ hei35: !view }">
                  <div
                    v-if="view"
                    :id="item.data2.id"
                    class="textarea_box wid100"
                    :class="{ read_only: !item.data1.value.includes(option.value) }"
                    v-html="item.data2.value.replace(/(\n)/g, '<br>')"
                  ></div>
                  <textarea
                    v-else
                    :id="item.data2.id"
                    :name="item.data2.name"
                    :value="item.data2.value"
                    cols="30"
                    rows="10"
                    maxlength="100"
                    class="textarea_box wid100"
                    :class="{ read_only: !item.data1.value.includes(option.value) }"
                    :disabled="!item.data1.value.includes(option.value)"
                    :placeholder="item.data2.placeholder"
                    @input="DATA_SET({ [item.data2.id]: $event.target.value })"
                  ></textarea>
                </div>
              </div>
            </fragment>
          </div>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  props: ['width', 'width2', 'dataArray', 'view', 'pdf'],
  data() {
    return {
      data: [],
      brRule: {
        q_9: [2, 5],
        q_9_1: [2],
        q_10: [2, 5, 7],
        q_12: [2, 4, 6],
        q_13: [2],
        q_14: [2],
        q_15_4: [2],
        q_16: [2],
        q_17: [2],
      },
      textboxDisabled: true,
    };
  },
  created() {
    if (this.districtCodeFirst === 'C' && this.view) {
      this.brRule.q_10[1] = 4;
    }
    for (const i of this.dataArray) {
      let data = { data1: this.formContents.questionnaire[i.form.data1] };
      if (i.form.data2) {
        data.data2 = this.formContents.questionnaire[i.form.data2];
      }
      this.data.push(data);
    }
  },
  computed: {
    ...mapState(['update']),
    ...mapState('doc', ['formContents']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
    dataSet(e, item) {
      this.DATA_SET({ [item.data1.id]: parseInt(e.target.value) });
      if (item.data1.id === 'q_9' || item.data1.id === 'q_9_1') {
        const q_9 = this.formContents.questionnaire.q_9.value;
        const q9check = q_9.indexOf(3) !== -1 || q_9.indexOf(4) !== -1 || q_9.indexOf(5) !== -1 || q_9.indexOf('3') !== -1 || q_9.indexOf('4') !== -1 || q_9.indexOf('5') !== -1;
        if (q9check) {
          const q_9_1 = document.getElementsByName('q_9_1');
          for (let i = 0; i < q_9_1.length; i++) {
            q_9_1[i].checked = false;
          }
          this.DATA_SET({ q_9_1: '' });
        }
      }
      if (item.data1.id === 'q_15_3' || item.data1.id === 'q_15_4') {
        const q_15_3 = this.formContents.questionnaire.q_15_3.value;
        if (q_15_3 != 1) {
          const q_15_4 = document.getElementsByName('q_15_4');
          for (let i = 0; i < q_15_4.length; i++) {
            q_15_4[i].checked = false;
          }
          this.DATA_SET({ q_15_4: '' });
        }
      }
      if (this.districtCodeFirst === 'H' && item.data1.id === 'q_13') {
        const q_13 = this.formContents.questionnaire.q_13.value;
        if (parseInt(e.target.value) === 0) {
          this.DATA_SET({ q_13: q_13.filter(value => value === 0) });
        } else {
          this.DATA_SET({ q_13: q_13.filter(value => value !== 0) });
        }
      }
      if (item.data1.id === 'q_23' || item.data1.id === 'q_23_1') {
        const q_23 = this.formContents.questionnaire.q_23.value;
        if (parseInt(q_23) !== 0) {
          const q_23_1 = document.getElementsByName('q_23_1');
          for (let i = 0; i < q_23_1.length; i++) {
            q_23_1[i].checked = false;
          }
          this.DATA_SET({ q_23_1: '' });
        }
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
      const textbox = document.querySelector('textarea[name=' + name + ']');
      if (label === '기타' && textbox) {
        if (event.target.checked) {
          // textbox.parentElement.classList.remove('off_ver');
          textbox.classList.remove('read_only');
          textbox.disabled = false;
        } else {
          // textbox.parentElement.classList.add('off_ver');
          textbox.classList.add('read_only');
          this.DATA_SET({ [name]: '' });
          textbox.disabled = true;
        }
      }
    },
  },
};
</script>
