// src/components/tour/MapComponent.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MapComponent.css';

function MapComponent() {
  // 상태 변수 선언
  const [cat1, setCat1] = useState(''); // 카테고리 선택 상태
  const [activeOverlayKey, setActiveOverlayKey] = useState(null); // 활성화된 오버레이의 고유 키
  const [seoulBoundary, setSeoulBoundary] = useState(null); // 서울 최외곽 GeoJSON 데이터
  const [seoulDistricts, setSeoulDistricts] = useState(null); // 서울 구 단위 GeoJSON 데이터
  const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태
  const [tourInfos, setTourInfos] = useState([]); // 현재 표시된 관광지 정보

  // useRef 훅을 사용하여 변수 관리
  const mapRef = useRef(null); // 지도 인스턴스 저장
  const overlayRef = useRef(null); // 오버레이 인스턴스 저장
  const markersRef = useRef(new Map()); // 마커를 저장하는 Map 객체
  const seoulDistrictPolygonsRef = useRef([]); // 서울 구 단위 폴리곤 인스턴스 배열 저장
  const seoulBoundaryPolygonsRef = useRef([]); // 서울 최외곽 폴리곤 인스턴스 배열 저장
  const idleListenerRef = useRef(null); // 'idle' 이벤트 리스너 저장

  // React Router의 네비게이션 훅
  const navigate = useNavigate();

  // 카테고리 옵션 배열
  const cat1Options = [
    { code: 'A01', name: '자연' },
    { code: 'A02', name: '인문(문화/예술/역사)' },
    { code: 'A03', name: '레포츠' },
    { code: 'A04', name: '쇼핑' },
    { code: 'A05', name: '음식' },
    { code: 'B02', name: '숙박' },
    // { code: 'C01', name: '추천코스' }, // 제거됨
  ];

  // 카테고리별 마커 이미지 매핑 (기본 이미지 추가)
  const markerImages = {
    A01: '/markers/blue.png',        // 자연
    A02: '/markers/orange.png',      // 인문(문화/예술/역사)
    A03: '/markers/mint.png',        // 레포츠
    A04: '/markers/burgundy.png',    // 쇼핑
    A05: '/markers/pink.png',        // 음식
    B02: '/markers/purple.png',      // 숙박
    default: '/markers/default.png', // 기본 마커 이미지
  };

  // cat1을 ref로 관리하여 최신 상태 유지
  const cat1Ref = useRef(cat1);

  useEffect(() => {
    cat1Ref.current = cat1;
  }, [cat1]);

  /**
   * GeoJSON 파일을 로드하여 상태 변수에 저장합니다.
   */
  useEffect(() => {
    // 서울 최외곽 경계선 로드
    const loadSeoulBoundary = async () => {
      try {
        const response = await fetch('/seoul.geojson'); // public 폴더의 seoul.geojson 파일 경로
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSeoulBoundary(data);
        console.log('서울 최외곽 GeoJSON 데이터 로드 성공:', data);
      } catch (error) {
        console.error('서울 최외곽 GeoJSON 로드 중 오류 발생:', error);
      }
    };

    // 서울 구 단위 경계선 로드
    const loadSeoulDistricts = async () => {
      try {
        const response = await fetch('/seoulGeoJSON.geojson'); // public 폴더의 seoulGeoJSON.geojson 파일 경로
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSeoulDistricts(data);
        console.log('서울 구 단위 GeoJSON 데이터 로드 성공:', data);
      } catch (error) {
        console.error('서울 구 단위 GeoJSON 로드 중 오류 발생:', error);
      }
    };

    loadSeoulBoundary();
    loadSeoulDistricts();
  }, []);

  /**
   * 관광지 정보를 가져와 마커를 업데이트합니다.
   * @param {number} centerLat - 지도 중심의 위도
   * @param {number} centerLng - 지도 중심의 경도
   */
  const fetchTourInfo = async (centerLat, centerLng) => {
    try {
      const response = await axios.get('http://localhost:9002/seoul/tour/nearby', {
        params: {
          latitude: centerLat,
          longitude: centerLng,
          radius: 1, // 반경 (단위: km)
          cat1: cat1Ref.current || null, // 선택된 카테고리
        },
      });

      // 기존 마커 제거
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current.clear(); // Map 객체 비우기

      // 중복 제거: title과 좌표를 기준으로 중복된 항목 필터링
      const uniqueTours = response.data.filter((tour, index, self) =>
          index === self.findIndex((t) =>
            t.title === tour.title && t.mapX === tour.mapX && t.mapY === tour.mapY
          )
      );

      // 고유한 키를 부여하여 관광지 정보를 업데이트
      const uniqueToursWithKeys = uniqueTours.map((tour, index) => ({
        ...tour,
        uniqueKey: tour.id || `${tour.mapX}-${tour.mapY}-${index}`, // 고유 키 생성
      }));

      // 새로운 마커 추가
      uniqueToursWithKeys.forEach((tourInfo) => {
        const position = new window.kakao.maps.LatLng(tourInfo.mapY, tourInfo.mapX);

        // 카테고리에 따른 마커 이미지 선택
        const markerImageSrc = markerImages[tourInfo.cat1] || markerImages.default; // 기본 마커 이미지 경로
        const imageSize = new window.kakao.maps.Size(33, 44); // 마커 이미지 크기
        const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize);

        const marker = new window.kakao.maps.Marker({
          position: position,
          image: markerImage, // 마커 이미지 설정
          map: mapRef.current,
          zIndex: 3, // 마커의 zIndex 설정
        });

        // 마커를 Map에 저장
        const markerKey = tourInfo.uniqueKey;
        markersRef.current.set(markerKey, marker);

        // 마커 클릭 이벤트 등록
        window.kakao.maps.event.addListener(marker, 'click', () => {
          // 활성화된 오버레이 키 설정
          setActiveOverlayKey(markerKey);
        });
      });

      // 관광지 정보를 상태에 저장
      setTourInfos(uniqueToursWithKeys);
    } catch (error) {
      console.error('Error fetching tour info:', error);
    }
  };

  /**
   * Kakao Maps 스크립트를 로드하고 지도를 초기화합니다.
   */
  useEffect(() => {
    const loadMap = () => {
      // 이미 Kakao Maps 스크립트가 로드되어 있다면 초기화만 수행
      if (window.kakao && window.kakao.maps) {
        initializeMap();
        return;
      }

      // Kakao Maps API 스크립트 추가
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

      document.head.appendChild(script);
    };

    /**
     * 지도를 초기화하고 현재 위치를 표시합니다.
     */
    const initializeMap = () => {
      const kakao = window.kakao;

      // 위치 정보 요청 및 지도 초기화
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setupMap(lat, lng);
          },
          function (error) {
            console.error('Error getting location:', error);
            alert('위치 정보를 가져올 수 없어 기본 위치로 표시합니다.');
            setupMap(37.5665, 126.9780); // 서울 기본 위치
          }
        );
      } else {
        alert('GPS를 지원하지 않습니다');
        setupMap(37.5665, 126.9780); // 서울 기본 위치
      }
    };

    /**
     * 지도를 설정하고 현재 위치를 표시하는 마커와 오버레이를 추가합니다.
     * @param {number} lat - 초기 지도 중심의 위도
     * @param {number} lng - 초기 지도 중심의 경도
     */
    const setupMap = (lat, lng) => {
      const kakao = window.kakao;
      const container = document.getElementById('map'); // 지도를 표시할 div
      const options = {
        center: new kakao.maps.LatLng(lat, lng), // 초기 지도 중심좌표
        level: 3, // 초기 확대 수준
      };
      mapRef.current = new kakao.maps.Map(container, options); // 지도 인스턴스 생성

      // 현재 위치 마커 표시
      const markerPosition = new kakao.maps.LatLng(lat, lng);
      const userMarker = new kakao.maps.Marker({
        position: markerPosition,
        zIndex: 4, // 사용자 마커의 zIndex 설정
      });
      userMarker.setMap(mapRef.current);

      // 현재 위치 오버레이 생성
      const content = `<div class="useroverlay">현재 내 위치</div>`;

      const userOverlay = new kakao.maps.CustomOverlay({
        content: content,
        map: mapRef.current,
        position: userMarker.getPosition(),
        yAnchor: 1,
        zIndex: 4, // 사용자 오버레이의 zIndex 설정
      });

      // 전역 오버레이 생성 (관광지 정보 표시용)
      overlayRef.current = new kakao.maps.CustomOverlay({
        yAnchor: 1,
        zIndex: 100, // 오버레이의 zIndex를 높게 설정
      });
      overlayRef.current.setMap(null); // 초기에는 숨김

      setIsMapLoaded(true); // 지도 로드 완료 상태 업데이트
      console.log('지도 초기화 완료');

      // 서울 구 단위 및 최외곽 경계선 폴리곤 생성
      if (seoulBoundary && seoulDistricts) {
        createSeoulPolygon(); // 서울 구 단위 경계선 폴리곤 생성
        createSeoulBoundaryPolygon(); // 서울 최외곽 경계선 폴리곤 생성
      }

      // 초기 관광지 정보 로드
      fetchTourInfo(lat, lng);
    };

    loadMap(); // 지도 로드 함수 호출
  }, []); // 빈 배열로 설정하여 컴포넌트 마운트 시 한 번만 실행

  /**
   * GeoJSON 데이터와 지도가 모두 로드되면 서울 경계선 폴리곤을 생성합니다.
   */
  useEffect(() => {
    if (seoulBoundary && seoulDistricts && isMapLoaded && mapRef.current) {
      createSeoulPolygon(); // 서울 구 단위 경계선 폴리곤 생성
      createSeoulBoundaryPolygon(); // 서울 최외곽 경계선 폴리곤 생성
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seoulBoundary, seoulDistricts, isMapLoaded]);

  /**
   * 서울 구 단위 경계선 폴리곤을 생성하여 지도에 표시합니다.
   * @description seoulGeoJSON 데이터의 좌표를 사용하여 서울의 구 단위 경계선을 그립니다.
   */
  const createSeoulPolygon = () => {
    const kakao = window.kakao;
    const polygons = [];

    // GeoJSON 파일이 제대로 로드되었는지 확인
    if (!seoulDistricts || !seoulDistricts.features || seoulDistricts.features.length === 0) {
      console.error('Invalid seoulDistricts GeoJSON data');
      return;
    }

    // GeoJSON의 각 피처를 순회하여 폴리곤 생성
    seoulDistricts.features.forEach((feature, featureIndex) => {
      const { geometry } = feature;
      const { type, coordinates } = geometry;

      if (type === 'Polygon') {
        // 각 좌표를 Kakao Maps의 LatLng 객체로 변환
        const path = coordinates[0].map(
          (coord, coordIndex) => {
            const latLng = new kakao.maps.LatLng(coord[1], coord[0]); // [lat, lng]
            return latLng;
          }
        );

        // 폴리곤 생성
        const polygon = new kakao.maps.Polygon({
          map: mapRef.current,
          path: path,
          strokeWeight: 2, // 경계선 굵기
          strokeColor: '#007bdf', // 경계선 색상 (파란색)
          strokeOpacity: 1, // 경계선 투명도
          zIndex: 10, // 다른 요소들 위에 표시
        });

        polygons.push(polygon);
      } else if (type === 'MultiPolygon') {
        // 다중 폴리곤인 경우 각 폴리곤을 별도로 생성
        coordinates.forEach((polygonCoords, polygonIndex) => {
          const path = polygonCoords[0].map(
            (coord, coordIndex) => {
              const latLng = new kakao.maps.LatLng(coord[1], coord[0]); // [lat, lng]
              return latLng;
            }
          );

          const polygon = new kakao.maps.Polygon({
            map: mapRef.current,
            path: path,
            strokeWeight: 2,
            strokeColor: '#007bdf',
            strokeOpacity: 1,
            zIndex: 10,
          });

          polygons.push(polygon);
        });
      }
    });

    // 기존 서울 구 단위 폴리곤 제거
    seoulDistrictPolygonsRef.current.forEach((polygon) => polygon.setMap(null));
    seoulDistrictPolygonsRef.current = polygons;
    console.log('서울 구 단위 경계선 폴리곤 생성 완료');
  };

  /**
   * 서울 최외곽 경계선을 생성하여 지도에 표시합니다.
   * @description seoulBoundary GeoJSON 데이터를 사용하여 서울의 최외곽 경계선을 그립니다.
   */
  const createSeoulBoundaryPolygon = () => {
    const kakao = window.kakao;
    console.log('createSeoulBoundaryPolygon 호출 시 seoulBoundary:', seoulBoundary);
    const polygons = [];

    // GeoJSON 파일이 제대로 로드되었는지 확인
    if (!seoulBoundary || !seoulBoundary.features || seoulBoundary.features.length === 0) {
      console.error('Invalid seoulBoundary GeoJSON data');
      return;
    }

    // GeoJSON의 각 피처를 순회하여 폴리곤 생성
    seoulBoundary.features.forEach((feature, featureIndex) => {
      const { geometry } = feature;
      const { type, coordinates } = geometry;

      if (type === 'Polygon') {
        // 각 좌표를 Kakao Maps의 LatLng 객체로 변환
        const path = coordinates[0].map(
          (coord, coordIndex) => {
            const latLng = new kakao.maps.LatLng(coord[1], coord[0]); // [lat, lng]
            return latLng;
          }
        );

        // 폴리곤 생성
        const polygon = new kakao.maps.Polygon({
          map: mapRef.current,
          path: path,
          strokeWeight: 3, // 경계선 굵기
          strokeColor: '#000000', // 경계선 색상 (검은색)
          fillColor: 'rgba(0, 0, 255, 0.1)', // 채우기 색상 (투명 파란색)
          strokeOpacity: 1, // 경계선 투명도
          zIndex: 11, // 구 단위 경계선보다 위에 표시
        });

        polygons.push(polygon);
      } else if (type === 'MultiPolygon') {
        // 다중 폴리곤인 경우 각 폴리곤을 별도로 생성
        coordinates.forEach((polygonCoords, polygonIndex) => {
          const path = polygonCoords[0].map(
            (coord, coordIndex) => {
              const latLng = new kakao.maps.LatLng(coord[1], coord[0]); // [lat, lng]
              return latLng;
            }
          );

          const polygon = new kakao.maps.Polygon({
            map: mapRef.current,
            path: path,
            strokeWeight: 3,
            strokeColor: '#000000',
            strokeOpacity: 1,
            zIndex: 11,
          });

          polygons.push(polygon);
        });
      }
    });

    // 기존 서울 최외곽 폴리곤 제거
    seoulBoundaryPolygonsRef.current.forEach((polygon) => polygon.setMap(null));
    seoulBoundaryPolygonsRef.current = polygons;
    console.log('서울 최외곽 경계선 폴리곤 생성 완료');
  };

  /**
   * 지도 이동 시 관광지 정보 업데이트
   */
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    const kakao = window.kakao;

    /**
     * 'idle' 이벤트 리스너를 추가하여 지도가 이동 완료될 때마다 호출됩니다.
     */
    const addIdleListener = () => {
      const listener = kakao.maps.event.addListener(mapRef.current, 'idle', () => {
        const center = mapRef.current.getCenter(); // 현재 지도 중심 좌표
        const centerLat = center.getLat();
        const centerLng = center.getLng();
        fetchTourInfo(centerLat, centerLng); // 관광지 정보 업데이트
      });

      idleListenerRef.current = listener; // 리스너 저장
    };

    addIdleListener(); // 리스너 추가

    /**
     * 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
     */
    return () => {
      if (idleListenerRef.current) {
        kakao.maps.event.removeListener(idleListenerRef.current);
        idleListenerRef.current = null;
      }
    };
  }, [isMapLoaded]); // cat1 제거하여 중복 리스너 방지

  /**
   * 카테고리 변경 시 관광지 정보를 업데이트합니다.
   */
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    const kakao = window.kakao;

    // 현재 지도 중심 좌표 가져오기
    const center = mapRef.current.getCenter();
    const centerLat = center.getLat();
    const centerLng = center.getLng();

    // 관광지 정보 가져오기
    fetchTourInfo(centerLat, centerLng);
  }, [cat1, isMapLoaded]); // cat1 변경 시 관광지 정보 업데이트

  /**
   * 현재 위치로 돌아가는 함수
   */
  const returnToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const kakao = window.kakao;
          const newCenter = new kakao.maps.LatLng(lat, lng);
          mapRef.current.setCenter(newCenter);
          setActiveOverlayKey(null); // 오버레이 닫기
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
   * 상시 관광지 정보 모달에서 카테고리 필터링
   */
  const filteredTourInfos = cat1
    ? tourInfos.filter((tour) => tour.cat1 === cat1)
    : tourInfos;

  /**
   * 활성화된 오버레이를 업데이트할 때 호출되는 useEffect
   */
  useEffect(() => {
    const kakao = window.kakao;

    const fetchTourDetail = async (contentId) => {
      const serviceKey = "yUAPog6Rgt2Os0UIFDpFja5DVD0qzGn6j1PHTeXT5QkxuaK4FjVPHFSNLlVeQ9lD2Gv5P6fsJyUga4R5zA0osA==";
      const url = `https://apis.data.go.kr/B551011/KorService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}&defaultYN=Y&firstImageYN=Y&areacodeYN=Y&catcodeYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&serviceKey=${serviceKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.response.body.items.item[0]; // API 결과에 따라 필요한 데이터 추출
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        return null;
      }
    };

    const fetchTourDetailInfo = async (contentId, contentTypeId) => {
      const serviceKey = "yUAPog6Rgt2Os0UIFDpFja5DVD0qzGn6j1PHTeXT5QkxuaK4FjVPHFSNLlVeQ9lD2Gv5P6fsJyUga4R5zA0osA==";
      const url = `https://apis.data.go.kr/B551011/KorService1/detailIntro1?MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentId}&contentTypeId=${contentTypeId}&serviceKey=${serviceKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.response.body.items.item[0]; // API 결과에 따라 필요한 데이터 추출
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        return null;
      }
    };

    if (activeOverlayKey) {
      const marker = markersRef.current.get(activeOverlayKey);
      if (marker) {
        const position = marker.getPosition();
        const tourInfo = tourInfos.find(t => t.uniqueKey === activeOverlayKey);

        if (tourInfo) {
          // API 호출
          fetchTourDetail(tourInfo.contentid).then((detailData) => {
            if (detailData) {
              // 추가로 detailInfo 데이터 가져오기
              fetchTourDetailInfo(tourInfo.contentid, detailData.contenttypeid).then((detailInfo) => {
                const address = detailData.addr1
                  ? detailData.addr2
                    ? `${detailData.addr1}, ${detailData.addr2}`
                    : detailData.addr1
                  : "주소 정보 없음";

                // 가져온 데이터를 조건부로 표시
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

                const mergedContent = `
                  ${content}
                  ${contentDescription}
                `;

                overlayRef.current.setContent(mergedContent);
                overlayRef.current.setPosition(position);
                overlayRef.current.setZIndex(100);
                overlayRef.current.setMap(mapRef.current);
              });
            }
          });
        }

      }
    } else {
      // 오버레이 숨기기
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }
    }
  }, [activeOverlayKey, tourInfos]);

  /**
   * 축제 페이지로 이동하는 함수
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

      {/* 축제 페이지로 이동하는 버튼 */}
      <button
        onClick={navigateToFestival}
        className="navigate-festival-button"
        style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 5 }}
      >
        축제 보기
      </button>

      {/* 지도 표시 */}
      <div
        id="map"
        style={{ width: '100%', height: '100vh' }}
      ></div>

      {/* 지도 중앙에 항상 표시될 타겟 아이콘 */}
      <img src="/markers/aim.png" alt="Center Marker" className="map-center-icon" />

      {/* 상시 관광지 정보 모달창 */}
      <div className="persistent-modal">
        <h3>관광지 목록</h3>

        {/* 카테고리 탭 추가 */}
        <div className="category-tabs">
          <div className="center-box">
            <button
              className={`tab-button ${cat1 === '' ? 'active' : ''}`}
              onClick={() => setCat1('')}
            >
              전체
            </button>
            {cat1Options.map((option) => (
              <button
                key={option.code}
                className={`tab-button ${cat1 === option.code ? 'active' : ''}`}
                onClick={() => setCat1(option.code)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        {filteredTourInfos.length > 0 ? (
          filteredTourInfos.map((tourInfo) => {
            // 고유한 키 생성
            const key = tourInfo.uniqueKey;

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
                className="tour-item"
                onClick={handleClick} // 클릭 핸들러
              >
                {tourInfo.imageUrl ? (
                  <img
                    src={tourInfo.imageUrl}
                    alt={tourInfo.title}
                    className="tour-item-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/markers/default.png'; // 대체 이미지 경로
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
          <p className="no-tours">관광지가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default MapComponent;
