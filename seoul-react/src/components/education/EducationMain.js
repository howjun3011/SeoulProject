import styles from '../../assets/css/education/EduMain.module.css';
import { useEffect, useState, useRef } from 'react';
import { MapMarker } from "react-kakao-maps-sdk"; // CustomOverlayMap 제거
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import axios from 'axios';

// Pagination 컴포넌트 (변경 없음)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    // 페이지 그룹 관련 변수 설정
    const pageSize = 5;
    const totalGroups = Math.ceil(totalPages / pageSize);
    const currentGroup = Math.ceil(currentPage / pageSize);
    const startPage = (currentGroup - 1) * pageSize + 1;
    const endPage = Math.min(startPage + pageSize - 1, totalPages);

    // 페이지 번호 버튼 렌더링
    const pageButtons = [];
    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
            <button
                key={i}
                className={`${styles.pageButton} ${currentPage === i ? styles.activePage : ''}`}
                onClick={() => onPageChange(i)}
                disabled={currentPage === i}
            >
                {i}
            </button>
        );
    }

    return (
        <div className={styles.pagination}>
            {/* 이전 그룹으로 이동 */}
            {currentGroup > 1 && (
                <button
                    className={styles.pageButton}
                    onClick={() => onPageChange((currentGroup - 2) * pageSize + 1)}
                >
                    &lt;&lt;
                </button>
            )}
            {/* 이전 페이지로 이동 */}
            <button
                className={styles.pageButton}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                &lt;
            </button>
            {/* 페이지 번호 버튼 */}
            {pageButtons}
            {/* 다음 페이지로 이동 */}
            <button
                className={styles.pageButton}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
            {/* 다음 그룹으로 이동 */}
            {currentGroup < totalGroups && (
                <button
                    className={styles.pageButton}
                    onClick={() => onPageChange(currentGroup * pageSize + 1)}
                >
                    &gt;&gt;
                </button>
            )}
        </div>
    );
};

