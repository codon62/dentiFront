<template>
  <div class="sub__content form__ver_1 mt30">
    <div class="browser__con">
      <div class="bg_white mt20 tac" style="width: 800px; margin: 0 auto; padding: 50px; box-sizing: border-box">
        <div class="iconbox"><img src="@/assets/images/sub/ic_hospital_o.png" /></div>
        <p class="commp3 mt15 fwb">진료 시간 설정</p>
        <p v-if="districtCodeFirst === 'C'" class="commp mt15 c_black2">
          학생이 사용하는 덴티아이경기 APP에 진료시간이 게시되오니
          <br />
          정확한 진료 시간을 입력해 주세요.
        </p>
        <div class="basic__form_box mt30">
          <p class="commp2 fwb">요일별 진료시간</p>
          <p class="commp mt10 c_red">※ 휴진이 아닌 모든 진료시간의 각 항목을 2자리로 입력해 주세요.</p>
          <div v-for="(day, key) in dayWeeks" :key="key" class="mt10 row">
            <div class="d_inblock mcommp2 c_black2 mr20">
              {{ day }}
            </div>
            <div class="time__box" :style="treatYoil[key].closed ? 'background-color: #ebebeb;' : null">
              <input :id="`${key}_treat1`" type="text" :value="treatYoil[key].time[0]" :disabled="treatYoil[key].closed" maxlength="2" @input="valid(`${key}_treat1`, 23, `${key}_treat2`)" />
              <span>:</span>
              <input :id="`${key}_treat2`" type="text" :value="treatYoil[key].time[1]" :disabled="treatYoil[key].closed" maxlength="2" @input="valid(`${key}_treat2`, 59, `${key}_treat3`)" />
            </div>
            <div class="d_inblock time__blit">~</div>
            <div class="time__box" :style="treatYoil[key].closed ? 'background-color: #ebebeb;' : null">
              <input :id="`${key}_treat3`" type="text" :value="treatYoil[key].time[2]" :disabled="treatYoil[key].closed" maxlength="2" @input="valid(`${key}_treat3`, 23, `${key}_treat4`)" />
              <span>:</span>
              <input :id="`${key}_treat4`" type="text" :value="treatYoil[key].time[3]" :disabled="treatYoil[key].closed" maxlength="2" @input="valid(`${key}_treat4`, 59)" />
            </div>
            <div class="d_inblock ml20">
              <div class="check_set">
                <input :id="`${key}_closed`" type="checkbox" value="Y" class="blind" :checked="treatYoil[key].closed" @change="treatClose(key, $event.target.checked)" />
                <label :for="`${key}_closed`">
                  <span class="icon"></span>
                  <span class="label_t fwb">휴진</span>
                </label>
              </div>
            </div>
          </div>
          <p class="commp2 fwb mt30">점심시간</p>
          <div class="mt20 row">
            <div class="d_inblock">
              <div class="time__box">
                <input id="lunch1" type="number" class="comm__put" :value="lunchTime[0]" maxlength="2" @input="valid('lunch1', 23, 'lunch2')" />
                <span>:</span>
                <input id="lunch2" type="number" class="comm__put" :value="lunchTime[1]" maxlength="2" @input="valid('lunch2', 59, 'lunch3')" />
              </div>
              <div class="d_inblock time__blit">~</div>
              <div class="time__box">
                <input id="lunch3" type="number" class="comm__put" :value="lunchTime[2]" maxlength="2" @input="valid('lunch3', 23, 'lunch4')" />
                <span>:</span>
                <input id="lunch4" type="number" class="comm__put" :value="lunchTime[3]" maxlength="2" @input="valid('lunch4', 59)" />
              </div>
            </div>
          </div>
        </div>
        <div class="row tac mt30"></div>
        <a href="javascript:;" class="d_inblock comm__blue_btn btn_m_size2" style="width: 160px" @click="infoModify">병원 정보 등록하기</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import _ from 'lodash';
import Hospital from '@/apis/Hospital';

