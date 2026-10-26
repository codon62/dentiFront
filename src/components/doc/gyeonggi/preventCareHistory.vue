<template>
  <fragment>
    <div v-if="!data1.value.length" class="comm__bg no_data">
      <p class="tac content_title mt10 mb10" style="display: block">예방진료 내역이 없습니다.</p>
    </div>
    <div v-for="(data, index) in data1.value" v-else :key="index" class="prevent_care_history_wrap_g" :class="{ mt35: index > 0 }">
      <p class="info_label">예방진료내역 {{ index + 1 }}</p>
      <div class="flex_box">
        <div style="width: 230px">
          <p class="content_title">
            진료일자
            <i class="red_dot ml10"></i>
          </p>
          <date-input class="mt5" :data="data.year + '-' + data.month + '-' + data.day" :customDisabled="disabledPeriod" @input="changeDate($event, index)" />
        </div>
        <div class="ml14" style="flex-grow: 1">
          <p class="content_title">진료내용</p>
          <div class="mt5">
            <input type="text" class="text_box disabled" :value="data.contents" disabled />
          </div>
        </div>
      </div>

      <div class="mt14">
        <p class="content_title">
          부위
          <i class="red_dot ml10"></i>
        </p>
        <div class="mt5 flex_box" style="align-items: flex-end">
          <div class="flex_wrap" style="width: 438px">
            <template v-if="data.leftTop.indexOf('all') !== -1">
              <div class="wid212">
                <input type="text" class="text_box disabled" :value="districtCodeFirst === 'D' && data.contents === '치석제거' ? '-' : '치아전체'" disabled />
              </div>
              <div class="wid212 ml14">
                <input type="text" class="text_box disabled" disabled />
              </div>
              <div class="wid212 mt14">
                <input type="text" class="text_box disabled" disabled />
              </div>
              <div class="wid212 mt14 ml14">
                <input type="text" class="text_box disabled" disabled />
              </div>
            </template>
            <template v-else>
              <div class="wid212">
                <input type="text" :value="data.rightTop" class="text_box" disabled />
              </div>
              <div class="wid212 ml14">
                <input type="text" :value="data.leftTop" class="text_box" disabled />
              </div>
              <div class="wid212 mt14">
                <input type="text" :value="data.rightBottom" class="text_box" disabled />
              </div>
              <div class="wid212 mt14 ml14">
                <input type="text" :value="data.leftBottom" class="text_box" disabled />
              </div>
            </template>
          </div>
          <div class="ml14">
            <a v-if="isPopup(data.contents)" href="javascript:;" class="part_edit_button" @click="modify(index)">
              <i class="icon"></i>
              부위 수정하기
            </a>
          </div>
        </div>
      </div>
      <a v-if="!isCheckbox(data.contents)" href="javascript:;" class="x_close__btn" @click="OBJECT_SPLICE({ n_13_tooth: index })">
        <img src="@/assets/images/common/ic_close_m.png" alt="삭제" />
      </a>
    </div>
  </fragment>
</template>

<script>
import DateInput from '@/components/doc/gyeonggi/DateInput';
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    DateInput,
  },
  props: ['dataArray', 'disabledPeriod'],
  data() {
    return {
      data1: [],
    };
  },
  computed: {
    ...mapState('doc', ['formContents']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
  created() {
    this.data1 = this.formContents.notification[this.dataArray.data1];
  },
  methods: {
    ...mapMutations('doc', ['OBJECT_SPLICE']),
    modify(index) {
      this.$store.dispatch('popup/popupOpen', { contents: 'addTreatment', params: { index: index, label: this.data1.value[index].contents } });
    },
    isCheckbox(contents) {
      const options = this.formContents.notification.n_13_check.options;
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
    changeDate(date, index) {
      const form = {
        year: date.split('-')[0],
        month: date.split('-')[1],
        day: date.split('-')[2],
      };
      this.$store.commit('doc/OBJECT_MODIFY', { index: index, id: 'n_13_tooth', form: form });
    },
  },
};
</script>
