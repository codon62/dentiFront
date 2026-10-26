<template>
  <fragment>
    <div class="comm__line mt30"></div>
    <div class="sub__content mt30">
      <div class="p_relative">
        <div class="flex_container">
          <div class="item">
            <p class="commp fwb">문의할 시군</p>
            <div class="put__set mt10">
              <div class="m__putbox wid180">
                <template v-if="$route.query.inquiryId">
                  <input type="text" class="comm_put read_put" :value="healthCareName" readonly />
                </template>
                <template v-else>
                  <select v-model="healthCareName" @change="setHealthCareName" class="comm_select">
                    <option value="">전체</option>
                    <option v-for="item in healthCareList" :class="{ disabled: item.healthCareInquiryActive === 'N' }" :key="item.healthCareId" :value="item.healthCareName">
                      {{ item.healthCareName }}
                    </option>
                  </select>
                </template>
              </div>
            </div>
          </div>
          <div class="item">
            <p class="commp fwb">문의할 지역구</p>
            <div class="put__set mt10">
              <div class="m__putbox wid180">
                <template v-if="$route.query.inquiryId || !secondHealthCareList.length">
                  <input type="text" class="comm_put read_put" :value="secondHealthCareName ? secondHealthCareName : '-'" readonly />
                </template>
                <template v-else>
                  <select v-model="secondHealthCareName" @change="setSecondHealthCareName" class="comm_select">
                    <option value="">전체</option>
                    <option v-for="item in secondHealthCareList" :key="item.healthCareId" :value="item.healthCareName">
                      {{ item.healthCareName }}
                    </option>
                  </select>
                </template>
              </div>
            </div>
          </div>
          <div class="item">
            <p class="commp fwb">카테고리</p>
            <div class="put__set mt10">
              <div class="m__putbox wid180">
                <select v-model="inquiryCategoryCode" class="comm_select">
                  <option value="">전체</option>
                  <option v-for="item in inquiryCategoryList" :key="item.inquiryCategoryCode" :value="item.inquiryCategoryCode">{{ item.inquiryCategoryName }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt20">
        <p class="commp fwb">제목</p>
        <div class="m__putbox wid100 mt10">
          <input v-model="subject" type="text" class="comm_put" placeholder="제목을 입력해 주세요." />
        </div>
      </div>
      <div class="comm__line mt20"></div>
      <div class="row mt20">
        <editor ref="toastuiEditor" height="600px" :options="options" initial-edit-type="wysiwyg" />
      </div>
      <div class="half__row row">
        <div class="inner--right">
          <div class="btn__box mt15 mb30 row">
            <a href="javascript:;" class="d_inblock comm__blue_bd_btn wid110 btn_l_size commp2 fwb" @click="cancel">취소</a>
            <a href="javascript:;" class="d_inblock comm__blue_btn wid110 btn_l_size ml10 commp2 fwb" @click="save">등록</a>
          </div>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import Board from '@/apis/Board';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import { mapGetters } from 'vuex';
import Common from '@/apis/Common';

export default {
  name: 'Enroll',
  components: {
    Editor,
  },
  data() {
    return {
      options: {
        hideModeSwitch: true,
        toolbarItems: ['heading', 'bold', 'italic', 'strike', 'divider', 'hr', 'quote', 'divider', 'ul', 'ol', 'task', 'divider', 'link', 'divider', 'code', 'codeblock'],
      },
      district: '',
      subject: '',
      districtCode: '',
      healthCareName: '',
      secondHealthCareName: '',
      inquiryCategoryCode: '',
      healthCareList: [],
      fullSecondHealthCareList: [],
      secondHealthCareList: [],
      inquiryCategoryList: [],
    };
  },
  computed: {
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('definedCode', ['valueToCode', 'codeToValue', 'codeToValueList']),
    ...mapGetters('business', ['divJoin']),
  },
  created() {
    if (this.$route.query.inquiryId) {
      Board.inquiryInfo({ inquiryId: this.$route.query.inquiryId }).then(res => {
        if (res && res.data.rt === 200) {
          this.districtCode = res.data.inquiryInfo.districtCode;
          this.healthCareName = res.data.inquiryInfo.healthCareName;
          this.secondHealthCareName = res.data.inquiryInfo.secondHealthCareName;
          this.inquiryCategoryCode = res.data.inquiryInfo.inquiryCategoryCode;
          this.subject = res.data.inquiryInfo.inquiryQuestionSubject;
          this.$refs.toastuiEditor.invoke('setHtml', res.data.inquiryInfo.inquiryQuestionContents);
        } else {
          if (res.data.rt === 422) {
            alert('잘못된 접근입니다.');
            this.$router.push('/');
          } else {
            alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
          }
        }
      });
    } else {
      Common.healthCareList({ districtCode: this.districtCodeFirst }).then(res => {
        if (res && res.data.rt === 200) {
          this.healthCareList = this.codeToValueList(res.data.healthCareList);
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
      Common.healthCareSecondList({ districtCode: this.districtCodeFirst }).then(res => {
        if (res && res.data.rt === 200) {
          this.fullSecondHealthCareList = this.codeToValueList(res.data.healthCareList);
        } else {
          alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
        }
      });
    }
    Board.inquiryCategoryList().then(res => {
      if (res && res.data.rt === 200) {
        this.inquiryCategoryList = res.data.inquiryCategoryList;
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    cancel() {
      this.$confirm('', '알림', 'question', { html: '취소하시겠습니까?<br>작성중인 내용은 저장되지 않습니다.' })
        .then(() => {
          this.$router.push('/hospital/board/inquiry/list');
        })
        .catch(() => {});
    },
    save() {
      const contents = this.$refs.toastuiEditor.invoke('getHtml'); // 내용
      let validMsg = '';
      if (!this.districtCode) {
        if (!this.healthCareName) {
          validMsg = '문의할 시군을 선택해 주세요.';
        } else {
          validMsg = '문의할 지역구를 선택해 주세요.';
        }
      } else if (!this.inquiryCategoryCode) {
        validMsg = '카테고리를 선택해 주세요.';
      } else if (!this.subject) {
        validMsg = '제목을 입력해 주세요.';
      } else if (!contents) {
        validMsg = '내용을 입력해 주세요.';
      } else if (this.subject.length > 200) {
        validMsg = '제목은 200자 이하입니다.';
      }
      if (validMsg !== '') {
        this.$alert(validMsg, '알림', 'warning');
        return false;
      }
      this.$confirm('등록하시겠습니까?', '알림', 'question')
        .then(() => {
          this.$store.commit('loading', true);
          const form = {
            districtCode: this.districtCode,
            inquiryCategoryCode: this.inquiryCategoryCode,
            inquiryQuestionSubject: this.subject,
            inquiryQuestionContents: contents,
          };
          if (this.$route.query.inquiryId) {
            // 게시물 수정
            form.inquiryId = this.$route.query.inquiryId; // 게시물 고유번호
          }
          Board.inquiryQuestionRegist(form).then(res => {
            this.$store.commit('loading', false);
            if (res && res.data.rt === 200) {
              this.$alert('등록되었습니다.', '알림', 'success').then(() => {
                this.$router.push('/hospital/board/inquiry/list');
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
    setHealthCareName() {
      if (this.healthCareName) {
        const healthCare = this.healthCareList.find(hel => hel.healthCareName === this.healthCareName);
        const secondHealthCareList = this.fullSecondHealthCareList.filter(hel => hel.districtCode.startsWith(healthCare.districtCode));
        if (healthCare.healthCareInquiryActive === 'N') {
          let alertMsg = '전화로 문의주세요.';
          if (healthCare.healthCareTel || !secondHealthCareList.length) {
            alertMsg += `<br/>(${healthCare.healthCareName} 연락처 : ${healthCare.healthCareTel ? healthCare.healthCareTel : '연락처 정보 없음'})`;
          }
          secondHealthCareList.forEach(secondHealthCare => {
            alertMsg += `<br/>(${secondHealthCare.healthCareName} 연락처 : ${secondHealthCare.healthCareTel ? secondHealthCare.healthCareTel : '연락처 정보 없음'})`;
          });
          this.$alert('', '알림', 'warning', { html: alertMsg });
          this.healthCareName = '';
          this.districtCode = '';
          this.secondHealthCareName = '';
          this.secondHealthCareList = [];
        } else {
          this.districtCode = !secondHealthCareList.length ? healthCare.districtCode : '';
          this.secondHealthCareList = secondHealthCareList;
        }
      } else {
        this.districtCode = '';
        this.secondHealthCareName = '';
        this.secondHealthCareList = [];
      }
    },
    setSecondHealthCareName() {
      if (this.secondHealthCareName) {
        this.districtCode = this.secondHealthCareList.find(hel => hel.healthCareName === this.secondHealthCareName).districtCode;
      } else {
        this.districtCode = '';
      }
    },
  },
};
</script>

<style scoped>
select option.disabled {
  color: #ddd;
}
</style>
