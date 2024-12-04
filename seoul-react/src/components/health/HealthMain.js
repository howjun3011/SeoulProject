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
    const [isManualSelection, setIsMenualSelection] = useState(false); // 병원 리스트에서 병원 선택 시 true
    const [isSbjFilterOpen, setIsSbjFilterOpen] = useState(false); // 진료과목 필터 열림 상태
    const [isWeekFilterOpen, setIsWeekFilterOpen] = useState(false); // 주말/공휴일 필터 열림 상태
    const [selectedSbjFilter, setSelectedSbjFilter] = useState('전체'); // 진료과목 선택된 필터 항목
    const [sujFilterButtonText, setSujFilterButtonText] = useState('진료과목'); // 진료과목 필터 버튼 텍스트
    const [selectedWeekFilter, setSelectedWeekFilter] = useState('전체'); // 주말/공휴일 선택된 필터 항목
    const [weekFilterButtonText, setWeekFilterButtonText] = useState('주말/공휴일'); // 주말/공휴일 필터 버튼 텍스트

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

    // 요일 필드 이름 반환 함수
    const getTodayFieldName = () => {
        const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        const todayIndex = new Date().getDay(); // 오늘 요일(0(일)~6)

        return `hosp_${days[todayIndex]}_oc`;
    }

    // 운영 정보 계산 함수
    const parseOpenCloseTime = (hospital) => {
        const fieldName = getTodayFieldName(); // 오늘 요일에 해당하는 필드 이름 가져오기
        const todayHours = hospital[fieldName];

        if(todayHours === "00:00-00:00") {
            return "휴무";
        }
        return todayHours;
    }

    // 진료과목 필터 토글 핸들러
    const toggleSbjFilter = () => {
        setIsSbjFilterOpen((prev) => !prev);
        setIsWeekFilterOpen(false); // 다른 필터 닫기
    };

    // 주말/공휴일 필터 토글 핸들러
    const toggleWeekFilter = () => {
        setIsWeekFilterOpen((prev) => !prev);
        setIsSbjFilterOpen(false); // 다른 필터 닫기
    };

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

    // 지도 중심 좌표 또는 필터 변경 시 데이터 가져오기
    useEffect(() => {
        if (currentCenter && !isManualSelection) {
            console.log("Fetching hospitals for center:", currentCenter); // debug
            fetchHospitals(currentCenter, debouncedKeyword, selectedSbjFilter === '전체' ? '' : selectedSbjFilter, selectedWeekFilter === '전체' ? '' : selectedWeekFilter); // 병원 데이터 요청
        }
        // 수동 선택 후에는 다시 false로 설정
        // 사용자가 병원 리스트에서 특정 병원을 선택했을 때, 지도 이동에 따른 데이터 재요청 방지
        if(isManualSelection) {
            setIsMenualSelection(false);
        }
    }, [currentCenter, debouncedKeyword, selectedSbjFilter, selectedWeekFilter]);

    // 병원 데이터 Fetch 함수 수정
    const fetchHospitals = async (center, keyword, sbjFilter, weekFilter) => {
        if (!center) return; // 중심 좌표 정보가 없을 경우 함수 종료

        try {
            // URLSearchParams를 사용하여 URL 파라미터를 동적으로 구성
            const params = new URLSearchParams();
            params.append('lat', center.lat);
            params.append('lon', center.lng);
            params.append('radius', 0.4);

            // 키워드가 있을 경우에만 추가
            if (keyword && keyword.trim() !== '') {
                params.append('keyword', keyword);
            }

            // 진료과목 필터가 있을 경우에만 추가
            if (sbjFilter && sbjFilter.trim() !== '') {
                params.append('subject', sbjFilter);
            }

            // 주말/공휴일 필터가 있을 경우에만 추가
            if (weekFilter && weekFilter.trim() !== '') {
                params.append('week', weekFilter);
            }

            const response = await fetch(
                `http://localhost:9002/seoul/health/search?${params.toString()}`
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
                console.log("현재 지도 범위 내에 결과 없음.");

                // 검색어가 있는 경우에만 전체 검색 시도
                if (keyword && keyword.trim() !== '') {
                    console.log("전체 검색 시도");

                    const responseAll = await fetch(
                        `http://localhost:9002/seoul/health/search?keyword=${keyword}`
                    );
                    if (!responseAll.ok) {
                        throw new Error(`HTTP error! status: ${responseAll.status}`);
                    }

                    const dataAll = await responseAll.json();

                    if (Array.isArray(dataAll) && dataAll.length > 0) {
                        setHospitalList(dataAll);
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
                        setHospitalList([]);
                        setMarkers([]);
                    }
                } else {
                    // 검색어가 없으면 병원 목록과 마커를 비웁니다.
                    setHospitalList([]);
                    setMarkers([]);
                }
            }
        } catch (error) {
            console.error("Error fetching hospital data:", error);
            setHospitalList([]); // 병원 목록 초기화
            setMarkers([]); // 마커 초기화
        }
    };


    // 디바운스 처리: 사용자가 입력을 멈춘 후 0.3초 후에 키워드 업데이트
    // 디바운싱은 불필요한 API 호출을 방지하기 위해 사용됨
    useEffect(() => {
        const handler = setTimeout(()=> {
            setDebouncedKeyword(searchKeyword);
        }, 300);

        return () => {
            clearTimeout(handler); // 이전 타이머를 클리어해서 중복 호출 방지
        };
    }, [searchKeyword]);

    const handleSbjFilterSelect = (item) => {
        setSelectedSbjFilter(item); // 선택된 진료과목 필터 업데이트
        setSujFilterButtonText(item === '전체' ? '진료과목' : item); // 진료과목 버튼 텍스트 업데이트
        setIsSbjFilterOpen(false); // 진료과목 필터 컨테이너 닫기

        // 병원 데이터 요청
        fetchHospitals(currentCenter, debouncedKeyword, item === '전체' ? '' : item, selectedWeekFilter === '전체' ? '' : selectedWeekFilter);
    };

    const handleWeekFilterSelect = (item) => {
        setSelectedWeekFilter(item); // 선택된 주말/공휴일 필터 업데이트
        setWeekFilterButtonText(item === '전체' ? '주말/공휴일' : item); // 주말/공휴일 버튼 텍스트 업데이트
        setIsWeekFilterOpen(false); // 진료과목 필터 컨테이너 닫기

        // 병원 데이터 요청
        fetchHospitals(currentCenter, debouncedKeyword, selectedSbjFilter === '전체' ? '' : selectedSbjFilter,item === '전체' ? '' : item);
    };

    const getHospitalSbjDisplay = (hospital) => {
        if(hospital.hosp_type_eng === 'B' || hospital.hosp_type_eng === 'C') {
            // hosp_type_eng가 B(병원), C(의원)인 경우, hosp_sbj_list의 첫 번째 요소 반환
            if(hospital.hosp_sbj_list && hospital.hosp_sbj_list.length > 0) {
                return hospital.hosp_sbj_list[0];
            } else {
                return '';
            }
        } else {
            return hospital.hosp_type;
        }
    }

    return (
        <div className={styles.healthContainer}>
            <CommonMap setMap={ setMap } mapLevel={ 3 }>
                {/* markers 배열 순회하면서 각 마커와 관련된 데이터 렌더링 */}
                {markers.map((marker, index) => (
                    /* React.Fragment: 여러 자식을 포함하는 부모 컨테이너 역할, 추가적인 DOM 노드 생성 방지 */
                    <React.Fragment key={`marker-${marker.name}-${index}`}>
                        <MapMarker
                            position={marker.position}
                            onClick={() => {
                                setSelectedMarker(marker); // 마커 클릭 시 선택된 마커 설정
                            }}
                            zIndex={selectedMarker && selectedMarker.name === marker.name ? 10 : 1} // 선택된 마커의 z-index 높이기
                        />
                        {/* 선택된 마커가 현재 마커와 동일한 경우에만 오버레이 표시 */}
                        {selectedMarker && selectedMarker.name === marker.name && (
                            <CustomOverlayMap position={marker.position} // 마커와 동일한 위치에 오버레이 표시
                                              yAnchor={1.5} // 오버레이의 y축 기준점 조정
                                              zIndex={1000} // 오버레이의 z-index 높게 설정
                            >
                                {/* 오버레이에 표시될 정보 스타일 */}
                                <div
                                    style={{
                                        // 선택된 마커는 z-index를 높게 설정
                                        zIndex: 1000, // 오버레이의 z-index도 가장 앞으로 설정
                                        backgroundColor: "#fff",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                        fontSize: "14px",
                                        lineHeight: "1.6",
                                        maxWidth: "400px",
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
                        <button className={styles.filterToggle} onClick={toggleSbjFilter}>
                            {sujFilterButtonText} ▼
                        </button>
                        <button className={styles.filterToggle} onClick={toggleWeekFilter}>
                            {weekFilterButtonText} ▼
                        </button>
                        {/* 진료과목 필터 컨텐츠 */}
                        {isSbjFilterOpen && (
                            <div className={styles.filterContainer}>
                                {['전체', '내과', '피부과', '소아과', '이비인후과', '안과', '치과', '정형외과', '산부인과', '흉부외과', '비뇨기과', '한의원', '외과', '성형외과', '신경외과', '가정의학과', '마취통증의학과', '영상의학과'].map((item) => (
                                    <button
                                        key={item}
                                        className={`${styles.filterItem} ${selectedSbjFilter === item ? styles.selectedFilterItem : ''}`}
                                        onClick={() => handleSbjFilterSelect(item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* 주말/공휴일 필터 컨텐츠 */}
                        {isWeekFilterOpen && (
                            <div className={styles.filterContainer}>
                                {['전체', '토요일 진료', '일요일 진료', '공휴일 진료'].map((item) => (
                                    <button
                                        key={item}
                                        className={`${styles.filterItem} ${selectedWeekFilter === item ? styles.selectedFilterItem : ''}`}
                                        onClick={() => handleWeekFilterSelect(item)}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 검색 결과 목록 */}
                    <div className={styles.resultList}>
                        {Array.isArray(hospitalList) && hospitalList.length > 0 ? (
                            hospitalList.map((hospital, index) => (
                                <div key={index}
                                     className={styles.resultItem}
                                     // 병원 리스트에서 병원 선택 시
                                     onClick={() => {
                                         const newCenter = { lat: hospital.hosp_lat, lng: hospital.hosp_lon }; // 병원 위치를 지도 중심으로 설정
                                         setCurrentCenter(newCenter); // 지도 중심 상태 업데이트
                                         map.setCenter(new window.kakao.maps.LatLng(newCenter.lat, newCenter.lng)); // 지도 중심 이동

                                         setIsMenualSelection(true); // 병원 리스트에서 선택했음을 표시
                                         
                                         // 마커 데이터와 선택된 마커 업데이트
                                         setMarkers([{
                                             position: { lat: hospital.hosp_lat, lng: hospital.hosp_lon },
                                             name: hospital.hosp_name,
                                             phone: hospital.hosp_pnumber,
                                             zIndex: 999, // zIndex 높게 설정
                                         }]);

                                         setSelectedMarker({
                                             position: { lat: hospital.hosp_lat, lng: hospital.hosp_lon },
                                             name: hospital.hosp_name,
                                             phone: hospital.hosp_pnumber,
                                         }); // 선택된 마커 업데이트
                                     }}
                                     style={{ cursor: "pointer"}}
                                >
                                    <div className={styles.hospitalNameSbj}>
                                        <div className={styles.hospitalName}>
                                            {hospital.hosp_name}
                                            <div className={styles.hospitalSbj}>
                                                {getHospitalSbjDisplay(hospital)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.hospitalLocation}>
                                        <img className={styles.hospitalLoationImg} src={`/images/health/location.png`} alt={"location"}/>
                                        <div className={styles.hospitalSimpleAddress}>
                                            {hospital.hosp_simple_address}
                                        </div>
                                    </div>
                                    <div className={styles.hospitalHours}>
                                        <img className={styles.hospitalHoursImg} src={`/images/health/hours.png`} alt="hours"/>
                                        <div className={styles.hospitalTime}>
                                            {parseOpenCloseTime(hospital)}
                                        </div>
                                    </div>
                                    <div className={styles.hospitalCall}>
                                        <img className={styles.hospitalCallImg} src={`/images/health/call.png`} alt={"call"}/>
                                        <div className={styles.hospitalNumber}>
                                            {hospital.hosp_pnumber}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noHospitalInfo}>병원 정보 없음</div>
                        )}
                    </div>
                </div>
            </SideTab>
        </div>
    );
}

export default HealthMain;
