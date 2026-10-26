<template>
  <div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <!-- view page .board__view 추가 -->
      <div class="p_relative">
        <div class="title__row mt15">
          <p class="commp3 fwb">{{ faqInfo.faqSubject }}</p>
          <!-- <a href="javascript:;" class="bookmark_btn commp c_black fwn" style="top: 5px;"><span class="icon"></span>공지 상단 고정</a> -->
        </div>
      </div>
      <div class="comm__line mt15"></div>
      <div class="row mt10">
        <p class="inner--left scommp c_gray2">
          <span class="fwb mr10">작성자</span>
          {{ faqInfo.adminOrganName }}
        </p>
        <p class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">작성일</span>
          {{ faqInfo.regdate }}
        </p>
        <p class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">카테고리</span>
          {{ faqCategory[faqInfo.faqCategory] }}
        </p>
      </div>
      <div class="comm__line mt10"></div>
      <div class="sub__content form__ver_1 bg_white mt20" style="min-height: 600px">
        <viewer v-if="faqInfo.faqContents" :initial-value="faqInfo.faqContents" />
      </div>
      <div class="comm__line bg_black2 mt20"></div>
      <div class="half__row row mb30">
        <div v-if="files.length" class="inner--left">
          <div class="mt15">
            <p class="commp fwn">첨부 파일</p>
          </div>
          <div class="row mt10 file__upload">
            <div v-for="(file, index) in files" :key="file.faqFileId" class="upload_put p_relative on" :class="{ mt10: parseInt(index) > 0 }">
              <input type="text" class="upload_text upload-name ml0" readonly="readonly" :value="file.originName" />
              <a :href="file.fullPath" class="name_del" download><img src="@/assets/images/common/ic_download.png" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn__box mt30 mb30 row">
      <div class="inner--left">
        <a href="javascript:;" class="d_block commp2 comm__gray_bd_btn wid145 btn_l_size tac fwb" @click="$router.push(`/${userOrganTargetTypeToPath[userOrganTargetType]}/board/faq/list`)">
          목록으로
        </a>
      </div>
      <div v-if="modify" class="inner--right">
        <div class="btn__box mt15 mb30 row">
          <a href="javascript:;" class="d_inblock comm__blue_bd_btn wid110 btn_l_size commp2 fwb" @click="$router.push({ path: '/healthcare/board/faq/enroll', query: { faqId: $route.query.faqId } })">
            수정
          </a>
          <a href="javascript:;" class="d_inblock comm__red_btn wid110 btn_l_size ml10 commp2 fwb" @click="faqDelete">삭제</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Board from '@/apis/Board';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/vue-editor';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    Viewer,
  },
  data() {
    return {
      faqInfo: {},
      files: [],
      modify: false,
    };
  },
  computed: {
    ...mapState('status', ['faqCategory', 'userOrganTargetTypeToPath']),
    ...mapState('user', ['userOrganId', 'userOrganTargetType', 'adminOrganType']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
  created() {
    if (!this.$route.query.faqId) {
      alert('잘못된 접근입니다.');
      this.$router.push('/');
      return false;
    }
    Board.faqInfo({ faqId: this.$route.query.faqId }).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.faqInfo.adminOrganType = this.codeToValue(res.data.faqInfo.adminOrganType);
        res.data.faqInfo.faqCategory = this.codeToValue(res.data.faqInfo.faqCategory);
        // code convert end
        this.faqInfo = res.data.faqInfo;
        this.files = res.data.faqFileList;
        if (res.data.faqInfo.adminOrganType === this.adminOrganType && res.data.faqInfo.adminOrganId === this.userOrganId) {
          this.modify = true;
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
    faqDelete() {
      this.$confirm('삭제하시겠습니까?', '알림', 'question')
        .then(() => {
          const form = {
            faqId: this.$route.query.faqId,
          };
          Board.faqDelete(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('삭제되었습니다.', '알림', 'success').then(() => {
                this.$router.push('/healthcare/board/faq/list');
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
