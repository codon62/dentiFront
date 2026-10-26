<template>
  <div class="sub__content form__ver_1 mt30">
    <div class="browser__con">
      <div class="bg_white mt20 tac" style="width: 800px; margin: 0 auto; padding: 50px; box-sizing: border-box">
        <div class="iconbox"><img src="@/assets/images/sub/ic_won_o.png" /></div>
        <p class="commp3 mt15 fwb">계좌 등록</p>
        <p class="commp mt15 c_black2">
          비용 청구 받을 정확한 입금 은행과 계좌번호, 예금주를 입력해 주세요.
          <br />
          해당 계좌로 청구 금액이 지급됩니다.
        </p>
        <div class="basic__form_box mt50">
          <div class="row flex_set flex_left">
            <p class="flex_item scommp c_black2 fwb d_inblock tal fw500" style="width: 130px">은행명</p>
            <div class="flex_item d_inblock" style="width: 200px">
              <select v-model="bankCode" class="comm_select wid100 m__putbox mt10">
                <option value="">은행을 선택해 주세요.</option>
                <option v-for="bank in bankList" :key="bank.bankCode" :value="bank.bankCode">{{ bank.bankName }}</option>
              </select>
            </div>
          </div>
          <div class="row flex_set flex_left mt20">
            <p class="flex_item scommp c_black2 fwb d_inblock tal fw500" style="width: 130px">계좌번호</p>
            <div class="flex_item m__putbox d_inblock" style="width: 345px">
              <input v-model="hospitalAccount" type="text" class="comm_put" placeholder="계좌번호를 입력해 주세요." />
            </div>
          </div>
          <div class="row flex_set flex_left mt20">
            <p class="flex_item scommp c_black2 fwb d_inblock tal fw500" style="width: 130px">예금주</p>
            <div class="flex_item m__putbox d_inblock" style="width: 345px">
              <input v-model="hospitalDepositor" type="text" class="comm_put" placeholder="예금주를 입력해 주세요." />
            </div>
          </div>
        </div>
        <p class="mt30 fw300 sscommp c_gray2">
          * 등록된 계좌번호로 비용 청구 금액이 지급될 예정이오니, 정확한 정보를 입력해 주세요.
          <br />
          * 기타 궁금하신 점이나 질문 사항은 해당 보건소로 문의 부탁드립니다.
        </p>
        <div class="row tac mt30"></div>
        <a href="javascript:;" class="d_inblock comm__blue_btn btn_m_size2" style="width: 160px" @click="enroll">계좌 등록하기</a>
      </div>
    </div>
  </div>
</template>

<script>
import Hospital from '@/apis/Hospital';
import { mapState } from 'vuex';

export default {
  props: ['bankList'],
  data() {
    return {
      bankCode: '',
      hospitalDepositor: '',
      hospitalAccount: '',
    };
  },
  computed: {
    ...mapState('user', ['userOrganTargetId']),
  },
  methods: {
    enroll() {
      if (this.bankCode === '') {
        this.$alert('은행을 선택해 주세요.', '알림', 'warning');
      } else if (this.hospitalAccount === '') {
        this.$alert('계좌번호를 입력해 주세요.', '알림', 'warning');
      } else if (this.hospitalDepositor === '') {
        this.$alert('예금주를 입력해 주세요.', '알림', 'warning');
      } else {
        let form = {
          hospitalId: this.userOrganTargetId,
          bankCode: this.bankCode,
          hospitalDepositor: this.hospitalDepositor,
          hospitalAccount: this.hospitalAccount,
        };
        Hospital.accountInfoModify(form).then(res => {
          if (res && res.data.rt === 200) {
            this.$alert('등록되었습니다.', '알림', 'success').then(() => {
              this.$emit('change');
            });
          } else {
            if (res.data.rt === 400) {
              this.$alert(res.data.rtMsg, '알림', 'error');
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          }
        });
      }
    },
  },
};
</script>
