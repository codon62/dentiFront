<template>
  <div class="item">
    <p v-if="!noTitle" class="commp fwb">{{ title }} 검색</p>
    <div class="put__set" :class="{ mt10: !noTitle }">
      <div class="m__putbox" :class="size ? size : 'wid300'">
        <select v-if="optionData" v-model="form" class="comm_select" @change="input($event)">
          <option v-if="message" value="">{{ message }}</option>
          <option v-for="item in optionData" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
        <select v-else v-model="form" class="comm_select" @change="input($event)">
          <option v-if="message" value="">{{ message }}</option>
          <option v-for="item in apiOptionData" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import Common from '@/apis/Common';
import { mapGetters, mapState } from 'vuex';

export default {
  props: ['title', 'message', 'optionData', 'each', 'size', 'value', 'type', 'code', 'div', 'noTitle', 'businessDivision'],
  data() {
    return {
      form: '',
      apiOptionData: [],
      targetMonth: '',
    };
  },
  computed: {
    ...mapState('user', ['districtCode', 'userOrganTargetId', 'userOrganTargetType']),
    ...mapGetters('user', ['districtCodeFirst']),
    ...mapGetters('business', ['divJoin']),
    ...mapGetters('definedCode', ['valueToCode']),
  },
  created() {
    if (this.each) {
      for (const i in this.$route.query) {
        if (i.indexOf(this.each) !== -1) {
          this.form = i;
          break;
        }
      }
    } else {
      this.form = this.value ? this.value : '';
    }
    if (!this.type) {
      return;
    }
    let form = {};
    let request = '';
    let listType = '';
    let idKey = '';
    let nameKey = '';
    if (this.type.startsWith('healthcare')) {
      listType = 'healthCareList';
      idKey = this.type.endsWith('Code') ? 'districtCode' : 'healthCareId';
      nameKey = 'healthCareName';
      if (this.type.includes('Business')) {
        form.businessDivision = this.valueToCode('C0003', this.div);
        request = Common.healthCareBusinessList;
      } else {
        form.districtCode = this.code ? this.code : this.districtCodeFirst;
        request = Common.healthCareList;
      }
    } else if (this.type === 'school') {
      form.districtCode = this.code ? this.code : this.districtCode;
      request = Common.schoolList;
      listType = 'schoolList';
      idKey = 'schoolId';
      nameKey = 'schoolName';
    } else if (this.type === 'hospital') {
      form.districtCode = this.code ? this.code : this.districtCode;
      if (this.businessDivision) {
        form.businessDivision = this.valueToCode('C0003', this.businessDivision);
        if (this.userOrganTargetType === 'SC' && ((this.businessDivision === 'E' && !this.divJoin('S')) || this.districtCodeFirst === 'G')) {
          form.schoolId = this.userOrganTargetId;
          form.districtCode = this.districtCodeFirst;
        }
      }
      request = Common.hospitalList;
      listType = 'hospitalList';
      idKey = 'hospitalId';
      nameKey = 'hospitalName';
    }
    request(form).then(res => {
      if (res && res.data.rt === 200) {
        this.apiOptionData = res.data[listType].map(item => {
          return {
            id: item[idKey],
            name: item[nameKey],
          };
        });
      } else {
        alert('알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요. 오류 코드 : ' + res.data.rt);
      }
    });
  },
  methods: {
    input(e) {
      this.form = e.target.value;
      if (this.each) {
        let query = {};
        for (const item of this.$store.state.status[this.each + 'Each']) {
          if (this.form === item.id) {
            query[item.id] = 'Y';
          } else {
            query[item.id] = '';
          }
        }
        this.$emit('input', query);
      } else {
        this.$emit('input', this.form);
      }
    },
  },
};
</script>
