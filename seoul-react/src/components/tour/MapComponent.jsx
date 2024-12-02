// MapComponent.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MapComponent() {
  const [cat1, setCat1] = useState('');

  // 카테고리 옵션을 실제 데이터에 맞게 정의합니다.
  const cat1Options = [
    { code: 'A01', name: '자연' },
    { code: 'A02', name: '인문(문화/예술/역사)' },
    { code: 'A03', name: '레포츠' },
    { code: 'A04', name: '쇼핑' },
    { code: 'A05', name: '음식' },
    { code: 'B02', name: '숙박' },
    { code: 'C01', name: '추천코스' },
  ];

  useEffect(() => {
    const loadMap = () => {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services,clusterer,drawing`;
      script.async = true;

      script.onload = () => {
        console.log('Kakao Map script loaded');
        const { kakao } = window;

        const initializeMap = (lat, lng) => {
          const container = document.getElementById('map');
          const options = {
            center: new kakao.maps.LatLng(lat, lng),
            level: 5,
          };
          const map = new kakao.maps.Map(container, options);

          // 현재 위치 마커 표시
          const markerPosition = new kakao.maps.LatLng(lat, lng);
          const userMarker = new kakao.maps.Marker({
            position: markerPosition,
          });
          userMarker.setMap(map);

          // 현재 위치 마커에 정보 창 추가
          const userInfowindow = new kakao.maps.InfoWindow({
            content: '<div style="padding:5px;">현재 내 위치</div>',
          });
          userInfowindow.open(map, userMarker);

          // 마커를 관리하기 위한 배열
          let markers = [];

          // 관광지 데이터를 가져오는 함수 정의
          const fetchTourInfo = (centerLat, centerLng) => {
            axios
              .get('http://localhost:9002/seoul/tour/nearby', {
                params: {
                  latitude: centerLat,
                  longitude: centerLng,
                  radius: 0.5,
                  cat1: cat1 || null,
                },
              })
              .then((response) => {
                console.log('Tour info data:', response.data);

                // 기존 마커 제거
                markers.forEach((marker) => marker.setMap(null));
                markers = [];

                response.data.forEach((tourInfo) => {
                  console.log('Processing tourInfo:', tourInfo);
                  const position = new kakao.maps.LatLng(
                    tourInfo.mapY,
                    tourInfo.mapX
                  );
                  const marker = new kakao.maps.Marker({
                    position: position,
                    map: map,
                  });

                  markers.push(marker);

                  kakao.maps.event.addListener(marker, 'click', function () {
                    const infowindow = new kakao.maps.InfoWindow({
                      content: `<div style="padding:5px;">${tourInfo.title}</div>`,
                    });
                    infowindow.open(map, marker);
                  });
                });
              })
              .catch((error) => {
                console.error('Error fetching tour info:', error);
              });
          };

          // 초기 관광지 데이터 가져오기
          fetchTourInfo(lat, lng);

          // 지도 이동 완료 이벤트 리스너 추가
          kakao.maps.event.addListener(map, 'idle', function () {
            const center = map.getCenter();
            const centerLat = center.getLat();
            const centerLng = center.getLng();
            fetchTourInfo(centerLat, centerLng);
          });
        };

        // 위치 정보 요청
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              console.log('User location obtained');
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              initializeMap(lat, lng);
            },
            function (error) {
              console.error('Error getting location:', error);
              alert('위치 정보를 가져올 수 없어 기본 위치로 표시합니다.');
              // 기본 위치 설정 (예: 서울 시청)
              const lat = 37.5665;
              const lng = 126.9780;
              initializeMap(lat, lng);
            }
          );
        } else {
          alert('GPS를 지원하지 않습니다');
          // 기본 위치 설정 (예: 서울 시청)
          const lat = 37.5665;
          const lng = 126.9780;
          initializeMap(lat, lng);
        }
      };

      script.onerror = () => {
        console.error('Kakao Map script failed to load');
        alert('지도를 불러오지 못했습니다.');
      };

      document.head.appendChild(script);
    };

    loadMap();
  }, [cat1]);

  return (
    <div>
      {/* 카테고리 필터 UI 추가 */}
      <div style={{ marginBottom: '10px' }}>
        <select value={cat1} onChange={(e) => setCat1(e.target.value)}>
          <option value="">대분류 선택</option>
          {cat1Options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div
        id="map"
        style={{ width: '100%', height: '500px', marginTop: '10px' }}
      ></div>
    </div>
  );
}

export default MapComponent;
