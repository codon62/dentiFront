<template>
  <div class="popup_content">
    <v-popuptitle message="병원 위치" imgsrc="sub/ic_b_enroll.png"></v-popuptitle>
    <!-- .popup__con_inner 공통 클래스 .bg__form_ver (입력폼에만 bg컬러 추가) -->
    <div class="popup__con_inner bg__form_ver">
      <div class="board__box mt10">
        <table class="comm__table">
          <colgroup>
            <col width="20%" />
            <col />
            <col width="20%" />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th><p class="commp fwb">병원명</p></th>
              <th class="bg_white">
                <p class="commp fwn">{{ dataObject.hospitalName }}</p>
              </th>
              <th><p class="commp fwb">전화번호</p></th>
              <th class="bg_white">
                <p class="commp fwn">{{ dataObject.hospitalTel }}</p>
              </th>
            </tr>
            <tr>
              <th class="bg_blue"><p class="commp fwb">주소</p></th>
              <th colspan="3" class="bg_white">
                <p class="commp tal pl20 fwn">{{ dataObject.hospitalAddress }}</p>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <!--//board__box-->
      <div id="map" class="mt20" style="width: 100%; height: 400px; border: 1px solid #cad5e6"></div>
    </div>
  </div>
</template>

<script>
import popupTitle from '@/components/popup/PopupTitle.vue';

export default {
  components: {
    'v-popuptitle': popupTitle,
  },
  props: ['dataObject'],
  mounted() {
    const mapContainer = document.getElementById('map'), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(this.dataObject.hospitalLat, this.dataObject.hospitalLon), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

    const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    // 마커가 표시될 위치입니다
    const markerPosition = new kakao.maps.LatLng(this.dataObject.hospitalLat, this.dataObject.hospitalLon);

    // 마커를 생성합니다
    const marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
  },
};
</script>
