import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/css/exercise/ExerciseMain.module.css';
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";

function ExerciseMain() {
    const tabNames = ['수영', '축구', '테니스', '배드민턴', '기타'];
    const [currentTabType, setCurrentTabType] = useState([true, false, false, false, false]);
    const [currentType, setCurrentType] = useState('수영'); // 기본값 수영
    const [facilities, setFacilities] = useState([]);
    const [currentLat, setCurrentLat] = useState(37.55576761);
    const [currentLng, setCurrentLng] = useState(126.97209840);
    const [radius, setRadius] = useState(3); // 반경 3km 예시

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLat(position.coords.latitude);
                    setCurrentLng(position.coords.longitude);
                },
                (error) => {
                    console.error('Error getting location', error);
                    // 위치 권한 거부 시 기본값 사용
                }
            );
        } else {
            console.error('Geolocation not supported by this browser.');
        }
    }, []);

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
            <CommonMap 
                mapLevel={6}
                onPinDrop={(lat, lng) => {
                    setCurrentLat(lat);
                    setCurrentLng(lng);
                }}
            >
                {/* 원하는 경우, 시설 위치에 마커만 표시하고 오버레이로 정보창 구현 */}
                {facilities.map((facility) => (
                    <div key={facility.exercise_num}>
                        {/* 마커 표시 */}
                        <MapMarker position={{ lat: facility.latitude, lng: facility.longitude }} />

                        {/* 커스텀 오버레이로 정보 표시 (마커 위나 아래로 위치 조정 가능) */}
                        <CustomOverlayMap 
                            position={{ lat: facility.latitude, lng: facility.longitude }}
                            yAnchor={1.8}  // 위치 조정: 마커 위에 띄우고 싶다면 yAnchor값 조절
                        >
                            <div className={styles.markerInfoWindow}>
                                <h4>{facility.facility_name}</h4>
                                <p>{facility.address}</p>
                            </div>
                        </CustomOverlayMap>
                    </div>
                ))}
            </CommonMap>
            
            <SideTab>
                <div className={styles.exerciseFrame}>
                    <div className={styles.exerciseHeader}>
                        {tabNames.map((tabName, index) => (
                            <div
                                key={tabName}
                                className={`${styles.exerciseHeaderCompontent} ${styles.flexCenter} ${currentTabType[index] ? styles.active : ''}`}
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
                            </div>
                        ))}
                    </div>
                </div>
            </SideTab>
        </div>
    );
}

export default ExerciseMain;