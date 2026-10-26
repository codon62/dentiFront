<template>
  <tr>
    <td>
      <p class="scommp">{{ numberWithCommas(num) }}</p>
    </td>
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
    <td>
      <p class="scommp">{{ data.studentName }}</p>
    </td>
    <td>
      <p class="scommp">{{ data.studentGender ? studentGender[data.studentGender] : '-' }}</p>
    </td>
    <td>
      <a href="javascript:;" v-tooltip="options.tooltip" :style="options.style" class="comm__navy_btn d_inblock wid60 scommp btn_s_size" @click="vclick">전입</a>
    </td>
    <template v-if="districtCodeFirst === 'C'">
      <td>
        <p class="scommp">{{ data.billId ? '수검' : '미수검' }}</p>
      </td>
      <td>
        <v-button
          :message="data.notificationStatus === 'Y' ? '보기' : '-'"
          @vclick="validAndOpen({ contents: 'viewNotification', params: { studentId: data.studentId, businessDivision: data.businessDivision } })"
        ></v-button>
      </td>
      <td><v-button :message="data.billId ? '보기' : '-'" @vclick="validAndOpen({ contents: 'studentLogPopup', params: data })"></v-button></td>
    </template>
  </tr>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Button from '@/components/common/Button.vue';

export default {
  props: ['num', 'data'],
  components: {
    'v-button': Button,
  },
  computed: {
    ...mapState('status', ['studentGender']),
    ...mapGetters('user', ['districtCodeFirst']),
    options() {
      return this.data.deletable
        ? {
            clickable: true,
            tooltip: '',
            style: '',
          }
        : {
            clickable: false,
            tooltip: 'APP 가입 또는 지정된 병원이 있는 학생은 전입 처리할 수 없습니다.',
            style: 'opacity: 0.2',
          };
    },
  },
  methods: {
    vclick() {
      if (this.options.clickable) {
        if (!this.data.transferDate) {
          this.$alert('', '알림', 'warning', {
            html: '<p class="commp2 fwb c_red">※ 전입을 위해서는 이전 학교의 전출이 먼저 선행되어야 합니다.</p>' + '<p class="commp2 fwb">이전 학교에서 전출처리 되지 않은 상태입니다.</p>',
          });
          return false;
        }
        this.$emit('vclick', this.data);
      }
    },
    validAndOpen(payload) {
      this.$prompt('', '', '학생 인증', '', { html: '<p class="commp4 fwb">※ 생년월일을 입력해 주세요.(8자리)</p>' })
        .then(res => {
          const input = res.replace(/[^0-9]/g, ''); // 숫자만 통과
          if (input !== this.data.studentBirth) {
            this.$alert('생년월일이 일치하지 않습니다.', '알림', 'warning');
            return false;
          }
          this.$store.dispatch('popup/popupOpen', payload);
        })
        .catch(() => {});
    },
  },
};
</script>
