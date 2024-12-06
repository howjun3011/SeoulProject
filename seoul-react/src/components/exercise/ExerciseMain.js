import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/css/exercise/ExerciseMain.module.css';
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import { MapMarker } from "react-kakao-maps-sdk";

function ExerciseMain() {
    const tabNames = ['수영', '축구', '테니스', '배드민턴', '기타'];
    const [currentTabType, setCurrentTabType] = useState([true, false, false, false, false]);
    const [currentType, setCurrentType] = useState('수영'); // 기본값 수영
    const [facilities, setFacilities] = useState([]);

    const [currentLat, setCurrentLat] = useState(37.5665);
    const [currentLng, setCurrentLng] = useState(126.9780);
    const [radius, setRadius] = useState(3); // 반경 5km 예시

    useEffect(() => {
        axios.get('http://localhost:9002/seoul/exercise/nearby', {
            params: {
                latitude: currentLat,
                longitude: currentLng,
                radius: radius,
                exerciseType: currentType
            }
        })
        .then(res => {
            setFacilities(res.data);
        })
        .catch(err => console.error(err));
    }, [currentType, currentLat, currentLng, radius]);

    return (
        <div className={styles.exerciseContainer}>
            {/* CommonMap 안에 Marker들을 Children으로 전달 */}
            <CommonMap 
                mapLevel={6}
                onPinDrop={(lat, lng) => {
                    setCurrentLat(lat);
                    setCurrentLng(lng);
                }}
            >
                {facilities.map((facility) => (
                    <MapMarker
                        key={facility.exercise_num}
                        position={{ lat: facility.latitude, lng: facility.longitude }}
                    >
                        <div style={{padding:'5px', color:'#000'}}>{facility.facility_name}</div>
                    </MapMarker>
                ))}
            </CommonMap>
            
            <SideTab>
                <div className={styles.exerciseFrame}>
                    <div className={styles.exerciseHeader}>
                        {tabNames.map((tabName, index) => (
                            <div
                                key={tabName}
                                className={`${styles.exerciseHeaderCompontent} ${styles.flexCenter}`}
                                style={{
                                    backgroundColor: currentTabType[index] ? '#a0a0a0' : '#b8b8b8',
                                    fontWeight: currentTabType[index] ? '600' : '400'
                                }}
                                onClick={() => {
                                    let temp = [false, false, false, false, false];
                                    temp[index] = true;
                                    setCurrentTabType(temp);
                                    setCurrentType(tabName); // 클릭 시 타입 변경
                                }}
                            >
                                {tabName}
                            </div>
                        ))}
                    </div>
                    <div className={styles.facilityList}>
                        {facilities.map((facility) => (
                            <div key={facility.exercise_num} className={styles.facilityItem}>
                                <h4>{facility.facility_name}</h4>
                                <p>{facility.address}</p>
                                <p>{facility.phone_number}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </SideTab>
        </div>
    );
}

export default ExerciseMain;