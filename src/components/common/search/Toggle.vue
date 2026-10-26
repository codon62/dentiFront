<template>
  <div class="item">
    <p class="commp fwb">{{ data.title }}</p>
    <div class="put__set mt10">
      <div class="toggle__btns">
        <a v-for="(item, key) in data.value" :id="`${data.id}${key}`" ref="btns" :key="key" href="javascript:;" class="toggle_btn" :class="queryClass(key)" @click="toggle(key)">{{ item }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['status'],
  computed: {
    ...mapGetters('definedCode', ['codeToValue', 'valueToCode']),
    data() {
      return this.$store.state.status[this.status];
    },
  },
  methods: {
    queryClass(key) {
      if (this.data.radio) {
        const param = this.$route.query[this.data.id];
        const value = this.data.sectionCode ? this.codeToValue(param) : param;
        if (value && value === key) {
          return 'on';
        }
      } else {
        const param = this.$route.query[this.data.id + key];
        if (param && param === 'Y') {
          return 'on';
        }
      }
      return '';
    },
    toggle(key) {
      const element = document.getElementById(`${this.data.id}${key}`);
      if (this.data.radio) {
        // 라디오
        if (!element.classList.contains('on')) {
          for (const i in this.$refs.btns) {
            this.$refs.btns[i].classList.remove('on');
          }
          element.classList.add('on');
          this.$emit('input', this.data.sectionCode ? this.valueToCode(this.data.sectionCode, key) : key);
        } else {
          element.classList.remove('on');
          this.$emit('input', '');
        }
      } else {
        // 중복선택
        element.classList.toggle('on');
        let input = {};
        for (const i in this.$refs.btns) {
          const btn = this.$refs.btns[i];
          if (btn.classList.contains('on')) {
            input[btn.id] = 'Y';
          } else {
            input[btn.id] = '';
          }
        }
        this.$emit('input', input);
      }
    },
  },
};
</script>
