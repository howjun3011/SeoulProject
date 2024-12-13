import styles from '../../assets/css/culture/CultureMain.module.css';
import { useEffect, useState } from 'react';

// 카카오맵 마커 생성
import { CustomOverlayMap, MarkerClusterer } from "react-kakao-maps-sdk";

// 컴포넌트 객체 생성
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';

import BookTabSection from './book/BookTabSection';
import MuseumTabSection from './museum/MuseumTabSection';
import CulturalAssetsTabSection from './assets/CulturalAssetsTabSection';
import PerformanceTabSection from './performance/PerformanceTabSection';


function CultureMain() {
    // 카카오 맵 기본 설정
    const { kakao } = window;
    const [map, setMap] = useState();
    const [markers, setMarkers] = useState([]);
    const [overlayZIndex, setOverlayZIndex] = useState(1);

    // 탭 클릭 이벤트 처리
    const tabNames = ['책', '박물관', '문화재', '공연'];
    const [detailContents, setDetailContents] = useState();
    const [currentTabType, setCurrentTabType] = useState([true, false, false, false]);
    const [isClicked, setIsClicked] = useState(false);

    // 서브탭 클릭 이벤트 처리
    const [currentSubTabType, setCurrentSubTabType] = useState([true, false]);
    const [isSearched, setIsSearched] = useState(false);
    const [renderKey, setRenderKey] = useState(0);

    // 클러스터 변환시 리렌더링 처리
    const markerClusterKey = `${markers.length}-${renderKey}`;

    // 마커 처리 함수
    async function clickMarkerBtn(url) {
        const x = await getData(url);

        if (x !== undefined && x.item) {setMarkers(x.item);}
        else if (x !== undefined && x.body) {setMarkers(x.body.items.item);}
        else if (x !== undefined) {setMarkers(x);}

        // 마커 클러스터 렌더링
        setRenderKey(prev => prev + 1);
    }

    // 마커 정보에 따라 lat, lng, key를 반환하는 함수
    function getMarkerInfo(marker, index) {
        let lat, lng, uniqueKey;

        if (currentTabType[0] && currentSubTabType[0]) {
            // 책 - 서점
            lat = marker.fclty_la;
            lng = marker.fclty_lo;
            uniqueKey = `marker-bookstore-${marker.content}-${marker.fclty_la},${marker.fclty_lo}-${index}`;
        } else if (currentTabType[0] && currentSubTabType[1]) {
            // 책 - 도서관
            lat = marker.lbrry_la;
            lng = marker.lbrry_lo;
            uniqueKey = `marker-library-${marker.lbrry_no}-${index}`;
        } else if (currentTabType[1]) {
            // 박물관
            lat = marker.fclty_la;
            lng = marker.fclty_lo;

            if (currentSubTabType[0]) {uniqueKey = `marker-museum-${marker.id}-${index}`;}
            else if (currentSubTabType[1]) {uniqueKey = `marker-art-${marker.id}-${index}`;}
        } else if (currentTabType[2]) {
            // 문화재
            lat = marker.latitude;
            lng = marker.longitude;

            if (currentSubTabType[0]) {uniqueKey = `marker-heritage-${marker.ccbaCpno}-${index}`;}
            else if (currentSubTabType[1]) {uniqueKey = `marker-treasure-${marker.ccbaCpno}-${index}`;}
            else if (currentSubTabType[2]) {uniqueKey = `marker-site-${marker.ccbaCpno}-${index}`;}
        } else if (currentTabType[3] && currentSubTabType[0]) {
            // 공연 - 전시공간
            lat = marker.gpsY;
            lng = marker.gpsX;
            uniqueKey = `marker-space-${marker.seq}-${index}`;
        } else if (currentTabType[3] && currentSubTabType[1]) {
            // 공연 - 영화관
            lat = marker.lc_la;
            lng = marker.lc_lo;
            uniqueKey = `marker-movie-${marker.movie_id}-${index}`;
        }

        return { lat, lng, uniqueKey };
    }

    const handleOverlayIndex = async (marker, i) => {
        setOverlayZIndex(i + 1);
        setIsClicked(true);
        if (currentTabType[2]) {
            const x = await getData(`http://localhost:9002/seoul/culture/getCulturalAssetsDetail?sort=${marker.ccbaKdcd}&code=${marker.ccbaAsno}`);
            setDetailContents(x.item);
        } else if (currentTabType[3] && currentSubTabType[0]) {
            const x = await getData(`http://localhost:9002/seoul/culture/getCulturalSpaceDetail?seq=${marker.seq}`);
            setDetailContents(x.body.items.item);
        } else if (currentTabType[3] && currentSubTabType[1]) {
            const x = await getData(`http://localhost:9002/seoul/culture/getCulturalMovieDetailInfo?name=${encodeURIComponent(marker.poi_nm)}&address=${encodeURIComponent(`${marker.ctprvn_nm} ${marker.signgu_nm} ${marker.rdnmadr_nm} ${marker.buld_no}`)}`);
            if (x.result && x.result.name.includes(marker.poi_nm)) {x.result.cl_nm = marker.cl_nm; setDetailContents(x.result);}
            else {setDetailContents(marker);}
        } else {
            setDetailContents(marker);
        }
    };

    // 서점과 관련된 데이터를 획득하는 함수
    useEffect(() => {
        clickMarkerBtn(`http://localhost:9002/seoul/culture/getBookData`);
    }, []);

    // 검색 기능
    const searchPlaceholderName = ['국립중앙도서관 소장자료를 검색해보세요.','국립박물관의 소장유물을 검색해보세요.','서울의 국가 유산을 검색해보세요.','서울의 공연 정보를 검색해보세요.','영화진흥위원회의 영화 정보를 검색해보세요.'];
    const [searchPlaceholder, setSearchPlaceholder] = useState(searchPlaceholderName[0]);
    const [searchValue, setSearchValue] = useState('');
    const saveSearchValue = (event) => {setSearchValue(event.target.value);}

    async function goSearch(url) {
        if(searchValue === '') {alert('검색어를 입력하세요.'); return;}
        
        const x = await getData(url);

        if (x.result) {checkArray(x.result.item);}
        else if (x.response) {checkArray(x.response.body.items.item);}
        else if (x.item) {checkArray(x.item);}
        else if (x.db) {checkArray(x.db);}
        else if (x.movieListResult) {checkArray(x.movieListResult.movieList);}
        else {alert('검색 결과가 없습니다.'); return;}

        setIsSearched(true);
        setIsClicked(false);
    }

    function checkArray(x) {
        if (Array.isArray(x)) {setDetailContents(x)}
        else {setDetailContents([x])}
    }

    return (
        <div className={ styles.cultureContainer }>
            <CommonMap setMap={ setMap } mapLevel={ 4 }>
                <MarkerClusterer
                    key={markerClusterKey}
                    averageCenter={true}
                    minLevel={6}
                    gridSize={120}
                    minClusterSize={1}
                >
                    {markers.map((marker, index) => {
                        // CustomOverlayMap z-index 설정
                        let customOverlayMap = null;

                        // 마커의 위도 및 경도 정보 획득
                        const { lat, lng, uniqueKey } = getMarkerInfo(marker, index);

                        return (
                            <CustomOverlayMap
                                key={uniqueKey}
                                position={{lat: lat, lng: lng,}}
                                zIndex={0}
                                onCreate={(x) => {customOverlayMap = x;}}
                            >
                                <OverLay
                                    marker={marker}
                                    onClick={() => {if(customOverlayMap) {customOverlayMap.setZIndex(overlayZIndex);} handleOverlayIndex(marker, overlayZIndex);}}
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
                                            // 상위 탭 변경
                                            let temp = [false, false, false, false];
                                            temp[index] = true;
                                            setCurrentTabType(temp);

                                            // 공통 초기화
                                            setIsSearched(false);
                                            setIsClicked(false);
                                            setSearchPlaceholder(searchPlaceholderName[index]);
                                            setSearchValue('');

                                            // 각각의 탭에 따라 마커 설정
                                            if (index === 0) {clickMarkerBtn(`http://localhost:9002/seoul/culture/getBookData`); setCurrentSubTabType([true,false]);}
                                            else if (index === 1) {clickMarkerBtn(`http://localhost:9002/seoul/culture/getMuseumInfo`); setCurrentSubTabType([true,false]);}
                                            else if (index === 2) {clickMarkerBtn(`http://localhost:9002/seoul/culture/getCulturalAssetsInfo?sort=11`); setCurrentSubTabType([true,false,false]);}
                                            else if (index === 3) {clickMarkerBtn(`http://localhost:9002/seoul/culture/getCulturalSpaceInfo`); setCurrentSubTabType([true,false]);}
                                        }}
                                    >
                                        {tabName}
                                    </div>
                                );
                            })
                        }
                    </div>
                    {currentTabType[0] && (
                        <BookTabSection
                            currentSubTabType={currentSubTabType}
                            setCurrentSubTabType={setCurrentSubTabType}
                            isClicked={isClicked}
                            setIsClicked={setIsClicked}
                            isSearched={isSearched}
                            setIsSearched={setIsSearched}
                            searchPlaceholder={searchPlaceholder}
                            setSearchPlaceholder={setSearchPlaceholder}
                            searchPlaceholderName={searchPlaceholderName}
                            searchValue={searchValue}
                            saveSearchValue={saveSearchValue}
                            goSearch={goSearch}
                            clickMarkerBtn={clickMarkerBtn}
                            detailContents={detailContents}
                        />
                    )}
                    {currentTabType[1] && (
                        <MuseumTabSection
                            currentSubTabType={currentSubTabType}
                            setCurrentSubTabType={setCurrentSubTabType}
                            isClicked={isClicked}
                            setIsClicked={setIsClicked}
                            isSearched={isSearched}
                            setIsSearched={setIsSearched}
                            searchPlaceholder={searchPlaceholder}
                            setSearchPlaceholder={setSearchPlaceholder}
                            searchPlaceholderName={searchPlaceholderName}
                            searchValue={searchValue}
                            saveSearchValue={saveSearchValue}
                            goSearch={goSearch}
                            clickMarkerBtn={clickMarkerBtn}
                            detailContents={detailContents}
                        />
                    )}
                    {currentTabType[2] &&  (
                        <CulturalAssetsTabSection
                            currentSubTabType={currentSubTabType}
                            setCurrentSubTabType={setCurrentSubTabType}
                            setIsClicked={setIsClicked}
                            setIsSearched={setIsSearched}
                            searchPlaceholder={searchPlaceholder}
                            setSearchPlaceholder={setSearchPlaceholder}
                            searchPlaceholderName={searchPlaceholderName}
                            searchValue={searchValue}
                            saveSearchValue={saveSearchValue}
                            goSearch={goSearch}
                            clickMarkerBtn={clickMarkerBtn}
                            detailContents={detailContents}
                            isClicked={isClicked}
                            isSearched={isSearched}
                            map={map}
                            setMarkers={setMarkers}
                            setRenderKey={setRenderKey}
                        />
                    )}
                    {currentTabType[3] && (
                        <PerformanceTabSection
                            currentSubTabType={currentSubTabType}
                            setCurrentSubTabType={setCurrentSubTabType}
                            setIsClicked={setIsClicked}
                            setIsSearched={setIsSearched}
                            searchPlaceholder={searchPlaceholder}
                            setSearchPlaceholder={setSearchPlaceholder}
                            searchPlaceholderName={searchPlaceholderName}
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            saveSearchValue={saveSearchValue}
                            goSearch={goSearch}
                            clickMarkerBtn={clickMarkerBtn}
                            detailContents={detailContents}
                            isClicked={isClicked}
                            isSearched={isSearched}
                        />
                    )}
                </div>
            </SideTab>
        </div>
    );
}

