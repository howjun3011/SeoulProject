import styles from '../../../assets/css/culture/CultureMain.module.css';
import { useState } from 'react';

// 컴포넌트 객체 생성
import CultureMuseumMain from './CultureMuseumMain';
import CultureMuseumInfo from './CultureMuseumInfo';
import CultureArtMuseumInfo from './CultureArtMuseumInfo';
import CultureMuseumSearch from './CultureMuseumSearch';

function MuseumTabSection({
    currentSubTabType,
    setCurrentSubTabType,
    isClicked,
    setIsClicked,
    isSearched,
    setIsSearched,
    searchPlaceholder,
    setSearchPlaceholder,
    searchPlaceholderName,
    searchValue,
    saveSearchValue,
    goSearch,
    clickMarkerBtn,
    detailContents
}) {
    const [homeRenderKey, setHomeRenderKey] = useState(0);

    const handleSearch = async () => {
        goSearch(`http://api.kcisa.kr/openapi/service/rest/convergence/conver7?keyword=${encodeURIComponent(searchValue)}&serviceKey=${encodeURIComponent(process.env.REACT_APP_SEARCH_MUSEUM_ITEM_KEY)}&numOfRows=50`);
    };
    const handleLibraryClick = () => {
        setCurrentSubTabType([false,true]);
        setIsClicked(false);
        setIsSearched(false);
        clickMarkerBtn(`http://localhost:9002/seoul/culture/getArtMuseumInfo`);
    };
    const handleBookStoreClick = () => {
        setCurrentSubTabType([true,false]);
        setIsClicked(false);
        setIsSearched(false);
        clickMarkerBtn(`http://localhost:9002/seoul/culture/getMuseumInfo`);
    };
    return (
        <>
            <div className={ styles.cultureBookHeader }>
                <div className={`${styles.cultureBookSearch} ${styles.flexCenter}`}>
                    <button className={styles.searchBtn} onClick={handleSearch}>
                        <img src="/images/culture/searchBtn.png" alt="Search Button" height="14px" />
                    </button>
                    <input
                        className={styles.headerInput}
                        placeholder={searchPlaceholder}
                        onClick={() => {setSearchPlaceholder('');}}
                        onBlur={() => {setSearchPlaceholder(searchPlaceholderName[1]);}}
                        value={searchValue}
                        onChange={saveSearchValue}
                        onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                </div>
                <div
                    className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`}
                    style={{marginRight: '20px', backgroundColor: currentSubTabType[1] ? '#e2e2e2' : ''}}
                    onClick={handleLibraryClick}
                >
                    미술관
                </div>
                <div
                    className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`}
                    style={{backgroundColor: currentSubTabType[0] ? '#e2e2e2' : ''}}
                    onClick={handleBookStoreClick}
                >
                    박물관
                </div>
                <div className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`} onClick={() => {setIsClicked(false); setIsSearched(false); setHomeRenderKey(prev => prev + 1);}}>홈</div>
            </div>
            { !isClicked && !isSearched && <CultureMuseumMain key={homeRenderKey}/> }
            { !isClicked && isSearched && <CultureMuseumSearch museumContents={detailContents} /> }
            { isClicked && currentSubTabType[0] && <CultureMuseumInfo museumContents={detailContents} /> }
            { isClicked && currentSubTabType[1] && <CultureArtMuseumInfo museumContents={detailContents} /> }
        </>
    );
}

export default MuseumTabSection;