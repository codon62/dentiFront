<template>
  <div class="form_wrap_check_not_input">
    <div class="">
      <p class="commp c_black tal" v-html="title"></p>
    </div>
    <div class="">
      <div v-for="(option, optionIndex) in data1.options" :key="option.id" class="flex_box" :class="{ mt20: parseInt(option.id, 10) > 0 }">
        <div class="check_set">
          <input
            :id="data1.id + '_' + option.id"
            type="checkbox"
            :value="option.value"
            :checked="data1.value.indexOf(option.value) !== -1"
            :name="data1.name"
            class="blind"
            :disabled="view"
            @click="clickCheck($event, optionIndex, option)"
          />
          <label :for="data1.id + '_' + option.id">
            <span class="icon"></span>
            <span class="label_t">{{ option.label }}</span>
          </label>
        </div>
        <div class="m__putbox">
          <input
            :id="data2[optionIndex].id"
            type="text"
            maxlength="100"
            class="input_box commp"
            :class="{ off_put: data1.value.indexOf(option.value) !== -1, read_only: view }"
            :value="data2[optionIndex].value"
            :placeholder="!view ? data2[optionIndex].placeholder : ''"
            :readonly="view || data1.value.indexOf(option.value) !== -1"
            @input="DATA_SET({ [data2[optionIndex].id]: $event.target.value })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'CheckboxNotInputVue',
  props: ['dataArray', 'view'],
  data() {
    return {
      title: '',
      data1: '',
      data2: '',
    };
  },
  created() {
    this.title = this.dataArray.title;
    if (this.dataArray.year && this.dataArray.year === '2020') {
      this.data1 = this.formContents.notification2020[this.dataArray.data1];
      // 서울 - 전문가 구강위생관리 제외
      if (this.districtCodeFirst === 'A') this.data1.options = this.data1.options.filter(item => item.label !== '전문가 구강위생관리');
      // 부산 - 큐스캔 교육 제외
      else if (this.districtCodeFirst === 'D') this.data1.options = this.data1.options.filter(item => item.label !== '큐스캔 교육');
      if (typeof this.dataArray.data2 === 'object') {
        this.data2 = [];
        for (let index = 0; index < this.dataArray.data2.length; index++) {
          this.data2.push(this.formContents.notification2020[this.dataArray.data2[index]]);
        }
      } else {
        this.data2 = this.formContents.notification2020[this.dataArray.data2];
      }
    } else {
      this.data1 = this.formContents.notification[this.dataArray.data1];
      if (typeof this.dataArray.data2 === 'object') {
        this.data2 = [];
        for (let index = 0; index < this.dataArray.data2.length; index++) {
          this.data2.push(this.formContents.notification[this.dataArray.data2[index]]);
        }
      } else {
        this.data2 = this.formContents.notification[this.dataArray.data2];
      }
    }
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET', 'OBJECT_SPLICE']),
    clickCheck(e, optionIndex, option) {
      const { checked } = e.target;
      const { id, name } = this.data2[optionIndex];
      if (option.appendTable) {
        if (checked) {
          const today = this.getToday().split('-');
          const form = {
            year: today[0],
            month: today[1],
            day: today[2],
            leftTop: ['all'],
            rightTop: [],
            leftBottom: [],
            rightBottom: [],
            contents: option.label,
          };
          this.$store.commit('doc/OBJECT_SET', { n_13_tooth: form });
          document.getElementById(id).setAttribute('readonly', checked);
          document.getElementById(id).classList.add('off_put');
          this.DATA_SET({ [name]: '' });
          document.getElementById(id).value = '';
        } else {
          let index = -1;
          this.formContents.notification.n_13_tooth.value.forEach((value, key) => {
            if (value.contents === option.label) {
              index = key;
            }
          });
          if (index !== -1) {
            this.OBJECT_SPLICE({ n_13_tooth: index });
          }
          document.getElementById(id).removeAttribute('readonly');
          document.getElementById(id).classList.remove('off_put');
        }
      }
      this.DATA_SET({ [this.data1.id]: parseInt(e.target.value) });
    },
    getToday() {
      const date = new window.Date();
      const yyyy = date.getFullYear();
      let dd = date.getDate();
      let mm = date.getMonth() + 1; // January is 0
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      const today = yyyy + '-' + mm + '-' + dd;
      return today;
    },
  },
};
</script>

<style scoped></style>
