import styles from "../../assets/css/health/HealthMain.module.css";

import SideTab from "../common/SideTab";
import CommonMap from "../common/CommonMap";
import React, { useEffect, useState } from "react";
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";

function HealthMain() {
    const [searchKeyword, setSearchKeyword] = useState(""); // 사용자가 입력한 검색 키워드
    const [debouncedKeyword, setDebouncedKeyword] = useState(""); // 디바운스된(입력 지연 처리된) 검색 키워드
    const [hospitalList, setHospitalList] = useState([]); // 검색 결과로 반환된 병원 데이터 목록
    const [markers, setMarkers] = useState([]); // 지도에 표시할 마커 데이터 목록
    const [map, setMap] = useState(null); // 카카오 지도 객체
    const [userLocation, setUserLocation] = useState(null); // 사용자의 현재 위치 좌표
    const [currentCenter, setCurrentCenter] = useState(null); // 현재 지도 중심 좌표
    const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 정보

    // 사용자 위치 가져오기(브라우저의 GeoLocation API 사용)
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude }); // 사용자 위치 설정
                    setCurrentCenter({ lat: latitude, lng: longitude }); // 초기 지도 중심 설정
                },
                (error) => {
                    console.error("Geolocation error:", error); // 위치 가져오기 실패 시 오류 출력
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    // userLocation 상태 변경 시 현재 좌표 출력(debug)
    useEffect(() => {
        if (userLocation) {
            console.log("Updated userLocation:", userLocation);
        }
    }, [userLocation]);

    // 지도 객체가 초기화된 이후 mouseup 이벤트 리스너 등록
    // 사용자가 지도 이동하고 마우스 놓을 때마다 map.getCenter() 호출해서 새로운 중심 좌표 업데이트
    useEffect(() => {
        if (map) {
            // 지도의 mouseup 이벤트 발생 시 중심 좌표를 업데이트
            window.kakao.maps.event.addListener(map, "mouseup", () => {
                const center = map.getCenter(); // 새로운 지도 중심 좌표 가져오기
                const newCenter = { lat: center.getLat(), lng: center.getLng() }; // 좌표를 객체로 변환
                console.log("Mouseup detected, new center:", newCenter); // debug
                setCurrentCenter(newCenter); // 새로운 중심 좌표를 상태로 저장
            });
        }
    }, [map]);

    // 지도 중심 좌표(currentCenter)와 디바운스된 검색 키워드가 변경될 때 병원 데이터 가져오기
    useEffect(() => {
        if (currentCenter) {
            console.log("Fetching hospitals for center:", currentCenter); // debug
            fetchHospitals(currentCenter, debouncedKeyword); // 병원 데이터 요청
        }
    }, [currentCenter, debouncedKeyword]);

    // 병원 데이터 Fetch 함수
    const fetchHospitals = async (center, keyword) => {
        if (!center) return; // 중심 좌표 정보가 없을 경우 함수 종료

        try {
            const response = await fetch(
                `http://localhost:9002/seoul/health/search?lat=${center.lat}&lon=${center.lng}&radius=0.3&keyword=${keyword}`
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json(); // 병원 데이터를 JSON 형태로 변환

            // 병원 목록이 배열이면서 데이터가 있는지 확인
            if (Array.isArray(data) && data.length > 0) {
                setHospitalList(data); // 병원 데이터 목록 상태로 저장
                console.log(data.length);

                // 마커 데이터 설정
                setMarkers(
                    data.map((hospital) => ({
                        position: { lat: hospital.hosp_lat, lng: hospital.hosp_lon }, // 병원 좌표
                        name: hospital.hosp_name, // 병원 이름
                        phone: hospital.hosp_pnumber, // 병원 전화번호
                    }))
                );
            } else {
                // 현재 지도 범위 내 결과가 없을 경우
                console.log("현재 지도 범위 내에 결과 없음."); // debug

                // 검색어가 있는 경우에만 전체 검색 시도
                if (keyword && keyword.trim() !== '') {
                    console.log("전체 검색 시도"); // debug

                    const responseAll = await fetch(
                        `http://localhost:9002/seoul/health/search?keyword=${keyword}`
                    );
                    if(!responseAll.ok) {
                        throw new Error(`HTTP error! status: ${responseAll.status}`);
                    }

                    const dataAll = await responseAll.json(); // JSON 변환

                    if(Array.isArray(dataAll) && dataAll.length > 0) {
                        setHospitalList(dataAll); // 병원 데이터 목록 상태로 설정
                        const firstHospital = dataAll[0]; // 첫 번째 병원을 기준으로 지도 이동
                        const newCenter = {
                            lat: firstHospital.hosp_lat,
                            lng: firstHospital.hosp_lon,
                        };
                        setCurrentCenter(newCenter); // 새로운 중심 좌표 설정
                        map.setCenter(new window.kakao.maps.LatLng(newCenter.lat, newCenter.lng)); // 지도 중심 이동

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
                        console.log("검색 결과가 없습니다."); // debug
                        setHospitalList([]); // 병원 목록 초기화
                        setMarkers([]); // 마커 초기화
                    }
                } else {
                    // 검색어가 없으면 병원 목록과 마커를 비웁니다.
                    setHospitalList([]); // 병원 목록 초기화
                    setMarkers([]); // 마커 초기화
                }
            }
        } catch (error) {
            console.error("Error fetching hospital data:", error);
            setHospitalList([]); // 병원 목록 초기화
            setMarkers([]); // 마커 초기화
        }
    };


    // 디바운스 처리: 사용자가 입력을 멈춘 후 0.3초 후에 키워드 업데이트
    // 디바운싱은 잦은 API 호출을 방지하기 위해 사용됨
    useEffect(() => {
        const handler = setTimeout(()=> {
            setDebouncedKeyword(searchKeyword);
        }, 300);

        return () => {
            clearTimeout(handler); // 이전 타이머를 클리어해서 중복 호출 방지
        };
    }, [searchKeyword]);

    return (
        <div className={styles.healthContainer}>
            <CommonMap setMap={ setMap } mapLevel={ 3 }>
                {/* markers 배열 순회하면서 각 마커와 관련된 데이터 렌더링 */}
                {markers.map((marker, index) => (
                    /* React.Fragment: 여러 자식을 포함하는 부모 컨테이너 역할, 추가적인 DOM 노드 생성 방지 */
                    <React.Fragment key={`marker-${marker.name}-${index}`}>
                        <MapMarker
                            position={marker.position}
                            onClick={() => setSelectedMarker(marker)} // 마커 클릭 시 선택된 마커 설정
                        />
                        {/* 선택된 마커가 현재 마커와 동일한 경우에만 오버레이 표시 */}
                        {selectedMarker && selectedMarker.name === marker.name && (
                            <CustomOverlayMap position={marker.position} // 마커와 동일한 위치에 오버레이 표시
                                              yAnchor={1.5} // 오버레이의 y축 기준점 조정
                            >
                                {/* 오버레이에 표시될 정보 스타일 */}
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
                                    <div className={styles.hospitalNameSbj}>
                                        <div className={styles.hospitalName}>
                                            {hospital.hosp_name}
                                        </div>
                                        <div className={styles.hospitalSbj}>
                                            {hospital.hosp_sbj_list[0]}
                                        </div>
                                    </div>
                                    {hospital.hosp_simple_address}
                                    <br/>
                                    {hospital.hosp_pnumber}
                                </div>
                            ))}
                    </div>
                </div>
            </SideTab>
        </div>
    );
}

export default HealthMain;
