<template>
  <div>
    <div class="sub__content form__ver_1 bg_white mt30">
      <!-- view page .board__view 추가 -->
      <div class="p_relative">
        <div class="title__row mt15">
          <p class="commp3 fwb">{{ noticeInfo.noticeBoardSubject }}</p>
          <!-- <a href="javascript:;" class="bookmark_btn commp c_black fwn" style="top: 5px;"><span class="icon"></span>공지 상단 고정</a> -->
        </div>
      </div>
      <div class="comm__line mt15"></div>
      <div class="row mt10">
        <p class="inner--left scommp c_gray2">
          <span class="fwb mr10">작성자</span>
          {{ noticeInfo.adminOrganName }}
        </p>
        <p class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">작성일</span>
          {{ noticeInfo.regdate }}
        </p>
        <p class="inner--left scommp c_gray2 ml50">
          <span class="fwb mr10">수신처</span>
          {{ receiver }}
        </p>
      </div>
      <div class="comm__line mt10"></div>
      <div class="sub__content form__ver_1 bg_white mt20" style="min-height: 600px">
        <viewer v-if="noticeInfo.noticeBoardContents" :initial-value="noticeInfo.noticeBoardContents" />
      </div>
      <div class="comm__line bg_black2 mt20"></div>
      <div class="half__row row mb30">
        <div v-if="files.length" class="inner--left">
          <div class="mt15">
            <p class="commp fwn">첨부 파일</p>
          </div>
          <div class="row mt10 file__upload">
            <div v-for="(file, index) in files" :key="file.noticeBoardFileId" class="upload_put p_relative on" :class="{ mt10: parseInt(index) > 0 }">
              <input type="text" class="upload_text upload-name ml0" readonly="readonly" :value="file.originName" />
              <a :href="file.fullPath" class="name_del" download><img src="@/assets/images/common/ic_download.png" /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn__box mt30 mb30 row">
      <div class="inner--left">
        <a href="javascript:;" class="d_block commp2 comm__gray_bd_btn wid145 btn_l_size tac fwb" @click="$router.push(`/${userOrganTargetTypeToPath[userOrganTargetType]}/board/notice/list`)">
          목록으로
        </a>
      </div>
      <div v-if="modify" class="inner--right">
        <div class="btn__box mt15 mb30 row">
          <a
            href="javascript:;"
            class="d_inblock comm__blue_bd_btn wid110 btn_l_size commp2 fwb"
            @click="$router.push({ path: '/healthcare/board/notice/enroll', query: { noticeBoardId: $route.query.noticeBoardId } })"
          >
            수정
          </a>
          <a href="javascript:;" class="d_inblock comm__red_btn wid110 btn_l_size ml10 commp2 fwb" @click="noticeDelete">삭제</a>
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
      noticeInfo: {},
      files: [],
      modify: false,
      receiver: '',
    };
  },
  computed: {
    ...mapState('status', ['noticeBoardReceiver', 'noticeBoardReceiverI', 'userOrganTargetTypeToPath']),
    ...mapState('user', ['userOrganId', 'userOrganTargetType', 'adminOrganType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
  },
  created() {
    if (!this.$route.query.noticeBoardId) {
      alert('잘못된 접근입니다.');
      this.$router.push('/');
      return false;
    }
    Board.noticeBoardInfo({ noticeBoardId: this.$route.query.noticeBoardId }).then(res => {
      if (res && res.data.rt === 200) {
        // code convert
        res.data.noticeInfo.adminOrganType = this.codeToValue(res.data.noticeInfo.adminOrganType);
        // code convert end
        this.noticeInfo = res.data.noticeInfo;
        this.receiver = this.getReceiver();
        this.files = res.data.noticeBoardFileList;
        if (res.data.noticeInfo.adminOrganType === this.adminOrganType && res.data.noticeInfo.adminOrganId === this.userOrganId) {
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
    noticeDelete() {
      this.$confirm('삭제하시겠습니까?', '알림', 'question')
        .then(() => {
          const form = {
            noticeBoardId: this.$route.query.noticeBoardId,
          };
          Board.noticeBoardDelete(form).then(res => {
            if (res && res.data.rt === 200) {
              this.$alert('삭제되었습니다.', '알림', 'success').then(() => {
                this.$router.push('/healthcare/board/notice/list');
              });
            } else {
              alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
            }
          });
        })
        .catch(() => {});
    },
    getReceiver() {
      let obj = {
        HC: this.noticeInfo.noticeBoardHealthCare,
        HP: this.noticeInfo.noticeBoardHospital,
        SC: this.noticeInfo.noticeBoardSchool,
      };
      if (this.divJoin('C')) {
        obj.CE = this.noticeInfo.noticeBoardCenter;
      }

      let list = [];
      let objCount = 0;
      for (let key in obj) {
        objCount++;
        if (this.codeToValue(obj[key]) === 'Y') {
          list.push(key);
        }
      }
      if (objCount === list.length) {
        return '전체';
      }
      return list.map(value => this[['I', 'J'].includes(this.districtCodeFirst) ? 'noticeBoardReceiverI' : 'noticeBoardReceiver'][value]).join(', ');
    },
  },
};
</script>