// 필터 스타일 추출 함수
function getFilterStyleForMarker(marker) {
    if (marker.esntl_id !== undefined) {
        const { lclas_nm } = marker;
        if (lclas_nm === '독립서점') return 'opacity(0.8) drop-shadow(0 0 0 #FF9473)';
        if (lclas_nm === '북카페') return 'opacity(0.8) drop-shadow(0 0 0 #0064FF)';
        if (lclas_nm === '만화방') return 'opacity(0.8) drop-shadow(0 0 0 #8AB78A)';
        return '';
    } else if (marker.lbrry_cd !== undefined) {
        return marker.lbrry_ty_nm === '작은' ? 'opacity(0.8) drop-shadow(0 0 0 #FF9473)' : '';
    } else if (marker.id !== undefined) {
        const { flag_nm } = marker;
        if (flag_nm === '공립') return 'opacity(0.8) drop-shadow(0 0 0 #FF9473)';
        if (flag_nm === '사립') return 'opacity(0.8) drop-shadow(0 0 0 #0064FF)';
        if (flag_nm === '대학') return 'opacity(0.8) drop-shadow(0 0 0 #8AB78A)';
        return '';
    } else if (marker.sn !== undefined) {
        const { ccmaName } = marker;
        if (ccmaName === '국보') return 'opacity(0.8) drop-shadow(0 0 0 #FF9473)';
        if (ccmaName === '보물') return 'opacity(0.8) drop-shadow(0 0 0 #0064FF)';
        if (ccmaName === '사적') return 'opacity(0.8) drop-shadow(0 0 0 #8AB78A)';
        return '';
    } else if (marker.seq !== undefined) {
        return marker.culGrpName === '공연장' ? 'opacity(0.8) drop-shadow(0 0 0 #8AB78A)' : '';
    } else if (marker.movie_id !== undefined) {
        const { cl_nm } = marker;
        if (cl_nm === 'CGV') return 'opacity(0.8) drop-shadow(0 0 0 #FF9473)';
        if (cl_nm === '롯데시네마') return 'opacity(0.8) drop-shadow(0 0 0 #0064FF)';
        if (cl_nm === '메가박스') return 'opacity(0.8) drop-shadow(0 0 0 #8AB78A)';
        return '';
    } else {
        return '';
    }
}

