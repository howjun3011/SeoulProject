import styles from "../../assets/css/health/HealthMain.module.css";

import SideTab from "../common/SideTab";
import CommonMap from "../common/CommonMap";
import React, { useEffect, useState } from "react";
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";

function HealthMain() {
    const [searchKeyword, setSearchKeyword] = useState(""); // 키워드 저장
    const [debouncedKeyword, setDebouncedKeyword] = useState(""); // 디바운스된 키워드 저장
    const [hospitalList, setHospitalList] = useState([]); // 병원 목록 저장
    const [markers, setMarkers] = useState([]); // 마커 데이터 저장
    const [map, setMap] = useState(null); // Kakao 지도 객체
    const [userLocation, setUserLocation] = useState(null); // 사용자의 현재 위치 저장
    const [currentCenter, setCurrentCenter] = useState(null); // 현재 지도 중심 위치 저장
    const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 저장

    // 사용자 위치 가져오기
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setCurrentCenter({ lat: latitude, lng: longitude }); // 초기 지도 중심 설정
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    // `userLocation` 상태 변경 로그 출력
    useEffect(() => {
        if (userLocation) {
            console.log("Updated userLocation:", userLocation);
        }
    }, [userLocation]);

    // 지도 객체 초기화 후, mouseup 이벤트 리스너 등록
    useEffect(() => {
        if (map) {
            window.kakao.maps.event.addListener(map, "mouseup", () => {
                const center = map.getCenter(); // 지도 중심 가져오기
                const newCenter = { lat: center.getLat(), lng: center.getLng() };
                console.log("Mouseup detected, new center:", newCenter);
                setCurrentCenter(newCenter); // 새로운 중심으로 업데이트
            });
        }
    }, [map]);

    // currentCenter 상태가 변경될 때 병원 데이터 가져오기
    useEffect(() => {
        if (currentCenter) {
            console.log("Fetching hospitals for center:", currentCenter);
            fetchHospitals(currentCenter, debouncedKeyword); // 중심 위치와 키워드 기반 병원 데이터 가져오기
        }
    }, [currentCenter, debouncedKeyword]);

    // 병원 데이터 Fetch 함수
    const fetchHospitals = async (center, keyword) => {
        if (!center) return; // 중심 좌표 정보가 없는 경우 중단

        try {
            const response = await fetch(
                `http://localhost:9002/seoul/health/search?lat=${center.lat}&lon=${center.lng}&radius=0.3&keyword=${keyword}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // 병원 목록이 배열인지 확인하고 데이터가 있는지 확인
            if (Array.isArray(data) && data.length > 0) {
                setHospitalList(data);

                // 마커 데이터 설정
                setMarkers(
                    data.map((hospital) => ({
                        position: { lat: hospital.hosp_lat, lng: hospital.hosp_lon },
                        name: hospital.hosp_name,
                        phone: hospital.hosp_pnumber, // 병원 전화번호 추가
                    }))
                );
            } else {
                // 현재 지도 범위 내에 결과가 없을 경우 전체 검색
                console.log("현재 지도 범위 내에 결과 없음. 전체 검색 시도");

                const responseAll = await fetch(
                    `http://localhost:9002/seoul/health/search?keyword=${keyword}`
                );
                if(!responseAll.ok) {
                    throw new Error(`HTTP error! status: ${responseAll.status}`);
                }

                const dataAll = await responseAll.json();

                if(Array.isArray(dataAll) && dataAll.length > 0) {
                    setHospitalList(dataAll);

                    // 첫 번째 병원의 위치로 지도 이동
                    const firstHospital = dataAll[0];
                    const newCenter = {
                        lat: firstHospital.hosp_lat,
                        lng: firstHospital.hosp_lon,
                    };
                    setCurrentCenter(newCenter);
                    map.setCenter(new window.kakao.maps.LatLng(newCenter.lat, newCenter.lng));

                    // 마커 데이터 설정
                    setMarkers(
                        dataAll.map((hospital) => ({
                            position: { lat: hospital.hosp_lat, lng: hospital.hosp_lon },
                            name: hospital.hosp_name,
                            phone: hospital.hosp_pnumber,
                        }))
                    );
                } else {
                    // 전체 검색에서도 결과가 없을 경우
                    console.log("검색 결과가 없습니다.");
                    setHospitalList([]); // 기본값으로 초기화
                    setMarkers([]); // 기본값으로 초기화
                }
            }
        } catch (error) {
            console.error("Error fetching hospital data:", error);
            setHospitalList([]); // 오류 시 병원 목록 초기화
            setMarkers([]); // 오류 시 마커 초기화
        }
    };

    // 디바운스 처리: 사용자가 입력 중단 후 0.2초가 지나면 키워드 업데이트
    useEffect(() => {
        const handler = setTimeout(()=> {
            setDebouncedKeyword(searchKeyword);
        }, 200);

        return () => {
            clearTimeout(handler); // 이전 타이머를 클리어해 중복 호출 방지
        };
    }, [searchKeyword]);

    return (
        <div className={styles.healthContainer}>
            <CommonMap setMap={setMap} mapLevel={3}>
                {markers.map((marker, index) => (
                    <React.Fragment key={`marker-${marker.name}-${index}`}>
                        <MapMarker
                            position={marker.position}
                            onClick={() => setSelectedMarker(marker)}
                        />
                        {selectedMarker && selectedMarker.name === marker.name && (
                            <CustomOverlayMap position={marker.position} yAnchor={1.5}>
                                <div
                                    style={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                        fontSize: "14px",
                                        lineHeight: "1.6",
                                        maxWidth: "300px",
                                        textAlign: "center",
                                        wordBreak: "break-word",
                                    }}
                                >
                                    <strong style={{ fontSize: "16px", color: "#333" }}>
                                        {marker.name}
                                    </strong>
                                    <br />
                                    {marker.phone ? (
                                        <span style={{ color: "#666" }}>{marker.phone}</span>
                                    ) : (
                                        <span style={{ color: "#999" }}>전화번호 없음</span>
                                    )}
                                </div>
                            </CustomOverlayMap>
                        )}
                    </React.Fragment>
                ))}
            </CommonMap>
            <SideTab>
                <div className={styles.sideTabContainer}>
                    <div className={styles.searchBarContainer}>
                        {/* 검색창 */}
                        <input
                            className={styles.searchBar}
                            type="text"
                            placeholder="검색어를 입력하세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                    {/* 검색 결과 목록 */}
                    <div className={styles.resultList}>
                        {Array.isArray(hospitalList) &&
                            hospitalList.map((hospital, index) => (
                                <div key={index} className={styles.resultItem}>
                                    {hospital.hosp_name}
                                </div>
                            ))}
                    </div>
                </div>
            </SideTab>
        </div>
    );
}

export default HealthMain;
