import styles from '../../../assets/css/culture/CultureMain.module.css';

// 컴포넌트 객체 생성
import CultureSpaceMain from './CultureSpaceMain';
import CultureSpaceInfo from './CultureSpaceInfo';
import CultureMovieInfo from './CultureMovieInfo';
import CulturePerformSearch from './CulturePerformSearch';
import CultureMovieSearch from './CultureMovieSearch';

function PerformanceTabSection({
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
    const handleSearch = async () => {
        if (currentSubTabType[0]) {
            goSearch(`http://localhost:9002/seoul/culture/getCulturalPerformanceInfo?q=${encodeURIComponent(searchValue)}`);
        } else {
            goSearch(`http://localhost:9002/seoul/culture/getCulturalMovieSearch?q=${encodeURIComponent(searchValue)}`);
        }
    };
    const handleLibraryClick = () => {
        setCurrentSubTabType([false,true]);
        setIsClicked(false);
        setIsSearched(false);
        setSearchPlaceholder(searchPlaceholderName[4]);
        clickMarkerBtn(`http://localhost:9002/seoul/culture/getMovieInfo`);
    };
    const handleBookStoreClick = () => {
        setCurrentSubTabType([true,false]);
        setIsClicked(false);
        setIsSearched(false);
        setSearchPlaceholder(searchPlaceholderName[3]);
        clickMarkerBtn(`http://localhost:9002/seoul/culture/getCulturalSpaceInfo`);
    };
    return (
        <>
            <div className={ styles.cultureBookHeader }>
                <div className={`${styles.cultureBookSearch} ${styles.flexCenter}`} style={{ width: '58%' }}>
                    <button className={styles.searchBtn} onClick={handleSearch}>
                        <img src="/images/culture/searchBtn.png" alt="Search Button" height="14px" />
                    </button>
                    <input
                        className={styles.headerInput}
                        placeholder={searchPlaceholder}
                        onClick={() => {setSearchPlaceholder('');}}
                        onBlur={() => {
                            if (currentSubTabType[0]) {setSearchPlaceholder(searchPlaceholderName[3]);}
                            else {setSearchPlaceholder(searchPlaceholderName[4]);}
                        }}
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
                    영화관
                </div>
                <div
                    className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`}
                    style={{backgroundColor: currentSubTabType[0] ? '#e2e2e2' : ''}}
                    onClick={handleBookStoreClick}
                >
                    공연장
                </div>
                <div className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`} onClick={() => {setIsClicked(false); setIsSearched(false);}}>홈</div>
            </div>
            { !isClicked && !isSearched && <CultureSpaceMain /> }
            { !isClicked && isSearched && currentSubTabType[0] && <CulturePerformSearch spaceContents={detailContents} /> }
            { !isClicked && isSearched && currentSubTabType[1] && <CultureMovieSearch spaceContents={detailContents} /> }
            { isClicked && currentSubTabType[0] && <CultureSpaceInfo spaceContents={detailContents} /> }
            { isClicked && currentSubTabType[1] && <CultureMovieInfo spaceContents={detailContents} /> }
        </>
    );
}

export default PerformanceTabSection;