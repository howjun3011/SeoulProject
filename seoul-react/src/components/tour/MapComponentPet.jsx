// src/components/tour/MapComponentPet.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './MapComponent.css';
import { useNavigate } from 'react-router-dom';

/**
 * MapComponentPet는 Kakao Maps API를 사용하여 서울시 내 반려동물 동반 여행지를 지도에 표시하고,
 * 사용자가 반려동물 관련 정보를 클릭하여 상세 정보를 확인하거나 다른 페이지로 이동할 수 있는 컴포넌트입니다.
 */
function MapComponentPet() {
  // 상태 변수 선언

  // 서울 최외곽 GeoJSON 데이터를 저장하는 상태 변수
  const [seoulBoundary, setSeoulBoundary] = useState(null);

  // 서울 구 단위 GeoJSON 데이터를 저장하는 상태 변수
  const [seoulDistricts, setSeoulDistricts] = useState(null);

  // 지도의 로드 상태를 나타내는 상태 변수
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 현재 지도에 표시된 반려동물 관련 여행지 정보를 저장하는 상태 변수
  const [petInfos, setPetInfos] = useState([]);

  // 활성화된 오버레이(정보창)의 고유 키를 저장하는 상태 변수
  const [activeOverlayKey, setActiveOverlayKey] = useState(null);

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

  // 반려동물 카테고리 옵션 배열 (필요시 추가 가능)
  const petCatOptions = [
    { code: 'A01', name: '견종' },
    { code: 'A02', name: '고양이' },
    // 추가 카테고리가 있다면 여기에 추가
  ];

  // 카테고리별 마커 이미지 매핑: 각 카테고리에 따라 다른 마커 이미지를 사용
  const markerImages = {
    A01: '/markers/pet.png',        // 견종
    A02: '/markers/pet.png',        // 고양이
    default: '/markers/pet.png',    // 기본 마커 이미지
  };

  /**
   * GeoJSON 파일을 로드하여 서울시의 최외곽 및 구 단위 경계선을 상태 변수에 저장합니다.
   */
  useEffect(() => {
    /**
     * 서울 최외곽 경계선 로드 함수
     */
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

    /**
     * 서울 구 단위 경계선 로드 함수
     */
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
   * 반려동물 정보를 가져와 마커를 업데이트하는 함수입니다.
   * @param {number} centerLat - 현재 지도 중심의 위도
   * @param {number} centerLng - 현재 지도 중심의 경도
   */
  const fetchPetInfo = async (centerLat, centerLng) => {
    try {
      // 백엔드 API를 호출하여 현재 중심 위치 근처의 반려동물 동반 여행지 정보를 가져옴
      const response = await axios.get('http://localhost:9002/seoul/tour/pet/nearby', {
        params: {
          latitude: centerLat,
          longitude: centerLng,
          radius: 5, // 반경 5km 내 반려동물 동반 여행지
          // 필요시 추가 파라미터
        },
      });

      // 기존에 지도에 표시된 마커를 모두 제거
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current.clear(); // Map 객체 비우기

      // API 응답에서 중복된 반려동물 동반 여행지 제거 (title과 좌표 기준)
      const uniquePets = response.data.filter((pet, index, self) =>
          index === self.findIndex((p) =>
            p.title === pet.title && p.mapx === pet.mapx && p.mapy === pet.mapy
          )
      );

      // 고유 키를 부여하여 반려동물 동반 여행지 정보를 업데이트
      const uniquePetsWithKeys = uniquePets.map((pet, index) => ({
        ...pet,
        uniqueKey: pet.tourPetId || `${pet.mapx}-${pet.mapy}-${index}`, // 고유 키 생성
      }));

      // 새로운 마커 추가
      uniquePetsWithKeys.forEach((petInfo) => {
        const position = new window.kakao.maps.LatLng(petInfo.mapy, petInfo.mapx);

        // 카테고리에 따른 마커 이미지 선택
        const markerImageSrc = markerImages[petInfo.cat1] || markerImages.default; // 기본 마커 이미지 경로
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
        const markerKey = petInfo.uniqueKey;
        markersRef.current.set(markerKey, marker);

        // 마커 클릭 이벤트 등록: 클릭 시 해당 마커의 오버레이를 활성화
        window.kakao.maps.event.addListener(marker, 'click', () => {
          setActiveOverlayKey(markerKey);
        });
      });

      // 반려동물 정보를 상태 변수에 저장
      setPetInfos(uniquePetsWithKeys);
    } catch (error) {
      console.error('Error fetching pet info:', error);
    }
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
        level: 8, // 초기 확대 수준 설정
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

      // 전역 오버레이 생성 (반려동물 정보 표시용)
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

      // 초기 지도 중심 위치 근처의 반려동물 동반 여행지 정보 로드
      fetchPetInfo(lat, lng);
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
    console.log('seoulDistricts:', seoulDistricts);
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
        console.log(`Boundary Polygon [Feature ${featureIndex}] created.`);
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
   * 지도가 이동될 때마다 반려동물 동반 여행지 정보를 업데이트하는 useEffect 훅입니다.
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
        fetchPetInfo(centerLat, centerLng); // 새로운 중심 위치로 반려동물 정보 업데이트
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
          mapRef.current.panTo(newCenter); // 지도의 중심을 새로운 좌표로 이동
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
   * 활성화된 오버레이를 업데이트할 때 호출되는 useEffect 훅입니다.
   * 선택된 반려동물 동반 여행지의 상세 정보를 가져와 오버레이에 표시합니다.
   */
  useEffect(() => {
    const kakao = window.kakao; // kakao 객체 정의

    /**
     * 상세 반려동물 동반 여행지 정보를 가져오는 비동기 함수입니다.
     * @param {string} contentid - 여행지의 콘텐츠 ID
     * @returns {Array} - 상세 정보 배열 또는 빈 배열
     */
    const fetchPetDetail = async (contentid) => {
      try {
        const response = await fetch(
          `https://apis.data.go.kr/B551011/KorPetTourService/detailPetTour?serviceKey=yUAPog6Rgt2Os0UIFDpFja5DVD0qzGn6j1PHTeXT5QkxuaK4FjVPHFSNLlVeQ9lD2Gv5P6fsJyUga4R5zA0osA%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&contentId=${contentid}&_type=json`
        );
        const data = await response.json();
        if (
          data.response &&
          data.response.header.resultCode === "0000" &&
          data.response.body &&
          data.response.body.totalCount > 0
        ) {
          const items = data.response.body.items.item;
          if (Array.isArray(items)) {
            return items;
          } else if (items) {
            return [items];
          } else {
            return [];
          }
        } else {
          console.error("API 호출 실패 또는 데이터 없음:", data.response.header.resultMsg);
          return [];
        }
      } catch (error) {
        console.error("API 호출 에러:", error);
        return [];
      }
    };

    // 활성화된 오버레이 키가 설정된 경우
    if (activeOverlayKey) {
      const marker = markersRef.current.get(activeOverlayKey); // 해당 키에 해당하는 마커 가져오기
      if (marker) {
        const position = marker.getPosition(); // 마커 위치 가져오기
        const petInfo = petInfos.find(p => p.uniqueKey === activeOverlayKey); // 반려동물 정보 찾기

        if (petInfo) {
          const { contentid } = petInfo;

          // 상세 반려동물 동반 여행지 정보 가져오기
          fetchPetDetail(contentid).then(details => {
            console.log("API URL:", `https://apis.data.go.kr/B551011/KorPetTourService/detailPetTour?serviceKey=yUAPog6Rgt2Os0UIFDpFja5DVD0qzGn6j1PHTeXT5QkxuaK4FjVPHFSNLlVeQ9lD2Gv5P6fsJyUga4R5zA0osA%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&contentId=${contentid}&_type=json`);
            console.log("API Response Details:", details);

            // details가 항상 배열인지 확인
            const safeDetails = Array.isArray(details) ? details : [];

            // addr1과 addr2를 결합하여 주소 문자열 생성
            const address = petInfo.addr1
              ? (petInfo.addr2 ? `${petInfo.addr1}, ${petInfo.addr2}` : petInfo.addr1)
              : '주소 정보 없음';

            // firstimage가 존재하면 이미지 태그 생성
            const imageContent = petInfo.firstimage
              ? `<img src="${petInfo.firstimage}" alt="${petInfo.title}" class="pet-image" />`
              : `<p class="no-image">이미지 없음</p>`;

            // infoname과 infotext를 기반으로 추가 상세 정보 생성
            // 실제 API 응답에 맞게 필드명 수정
            const detailContent = safeDetails.map(detail => {
              return `
                <p><strong>동반 유형:</strong> ${detail.acmpyTypeCd || '정보 없음'}</p>
                <p><strong>관련 시설:</strong> ${detail.relaPosesFclty || '정보 없음'}</p>
                <p><strong>기타 동반 정보:</strong> ${detail.etcAcmpyInfo || '정보 없음'}</p>
                <p><strong>동반 가능 여부:</strong> ${detail.acmpyPsblCpam || '정보 없음'}</p>
                <p><strong>동반 필요 사항:</strong> ${detail.acmpyNeedMtr || '정보 없음'}</p>
              `;
            }).join("");

            // 오버레이에 표시할 콘텐츠 생성
            const content = `
              <div class="customoverlay-content pet">
                <h4>${petInfo.title}</h4>
                ${imageContent}
                <p><strong>문의처:</strong> ${petInfo.tel || '전화번호 없음'}</p>
                <p><strong>주소:</strong> ${address}</p>
                <p><strong>등록일:</strong> ${petInfo.createdtime ? new Date(petInfo.createdtime).toLocaleDateString() : '정보 없음'}</p>
              </div>
            `;
            const contentDescription = `
              <div class="customoverlay-content description">
                ${detailContent}
              </div>
            `;
            const mergedContent = `
                ${content}
                ${contentDescription}
            `;

            // detailContent이 undefined가 아닌지 확인
            console.log("Merged Content:", mergedContent);

            // 오버레이에 콘텐츠 설정 및 지도에 표시
            overlayRef.current.setContent(mergedContent);
            overlayRef.current.setPosition(position);
            overlayRef.current.setZIndex(100); // CustomOverlay의 zIndex를 높게 설정
            overlayRef.current.setMap(mapRef.current);
          });
        }
      }
    } else {
      // 활성화된 오버레이 키가 없는 경우 오버레이 숨기기
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }
    }
  }, [activeOverlayKey, petInfos]); // activeOverlayKey나 petInfos가 변경될 때마다 실행

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

  /**
   * 관광 페이지로 이동하는 함수입니다.
   */
  const navigateToTour = () => {
    navigate('/seoul/tour');
  };

  /**
   * 축제 페이지로 이동하는 함수입니다.
   */
  const navigateToFestival = () => {
    navigate('/seoul/tour/festival');
  };

  return (
    <div style={{ position: 'relative' }}>

      {/* 현재 위치로 돌아가는 버튼 */}
      <button
        onClick={returnToCurrentLocation}
        className="current-location-button"
      >
        현재 위치로
      </button>

      {/* 커스텀 레이아웃 닫기 버튼: 오버레이가 활성화되면 표시됨 */}
      {customOverlayVisible && (
        <button
          onClick={hideCustomOverlay}
          className="close-overlay-button"
        >
          설명 닫기
        </button>
      )}

      {/* 관광 페이지로 이동하는 버튼 */}
      <button
        onClick={navigateToTour}
        className="navigate-tour-button"
        style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 5 }}
      >
        관광지 보기
      </button>

      {/* 축제 페이지로 이동하는 버튼 */}
      <button
        onClick={navigateToFestival}
        className="navigate-festival-button"
        style={{ position: 'absolute', top: '60px', left: '10px', zIndex: 5 }}
      >
        축제 보기
      </button>

      {/* 지도 표시를 위한 div 요소 */}
      <div
        id="map"
        style={{ width: '100%', height: '100vh' }}
      ></div>

      {/* 지도 중앙에 항상 표시될 타겟 아이콘 이미지 */}
      <img src="/markers/aim.png" alt="Center Marker" className="map-center-icon" />

      {/* 상시 반려동물 동반 여행지 정보 모달창 */}
      <div className="persistent-modal">
        <h3>반려동물 동반 여행지 목록</h3>
        {/* 커스텀 레이아웃 닫기 버튼 */}
        <button
          onClick={hideCustomOverlay}
          className="close-overlay-button xBtn"
        >
          X
        </button>
        {petInfos.length > 0 ? (
          petInfos.map((petInfo, index) => {
            // 고유한 키 생성
            const key = petInfo.uniqueKey;

            /**
             * 반려동물 동반 여행지 항목을 클릭했을 때 호출되는 함수
             */
            const handleClick = () => {
              // 지도 중심 이동
              const marker = markersRef.current.get(key);
              if (marker) {
                const position = marker.getPosition();
                mapRef.current.panTo(position); // 지도 중심 이동

                // 활성화된 오버레이 설정
                setActiveOverlayKey(key);
              } else {
                console.warn(`Marker not found for key: ${key}`);
              }
            };

            return (
              <div
                key={key}
                className="pet-item"
                onClick={handleClick} // 클릭 시 handleClick 함수 호출
              >
                {petInfo.firstimage ? (
                  <img
                    src={petInfo.firstimage}
                    alt={petInfo.title}
                    className="pet-item-image"
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
                <span className="pet-item-title">{petInfo.title}</span>
              </div>
            );
          })
        ) : (
          // 메시지 변경 부분
          <p className="no-pets">반려동물 동반 여행지가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default MapComponentPet;
