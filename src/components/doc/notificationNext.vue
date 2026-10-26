<template>
  <div class="popup_content">
    <v-popuptitle message="다음 단계 선택" imgsrc="sub/ic_choice.png"></v-popuptitle>
    <div class="popup__con_inner">
      <p class="lcommp4 fwb">다음 단계 진행을 위해 선택해 주세요.</p>
      <div class="row flex_set mt30">
        <div class="step_box tac ml20" :class="{ on: billRegist === false }" :style="isPrice ? 'opacity: 0.3;' : null" @click="isPrice ? null : billRegistSet(false)">
          <div class="icon_box"></div>
          <p class="commp2 mt30 fwb">진료 {{ hospitalType === 'H' ? '의뢰서' : '계획서' }} 작성하기</p>
          <p class="commp mt20">검진 후 진료가 필요한 경우에만 진행해 주세요.</p>
          <p class="sscommp mt5">* 내역서 작성 이후에 비용 청구가 이루어집니다.</p>
        </div>
        <div class="step_box tac ml20" :class="{ on: billRegist === true }" @click="billRegistSet(true)">
          <div class="icon_box"></div>
          <p class="commp2 mt30 fwb">통보서 최종제출</p>
          <p class="commp mt20">검진 후 진료가 필요하지 않은 경우에만 진행해 주세요.</p>
          <p class="sscommp mt5">* 진료 {{ hospitalType === 'H' ? '의뢰서' : '계획서와 내역서' }}를 작성하지 않고 바로 비용을 청구합니다.</p>
        </div>
      </div>
      <v-popupconfirm message="최종제출" html="<br/>최종제출시 수정이 불가능합니다." @save="save"></v-popupconfirm>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import popupTitle from '@/components/popup/PopupTitle.vue';
import popupConfirm from '@/components/popup/PopupConfirm.vue';
import { mapGetters, mapMutations, mapState } from 'vuex';

export default {
  components: {
    'v-popuptitle': popupTitle,
    'v-popupconfirm': popupConfirm,
  },
  props: ['dataObject'],
  computed: {
    ...mapState('user', ['userOrganTargetId', 'hospitalType']),
    ...mapState('doc', ['billRegist', 'formContents']),
    ...mapGetters('definedCode', ['valueToCode']),
    isPrice() {
      return (
        (!this.dataObject.addRegist && (this.formContents.notification.examPrice.value || this.formContents.notification.n_end.value.length)) ||
        (this.dataObject.addRegist && this.formContents.notificationAddRegist.examPrice.value)
      );
    },
  },
  created() {
    this.billRegistSet(null);
  },
  methods: {
    ...mapMutations('doc', ['billRegistSet']),
    save() {
      if (this.billRegist === null) {
        this.$alert('다음 단계를 선택해 주세요.', '알림', 'warning');
        return false;
      }
      if (this.isPrice && this.billRegist === false) {
        this.$alert('검진비가 0원이 아닌 경우 진료계획서를 작성할 수 없습니다.', '알림', 'warning');
        return false;
      }
      this.$store.commit('loading', true);
      if (!this.dataObject.addRegist) {
        this.$store.commit('doc/notificationSubDataSet', { treatStatus: this.billRegist ? 'N' : '' });
        // this.$store.dispatch('popup/popupOpen', {
        //   contents: 'viewNotification',
        //   params: { studentId: this.$route.query.studentId, businessDivision: this.$route.query.businessDivision, pdf: true, notificationYear: this.$route.query.notificationYear },
        // }); // pdf 저장
        this.dataObject.form.billRegist = this.billRegist;
        Hospital.notificationRegist(this.dataObject.form).then(res => {
          if (res && res.data.rt === 200) {
            this.$store.commit('loading', false);
            const html = `최종 제출 되었습니다.<br/>최종 제출 후 수정이 필요한 경우 관할 보건소로 문의 부탁드립니다.`;
            this.$alert('', '알림', 'success', { html }).then(() => {
              this.$store.dispatch('popup/popupClose');
              this.$router.go(-1);
            });
          } else {
            this.$store.commit('loading', false);
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        });
      } else {
        let formData = {};
        for (const i in this.formContents.notificationAddRegist) {
          formData[i] = this.formContents.notificationAddRegist[i].value;
        }
        const form = {
          hospitalId: this.userOrganTargetId,
          studentId: this.$route.query.studentId,
          notificationId: this.dataObject.notificationId, // 존재하면 UPDATE
          status: this.valueToCode('C0001', 'Y'),
          billRegist: this.billRegist,
          form: formData,
        };
        Hospital.notificationAddRegist(form).then(res => {
          if (res && res.data.rt === 200) {
            this.$store.commit('loading', false);
            const html = `최종 제출 되었습니다.<br/>최종 제출 후 수정이 필요한 경우 관할 보건소로 문의 부탁드립니다.`;
            this.$alert('', '알림', 'success', { html }).then(() => {
              this.$store.dispatch('popup/popupClose');
              this.$router.go(-1);
            });
          } else {
            this.$store.commit('loading', false);
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.step_box {
  @include box-sizing(border-box);
  @include transition(all 0.4s ease-out);
  @include border-radius(3px);

  border: 1px solid #dbdbdb;
  overflow: hidden;
  padding: 30px;
  width: 430px;
  cursor: pointer;
}
.step_box.on {
  border-color: #0868f1;
}
.step_box .icon_box {
  background: url('#{$asset-img-path}common/ic_unselect.png') no-repeat;
  width: 40px;
  height: 40px;
  margin: 0 auto;
}
.step_box.on .icon_box {
  background: url('#{$asset-img-path}common/ic_select.png') no-repeat;
}
</style>
