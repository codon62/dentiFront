<template>
  <div class="popup_content">
    <v-popuptitle :message="title" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner">
      <div class="board__box mt10">
        <table class="comm__table">
          <colgroup>
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th><p class="commp fwb">이름</p></th>
              <th>
                <p class="commp fwb">{{ dataObject.studentName }}</p>
              </th>
              <th><p class="commp fwb">학년/반/번호</p></th>
              <th>
                <p class="commp fwb">{{ `${dataObject.studentToSchoolGrade1}학년 ${dataObject.studentToSchoolGrade2}반 ${dataObject.studentToSchoolGrade3}번` }}</p>
              </th>
            </tr>
            <tr>
              <th
                ><p class="commp fwb">{{ title }}</p></th
              >
              <td colspan="3">
                <div class="d_block textbox mt10 mb5 ml5">
                  <textarea v-model="reason" cols="30" rows="10" class="comm__textarea wid100" :placeholder="`${title}를 작성해주세요. (선택사항)`" style="height: 70px"></textarea>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <v-popupconfirm message="저장" :data-object="dataObject" @save="save"></v-popupconfirm>
      </div>
    </div>
  </div>
</template>

<script>
import School from '@/apis/School';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
  },
  props: ['dataObject'],
  data() {
    return {
      reason: '',
    };
  },
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode']),
    title() {
      return `미${this.districtCodeFirst === 'I' ? '진료' : '수검'} 사유`;
    },
  },
  created() {
    this.reason = this.dataObject.notificationScreenReason;
  },
  methods: {
    save() {
      if (this.reason?.length > 250) {
        this.$alert('250자까지 작성할 수 있습니다.', '알림', 'warning');
        return false;
      }
      const form = {
        studentId: this.dataObject.studentId,
        businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
        notificationScreenReason: this.reason,
      };
      School.notScreenRegist(form).then(res => {
        if (res && res.data.rt === 200) {
          this.$alert('저장되었습니다.', '알림', 'success').then(() => {
            this.$store.commit('update');
            this.$store.dispatch('popup/popupClose');
          });
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    },
  },
};
</script>
