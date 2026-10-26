<template>
  <fragment>
    <div class="sub__content form__ver_1 bg_white mt30">
      <!-- view page .board__view 추가 -->
      <div class="p_relative">
        <div class="title__row mt15">
          <p class="commp3 fwb">{{ inquiryInfo.inquiryQuestionSubject }}</p>
          <!-- <a href="javascript:;" class="bookmark_btn commp c_black fwn" style="top: 5px;"><span class="icon"></span>공지 상단 고정</a> -->
        </div>
      </div>
      <div class="comm__line mt15"></div>
      <div class="row mt10">
        <p class="inner--left scommp c_gray2">
          <span class="fwb mr10">문의한 시군</span>
          {{ inquiryInfo.healthCareName }}
        </p>
        <p v-if="inquiryInfo.secondHealthCareName" class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">문의한 지역구</span>
          {{ inquiryInfo.secondHealthCareName }}
        </p>
      </div>
      <div class="comm__line mt10"></div>
      <div class="row mt10">
        <p class="inner--left scommp c_gray2">
          <span class="fwb mr10">소속된 시군</span>
          {{ inquiryInfo.inquiryQuestionAdminOrganTargetHealthCareName ? inquiryInfo.inquiryQuestionAdminOrganTargetHealthCareName : districtCodeFirstToName[districtCodeFirst] }}
        </p>
        <p v-if="inquiryInfo.inquiryQuestionAdminOrganTargetSecondHealthCareName" class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">소속된 지역구</span>
          {{ inquiryInfo.inquiryQuestionAdminOrganTargetSecondHealthCareName }}
        </p>
        <p class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">작성자</span>
          {{ inquiryInfo.inquiryQuestionAdminOrganTargetName }}
        </p>
        <p class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">카테고리</span>
          {{ codeToDivisionCodeName(inquiryInfo.inquiryCategoryCode) }}
        </p>
        <p class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">작성일</span>
          {{ inquiryInfo.inquiryQuestionRegdate }}
        </p>
      </div>
      <div class="comm__line mt10"></div>
      <div class="sub__content form__ver_1 bg_white mt20" style="min-height: 300px">
        <viewer v-if="inquiryInfo.inquiryQuestionContents" :initial-value="inquiryInfo.inquiryQuestionContents" />
      </div>
    </div>
    <div v-if="inquiryInfo.inquiryAnswerContents" class="sub__content form__ver_1 bg_white mt30">
      <div class="p_relative">
        <div class="title__row mt15">
          <p class="commp3 fwb">{{ inquiryInfo.inquiryAnswerSubject }}</p>
        </div>
      </div>
      <div class="comm__line mt15"></div>
      <div class="row mt10">
        <p class="inner--left scommp c_gray2">
          <span class="fwb mr10">작성자</span>
          {{ inquiryInfo.inquiryAnswerAdminOrganTargetName }}
        </p>
        <p class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">작성일</span>
          {{ inquiryInfo.inquiryAnswerRegdate }}
        </p>
      </div>
      <div class="comm__line mt10"></div>
      <div class="sub__content form__ver_1 bg_white mt20" style="min-height: 300px">
        <viewer v-if="inquiryInfo.inquiryAnswerContents" :initial-value="inquiryInfo.inquiryAnswerContents" />
      </div>
    </div>
    <div class="btn__box mt30 mb30 row">
      <div class="inner--left">
        <a href="javascript:;" class="d_block commp2 comm__gray_bd_btn wid145 btn_l_size tac fwb" @click="$router.push(`/${userOrganTargetTypeToPath[userOrganTargetType]}/board/inquiry/list`)">
          목록으로
        </a>
      </div>
      <div v-if="modify && !inquiryInfo.inquiryAnswerRegdate" class="inner--right">
        <div class="btn__box mt15 mb30 row">
          <a
            href="javascript:;"
            class="d_inblock comm__blue_bd_btn wid110 btn_l_size commp2 fwb"
            @click="$router.push({ path: '/hospital/board/inquiry/enroll', query: { inquiryId: $route.query.inquiryId } })"
          >
            수정
          </a>
          <a href="javascript:;" class="d_inblock comm__red_btn wid110 btn_l_size ml10 commp2 fwb" @click="inquiryDelete">삭제</a>
        </div>
      </div>
      <div v-else-if="['HC', 'CT'].indexOf(userOrganTargetType) !== -1" class="inner--right">
        <a
          v-if="inquiryInfo.inquiryAnswerRegdate ? replyModify : true"
          href="javascript:;"
          class="d_inblock comm__blue_bd_btn wid145 btn_l_size commp2 fwb"
          @click="$router.push({ path: '/healthcare/board/inquiry/reply', query: { inquiryId: $route.query.inquiryId } })"
        >
          {{ inquiryInfo.inquiryAnswerRegdate ? '답변수정' : '답변등록' }}
        </a>
      </div>
    </div>
  </fragment>
</template>

<script>
import Board from '@/apis/Board';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/vue-editor';
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'Contents',
  components: {
    Viewer,
  },
  data() {
    return {
      inquiryInfo: {},
      modify: false,
      replyModify: false,
    };
  },
  computed: {
    ...mapState('status', ['noticeBoardReceiver', 'userOrganTargetTypeToPath', 'districtCodeFirstToName']),
    ...mapState('user', ['userOrganId', 'userOrganTargetType', 'adminOrganType']),
    ...mapGetters('definedCode', ['codeToValue', 'codeToDivisionCodeName']),
    ...mapGetters('user', ['districtCodeFirst']),
  },
  created() {
    if (!this.$route.query.inquiryId) {
      alert('잘못된 접근입니다.');
      this.$router.push('/');
      return false;
    }
    Board.inquiryInfo({ inquiryId: this.$route.query.inquiryId }).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.inquiryInfo.inquiryQuestionAdminOrganType = this.codeToValue(res.data.inquiryInfo.inquiryQuestionAdminOrganType);
        res.data.inquiryInfo.inquiryAnswerAdminOrganType = this.codeToValue(res.data.inquiryInfo.inquiryAnswerAdminOrganType);
        // code convert end
        this.inquiryInfo = res.data.inquiryInfo;
        this.modify = this.inquiryInfo.inquiryQuestionAdminOrganId === this.userOrganId && res.data.inquiryInfo.inquiryQuestionAdminOrganType === this.adminOrganType;
        this.replyModify = this.inquiryInfo.inquiryAnswerAdminOrganId === this.userOrganId && res.data.inquiryInfo.inquiryAnswerAdminOrganType === this.adminOrganType;
      } else {
        if (res.data.rt === 422) {
          alert('잘못된 접근입니다.');
          this.$router.push('/');
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      }
    });
  },
  methods: {
    inquiryDelete() {
      this.$confirm('삭제하시겠습니까?', '알림', 'question')
        .then(() => {
          const form = {
            inquiryId: this.$route.query.inquiryId,
          };
          Board.inquiryDelete(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('삭제되었습니다.', '알림', 'success').then(() => {
                this.$router.push('/hospital/board/inquiry/list');
              });
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped></style>
