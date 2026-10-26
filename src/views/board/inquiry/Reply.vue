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
          <span class="fwb mr10">시군</span>
          {{ inquiryInfo.healthCareName }}
        </p>
        <p class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">카테고리</span>
          {{ codeToDivisionCodeName(inquiryInfo.inquiryCategoryCode) }}
        </p>
        <p class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">작성자</span>
          {{ inquiryInfo.inquiryQuestionAdminOrganTargetName }}
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
    <div class="sub__content mt30">
      <div class="p_relative">
        <div class="title__row mt15">
          <p class="commp3 fwb">답변</p>
        </div>
      </div>
      <div class="comm__line mt15"></div>
      <div class="row mt20">
        <p class="commp fwb">제목</p>
        <div class="m__putbox wid100 mt10">
          <input v-model="replyContents.subject" type="text" class="comm_put" placeholder="제목을 입력해 주세요." />
        </div>
      </div>
      <div class="row mt20">
        <editor ref="toastuiEditor" height="300px" :options="options" initial-edit-type="wysiwyg" />
      </div>
    </div>
    <div class="half__row row">
      <div class="inner--right">
        <div class="btn__box mt15 mb30 row">
          <a href="javascript:;" class="d_inblock comm__blue_bd_btn wid110 btn_l_size commp2 fwb" @click="cancel">취소</a>
          <a href="javascript:;" class="d_inblock comm__blue_btn wid110 btn_l_size ml10 commp2 fwb" @click="save">등록</a>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import Board from '@/apis/Board';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor, Viewer } from '@toast-ui/vue-editor';
import { mapGetters } from 'vuex';

export default {
  name: 'Reply',
  components: {
    Viewer,
    Editor,
  },
  data() {
    return {
      options: {
        hideModeSwitch: true,
        toolbarItems: ['heading', 'bold', 'italic', 'strike', 'divider', 'hr', 'quote', 'divider', 'ul', 'ol', 'task', 'divider', 'link', 'divider', 'code', 'codeblock'],
      },
      replyContents: {
        subject: '',
      },
      inquiryInfo: {},
      modify: false,
    };
  },
  computed: {
    ...mapGetters('definedCode', ['codeToDivisionCodeName']),
  },
  created() {
    if (!this.$route.query.inquiryId) {
      alert('잘못된 접근입니다.');
      this.$router.push('/');
      return false;
    }
    Board.inquiryInfo({ inquiryId: this.$route.query.inquiryId }).then(res => {
      if (res && res.data.rt === 200) {
        this.inquiryInfo = res.data.inquiryInfo;
        if (this.inquiryInfo.inquiryAnswerRegdate) {
          this.replyContents.subject = res.data.inquiryInfo.inquiryAnswerSubject;
          this.$refs.toastuiEditor.invoke('setHtml', res.data.inquiryInfo.inquiryAnswerContents);
        }
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
    cancel() {
      this.$confirm('', '알림', 'question', { html: '취소하시겠습니까?<br>작성중인 내용은 저장되지 않습니다.' })
        .then(() => {
          this.$router.push({ path: '/healthcare/board/inquiry/contents', query: { inquiryId: this.$route.query.inquiryId } });
        })
        .catch(() => {});
    },
    save() {
      const contents = this.$refs.toastuiEditor.invoke('getHtml'); // 내용
      let validMsg = '';
      if (contents === '') {
        validMsg = '내용을 입력해 주세요.';
      } else if (!this.replyContents.subject) {
        validMsg = '제목을 입력해 주세요.';
      }
      if (validMsg !== '') {
        this.$alert(validMsg, '알림', 'warning');
        return false;
      }
      this.$confirm('등록하시겠습니까?', '알림', 'question')
        .then(() => {
          this.$store.commit('loading', true);
          const form = {
            inquiryId: this.$route.query.inquiryId,
            inquiryAnswerSubject: this.replyContents.subject,
            inquiryAnswerContents: contents,
          };
          Board.inquiryAnswerRegist(form).then(res => {
            this.$store.commit('loading', false);
            if (res && res.data.rt === 200) {
              this.$alert('등록되었습니다.', '알림', 'success').then(() => {
                this.$router.push({ path: '/healthcare/board/inquiry/contents', query: { inquiryId: this.$route.query.inquiryId } });
              });
            } else {
              if (res.data.rt === 400) {
                this.$alert(res.data.rtMsg, '알림', 'error');
                return false;
              } else {
                alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
              }
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped></style>
