<template>
  <div class="flex_set">
    <div class="flex_item flex_size_m">
      <p class="fwb mt20 commp2">판정 치과의사</p>
      <p class="scommp c_gray2 fwn mt10">
        치과의사명
        <span class="c_red">*</span>
      </p>
      <div v-if="!view" class="mt10">
        <select :value="data1.value" class="comm_select wid250 m__putbox" @change="doctor($event.target.value)">
          <option v-for="item in doctorList" :key="item.hospitalDoctorId" :value="item.hospitalDoctorId" :selected="item.hospitalDoctorId == data1.value">{{ item.hospitalDoctorName }}</option>
        </select>
      </div>
      <div v-else class="m__putbox mt10 wid250"><input type="text" class="comm_put read_put" :value="data2.value" readonly /></div>
    </div>
    <div class="flex_item flex_size_m ml20">
      <p class="scommp c_gray2 fwn">
        면허번호
        <span class="c_red">*</span>
      </p>
      <div class="m__putbox mt10 wid250"><input type="text" class="comm_put read_put" :value="data3.value" readonly /></div>
    </div>
    <div class="flex_item ml60">
      <p class="fwb mt30 commp2">{{ subject }}일 및 {{ subject }}기관</p>
      <p class="scommp c_gray2 fwn mt10">
        {{ subject }}일
        <span class="c_red">*</span>
      </p>
      <div v-if="view" class="m__putbox mt10 wid250"><input type="text" class="comm_put read_put" :value="data4.value" disabled /></div>
      <date v-else v-model="date" :data="data4.value" :customDisabled="disabledPeriod" />
    </div>
    <div class="flex_item flex_size_m4 ml20">
      <p class="scommp c_gray2 fwn">
        {{ subject }}기관명
        <span class="c_red">*</span>
      </p>
      <div class="m__putbox mt10 wid250"><input type="text" class="comm_put read_put" :value="data5.value" disabled /></div>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import Date from '@/components/common/Date.vue';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'DoctorInfoVue',
  components: { Date },
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
    let type = '';
    if (this.addRegist) {
      type = 'notificationAddRegist';
    } else {
      const prefix = this.dataArray.data1.split('_')[0];
      if (prefix === 'n') {
        type = 'notification';
      } else if (prefix === 't') {
        type = 'treatmentPlan';
      } else if (prefix === 'tt') {
        type = 'treatmentRequest';
      } else if (prefix === 'tn') {
        type = 'intensiveNotification';
      } else {
        type = 'statement';
      }
    }
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