export default {
  data() {
    return {
      treatYoil: {
        MO: { time: ['09', '00', '18', '00'], closed: false },
        TU: { time: ['09', '00', '18', '00'], closed: false },
        WE: { time: ['09', '00', '18', '00'], closed: false },
        TH: { time: ['09', '00', '18', '00'], closed: false },
        FR: { time: ['09', '00', '18', '00'], closed: false },
        SA: { time: ['09', '00', '18', '00'], closed: false },
        SU: { time: ['', '', '', ''], closed: true },
        HO: { time: ['', '', '', ''], closed: true },
      },
      lunchTime: ['12', '00', '13', '00'],
    };
  },
  computed: {
    ...mapState('hospital', ['hospitalInfo']),
    ...mapState('business', ['businessYear']),
    ...mapState('status', ['dayWeeks']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode']),
    intBusinessYear() {
      return parseInt(this.businessYear);
    },
    nextYear() {
      return this.intBusinessYear + 1;
    },
  },
  methods: {
    valid(id, max, next) {
      const ele = document.getElementById(id);
      ele.value = ele.value.replace(/[^0-9]/g, ''); // 숫자만 통과
      if (ele.value > max) {
        // 최댓값 제한
        ele.value = '';
      }
      if (id.indexOf('lunch') !== -1) {
        // 점심시간 data 업데이트
        this.lunchTime[id.charAt(5) - 1] = ele.value;
      } else if (id.indexOf('treat') !== -1) {
        // 진료시간 data 업데이트
        const idSplit = id.split('_treat');
        this.treatYoil[idSplit[0]].time[idSplit[1] - 1] = ele.value;
      }
      if (next && ele.value.length === ele.maxLength) {
        // 포커스 이동
        document.getElementById(next).focus();
      }
    },
    treatClose(yoil, checked) {
      this.treatYoil[yoil] = { time: ['', '', '', ''], closed: checked };
    },
    infoModify() {
      let treatDateTimeList = [];
      let treatClosedYoilList = [];
      for (const yoil in this.treatYoil) {
        if (!this.treatYoil[yoil].closed) {
          for (let i = 0; i < this.treatYoil[yoil].time.length; i++) {
            if (this.treatYoil[yoil].time[i].length !== 2) {
              this.$alert('휴진이 아닌 모든 진료시간의 각 항목을 2자리로 입력해 주세요.', '알림', 'warning');
              return false;
            }
          }
          treatDateTimeList.push({
            hospitalTreatDateTimeYoil: yoil,
            hospitalTreatDateTimeStart: `${this.treatYoil[yoil].time[0]}:${this.treatYoil[yoil].time[1]}`,
            hospitalTreatDateTimeEnd: `${this.treatYoil[yoil].time[2]}:${this.treatYoil[yoil].time[3]}`,
          });
        } else {
          treatClosedYoilList.push(yoil);
        }
      }
      for (const i in this.lunchTime) {
        if (this.lunchTime[i].length !== 2) {
          this.$alert('점심시간의 각 항목을 2자리로 입력해 주세요.', '알림', 'warning');
          return false;
        }
      }
      const treatTime = {
        lunchStartTime: this.lunchTime[0] + ':' + this.lunchTime[1],
        lunchEndTime: this.lunchTime[2] + ':' + this.lunchTime[3],
      };
      this.$store.commit('hospital/HPT_SET', { treatTime: treatTime });

      const items = {
        treatDateTimeList: treatDateTimeList,
        treatClosedYoilList: treatClosedYoilList,
      };
      this.$store.commit('hospital/setItem', items);

      let hospitalInfo = _.cloneDeep(this.hospitalInfo);
      // code convert
      hospitalInfo.hospital.hospitalBusinessDivisionC = this.valueToCode('C0008', hospitalInfo.hospital.hospitalBusinessDivisionC);
      hospitalInfo.hospital.hospitalBusinessDivisionF = this.valueToCode('C0008', hospitalInfo.hospital.hospitalBusinessDivisionF);
      hospitalInfo.hospital.hospitalBusinessDivisionE = this.valueToCode('C0008', hospitalInfo.hospital.hospitalBusinessDivisionE);
      hospitalInfo.hospital.hospitalTreatDisabledPerson = this.valueToCode('C0060', hospitalInfo.hospital.hospitalTreatDisabledPerson);
      hospitalInfo.manager.userOrganManagerAlarm = this.valueToCode('C0018', hospitalInfo.manager.userOrganManagerAlarm);
      for (let i = 0; i < hospitalInfo.treatDateTimeList.length; i++) {
        hospitalInfo.treatDateTimeList[i].hospitalTreatDateTimeYoil = this.valueToCode('C0011', hospitalInfo.treatDateTimeList[i].hospitalTreatDateTimeYoil);
      }
      for (let i = 0; i < hospitalInfo.treatClosedYoilList.length; i++) {
        hospitalInfo.treatClosedYoilList[i] = this.valueToCode('C0011', hospitalInfo.treatClosedYoilList[i]);
      }
      for (let i = 0; i < hospitalInfo.doctorList.length; i++) {
        hospitalInfo.doctorList[i].hospitalDoctorRepresent = this.valueToCode('C0017', hospitalInfo.doctorList[i].hospitalDoctorRepresent);
      }
      // code convert end

      Hospital.infoModify(hospitalInfo).then(res => {
        if (res && res.data.rt === 200) {
          this.$alert('등록되었습니다.', '알림', 'success').then(() => {
            this.$emit('change');
          });
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>
