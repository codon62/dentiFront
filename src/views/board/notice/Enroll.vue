<template>
  <div>
    <div class="comm__line mt30"></div>
    <div class="sub__content mt30">
      <div class="p_relative">
        <div class="flex_container">
          <div class="item">
            <p class="commp fwb">지역</p>
            <div class="put__set mt10">
              <div class="m__putbox wid300">
                <input type="text" class="comm_put read_put" :value="districtName" readonly />
              </div>
            </div>
          </div>
          <div v-for="(item, index) in receiverList" :key="item.id" class="item">
            <p v-if="index === 0" class="commp fwb">구분</p>
            <div class="put__set mt10">
              <div class="check_set mb10">
                <input :id="item.id" type="checkbox" value="Y" class="blind" :checked="item.value === 'Y'" @change="receiverCheck($event.target, index)" />
                <label :for="item.id">
                  <span class="icon"></span>
                  <span class="label_t">{{ receiver[item.key] }}</span>
                </label>
              </div>
            </div>
          </div>
          <!--//item-->
          <!-- <a href="javascript:;" class="bookmark_btn commp c_black fwn"><span class="icon"></span>공지 상단 고정</a> -->
        </div>
      </div>
      <div class="row mt20">
        <p class="commp fwb">제목</p>
        <div class="m__putbox wid100 mt10">
          <input v-model="noticeBoardSubject" type="text" class="comm_put" placeholder="제목을 입력해 주세요." />
        </div>
      </div>
      <div class="comm__line mt20"></div>
      <div class="row mt20">
        <editor ref="toastuiEditor" height="600px" :options="options" initial-edit-type="wysiwyg" />
        <!-- <div class="editor__box bg_white" style="width: 100%;height: 600px;"></div> -->
      </div>
      <div class="half__row row">
        <div class="inner--left">
          <div class="mt15">
            <p class="commp fwn">첨부 파일</p>
          </div>
          <p class="commp c_gray2 mt5">파일은 최대 5개만 첨부됩니다. (최대 용량 10MB)</p>
          <p class="mt5 c_red scommp">※ 지원하는 파일 형식 : gif, jpg, jpeg, png, hwp, xls, xlsx, doc, docx, ppt, pptx, pdf, txt, zip, rar</p>
          <file-upload v-for="(file, index) in files" :key="index" size="10" type="all" :remove="true" :file-name="file.originName" @input="fileInput($event, index)" @remove="removeFile(index)" />
        </div>
        <div class="inner--right">
          <div class="btn__box mt15 mb30 row">
            <a href="javascript:;" class="d_inblock comm__blue_bd_btn wid110 btn_l_size commp2 fwb" @click="cancel">취소</a>
            <a href="javascript:;" class="d_inblock comm__blue_btn wid110 btn_l_size ml10 commp2 fwb" @click="save">등록</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// https://github.com/nhn/tui.editor/tree/master/apps/vue-editor
import Board from '@/apis/Board';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import FileUpload from '@/components/common/FileUpload.vue';
import { mapGetters, mapState } from 'vuex';