// KindergartenList 컴포넌트 (변경 없음)
function KindergartenList({ results, error, page, setPage, totalPages }) {

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className={styles.kinderResultListBox}>
            <h3>조회 결과 : {results.total || 0}건</h3>
            {error && <div className={styles.error}>{error}</div>}
            {results.items && results.items.length > 0 ? (
                <div className={styles.kinderResultPageing}>
                    <ul className={styles.kinderResultList}>
                        {results.items.map((item, index) => (
                            <li key={index} className={styles.resultItem}>
                                <h4>{item.kindergarten_name}</h4>
                                <p>{item.address}</p>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.footPage}>
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            ) : (
                <p>조회 결과가 없습니다.</p>
            )}
        </div>
    );
}

// EduSearchBox 컴포넌트 (변경 없음)
function EduSearchBox({ onSearch, selectedItems, setSelectedItems, error, query, setQuery }){

    const options = [
        "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구",
        "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구",
        "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구",
        "은평구", "종로구", "중구", "중랑구",
    ];

    const handleSelect = (event) => {
        const value = event.target.value;
        if (selectedItems.includes(value)) {
            alert("이미 선택된 항목입니다.");
            return;
        }
        if (selectedItems.length >= 4) {
            alert("최대 4개까지 선택할 수 있습니다.");
            return;
        }
        const updatedItems = [...selectedItems, value];
        setSelectedItems(updatedItems);
        onSearch(query, updatedItems);
    };

    const handleRemove = (item) => {
        const updatedItems = selectedItems.filter((selected) => selected !== item);
        setSelectedItems(updatedItems);
        onSearch(query, updatedItems); // 선택된 지역이 변경되었으므로 검색 결과 갱신
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query, selectedItems); // handleSearch에서 페이지를 1로 초기화함
    };
    
    const handleQueryChange = (event) => {
        setQuery(event.target.value);
    };

    return (
        <div className={styles.searchBox}>
            <form onSubmit={handleSubmit}>
                <select onChange={handleSelect} defaultValue="">
                    <option value="" disabled>지역선택</option>
                    {options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <input
                    type="text"
                    className={styles.searchInput}
                    name="searchQuery"
                    id="searchQuery"
                    placeholder="유치원 검색"
                    value={query}
                    onChange={handleQueryChange}
                />
                <input type="submit" value="검색" />
            </form>
            <div className={styles.selectedItems}>
                {selectedItems.map((item, index) => (
                    <div key={index} className={styles.selectedItem}>
                        {item}
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => handleRemove(item)}
                        >
                            x
                        </button>
                    </div>
                ))}
            </div>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
}

function EducationMain() {
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([]);
    const educationCategories = ["유치원", "키즈카페", "유원시설"];
    const [currentTabType, setCurrentTabType] = useState([true, false, false]);

    const [query, setQuery] = useState("");
    const [areas, setAreas] = useState([]);
    const [results, setResults] = useState({
        items: [],
        total: 0,
        searchVO: {
            totPage: 1
        }
    });
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    // selectedMarkerIndex 상태 제거

    const fetchData = async (query, areas, page = 1) => {
        try {
            const response = await axios.get('http://localhost:9002/seoul/education/eduGardenSearch', {
                params: {
                    query,
                    areas: areas.join(","),
                    page,
                },
            });
            setResults(response.data);
            
            // 마커 생성
            const multiMarker = response.data.items
            .filter(item => item.x_coordinate && item.y_coordinate)
            .map((item, index) => ({
                position: {
                    lat: parseFloat(item.y_coordinate),
                    lng: parseFloat(item.x_coordinate)
                },
                content: item.kindergarten_name || "오류",
                category: item.address || "오류",
                index: index
            }));
            setMarkers(multiMarker);
            setError("");
        } catch (err) {
            console.error("데이터 로드 오류:", err);
            setError("데이터 불러오기 중 오류 발생");
        }
    };

    const handleSearch = (searchQuery, selectedAreas) => {
        setQuery(searchQuery);
        setAreas(selectedAreas);
        setPage(1);
        fetchData(searchQuery, selectedAreas, 1);
    };

    useEffect(() => {
        if (areas.length > 0 || query) {
            fetchData(query, areas, page);
        }
    }, [query, areas, page]);

    return (
        <div className={styles.educationContainer}>
            <CommonMap 
                setMap={(map) => { mapRef.current = map; }} 
                mapLevel={4}
                // onClick 제거 (오버레이 관련)
            >
                {markers.map((marker, index) => (
                    <MapMarker
                        key={`marker-${index}`}
                        position={marker.position}
                        clickable={true}
                        // onClick 제거 (오버레이 관련)
                    >
                        {/* 필요시 툴팁이나 간단한 정보 표시를 위해 MapMarker 내부에 내용 추가 가능 */}
                        <div className={styles.markerInfo}>
                            <h4>{marker.content}</h4>
                            <p>{marker.category}</p>
                        </div>
                    </MapMarker>
                ))}
            </CommonMap>
            <SideTab>
                <div className={styles.educationTab}>
                    {educationCategories.map((category, index) => (
                        <div
                            key={category}
                            className={`${styles.tab} ${currentTabType[index] ? styles.active : ''}`}
                            onClick={() => {
                                const newTabType = Array(educationCategories.length).fill(false);
                                newTabType[index] = true;
                                setCurrentTabType(newTabType);
                            }}
                        >
                            {category}
                        </div>
                    ))}
                </div>
                <div className={styles.searchBox}>
                    <EduSearchBox
                        onSearch={handleSearch}
                        selectedItems={areas}
                        setSelectedItems={setAreas}
                        query={query}
                        setQuery={setQuery}
                    /><br/>
                    <KindergartenList 
                        results={results} 
                        error={error} 
                        page={page}
                        setPage={setPage}
                        totalPages={results.searchVO.totPage}
                    />
                </div>
            </SideTab>
        </div>
    );
}

export default EducationMain;
