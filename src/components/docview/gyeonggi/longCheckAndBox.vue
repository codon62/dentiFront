<template>
  <div class="flex__box_center pd__10_10">
    <div class="wid120 flex__item_fix"><p class="commp c_black tal" v-html="title"></p></div>
    <div class="ml10">
      <div v-if="data1View" class="flex_wrap_container">
        <div v-for="(option, index) in data1.options" :key="option.id" class="flex__item" :class="{ flex__item_etc: option.label === '기타', mt10: index > 0 }">
          <div class="check_set">
            <input
              :id="data1.id + '_' + option.id"
              type="checkbox"
              :value="option.value"
              :checked="data1.value.indexOf(option.value) !== -1"
              :name="data1.name"
              class="blind"
              :disabled="view"
              @change="dataSet(parseInt($event.target.value))"
            />
            <label style="display: flex" :for="data1.id + '_' + option.id">
              <span class="icon"></span>
              <span v-if="option.label_G_1" class="label_t">
                {{ option.label_G_1 }}
                <br />
                {{ option.label_G_2 }}
              </span>
              <span v-else class="label_t">{{ option.label }}</span>
            </label>
            <div v-if="data2 && option.label === '기타'" class="textbox ml10">
              <!--            <div class="textbox ml10 fwn mt10">-->
              <textarea
                v-if="!view"
                :id="data2.id"
                :name="data2.name"
                class=""
                :placeholder="data2.placeholder"
                :disabled="view || otherDisabled"
                :class="{ read_only: view || otherDisabled }"
                :value="data2.value"
                @input="DATA_SET({ [data2.id]: $event.target.value })"
              ></textarea>
              <div v-else :id="data2.id" class="textarea_box" :class="{ read_only: view || otherDisabled }" v-html="data2.value.replace(/(\n)/g, '<br>')"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'CheckExtendBox',
  props: ['dataArray', 'view'],
  data() {
    return {
      title: '',
      data1: '',
      data2: '',
      otherDisabled: false,
    };
  },
  created() {
    this.title = this.dataArray.title;
    this.data1 = this.formContents.notification[this.dataArray.data1];
    this.data2 = this.formContents.notification[this.dataArray.data2];
    this.changeOtherDisabled();
  },
  computed: {
    ...mapState('doc', ['formContents']),
    data1View() {
      return !!this.data1;
    },
    extendTextarea() {
      return this.data2 && this.data2.type === 'textarea';
    },
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
    dataSet(value) {
      this.DATA_SET({ [this.data1.id]: value });
      this.changeOtherDisabled();
      this.clearData2();
    },
    changeOtherDisabled() {
      if (this.data1View) {
        const lastVal = this.data1.options[this.data1.options.length - 1].value;
        this.otherDisabled = this.data1.value.indexOf(lastVal) === -1 && this.data1.value.indexOf(String(lastVal)) === -1;
      }
    },
    clearData2() {
      if (this.otherDisabled) {
        this.DATA_SET({ [this.data2.id]: '' });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.flex__item {
  flex-basis: 100%;
}
.flex__item_etc {
  align-self: flex-start;
  padding-right: 10px;
  .check_set {
    display: flex;
    align-items: center;
    label {
      flex-shrink: 0;
      //position: relative;
      //&::before {
      //  content: '';
      //  width: 1px;
      //  height: 15px;
      //  position: absolute;
      //  top: 50%;
      //  margin-top: -6.25px;
      //  right: 0;
      //  background-color: #e6e6e6;
      //}
    }
    .textbox {
      width: calc(100% - 200px);
    }
    .textarea_box {
      min-height: 33px;
      padding: 5px 10px;
    }
  }
}
.flex__box_center {
  display: flex;
  align-items: center;
}
.check_set label .icon,
.flex__item_fix {
  flex-shrink: 0;
}
</style>
