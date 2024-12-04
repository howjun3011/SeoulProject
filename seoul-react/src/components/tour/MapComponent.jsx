// src/components/tour/MapComponent.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './MapComponent.css';

function MapComponent() {
  // 상태 변수 선언
  const [cat1, setCat1] = useState(''); // 카테고리 선택 상태
  const [modalData, setModalData] = useState(null); // 모달 데이터 상태
  const [seoulBoundary, setSeoulBoundary] = useState(null); // 서울 최외곽 GeoJSON 데이터
  const [seoulDistricts, setSeoulDistricts] = useState(null); // 서울 구 단위 GeoJSON 데이터
  const [isMapLoaded, setIsMapLoaded] = useState(false); // 지도 로드 상태
  const [tourInfos, setTourInfos] = useState([]); // 현재 표시된 관광지 정보

  // useRef 훅을 사용하여 변수 관리
  const mapRef = useRef(null); // 지도 인스턴스 저장
  const overlayRef = useRef(null); // 오버레이 인스턴스 저장
  const markersRef = useRef([]); // 마커 인스턴스 배열 저장
  const seoulPolygonsRef = useRef([]); // 서울 구 단위 폴리곤 인스턴스 배열 저장
  const idleListenerRef = useRef(null); // 'idle' 이벤트 리스너 저장

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

  // 카테고리별 마커 이미지 매핑
  const markerImages = {
    A01: '/markers/blue.png',   // 자연
    A02: '/markers/orange.png',    // 인문(문화/예술/역사)
    A03: '/markers/mint.png',  // 레포츠
    A04: '/markers/burgundy.png',  // 쇼핑
    A05: '/markers/pink.png',     // 음식
    B02: '/markers/purple.png',  // 숙박
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
          cat1: cat1 || null, // 선택된 카테고리
        },
      });

      // 기존 마커 제거
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];

      // 새로운 마커 추가
      response.data.forEach((tourInfo) => {
        const position = new window.kakao.maps.LatLng(tourInfo.mapY, tourInfo.mapX);
        // 카테고리에 따른 마커 이미지 선택

        const markerImageSrc = markerImages[tourInfo.cat1] || markerImages.default; // 기본 마커 이미지 경로

        const imageSize = new window.kakao.maps.Size(24, 35); // 마커 이미지 크기

        const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize);
        const marker = new window.kakao.maps.Marker({
          position: position,
          image: markerImage, // 마커 이미지 설정
          map: mapRef.current,
          zIndex: 2,
        });

        markersRef.current.push(marker);

        // 마커에 마우스 오버 이벤트 등록
        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
          const content = `<div class="customoverlay">${tourInfo.title}</div>`;
          overlayRef.current.setContent(content);
          overlayRef.current.setPosition(marker.getPosition());
          overlayRef.current.setZIndex(1);
          overlayRef.current.setMap(mapRef.current);
        });

        // 마커에 마우스 아웃 이벤트 등록
        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
          overlayRef.current.setMap(null);
        });

        // 마커 클릭 이벤트 등록
        window.kakao.maps.event.addListener(marker, 'click', () => {
          console.log('Modal data:', tourInfo);
          setModalData(tourInfo);
          overlayRef.current.setMap(null);
        });
      });

      // 관광지 정보를 상태에 저장
      setTourInfos(response.data);
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
        zIndex: 3,
      });
      userMarker.setMap(mapRef.current);

      // 현재 위치 오버레이 생성
      const content = `<div class="useroverlay">현재 내 위치</div>`;

      const userOverlay = new kakao.maps.CustomOverlay({
        content: content,
        map: mapRef.current,
        position: userMarker.getPosition(),
        yAnchor: 1,
        zIndex: 3,
      });

      // 전역 오버레이 생성 (관광지 정보 표시용)
      overlayRef.current = new kakao.maps.CustomOverlay({
        yAnchor: 1,
        zIndex: 1,
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
    console.log('seoulDistricts:', seoulDistricts);
    const polygons = [];

    // GeoJSON 파일이 제대로 로드되었는지 확인
    if (!seoulDistricts || !seoulDistricts.features || seoulDistricts.features.length === 0) {
      console.error('Invalid seoulDistricts GeoJSON data');
      return;
    }

    // GeoJSON의 각 피처를 순회하여 폴리곤 생성
    seoulDistricts.features.forEach((feature) => {
      const { geometry } = feature;
      const { type, coordinates } = geometry;

      if (type === 'Polygon') {
        // 각 좌표를 Kakao Maps의 LatLng 객체로 변환
        const path = coordinates[0].map(
          (coord) => new kakao.maps.LatLng(coord[1], coord[0]) // [lat, lng]
        );

        // 폴리곤 생성
        const polygon = new kakao.maps.Polygon({
          map: mapRef.current,
          path: path,
          strokeWeight: 1, // 경계선 굵기
          strokeColor: '#FF0000', // 경계선 색상 (빨간색)
          fillColor: 'rgba(255, 0, 0, 0.1)', // 채우기 색상 (투명 빨간색)
          strokeOpacity: 1, // 경계선 투명도
          zIndex: 10, // 다른 요소들 위에 표시
        });

        polygons.push(polygon);
      } else if (type === 'MultiPolygon') {
        // 다중 폴리곤인 경우 각 폴리곤을 별도로 생성
        coordinates.forEach((polygonCoords) => {
          const path = polygonCoords[0].map(
            (coord) => new kakao.maps.LatLng(coord[1], coord[0]) // [lat, lng]
          );

          const polygon = new kakao.maps.Polygon({
            map: mapRef.current,
            path: path,
            strokeWeight: 1,
            strokeColor: '#FF0000',
            fillColor: 'rgba(255, 0, 0, 0.1)',
            strokeOpacity: 1,
            zIndex: 10,
          });

          polygons.push(polygon);
        });
      }
    });

    // 기존 서울 구 단위 폴리곤 제거 (필요 시)
    seoulPolygonsRef.current.forEach((polygon) => polygon.setMap(null));
    seoulPolygonsRef.current = polygons;
    console.log('서울 구 단위 경계선 폴리곤 생성 완료');
  };

  /**
   * 서울 최외곽 경계선을 생성하여 지도에 표시합니다.
   * @description seoulBoundary GeoJSON 데이터를 사용하여 서울의 최외곽 경계선을 그립니다.
   */
  const createSeoulBoundaryPolygon = () => {
    const kakao = window.kakao;
    console.log('seoulBoundary:', seoulBoundary);
    console.log('createSeoulBoundaryPolygon 호출 시 seoulBoundary:', seoulBoundary);
    const polygons = [];

    // GeoJSON 파일이 제대로 로드되었는지 확인
    if (!seoulBoundary || !seoulBoundary.features || seoulBoundary.features.length === 0) {
      console.error('Invalid seoulBoundary GeoJSON data');
      return;
    }

    // GeoJSON의 각 피처를 순회하여 폴리곤 생성
    seoulBoundary.features.forEach((feature) => {
      const { geometry } = feature;
      const { type, coordinates } = geometry;

      if (type === 'Polygon') {
        // 각 좌표를 Kakao Maps의 LatLng 객체로 변환
        const path = coordinates[0].map(
          (coord) => new kakao.maps.LatLng(coord[1], coord[0]) // [lat, lng]
        );

        // 폴리곤 생성
        const polygon = new kakao.maps.Polygon({
          map: mapRef.current,
          path: path,
          strokeWeight: 2, // 경계선 굵기
          strokeColor: '#0000FF', // 경계선 색상 (파란색)
          fillColor: 'rgba(0, 0, 255, 0.1)', // 채우기 색상 (투명 파란색)
          strokeOpacity: 1, // 경계선 투명도
          zIndex: 11, // 구 단위 경계선보다 위에 표시
        });

        polygons.push(polygon);
      } else if (type === 'MultiPolygon') {
        // 다중 폴리곤인 경우 각 폴리곤을 별도로 생성
        coordinates.forEach((polygonCoords) => {
          const path = polygonCoords[0].map(
            (coord) => new kakao.maps.LatLng(coord[1], coord[0]) // [lat, lng]
          );

          const polygon = new kakao.maps.Polygon({
            map: mapRef.current,
            path: path,
            strokeWeight: 2,
            strokeColor: '#0000FF',
            fillColor: 'rgba(0, 0, 255, 0.1)',
            strokeOpacity: 1,
            zIndex: 11,
          });

          polygons.push(polygon);
        });
      }
    });

    // 저장할 필요 없으므로 생략
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
      console.log('Added idle listener:', listener);
    };

    addIdleListener(); // 리스너 추가

    /**
     * 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
     */
    return () => {
      if (idleListenerRef.current) {
        kakao.maps.event.removeListener(idleListenerRef.current);
        console.log('Removed idle listener:', idleListenerRef.current);
        idleListenerRef.current = null;
      }
    };
  }, [cat1, isMapLoaded]); // cat1 변경 시에도 리스너가 제대로 동작하도록 의존성 설정

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
   * 모달 닫기 함수
   */
  const closeModal = () => {
    setModalData(null);
    // 오버레이 숨기기
    if (overlayRef.current) {
      overlayRef.current.setMap(null);
    }
  };

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

  return (
    <div style={{ position: 'relative' }}>
      {/* 카테고리 필터 UI */}
      <div className="category-filter">
        <select
          value={cat1}
          onChange={(e) => setCat1(e.target.value)}
          className="category-select"
        >
          <option value="">대분류 선택</option>
          {cat1Options.map((option) => (
            <option key={option.code} value={option.code}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {/* 현재 위치로 돌아가는 버튼 */}
      <button
        onClick={returnToCurrentLocation}
        className="current-location-button"
      >
        현재 위치로
      </button>

      {/* 지도 표시 */}
      <div
        id="map"
        style={{ width: '100%', height: '100vh'}}
      ></div>

      {/* 상세 모달 컴포넌트 */}
      {modalData && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 이벤트 전파 방지
          >
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>{modalData.title}</h2>
            {modalData.imageUrl ? (
              <img
                src={modalData.imageUrl}
                alt={modalData.title}
                className="modal-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'path/to/default-image.jpg'; // 대체 이미지 경로
                }}
              />
            ) : (
              <div className="no-image">
                <p>이미지가 없습니다.</p>
              </div>
            )}
            {/* 추가 정보 표시 가능 */}
          </div>
        </div>
      )}

      {/* 상시 관광지 정보 모달창 */}
      <div className="persistent-modal">
        <h3>관광지 목록</h3>
        {tourInfos.length > 0 ? (
          tourInfos.map((tourInfo) => (
            <div
              key={tourInfo.id} // assuming each tourInfo has a unique 'id'
              className="tour-item"
              onClick={() => setModalData(tourInfo)}
            >
              {tourInfo.imageUrl ? (
                <img
                  src={tourInfo.imageUrl}
                  alt={tourInfo.title}
                  className="tour-item-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'path/to/default-image.jpg'; // 대체 이미지 경로
                  }}
                />
              ) : (
                <div className="no-image">
                  이미지 없음
                </div>
              )}
              <span className="tour-item-title">{tourInfo.title}</span>
            </div>
          ))
        ) : (
          <p className="no-tours">관광지가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default MapComponent;
