import styles from '../../assets/css/culture/CultureMain.module.css';
import GetFetch from '../../hooks/getFetch';

// 카카오맵 마커 생성
import { CustomOverlayMap, MarkerClusterer } from "react-kakao-maps-sdk";

// 컴포넌트 객체 생성
import { useEffect, useState } from 'react';

import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import CultureBookMain from './CultureBookMain';
import CultureBooKStore from './CultureBooKStore';

function CultureMain() {
    // 서점과 관련된 데이터를 획득하는 함수
    const bookDatas = GetFetch(`http://localhost:9002/seoul/culture/getBookData`);
    const [markers, setMarkers] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [bookContents, setBookContents] = useState();

    useEffect(() => {
        if (!bookDatas) return

        bookDatas.map((bookData, index) => {
            markers.push(bookData);
        });

        setMarkers([...markers]);
    }, [bookDatas]);

    // 카카오 맵 기본 설정
    const { kakao } = window;
    const [map, setMap] = useState();

    // CustomOverlayMap z-index 설정
    const [overlayZIndex, setOverlayZIndex] = useState(1);

    /*
    // 키워드 검색 함수
    const [markers, setMarkers] = useState([]);
    const bookSub = ["독립 서점", "도서관"];

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
    */

    // 탭 클릭 이벤트 처리
    const tabNames = ['책', '박물관', '문화재', '공연'];
    const [currentTabType, setCurrentTabType] = useState([true, false, false, false]);

    return (
        <div className={ styles.cultureContainer }>
            <CommonMap setMap={ setMap } mapLevel={ 4 }>
                <MarkerClusterer
                    averageCenter={true}
                    minLevel={6}
                    gridSize={120}
                >
                    {markers.map((marker, index) => {
                        // CustomOverlayMap z-index 설정
                        let customOverlayMap = null;

                        const handleOverlayIndex = (i) => {
                            customOverlayMap.setZIndex(i);
                            setOverlayZIndex(i + 1);
                            setIsClicked(true);
                            setBookContents(marker);
                        };

                        return (
                            <CustomOverlayMap
                                key={`marker-${marker.content}-${marker.fclty_la},${marker.fclty_lo}-${index}`}
                                position={{
                                    lat: marker.fclty_la,
                                    lng: marker.fclty_lo,
                                }}
                                zIndex={0}
                                onCreate={(x) => {customOverlayMap = x;}}
                            >
                                <OverLay
                                    marker={marker}
                                    onClick={() => {handleOverlayIndex(overlayZIndex)}}
                                />
                            </CustomOverlayMap>
                        );
                    })}
                </MarkerClusterer>
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
                    { !isClicked && <CultureBookMain /> }
                    { isClicked && <CultureBooKStore bookContents={bookContents} /> }
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
                filter: props.marker.lclas_nm === '독립서점' ? 'opacity(0.8) drop-shadow(0 0 0 #FF9473)' :
                        props.marker.lclas_nm === '북카페' ? 'opacity(0.8) drop-shadow(0 0 0 #0064FF)' :
                        props.marker.lclas_nm === '만화방' ? 'opacity(0.8) drop-shadow(0 0 0 #8AB78A)' : ''
            }}
            onClick={props.onClick}
        >
            <div className={ `${styles.boxtitle} ${styles.flexCenter}` }>{props.marker.lclas_nm}</div>
            <div className={ `${styles.overlayContent} ${styles.flexCenter}` }>{props.marker.fclty_nm}</div>
        </div>
    );
}

export default CultureMain;