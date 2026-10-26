<template>
  <div class="popup_content">
    <v-popuptitle :message="`${isTreatmentRequest ? '진료 의뢰 ' : ''}병원 지정`" imgsrc="sub/ic_clock_30.png"></v-popuptitle>
    <div class="popup__con_inner bg__form_ver pt30">
      <div class="row flex_set flex_left">
        <div class="flex_item">
          <div class="m__putbox wid120"><input type="text" class="comm_put read_put" :value="isTreatmentRequest ? districtName : dataObject.districtGunguName" readonly /></div>
        </div>
        <div class="flex_item ml20">
          <!-- 인풋 안에 검색 버튼 추가 시  .search__put 추가 -->
          <div class="m__putbox search__put">
            <input v-model="hospitalAddress" type="text" class="comm_put wid150" placeholder="주소 검색" @keyup.enter="search" />
            <a href="javascript:;" class="search_btn" @click="search"><img src="@/assets/images/common/ic_search_30.png" /></a>
          </div>
        </div>
        <div class="flex_item ml20">
          <!-- 인풋 안에 검색 버튼 추가 시  .search__put 추가 -->
          <div class="m__putbox search__put">
            <input v-model="hospitalName" type="text" class="comm_put wid300" placeholder="병원명 검색" @keyup.enter="search" />
            <a href="javascript:;" class="search_btn" @click="search"><img src="@/assets/images/common/ic_search_30.png" /></a>
          </div>
        </div>
      </div>
      <div class="hospital__con mt20">
        <div v-for="row in list" :key="row[0].hospitalId" class="hospital__row">
          <div v-for="item in row" :key="item.hospitalId" class="hospital__box inner--left">
            <div class="tit__row row">
              <div class="inner--left">
                <p class="commp2 c_black2 fwn">{{ item.hospitalName }}</p>
              </div>
              <div class="inner--right">
                <a href="javascript:;" class="comm__blue_btn wid55 btn_s_size d_block" @click="regist(item)">지정</a>
              </div>
            </div>
            <div class="comm__line mt20"></div>
            <div class="info__box mt20">
              <div class="d_inblock">
                <p class="ico__fixed scommp c_black2 fwn">
                  <span class="fixed"><img src="@/assets/images/common/ic_pin_15.png" /></span>
                  {{ item.hospitalAddress }}
                </p>
              </div>
            </div>
            <div class="info__box">
              <div class="d_inblock">
                <p class="ico__fixed scommp c_black2 fwn">
                  <span class="fixed"><img src="@/assets/images/common/ic_telephone_15.png" /></span>
                  {{ item.hospitalTel }}
                </p>
              </div>
            </div>
            <div class="info__box mt5">
              <div class="inner--left" style="width: 50%">
                <p class="ico__fixed commp c_black2 fwn">
                  <span class="fixed"><img src="@/assets/images/common/ic_clock_15.png" /></span>
                  <span v-for="day in item.left" :key="day.yoil">
                    {{ dayWeeks[day.yoil] }} &nbsp;&nbsp;{{ day.text }}
                    <br />
                  </span>
                  <span>점심시간 &nbsp;&nbsp;{{ item.hospitalLunchTime ? item.hospitalLunchTime : '미설정' }}</span>
                </p>
              </div>
              <div class="inner--right" style="width: 50%">
                <p class="ico__fixed commp c_black2 fwn">
                  <span class="fixed"><img src="@/assets/images/common/ic_closed_15.png" /></span>
                  <span v-for="day in item.right" :key="day.yoil" class="c_red">
                    {{ dayWeeks[day.yoil] }} &nbsp;&nbsp;{{ day.text }}
                    <br />
                  </span>
                  <span v-for="date in item.holidayList" :key="date.hospitalHolidayId" class="c_red">
                    {{ date.hospitalHolidayStartDate + ' ~ ' + date.hospitalHolidayEndDate }} &nbsp;&nbsp;휴무
                    <br />
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <v-pager :data="pager" :popup="true" @vclick="appointHospitalList"></v-pager>
      </div>
      <!--//hospital__con-->
    </div>
  </div>
</template>

<script>
import Management from '@/apis/Management';
import popupTitle from '@/components/popup/PopupTitle.vue';
import Pager from '@/components/common/Pager.vue';
import { mapGetters, mapState } from 'vuex';
import Hospital from '@/apis/Hospital';

