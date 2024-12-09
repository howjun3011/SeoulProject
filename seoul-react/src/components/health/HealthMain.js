import styles from "../../assets/css/health/HealthMain.module.css";
import SideTab from "../common/SideTab";
import CommonMap from "../common/CommonMap";
import React, { useEffect, useState } from "react";
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";
import HospitalDetail from "./HospitalDetail";

function HealthMain() {
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색어 입력 상태
    const [debouncedKeyword, setDebouncedKeyword] = useState(""); // 디바운스 처리된 검색어
    const [hospitalList, setHospitalList] = useState([]); // 검색된 병원 리스트
    const [markers, setMarkers] = useState([]); // 지도에 표시할 마커 리스트
    const [map, setMap] = useState(null); // 지도 객체 상태
    const [userLocation, setUserLocation] = useState(null); // 사용자 현재 위치
    const [currentCenter, setCurrentCenter] = useState(null); // 지도의 현재 중심 좌표
    const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 정보
    const [isManualSelection, setIsManualSelection] = useState(false); // 수동으로 지도 이동했는지 여부
    const [isSbjFilterOpen, setIsSbjFilterOpen] = useState(false); // 진료과목 필터 드롭다운 열림 상태
    const [isWeekFilterOpen, setIsWeekFilterOpen] = useState(false); // 주말/공휴일 필터 드롭다운 열림 상태
    const [selectedSbjFilter, setSelectedSbjFilter] = useState('전체'); // 진료과목 선택된 필터 값
    const [sujFilterButtonText, setSujFilterButtonText] = useState('진료과목'); // 진료과목 필터 버튼에 표시될 텍스트
    const [selectedWeekFilter, setSelectedWeekFilter] = useState('전체'); // 주말/공휴일 선택된 필터 값
    const [weekFilterButtonText, setWeekFilterButtonText] = useState('주말/공휴일'); // 주말/공휴일 필터 버튼에 표시될 텍스트
    const [selectedHospitalDetail, setSelectedHospitalDetail] = useState(null); // 선택된 병원 상세 정보

    // 사용자 현재 위치 가져오기
    // 컴포넌트가 마운트될 때 사용자의 현재 위치를 가져와서 userLocation과 currentCenter를 설정하고, 현재 위치를 표시하는 마커 추가
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });
                    setCurrentCenter({ lat: latitude, lng: longitude });

                    setMarkers((prevMarkers) => [
                        ...prevMarkers,
                        {
                            position: { lat: latitude, lng: longitude },
                            name: '',
                            isCurrentLocation: true,
                            hospitals: [] // 현재 위치 마커는 병원 정보 없음
                        },
                    ]);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    // 오늘 요일에 맞는 필드 이름 반환
    const getTodayFieldName = () => {
        const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        const todayIndex = new Date().getDay(); // 오늘 요일 인덱스 가져오기
        return `hosp_${days[todayIndex]}_oc`;
    }

    // 운영시간 파싱(병원 간단정보)
    const parseOpenCloseTime = (hospital) => {
        const fieldName = getTodayFieldName();
        const todayHours = hospital[fieldName];
        return todayHours === "00:00-00:00" ? "정기휴무" : todayHours;
    }

    // 운영시간 파싱(병원 상세정보)
    const parseOpenCloseTimeAll = (time) => {
        return time === "00:00-00:00" ? "정기휴무" : time;
    };

    // 진료과목 필터 토글 함수
    const toggleSbjFilter = () => {
        setIsSbjFilterOpen((prev) => !prev);
        setIsWeekFilterOpen(false); // 주말/공휴일 필터 닫기
    };

    // 주말/공휴일 필터 토글 함수
    const toggleWeekFilter = () => {
        setIsWeekFilterOpen((prev) => !prev);
        setIsSbjFilterOpen(false); // 진료과목 필터 닫기
    };

    // 지도 이벤트 리스너
    useEffect(() => {
        if (map) {
            // 지도 드래그 시작 시 선택된 마커 해제
            window.kakao.maps.event.addListener(map, "dragstart", () => {
                setSelectedMarker(null);
            });
            // 지도 클릭 시 선택된 마커 해제
            window.kakao.maps.event.addListener(map, "click", () => {
                setSelectedMarker(null);
            })
            
            // 지도 드래그 종료 시 새로운 중심 좌표 설정
            window.kakao.maps.event.addListener(map, "mouseup", () => {
                const center = map.getCenter();
                const newCenter = { lat: center.getLat(), lng: center.getLng() };
                console.log("Mouseup detected, new center:", newCenter);
                setCurrentCenter(newCenter);
            });
        }
    }, [map]);

    // currentCenter, debouncedKeyword, selectedSbjFilter, selectedWeekFilter가 변경될 때마다 병원 데이터 가져옴
    useEffect(() => {
        if (currentCenter && !isManualSelection) {
            fetchHospitals(
                currentCenter,
                debouncedKeyword,
                selectedSbjFilter === '전체' ? '' : selectedSbjFilter,
                selectedWeekFilter === '전체' ? '' : selectedWeekFilter
            );
        }
        // 사용자가 수동으로 지도를 이동한 경우, isManualSelection을 리셋
        if(isManualSelection) {
            setIsManualSelection(false);
        }
    }, [currentCenter, debouncedKeyword, selectedSbjFilter, selectedWeekFilter]);

    // 좌표별 병원 그룹핑 함수
    // 병원 리스트를 좌표별로 그룹핑해서 동일한 위치에 있는 병원들을 하나의 마커로 표시할 수 있도록 함
    const groupByCoordinates = (hospitals) => {
        const map = new Map();
        hospitals.forEach((h) => {
            // 좌표를 소수점 5자리로 반올림하여 그룹핑 정확도 향상
            const latRounded = h.hosp_lat.toFixed(5);
            const lonRounded = h.hosp_lon.toFixed(5);
            const key = `${latRounded}-${lonRounded}`;
            if (!map.has(key)) {
                map.set(key, []);
            }
            map.get(key).push(h);
        });
        return Array.from(map.values()).map(group => {
            const { hosp_lat, hosp_lon } = group[0];
            return {
                position: { lat: hosp_lat, lng: hosp_lon },
                hospitals: group // 병원 그룹 설정
            };
        });
    };

    // 병원 데이터 가져오기
    // 주어진 중심 좌표와 필터를 기반으로 병원 데이터 가져오기
    // 현재 지도 중심 내에서 검색 결과가 없으면 반경을 확대해서 재검색하고 여전히 결과가 없으면 병원 리스트와 마커 초기화
    const fetchHospitals = async (center, keyword, sbjFilter, weekFilter) => {
        if (!center) return;
        try {
            const params = new URLSearchParams();
            params.append('lat', center.lat);
            params.append('lon', center.lng);
            params.append('radius', 0.4); // 초기 반경 0.4km

            if (keyword && keyword.trim() !== '') {
                params.append('keyword', keyword);
            }

            if (sbjFilter && sbjFilter.trim() !== '') {
                params.append('subject', sbjFilter);
            }

            if (weekFilter && weekFilter.trim() !== '') {
                params.append('week', weekFilter);
            }

            // API 호출
            const response = await fetch(
                `http://localhost:9002/seoul/health/search?${params.toString()}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                setHospitalList(data);
                console.log(data.length);

                // 그룹화된 마커 데이터 생성
                const groupedMarkers = groupByCoordinates(data);

                setMarkers((prevMarkers) => {
                    const currentLocationMarker = prevMarkers.find((marker) => marker.isCurrentLocation);
                    return currentLocationMarker
                        ? [currentLocationMarker, ...groupedMarkers]
                        : groupedMarkers;
                });

            } else {
                // 결과 없을 시 반경 확대
                console.log("현재 지도 범위 내에 결과 없음, 반경을 1.5km로 확대하여 재검색");
                const newParams = new URLSearchParams(params);
                newParams.set('radius', 1.5); // 반경 1.5km로 확대

                const responseExpanded = await fetch(
                    `http://localhost:9002/seoul/health/search?${newParams.toString()}`
                );

                if(!responseExpanded.ok) {
                    throw new Error(`HTTP error! status: ${responseExpanded.status}`);
                }

                const dataExpanded = await responseExpanded.json();

                if (Array.isArray(dataExpanded) && dataExpanded.length > 0) {
                    setHospitalList(dataExpanded);

                    const groupedMarkers = groupByCoordinates(dataExpanded);
                    setMarkers((prevMarkers) => {
                        const currentLocationMarker = prevMarkers.find((marker) => marker.isCurrentLocation);
                        return currentLocationMarker
                            ? [currentLocationMarker, ...groupedMarkers]
                            : groupedMarkers;
                    });

                } else {
                    console.log("1.5km 반경에서도 검색 결과 없음");
                    setHospitalList([]);
                    setMarkers((prevMarkers) => {
                        // 현재 위치 마커만 유지 (있다면)
                        const currentLocationMarker = prevMarkers.find(m => m.isCurrentLocation);
                        return currentLocationMarker ? [currentLocationMarker] : [];
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching hospital data:", error);
            setHospitalList([]);
            setMarkers((prevMarkers) => {
                // 현재 위치 마커만 유지
                const currentLocationMarker = prevMarkers.find(m => m.isCurrentLocation);
                return currentLocationMarker ? [currentLocationMarker] : [];
            });
        }
    };

    // 검색어 디바운싱
    // 사용자가 검색어를 입력할 때, 디바운스를 적용해서 입력이 멈춘 후 300ms 후에 debouncedKeyword를 업데이트
    // 이를 통해 불필요한 API 호출 줄임
    useEffect(() => {
        const handler = setTimeout(()=> {
            setDebouncedKeyword(searchKeyword);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchKeyword]);

    // 진료과목 필터 선택 핸들러
    // 사용자가 필터 선택하면 해당 필터 상태를 업데이트하고 병원 데이터 다시 가져옴
    const handleSbjFilterSelect = (item) => {
        setSelectedSbjFilter(item);
        setSujFilterButtonText(item === '전체' ? '진료과목' : item);
        setIsSbjFilterOpen(false);
        fetchHospitals(
            currentCenter,
            debouncedKeyword,
            item === '전체' ? '' : item,
            selectedWeekFilter === '전체' ? '' : selectedWeekFilter
        );
    };

    // 주말/공휴일 필터 선택 핸들러
    const handleWeekFilterSelect = (item) => {
        setSelectedWeekFilter(item);
        setWeekFilterButtonText(item === '전체' ? '주말/공휴일' : item);
        setIsWeekFilterOpen(false);
        fetchHospitals(
            currentCenter,
            debouncedKeyword,
            selectedSbjFilter === '전체' ? '' : selectedSbjFilter,
            item === '전체' ? '' : item
        );
    };

    // 병원 진료과목 표시 함수
    // 병원의 진료과목을 표시하기 위한 함수로, 특정 조건에 따라 다른 값 반환
    const getHospitalSbjDisplay = (hospital) => {
        // hosp_type이 병원, 의원일 경우
        if(hospital.hosp_type_eng === 'B' || hospital.hosp_type_eng === 'C') {
            // 진료과목의 첫 번째(대표 진료과목)를 리턴
            if(hospital.hosp_sbj_list && hospital.hosp_sbj_list.length > 0) {
                return hospital.hosp_sbj_list[0];
            } else {
                return '';
            }
        } else {
            // 병원, 의원이 아닌 경우는 hosp_type을 그대로 리턴
            return hospital.hosp_type;
        }
    };

    // 현재 위치로 돌아가기 함수
    // 사용자의 현재 위치로 지도를 이동시키고, 현재 위치 마커를 업데이트
    const returnToCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    const newCenter = { lat: lat, lng: lng };
                    setCurrentCenter(newCenter);
                    map.setCenter(new window.kakao.maps.LatLng(lat, lng));

                    // 현재 위치 마커 업데이트
                    setMarkers((prevMarkers) => {
                        const currentLocationMarker = {
                            position: { lat: lat, lng: lng },
                            name: '',
                            isCurrentLocation: true,
                            hospitals: []
                        };
                        return [currentLocationMarker, ...prevMarkers.filter(m => !m.isCurrentLocation)];
                    });
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
        <div className={styles.healthContainer}>
            {/* 지도 컴포넌트 */}
            <CommonMap setMap={setMap} mapLevel={3} showControls={false} showCurrentLocationOverlay={false} showCurrentLocationMarker={false}>
                {/* 현재 위치로 이동 버튼 */}
                <button
                    onClick={returnToCurrentLocation}
                    className={styles.currentLocationButton}
                >
                    현재 위치로 이동
                </button>

                {markers.map((marker, index) => {
                    const isCurrentLocation = marker.isCurrentLocation;
                    const count = marker.hospitals ? marker.hospitals.length : 0;
                    const markerImage = isCurrentLocation
                        ? {
                            src: '/images/health/current-location-marker.png',
                            size: { width: 44, height: 44 },
                            options: { offset: { x: 16, y: 44 } },
                        }
                        : {
                            src: '/images/health/default-marker.png',
                            size: { width: 44, height: 44 },
                            options: { offset: { x: 16, y: 44 } },
                        };

                    return (
                        <React.Fragment key={`marker-${index}`}>
                            {/* 기본 마커 표시 */}
                            <MapMarker
                                position={marker.position}
                                image={markerImage}
                                onClick={() => {
                                    // 현재 위치 마커가 아닐 때만 selectedMarker 설정
                                    if(!marker.isCurrentLocation) {
                                        setSelectedMarker(marker);
                                    }
                                }}
                                zIndex={isCurrentLocation ? 999 : 1}
                            />

                            {/* 병원이 2개 이상이면 +N 표시 */}
                            {count > 1 && (
                                <CustomOverlayMap position={marker.position} yAnchor={3.0}>
                                    <div
                                        style={{
                                            position: 'relative',
                                            top: '-100%', // 마커의 위쪽에 위치
                                            left: '80%',
                                            transform: 'translateX(-50%)', // 수평 중앙 정렬
                                            backgroundColor: 'rgba(255, 0, 0, 0.8)', // 반투명 빨간 배경
                                            color: '#fff',
                                            padding: '2px 6px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                        }}
                                        onClick={() => {
                                            // +N 표시 클릭 시 오버레이 열기
                                            setSelectedMarker(marker);
                                        }}
                                    >
                                        {count}
                                    </div>
                                </CustomOverlayMap>
                            )}

                            {/* selectedMarker가 현재 마커일 경우 병원 리스트 오버레이 표시 */}
                            {selectedMarker &&
                                selectedMarker.position.lat === marker.position.lat &&
                                selectedMarker.position.lng === marker.position.lng && (
                                    <CustomOverlayMap position={marker.position} yAnchor={1.5} zIndex={1000}>
                                        <div
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
                                            {/* 여기서 count가 1개 이상이면 병원 리스트를 나열 */}
                                            {marker.hospitals.map((h, idx) => (
                                                <div
                                                    className={styles.hospName}
                                                    key={idx}
                                                    onClick={() => { setSelectedHospitalDetail(h); setSelectedMarker(null);} }
                                                >
                                                    {h.hosp_name}
                                                </div>
                                            ))}
                                        </div>
                                    </CustomOverlayMap>
                                )}
                        </React.Fragment>
                    );
                })}
            </CommonMap>
            {/* 사이드 탭 컴포넌트 */}
            <SideTab>
                <div className={styles.sideTabContainer}>
                    {/* 검색창과 필터 */}
                    {!selectedHospitalDetail && (
                        <div className={styles.searchBarContainer}>
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
                            {/* 진료과목 필터 드롭다운 */}
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
                            {/* 주말/공휴일 필터 드롭다운 */}
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
                    {/* 병원 간단정보 */}
                    {selectedHospitalDetail ? (
                        <HospitalDetail
                            hospital={selectedHospitalDetail}
                            onBack={() => setSelectedHospitalDetail(null)}
                            setMarkers={setMarkers}
                            hospitalList={hospitalList}
                            groupByCoordinates={groupByCoordinates}
                            parseOpenCloseTimeAll={parseOpenCloseTimeAll}
                            getHospitalSbjDisplay={getHospitalSbjDisplay}
                        />
                    ) : (
                        /* 병원 리스트 표시 */
                        <div className={styles.hospitalScrollable}>
                            <div className={styles.resultList}>
                                {Array.isArray(hospitalList) && hospitalList.length > 0 ? (
                                    hospitalList.map((hospital, index) => (
                                        <div key={index}
                                             className={styles.resultItem}
                                             onClick={() => {
                                                 const newCenter = {lat: hospital.hosp_lat, lng: hospital.hosp_lon};
                                                 setCurrentCenter(newCenter);
                                                 map.setCenter(new window.kakao.maps.LatLng(newCenter.lat, newCenter.lng));

                                                 setIsManualSelection(true);

                                                 // 해당 병원 위치에 있는 마커만 표시
                                                 setMarkers((prevMarkers) => {
                                                     const currentLocationMarker = prevMarkers.find(m => m.isCurrentLocation);
                                                     const singleMarker = {
                                                         position: {lat: hospital.hosp_lat, lng: hospital.hosp_lon},
                                                         hospitals: [hospital]
                                                     };
                                                     return currentLocationMarker
                                                         ? [currentLocationMarker, singleMarker]
                                                         : [singleMarker];
                                                 });

                                                 setSelectedMarker({
                                                     position: {lat: hospital.hosp_lat, lng: hospital.hosp_lon},
                                                     hospitals: [hospital]
                                                 });

                                                 setSelectedHospitalDetail(hospital);
                                             }}
                                             style={{cursor: "pointer"}}
                                        >
                                            {/* 병원 이름 및 진료과목 */}
                                            <div className={styles.hospitalNameSbj}>
                                                <div className={styles.hospitalName}>
                                                    {hospital.hosp_name}
                                                    <div className={styles.hospitalSbj}>
                                                        {getHospitalSbjDisplay(hospital)}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* 병원 간단주소 */}
                                            <div className={styles.hospitalLocation}>
                                                <img className={styles.hospitalLocationImg}
                                                     src={`/images/health/location.png`} alt="location"/>
                                                <div className={styles.hospitalSimpleAddress}>
                                                    {hospital.hosp_simple_address}
                                                </div>
                                            </div>
                                            {/* 운영 시간 */}
                                            <div className={styles.hospitalHours}>
                                                <img className={styles.hospitalHoursImg}
                                                     src={`/images/health/hours.png`} alt="hours"/>
                                                <div className={styles.hospitalTime}>
                                                    {parseOpenCloseTime(hospital)}
                                                </div>
                                            </div>
                                            {/* 전화번호 */}
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
