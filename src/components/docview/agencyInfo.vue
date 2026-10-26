<template>
  <fragment>
    <p class="commp2 fwb mt20">의뢰기관 정보</p>
    <div class="row flex_set mt20">
      <div class="flex_item flex_size_m5">
        <p class="commp fwn">보건소명</p>
        <!-- pdf 적용 위해 style 태그 필요 -->
        <div class="m__putbox mt10">
          <div class="input_box_view">{{ formContents.intensiveRequest.tr_hel_name.value }}</div>
        </div>
      </div>
      <div class="flex_item flex_size_m5 ml20">
        <p class="commp fwn">담당 공무원명</p>
        <!-- pdf 적용 위해 style 태그 필요 -->
        <div class="m__putbox mt10">
          <div class="input_box_view">{{ formContents.intensiveRequest.tr_orm_name.value }}</div>
        </div>
      </div>
      <div class="flex_item flex_size_m5 ml20">
        <p class="commp fwn">전화번호</p>
        <!-- pdf 적용 위해 style 태그 필요 -->
        <div class="m__putbox mt10">
          <div class="input_box_view">{{ formContents.intensiveRequest.tr_orm_tel.value }}</div>
        </div>
      </div>
      <div class="flex_item flex_size_m5 ml20">
        <p class="commp fwn">FAX</p>
        <!-- pdf 적용 위해 style 태그 필요 -->
        <div class="m__putbox mt10">
          <div class="input_box_view">{{ formContents.intensiveRequest.tr_fax.value }}</div>
        </div>
      </div>
      <div class="flex_item flex_size_m5 ml20">
        <p class="commp fwn">진료의뢰일</p>
        <!-- pdf 적용 위해 style 태그 필요 -->
        <div class="m__putbox mt10">
          <div class="input_box_view">{{ formContents.intensiveRequest.tr_date.value }}</div>
        </div>
      </div>
    </div>
  </fragment>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('doc', ['formContents']),
  },
};
</script>
