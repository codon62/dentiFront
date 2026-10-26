<template>
  <div class="mt20">
    <div v-if="!data1.value.length" class="comm__bg no_data">
      <p class="tac commp c_gray2 mt10 mb10">{{ districtCodeFirst === 'I' ? '구강' : '예방' }}진료 내역이 없습니다.</p>
    </div>
    <template v-else>
      <div v-for="(data, index) in inaddibleValues" :key="index" class="form_wrap_prevent_care_history" :class="{ mt10: index > 0 }">
        <div>
          <div :style="view ? '' : `width: 230px;`">
            <p class="scommp c_gray2 fwn">진료일자</p>
            <date :data="data.year + '-' + data.month + '-' + data.day" :disabled="view" :redesign="true" @input="changeDate($event, data.contents, index, false)" />
          </div>
          <div class="ml10">
            <p class="scommp c_gray2 fwn">부위</p>
            <div style="display: flex; flex-wrap: wrap; width: 405px">
              <template v-if="data.leftTop.indexOf('all') !== -1 || (districtCodeFirst === 'J' && !!data)">
                <div class="m__putbox mt10 wid200">
                  <input type="text" class="input_box read_only" :value="districtCodeFirst === 'D' && data.contents === '간단한 치석제거' ? '-' : '치아전체'" disabled />
                </div>
                <div class="m__putbox mt10 wid200 ml5"></div>
              </template>
              <template v-else>
                <div class="m__putbox mt10 wid200">
                  <input type="text" :value="data.rightTop" class="input_box" :class="{ bg_white: !view, read_only: view }" disabled />
                </div>
                <div class="m__putbox mt10 wid200 ml5">
                  <input type="text" :value="data.leftTop" class="input_box" :class="{ bg_white: !view, read_only: view }" disabled />
                </div>
                <div class="m__putbox mt5 wid200">
                  <input type="text" :value="data.rightBottom" class="input_box" :class="{ bg_white: !view, read_only: view }" disabled />
                </div>
                <div class="m__putbox mt5 wid200 ml5">
                  <input type="text" :value="data.leftBottom" class="input_box" :class="{ bg_white: !view, read_only: view }" disabled />
                </div>
              </template>
            </div>
            <a v-if="!view && isPopup(data.contents)" href="javascript:;" class="comm__blue_bd_btn d_block mt5 float_none btn_m_size2 wid85" @click="modify(data.contents, index)">수정</a>
          </div>
          <div class="ml10">
            <p class="scommp c_gray2 fwn">진료내용</p>
            <div class="m__putbox mt10">
              <input type="text" class="input_box read_only" :value="data.contents" disabled />
            </div>
            <div v-if="data.contents2" class="m__putbox mt5">
              <input type="text" class="input_box read_only" :value="data.contents2" disabled />
            </div>
          </div>
        </div>
        <a v-if="!view && !isCheckbox(data.contents)" href="javascript:;" class="x_close__btn" @click="OBJECT_SPLICE({ n_13_tooth: index })">
          <img src="@/assets/images/common/ic_close_m.png" alt="삭제" />
        </a>
      </div>
      <div v-if="districtCodeFirst === 'A' && addibleValues.length > 0" class="wrapper_addible">
        <div v-for="(data, index) in addibleValues" :key="index" class="form_wrap_prevent_care_history addible">
          <div>
            <div style="width: 150px">
              <template v-if="index === 0">
                <p class="scommp c_gray2 fwn">진료내용</p>
                <div class="m__putbox mt10">
                  <input type="text" class="input_box read_only" :value="data.contents" disabled />
                </div>
                <div v-if="data.contents2" class="m__putbox mt5">
                  <input type="text" class="input_box read_only" :value="data.contents2" disabled />
                </div>
              </template>
            </div>
            <div class="ml20" :style="view ? '' : `width: 280px;`">
              <p class="scommp c_gray2 fwn">진료일자</p>
              <date :data="data.year + '-' + data.month + '-' + data.day" :disabled="view" :redesign="true" @input="changeDate($event, data.contents, index, true)" />
              <a v-if="!view && index === addibleValues.length - 1" href="javascript:;" class="comm__blue_bd_btn d_block btn_m_size2 commp fwn mt5" @click="addDate(data)">일자 추가</a>
            </div>
            <div class="ml20">
              <p class="scommp c_gray2 fwn">부위</p>
              <div style="display: flex; flex-wrap: wrap; width: 405px">
                <template v-if="data.leftTop.indexOf('all') !== -1 || (districtCodeFirst === 'J' && !!data)">
                  <div class="m__putbox mt10 wid200">
                    <input type="text" class="input_box read_only" :value="districtCodeFirst === 'D' && data.contents === '간단한 치석제거' ? '-' : '치아전체'" disabled />
                  </div>
                  <div class="m__putbox mt10 wid200 ml5"></div>
                </template>
                <template v-else>
                  <div class="m__putbox mt10 wid200">
                    <input type="text" :value="data.rightTop" class="input_box" :class="{ bg_white: !view, read_only: view }" disabled />
                  </div>
                  <div class="m__putbox mt10 wid200 ml5">
                    <input type="text" :value="data.leftTop" class="input_box" :class="{ bg_white: !view, read_only: view }" disabled />
                  </div>
                  <div class="m__putbox mt5 wid200">
                    <input type="text" :value="data.rightBottom" class="input_box" :class="{ bg_white: !view, read_only: view }" disabled />
                  </div>
                  <div class="m__putbox mt5 wid200 ml5">
                    <input type="text" :value="data.leftBottom" class="input_box" :class="{ bg_white: !view, read_only: view }" disabled />
                  </div>
                </template>
              </div>
            </div>
            <div v-if="!view" class="form_edit_btn_wrap">
              <a class="form_delete_x_btn" @click="xButton(data.contents, index)">
                <img src="@/assets/images/common/ic_close_m.png" alt="삭제" />
              </a>
              <a href="javascript:;" class="comm__blue_bd_btn mt5 btn_m_size2 wid150 d_block" @click="modify(data.contents, index)">수정</a>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Date from '@/components/common/Date.vue';
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    Date,
  },
  props: ['dataArray', 'view'],
  data() {
    return {
      data1: [],
    };
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapGetters('user', ['districtCodeFirst']),
    addibleValues() {
      return this.data1.value.filter(value => value.contents === this.getLabel('n_13_check', 1));
    },
    inaddibleValues() {
      const data1Value = this.data1.value;
      return this.districtCodeFirst === 'A' ? data1Value.filter(value => value.contents !== this.getLabel('n_13_check', 1)) : data1Value;
    },
  },
  created() {
    this.data1 = this.formContents.notification[this.dataArray.data1];
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET', 'OBJECT_SPLICE']),
    getOriginIndex(label, index, isAadible) {
      let count = 0;
      for (let i = 0; i < this.data1.value.length; i++) {
        if (this.data1.value[i].contents === label) {
          if (isAadible) {
            if (count === index) {
              return i;
            }
            count++;
          } else {
            return i;
          }
        }
      }
    },
    modify(label, index) {
      const originIndex = this.getOriginIndex(label, index, true);
      this.$store.dispatch('popup/popupOpen', { contents: 'addTreatment', params: { index: originIndex, label: this.data1.value[originIndex].contents } });
    },
    isCheckbox(contents) {
      const options = [...this.formContents.notification.n_13_check.options, ...this.formContents.notification.n_13_check.options2];
      for (const i in options) {
        if (options[i].sub) {
          const options3 = this.formContents.notification[options[i].sub].options;
          for (const j in options3) {
            if (contents === `${options[i].label}(${options3[j].label})`) {
              return true;
            }
          }
        } else if (contents === options[i].label) {
          return true;
        }
      }
      const options2 = this.formContents.notification.n_13.options;
      for (const i in options2) {
        if (contents === options2[i].label) {
          return true;
        }
      }
      return false;
    },
    isPopup(contents) {
      const options = this.formContents.notification.n_13_check.options;
      for (const i in options) {
        if (options[i].sub) {
          const options3 = this.formContents.notification[options[i].sub].options;
          for (const j in options3) {
            if (contents === `${options[i].label}(${options3[j].label})` && !options3[j].popup) {
              return false;
            }
          }
        } else if (contents === options[i].label && !options[i].popup) {
          return false;
        }
      }
      const options2 = this.formContents.notification.n_13.options;
      for (const i in options2) {
        if (contents === options2[i].label && !options2[i].popup) {
          return false;
        }
      }
      return true;
    },
    changeDate(date, label, index, isAadible) {
      const originIndex = this.getOriginIndex(label, index, isAadible);
      const form = {
        year: date.split('-')[0],
        month: date.split('-')[1],
        day: date.split('-')[2],
      };
      this.$store.commit('doc/OBJECT_MODIFY', { index: originIndex, id: 'n_13_tooth', form: form });
    },
    getLabel(data, id) {
      return this.formContents.notification[data].options.find(value => value.id === id).label;
    },
    addDate(data) {
      this.$store.dispatch('popup/popupOpen', { contents: 'addTreatment', params: { contentsIndex: data.contentsIndex, label: data.contents } });
    },
    xButton(label, index) {
      this.OBJECT_SPLICE({ n_13_tooth: this.getOriginIndex(label, index, true) });
      if (this.addibleValues.length === 0) {
        const checkFilter = this.formContents.notification.n_13_check.value.filter(value => value !== 1);
        this.DATA_SET({ n_13_check: checkFilter });
      }
    },
  },
};
</script>
