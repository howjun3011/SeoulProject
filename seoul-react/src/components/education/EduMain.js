import styles from '../../assets/css/education/EduMain.module.css';
import { useEffect, useState } from 'react';
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import axios from 'axios';

function EduMain() {
    const { kakao } = window;
    const [map, setMap] = useState();
    const [markers, setMarkers] = useState([]);
    const eduCategories = ["유치원", "키즈카페", "유원시설"]; // 탭 카테고리
    const [currentTabType, setCurrentTabType] = useState([true, false, false]);

    useEffect(() => {
        if (!map) return;

        axios.get('/education/eduTest')
        .then(respose=>{
            const fetchedData = respose.data;
            const newMarkers = fetchedData.map(item=>({
                category : "유치원",
                position: {
                    lat: item.y_coordinate,
                    lag: item.x_coordinate,
                },
                content: item.kindergarten_name,
            }));
            setMarkers(newMarkers);
        })
        .catch(error=>{
            console.error("Error fetche data: ", error);
        });
        
    }, [map]);

    return (
        <div className={styles.educationContainer}>
            <CommonMap setMap={setMap} mapLevel={4}>
                {markers.map((marker, index) => (
                    <CustomOverlayMap
                        key={`marker-${index}`}
                        position={marker.position}
                    >
                        <div className={styles.overlay}>
                            <div>{marker.category}</div>
                            <div>{marker.content}</div>
                        </div>
                    </CustomOverlayMap>
                ))}
            </CommonMap>
            <SideTab>
                <div className={styles.educationTab}>
                    {eduCategories.map((category, index) => (
                        <div
                            key={category}
                            className={`${styles.tab} ${currentTabType[index] ? styles.active : ''}`}
                            onClick={() => {
                                const newTabType = Array(eduCategories.length).fill(false);
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

export default EduMain;
