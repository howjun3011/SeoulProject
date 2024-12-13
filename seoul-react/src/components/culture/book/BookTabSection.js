import styles from '../../../assets/css/culture/CultureMain.module.css';
import { useState } from 'react';

// 컴포넌트 객체 생성
import CultureBookMain from './CultureBookMain';
import CultureBooKStore from './CultureBooKStore';
import CultureBookLibrary from './CultureBookLibrary';
import CultureBookSearch from './CultureBookSearch';

function BookTabSection({
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
        goSearch(`http://localhost:9002/seoul/culture/getNationalLibrarySearch?kwd=${encodeURIComponent(searchValue)}`);
    };
    const handleLibraryClick = () => {
        setCurrentSubTabType([false,true]);
        setIsClicked(false);
        setIsSearched(false);
        clickMarkerBtn(`http://localhost:9002/seoul/culture/getBookLibrary`);
    };
    const handleBookStoreClick = () => {
        setCurrentSubTabType([true,false]);
        setIsClicked(false);
        setIsSearched(false);
        clickMarkerBtn(`http://localhost:9002/seoul/culture/getBookData`);
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
                        onBlur={() => {setSearchPlaceholder(searchPlaceholderName[0]);}}
                        value={searchValue}
                        onChange={saveSearchValue}
                        onKeyDown={(e) => {
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
                    도서관
                </div>
                <div
                    className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`}
                    style={{backgroundColor: currentSubTabType[0] ? '#e2e2e2' : ''}}
                    onClick={handleBookStoreClick}
                >
                    서점
                </div>
                <div className={`${ styles.cultureBookHeaderBtn } ${ styles.flexCenter }`} onClick={() => {setIsClicked(false); setIsSearched(false); setHomeRenderKey(prev => prev + 1);}}>홈</div>
            </div>
            { !isClicked && !isSearched && <CultureBookMain key={homeRenderKey}/> }
            { !isClicked && isSearched && <CultureBookSearch bookContents={detailContents} /> }
            { isClicked && currentSubTabType[0] && <CultureBooKStore bookContents={detailContents} /> }
            { isClicked && currentSubTabType[1] && <CultureBookLibrary bookContents={detailContents} /> }
        </>
    );
}

export default BookTabSection;