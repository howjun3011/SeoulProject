// src/components/tour/MapComponentCamping.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './MapComponent.css';
import { useNavigate } from 'react-router-dom';

function MapComponentCamping() {
  const [seoulBoundary, setSeoulBoundary] = useState(null);
  const [seoulDistricts, setSeoulDistricts] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [campingInfos, setCampingInfos] = useState([]);
  const [activeOverlayKey, setActiveOverlayKey] = useState(null);

  const mapRef = useRef(null);
  const overlayRef = useRef(null);
  const markersRef = useRef(new Map());
  const seoulDistrictPolygonsRef = useRef([]);
  const seoulBoundaryPolygonsRef = useRef([]);
  const idleListenerRef = useRef(null);

  const navigate = useNavigate();

  const markerImages = {
    default: '/markers/yellow.png',
  };

  useEffect(() => {
    const loadSeoulBoundary = async () => {
      try {
        const response = await fetch('/seoul.geojson');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSeoulBoundary(data);
      } catch (error) {
        console.error('서울 최외곽 GeoJSON 로드 중 오류:', error);
      }
    };

    const loadSeoulDistricts = async () => {
      try {
        const response = await fetch('/seoulGeoJSON.geojson');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setSeoulDistricts(data);
      } catch (error) {
        console.error('서울 구 단위 GeoJSON 로드 중 오류:', error);
      }
    };

    loadSeoulBoundary();
    loadSeoulDistricts();
  }, []);

  const fetchCampingInfo = async (centerLat, centerLng) => {
    try {
      const response = await axios.get('http://localhost:9002/seoul/tour/camping/nearby', {
        params: {
          latitude: centerLat,
          longitude: centerLng,
          radius: 5,
        },
      });

      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current.clear();

      const uniqueCampings = response.data.filter((camping, index, self) =>
          index === self.findIndex((c) =>
            c.title === camping.title && c.mapX === camping.mapX && c.mapY === camping.mapY
          )
      );

      const uniqueCampingsWithKeys = uniqueCampings.map((camping, index) => ({
        ...camping,
        uniqueKey: camping.tourCampingId || `${camping.mapX}-${camping.mapY}-${index}`,
      }));

      uniqueCampingsWithKeys.forEach((campingInfo) => {
        const position = new window.kakao.maps.LatLng(campingInfo.mapY, campingInfo.mapX);
        const markerImageSrc = markerImages.default;
        const imageSize = new window.kakao.maps.Size(33, 44);
        const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize);

        const marker = new window.kakao.maps.Marker({
          position: position,
          image: markerImage,
          map: mapRef.current,
          zIndex: 3,
        });

        const markerKey = campingInfo.uniqueKey;
        markersRef.current.set(markerKey, marker);

        window.kakao.maps.event.addListener(marker, 'click', () => {
          setActiveOverlayKey(markerKey);
        });
      });

      setCampingInfos(uniqueCampingsWithKeys);
    } catch (error) {
      console.error('캠핑 정보 로드 중 오류:', error);
    }
  };

  useEffect(() => {
    const loadMap = () => {
      if (window.kakao && window.kakao.maps) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services,clusterer,drawing`;
      script.async = true;

      script.onload = initializeMap;
      script.onerror = () => alert('지도 로드 실패');
      document.head.appendChild(script);
    };

    const initializeMap = () => {
      const kakao = window.kakao;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => setupMap(coords.latitude, coords.longitude),
          () => setupMap(37.5665, 126.9780)
        );
      } else {
        setupMap(37.5665, 126.9780);
      }
    };

    const setupMap = (lat, lng) => {
      const kakao = window.kakao;
      const container = document.getElementById('map');
      const options = { center: new kakao.maps.LatLng(lat, lng), level: 8 };
      mapRef.current = new kakao.maps.Map(container, options);

      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
        zIndex: 4,
      });
      marker.setMap(mapRef.current);

      overlayRef.current = new kakao.maps.CustomOverlay({ yAnchor: 1, zIndex: 100 });
      overlayRef.current.setMap(null);

      setIsMapLoaded(true);
      fetchCampingInfo(lat, lng);
    };

    loadMap();
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    const kakao = window.kakao;

    const listener = kakao.maps.event.addListener(mapRef.current, 'idle', () => {
      const center = mapRef.current.getCenter();
      fetchCampingInfo(center.getLat(), center.getLng());
    });

    idleListenerRef.current = listener;

    return () => {
      if (idleListenerRef.current) {
        kakao.maps.event.removeListener(idleListenerRef.current);
        idleListenerRef.current = null;
      }
    };
  }, [isMapLoaded]);

  const returnToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => mapRef.current.setCenter(new window.kakao.maps.LatLng(coords.latitude, coords.longitude)),
        () => alert('위치 정보를 가져올 수 없습니다.')
      );
    }
  };

  useEffect(() => {
    if (activeOverlayKey) {
      const marker = markersRef.current.get(activeOverlayKey);
      if (marker) {
        const position = marker.getPosition();
        const campingInfo = campingInfos.find(c => c.uniqueKey === activeOverlayKey);

        const content = `
          <div class="customoverlay-content camping">
            <h4>${campingInfo.facltNm}</h4>
            <p><strong>주소:</strong> ${campingInfo.addr1 || '정보 없음'}</p>
          </div>
        `;
        overlayRef.current.setContent(content);
        overlayRef.current.setPosition(position);
        overlayRef.current.setMap(mapRef.current);
      }
    } else {
      overlayRef.current.setMap(null);
    }
  }, [activeOverlayKey, campingInfos]);

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={returnToCurrentLocation} className="current-location-button">현재 위치로</button>
      <div id="map" style={{ width: '100%', height: '100vh' }}></div>
    </div>
  );
}

export default MapComponentCamping;
