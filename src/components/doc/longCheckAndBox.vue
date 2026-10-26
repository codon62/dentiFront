<template>
  <div>
    <p v-if="!!dataStatus" class="commp6 mt-5 mb10" :style="{ color: dataStatus === 'red' ? '#f76868' : dataStatus === 'yellow' ? '#ffb259' : dataStatus === 'green' ? '#3cc798' : '#757779' }">
      {{
        dataStatus === 'red'
          ? '치료가 필요한 치아 상태입니다'
          : dataStatus === 'yellow'
          ? '주의가 필요한 치아 상태입니다'
          : dataStatus === 'green'
          ? '치아상태가 정상입니다'
          : dataStatus === 'gray'
          ? '주치의의 기타의견이 있습니다'
          : ''
      }}
    </p>
    <div class="form_wrap_long_check_box">
      <div class=""><p class="commp c_black tal" v-html="title"></p></div>
      <div class="">
        <div v-if="data1View" class="row">
          <div v-for="option in data1.options" :key="option.id" class="wid100 mt5">
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
              <label :for="data1.id + '_' + option.id">
                <span class="icon"></span>
                <span class="label_t">{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>
        <div v-if="extendTextarea" :class="data1View ? 'mt5' : 'row'">
          <!-- 비활성화일때 .off_ver 추가 -->
          <div class="textbox ml20" style="height: 90px">
            <textarea
              v-if="!view"
              :id="data2.id"
              :name="data2.name"
              class="textarea_box wid100"
              maxlength="100"
              :class="{ read_only: view || guitarDisabled }"
              :placeholder="data2.placeholder"
              :disabled="view || guitarDisabled"
              :value="data2.value"
              @input="DATA_SET({ [data2.id]: $event.target.value })"
            ></textarea>
            <div v-else :id="data2.id" :name="data2.name" class="textarea_box wid100" v-html="data2.value.replace(/(\n)/g, ' ')" :class="{ read_only: view }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex';

export default {
  name: 'CheckExtendBoxVue',
  props: ['dataArray', 'view'],
  data() {
    return {
      title: '',
      data1: '',
      data2: '',
      guitarDisabled: false,
    };
  },
  created() {
    this.title = this.dataArray.title;
    this.data1 = this.formContents.notification[this.dataArray.data1];
    this.data2 = this.formContents.notification[this.dataArray.data2];
  },
  computed: {
    ...mapState(['update2']),
    ...mapState('doc', ['formContents']),
    ...mapGetters('user', ['districtCodeFirst']),
    data1View() {
      return !!this.data1;
    },
    extendTextarea() {
      return this.data2 && this.data2.type === 'textarea';
    },
    dataStatus() {
      if (this.districtCodeFirst === 'J' && this.dataArray.data1 === 'n_17') {
        if (this.data1.value.some(value => [1, 2, 3, 4, 5, 6].includes(value))) {
          return 'red';
        }
        if (this.data1.value.some(value => [7].includes(value))) {
          return 'yellow';
        }
        if (this.data1.value.some(value => [0].includes(value))) {
          return 'green';
        }
        if (this.data1.value.some(value => [8].includes(value))) {
          return 'gray';
        }
      }
      return '';
    },
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
    dataSet(value) {
      this.DATA_SET({ [this.data1.id]: value });
      this.changeGuitarDisabled();
      this.clearData2();
    },
    changeGuitarDisabled() {
      if (this.data1View) {
        const lastVal = this.data1.options[this.data1.options.length - 1].value;
        this.guitarDisabled = this.data1.value.indexOf(lastVal) === -1 && this.data1.value.indexOf(String(lastVal)) === -1;
      }
    },
    clearData2() {
      if (this.guitarDisabled) {
        this.DATA_SET({ [this.data2.id]: '' });
      }
    },
  },
  watch: {
    update2() {
      this.changeGuitarDisabled();
    },
  },
};
</script>

<style scoped></style>
