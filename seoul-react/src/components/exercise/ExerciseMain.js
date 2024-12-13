import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/css/exercise/ExerciseMain.module.css';
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";

function ExerciseMain() {
    const tabNames = ['수영', '축구', '테니스', '배드민턴', '기타'];
    const [currentTabType, setCurrentTabType] = useState([true, false, false, false, false]);
    const [currentType, setCurrentType] = useState('수영');
    const [facilities, setFacilities] = useState([]);
    const [currentLat, setCurrentLat] = useState(37.55576761);
    const [currentLng, setCurrentLng] = useState(126.97209840);
    const [radius, setRadius] = useState(3);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    
    // 날씨 관련
    const [weatherData, setWeatherData] = useState(null);
    const [recommendation, setRecommendation] = useState('');

    // 날씨 상세 모달 상태
    const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
    const [weatherModalData, setWeatherModalData] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLat(position.coords.latitude);
                    setCurrentLng(position.coords.longitude);
                },
                (error) => {
                    console.error('Error getting location', error);
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

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const serviceKey = 'aP%2BFcLozktqVCWG7d%2FL%2BB86RskW9wP1TDWA8Me0KhTH%2BsX%2Fbg5oumQEKWkqJABnEPiTUBp9ca64IDhQraupXGw%3D%3D';
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const baseDate = `${year}${month}${day}`;
                let hour = String(now.getHours()).padStart(2, '0');
                let minute = now.getMinutes();
                let baseTime = '';

                // 초단기예보 base_time 계산 (30분 단위)
                if (minute < 45) {
                    const newHour = hour === '00' ? '23' : String(parseInt(hour, 10) - 1).padStart(2, '0');
                    baseTime = newHour + '30';
                } else {
                    baseTime = hour + '30';
                }

                const nx = 58;
                const ny = 125;

                const weatherUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst` +
                    `?serviceKey=${serviceKey}` +
                    `&pageNo=1` +
                    `&numOfRows=100` +
                    `&dataType=JSON` +
                    `&base_date=${baseDate}` +
                    `&base_time=${baseTime}` +
                    `&nx=${nx}` +
                    `&ny=${ny}`;

                const weatherResponse = await fetch(weatherUrl);
                const weatherJson = await weatherResponse.json();

                if (weatherJson.response && weatherJson.response.body && weatherJson.response.body.items) {
                    const items = weatherJson.response.body.items.item;
                    const currentT1H = items.find(item => item.category === 'T1H');
                    const currentSKY = items.find(item => item.category === 'SKY');
                    const currentPTY = items.find(item => item.category === 'PTY');

                    let skyStatus = '정보없음';
                    if (currentSKY) {
                        switch (currentSKY.fcstValue) {
                            case '1':
                                skyStatus = '맑음';
                                break;
                            case '3':
                                skyStatus = '구름많음';
                                break;
                            case '4':
                                skyStatus = '흐림';
                                break;
                            default:
                                skyStatus = '정보없음';
                        }
                    }

                    let recommendationMessage = '실외 운동을 추천드려요!';
                    if (currentPTY) {
                        switch (currentPTY.fcstValue) {
                            case '1': // 비
                                recommendationMessage = '비가 오고 있어요. 실내 운동을 추천드려요!';
                                break;
                            case '2': // 비/눈
                                recommendationMessage = '진눈깨비가 내리고 있어요. 실내 운동을 추천드려요!';
                                break;
                            case '3': // 눈
                                recommendationMessage = '눈이 오고 있어요. 실내 운동을 추천드려요!';
                                break;
                            case '4': // 소나기
                                recommendationMessage = '소나기가 내리고 있어요. 실내 운동을 추천드려요!';
                                break;
                            default:
                                recommendationMessage = '실외 운동을 추천드려요!';
                        }
                    }

                    setRecommendation(recommendationMessage);

                    setWeatherData({
                        temperature: currentT1H ? currentT1H.fcstValue : 'N/A',
                        sky: skyStatus
                    });
                }
            } catch (err) {
                console.error('날씨 정보 가져오기 실패:', err);
            }
        };

        fetchWeather();
    }, []);

    const handleMarkerClick = (facility) => {
        setIsModalOpen(true);
        setModalData(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // 날씨 상세 모달 닫기
    const closeWeatherModal = () => {
        setIsWeatherModalOpen(false);
    };

    // 단기예보(3시간 단위) 정보 가져오기
    const fetchShortForecast = async () => {
        try {
            const serviceKey = 'aP%2BFcLozktqVCWG7d%2FL%2BB86RskW9wP1TDWA8Me0KhTH%2BsX%2Fbg5oumQEKWkqJABnEPiTUBp9ca64IDhQraupXGw%3D%3D'; 
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const baseDate = `${year}${month}${day}`;

            // 단기예보는 3시간 간격 발표: 02,05,08,11,14,17,20,23시
            const officialTimes = [2,5,8,11,14,17,20,23];
            const currentHour = now.getHours();
            let chosenHour = officialTimes[0];
            for (const t of officialTimes) {
                if (currentHour >= t) chosenHour = t;
            }
            // chosenHour는 현재시간 이전에 발표된 가장 최근 발표 시간
            let baseTime = String(chosenHour).padStart(2, '0') + '00';

            const nx = 58;
            const ny = 125;

            const shortForecastUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst` +
                `?serviceKey=${serviceKey}` +
                `&pageNo=1` +
                `&numOfRows=1000` +
                `&dataType=JSON` +
                `&base_date=${baseDate}` +
                `&base_time=${baseTime}` +
                `&nx=${nx}` +
                `&ny=${ny}`;

            const response = await fetch(shortForecastUrl);
            const json = await response.json();

            if (json.response && json.response.body && json.response.body.items) {
                const items = json.response.body.items.item;
                // console.log(items); // 디버그용

                const forecastData = {};
                items.forEach(item => {
                    const key = `${item.fcstDate}${item.fcstTime}`;
                    if(!forecastData[key]) {
                        forecastData[key] = {};
                    }
                    forecastData[key][item.category] = item.fcstValue;
                });

                const sortedKeys = Object.keys(forecastData).sort();
                // 가까운 시간부터 8개 (약 24시간치) 데이터
                const shortTermForecasts = sortedKeys.slice(0, 8).map(key => {
                    return {
                        dateTime: key,
                        data: forecastData[key]
                    };
                });

                setWeatherModalData(shortTermForecasts);
            }
        } catch (error) {
            console.error('단기예보 가져오기 실패:', error);
        }
    };

    const handleWeatherContainerClick = () => {
        fetchShortForecast().then(() => {
            setIsWeatherModalOpen(true);
        });
    };

    return (
        <div className={styles.exerciseContainer}>
            <CommonMap 
                mapLevel={6}
                onPinDrop={(lat, lng) => {
                    setCurrentLat(lat);
                    setCurrentLng(lng);
                }}
            >
                {facilities.map((facility) => (
                    <div key={facility.exercise_num}>
                        <MapMarker 
                            position={{ lat: facility.latitude, lng: facility.longitude }} 
                            onClick={() => handleMarkerClick(facility)}
                        />
                        <CustomOverlayMap 
                            position={{ lat: facility.latitude, lng: facility.longitude }}
                            yAnchor={1.8}
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
                                    setCurrentType(tabName);
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

            {weatherData && (
                <div className={styles.weatherContainer} onClick={handleWeatherContainerClick}>
                    <div className={styles.weatherInfo}>
                        <span>{weatherData.temperature}℃</span>
                        <span>{weatherData.sky}</span>
                    </div>
                    <div className={styles.weatherRecommendation}>{recommendation}</div>
                </div>
            )}

            {/* 기존 시설 정보 모달 */}
            {isModalOpen && (
                <div className={styles.modalBackdrop} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>X</button>
                        <h3>시설 정보</h3>
                        {modalData ? (
                            <div>{modalData}</div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            )}

            {/* 날씨 상세 모달 */}
            {isWeatherModalOpen && (
                <div className={styles.modalBackdrop} onClick={closeWeatherModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeWeatherModal}>X</button>
                        <h3>향후 날씨 정보</h3>
                        {weatherModalData ? (
                            <div className={styles.apiDetails}>
                                {weatherModalData.map((forecast, idx) => {
                                    const hoursAfter = 3 * (idx + 1);  
                                    const date = forecast.dateTime.slice(0,8);
                                    const time = forecast.dateTime.slice(8,10) + ':' + forecast.dateTime.slice(10,12);

                                    // T3H는 3시간 단위 기온
                                    return (
                                        <div className="forecastBlock" key={idx}>
                                            <h4>{hoursAfter}시간 후</h4>
                                            <p>기온: {forecast.data.T3H ? forecast.data.T3H + '℃' : 'N/A'}</p>
                                            <p>강수확률: {forecast.data.POP ? forecast.data.POP + '%' : 'N/A'}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ExerciseMain;