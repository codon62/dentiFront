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
              three_block: item.data1.options.length === 3 || item.data1.options.length >= 5,
              four_block: item.data1.options.length === 4,
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
                    STUDENTSURVEY_DATA_SET({ [item.data1.id]: parseInt($event.target.value) });
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
                    class="textarea_box wid100"
                    :class="{ read_only: !item.data1.value.includes(option.value) }"
                    :disabled="!item.data1.value.includes(option.value)"
                    :placeholder="item.data2.placeholder"
                    @input="STUDENTSURVEY_DATA_SET({ [item.data2.id]: $event.target.value })"
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
import { mapMutations, mapState } from 'vuex';

export default {
  props: ['width', 'width2', 'dataArray', 'view', 'pdf'],
  data() {
    return {
      data: [],
    };
  },
  created() {
    for (const i of this.dataArray) {
      let data = { data1: this.formContents.studentSurvey[i.form.data1] };
      if (i.form.data2) {
        data.data2 = this.formContents.studentSurvey[i.form.data2];
      }
      this.data.push(data);
    }
  },
  computed: {
    ...mapState(['update']),
    ...mapState('doc', ['formContents']),
  },
  methods: {
    ...mapMutations('doc', ['STUDENTSURVEY_DATA_SET']),
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
          this.STUDENTSURVEY_DATA_SET({ [name]: '' });
          textbox.disabled = true;
        }
      }
    },
  },
};
</script>
