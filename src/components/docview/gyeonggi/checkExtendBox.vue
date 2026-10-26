<template>
  <div class="info_box_wrap pd__10_10 flex_wrap_container">
    <div class="info_box" :style="{ width: titleWidth }"><p class="commp c_black tal fwb" v-html="title"></p></div>
    <div v-if="radioView" class="info_box">
      <div class="comm_radio d_inblock">
        <div v-for="option in data1.options" :key="option.id" class="radio_box d_inblock" :class="{ ml25: parseInt(option.id, 10) > 0 }">
          <input
            :id="data1.id + '_' + option.id"
            type="radio"
            :value="option.value"
            :checked="parseInt(data1.value) === option.value"
            :name="data1.name"
            class="blind"
            :disabled="view"
            @change="DATA_SET({ [data1.id]: parseInt($event.target.value) }), n7Event()"
          />
          <label :for="data1.id + '_' + option.id">
            <span class="icon"></span>
            <span class="label_t commp c_black">{{ option.label }}</span>
          </label>
        </div>
      </div>
      <div v-if="view && (extendTextarea || extendCheckbox)" class="d_inblock ml50">
        <!-- 비활성화일때 .off_ver 추가 -->
        <div v-if="extendTextarea" class="textbox off_ver"><div :id="data2.id" :name="data2.name" class="comm__textarea" disabled v-html="data2.value.replace(/(\n)/g, '<br>')"></div></div>
        <div v-else-if="extendCheckbox" class="row">
          <div v-for="option in data2.options" :key="option.id" class="d_inblock hei100" :class="{ ml30: parseInt(option.id, 10) > 0 }">
            <div class="check_set" :class="{ off_ver: data1.value != 1 }">
              <input
                :id="data2.id + '_' + option.id"
                type="checkbox"
                :value="option.value"
                :checked="data2.value.indexOf(option.value) !== -1 || data2.value.indexOf(String(option.value)) !== -1"
                :name="data2.name"
                class="blind"
                disabled
              />
              <label :for="data2.id + '_' + option.id">
                <span class="icon"></span>
                <span class="label_t">{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="checkboxView" class="info_box">
      <div class="row">
        <div v-for="option in data1.options" :key="option.id" class="d_inblock hei100" :class="{ ml30: parseInt(option.id, 10) > 0 }">
          <div class="check_set">
            <input
              :id="data1.id + '_' + option.id"
              type="checkbox"
              :value="option.value"
              :checked="data1.value.indexOf(option.value) !== -1"
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
      <div v-if="view && extendCheckbox" class="comm__line mt30"></div>
      <div v-if="view && (extendTextarea || extendCheckbox)">
        <!-- 비활성화일때 .off_ver 추가 -->
        <div v-if="extendTextarea" class="textbox off_ver">
          <div :id="data2.id" :name="data2.name" class="comm__textarea" style="background-color: #fff; padding: 10px 0 0 0" disabled v-html="data2.value.replace(/(\n)/g, '<br>')"></div>
        </div>
        <div v-else-if="extendCheckbox" class="row">
          <div v-for="option in data2.options" :key="option.id" class="d_inblock hei100" :class="{ ml30: parseInt(option.id, 10) > 0 }">
            <div class="check_set" :class="{ off_ver: data1.value != 1 }">
              <input :id="data2.id + '_' + option.id" type="checkbox" :value="option.value" :checked="data2.value.indexOf(option.value) !== -1" :name="data2.name" class="blind" disabled />
              <label :for="data2.id + '_' + option.id">
                <span class="icon"></span>
                <span class="label_t">{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!view && extendTextarea" class="info_box">
      <!-- 비활성화일때 .off_ver 추가 -->
      <div class="textbox" :class="{ off_ver: offClass }">
        <textarea
          :id="data2.id"
          :name="data2.name"
          class="comm__textarea"
          style="background-color: #fff; padding: 10px 0"
          :placeholder="data2.placeholder"
          :disabled="data2Open"
          :value="data2.value"
          @input="DATA_SET({ [data2.id]: $event.target.value })"
        ></textarea>
      </div>
    </div>
    <div v-else-if="!view && extendCheckbox" class="info_box">
      <div class="row">
        <div v-for="option in data2.options" :key="option.id" class="d_inblock hei100" :class="{ ml30: parseInt(option.id, 10) > 0 }">
          <div class="check_set" :class="{ off_ver: offClass }">
            <input
              :id="data2.id + '_' + option.id"
              type="checkbox"
              :value="option.value"
              :checked="data2.value.indexOf(option.value) !== -1"
              :name="data2.name"
              class="blind"
              :disabled="data2Open"
              @change="DATA_SET({ [data2.id]: parseInt($event.target.value) })"
            />
            <label :for="data2.id + '_' + option.id">
              <span class="icon"></span>
              <span class="label_t">{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'CheckExtendBox',
  props: ['dataArray', 'view'],
  data() {
    return {
      title: '',
      titleWidth: '',
      data1: '',
      data2: '',
      offClass: true,
    };
  },
  created() {
    this.title = this.dataArray.title;
    this.titleWidth = this.dataArray.titleWidth;
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
    radioView() {
      return this.data1.type === 'radio';
    },
    checkboxView() {
      return this.data1.type === 'checkbox';
    },
    extendTextarea() {
      return this.data2 && this.data2.type === 'textarea' && this.data2.value;
    },
    extendCheckbox() {
      return this.data2 && this.data2.type === 'checkbox';
    },
    data2Open() {
      if (parseInt(this.data1.value, 10) !== 1 && !this.data2.active) {
        const typeOf = typeof this.formContents.notification[this.data2.id].value;
        if (typeOf === 'object') {
          // error_suppress
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.formContents.notification[this.data2.id].value = [];
        } else {
          // error_suppress
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.formContents.notification[this.data2.id].value = '';
        }

        if (document.getElementsByName(this.data2.name)) {
          if (typeof document.getElementsByName(this.data2.name) === 'object') {
            const list = document.getElementsByName(this.data2.name);

            for (let index = 0; index < list.length; index++) {
              list[index].value = '';
              list[index].checked = false;
              list[index].selected = false;
            }
          } else {
            document.getElementsByName(this.data2.name).value = '';
          }
        }
        // error_suppress
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.offClass = true;
        return true;
      } else {
        // error_suppress
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.offClass = false;
        return false;
      }
    },
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET']),
    n7Event() {
      // 서울시 학생치과주치의 통보서 치주질환 없음 선택시 치석제거 선택 불가능
      if (!this.view && this.districtCodeFirst === 'A' && this.$route.query.businessDivision.includes('F') && this.data1.id === 'n_7') {
        if (this.data1.value === 0) {
          n_13_check_1.disabled = true;
          const checkFilter = this.formContents.notification.n_13_check.value.filter(value => value !== 2);
          this.DATA_SET({ n_13_check: checkFilter });
          this.DATA_SET({ n_13_2_radio: '' });
          const toothFilter = this.formContents.notification.n_13_tooth.value.filter(value => !value.contents.includes('치석제거'));
          this.DATA_SET({ n_13_tooth: toothFilter });
        } else {
          n_13_check_1.disabled = false;
        }
      }
    },
  },
  watch: {
    update2() {
      this.n7Event();
    },
  },
};
</script>

<style scoped>
.info_box:nth-child(1) {
  width: 120px;
}
.pd__10_10 {
  padding: 10px;
}
.wid__100 > .info_box_wrap {
  align-items: center;
  flex-wrap: nowrap;
}
.wid__100 > .info_box_wrap > .info_box:nth-child(1) {
  flex-shrink: 0;
}
.wid__100 > .info_box_wrap > .info_box:nth-child(2) {
  overflow: auto;
}
.wid__50.mid__box > .info_box_wrap {
  height: 45px;
  align-items: center;
}
.check_set .label_t {
  font-weight: 400;
}
</style>
