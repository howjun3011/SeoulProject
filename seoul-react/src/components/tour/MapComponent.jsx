// src/components/tour/MapComponent.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MapComponent.css';

// MapComponent : Kakao Maps API를 사용하여 서울시 내 관광지를 지도에 표시하고,
// 사용자가 카테고리별로 관광지를 필터링하거나 특정 관광지의 상세 정보를 확인할 수 있는 컴포넌트
function MapComponent() {
  // 상태 변수 선언

  // 카테고리 선택 상태를 저장하는 상태 변수
  const [cat1, setCat1] = useState('');

  // 활성화된 오버레이(정보창)의 고유 키를 저장하는 상태 변수
  const [activeOverlayKey, setActiveOverlayKey] = useState(null);

  // 서울 최외곽 경계선 GeoJSON 데이터를 저장하는 상태 변수
  const [seoulBoundary, setSeoulBoundary] = useState(null);

  // 서울 구 단위 경계선 GeoJSON 데이터를 저장하는 상태 변수
  const [seoulDistricts, setSeoulDistricts] = useState(null);

  // 지도의 로드 상태를 나타내는 상태 변수
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 현재 지도에 표시된 관광지 정보를 저장하는 상태 변수
  const [tourInfos, setTourInfos] = useState([]);

  // 클러스터 마커를 저장하기 위한 Ref 객체
  const clustersRef = useRef([]);

  // 클러스터 팝업의 상태를 저장하는 상태 변수
  const [clusterPopup, setClusterPopup] = useState({ visible: false, tours: [], position: null });

  // useRef 훅을 사용하여 다양한 변수를 관리

  // 지도 인스턴스를 저장하는 Ref 객체
  const mapRef = useRef(null);

  // 오버레이 인스턴스를 저장하는 Ref 객체
  const overlayRef = useRef(null);

  // 마커를 저장하는 Map 객체를 Ref로 관리
  const markersRef = useRef(new Map());

  // 서울 구 단위 폴리곤 인스턴스 배열을 저장하는 Ref 객체
  const seoulDistrictPolygonsRef = useRef([]);

  // 서울 최외곽 폴리곤 인스턴스 배열을 저장하는 Ref 객체
  const seoulBoundaryPolygonsRef = useRef([]);

  // 'idle' 이벤트 리스너를 저장하는 Ref 객체
  const idleListenerRef = useRef(null);

  // React Router의 네비게이션 훅을 사용하여 페이지 이동을 관리
  const navigate = useNavigate();

  // 카테고리 옵션 배열: 사용자가 선택할 수 있는 관광지 카테고리 목록
  const cat1Options = [
    { code: 'A01', name: '자연' },
    { code: 'A02', name: '인문(문화/예술/역사)' },
    { code: 'A03', name: '레포츠' },
    { code: 'A04', name: '쇼핑' },
    { code: 'A05', name: '음식' },
    { code: 'B02', name: '숙박' },
    // { code: 'C01', name: '추천코스' }, // 제거됨
  ];

  // 카테고리별 마커 이미지 매핑: 각 카테고리에 따라 다른 마커 이미지를 사용
  const markerImages = {
    A01: '/markers/blue.png',        // 자연
    A02: '/markers/orange.png',      // 인문(문화/예술/역사)
    A03: '/markers/mint.png',        // 레포츠
    A04: '/markers/burgundy.png',    // 쇼핑
    A05: '/markers/pink.png',        // 음식
    B02: '/markers/purple.png',      // 숙박
    default: '/markers/default.png', // 기본 마커 이미지
  };

  // cat1 상태 변수를 Ref로 관리하여 비동기 함수 내에서도 최신 상태를 유지
  const cat1Ref = useRef(cat1);

  // cat1 상태가 변경될 때마다 cat1Ref.current를 업데이트
  useEffect(() => {
    cat1Ref.current = cat1;
  }, [cat1]);

  /**
   * GeoJSON 파일을 로드하여 서울시의 최외곽 및 구 단위 경계선을 상태 변수에 저장합니다.
   */
  useEffect(() => {
    // 서울 최외곽 경계선 로드 함수
    const loadSeoulBoundary = async () => {
      try {
        // public 폴더 내의 seoul.geojson 파일을 fetch로 가져옴
        const response = await fetch('/seoul.geojson');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSeoulBoundary(data); // 상태 변수에 GeoJSON 데이터 저장
        console.log('서울 최외곽 GeoJSON 데이터 로드 성공:', data);
      } catch (error) {
        console.error('서울 최외곽 GeoJSON 로드 중 오류 발생:', error);
      }
    };

    // 서울 구 단위 경계선 로드 함수
    const loadSeoulDistricts = async () => {
      try {
        // public 폴더 내의 seoulGeoJSON.geojson 파일을 fetch로 가져옴
        const response = await fetch('/seoulGeoJSON.geojson');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSeoulDistricts(data); // 상태 변수에 GeoJSON 데이터 저장
        console.log('서울 구 단위 GeoJSON 데이터 로드 성공:', data);
      } catch (error) {
        console.error('서울 구 단위 GeoJSON 로드 중 오류 발생:', error);
      }
    };

    // 두 GeoJSON 파일을 비동기로 로드
    loadSeoulBoundary();
    loadSeoulDistricts();
  }, []); // 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 실행

  /**
   * 관광지 정보를 가져와 마커와 클러스터를 업데이트하는 함수입니다.
   * @param {number} centerLat - 현재 지도 중심의 위도
   * @param {number} centerLng - 현재 지도 중심의 경도
   */
  const fetchTourInfo = async (centerLat, centerLng) => {
    try {
      // 백엔드 API를 호출하여 현재 중심 위치 근처의 관광지 정보를 가져옴
      const response = await axios.get('http://localhost:9002/seoul/tour/nearby', {
        params: {
          latitude: centerLat,
          longitude: centerLng,
          radius: 1, // 반경 1km 내 관광지
          cat1: cat1Ref.current || null, // 선택된 카테고리 필터
        },
      });

      // 기존에 지도에 표시된 마커를 모두 제거
      markersRef.current.forEach((marker, key) => {
        marker.setMap(null);
        markersRef.current.delete(key);
      });

      // 기존 클러스터 마커와 오버레이를 모두 제거
      clustersRef.current.forEach((cluster) => {
        cluster.marker.setMap(null);
        cluster.overlay.setMap(null);
      });
      clustersRef.current = [];

      // API 응답에서 중복된 관광지 제거 (title과 좌표 기준)
      const uniqueTours = response.data.filter((tour, index, self) =>
          index === self.findIndex((t) =>
            t.title === tour.title && t.mapX === tour.mapX && t.mapY === tour.mapY
          )
      );

      // 고유 키를 부여하여 관광지 정보를 업데이트
      const uniqueToursWithKeys = uniqueTours.map((tour, index) => ({
        ...tour,
        uniqueKey: tour.id || `${tour.mapX}-${tour.mapY}-${index}`, // 고유 키 생성
      }));

      // 좌표별로 관광지를 그룹화 (동일 좌표로 클러스터링)
      const groupedTours = uniqueToursWithKeys.reduce((groups, tour) => {
        const key = `${tour.mapY.toFixed(5)}_${tour.mapX.toFixed(5)}`; // 소수점 5자리까지 반올림하여 그룹화
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(tour);
        return groups;
      }, {});

      const clusterData = [];

      // 각 그룹에 대해 마커 또는 클러스터 마커를 생성
      Object.keys(groupedTours).forEach((groupKey) => {
        const tours = groupedTours[groupKey];
        if (tours.length === 1) {
          // 관광지가 하나인 경우 단일 마커 생성
          const tourInfo = tours[0];
          const position = new window.kakao.maps.LatLng(tourInfo.mapY, tourInfo.mapX);

          // 카테고리에 따른 마커 이미지 선택
          const markerImageSrc = markerImages[tourInfo.cat1] || markerImages.default;
          const imageSize = new window.kakao.maps.Size(33, 44); // 마커 이미지 크기 설정
          const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize);

          // 마커 생성 및 지도에 표시
          const marker = new window.kakao.maps.Marker({
            position: position,
            image: markerImage, // 마커 이미지 설정
            map: mapRef.current,
            zIndex: 3, // 마커의 zIndex 설정 (다른 요소보다 앞에 표시)
          });

          // 마커를 Map 객체에 저장하여 추후 제거 가능하게 함
          const markerKey = tourInfo.uniqueKey;
          markersRef.current.set(markerKey, marker);

          // 마커 클릭 이벤트 등록: 클릭 시 해당 마커의 오버레이를 활성화
          window.kakao.maps.event.addListener(marker, 'click', () => {
            setActiveOverlayKey(markerKey);
          });
        } else {
          // 관광지가 여러 개인 경우 클러스터 마커 생성
          const firstTour = tours[0];
          const position = new window.kakao.maps.LatLng(firstTour.mapY, firstTour.mapX);

          // 클러스터 마커 생성
          const clusterMarker = new window.kakao.maps.Marker({
            position: position,
            map: mapRef.current,
            zIndex: 5, // 클러스터 마커의 zIndex 설정 (단일 마커보다 앞에 표시)
            image: new window.kakao.maps.MarkerImage(
              `/markers/cluster.png`, // 클러스터 마커 이미지 경로 (숫자가 표시된 이미지 필요)
              new window.kakao.maps.Size(40, 40) // 클러스터 마커 이미지 크기 설정
            ),
          });

          // 클러스터 내 관광지 수를 표시하기 위한 커스텀 오버레이 생성
          const clusterOverlay = new window.kakao.maps.CustomOverlay({
            content: `<div class="cluster-overlay">${tours.length}</div>`, // 오버레이 내용: 관광지 수
            position: position,
            map: mapRef.current,
            yAnchor: 0.5, // Y축 앵커 포인트 설정
            xAnchor: 0.5, // X축 앵커 포인트 설정
            zIndex: 6, // 오버레이의 zIndex 설정 (클러스터 마커보다 앞에 표시)
          });

          // 클러스터 마커 클릭 시 팝업 표시
          window.kakao.maps.event.addListener(clusterMarker, 'click', () => {
            setClusterPopup({
              visible: true,
              tours: tours,
              position: position,
            });
          });

          // 클러스터 데이터를 배열에 저장
          clusterData.push({ marker: clusterMarker, overlay: clusterOverlay, tours: tours });
        }
      });

      // 클러스터 상태를 Ref로 업데이트
      clustersRef.current = clusterData;

      // 관광지 정보를 상태 변수에 저장
      setTourInfos(uniqueToursWithKeys);
    } catch (error) {
      console.error('Error fetching tour info:', error);
    }
  };

  /**
   * 클러스터 팝업을 닫는 함수입니다.
   */
  const closeClusterPopup = () => {
    setClusterPopup({ visible: false, tours: [], position: null });
  };

  /**
   * Kakao Maps 스크립트를 로드하고 지도를 초기화하는 useEffect 훅입니다.
   */
  useEffect(() => {
    /**
     * 지도를 로드하는 함수입니다.
     */
    const loadMap = () => {
      // 이미 Kakao Maps 스크립트가 로드되어 있다면 초기화만 수행
      if (window.kakao && window.kakao.maps) {
        initializeMap();
        return;
      }

      // Kakao Maps API 스크립트를 동적으로 추가
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services,clusterer,drawing`;
      script.async = true;

      // 스크립트 로드 성공 시 지도 초기화
      script.onload = () => {
        console.log('Kakao Maps 스크립트 로드 성공');
        initializeMap();
      };

      // 스크립트 로드 실패 시 에러 처리
      script.onerror = () => {
        console.error('Kakao Map script failed to load');
        alert('지도를 불러오지 못했습니다.');
      };

      // 스크립트를 문서의 head에 추가하여 로드 시작
      document.head.appendChild(script);
    };

    /**
     * 지도를 초기화하고 현재 위치를 표시하는 함수입니다.
     */
    const initializeMap = () => {
      const kakao = window.kakao; // kakao 객체 정의

      // 위치 정보 요청 및 지도 초기화
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const lat = position.coords.latitude; // 위도
            const lng = position.coords.longitude; // 경도
            setupMap(lat, lng); // 위치 정보로 지도 설정
          },
          function (error) {
            console.error('Error getting location:', error);
            alert('위치 정보를 가져올 수 없어 기본 위치로 표시합니다.');
            setupMap(37.5665, 126.9780); // 위치 정보 가져오기 실패 시 서울 시청의 위도와 경도로 초기화
          }
        );
      } else {
        alert('GPS를 지원하지 않습니다');
        setupMap(37.5665, 126.9780); // GPS 지원하지 않을 경우 서울 시청의 위도와 경도로 초기화
      }
    };

    /**
     * 지도를 설정하고 현재 위치를 표시하는 마커와 오버레이를 추가하는 함수입니다.
     * @param {number} lat - 초기 지도 중심의 위도
     * @param {number} lng - 초기 지도 중심의 경도
     */
    const setupMap = (lat, lng) => {
      const kakao = window.kakao; // kakao 객체 정의
      const container = document.getElementById('map'); // 지도를 표시할 div 요소
      const options = {
        center: new kakao.maps.LatLng(lat, lng), // 초기 지도 중심좌표 설정
        level: 3, // 초기 확대 수준 설정
      };
      mapRef.current = new kakao.maps.Map(container, options); // 지도 인스턴스 생성 및 Ref에 저장

      // 현재 위치를 표시하는 마커 생성
      const markerPosition = new kakao.maps.LatLng(lat, lng);
      const userMarker = new kakao.maps.Marker({
        position: markerPosition,
        zIndex: 4, // 사용자 마커의 zIndex 설정 (기본 마커보다 앞에 표시)
      });
      userMarker.setMap(mapRef.current); // 지도에 사용자 마커 표시

      // 현재 위치를 표시하는 커스텀 오버레이 생성
      const content = `<div class="useroverlay">현재 내 위치</div>`;

      const userOverlay = new kakao.maps.CustomOverlay({
        content: content, // 오버레이 내용
        map: mapRef.current, // 지도에 표시
        position: userMarker.getPosition(), // 마커 위치에 오버레이 위치 설정
        yAnchor: 1, // Y축 앵커 포인트 설정
        zIndex: 4, // 오버레이의 zIndex 설정
      });

      // 전역 오버레이 생성 (관광지 정보 표시용)
      overlayRef.current = new kakao.maps.CustomOverlay({
        yAnchor: 1, // Y축 앵커 포인트 설정
        zIndex: 100, // 오버레이의 zIndex를 높게 설정하여 다른 요소들 위에 표시
      });
      overlayRef.current.setMap(null); // 초기에는 오버레이를 숨김

      setIsMapLoaded(true); // 지도 로드 완료 상태 업데이트
      console.log('지도 초기화 완료');

      // 서울 구 단위 및 최외곽 경계선 폴리곤 생성
      if (seoulBoundary && seoulDistricts) {
        createSeoulPolygon(); // 서울 구 단위 경계선 폴리곤 생성
        createSeoulBoundaryPolygon(); // 서울 최외곽 경계선 폴리곤 생성
      }

      // 초기 지도 중심 위치 근처의 관광지 정보 로드
      fetchTourInfo(lat, lng);
    };

    // 지도를 로드하는 함수 호출
    loadMap();
  }, []); // 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 실행

  /**
   * GeoJSON 데이터와 지도가 모두 로드되면 서울 경계선 폴리곤을 생성하는 useEffect 훅입니다.
   */
  useEffect(() => {
    if (seoulBoundary && seoulDistricts && isMapLoaded && mapRef.current) {
      createSeoulPolygon(); // 서울 구 단위 경계선 폴리곤 생성
      createSeoulBoundaryPolygon(); // 서울 최외곽 경계선 폴리곤 생성
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seoulBoundary, seoulDistricts, isMapLoaded]); // 관련 상태가 변경될 때마다 실행

  /**
   * 서울 구 단위 경계선 폴리곤을 생성하여 지도에 표시하는 함수입니다.
   * @description seoulGeoJSON 데이터의 좌표를 사용하여 서울의 구 단위 경계선을 그립니다.
   */
  const createSeoulPolygon = () => {
    const kakao = window.kakao; // kakao 객체 정의
    const polygons = []; // 생성된 폴리곤을 저장할 배열

    // GeoJSON 파일이 제대로 로드되었는지 확인
    if (!seoulDistricts || !seoulDistricts.features || seoulDistricts.features.length === 0) {
      console.error('Invalid seoulDistricts GeoJSON data');
      return;
    }

    // GeoJSON의 각 피처(구 단위)를 순회하여 폴리곤 생성
    seoulDistricts.features.forEach((feature, featureIndex) => {
      const { geometry } = feature;
      const { type, coordinates } = geometry;

      if (type === 'Polygon') {
        // 단일 폴리곤의 경우
        const path = coordinates[0].map(
          (coord, coordIndex) => {
            const latLng = new kakao.maps.LatLng(coord[1], coord[0]); // [위도, 경도] 순으로 변환
            return latLng;
          }
        );

        // 폴리곤 생성 및 지도에 표시
        const polygon = new kakao.maps.Polygon({
          map: mapRef.current,
          path: path, // 폴리곤의 경로 설정
          strokeWeight: 2, // 경계선 굵기 설정
          strokeColor: '#007bdf', // 경계선 색상 설정 (파란색)
          strokeOpacity: 1, // 경계선 투명도 설정
          zIndex: 10, // 다른 요소들 위에 표시
        });

        polygons.push(polygon); // 생성된 폴리곤을 배열에 추가
      } else if (type === 'MultiPolygon') {
        // 다중 폴리곤의 경우 각 폴리곤을 별도로 생성
        coordinates.forEach((polygonCoords, polygonIndex) => {
          const path = polygonCoords[0].map(
            (coord, coordIndex) => {
              const latLng = new kakao.maps.LatLng(coord[1], coord[0]); // [위도, 경도] 순으로 변환
              return latLng;
            }
          );

          const polygon = new kakao.maps.Polygon({
            map: mapRef.current,
            path: path, // 폴리곤의 경로 설정
            strokeWeight: 2,
            strokeColor: '#007bdf',
            strokeOpacity: 1,
            zIndex: 10,
          });

          polygons.push(polygon); // 생성된 폴리곤을 배열에 추가
        });
      }
    });

    // 기존에 생성된 서울 구 단위 폴리곤을 모두 제거
    seoulDistrictPolygonsRef.current.forEach((polygon) => polygon.setMap(null));
    seoulDistrictPolygonsRef.current = polygons; // 새로운 폴리곤 배열로 업데이트
    console.log('서울 구 단위 경계선 폴리곤 생성 완료');
  };

  /**
   * 서울 최외곽 경계선을 생성하여 지도에 표시하는 함수입니다.
   * @description seoulBoundary GeoJSON 데이터를 사용하여 서울의 최외곽 경계선을 그립니다.
   */
  const createSeoulBoundaryPolygon = () => {
    const kakao = window.kakao; // kakao 객체 정의
    console.log('createSeoulBoundaryPolygon 호출 시 seoulBoundary:', seoulBoundary);
    const polygons = []; // 생성된 폴리곤을 저장할 배열

    // GeoJSON 파일이 제대로 로드되었는지 확인
    if (!seoulBoundary || !seoulBoundary.features || seoulBoundary.features.length === 0) {
      console.error('Invalid seoulBoundary GeoJSON data');
      return;
    }

    // GeoJSON의 각 피처(최외곽 경계)를 순회하여 폴리곤 생성
    seoulBoundary.features.forEach((feature, featureIndex) => {
      const { geometry } = feature;
      const { type, coordinates } = geometry;

      if (type === 'Polygon') {
        // 단일 폴리곤의 경우
        const path = coordinates[0].map(
          (coord, coordIndex) => {
            const latLng = new kakao.maps.LatLng(coord[1], coord[0]); // [위도, 경도] 순으로 변환
            return latLng;
          }
        );

        // 폴리곤 생성 및 지도에 표시
        const polygon = new kakao.maps.Polygon({
          map: mapRef.current,
          path: path, // 폴리곤의 경로 설정
          strokeWeight: 3, // 경계선 굵기 설정
          strokeColor: '#000000', // 경계선 색상 설정 (검은색)
          fillColor: 'rgba(0, 0, 255, 0.1)', // 채우기 색상 설정 (투명 파란색)
          strokeOpacity: 1, // 경계선 투명도 설정
          zIndex: 11, // 구 단위 경계선보다 위에 표시
        });

        polygons.push(polygon); // 생성된 폴리곤을 배열에 추가
      } else if (type === 'MultiPolygon') {
        // 다중 폴리곤의 경우 각 폴리곤을 별도로 생성
        coordinates.forEach((polygonCoords, polygonIndex) => {
          const path = polygonCoords[0].map(
            (coord, coordIndex) => {
              const latLng = new kakao.maps.LatLng(coord[1], coord[0]); // [위도, 경도] 순으로 변환
              return latLng;
            }
          );

          const polygon = new kakao.maps.Polygon({
            map: mapRef.current,
            path: path, // 폴리곤의 경로 설정
            strokeWeight: 3,
            strokeColor: '#000000',
            strokeOpacity: 1,
            zIndex: 11,
          });

          polygons.push(polygon); // 생성된 폴리곤을 배열에 추가
        });
      }
    });

    // 기존에 생성된 서울 최외곽 폴리곤을 모두 제거
    seoulBoundaryPolygonsRef.current.forEach((polygon) => polygon.setMap(null));
    seoulBoundaryPolygonsRef.current = polygons; // 새로운 폴리곤 배열로 업데이트
    console.log('서울 최외곽 경계선 폴리곤 생성 완료');
  };

  /**
   * 지도가 이동될 때마다 관광지 정보를 업데이트하는 useEffect 훅입니다.
   */
  useEffect(() => {
    // 지도가 로드되지 않았거나, mapRef가 없으면 실행하지 않음
    if (!isMapLoaded || !mapRef.current) return;

    const kakao = window.kakao; // kakao 객체 정의

    /**
     * 'idle' 이벤트 리스너를 추가하여 지도가 이동 완료될 때마다 호출됩니다.
     */
    const addIdleListener = () => {
      const listener = kakao.maps.event.addListener(mapRef.current, 'idle', () => {
        const center = mapRef.current.getCenter(); // 현재 지도 중심 좌표 가져오기
        const centerLat = center.getLat(); // 위도
        const centerLng = center.getLng(); // 경도
        fetchTourInfo(centerLat, centerLng); // 새로운 중심 위치로 관광지 정보 업데이트
      });

      idleListenerRef.current = listener; // 리스너를 Ref에 저장하여 추후 제거 가능하게 함
    };

    addIdleListener(); // 'idle' 이벤트 리스너 추가

    /**
     * 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
     */
    return () => {
      if (idleListenerRef.current) {
        kakao.maps.event.removeListener(idleListenerRef.current); // 이벤트 리스너 제거
        idleListenerRef.current = null; // Ref 초기화
      }
    };
  }, [isMapLoaded]); // isMapLoaded가 변경될 때마다 실행

  /**
   * 카테고리(cat1)가 변경될 때마다 관광지 정보를 업데이트하는 useEffect 훅입니다.
   */
  useEffect(() => {
    // 지도가 로드되지 않았거나, mapRef가 없으면 실행하지 않음
    if (!isMapLoaded || !mapRef.current) return;

    const kakao = window.kakao; // kakao 객체 정의

    // 현재 지도 중심 좌표 가져오기
    const center = mapRef.current.getCenter();
    const centerLat = center.getLat();
    const centerLng = center.getLng();

    // 새로운 카테고리 필터에 맞는 관광지 정보 가져오기
    fetchTourInfo(centerLat, centerLng);
  }, [cat1, isMapLoaded]); // cat1이나 isMapLoaded가 변경될 때마다 실행

  /**
   * 현재 위치로 돌아가는 함수입니다.
   * 사용자의 현재 위치를 다시 가져와 지도의 중심을 해당 위치로 이동시킵니다.
   */
  const returnToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude; // 위도
          const lng = position.coords.longitude; // 경도
          const kakao = window.kakao; // kakao 객체 정의
          const newCenter = new kakao.maps.LatLng(lat, lng); // 새로운 중심 좌표 생성
          mapRef.current.setCenter(newCenter); // 지도의 중심을 새로운 좌표로 이동
          setActiveOverlayKey(null); // 활성화된 오버레이 닫기
        },
        function (error) {
          console.error('Error getting location:', error);
          alert('위치 정보를 가져올 수 없어 현재 위치로 돌아갈 수 없습니다.');
        }
      );
    } else {
      alert('GPS를 지원하지 않습니다');
    }
  };

  /**
   * 상시 관광지 정보 모달에서 카테고리 필터링을 위한 필터링된 관광지 정보를 생성합니다.
   */
  const filteredTourInfos = cat1
    ? tourInfos.filter((tour) => tour.cat1 === cat1)
    : tourInfos;

  /**
   * 활성화된 오버레이를 업데이트할 때 호출되는 useEffect 훅입니다.
   * 선택된 관광지의 상세 정보를 가져와 오버레이에 표시합니다.
   */
  useEffect(() => {
    const kakao = window.kakao; // kakao 객체 정의

    /**
     * 상세 관광지 정보를 가져오는 비동기 함수입니다.
     * @param {string} contentId - 관광지의 콘텐츠 ID
     * @returns {object|null} - 상세 정보 객체 또는 null
     */
    const fetchTourDetail = async (contentId) => {
      const serviceKey = "yUAPog6Rgt2Os0UIFDpFja5DVD0qzGn6j1PHTeXT5QkxuaK4FjVPHFSNLlVeQ9lD2Gv5P6fsJyUga4R5zA0osA=="; // API 서비스 키
      const url = `https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&serviceKey=${serviceKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.response.body.items.item[0]; // 필요한 데이터 추출
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        return null;
      }
    };

    /**
     * 추가적인 상세 정보를 가져오는 비동기 함수입니다.
     * @param {string} contentId - 관광지의 콘텐츠 ID
     * @param {string} contentTypeId - 관광지의 콘텐츠 타입 ID
     * @returns {object|null} - 추가 상세 정보 객체 또는 null
     */
    const fetchTourDetailInfo = async (contentId, contentTypeId) => {
      const serviceKey = "yUAPog6Rgt2Os0UIFDpFja5DVD0qzGn6j1PHTeXT5QkxuaK4FjVPHFSNLlVeQ9lD2Gv5P6fsJyUga4R5zA0osA=="; // API 서비스 키
      const url = `https://apis.data.go.kr/B551011/KorService1/detailIntro1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}&contentTypeId=${contentTypeId}&serviceKey=${serviceKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.response.body.items.item[0]; // 필요한 데이터 추출
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        return null;
      }
    };

    // 활성화된 오버레이 키가 설정된 경우
    if (activeOverlayKey) {
      // 현재 활성화된 오버레이 키에 해당하는 관광지 정보 찾기
      const tourInfo = tourInfos.find(t => t.uniqueKey === activeOverlayKey);
      if (tourInfo) {
        // 상세 관광지 정보 가져오기
        fetchTourDetail(tourInfo.contentid).then((detailData) => {
          if (detailData) {
            // 추가 상세 정보 가져오기
            fetchTourDetailInfo(tourInfo.contentid, detailData.contenttypeid).then((detailInfo) => {
              // 주소 정보 설정: addr1과 addr2가 있는 경우 병합
              const address = detailData.addr1
                ? detailData.addr2
                  ? `${detailData.addr1}, ${detailData.addr2}`
                  : detailData.addr1
                : "주소 정보 없음";

              // 추가 정보를 조건부로 표시하기 위한 HTML 문자열 생성
              const extraInfo = `
                ${detailInfo?.infocenterfood ? `<p><strong>식당 문의처:</strong> ${detailInfo.infocenterfood}</p>` : ""}
                ${detailInfo?.opentimefood ? `<p><strong>영업시간:</strong> ${detailInfo.opentimefood}</p>` : ""}
                ${detailInfo?.infocentershopping ? `<p><strong>쇼핑 문의처:</strong> ${detailInfo.infocentershopping}</p>` : ""}
                ${detailInfo?.opentime ? `<p><strong>운영 시간:</strong> ${detailInfo.opentime}</p>` : ""}
                ${detailInfo?.infocenterlodging ? `<p><strong>숙소 문의처:</strong> ${detailInfo.infocenterlodging}</p>` : ""}
                ${detailInfo?.checkintime && detailInfo?.checkouttime
                ? `<p><strong>체크인:</strong> ${detailInfo.checkintime}, <strong>체크아웃:</strong> ${detailInfo.checkouttime}</p>`
                : ""}
                ${detailInfo?.infocenterleports ? `<p><strong>레포츠 문의처:</strong> ${detailInfo.infocenterleports}</p>` : ""}
                ${detailInfo?.usetimeleports ? `<p><strong>레포츠 이용 시간:</strong> ${detailInfo.usetimeleports}</p>` : ""}
                ${detailInfo?.infocenter ? `<p><strong>일반 문의:</strong> ${detailInfo.infocenter}</p>` : ""}
                ${detailInfo?.usetime ? `<p><strong>이용 시간:</strong> ${detailInfo.usetime}</p>` : ""}
                ${detailInfo?.infocenterculture ? `<p><strong>문화 문의처:</strong> ${detailInfo.infocenterculture}</p>` : ""}
                ${detailInfo?.sponsor1tel ? `<p><strong>스폰서 연락처:</strong> ${detailInfo.sponsor1tel}</p>` : ""}
                ${detailInfo?.playtime ? `<p><strong>운영 시간:</strong> ${detailInfo.playtime}</p>` : ""}
              `;

              // 오버레이에 표시할 콘텐츠 생성
              const content = `
                <div class="customoverlay-content">
                  <h4>${detailData.title}</h4>
                  ${detailData.firstimage ? `<img src="${detailData.firstimage}" alt="${detailData.title}" onerror="this.src='/markers/default.png'" />` : `<p>이미지가 없습니다.</p>`}
                  <p><strong>주소:</strong> ${address}</p>
                  ${extraInfo} <!-- 추가 정보 표시 -->
                </div>
              `;

              const contentDescription = `
                <div class="customoverlay-content description">
                  <p><strong>설명:</strong> ${detailData.overview || "설명 없음"}</p>
                </div>
              `;

              // 콘텐츠와 설명을 합친 최종 HTML 콘텐츠
              const mergedContent = `
                ${content}
                ${contentDescription}
              `;

              // 관광지의 위치를 LatLng 객체로 생성
              const position = new kakao.maps.LatLng(tourInfo.mapY, tourInfo.mapX);

              // 오버레이에 콘텐츠 설정 및 지도에 표시
              overlayRef.current.setContent(mergedContent);
              overlayRef.current.setPosition(position);
              overlayRef.current.setZIndex(100);
              overlayRef.current.setMap(mapRef.current);
            });
          }
        });
      }
    } else {
      // 활성화된 오버레이 키가 없는 경우 오버레이 숨기기
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }
    }
  }, [activeOverlayKey, tourInfos]); // activeOverlayKey나 tourInfos가 변경될 때마다 실행

  /**
   * 축제 페이지로 이동하는 함수입니다.
   */
  const navigateToFestival = () => {
    navigate('/seoul/tour/festival');
  };

  /**
   * 반려동물 동반 여행지 페이지로 이동하는 함수입니다.
   */
  const navigateToPet = () => {
    navigate('/seoul/tour/pet');
  };

  // 커스텀 레이아웃 표시 여부를 관리하는 상태 변수
  const [customOverlayVisible, setCustomOverlayVisible] = useState(false);

  /**
   * 커스텀 오버레이를 활성화하는 함수입니다.
   */
  const showCustomOverlay = () => {
    setCustomOverlayVisible(true);
  };

  /**
   * 커스텀 오버레이를 닫는 함수입니다.
   */
  const hideCustomOverlay = () => {
    setCustomOverlayVisible(false);
    if (overlayRef.current) {
      overlayRef.current.setMap(null); // 커스텀 오버레이 숨기기
    }
  };

  /**
   * 오버레이가 활성화될 때 상태를 업데이트하여 커스텀 레이아웃 버튼을 표시합니다.
   */
  useEffect(() => {
    if (activeOverlayKey && overlayRef.current) {
      setCustomOverlayVisible(true); // 오버레이가 활성화되면 버튼 표시
    }
  }, [activeOverlayKey]);

  return (
    <div style={{ position: 'relative' }}>
      {/* 현재 위치로 돌아가는 버튼 */}
      <button
        onClick={returnToCurrentLocation}
        className="current-location-button"
      >
        현재 위치로
      </button>

      {/* 축제 페이지로 이동하는 버튼 */}
      <button
        onClick={navigateToFestival}
        className="navigate-festival-button"
        style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 5 }}
      >
        축제 보기
      </button>

      {/* 반려동물 동반 여행지 페이지로 이동하는 버튼 */}
      <button
        onClick={navigateToPet}
        className="navigate-pet-button"
        style={{ position: 'absolute', top: '60px', left: '10px', zIndex: 5 }}
      >
        반려동물 동반 여행지 보기
      </button>

      {/* 클러스터 팝업: 클러스터 마커를 클릭했을 때 표시되는 팝업 */}
      {clusterPopup.visible && (
        <div
          className="cluster-popup"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            zIndex: 1002,
          }}
        >
          <h4>관광지 목록</h4>
          <ul>
            {clusterPopup.tours.map((tour) => (
              <li key={tour.uniqueKey}>
                <button
                  className="cluster-tour-button"
                  onClick={() => {
                    const kakao = window.kakao; // kakao 객체 정의
                    // 선택된 관광지로 지도 중심 이동 및 오버레이 활성화
                    mapRef.current.panTo(new kakao.maps.LatLng(tour.mapY, tour.mapX));
                    setActiveOverlayKey(tour.uniqueKey);
                    closeClusterPopup(); // 클러스터 팝업 닫기
                  }}
                >
                  {tour.title}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={closeClusterPopup} className="close-cluster-popup">
            닫기
          </button>
        </div>
      )}

      {/* 커스텀 레이아웃 닫기 버튼: 오버레이가 활성화되면 표시됨 */}
      {customOverlayVisible && (
        <button
          onClick={hideCustomOverlay}
          className="close-overlay-button"
        >
          설명 닫기
        </button>
      )}

      {/* 지도 표시를 위한 div 요소 */}
      <div
        id="map"
        style={{ width: '100%', height: '100vh' }}
      ></div>

      {/* 지도 중앙에 항상 표시될 타겟 아이콘 이미지 */}
      <img src="/markers/aim.png" alt="Center Marker" className="map-center-icon" />

      {/* 상시 관광지 정보 모달창: 사용자가 카테고리를 선택하고 관광지 목록을 볼 수 있음 */}
      <div className="persistent-modal">
        <h3>관광지 목록</h3>
        {/* 모달 닫기 버튼 */}
        <button
          onClick={hideCustomOverlay}
          className="close-overlay-button xBtn"
        >
          X
        </button>
        {/* 카테고리 탭: 사용자가 카테고리를 선택할 수 있는 버튼들 */}
        <div className="category-tabs">
          <div className="center-box">
            <button
              className={`tab-button ${cat1 === '' ? 'active' : ''}`}
              onClick={() => setCat1('')} // '전체' 카테고리 선택 시
            >
              전체
            </button>
            {cat1Options.map((option) => (
              <button
                key={option.code}
                className={`tab-button ${cat1 === option.code ? 'active' : ''}`}
                onClick={() => setCat1(option.code)} // 특정 카테고리 선택 시
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        {/* 필터링된 관광지 목록 표시 */}
        {filteredTourInfos.length > 0 ? (
          filteredTourInfos.map((tourInfo) => {
            // 고유한 키 생성
            const key = tourInfo.uniqueKey;

            /**
             * 관광지 항목을 클릭했을 때 호출되는 함수
             */
            const handleClick = () => {
              const kakao = window.kakao; // kakao 객체 정의
              // 선택된 관광지의 위치로 지도 중심 이동
              mapRef.current.panTo(new kakao.maps.LatLng(tourInfo.mapY, tourInfo.mapX));

              // 해당 관광지의 오버레이 활성화
              setActiveOverlayKey(key);
            };

            return (
              <div
                key={key}
                className="tour-item"
                onClick={handleClick} // 클릭 시 handleClick 함수 호출
              >
                {tourInfo.imageUrl ? (
                  <img
                    src={tourInfo.imageUrl}
                    alt={tourInfo.title}
                    className="tour-item-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/markers/default.png'; // 이미지 로드 실패 시 대체 이미지 표시
                    }}
                  />
                ) : (
                  <div className="no-image">
                    이미지 없음
                  </div>
                )}
                <span className="tour-item-title">{tourInfo.title}</span>
              </div>
            );
          })
        ) : (
          <p className="no-tours">관광지가 없습니다.</p> // 관광지가 없을 때 표시
        )}
      </div>
    </div>
  );
}

export default MapComponent;
