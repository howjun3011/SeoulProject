import styles from '../../assets/css/culture/CultureMain.module.css';
import UseFetch from '../../hooks/useFetch';

// 카카오맵 마커 생성
import { CustomOverlayMap } from "react-kakao-maps-sdk";

// 컴포넌트 객체 생성
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import { useEffect, useState } from 'react';

function CultureMain() {
    // 테스트를 위한 함수
    const test = UseFetch(`http://localhost:9002/seoul/culture/test`);
    console.log(test);

    // 카카오 맵 기본 설정
    const { kakao } = window;
    const [map, setMap] = useState();

    // 장소 검색 함수
    const [markers, setMarkers] = useState([]);
    const bookSub = ["독립 서점", "도서관"];
    let i = 0;

    useEffect(() => {
        if (!map) return

        const places = new kakao.maps.services.Places(map);

        bookSub.map((sub, index) => {
            places.keywordSearch(sub, (data, status, _pagination) => {
                if (status === kakao.maps.services.Status.OK) {
                    for (var i = 0; i < data.length; i++) {
                        markers.push({
                            bookSub: sub,
                            position: {
                                lat: data[i].y,
                                lng: data[i].x,
                            },
                            content: data[i].place_name,
                        })
                    }
                    setMarkers([...markers]);
                }
            }, {
                sort: kakao.maps.services.SortBy.DISTANCE,
                useMapCenter: true,
                useMapBounds: true
            });
        })
    }, [map]);

    // 탭 클릭 이벤트 처리
    const tabNames = ['책', '박물관', '문화재', '공연'];
    const [currentTabType, setCurrentTabType] = useState([true, false, false, false]);

    return (
        <div className={ styles.cultureContainer }>
            <CommonMap setMap={ setMap } mapLevel={ 4 }>
                {markers.map((marker, index) => (
                    <CustomOverlayMap
                        key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
                        position={marker.position}
                    >
                        <OverLay marker={marker} />
                    </CustomOverlayMap>
                ))}
            </CommonMap>
            <SideTab>
                <div className={ styles.cultureFrame }>
                    <div className={ styles.cultureHeader }>
                        {
                            tabNames.map((tabName, index) => {
                                return (
                                    <div
                                        key={tabName}
                                        className={ `${styles.cultureHeaderCompontent} ${styles.flexCenter}` }
                                        style={{
                                            backgroundColor: currentTabType[index] ? '#a0a0a0' : '#b8b8b8',
                                            fontWeight: currentTabType[index] ? '600' : '400'
                                        }}
                                        onClick={() => {
                                            let temp = [false, false, false, false];
                                            temp[index] = true;
                                            setCurrentTabType(temp);
                                        }}
                                    >
                                        {tabName}
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </SideTab>
        </div>
    );
}

function OverLay(props) {
    return (
        <div
            className={styles.overlaybox}
            style={{
                filter: props.marker.bookSub === '독립 서점' ? 'invert(1)' : ''
            }}
        >
            <div className={ `${styles.boxtitle} ${styles.flexCenter}` }>{props.marker.bookSub}</div>
            <div className={ `${styles.overlayContent} ${styles.flexCenter}` }>{props.marker.content}</div>
        </div>
    );
}

export default CultureMain;