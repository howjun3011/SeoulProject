import styles from '../../assets/css/culture/CultureMain.module.css';

// 카카오맵 마커 생성
import { CustomOverlayMap, MarkerClusterer } from "react-kakao-maps-sdk";

// 컴포넌트 객체 생성
import { useEffect, useState } from 'react';

import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import CultureBookMain from './CultureBookMain';
import CultureBooKStore from './CultureBooKStore';
import CultureBookLibrary from './CultureBookLibrary';
import CultureBookSearch from './CultureBookSearch';

import CultureMuseumMain from './CultureMuseumMain';
import CultureMuseumInfo from './CultureMuseumInfo';
import CultureArtMuseumInfo from './CultureArtMuseumInfo';
import CultureMuseumSearch from './CultureMuseumSearch';

function CultureMain() {
    // 카카오 맵 기본 설정
    const { kakao } = window;
    const [map, setMap] = useState();
    const [markers, setMarkers] = useState([]);

    // CustomOverlayMap z-index 설정
    const [overlayZIndex, setOverlayZIndex] = useState(1);

    // 탭 클릭 이벤트 처리
    const tabNames = ['책', '박물관', '문화재', '공연'];
    const [detailContents, setDetailContents] = useState();
    const [currentTabType, setCurrentTabType] = useState([true, false, false, false]);
    const [isClicked, setIsClicked] = useState(false);

    // 서브탭 클릭 이벤트 처리
    const [currentSubTabType, setCurrentSubTabType] = useState([true, false]);
    const [isSearched, setIsSearched] = useState(false);

    // 마커 처리 함수
    async function clickMarkerBtn(url) {
        const x = await getData(url);

        if (x !== undefined) {setMarkers(x);}
    }


    // 서점과 관련된 데이터를 획득하는 함수
    useEffect(() => {
        clickMarkerBtn(`http://localhost:9002/seoul/culture/getBookData`);
    }, []);

    // 검색 기능
    const searchPlaceholderName = ['국립중앙도서관 소장자료를 검색해보세요.','국립박물관의 소장유물을 검색해보세요.'];
    const [searchPlaceholder, setSearchPlaceholder] = useState(searchPlaceholderName[0]);
    const [searchValue, setSearchValue] = useState('');
    const saveSearchValue = (event) => {setSearchValue(event.target.value);}

    async function goSearch(url) {
        setIsSearched(true);
        const x = await getData(url);
        if (x.result) {setDetailContents(x.result.item);}
        else if (x.response) {setDetailContents(x.response.body.items.item);}
        setIsClicked(false);
    }

    return (
        <div className={ styles.cultureContainer }>
            <CommonMap setMap={ setMap } mapLevel={ 4 }>
                <MarkerClusterer
                    key={markers.length}
                    averageCenter={true}
                    minLevel={6}
                    gridSize={120}
                    minClusterSize={1}
                >
                    {markers.map((marker, index) => {
                        // CustomOverlayMap z-index 설정
                        let customOverlayMap = null;

                        const handleOverlayIndex = (i) => {
                            customOverlayMap.setZIndex(i);
                            setOverlayZIndex(i + 1);
                            setIsClicked(true);
                            setDetailContents(marker);
                        };

                        if (currentTabType[0] && currentSubTabType[0]) {
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
                        } else if (currentTabType[0] && currentSubTabType[1]) {
                            return (
                                <CustomOverlayMap
                                    key={`marker-${marker.lbrry_no}-${index}`}
                                    position={{
                                        lat: marker.lbrry_la,
                                        lng: marker.lbrry_lo,
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
                        } else if (currentTabType[1] && currentSubTabType[0]) {
                            return (
                                <CustomOverlayMap
                                    key={`marker-${marker.id}-${index}`}
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
                        } else if (currentTabType[1] && currentSubTabType[1]) {
                            return (
                                <CustomOverlayMap
                                    key={`marker-${marker.id}-${index}`}
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
                        }
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
                                            setIsClicked(false);
                                            setSearchPlaceholder(searchPlaceholderName[index]);
                                            setIsSearched(false);
                                            setCurrentSubTabType([true,false]);
                                            setSearchValue('');

                                            // 각각의 탭에 따라 마커 설정
                                            if (index === 0) {clickMarkerBtn(`http://localhost:9002/seoul/culture/getBookData`);}
                                            else if (index === 1) {clickMarkerBtn(`http://localhost:9002/seoul/culture/getMuseumInfo`);}
                                            else if (index === 2) {setMarkers([]);}
                                            else if (index === 3) {setMarkers([]);}
                                        }}
                                    >
                                        {tabName}
                                    </div>
                                );
                            })
                        }
                    </div>
                    {
                        currentTabType[0] && <div className={ styles.cultureBookHeader }>
                            <div className={`${styles.cultureBookSearch} ${styles.flexCenter}`}>
                                <button
                                    className={styles.searchBtn}
                                    onClick={async () => {
                                        goSearch(`http://localhost:9002/seoul/culture/getNationalLibrarySearch?kwd=${encodeURIComponent(searchValue)}`);
                                    }}
                                >
                                    <img src="/images/culture/searchBtn.png"
                                        alt="Search Button" height="14px" />
                                </button>
                                <input
                                    className={styles.headerInput}
                                    placeholder={searchPlaceholder}
                                    onClick={() => {
                                        setSearchPlaceholder('');
                                    }}
                                    onBlur={() => {setSearchPlaceholder(searchPlaceholderName[0]);}}
                                    value={searchValue}
                                    onChange={saveSearchValue}
                                    onKeyDown={async (e) => {
                                        if (e.key === "Enter") {
                                            goSearch(`http://localhost:9002/seoul/culture/getNationalLibrarySearch?kwd=${encodeURIComponent(searchValue)}`);
                                        }
                                    }}
                                />
                            </div>
                            <div
                                className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`}
                                style={{
                                    marginRight: '20px',
                                    backgroundColor: currentSubTabType[1] ? '#e2e2e2' : '',
                                }}
                                onClick={() => {
                                    setCurrentSubTabType([false,true]);
                                    setIsClicked(false);
                                    setIsSearched(false);
                                    clickMarkerBtn(`http://localhost:9002/seoul/culture/getBookLibrary`);
                                }}
                            >
                                도서관
                            </div>
                            <div
                                className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`}
                                style={{
                                    backgroundColor: currentSubTabType[0] ? '#e2e2e2' : '',
                                }}
                                onClick={() => {
                                    setCurrentSubTabType([true,false]);
                                    setIsClicked(false);
                                    setIsSearched(false);
                                    clickMarkerBtn(`http://localhost:9002/seoul/culture/getBookData`);
                                }}
                            >
                                서점
                            </div>
                            <div className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`} onClick={() => {setIsClicked(false); setIsSearched(false);}}>홈</div>
                        </div>
                    }
                    { currentTabType[0] && !isClicked && !isSearched && <CultureBookMain /> }
                    { currentTabType[0] && !isClicked && isSearched && <CultureBookSearch bookContents={detailContents} /> }
                    { currentTabType[0] && isClicked && currentSubTabType[0] && <CultureBooKStore bookContents={detailContents} /> }
                    { currentTabType[0] && isClicked && currentSubTabType[1] && <CultureBookLibrary bookContents={detailContents} /> }
                    {
                        currentTabType[1] && <div className={ styles.cultureBookHeader }>
                            <div className={`${styles.cultureBookSearch} ${styles.flexCenter}`}>
                                <button
                                    className={styles.searchBtn}
                                    onClick={async () => {
                                        goSearch(`http://api.kcisa.kr/openapi/service/rest/convergence/conver7?keyword=${encodeURIComponent(searchValue)}&serviceKey=${encodeURIComponent(process.env.REACT_APP_SEARCH_MUSEUM_ITEM_KEY)}&numOfRows=50`);
                                    }}
                                >
                                    <img src="/images/culture/searchBtn.png"
                                        alt="Search Button" height="14px" />
                                </button>
                                <input
                                    className={styles.headerInput}
                                    placeholder={searchPlaceholder}
                                    onClick={() => {
                                        setSearchPlaceholder('');
                                    }}
                                    onBlur={() => {setSearchPlaceholder(setSearchPlaceholder[1]);}}
                                    value={searchValue}
                                    onChange={saveSearchValue}
                                    onKeyDown={async (e) => {
                                        if (e.key === "Enter") {
                                            goSearch(`http://api.kcisa.kr/openapi/service/rest/convergence/conver7?keyword=${encodeURIComponent(searchValue)}&serviceKey=${encodeURIComponent(process.env.REACT_APP_SEARCH_MUSEUM_ITEM_KEY)}&numOfRows=50`);
                                        }
                                    }}
                                />
                            </div>
                            <div
                                className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`}
                                style={{
                                    marginRight: '20px',
                                    backgroundColor: currentSubTabType[1] ? '#e2e2e2' : '',
                                }}
                                onClick={() => {
                                    setCurrentSubTabType([false,true]);
                                    setIsClicked(false);
                                    setIsSearched(false);
                                    clickMarkerBtn(`http://localhost:9002/seoul/culture/getArtMuseumInfo`);
                                }}
                            >
                                미술관
                            </div>
                            <div
                                className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`}
                                style={{
                                    backgroundColor: currentSubTabType[0] ? '#e2e2e2' : '',
                                }}
                                onClick={() => {
                                    setCurrentSubTabType([true,false]);
                                    setIsClicked(false);
                                    setIsSearched(false);
                                    clickMarkerBtn(`http://localhost:9002/seoul/culture/getMuseumInfo`);
                                }}
                            >
                                박물관
                            </div>
                            <div className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`} onClick={() => {setIsClicked(false); setIsSearched(false);}}>홈</div>
                        </div>
                    }
                    { currentTabType[1] && !isClicked && !isSearched && <CultureMuseumMain /> }
                    { currentTabType[1] && !isClicked && isSearched && <CultureMuseumSearch museumContents={detailContents} /> }
                    { currentTabType[1] && isClicked && currentSubTabType[0] && <CultureMuseumInfo museumContents={detailContents} /> }
                    { currentTabType[1] && isClicked && currentSubTabType[1] && <CultureArtMuseumInfo museumContents={detailContents} /> }
                </div>
            </SideTab>
        </div>
    );
}

// 마커 출력 함수
function OverLay(props) {
    if (props.marker.esntl_id !== undefined) {
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
    } else if (props.marker.lbrry_cd !== undefined) {
        return (
            <div
                className={styles.overlaybox}
                style={{
                    filter: props.marker.lbrry_ty_nm === '작은' ? 'opacity(0.8) drop-shadow(0 0 0 #FF9473)' : ''
                }}
                onClick={props.onClick}
            >
                <div className={ `${styles.boxtitle} ${styles.flexCenter}` }>{props.marker.lbrry_ty_nm}도서관</div>
                <div className={ `${styles.overlayContent} ${styles.flexCenter}` }>{props.marker.lbrry_nm}</div>
            </div>
        );
    } else if (props.marker.id !== undefined) {
        return (
            <div
                className={styles.overlaybox}
                style={{
                    filter: props.marker.flag_nm === '공립' ? 'opacity(0.8) drop-shadow(0 0 0 #FF9473)' :
                            props.marker.flag_nm === '사립' ? 'opacity(0.8) drop-shadow(0 0 0 #0064FF)' :
                            props.marker.flag_nm === '대학' ? 'opacity(0.8) drop-shadow(0 0 0 #8AB78A)' : ''
                }}
                onClick={props.onClick}
            >
                <div className={ `${styles.boxtitle} ${styles.flexCenter}` }>{props.marker.flag_nm}{props.marker.mlsfc_nm}</div>
                <div className={ `${styles.overlayContent} ${styles.flexCenter}` }>{props.marker.fclty_nm}</div>
            </div>
        );
    }
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