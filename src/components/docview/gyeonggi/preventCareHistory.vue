<template>
  <div class="mt10">
    <div v-if="!data1.value.length" class="border__all">
      <p class="tac commp tac mt10 mb10">예방진료 내역이 없습니다.</p>
    </div>
    <div v-for="(data, index) in data1.value" v-else :key="index" class="form__row border__all" :class="{ border__except_top: index > 0 }">
      <div class="flex__box_center pd__0_10">
        <div class="flex__box_center flex__item_fix wid200">
          <p class="commp c_black tal fwb flex__item_fix wid50">진료내용</p>
          <div class="ml20 fwn">{{ data.contents }}</div>
        </div>
        <div class="flex__box_center ml10" style="flex-grow: 1">
          <p class="commp c_black tal fwb flex__item_fix wid30">부위</p>
          <div v-if="data.leftTop.indexOf('all') !== -1" class="flex_set ml10">
            <div class="fwn" style="padding: 10px">치아전체</div>
            <div class="ml30"></div>
          </div>
          <div v-else class="flex_wrap_container ml10">
            <div class="flex__item border__all border__bottom">
              <input type="text" :value="data.rightTop" class="comm_put" :class="{ bg_white: !view, read_eb: view }" style="background-color: #fff !important; padding: 10px" disabled />
            </div>
            <div class="flex__item border__all border__bottom ml10">
              <input type="text" :value="data.leftTop" class="comm_put" :class="{ bg_white: !view, read_eb: view }" style="background-color: #fff !important; padding: 10px" disabled />
            </div>
            <div class="flex__item">
              <input type="text" :value="data.rightBottom" class="comm_put" :class="{ bg_white: !view, read_eb: view }" style="background-color: #fff !important; padding: 10px" disabled />
            </div>
            <div class="flex__item ml10">
              <input type="text" :value="data.leftBottom" class="comm_put" :class="{ bg_white: !view, read_eb: view }" style="background-color: #fff !important; padding: 10px" disabled />
            </div>
          </div>
          <a v-if="!view && isPopup(data.contents)" href="javascript:;" class="comm__blue_bd_btn d_block mt5 float_none btn_m_size2 wid85" @click="modify(index)">수정</a>
        </div>
        <div class="wid150 flex__item_fix ml30">
          <p class="commp c_black tal fwb d_inblock">진료일자</p>
          <p class="commp d_inblock ml10 fwn">{{ data.year }}.{{ data.month }}.{{ data.day }}</p>
        </div>
      </div>
      <a v-if="!view && !isCheckbox(data.contents)" href="javascript:;" class="x_close__btn" @click="OBJECT_SPLICE({ n_13_tooth: index })">
        <img src="@/assets/images/common/ic_close_m.png" alt="삭제" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  name: 'PreventCareHistory',
  props: ['dataArray', 'view'],
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

<style scoped lang="scss">
.border__all {
  border: 1px solid #e6e6e6;
}
.border__except_top {
  border-top-width: 0;
}
.border__bottom {
  border-width: 0 0 1px 0;
}
.pd__0_10 {
  padding: 0 10px;
  background-color: #fff;
}
.flex__box_center {
  display: flex;
  align-items: center;
}
.flex__item_fix {
  flex-shrink: 0;
}
.flex__item {
  @include box-sizing(border-box);

  width: 48%;
}
.comm_put {
  color: #343c58;
}
</style>
