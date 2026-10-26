<template>
  <fragment>
    <p class="commp2 fwb mt20">의뢰기관 정보</p>
    <div class="row flex_set flex_left mt20">
      <div class="flex_item flex_size_m5">
        <p class="commp fwn">
          보건소명
          <span class="c_red">*</span>
        </p>
        <div class="mt10 wid100 m__putbox"><input type="text" class="comm_put read_put" :value="formContents.intensiveRequest.tr_hel_name.value" readonly /></div>
      </div>
      <div class="flex_item flex_size_m5 ml20">
        <p class="commp fwn">
          담당 공무원명
          <span class="c_red">*</span>
        </p>
        <div class="mt10 wid100 m__putbox">
          <input
            type="text"
            class="comm_put"
            :value="formContents.intensiveRequest.tr_orm_name.value"
            placeholder="담당 공무원명을 입력해 주세요."
            @input="TR_DATA_SET({ tr_orm_name: $event.target.value })"
          />
        </div>
      </div>
      <div class="flex_item flex_size_m5 ml20">
        <p class="commp fwn">
          전화번호
          <span class="c_red">*</span>
        </p>
        <div class="mt10 wid100 m__putbox">
          <input
            type="number"
            class="comm_put"
            :value="formContents.intensiveRequest.tr_orm_tel.value"
            placeholder="전화번호를 입력해 주세요."
            @keypress="isNumber($event)"
            @input="TR_DATA_SET({ tr_orm_tel: $event.target.value })"
          />
        </div>
      </div>
      <div class="flex_item flex_size_m5 ml20">
        <p class="commp fwn">FAX</p>
        <div class="mt10 wid100 m__putbox">
          <input type="text" class="comm_put" :value="formContents.intensiveRequest.tr_fax.value" placeholder="FAX를 입력해 주세요." @input="TR_DATA_SET({ tr_fax: $event.target.value })" />
        </div>
      </div>
    </div>
    <div class="row flex_set flex_left mt20">
      <div class="flex_item flex_size_m5">
        <p class="commp fwn">
          진료의뢰일
          <span class="c_red">*</span>
        </p>
        <date v-model="date" :data="formContents.intensiveRequest.tr_date.value" />
      </div>
    </div>
  </fragment>
</template>

<script>
import Management from '@/apis/Management';
import Date from '@/components/common/Date.vue';
import { mapMutations, mapState } from 'vuex';

export default {
  components: { Date },
  props: ['status'],
  data() {
    return {
      date: '',
    };
  },
  computed: {
    ...mapState(['update']),
    ...mapState('user', ['userOrganTargetId', 'userOrganTargetName']),
    ...mapState('doc', ['formContents']),
  },
  methods: {
    ...mapMutations('doc', ['TR_DATA_SET']),
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
    isNumber(e) {
      const charCode = e.which;
      if (charCode < 48 || charCode > 57) {
        e.preventDefault();
      } else {
        return true;
      }
    },
  },
  watch: {
    date() {
      this.TR_DATA_SET({ tr_date: this.date });
    },
    update() {
      this.TR_DATA_SET({ tr_hel_name: this.userOrganTargetName });
      if (!this.formContents.intensiveRequest.tr_date.value) {
        this.date = this.getToday();
      }
      if (!this.status) {
        Management.healthCareInfo({ healthCareId: this.userOrganTargetId }).then(res => {
          if (res && res.data.rt === 200) {
            if (this.formContents.intensiveRequest.tr_orm_name.value === '') {
              this.TR_DATA_SET({ tr_orm_name: res.data.healthCareInfo.userOrganManagerName });
            }
            if (this.formContents.intensiveRequest.tr_orm_name.value === '') {
              this.TR_DATA_SET({ tr_orm_name: res.data.healthCareInfo.userOrganManagerName });
            }
            const form = {
              tr_orm_name: res.data.healthCareInfo.userOrganManagerName,
              tr_orm_tel: res.data.healthCareInfo.userOrganManagerTel,
            };
            this.TR_DATA_SET(form);
          } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        });
      }
    },
  },
};
</script>

<style scoped></style>
