<template>
  <div class="flex__box_center pd__0_10">
    <div class="wid120 flex__item_fix">
      <p class="commp c_black tal fwb">
        {{ title }}
        <span class="c_red ml5">*</span>
      </p>
    </div>
    <div class="ml30 ovf__auto pd__10">
      <div v-for="(option, optionIndex) in data1.options" :key="option.id" class="flex__box_start" :class="{ mt10: parseInt(option.id, 10) > 0 }">
        <div class="wid180 flex__item_fix">
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
        </div>
        <div class="pl__20 ovf__auto">
          <div class="commp fwn">{{ data2[optionIndex].value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'CheckboxNotInput',
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
    this.data1 = this.formContents.notification[this.dataArray.data1];
    if (typeof this.dataArray.data2 === 'object') {
      this.data2 = [];
      for (let index = 0; index < this.dataArray.data2.length; index++) {
        this.data2.push(this.formContents.notification[this.dataArray.data2[index]]);
      }
    } else {
      this.data2 = this.formContents.notification[this.dataArray.data2];
    }
  },
  computed: {
    ...mapState('doc', ['formContents']),
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

<style scoped>
.flex__box_center {
  display: flex;
  align-items: center;
}
.flex__box_start {
  display: flex;
  align-items: flex-start;
}
.flex__item_fix {
  flex-shrink: 0;
}
.ovf__auto {
  overflow: auto;
}
.pd__10 {
  padding: 10px;
}
.pl__20 {
  padding-left: 20px;
}
</style>
