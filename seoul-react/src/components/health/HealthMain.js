import styles from "../../assets/css/health/HealthMain.module.css";
import GetFetch from "../../hooks/getFetch";

import SideTab from "../common/SideTab";
import CommonMap from "../common/CommonMap";
import {useEffect, useState} from "react";
import {CustomOverlayMap} from "react-kakao-maps-sdk";

function HealthMain() {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [hospitalList, setHospitalList] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [map, setMap] = useState();

    const hospitalData = GetFetch(
        "http://localhost:9002/seoul/health/getAllHospitalInfo"
    );

    useEffect(() => {
        console.log("hospitalData:", hospitalData); // 데이터 확인

        const data = Array.isArray(hospitalData) ? hospitalData : [];
        if (searchKeyword === "") {
            setHospitalList(data);
            setMarkers(
                data.map((hospital) => ({
                    position: { lat: hospital.hosp_lat, lng: hospital.hosp_lng },
                    name: hospital.hosp_name,
                }))
            );
        } else {
            const filtered = data.filter((hospital) =>
                hospital.hosp_name.includes(searchKeyword)
            );
            setHospitalList(filtered);
            setMarkers(
                filtered.map((hospital) => ({
                    position: { lat: hospital.hosp_lat, lng: hospital.hosp_lng },
                    name: hospital.hosp_name,
                }))
            );
        }
    }, [searchKeyword, hospitalData]);

    return (
        <div className={styles.healthContainer}>
            <CommonMap setMap={setMap} mapLevel={ 3 }>
                {markers.map((marker, index) => (
                    <CustomOverlayMap
                        key={`marker-${marker.name}-${index}`}
                        position={marker.position}
                    >
                        <div className={styles.marker}>{marker.name}</div>
                    </CustomOverlayMap>
                ))}
            </CommonMap>
            <SideTab>
                <div className={styles.searchBarContainer}>
                    <input
                        className={styles.searchBar}
                        type="text"
                        placeholder="검색어를 입력하세요"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>
                <div className={styles.resultList}>
                    {hospitalList.map((hospital, index) => (
                        <div key={index} className={styles.resultItem}>
                            {hospital.hosp_name}
                        </div>
                    ))}
                </div>
            </SideTab>
        </div>
    );
}

export default HealthMain;