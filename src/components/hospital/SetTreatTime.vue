<template>
  <div class="popup_content">
    <v-popuptitle message="진료시간 설정" imgsrc="sub/ic_clock_30.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver pt30">
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
      <div class="comm__line mt30"></div>
      <p class="commp2 fwb mt30">비정기 휴진일</p>
      <div class="m__putbox date__box mt20 wid250 d_inblock">
        <span class="date_put"><input id="hol1" type="text" class="comm_put" placeholder="년" maxlength="4" @input="valid('hol1', nextYear, 'hol2')" /></span>
        <span class="blit">/</span>
        <span class="date_put"><input id="hol2" type="text" class="comm_put" placeholder="월" maxlength="2" @input="valid('hol2', 12, 'hol3')" /></span>
        <span class="blit">/</span>
        <span class="date_put"><input id="hol3" type="text" class="comm_put" placeholder="일" maxlength="2" @input="valid('hol3', 31, 'hol4')" /></span>
      </div>
      <div class="d_inblock time__blit mt20">~</div>
      <div class="m__putbox date__box mt20 wid250 d_inblock">
        <span class="date_put"><input id="hol4" type="text" class="comm_put" placeholder="년" maxlength="4" @input="valid('hol4', nextYear, 'hol5')" /></span>
        <span class="blit">/</span>
        <span class="date_put"><input id="hol5" type="text" class="comm_put" placeholder="월" maxlength="2" @input="valid('hol5', 12, 'hol6')" /></span>
        <span class="blit">/</span>
        <span class="date_put"><input id="hol6" type="text" class="comm_put" placeholder="일" maxlength="2" @input="valid('hol6', 31)" /></span>
      </div>
      <a href="javascript:;" class="d_inblock wid110 c_gray3 commp ml10 btn_m_size2 comm__gray_bd_btn fwn mt20" @click="addHolDate">
        <img src="@/assets/images/common/ic_bluecheck_off.png" />
        추가
      </a>
      <div v-for="(day, index) in holidayList" :key="`${day.hospitalHolidayStartDate}~${day.hospitalHolidayEndDate}`" class="row mt20">
        <div class="d_inblock">
          <div class="d_inblock commp c_black2">
            <span class="">{{ day.hospitalHolidayStartDate + ' ~ ' + day.hospitalHolidayEndDate }}</span>
          </div>
          <a href="javascript:;" class="comm__gray_bd_btn tac d_inblock wid55 btn_s_size ml10 scommp c_gray2" @click="holidayList.splice(index, 1)">삭제</a>
        </div>
      </div>
      <div class="comm__line mt30"></div>
      <v-popupconfirm message="저장" @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import { mapState } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
  },
  data() {
    return {
      treatYoil: {
        MO: { time: ['', '', '', ''], closed: false },
        TU: { time: ['', '', '', ''], closed: false },
        WE: { time: ['', '', '', ''], closed: false },
        TH: { time: ['', '', '', ''], closed: false },
        FR: { time: ['', '', '', ''], closed: false },
        SA: { time: ['', '', '', ''], closed: false },
        SU: { time: ['', '', '', ''], closed: true },
        HO: { time: ['', '', '', ''], closed: true },
      },
      lunchTime: ['', '', '', ''],
      holidayList: [],
    };
  },
  computed: {
    ...mapState('hospital', ['hospitalInfo']),
    ...mapState('business', ['businessYear']),
    ...mapState('status', ['dayWeeks']),
    intBusinessYear() {
      return parseInt(this.businessYear);
    },
    nextYear() {
      return this.intBusinessYear + 1;
    },
  },
  created() {
    for (const yoil in this.treatYoil) {
      const treatDateTime = this.hospitalInfo.treatDateTimeList.find(o => o.hospitalTreatDateTimeYoil === yoil);
      if (treatDateTime) {
        const start = treatDateTime.hospitalTreatDateTimeStart.split(':');
        const end = treatDateTime.hospitalTreatDateTimeEnd.split(':');
        this.treatYoil[yoil] = {
          time: [start[0], start[1], end[0], end[1]],
          closed: false,
        };
        continue;
      }
      const closedYoil = this.hospitalInfo.treatClosedYoilList.find(o => o === yoil);
      if (closedYoil) {
        this.treatYoil[yoil].closed = true;
      }
    }
    this.holidayList.push(...this.hospitalInfo.holidayList);
    this.lunchTime = ((this.hospitalInfo.treatTime.lunchStartTime || ':') + ':' + (this.hospitalInfo.treatTime.lunchEndTime || ':')).split(':');
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
    addHolDate() {
      let hol = [
        document.getElementById('hol1').value,
        document.getElementById('hol2').value,
        document.getElementById('hol3').value,
        document.getElementById('hol4').value,
        document.getElementById('hol5').value,
        document.getElementById('hol6').value,
      ];

      for (const i in hol) {
        if (!hol[i].length || hol[i] <= 0) {
          return false;
        } // 모든 값이 입력되지 않은 경우 비활성화
        if (i % 3 === 0) {
          if (hol[i] < this.intBusinessYear || hol[i] > this.nextYear) {
            this.$alert('정확한 연도를 입력해 주세요.', '알림', 'error');
            return false;
          }
        } else {
          while (hol[i].length < 2) {
            hol[i] = '0' + hol[i];
          }
        }
      }

      // 월 / 일 validation (32 이상은 input 입력에서 막음)
      if ((['04', '06', '09', '11'].indexOf(hol[1]) !== -1 && hol[2] > 30) || (['04', '06', '09', '11'].indexOf(hol[4]) !== -1 && hol[5] > 30)) {
        this.$alert('존재하지 않는 날짜입니다.', '알림', 'error');
        return false;
      } else if (hol[1] === '02') {
        const num = hol[0] % 4 === 0 && (hol[0] % 100 !== 0 || hol[0] % 400 === 0) ? 29 : 28;
        if (hol[2] > num) {
          this.$alert('존재하지 않는 날짜입니다.', '알림', 'error');
          return false;
        }
      } else if (hol[4] === '02') {
        const num = hol[3] % 4 === 0 && (hol[3] % 100 !== 0 || hol[3] % 400 === 0) ? 29 : 28;
        if (hol[5] > num) {
          this.$alert('존재하지 않는 날짜입니다.', '알림', 'error');
          return false;
        }
      } else {
        if (hol[0] > hol[3] || (hol[0] === hol[3] && hol[1] > hol[4]) || (hol[0] === hol[3] && hol[1] === hol[4] && hol[2] > hol[5])) {
          this.$alert('시작일과 종료일이 맞지 않습니다.', '알림', 'error');
          return false;
        }
      }

      const startDate = hol[0] + '-' + hol[1] + '-' + hol[2];
      const endDate = hol[3] + '-' + hol[4] + '-' + hol[5];
      for (const i of this.holidayList) {
        if (startDate === i.hospitalHolidayStartDate && endDate === i.hospitalHolidayEndDate) {
          this.$alert('이미 존재하는 휴진일입니다.', '알림', 'error');
          return false;
        }
      }
      const dayInfo = {
        hospitalHolidayStartDate: startDate,
        hospitalHolidayEndDate: endDate,
      };
      this.holidayList.push(dayInfo);
    },
    save() {
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
        holidayList: this.holidayList,
      };
      this.$store.commit('hospital/setItem', items);
      this.$store.dispatch('popup/popupClose');
    },
  },
};
</script>
