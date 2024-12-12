import React, { useEffect, useState } from 'react';
import styles from "../../assets/css/health/HealthMain.module.css";

function WeatherInfo() {
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // 서비스 키 (이미 인코딩된 형태)
                const serviceKey = 'yS7P3EDpV941DaSS0Kr%2B9FWPTS03AjXqaKoV89OHZjKVuRgXnQwngjiestfD%2BtV8YWmVMqK2DSwkQlxUZK0jJw%3D%3D';

                // 현재 시간 가져오기 (날씨용)
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const baseDate = `${year}${month}${day}`;

                // 현재 분에 따라 base_time 결정
                let hour = String(now.getHours()).padStart(2, '0');
                let minute = now.getMinutes();
                let baseTime = '';
                if (minute < 45) {
                    const newHour = hour === 0 ? 23 : hour - 1;
                    baseTime = (newHour < 10 ? ('0' + newHour) : newHour) + '30';
                } else {
                    baseTime = (hour < 10 ? ('0' + hour) : hour) + '30';
                }

                // 격자 좌표 (nx, ny)
                const nx = 58;
                const ny = 125;

                // 초단기예보조회 (기상청 API)
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
                const weatherJson = await weatherResponse.json(); // 바로 JSON으로 변환
                console.log('기상청 데이터:', weatherJson); // JSON 데이터를 출력

                if (weatherJson.response && weatherJson.response.body && weatherJson.response.body.items && weatherJson.response.body.items.item) {
                    const items = weatherJson.response.body.items.item;

                    const currentT1H = items.find(item => item.category === 'T1H');
                    const currentSKY = items.find(item => item.category === 'SKY');

                    let skyStatus = '정보없음';
                    let skyStatusImgPath = '';
                    if (currentSKY) {
                        switch (currentSKY.fcstValue) {
                            case '1':
                                skyStatus = '맑음';
                                skyStatusImgPath = '/images/health/sun.png';
                                break;
                            case '3':
                                skyStatus = '구름많음';
                                skyStatusImgPath = '/images/health/cloud.png';
                                break;
                            case '4':
                                skyStatus = '흐림';
                                skyStatusImgPath = '/images/health/overcast.png';
                                break;
                            default:
                                skyStatus = '정보없음';
                        }
                    }

                    let newWeatherData = {
                        temperature: currentT1H ? currentT1H.fcstValue : 'N/A',
                        sky: skyStatus,
                        pm10grade: null,
                        pm25grade: null,
                        skyImg: skyStatusImgPath
                    };

                    // 미세먼지 API 호출 (시도별 실시간 측정정보 조회)
                    const dustUrl = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty` +
                        `?serviceKey=${serviceKey}` +
                        `&returnType=JSON` +
                        `&numOfRows=100` +
                        `&pageNo=1` +
                        `&sidoName=${encodeURIComponent('서울')}` +
                        `&ver=1.3`;

                    const dustResponse = await fetch(dustUrl);

                    // 응답 상태 확인 및 텍스트 출력
                    if (!dustResponse.ok) {
                        throw new Error(`미세먼지 API 요청 실패! 상태 코드: ${dustResponse.status}`);
                    }

                    const responseText = await dustResponse.text();
                    console.log("미세먼지 API 응답 텍스트:", responseText);

                    let dustJson;
                    try {
                        dustJson = JSON.parse(responseText);
                        console.log('미세먼지 API JSON 응답:', dustJson);
                    } catch (e) {
                        console.error("응답을 JSON으로 파싱하지 못했습니다. 응답 내용:", responseText);
                        throw new Error("미세먼지 API 응답이 JSON 형식이 아님");
                    }

                    if (dustJson.response && dustJson.response.body && dustJson.response.body.items) {
                        const dustItems = dustJson.response.body.items;
                        const guroData = dustItems.find(item => item.stationName === '구로구');
                        console.log(guroData);

                        if (guroData) {
                            newWeatherData.pm10 = parseInt(guroData.pm10Grade, 10);
                            newWeatherData.pm25 = parseInt(guroData.pm25Grade, 10);

                            let pm10ImgPath = '';
                            let pm25ImgPath = '';
                            // 미세먼지, 초미세먼지 등급 분류
                            if (newWeatherData.pm10 === 1) {
                                newWeatherData.pm10grade = '좋음';
                                pm10ImgPath = '/images/health/good.png';
                            } else if (newWeatherData.pm10 === 2) {
                                newWeatherData.pm10grade = '보통';
                                pm10ImgPath = '/images/health/soso.png';
                            } else if (newWeatherData.pm10 === 3) {
                                newWeatherData.pm10grade = '나쁨';
                                pm10ImgPath = '/images/health/bad.png';
                            } else if (newWeatherData.pm10 === 4) {
                                newWeatherData.pm10grade = '매우나쁨';
                                pm10ImgPath = '/images/health/sobad.png';
                            }

                            if (newWeatherData.pm25 === 1) {
                                newWeatherData.pm25grade = '좋음';
                                pm25ImgPath = '/images/health/good.png';
                            } else if (newWeatherData.pm25 === 2) {
                                newWeatherData.pm25grade = '보통';
                                pm25ImgPath = '/images/health/soso.png';
                            } else if (newWeatherData.pm25 === 3) {
                                newWeatherData.pm25grade = '나쁨';
                                pm25ImgPath = '/images/health/bad.png';
                            } else if (newWeatherData.pm25 === 4) {
                                newWeatherData.pm25grade = '매우나쁨';
                                pm25ImgPath = '/images/health/sobad.png';
                            }

                            newWeatherData.pm10Img = pm10ImgPath;
                            newWeatherData.pm25Img = pm25ImgPath;
                        } else {
                            console.warn('미세먼지 데이터가 없습니다.');
                        }
                    } else {
                        console.warn('미세먼지 데이터 구조 이상.');
                    }

                    setWeatherData(newWeatherData);
                } else {
                    setError('날씨 데이터를 파싱할 수 없습니다.');
                    console.error('예상치 못한 기상청 응답 구조:', weatherJson);
                }
            } catch (err) {
                console.error('날씨 정보 가져오기 실패:', err);
                setError('날씨 정보를 가져오는 동안 문제가 발생했습니다.');
            }
        };

        fetchWeather();
    }, []);

    if (error) {
        return (
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                color: 'red',
                zIndex: 9999
            }}>
                {error}
            </div>
        );
    }

    if (!weatherData) {
        return (
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '10px',
                borderRadius: '8px',
                fontSize: '14px',
                zIndex: 9999
            }}>
                날씨 정보를 불러오는 중...
            </div>
        );
    }

    return (
        <div style={{
            position: 'absolute',
            display: 'flex',
            bottom: '10px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '10px',
            marginLeft: '10px',
            gap: '10px',
            zIndex: 9999
        }}>
            <div className={styles.weatherStatTmp}>
                <div className={styles.weatherStat}><img src={weatherData.skyImg} alt="skyStatusImg" /></div>
                <div className={styles.weatherTmp}>{weatherData.temperature}℃</div>
            </div>
            <div className={styles.weatherPm1025}>
                <div className={styles.weatherPm10}>
                    <div className={styles.weatherPm10Img}><img src={weatherData.pm10Img} alt="pm10Img" /></div>
                    <div className={styles.weatherPm10}>미세먼지</div>
                </div>
                <div className={styles.weatherPm25}>
                    <div className={styles.weatherPm25Img}><img src={weatherData.pm25Img} alt="pm25Img" /></div>
                    <div className={styles.weatherPm25}>초미세먼지</div>
                </div>
            </div>
        </div>
    );
}

export default WeatherInfo;