export default {
  props: ['dataObject'],
  computed: {
    ...mapState('user', ['districtName']),
    ...mapState('status', ['dayWeeks']),
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode']),
    isTreatmentRequest() {
      return this.dataObject.designationType === 'treatmentRequest';
    },
  },
  components: {
    'v-popuptitle': popupTitle,
    'v-pager': Pager,
  },
  data() {
    return {
      pager: {},
      list: [],
      hospitalAddress: '',
      hospitalName: '',
      formHospitalAddress: '',
      formHospitalName: '',
    };
  },
  created() {
    this.appointHospitalList(1);
  },
  methods: {
    search() {
      this.formHospitalAddress = this.hospitalAddress;
      this.formHospitalName = this.hospitalName;
      this.appointHospitalList(1);
    },
    regist(item) {
      this.isTreatmentRequest ? this.treatmentRequestRegist(item) : this.hptDesignation(item);
    },
    treatmentRequestRegist(item) {
      this.$confirm('', '알림', 'question', { html: `<strong>${item.hospitalName}</strong><br/>해당 병원으로 진료 의뢰하시겠습니까?` })
        .then(() => {
          this.$store.commit('loading', true);
          const form = Object.assign({}, this.dataObject.form, { hospitalId: item.hospitalId });
          Hospital.treatmentRequestRegist(form).then(res => {
            this.$store.commit('loading', false);
            if (res && res.data.rt === 200) {
              this.$alert(`진료 의뢰되었습니다.`, '알림', 'success').then(() => {
                this.$store.dispatch('popup/popupClose');
                this.$router.go(-1);
              });
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
          return false;
        })
        .catch(() => {});
    },
    hptDesignation(item) {
      this.$confirm('', '알림', 'question', { html: `<strong>${item.hospitalName}</strong><br/>해당 병원으로 지정하시겠습니까?` })
        .then(() => {
          let form = {
            businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
            studentId: this.dataObject.studentId,
            hospitalId: item.hospitalId,
          };
          Management.studentToHospitalRegist(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('지정되었습니다.', '알림', 'success').then(() => {
                this.$store.commit('update');
                this.$store.dispatch('popup/popupClose');
              });
            } else {
              if (res.data.rt === 400) {
                this.$alert('', '알림', 'error', { html: '선택된 병원에 존재하는 해당 학생의<br>비용청구서가 먼저 처리완료되어야 합니다.' });
              } else if (res.data.rt === 422) {
                this.$alert('', '알림', 'error', { html: '연락처가 이미 사용중입니다.<br/>정보 수정에서 연락처를 변경해 주세요.' });
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            }
          });
        })
        .catch(() => {});
    },
    appointHospitalList(page) {
      let form = {
        businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
        districtCode: this.dataObject.districtCode,
        page: page,
        size: 10,
        hospitalAddress: this.formHospitalAddress,
        hospitalName: this.formHospitalName,
      };
      // if (this.isTreatmentRequest) {
      //   form.hospitalType = this.valueToCode('C0016', 'N');
      // }
      Management.appointHospitalList(form).then(res => {
        if (res && res.data.rt === 200) {
          this.pager = res.data.paging;
          this.list = [];
          let arr = [];
          for (const i in res.data.hospitalList) {
            // code convert
            for (const j in res.data.hospitalList[i].treatDateTimeList) {
              res.data.hospitalList[i].treatDateTimeList[j].hospitalTreatDateTimeYoil = this.codeToValue(res.data.hospitalList[i].treatDateTimeList[j].hospitalTreatDateTimeYoil);
            }
            for (const j in res.data.hospitalList[i].treatClosedYoilList) {
              res.data.hospitalList[i].treatClosedYoilList[j] = this.codeToValue(res.data.hospitalList[i].treatClosedYoilList[j]);
            }
            // code convert end

            let left = [];
            let right = [];
            for (const yoil in this.dayWeeks) {
              const treatDateTime = res.data.hospitalList[i].treatDateTimeList.find(o => o.hospitalTreatDateTimeYoil === yoil);
              if (treatDateTime) {
                left.push({ yoil, text: `${treatDateTime.hospitalTreatDateTimeStart} ~ ${treatDateTime.hospitalTreatDateTimeEnd}` });
                continue;
              }
              const closedYoil = res.data.hospitalList[i].treatClosedYoilList.find(o => o === yoil);
              if (closedYoil) {
                right.push({ yoil, text: '휴무' });
                continue;
              }
              if (['SU', 'HO'].includes(yoil)) {
                right.push({ yoil, text: '미설정' });
              } else {
                left.push({ yoil, text: '미설정' });
              }
            }
            res.data.hospitalList[i].left = left;
            res.data.hospitalList[i].right = right;

            // 병원 목록
            arr.push(res.data.hospitalList[i]);
            if (arr.length === 2 || res.data.hospitalList.length === parseInt(i) + 1) {
              this.list.push(arr);
              arr = [];
            }
          }
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>