export default {
  components: {
    Editor,
    FileUpload,
  },
  data() {
    return {
      options: {
        // minHeight: '200px',
        // language: 'en_US',
        // useCommandShortcut: false,
        // useDefaultHTMLSanitizer: true,
        // usageStatistics: false,
        hideModeSwitch: true,
        toolbarItems: [
          'heading',
          'bold',
          'italic',
          'strike',
          'divider',
          'hr',
          'quote',
          'divider',
          'ul',
          'ol',
          'task',
          // 'indent',
          // 'outdent',
          'divider',
          // 'table',
          // 'image',
          'link',
          'divider',
          'code',
          'codeblock',
        ],
      },
      noticeBoardSubject: '',
      files: [''],
      deleteFiles: [],
    };
  },
  computed: {
    ...mapState('user', ['districtName', 'districtCode', 'userOrganTargetType', 'cityType', 'healthCareType']),
    ...mapState('status', ['noticeBoardReceiver', 'noticeBoardReceiverI']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue']),
    receiver() {
      return ['I', 'J'].includes(this.districtCodeFirst) ? this.noticeBoardReceiverI : this.noticeBoardReceiver;
    },
    receiverList() {
      let list = [];
      if (this.userOrganTargetType === 'CT') {
        list.push({
          id: 'noticeBoardHealthCare',
          key: 'HC',
          value: 'N',
        });
      }
      list.push(
        ...[
          {
            id: 'noticeBoardHospital',
            key: 'HP',
            value: 'N',
          },
          {
            id: 'noticeBoardSchool',
            key: 'SC',
            value: 'N',
          },
        ],
      );
      if (this.divJoin('C')) {
        list.push({
          id: 'noticeBoardCenter',
          key: 'CE',
          value: 'N',
        });
      }
      return list;
    },
  },
  created() {
    if (this.$route.query.noticeBoardId) {
      Board.noticeBoardInfo({ noticeBoardId: this.$route.query.noticeBoardId }).then(res => {
        if (res && res.data.rt === 200) {
          // code convert
          res.data.noticeInfo.adminOrganType = this.codeToValue(res.data.noticeInfo.adminOrganType);
          // code convert end
          this.noticeBoardSubject = res.data.noticeInfo.noticeBoardSubject;
          this.receiverList.forEach(item => {
            item.value = this.codeToValue(res.data.noticeInfo[item.id]);
          });
          this.$refs.toastuiEditor.invoke('setHtml', res.data.noticeInfo.noticeBoardContents);
          this.files = res.data.noticeBoardFileList;
          if (this.files.length < 5 && this.files[this.files.length - 1] !== '') {
            this.files.push('');
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
    }
  },
  methods: {
    fileInput(file, index) {
      if (this.files[index].noticeBoardFileId) {
        this.deleteFiles.push(this.files[index].noticeBoardFileId);
      }
      this.files.splice(index, 1);
      this.files.splice(index, 0, file);
      if (this.files.length < 5 && this.files[this.files.length - 1] !== '') {
        this.files.push('');
      }
    },
    removeFile(index) {
      if (this.files[index].noticeBoardFileId) {
        this.deleteFiles.push(this.files[index].noticeBoardFileId);
      }
      this.files.splice(index, 1);
      if (this.files.length < 5 && this.files[this.files.length - 1] !== '') {
        this.files.push('');
      }
    },
    receiverCheck(target, index) {
      this.receiverList[index].value = target.checked ? target.value : 'N';
    },
    cancel() {
      this.$confirm('', '알림', 'question', { html: '취소하시겠습니까?<br>작성중인 내용은 저장되지 않습니다.' })
        .then(() => {
          this.$router.push('/healthcare/board/notice/list');
        })
        .catch(() => {});
    },
    save() {
      const noticeBoardContents = this.$refs.toastuiEditor.invoke('getHtml'); // 내용
      let validMsg = '';
      if (!this.receiverList.filter(item => item.value === 'Y').length) {
        validMsg = '구분을 선택해 주세요.';
      } else if (!this.noticeBoardSubject) {
        validMsg = '제목을 입력해 주세요.';
      } else if (noticeBoardContents === '') {
        // 공백 존재해도 true
        validMsg = '내용을 입력해 주세요.';
      } else if (this.noticeBoardSubject.length > 200) {
        validMsg = '제목은 200자 이하입니다.';
      }
      if (validMsg !== '') {
        this.$alert(validMsg, '알림', 'warning');
        return false;
      }
      this.$confirm('등록하시겠습니까?', '알림', 'question')
        .then(() => {
          this.$store.commit('loading', true);
          let request = {
            districtCode: this.districtCode,
            noticeBoardSubject: this.noticeBoardSubject,
            noticeBoardContents: noticeBoardContents,
            form: {},
            deleteFiles: this.deleteFiles,
          };
          this.receiverList.forEach(item => {
            request[item.id] = this.valueToCode('C0035', item.value);
          });
          if (this.$route.query.noticeBoardId) {
            // 게시물 수정
            request.noticeBoardId = this.$route.query.noticeBoardId; // 게시물 고유번호
          }

          const form = new FormData();
          form.append('request', new Blob([JSON.stringify(request)], { type: 'application/json' }));
          for (const i in this.files) {
            if (this.files[i] !== '' && !this.files[i].noticeBoardFileId) {
              form.append('files', this.files[i]);
            }
          }

          Board.noticeBoardRegist(form).then(res => {
            this.$store.commit('loading', false);
            if (res && res.data.rt === 200) {
              this.$alert('등록되었습니다.', '알림', 'success').then(() => {
                this.$router.push('/healthcare/board/notice/list');
              });
            } else {
              if (res.data.rt === 400) {
                // 파일 형식 backend validation
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