// 마커 출력 함수
function OverLay({ marker, onClick }) {
    const filterStyle = getFilterStyleForMarker(marker);

    let title = '';
    let content = '';

    if (marker.esntl_id !== undefined) {
        title = marker.lclas_nm;
        content = marker.fclty_nm;
    } else if (marker.lbrry_cd !== undefined) {
        title = `${marker.lbrry_ty_nm}도서관`;
        content = marker.lbrry_nm;
    } else if (marker.id !== undefined) {
        title = `${marker.flag_nm}${marker.mlsfc_nm}`;
        content = marker.fclty_nm;
    } else if (marker.sn !== undefined) {
        title = `${marker.ccmaName}(${marker.ccsiName})`;
        content = marker.ccbaMnm1;
    } else if (marker.seq !== undefined) {
        title = marker.culGrpName;
        content = marker.culName;
    } else if (marker.movie_id !== undefined) {
        title = marker.cl_nm;
        content = marker.poi_nm;
    }

    return (
        <div
            className={styles.overlaybox}
            style={{ filter: filterStyle }}
            onClick={onClick}
        >
            <div className={`${styles.boxtitle} ${styles.flexCenter}`}>{title}</div>
            <div className={`${styles.overlayContent} ${styles.flexCenter}`}>{content}</div>
        </div>
    );
}

// 데이터 획득 함수
async function getData(url) {
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET'
    });
    const data = await response.json();
    return data;
}

export default CultureMain;