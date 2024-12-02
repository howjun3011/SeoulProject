import styles from '../../assets/css/education/EduMain.module.css';
import { useEffect, useState, useRef } from 'react';
import { MapMarker } from "react-kakao-maps-sdk";
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import axios from 'axios';

function EducationMain() {
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([]);
    const educationCategories = ["유치원", "키즈카페", "유원시설"];
    const [currentTabType, setCurrentTabType] = useState([true, false, false]);

    // map 객체가 설정된 후에 실행되는 useEffect 훅
    useEffect(() => {
        if (mapRef.current) {
            const map = mapRef.current;

            // 지도 경계(bounds) 가져오기
            const bounds = map.getBounds();
            const swLatLng = bounds.getSouthWest();
            const neLatLng = bounds.getNorthEast();

            console.log('swLatLng', swLatLng);
            console.log('neLatLng', neLatLng);

            // 필요에 따라 여기에서 추가 작업 수행 (예: 서버에 좌표 전달)
        }
    }, [mapRef.current]); // mapRef.current가 변경될 때마다 실행

    return (
        <div className={styles.educationContainer}>
            <CommonMap setMap={(map) => { mapRef.current = map; }} mapLevel={4} />
            {markers.map((marker, index) => (
                <MapMarker
                    key={`marker-${index}`}
                    position={marker.position}
                    clickable={true}
                    title={marker.content}
                    map={mapRef.current}
                >
                    <div className={styles.overlay}>
                        <div>{marker.category}</div>
                        <div>{marker.content}</div>
                    </div>
                </MapMarker>
            ))}
            <SideTab>
                <div className={styles.educationTab}>
                    {educationCategories.map((category, index) => (
                        <div
                            key={category}
                            className={`${styles.tab} ${currentTabType[index] ? styles.active : ''}`}
                            onClick={() => {
                                const newTabType = Array(educationCategories.length).fill(false);
                                newTabType[index] = true;
                                setCurrentTabType(newTabType);
                            }}
                        >
                            {category}
                        </div>
                    ))}
                </div>
            </SideTab>
        </div>
    );
}

export default EducationMain;
