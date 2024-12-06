import styles from "../../assets/css/health/HealthMain.module.css";
import SideTab from "../common/SideTab";
import CommonMap from "../common/CommonMap";
import React, { useEffect, useState } from "react";
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";

function HealthMain() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [debouncedKeyword, setDebouncedKeyword] = useState("");
    const [hospitalList, setHospitalList] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [currentCenter, setCurrentCenter] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [isManualSelection, setIsManualSelection] = useState(false);
    const [isSbjFilterOpen, setIsSbjFilterOpen] = useState(false);
    const [isWeekFilterOpen, setIsWeekFilterOpen] = useState(false);
    const [selectedSbjFilter, setSelectedSbjFilter] = useState('전체');
    const [sujFilterButtonText, setSujFilterButtonText] = useState('진료과목');
    const [selectedWeekFilter, setSelectedWeekFilter] = useState('전체');
    const [weekFilterButtonText, setWeekFilterButtonText] = useState('주말/공휴일');
    const [selectedHospitalDetail, setSelectedHospitalDetail] = useState(null);

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
                            name: '현재 위치',
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

    const getTodayFieldName = () => {
        const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        const todayIndex = new Date().getDay();
        return `hosp_${days[todayIndex]}_oc`;
    }

    const parseOpenCloseTime = (hospital) => {
        const fieldName = getTodayFieldName();
        const todayHours = hospital[fieldName];
        return todayHours === "00:00-00:00" ? "정기휴무" : todayHours;
    }

    const parseOpenCloseTimeAll = (time) => {
        return time === "00:00-00:00" ? "정기휴무" : time;
    };

    const toggleSbjFilter = () => {
        setIsSbjFilterOpen((prev) => !prev);
        setIsWeekFilterOpen(false);
    };

    const toggleWeekFilter = () => {
        setIsWeekFilterOpen((prev) => !prev);
        setIsSbjFilterOpen(false);
    };

    useEffect(() => {
        if (map) {
            window.kakao.maps.event.addListener(map, "dragstart", () => {
                setSelectedMarker(null);
            });

            window.kakao.maps.event.addListener(map, "mouseup", () => {
                const center = map.getCenter();
                const newCenter = { lat: center.getLat(), lng: center.getLng() };
                console.log("Mouseup detected, new center:", newCenter);
                setCurrentCenter(newCenter);
            });
        }
    }, [map]);

    useEffect(() => {
        if (currentCenter && !isManualSelection) {
            fetchHospitals(
                currentCenter,
                debouncedKeyword,
                selectedSbjFilter === '전체' ? '' : selectedSbjFilter,
                selectedWeekFilter === '전체' ? '' : selectedWeekFilter
            );
        }
        if(isManualSelection) {
            setIsManualSelection(false);
        }
    }, [currentCenter, debouncedKeyword, selectedSbjFilter, selectedWeekFilter]);

    // 좌표별 병원 그룹핑 함수
    const groupByCoordinates = (hospitals) => {
        const map = new Map();
        hospitals.forEach((h) => {
            const key = `${h.hosp_lat}-${h.hosp_lon}`;
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

    const fetchHospitals = async (center, keyword, sbjFilter, weekFilter) => {
        if (!center) return;
        try {
            const params = new URLSearchParams();
            params.append('lat', center.lat);
            params.append('lon', center.lng);
            params.append('radius', 0.4);

            if (keyword && keyword.trim() !== '') {
                params.append('keyword', keyword);
            }

            if (sbjFilter && sbjFilter.trim() !== '') {
                params.append('subject', sbjFilter);
            }

            if (weekFilter && weekFilter.trim() !== '') {
                params.append('week', weekFilter);
            }

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
                console.log("Markers:", markers);

            } else {
                // 결과 없을 시 반경 확대
                console.log("현재 지도 범위 내에 결과 없음, 반경을 1.5km로 확대하여 재검색");
                const newParams = new URLSearchParams(params);
                newParams.set('radius', 1.5);

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

    useEffect(() => {
        const handler = setTimeout(()=> {
            setDebouncedKeyword(searchKeyword);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchKeyword]);

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

    const getHospitalSbjDisplay = (hospital) => {
        if(hospital.hosp_type_eng === 'B' || hospital.hosp_type_eng === 'C') {
            if(hospital.hosp_sbj_list && hospital.hosp_sbj_list.length > 0) {
                return hospital.hosp_sbj_list[0];
            } else {
                return '';
            }
        } else {
            return hospital.hosp_type;
        }
    }

    const returnToCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    const newCenter = { lat: lat, lng: lng };
                    setCurrentCenter(newCenter);
                    map.setCenter(new window.kakao.maps.LatLng(lat, lng));

                    setMarkers((prevMarkers) => {
                        const currentLocationMarker = {
                            position: { lat: lat, lng: lng },
                            name: '현재 위치',
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

    useEffect(() => {
        const handleMapClick = () => {
            setSelectedMarker(null);
        };

        return () => {
            if (map) {
                window.kakao.maps.event.removeListener(map, "click", handleMapClick);
            }
        };
    }, [map]);


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
            const groupedMarkers = groupByCoordinates(hospitalList);
            setMarkers((prevMarkers) => {
                const currentLocationMarker = prevMarkers.find((marker) => marker.isCurrentLocation);
                return currentLocationMarker
                    ? [currentLocationMarker, ...groupedMarkers]
                    : groupedMarkers;
            });
            onBack();
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
                                    // 마커 클릭 시 selectedMarker 설정
                                    setSelectedMarker(marker);
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
                                            // +N 표시도 마커의 일부로 생각하고 클릭 시 오버레이를 열어줄 수 있음
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
                                                    key={idx}
                                                    style={{ marginBottom: '5px', cursor: 'pointer', color: '#0056b3', textDecoration: 'none' }}
                                                    onClick={() => {console.log("Hospital clicked:", h); setSelectedHospitalDetail(h); setSelectedMarker(null);}}
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
            <SideTab>
                <div className={styles.sideTabContainer}>
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
                        <HospitalDetail
                            hospital={selectedHospitalDetail}
                            onBack={() => setSelectedHospitalDetail(null)}
                            setMarkers={setMarkers}
                            hospitalList={hospitalList}
                        />
                    ) : (
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
