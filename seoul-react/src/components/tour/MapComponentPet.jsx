// src/components/tour/MapComponentPet.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './MapComponent.css';
import { useNavigate } from 'react-router-dom';

function MapComponentPet() {
  // 상태 변수 선언
  const [seoulBoundary, setSeoulBoundary] = useState(null); // 서울 최외곽 GeoJSON 데이터
  const [seoulDistricts, setSeoulDistricts] = useState(null); // 서울 구 단위 GeoJSON 데이터
  const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태
  const [petInfos, setPetInfos] = useState([]); // 현재 표시된 반려동물 정보
  const [activeOverlayKey, setActiveOverlayKey] = useState(null); // 활성화된 오버레이의 고유 키

  // useRef 훅을 사용하여 변수 관리
  const mapRef = useRef(null); // 지도 인스턴스 저장
  const overlayRef = useRef(null); // 오버레이 인스턴스 저장
  const markersRef = useRef(new Map()); // 마커 저장
  const seoulDistrictPolygonsRef = useRef([]); // 서울 구 단위 폴리곤 인스턴스 배열 저장
  const seoulBoundaryPolygonsRef = useRef([]); // 서울 최외곽 폴리곤 인스턴스 배열 저장
  const idleListenerRef = useRef(null); // 'idle' 이벤트 리스너 저장

  // React Router의 네비게이션 훅
  const navigate = useNavigate();

  // 반려동물 카테고리 옵션 배열 (필요시 추가 가능)
  const petCatOptions = [
    { code: 'A01', name: '견종' },
    { code: 'A02', name: '고양이' },
    // 추가 카테고리가 있다면 여기에 추가
  ];

  // 카테고리별 마커 이미지 매핑 (기본 이미지 추가)
  const markerImages = {
    A01: '/markers/pet.png',        // 견종
    A02: '/markers/pet.png',        // 고양이
    default: '/markers/pet.png',    // 기본 마커 이미지
  };

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
   * 반려동물 정보를 가져와 마커를 업데이트합니다.
   * @param {number} centerLat - 지도 중심의 위도
   * @param {number} centerLng - 지도 중심의 경도
   */
  const fetchPetInfo = async (centerLat, centerLng) => {
    try {
      const response = await axios.get('http://localhost:9002/seoul/tour/pet/nearby', {
        params: {
          latitude: centerLat,
          longitude: centerLng,
          radius: 5, // 반경 (단위: km)
          // 필요시 추가 파라미터
        },
      });

      // 기존 마커 제거
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current.clear(); // Map 객체 비우기

      // 중복 제거: title과 좌표를 기준으로 중복된 항목 필터링
      const uniquePets = response.data.filter((pet, index, self) =>
          index === self.findIndex((p) =>
            p.title === pet.title && p.mapx === pet.mapx && p.mapy === pet.mapy
          )
      );

      // 고유한 키를 부여하여 반려동물 정보를 업데이트
      const uniquePetsWithKeys = uniquePets.map((pet, index) => ({
        ...pet,
        uniqueKey: pet.tourPetId || `${pet.mapx}-${pet.mapy}-${index}`, // 고유 키 생성
      }));

      // 새로운 마커 추가
      uniquePetsWithKeys.forEach((petInfo) => {
        const position = new window.kakao.maps.LatLng(petInfo.mapy, petInfo.mapx);

        // 카테고리에 따른 마커 이미지 선택
        const markerImageSrc = markerImages[petInfo.cat1] || markerImages.default; // 기본 마커 이미지 경로
        const imageSize = new window.kakao.maps.Size(33, 44); // 마커 이미지 크기
        const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize);

        const marker = new window.kakao.maps.Marker({
          position: position,
          image: markerImage, // 마커 이미지 설정
          map: mapRef.current,
          zIndex: 3, // 마커의 zIndex 설정
        });

        // 마커를 Map에 저장
        const markerKey = petInfo.uniqueKey;
        markersRef.current.set(markerKey, marker);

        // 마커 클릭 이벤트 등록
        window.kakao.maps.event.addListener(marker, 'click', () => {
          // 활성화된 오버레이 키 설정
          setActiveOverlayKey(markerKey);
        });
      });

      // 반려동물 정보를 상태에 저장
      setPetInfos(uniquePetsWithKeys);
    } catch (error) {
      console.error('Error fetching pet info:', error);
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
        level: 8, // 초기 확대 수준
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

      // 전역 오버레이 생성 (반려동물 정보 표시용)
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

      // 초기 반려동물 정보 로드
      fetchPetInfo(lat, lng);
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
    console.log('seoulDistricts:', seoulDistricts);
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
        console.log(`Boundary Polygon [Feature ${featureIndex}] created.`);
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
   * 지도 이동 시 반려동물 정보 업데이트
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
        fetchPetInfo(centerLat, centerLng); // 반려동물 정보 업데이트
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
          mapRef.current.panTo(newCenter);
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
   * 활성화된 오버레이를 업데이트할 때 호출되는 useEffect
   */
  useEffect(() => {
    const kakao = window.kakao;

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

    if (activeOverlayKey) {
      const marker = markersRef.current.get(activeOverlayKey);
      if (marker) {
        const position = marker.getPosition();
        const petInfo = petInfos.find(p => p.uniqueKey === activeOverlayKey);

        if (petInfo) {
          const { contentid } = petInfo;

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

            overlayRef.current.setContent(mergedContent);
            overlayRef.current.setPosition(position);
            overlayRef.current.setZIndex(100); // CustomOverlay의 zIndex를 높게 설정
            overlayRef.current.setMap(mapRef.current);
          });
        }
      }
    } else {
      // 오버레이 숨기기
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
      }
    }
  }, [activeOverlayKey, petInfos]);

  // 커스텀 레이아웃 표시 여부
  const [customOverlayVisible, setCustomOverlayVisible] = useState(false);

  // 커스텀 레이아웃 활성화 함수
  const showCustomOverlay = () => {
    setCustomOverlayVisible(true);
  };

  // 커스텀 레이아웃 닫기 함수
  const hideCustomOverlay = () => {
    setCustomOverlayVisible(false);
    if (overlayRef.current) {
      overlayRef.current.setMap(null); // 커스텀 오버레이 숨기기
    }
  };

  // 오버레이 활성화 시 상태 업데이트
  useEffect(() => {
    if (activeOverlayKey && overlayRef.current) {
      setCustomOverlayVisible(true); // 오버레이가 활성화되면 버튼 표시
    }
  }, [activeOverlayKey]);

  /**
   * 관광 페이지로 이동하는 함수
   */
  const navigateToTour = () => {
    navigate('/seoul/tour');
  };

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

      {/* 커스텀 레이아웃 닫기 버튼 */}
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

      {/* 지도 표시 */}
      <div
        id="map"
        style={{ width: '100%', height: '100vh' }}
      ></div>

      {/* 지도 중앙에 항상 표시될 타겟 아이콘 */}
      <img src="/markers/aim.png" alt="Center Marker" className="map-center-icon" />

      {/* 상시 반려동물 정보 모달창 */}
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
                onClick={handleClick} // 클릭 핸들러
              >
                {petInfo.firstimage ? (
                  <img
                    src={petInfo.firstimage}
                    alt={petInfo.title}
                    className="pet-item-image"
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
