<template>
  <div class="popup_content">
    <v-popuptitle message="메모" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
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
              <th><p class="commp fwb">센터명</p></th>
              <th>
                <p class="commp fwb">{{ dataObject.centerName }}</p>
              </th>
            </tr>
            <tr>
              <th><p class="commp fwb">메모</p></th>
              <td colspan="3">
                <div class="d_block textbox mt10 mb5 ml5">
                  <textarea
                    v-model="note"
                    cols="30"
                    rows="10"
                    class="comm__textarea wid100"
                    placeholder="자유롭게 메모를 작성해주세요. 예) 아동 치료 계획"
                    :style="`height: 70px; ${hospitalType !== 'H' ? 'background-color: #fff; cursor: auto;' : ''}`"
                    :disabled="hospitalType !== 'H'"
                  ></textarea>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <v-popupconfirm v-if="hospitalType === 'H'" message="저장" :data-object="dataObject" @save="save"></v-popupconfirm>
      </div>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import { mapState, mapGetters } from 'vuex';
import Hospital from '@/apis/Hospital';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
  },
  props: ['dataObject'],
  data() {
    return {
      note: '',
    };
  },
  computed: {
    ...mapState('user', ['hospitalType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  created() {
    this.note = this.dataObject.studentBusinessNote;
  },
  methods: {
    save() {
      if (this.note?.length > 250) {
        this.$alert('250자까지 작성할 수 있습니다.', '알림', 'warning');
        return false;
      }
      const form = {
        studentId: this.dataObject.studentId,
        businessDivision: this.valueToCode('C0003', this.dataObject.businessDivision),
        note: this.note,
      };
      Hospital.studentBusinessNoteRegist(form).then(res => {
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
