<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
    <template v-if="data.businessDivision !== 'C'">
      <td>
        <p class="scommp">{{ data.schoolName ? data.schoolName : '학교밖' }}</p>
      </td>
      <td>
        <p class="scommp">{{ data.studentToSchoolGrade1 ? data.studentToSchoolGrade1 : '-' }}</p>
      </td>
      <td>
        <p class="scommp">{{ data.studentToSchoolGrade2 ? data.studentToSchoolGrade2 : '-' }}</p>
      </td>
      <td>
        <p class="scommp">{{ data.studentToSchoolGrade3 ? data.studentToSchoolGrade3 : '-' }}</p>
      </td>
    </template>
    <td v-if="data.businessDivision === 'C'">
      <p class="scommp">{{ data.centerName ? data.centerName : '-' }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.studentName }}</p>
    </td>
    <template v-if="data.businessDivision === 'C'">
      <td>
        <p class="scommp">{{ data.studentBirth ? data.studentBirth : '-' }}</p>
      </td>
      <td>
        <p class="scommp">{{ data.studentTel ? data.studentTel : '-' }}</p>
      </td>
    </template>
    <td>
      <p class="scommp">{{ data.hospitalName ? data.hospitalName : '-' }}</p>
    </td>
    <td>
      <a
        v-tooltip="data.hospitalName ? '이미 병원에 등록된 학생입니다.' : ''"
        href="javascript:;"
        class="comm__navy_btn d_inblock wid60 scommp btn_s_size"
        :class="data.hospitalName ? 'off_ver' : ''"
        @click="vclick"
      >
        추가
      </a>
    </td>
  </tr>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  props: ['num', 'data'],
  computed: {
    ...mapState('user', ['districtCode']),
    ...mapGetters('business', ['districtInfo']),
  },
  methods: {
    vclick() {
      if (!this.data.hospitalName) {
        const closeDistrict = {
          // 인천
          B0102: '동구',
          B0103: '미추홀구',
          // 부산
          D0109: '금정구',
          D0105: '해운대구',
          // 동래구 - registrationAvailable: false
        };
        if (closeDistrict[this.data.districtCode] || !this.data.registrationAvailable) {
          this.$fire({
            html: `${this.data.healthCareName} 사업이 조기 종료되어<br> ${this.data.healthCareName} 소속 학생의 검진이 불가합니다.<br><br> 사업 관련 문의는 ${this.data.healthCareName} 보건소로 연락 부탁드립니다.`,
            confirmButtonText: '확인',
            padding: '40px',
          });
          return false;
        }
        if (this.data.businessSubsidiaryDivision === 'FY' && this.districtCode !== 'D0101') {
          this.$alert('연제구 4, 6학년 학생은 연제구 소속 치과에서만 등록할 수 있습니다.', '알림', 'warning');
          return false;
        }
        // if (closeDistrict[this.data.districtCode]) {
        //   const districtName = closeDistrict[this.data.districtCode];
        //   this.$alert('', '알림', 'warning', {
        //     html: `${districtName} 치과주치의 사업이 종료되어<br/>${districtName} 센터/학교 소속 학생의 검진이 불가합니다.<br/><br/>사업 관련 문의는 ${districtName} 보건소로 연락 부탁드립니다.`,
        //   });
        //   return false;
        // }
        this.$emit('vclick', this.data);
      }
    },
  },
};
</script>
