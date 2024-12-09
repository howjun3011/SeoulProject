import React from "react";
import styles from "../../assets/css/health/HealthMain.module.css";

// 병원 상세정보 컴포넌트
function HospitalDetail({ hospital, onBack, setMarkers, hospitalList, groupByCoordinates, parseOpenCloseTimeAll, getHospitalSbjDisplay }) {
    const days = [
        {label: '일요일', field: 'hosp_sun_oc'},
        {label: '월요일', field: 'hosp_mon_oc'},
        {label: '화요일', field: 'hosp_tue_oc'},
        {label: '수요일', field: 'hosp_wed_oc'},
        {label: '목요일', field: 'hosp_thu_oc'},
        {label: '금요일', field: 'hosp_fri_oc'},
        {label: '토요일', field: 'hosp_sat_oc'},
    ];

    const todayIndex = new Date().getDay();

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
                    {/* 운영 시간 */}
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
                    {/* 전화번호 */}
                    <div className={styles.hospitalCall}>
                        <img className={styles.hospitalCallImg} src={`/images/health/call.png`} alt={"call"}/>
                        <div className={styles.hospitalNumber}>
                            {hospital.hosp_pnumber}
                        </div>
                    </div>
                </div>
                {/* 진료과목 리스트 */}
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

export default HospitalDetail;