import styles from '../../../assets/css/culture/CultureMain.module.css';
import { useState } from 'react';

// 컴포넌트 객체 생성
import CultureAssetsMain from './CultureAssetsMain';
import CultureAssetsInfo from './CultureAssetsInfo';
import CultureAssetsSearch from './CultureAssetsSearch';

function CulturalAssetsTabSection({
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
    detailContents,
    map,
    setMarkers,
    setRenderKey
}) {
    const [homeRenderKey, setHomeRenderKey] = useState(0);

    const handleSearch = async () => {
        goSearch(`http://localhost:9002/seoul/culture/getCulturalAssetsSearch?name=${encodeURIComponent(searchValue)}`);
    };
    const handleLibraryClick = () => {
        setCurrentSubTabType([false,false,true]);
        setIsClicked(false);
        setIsSearched(false);
        clickMarkerBtn(`http://localhost:9002/seoul/culture/getCulturalAssetsInfo?sort=13`);
    };
    const handleBookStoreClick = () => {
        setCurrentSubTabType([false,true,false]);
        setIsClicked(false);
        setIsSearched(false);
        clickMarkerBtn(`http://localhost:9002/seoul/culture/getCulturalAssetsInfo?sort=12`);
    };
    const handleAssetsClick = () => {
        setCurrentSubTabType([true,false,false]);
        setIsClicked(false);
        setIsSearched(false);
        clickMarkerBtn(`http://localhost:9002/seoul/culture/getCulturalAssetsInfo?sort=11`);
    };
    return (
        <>
            <div className={ styles.cultureBookHeader }>
                <div className={`${styles.cultureBookSearch} ${styles.flexCenter}`} style={{ width: '50%' }}>
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
                    style={{marginRight: '20px', backgroundColor: currentSubTabType[2] ? '#e2e2e2' : ''}}
                    onClick={handleLibraryClick}
                >
                    사적
                </div>
                <div
                    className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`}
                    style={{backgroundColor: currentSubTabType[1] ? '#e2e2e2' : ''}}
                    onClick={handleBookStoreClick}
                >
                    보물
                </div>
                <div
                    className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`}
                    style={{backgroundColor: currentSubTabType[0] ? '#e2e2e2' : ''}}
                    onClick={handleAssetsClick}
                >
                    국보
                </div>
                <div className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`} onClick={() => {setIsClicked(false); setIsSearched(false); setHomeRenderKey(prev => prev + 1);}}>홈</div>
            </div>
            { !isClicked && !isSearched && <CultureAssetsMain key={homeRenderKey}/> }
            { !isClicked && isSearched && <CultureAssetsSearch assetContents={detailContents} map={map} setMarkers={setMarkers} setRenderKey={setRenderKey}/> }
            { isClicked && <CultureAssetsInfo assetContents={detailContents} /> }
        </>
    );
}

export default CulturalAssetsTabSection;