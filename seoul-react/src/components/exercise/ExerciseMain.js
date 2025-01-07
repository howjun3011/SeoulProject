import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../assets/css/exercise/ExerciseMain.module.css';
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import { MapMarker } from "react-kakao-maps-sdk";

function ExerciseMain() {
    const tabNames = ["수영","테니스","축구","족구","골프","배드민턴","풋살","게이트볼"];
    const [currentTabType, setCurrentTabType] = useState(Array(tabNames.length).fill(false));
    const [currentType, setCurrentType] = useState('수영');
    const [facilities, setFacilities] = useState([]);
    const [currentLat, setCurrentLat] = useState(37.481855);
    const [currentLng, setCurrentLng] = useState(126.897324);
    const [radius, setRadius] = useState(4);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);

    // 날씨 관련
    const [weatherData, setWeatherData] = useState(null);
    const [recommendation, setRecommendation] = useState('');

    // 날씨 상세 모달 상태
    const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
    const [weatherModalData, setWeatherModalData] = useState(null);

    // 예약페이지 및 길찾기 페이지 상태
    const [showBooking, setShowBooking] = useState(false);
    const [bookingUrl, setBookingUrl] = useState('');
    const [showRoute, setShowRoute] = useState(false);
    const [routeUrl, setRouteUrl] = useState('');

    // Directions steps 상태 (경로 상세 정보)
    const [directionSteps, setDirectionSteps] = useState([]);
    const [directionError, setDirectionError] = useState(null);

    const embedApiKey = process.env.REACT_APP_GOOGLEMAPS_EMBED_KEY;
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

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

    const roundLatLot = (lat, lot) => {
        const rlat = Math.round(lat * 1000)/1000;
        const rlot = Math.round(lot * 1000)/1000;
        return `${rlat},${rlot}`;
    };

    // 위치별로 그룹화 (소수점 3자리 기준)
    const groupedByLocation = {};
    facilities.forEach(item => {
        const key = roundLatLot(item.lat, item.lot);
        if (!groupedByLocation[key]) {
            groupedByLocation[key] = [];
        }
        groupedByLocation[key].push(item);
    });

    const handleMarkerClick = (key) => {
        const [lat, lot] = key.split(',').map(Number);
        axios.get('http://localhost:9002/seoul/exercise/details', {
            params: { lat, lot, exerciseType: currentType }
        })
        .then(res => {
            setModalData(res.data);
            setIsModalOpen(true);
            setShowBooking(false);
            setShowRoute(false);
            setDirectionSteps([]);
            setDirectionError(null);
        })
        .catch(err => console.error(err));
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
        setShowBooking(false);
        setShowRoute(false);
        setDirectionSteps([]);
        setDirectionError(null);
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
                const forecastData = {};
                items.forEach(item => {
                    const key = `${item.fcstDate}${item.fcstTime}`;
                    if(!forecastData[key]) {
                        forecastData[key] = {};
                    }
                    forecastData[key][item.category] = item.fcstValue;
                });

                const sortedKeys = Object.keys(forecastData).sort();
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

    // Directions API를 사용하여 경로 정보 가져오는 함수 (백엔드 서버 이용)
    const fetchDirections = async (destinationLat, destinationLng) => {
        try {
            setDirectionError(null);
            setDirectionSteps([]);
            // 백엔드 서버에 Directions 요청
            const currentLat = 37.481855;
            const currentLng = 126.897324;
            const url = `http://localhost:9002/seoul/exercise/directions?originLat=${currentLat}&originLng=${currentLng}&destLat=${destinationLat}&destLng=${destinationLng}&mode=transit`;
            const res = await axios.get(url);
            const data = res.data;

            if(data.status === "OK") {
                const steps = data.routes[0].legs[0].steps;
                setDirectionSteps(steps);
            } else {
                setDirectionError(`경로 정보를 가져올 수 없습니다: ${data.status}`);
            }
        } catch (err) {
            setDirectionError('경로 정보를 가져오는 중 에러가 발생했습니다.');
            console.error(err);
        }
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
                {Object.keys(groupedByLocation).map(key => {
                    const [lat, lot] = key.split(',').map(Number);
                    return (
                        <MapMarker
                            key={key}
                            position={{ lat, lng: lot }}
                            onClick={() => handleMarkerClick(key)}
                        />
                    );
                })}
            </CommonMap>

            <SideTab>
                <div className={styles.exerciseFrame}>
                    <div className={styles.exerciseHeaderGrid}>
                        {tabNames.map((tabName, index) => (
                            <div
                                key={tabName}
                                className={`${styles.exerciseHeaderCompontent} ${styles.flexCenter} ${currentTabType[index] ? styles.active : ''}`}
                                onClick={() => {
                                    let temp = Array(tabNames.length).fill(false);
                                    temp[index] = true;
                                    setCurrentTabType(temp);
                                    setCurrentType(tabName);
                                }}
                            >
                                {tabName}
                            </div>
                        ))}
                    </div>

                    <div className={styles.dividerLine}></div>

                    <div className={styles.facilityList}>
                        {facilities.map((item, idx) => (
                            <div 
                                key={idx} 
                                className={styles.facilityItem}
                                onClick={() => {
                                    axios.get('http://localhost:9002/seoul/exercise/details', {
                                        params: { lat: item.lat, lot: item.lot, exerciseType: currentType }
                                    })
                                    .then(res => {
                                        setModalData(res.data);
                                        setIsModalOpen(true);
                                        setShowBooking(false);
                                        setShowRoute(false);
                                        setDirectionSteps([]);
                                        setDirectionError(null);
                                    })
                                    .catch(err => console.error(err));
                                }}
                            >
                                <div className={styles.facilityItemWrapper}>
                                    <div className={styles.facilityImageWrapper}>
                                        {item.imgFileUrlAddr && (
                                            <img 
                                                src={item.imgFileUrlAddr} 
                                                alt={item.rsrcNm} 
                                                className={styles.facilityImage}
                                            />
                                        )}
                                    </div>
                                    <div className={styles.facilityInfoWrapper}>
                                        <div className={styles.facilityName}>{item.rsrcNm}</div>
                                        <div className={styles.facilityAddr}>{item.addr}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SideTab>

            {/* 시설 정보 모달 */}
            {isModalOpen && (
                <div className={styles.modalBackdrop} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closeModal}>X</button>
                        <h4>시설 상세 정보</h4>
                        <br/>

                        {/* 버튼 영역: 예약하기 / 길찾기 */}
                        {!showBooking && !showRoute && (
                            <h4>예약하기 또는 길찾기를 선택하세요.</h4>
                        )}

                        {showBooking && (
                            <div className={styles.bookingContainer}>
                                <button className={styles.backButton} onClick={() => {setShowBooking(false); setShowRoute(false);}}>← 목록으로</button>
                                {bookingUrl ? (
                                    <iframe
                                        src={bookingUrl}
                                        className={styles.modalIframe}
                                        title="예약 페이지"
                                    />
                                ) : (
                                    <p>예약 페이지를 불러오지 못했습니다.</p>
                                )}
                            </div>
                        )}

                        {modalData && modalData.length > 0 && !showBooking && !showRoute && (
                            <div>
                                {modalData.map((detail, index) => {
                                    // 지도용 Embed API URL
                                    const currentLat = 37.481855;
                                    const currentLng = 126.897324;
                                    const directionEmbedUrl = `https://www.google.com/maps/embed/v1/directions?key=${embedApiKey}&origin=${currentLat},${currentLng}&destination=${detail.lat},${detail.lot}&mode=transit`;
                                    
                                    return (
                                        <div 
                                            key={index} 
                                            className={styles.modalDetailItem}
                                        >
                                            {detail.imgFileUrlAddr && (
                                                <img 
                                                    src={detail.imgFileUrlAddr} 
                                                    alt={detail.rsrcNm} 
                                                    className={styles.modalImage}
                                                />
                                            )}
                                            <div className={styles.modalDetailTextWrapper}>
                                                <div className={styles.modalDetailName}>{detail.rsrcNm}</div>
                                                <div className={styles.modalDetailAddr}>{detail.addr}</div>
                                                <div className={styles.modalButtonGroup}>
                                                    <button className={styles.actionButton} onClick={() => {
                                                        if(detail.instUrlAddr) {
                                                            setBookingUrl(detail.instUrlAddr);
                                                            setShowBooking(true);
                                                            setShowRoute(false);
                                                        }
                                                    }}>예약하기</button>
                                                    <button className={styles.actionButton} onClick={() => {
                                                        setRouteUrl(directionEmbedUrl);
                                                        setShowRoute(true);
                                                        setShowBooking(false);
                                                        // 경로 정보 가져오기
                                                        fetchDirections(detail.lat, detail.lot);
                                                    }}>길찾기</button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {showRoute && (
                            <div className={styles.bookingContainer}>
                                <button className={styles.backButton} onClick={() => {
                                    setShowRoute(false);
                                    setShowBooking(false);
                                    setDirectionSteps([]);
                                    setDirectionError(null);
                                }}>← 목록으로</button>
                                {routeUrl ? (
                                    <div style={{display: 'flex', gap: '20px'}}>
                                        {/* 지도 영역 */}
                                        <div style={{width: '60%', marginRight: '10px'}}>
                                            <iframe
                                                src={routeUrl}
                                                className={styles.modalIframe}
                                                title="길찾기 페이지"
                                            />
                                        </div>

                                        {/* 단계별 안내 표시 영역 */}
                                        <div style={{width: '40%', maxHeight: '500px', overflowY: 'auto'}}>
                                            <h4 style={{marginBottom: '15px', color: '#333'}}>경로 안내</h4>
                                            {directionError && <p style={{color: 'red'}}>{directionError}</p>}
                                            {!directionError && directionSteps.length > 0 ? (
                                                <div className={styles.directionStepsContainer}>
                                                    {directionSteps.map((step, i) => (
                                                        <div key={i} className={styles.directionStep}>
                                                            <h5>Step {i + 1}</h5>
                                                            <div dangerouslySetInnerHTML={{__html: step.html_instructions}} />
                                                            <p>거리: {step.distance.text}, 시간: {step.duration.text}</p>
                                                            {step.transit_details && (
                                                                <p className={styles.busNumber}>버스 번호: {step.transit_details.line.short_name || step.transit_details.line.name}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                !directionError && <p>경로 정보를 불러오는 중...</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p>길찾기 페이지를 불러오지 못했습니다.</p>
                                )}
                            </div>
                        )}

                        {!showBooking && !showRoute && (!modalData || modalData.length === 0) && (
                            <p>일치하는 시설 정보가 없습니다.</p>
                        )}
                    </div>
                </div>
            )}

            {weatherData && (
                <div className={styles.weatherContainer} onClick={handleWeatherContainerClick}>
                    <div className={styles.weatherInfo}>
                        <span>{weatherData.temperature}℃</span>
                        <span>{weatherData.sky}</span>
                    </div>
                    <div className={styles.weatherRecommendation}>{recommendation}</div>
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
                                    return (
                                        <div className="forecastBlock" key={idx}>
                                            <h4>{hoursAfter}시간 후</h4>
                                            <p>기온: {forecast.data.TMP ? forecast.data.TMP + '℃' : 'N/A'}</p>
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