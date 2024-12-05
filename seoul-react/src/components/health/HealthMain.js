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
    const [selectedHospitalDetail, setSelectedHospitalDetail] = useState(null); // 병원 세부정보

    // 사용자 위치 가져오기(브라우저의 GeoLocation API 사용)
    // 의존성 배열 비워둠: 컴포넌트가 처음 렌더링될 때 한 번만 실행
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude }); // 사용자 위치 설정
                    setCurrentCenter({ lat: latitude, lng: longitude }); // 초기 지도 중심 설정

                    // 현재 위치 마커를 상태에 추가
                    setMarkers((prevMarkers) => [
                        ...prevMarkers,
                        {
                            position: { lat: latitude, lng: longitude },
                            name: '현재 위치',
                            isCurrentLocation: true,
                        },
                    ]);
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
        const todayIndex = new Date().getDay(); // 오늘 요일(0(일)~6)을 숫자 형태로 가져오기

        return `hosp_${days[todayIndex]}_oc`;
    }

    // 운영 정보 계산 함수
    const parseOpenCloseTime = (hospital) => {
        const fieldName = getTodayFieldName(); // 오늘 요일에 해당하는 필드 이름 가져오기
        const todayHours = hospital[fieldName]; // hospital 객체에서 fieldName에 해당하는 값 가져오기

        return todayHours === "00:00-00:00" ? "정기휴무" : todayHours;
    }

    // 특정 요일의 운영 시간을 받아 휴무 여부를 반환하는 함수
    const parseOpenCloseTimeAll = (time) => {
        return time === "00:00-00:00" ? "정기휴무" : time;
    };

    // 진료과목 필터 open/close 함수
    const toggleSbjFilter = () => {
        setIsSbjFilterOpen((prev) => !prev); // 필터 오픈상태 반전
        setIsWeekFilterOpen(false); // 다른 필터 닫기
    };

    // 주말/공휴일 필터 open/close 함수
    const toggleWeekFilter = () => {
        setIsWeekFilterOpen((prev) => !prev);
        setIsSbjFilterOpen(false); // 다른 필터 닫기
    };

    // 지도 객체가 초기화된 이후 dragstart, mouseup 이벤트 리스너 등록
    useEffect(() => {
        if (map) {
            // 지도와 dragstart 이벤트 발생 시 선택된 마커 초기화
            window.kakao.maps.event.addListener(map, "dragstart", () => {
               setSelectedMarker(null); // 선택된 마커 초기화
            });

            // 지도의 mouseup 이벤트 발생 시 중심 좌표를 업데이트
            // 사용자가 지도 이동하고 마우스 놓을 때마다 map.getCenter() 호출해서 새로운 중심 좌표 업데이트
            window.kakao.maps.event.addListener(map, "mouseup", () => {
                const center = map.getCenter(); // 새로운 지도 중심 좌표 가져오기
                const newCenter = { lat: center.getLat(), lng: center.getLng() }; // 좌표를 객체로 변환
                console.log("Mouseup detected, new center:", newCenter); // debug
                setCurrentCenter(newCenter); // 새로운 중심 좌표를 상태로 저장
            });
        }
    }, [map]);

    // 현재 중심, 디바운스된 검색어, 진료과목 필터, 주말/공휴일 필터 중 하나라도 변경이 발생하면 실행해서 병원 데이터 요청
    useEffect(() => {
        // 사용자가 병원 리스트에서 특정 병원 클릭하는 경우 isManualSelection이 true로 설정되며
        // 지도 중심이 선택한 병원의 위치로 이동하게 되는데, 이때는 데이터 요청을 하지 X
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

    // 병원 데이터 Fetch 함수
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
                // 요청 URL은 params 객체를 문자열로 변환하여 구성
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

                // 기존의 현재 위치 마커를 유지하면서 새로운 병원 마커들을 추가
                setMarkers((prevMarkers) => {
                    // 이전 마커들에서 현재 위치 마커를 찾습니다.
                    const currentLocationMarker = prevMarkers.find((marker) => marker.isCurrentLocation);
                    // 병원 마커 생성
                    const hospitalMarkers = data.map((hospital) => ({
                        position: { lat: hospital.hosp_lat, lng: hospital.hosp_lon },
                        name: hospital.hosp_name,
                        phone: hospital.hosp_pnumber,
                        hospital: hospital,
                    }));
                    // 현재 위치 마커가 있으면 포함하여 마커 상태 업데이트
                    return currentLocationMarker
                        ? [currentLocationMarker, ...hospitalMarkers]
                        : hospitalMarkers;
                });
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
                        // 첫 번째 병원 데이터의 위치로 지도 중심 좌표 설정
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
            clearTimeout(handler); // 새로운 입력이 발생할 때 이전의 setTimeout을 취소(이전 타이머를 클리어해서 중복 호출 방지)
        };
    }, [searchKeyword]);

    // 진료과목 필터버튼 선택 시 실행
    const handleSbjFilterSelect = (item) => {
        setSelectedSbjFilter(item); // 선택된 진료과목 필터 업데이트
        setSujFilterButtonText(item === '전체' ? '진료과목' : item); // 진료과목 버튼 텍스트 업데이트
        setIsSbjFilterOpen(false); // 진료과목 필터 컨테이너 닫기

        // 병원 데이터 요청
        fetchHospitals(currentCenter, debouncedKeyword, item === '전체' ? '' : item, selectedWeekFilter === '전체' ? '' : selectedWeekFilter);
    };

    // 주말/공휴일 필터버튼 선택 시 실행
    const handleWeekFilterSelect = (item) => {
        setSelectedWeekFilter(item); // 선택된 주말/공휴일 필터 업데이트
        setWeekFilterButtonText(item === '전체' ? '주말/공휴일' : item); // 주말/공휴일 버튼 텍스트 업데이트
        setIsWeekFilterOpen(false); // 진료과목 필터 컨테이너 닫기

        // 병원 데이터 요청
        fetchHospitals(currentCenter, debouncedKeyword, selectedSbjFilter === '전체' ? '' : selectedSbjFilter,item === '전체' ? '' : item);
    };

    // 대표 진료과목
    const getHospitalSbjDisplay = (hospital) => {
        // hosp_type_eng가 B(병원), C(의원)인 경우
        if(hospital.hosp_type_eng === 'B' || hospital.hosp_type_eng === 'C') {
            if(hospital.hosp_sbj_list && hospital.hosp_sbj_list.length > 0) {
                // hosp_sbj_list의 첫 번째 요소 반환
                return hospital.hosp_sbj_list[0];
            } else {
                return '';
            }
        } else {
            return hospital.hosp_type;
        }
    }

    // 현재 위치로 돌아가는 함수 추가
    const returnToCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    const newCenter = { lat: lat, lng: lng };
                    setCurrentCenter(newCenter); // 지도 중심 좌표 업데이트
                    map.setCenter(new window.kakao.maps.LatLng(lat, lng)); // 지도 중심 이동

                    // 현재 위치 마커를 상태에 추가하거나 업데이트합니다.
                    setMarkers((prevMarkers) => [
                        // 기존의 현재 위치 마커를 제거
                        ...prevMarkers.filter((m) => !m.isCurrentLocation),
                        // 새로운 현재 위치 마커 추가
                        {
                            position: { lat: lat, lng: lng },
                            name: '현재 위치',
                            isCurrentLocation: true,
                        },
                    ]);
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

    function HospitalDetail({ hospital, onBack, setMarkers, hospitalList }) {
        const days = [
            { label: '일요일', field: 'hosp_sun_oc'},
            { label: '월요일', field: 'hosp_mon_oc'},
            { label: '화요일', field: 'hosp_tue_oc'},
            { label: '수요일', field: 'hosp_wed_oc'},
            { label: '목요일', field: 'hosp_thu_oc'},
            { label: '금요일', field: 'hosp_fri_oc'},
            { label: '토요일', field: 'hosp_sat_oc'},
        ];

        const todayIndex = new Date().getDay();

        const handleBackClick = () => {
            // hospitalList를 기반으로 마커 상태를 업데이트
            const updatedMarkers = hospitalList.map((hospital) => ({
                position: { lat: hospital.hosp_lat, lng: hospital.hosp_lon },
                name: hospital.hosp_name,
                phone: hospital.hosp_pnumber,
            }));

            setMarkers(updatedMarkers); // markers 상태 업데이트
            onBack(); // 기존 뒤로가기 동작 호출
        };

        return (
            <div className={styles.hospitalScrollable}>
                <div className={styles.hospitalDetail}>
                    <div className={styles.hospitalDetailList}>
                        <div className={styles.hospitalBackBtn}>
                            <button className={styles.backButton} onClick={handleBackClick}>
                                <img className={styles.backButtonImg} src={`/images/health/back.png`} alt="backImg"/>
                            </button>
                        </div>
                        <div className={styles.hospitalNameSbjDetail}>
                            <div className={styles.hospitalName}>
                                {hospital.hosp_name}
                                <div className={styles.hospitalSbj}>
                                    {getHospitalSbjDisplay(hospital)}
                                </div>
                            </div>
                        </div>
                        <div className={styles.hospitalLocation}>
                            <img className={styles.hospitalLocationImg} src={`/images/health/location.png`} alt="location"/>
                            <div className={styles.hospitalSimpleAddress}>
                                {hospital.hosp_address}
                            </div>
                        </div>
                        {/* location의 값이 있을 때만 태그 렌더링 */}
                        {hospital.hosp_location && (
                            <div className={styles.hospitalFindLocation}>
                                <img className={styles.hospitalFindLocationImg} src={`/images/health/findlocation.png`}
                                     alt="findlocation"/>
                                <div className={styles.hospitalFindAddress}>
                                    {hospital.hosp_location}
                                </div>
                            </div>
                        )}
                        <div className={styles.hospitalTimeDetail}>
                            <img className={styles.hospitalHoursImg} src={`/images/health/hours.png`} alt="hours"/>
                            <div className={styles.hospitalTime}>
                                {days.map((day, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.hospitalTimeItem} ${todayIndex === index ? styles.boldText : ''}`}
                                    >
                                        {day.label} {parseOpenCloseTimeAll(hospital[day.field])}
                                    </div>
                                ))}
                                <div className={styles.hospitalTimeItem}>{hospital.hosp_lunchtime}</div>
                            </div>
                        </div>
                        <div className={styles.hospitalCall}>
                            <img className={styles.hospitalCallImg} src={`/images/health/call.png`} alt={"call"}/>
                            <div className={styles.hospitalNumber}>
                                {hospital.hosp_pnumber}
                            </div>
                        </div>
                    </div>
                    <div className={styles.sbjDetail}>
                        <div className={styles.hospitalSbjText}>진료과목</div>
                        <div className={styles.hospitalSbjList}>
                            {hospital.hosp_sbj_list && hospital.hosp_sbj_list.length > 0 ? (
                                hospital.hosp_sbj_list.map((subject, index) => (
                                    <div key={index} className={styles.hospitalSbjItem}>
                                        {subject}
                                    </div>
                                ))
                            ) : (
                                <div className={styles.hospitalSbjItem}>정보 없음</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.healthContainer}>
            <CommonMap setMap={setMap} mapLevel={3} showControls={false} showCurrentLocationOverlay={false} showCurrentLocationMarker={false}>
                {/* 현재 위치로 돌아가는 버튼 */}
                <button
                    onClick={returnToCurrentLocation}
                    className={styles.currentLocationButton}
                >
                    현재 위치로 이동
                </button>

                {/* markers 배열 순회하면서 각 마커와 관련된 데이터 렌더링 */}
                {markers.map((marker, index) => {
                    const markerImage = marker.isCurrentLocation
                        ? {
                            src: '/images/health/current-location-marker.png', // 현재 위치 마커 이미지 경로
                            size: { width: 33, height: 44 }, // 마커 크기
                            options: { offset: { x: 16, y: 44 } }, // 중심점 설정
                        }
                        : {
                            src: '/images/health/default-marker.png', // 일반 마커 이미지 경로
                            size: { width: 33, height: 44 },
                            options: { offset: { x: 16, y: 44 } },
                        };

                    return (
                        <React.Fragment key={`marker-${marker.name}-${index}`}>
                            <MapMarker
                                position={marker.position}
                                image={markerImage} // 이미지 적용
                                onClick={() => {
                                    setSelectedMarker(marker); // 마커 클릭 시 선택된 마커 설정
                                }}
                                zIndex={marker.isCurrentLocation ? 999 : 1} // 현재 위치 마커의 zIndex를 높게 설정
                            />
                            {selectedMarker && selectedMarker.name === marker.name && (
                                <CustomOverlayMap position={marker.position} yAnchor={1.5} zIndex={1000}>
                                    <div
                                        onClick={() =>  {
                                            setSelectedHospitalDetail(marker.hospital); // 오버레이 클릭 시 병원 세부정보 표시
                                        }}
                                        style={{
                                            zIndex: 1000,
                                            backgroundColor: '#fff',
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                            fontSize: '14px',
                                            lineHeight: '1.6',
                                            maxWidth: '400px',
                                            textAlign: 'center',
                                            wordBreak: 'break-word',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <strong style={{ fontSize: '16px', color: '#333' }}>{marker.name}</strong>
                                        <br />
                                        {marker.phone ? (
                                            <span style={{ color: '#666' }}>{marker.phone}</span>
                                        ) : (
                                            <span style={{ color: '#999' }}>전화번호 없음</span>
                                        )}
                                    </div>
                                </CustomOverlayMap>
                            )}
                        </React.Fragment>
                    );
                })}
            </CommonMap>
            <SideTab>
                <div className={styles.sideTabContainer}>
                    {!selectedHospitalDetail && (
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
                                {sujFilterButtonText} {isSbjFilterOpen ? '▲' : '▼'}
                            </button>
                            <button className={styles.filterToggle} onClick={toggleWeekFilter}>
                                {weekFilterButtonText} {isWeekFilterOpen ? '▲' : '▼'}
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
                    )}
                    {selectedHospitalDetail ? (
                        // 병원 세부정보 뷰 랜더랑
                        <HospitalDetail
                            hospital={selectedHospitalDetail}
                            onBack={() => setSelectedHospitalDetail(null)}
                            setMarkers={setMarkers} // 마커 업데이트를 위한 상태 전달
                            hospitalList={hospitalList} // 현재 병원 리스트 전달
                        />
                    ) : (
                        // 병원 리스트 뷰 렌더링
                        <div className={styles.hospitalScrollable}>
                            <div className={styles.resultList}>
                                {Array.isArray(hospitalList) && hospitalList.length > 0 ? (
                                    hospitalList.map((hospital, index) => (
                                        <div key={index}
                                             className={styles.resultItem}
                                            // 병원 리스트에서 병원 선택 시
                                             onClick={() => {
                                                 const newCenter = {lat: hospital.hosp_lat, lng: hospital.hosp_lon}; // 병원 위치를 지도 중심으로 설정
                                                 setCurrentCenter(newCenter); // 지도 중심 상태 업데이트
                                                 map.setCenter(new window.kakao.maps.LatLng(newCenter.lat, newCenter.lng)); // 지도 중심 이동

                                                 setIsMenualSelection(true); // 병원 리스트에서 선택했음을 표시

                                                 // 마커 데이터와 선택된 마커 업데이트
                                                 setMarkers([{
                                                     position: {lat: hospital.hosp_lat, lng: hospital.hosp_lon},
                                                     name: hospital.hosp_name,
                                                     phone: hospital.hosp_pnumber,
                                                     zIndex: 999, // zIndex 높게 설정
                                                 }]);

                                                 setSelectedMarker({
                                                     position: {lat: hospital.hosp_lat, lng: hospital.hosp_lon},
                                                     name: hospital.hosp_name,
                                                     phone: hospital.hosp_pnumber,
                                                 }); // 선택된 마커 업데이트

                                                 setSelectedHospitalDetail(hospital); // 선택된 병원의 상세 정보를 상태로 지정
                                             }}
                                             style={{cursor: "pointer"}}
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
                                                <img className={styles.hospitalLocationImg}
                                                     src={`/images/health/location.png`} alt="location"/>
                                                <div className={styles.hospitalSimpleAddress}>
                                                    {hospital.hosp_simple_address}
                                                </div>
                                            </div>
                                            <div className={styles.hospitalHours}>
                                                <img className={styles.hospitalHoursImg}
                                                     src={`/images/health/hours.png`} alt="hours"/>
                                                <div className={styles.hospitalTime}>
                                                    {parseOpenCloseTime(hospital)}
                                                </div>
                                            </div>
                                            <div className={styles.hospitalCall}>
                                                <img className={styles.hospitalCallImg} src={`/images/health/call.png`}
                                                     alt={"call"}/>
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
                    )}
                </div>
            </SideTab>
        </div>
    );
}

export default HealthMain;
