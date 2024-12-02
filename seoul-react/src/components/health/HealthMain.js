import styles from "../../assets/css/health/HealthMain.module.css";
import UseFetch from "../../hooks/useFetch";

import SideTab from "../common/SideTab";
import CommonMap from "../common/CommonMap";
import {useEffect, useState} from "react";
import {CustomOverlayMap} from "react-kakao-maps-sdk";

function HealthMain() {
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드
    const [hospitalList, setHospitalList] = useState([]); // 병원 목록 데이터
    const [markers, setMarkers] = useState([]); // 지도에 표시할 마커 데이터
    const [map, setMap] = useState(); // 카카오맵 객체
    const { kakao } = window;

    // 병원 데이터 가져오기
    const hospitalData = UseFetch('http://localhost:9002/seoul/health/test');
    console.log(hospitalData);

    useEffect(() => {
        if(searchKeyword === "") {
            // 검색 키워드가 없으면 전체 데이터 표시
            setHospitalList(hospitalData || []);
            setMarkers(hospitalData.map(hospital => ({
                position: {lat: hospital.lat, lng: hospital.lng},
                name: hospital.name,
            })));
        } else {
            // 키워드가 있으면 필터링
            const filtered = hospitalData.filter(hospital =>
                hospital.name.includes(searchKeyword)
            );
            setHospitalList(filtered);
            setMarkers(filtered,map(hospital => ({
                position: {lat: hospital.lat, lng: hospital.lng},
                name: hospital.name,
            })));
        }
    }, [searchKeyword, hospitalData]);

    return (
        <div className={ styles.healthContainer }>
            <CommonMap setMap={ setMap } mapLevel={ 3 }>
                {markers.map((marker, index) => (
                    <CustomOverlayMap key={`marker-${marker.name}-${index}`} position={marker.position}>
                        <div className={styles.marker}>
                            {marker.name}
                        </div>
                    </CustomOverlayMap>
                ))}
            </CommonMap>
            <SideTab>
                <div className={ styles.searchBarContainer }>
                    {/* 검색창 */}
                    <input  className={ styles.searchBar } type="text" placeholder="검색어를 입력하세요"
                            value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}/>
                </div>
                {/* 검색 결과 */}
                <div className={styles.resultList}>
                    {hospitalList.map((hospital, index) => (
                        <div key={index} className={styles.resultItem}>
                            {hospital.name}
                        </div>
                    ))}
                </div>
            </SideTab>
        </div>
    );
}

export default HealthMain;