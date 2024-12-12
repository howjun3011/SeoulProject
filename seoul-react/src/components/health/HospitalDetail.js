import React, {useEffect, useState} from "react";
import styles from "../../assets/css/health/HealthMain.module.css";

// 병원 상세정보 컴포넌트
function HospitalDetail({ hospital, onBack, setMarkers, hospitalList, groupByCoordinates, parseOpenCloseTimeAll, getHospitalSbjDisplay, onPharmacySelect }) {
    // 병원 운영시간
    const days = [
        {label: '일요일', field: 'hosp_sun_oc'},
        {label: '월요일', field: 'hosp_mon_oc'},
        {label: '화요일', field: 'hosp_tue_oc'},
        {label: '수요일', field: 'hosp_wed_oc'},
        {label: '목요일', field: 'hosp_thu_oc'},
        {label: '금요일', field: 'hosp_fri_oc'},
        {label: '토요일', field: 'hosp_sat_oc'},
    ];

    // 약국 운영시간
    const day = [
        {label: '일요일', field: 'pharm_sun_oc'},
        {label: '월요일', field: 'pharm_mon_oc'},
        {label: '화요일', field: 'pharm_tue_oc'},
        {label: '수요일', field: 'pharm_wed_oc'},
        {label: '목요일', field: 'pharm_thu_oc'},
        {label: '금요일', field: 'pharm_fri_oc'},
        {label: '토요일', field: 'pharm_sat_oc'},
    ]

    const todayIndex = new Date().getDay();

    const todayPharmDay = day[todayIndex]; // 오늘 요일에 해당하는 객체

    // 가장 가까운 약국 3개를 저장할 state
    const [nearbyPharmacies, setnearbyPharmacies] = useState([]);

    // 뒤로가기 버튼 클릭 시, 마커 초기화 및 리스트로 돌아가기
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

    // hospital 변경될 때마다, 현재 병원 기준 반경 0.1km 이내에 있는 약국 3개 조회
    useEffect(() => {
        if(!hospital) return;

        const fetchNearbyPharmacies = async () => {
            try {
                const params = new URLSearchParams();
                params.append('lat', hospital.hosp_lat);
                params.append('lon', hospital.hosp_lon);
                params.append('radius', 0.2);

                const response = await fetch(`http://localhost:9002/seoul/health/pharmSearch?${params.toString()}`);
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                let data = await response.json();

                // pharm_lat, pharm_lon을 이용한 중복 제거
                const uniquePharmacies = [];
                const seen = new Set();

                for (const pharm of data) {
                    // 소수점 처리 또는 문자열 변환을 통해 정확히 같은 좌표를 비교
                    // 예: lat, lon을 문자열로 변환 후 키로 사용
                    const key = `${pharm.pharm_lat.toFixed(6)}-${pharm.pharm_lon.toFixed(6)}`;
                    if(!seen.has(key)) {
                        seen.add(key);
                        uniquePharmacies.push(pharm);
                    }
                }

                setnearbyPharmacies(uniquePharmacies);
            } catch(error) {
                console.error("Error fetching nearby pharmacies:", error);
                setnearbyPharmacies([]);
            }
        };
        fetchNearbyPharmacies();
    }, [hospital]);


    return (
        <div className={styles.hospitalScrollable}>
            <div className={styles.hospitalDetail}>
                <div className={styles.hospitalDetailList}>
                    {/* 뒤로가기 버튼 */}
                    <div className={styles.hospitalBackBtn}>
                        <button className={styles.backButton} onClick={handleBackClick}>
                            <img className={styles.backButtonImg} src={`/images/health/back.png`} alt="backImg"/>
                        </button>
                    </div>
                    {/* 병원 이름 및 진료과목 */}
                    <div className={styles.hospitalNameSbjDetail}>
                        <div className={styles.hospitalName}>
                            {hospital.hosp_name}
                            <div className={styles.hospitalSbj}>
                                {getHospitalSbjDisplay(hospital)}
                            </div>
                        </div>
                    </div>
                    {/* 병원 주소 */}
                    <div className={styles.hospitalLocation}>
                        <img className={styles.hospitalLocationImg} src={`/images/health/location.png`} alt="location"/>
                        <div className={styles.hospitalSimpleAddress}>
                            {hospital.hosp_address}
                        </div>
                    </div>
                    {/* 병원 위치(있는 경우만 출력) */}
                    {hospital.hosp_location && (
                        <div className={styles.hospitalFindLocation}>
                            <img className={styles.hospitalFindLocationImg} src={`/images/health/findlocation.png`}
                                 alt="findlocation"/>
                            <div className={styles.hospitalFindAddress}>
                                {hospital.hosp_location}
                            </div>
                        </div>
                    )}
                    {/* 병원 운영 시간 */}
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
                    {/* 병원 전화번호 */}
                    <div className={styles.hospitalCall}>
                        <img className={styles.hospitalCallImg} src={`/images/health/call.png`} alt={"call"}/>
                        <div className={styles.hospitalNumber}>
                            {hospital.hosp_pnumber}
                        </div>
                    </div>
                </div>
                {/* 병원 진료과목 리스트 */}
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
            {/* 선택된 병원으로부터 가까운 약국 3개 리스트 */}
            {nearbyPharmacies && nearbyPharmacies.length > 0 && (
                <div className={styles.nearbyPharmacies}>
                    <div className={styles.pharmacyText}>근처 약국</div>
                    {nearbyPharmacies.map((pharm, index) => (
                        <div key={index} className={styles.nearbyPharmacyItem} onClick={() => onPharmacySelect(pharm)} style={{cursor: 'pointer'}}>
                            {/* 약국 이름 */}
                            <div className={styles.hospitalNameSbjDetail}>
                                <div className={styles.hospitalName}>
                                    {pharm.pharm_name}
                                </div>
                            </div>
                            {/* 약국 주소 */}
                            <div className={styles.pharmLocation}>
                                <img className={styles.pharmacyLocationImg} src={`/images/health/location.png`}
                                     alt="location"/>
                                <div className={styles.pharmacyAddressText}>{pharm.pharm_address}</div>
                            </div>
                            {/* 약국 운영 시간 */}
                            <div className={styles.hospitalTimeDetail}>
                                <img className={styles.hospitalHoursImg} src={`/images/health/hours.png`} alt="hours"/>
                                <div className={styles.hospitalTimeItem}>
                                    {todayPharmDay.label} {parseOpenCloseTimeAll(pharm[todayPharmDay.field])}
                                </div>
                            </div>
                            {/* 약국 전화번호 */}
                            <div className={styles.pharmacyCall}>
                                <img className={styles.pharmacyCallImg} src={`/images/health/call.png`} alt={"call"}/>
                                <div className={styles.pharmacyNumber}>{pharm.pharm_pnumber || '정보 없음'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HospitalDetail;