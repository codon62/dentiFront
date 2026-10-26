<template>
  <fragment>
    <div class="flex_box">
      <div class="wid212">
        <p class="content_title">
          치과의사명
          <i class="red_dot ml10"></i>
        </p>
        <div class="mt5">
          <select v-model="data1.value" class="select_box_new" @change="doctor($event.target.value)">
            <option v-for="item in doctorList" :key="item.hospitalDoctorId" :value="item.hospitalDoctorId" :selected="item.hospitalDoctorId == data1.value">{{ item.hospitalDoctorName }}</option>
          </select>
        </div>
      </div>
      <div class="ml14" style="flex-grow: 1">
        <p class="content_title">
          면허번호
          <i class="red_dot ml10"></i>
        </p>
        <div class="mt5">
          <input type="text" class="text_box disabled" :value="data3.value" disabled />
        </div>
      </div>
    </div>
    <div class="flex_box mt14">
      <div class="wid212">
        <p class="content_title">
          {{ subject }}일
          <i class="red_dot ml10"></i>
        </p>
        <div class="mt5">
          <date-input v-model="date" :data="data4.value" :customDisabled="disabledPeriod" />
        </div>
      </div>
      <div class="ml14" style="flex-grow: 1">
        <p class="content_title">
          {{ subject }}기관명
          <i class="red_dot ml10"></i>
        </p>
        <div class="mt5">
          <input type="text" class="text_box disabled" :value="data5.value" disabled />
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import Hospital from '@/apis/Hospital';
import DateInput from '@/components/doc/gyeonggi/DateInput';

import { mapMutations, mapState } from 'vuex';

export default {
  name: 'DoctorInfoVue',
  components: {
    DateInput,
  },
  props: ['dataArray', 'hospitalId', 'view', 'addRegist', 'subject', 'disabledPeriod'],
  data() {
    return {
      date: '',
      data1: '',
      data2: '',
      data3: '',
      data4: '',
      data5: '',
      doctorList: [],
    };
  },
  computed: {
    ...mapState(['update2']),
    ...mapState('user', ['userOrganTargetName']),
    ...mapState('doc', ['formContents']),
  },
  created() {
    const type = this.addRegist ? 'notificationAddRegist' : this.dataArray.data1.charAt(0) === 'n' ? 'notification' : this.dataArray.data1.charAt(0) === 't' ? 'treatmentPlan' : 'statement';
    this.data1 = this.formContents[type][this.dataArray.data1];
    this.data2 = this.formContents[type][this.dataArray.data2];
    this.data3 = this.formContents[type][this.dataArray.data3];
    this.data4 = this.formContents[type][this.dataArray.data4];
    this.data5 = this.formContents[type][this.dataArray.data5];
  },
  methods: {
    ...mapMutations('doc', ['DATA_SET', 'ADDREGIST_SET']),
    doctor(id) {
      let index = '';
      for (const i in this.doctorList) {
        if (id == this.doctorList[i].hospitalDoctorId) {
          index = i;
          break;
        }
      }
      if (this.addRegist) {
        this.ADDREGIST_SET({ [this.data1.id]: this.doctorList[index].hospitalDoctorId }); // 의사 고유번호
        this.ADDREGIST_SET({ [this.data2.id]: this.doctorList[index].hospitalDoctorName }); // 의사명
        this.ADDREGIST_SET({ [this.data3.id]: this.doctorList[index].hospitalDoctorLicense }); // 의사 면허번호
      } else {
        this.DATA_SET({ [this.data1.id]: this.doctorList[index].hospitalDoctorId }); // 의사 고유번호
        this.DATA_SET({ [this.data2.id]: this.doctorList[index].hospitalDoctorName }); // 의사명
        this.DATA_SET({ [this.data3.id]: this.doctorList[index].hospitalDoctorLicense }); // 의사 면허번호
      }
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
  watch: {
    date() {
      if (this.addRegist) {
        this.ADDREGIST_SET({ [this.data4.id]: this.date });
      } else {
        this.DATA_SET({ [this.data4.id]: this.date });
      }
    },
    update2() {
      if (!this.view) {
        Hospital.doctorList({ hospitalId: this.hospitalId }).then(res => {
          if (res && res.data.rt === 200) {
            this.doctorList = res.data.doctorList;
            if (!this.doctorList.length) {
              this.$alert('정보 수정 페이지에서 치과의사를 등록해 주세요.', '알림', 'warning').then(() => {
                this.$router.push('/hospital/infoModify');
                return false;
              });
            }
            if (!this.data4.value) {
              this.date = this.getToday();
            }
            if (!this.data5.value) {
              if (this.addRegist) {
                this.ADDREGIST_SET({ [this.data5.id]: this.userOrganTargetName }); //  검진기관명
              } else {
                this.DATA_SET({ [this.data5.id]: this.userOrganTargetName }); //  검진기관명
              }
            }
            for (const item of this.doctorList) {
              if (this.data1.value == item.hospitalDoctorId) {
                return false;
              }
            }
            this.doctor(this.doctorList[0].hospitalDoctorId);
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
