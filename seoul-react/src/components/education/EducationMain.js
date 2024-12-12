import { useEffect, useState, useRef } from 'react';
import { MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk"; // CustomOverlayMap 제거
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import axios from 'axios';
import styles from '../../assets/css/education/EduMain.module.css';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Chart.js 요소
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

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

function KindergartenList({selectedFilters, currentTabType, results, error, page, setPage, totalPages, fetchData, query, areas, onSelect }) {

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchData(selectedFilters, query, areas, newPage);
    };
    const kinder = (item, index) =>{
        if(currentTabType?.[0]){
            return(
                <li
                key={index} 
                className={styles.resultItem}
                onClick={() => onSelect(item)}
            >
                <h4>{item.kindergarten_name}</h4>
                <p>{item.address}</p>
            </li>
            )
        } else if(currentTabType?.[1]) {
            return(
                <li
                key={index} 
                className={styles.resultItem}
                onClick={() => onSelect(item)}
            >
                <h4>{item.center_name}</h4>
                <p>{item.address}</p>
            </li>
            )
        } else if(currentTabType?.[2]) {
            return(
                <li
                key={index} 
                className={styles.resultItem}
                onClick={() => onSelect(item)}
            >
                <h4>{item.facility_name}</h4>
                <p>{item.address}</p>
            </li>
            )
        };
        return null;
    }

    return (
        <div className={styles.kinderResultListBox}>
            <h3>조회 결과 : {results.total || 0}건</h3>
            {error && <div className={styles.error}>{error}</div>}
            {results.items && results.items.length > 0 ? (
                <div className={styles.kinderResultPageing}>
                    <ul className={styles.kinderResultList}>
                        {results.items.map((item, index) => (
                            kinder(item,index)
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

function EduSearchBox({selectedFilters, setSelectedFilters, currentTabType, setPage, setMarkers, setSelectedDetailInfo, onSearch, selectedItems, setSelectedItems, error, query, setQuery, setResults, setError }){

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
    const handleFilterChange = (event) => {
        const value = event.target.value;
        let updatedFilters = [...selectedFilters];
        if(updatedFilters.includes(value)){
            updatedFilters = updatedFilters.filter(filter => filter !== value);
        } else {
            updatedFilters.push(value);
        }
        setSelectedFilters(updatedFilters);
    }
    const filtering = () => {
        if(currentTabType[0]) {
            return <>
                <label className={styles.filter_label}>
                    <input 
                        type="checkbox" 
                        name="filters" 
                        value="bus" 
                        onChange={handleFilterChange}
                        checked={selectedFilters.includes("bus")}
                    />
                    버스운행
                </label>
                <label className={styles.filter_label}>
                    <input 
                        type="checkbox" 
                        name="filters" 
                        value="special" 
                        onChange={handleFilterChange}
                        checked={selectedFilters.includes("special")}
                    />
                    특수학급
                </label>
                <label className={styles.filter_label}>
                    <input 
                        type="checkbox" 
                        name="filters" 
                        value="endTime" 
                        onChange={handleFilterChange}
                        checked={selectedFilters.includes("endTime")}
                    />
                    19시이상
                </label>
            </>
        } else if(currentTabType[1]) {
            return <>
                <label className={styles.filter_label}>
                    <input 
                        type="checkbox" 
                        name="filters" 
                        value="localCenter" 
                        onChange={handleFilterChange}
                        checked={selectedFilters.includes("localCenter")}
                    />
                    지역아동센터
                </label>
                <label className={styles.filter_label}>
                    <input 
                        type="checkbox" 
                        name="filters" 
                        value="bringCenter" 
                        onChange={handleFilterChange}
                        checked={selectedFilters.includes("bringCenter")}
                    />
                    키움센터
                </label>
            </>
        } else if(currentTabType[2]) {
            return <>
                <label className={styles.filter_label}>
                    <input 
                        type="checkbox" 
                        name="filters" 
                        value="kidsCafe" 
                        onChange={handleFilterChange}
                        checked={selectedFilters.includes("bus")}
                    />
                    버스운행
                </label>
                <label className={styles.filter_label}>
                    <input 
                        type="checkbox" 
                        name="filters" 
                        value="facility" 
                        onChange={handleFilterChange}
                        checked={selectedFilters.includes("bus")}
                    />
                    버스운행
                </label>
            </>
        };
    };

    const handleRemove = (item) => {
        const updatedItems = selectedItems.filter((selected) => selected !== item);
        setSelectedItems(updatedItems);
        setPage(1);
        if (updatedItems.length === 0) {
            // 선택된 지역이 없을 때 결과 초기화 및 에러 메시지 설정
            setResults({
                items: [],
                total: 0,
                searchVO: {
                    totPage: 1,
                },
            });
            setMarkers([]);
            setSelectedDetailInfo({});
            setError("지역선택 또는 검색어를 입력하세요.");
        } else if (query !== "") {
            // 남아있는 지역이 있고 검색어가 존재할 때 검색 결과 갱신
            onSearch(query, updatedItems);
            setError(""); // 에러 메시지 초기화
        }
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query, selectedItems); // handleSearch에서 페이지를 1로 초기화함
    };
    
    const handleQueryChange = (event) => {
        setQuery(event.target.value);
        setPage(1)
    };

    return (
        <div className={styles.searchBox}>
            <div className={styles.searchLine}>
                <form onSubmit={handleSubmit}>
                    <select onChange={handleSelect} value="">
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
                        placeholder="시설이름 입력"
                        value={query}
                        onChange={handleQueryChange}
                    />
                    <input className={styles.searchBtn} type="submit" value="검색" />
                </form>
            </div>
            <div className={styles.filterBox}>
                {filtering()}
            </div>
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

function Infotab({currentTabType, searchInfo, isVisible, setIsVisible }) {

    const closeInfoButton = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const chartData = [
        [
            searchInfo.class_count_3, 
            searchInfo.class_count_4, 
            searchInfo.class_count_5, 
            searchInfo.class_count_mix,
            searchInfo.class_count_special
        ],
        [
            searchInfo.students_now_3,
            searchInfo.students_now_4,
            searchInfo.students_now_5,
            searchInfo.students_now_mix,
            searchInfo.students_now_special
        ],
        [
            (searchInfo.students_total_count/searchInfo.total_teacher_count).toFixed(1),
            (searchInfo.students_total_count/(
                searchInfo.class_count_3+
                searchInfo.class_count_4+
                searchInfo.class_count_5+
                searchInfo.class_count_mix+
                searchInfo.class_count_special
            )).toFixed(1),
        ],
        [
            searchInfo.area_classroom,
            searchInfo.area_gym,
            searchInfo.area_clean,
            searchInfo.area_cook,
            searchInfo.area_etc
        ],
        
    ];
    
    const chartLabels = [
        ["만 3세반","만 4세반","만 5세반","혼합반","특수학급"],
        ["만 3세반","만 4세반","만 5세반","혼합반","특수학급"],
        ["교사당 유아수","학급당 유아수"],
        ["교실면적", "실내체육장","보건/위생공간","조리/급식실","기타공간"],
    ];
    const chartLabel =[
        "학급수(개)",
        "유아수(명)",
        "교사당/학급당 유아수(명)",
        "면적(㎡)",
    ];
    const rowSums = chartData.map(row => 
        row.reduce((sum, value) => sum + (value || 0), 0) // null이나 undefined를 0으로 처리
    );
    const backCol = (data) => {
        const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#8ee10b"];
        return data.map((value, index) => {
            if (value === 0 || value === null) {
                return "#ddd"; // 회색 처리
            }
            return colors[index % colors.length]; // 색상을 순환하여 적용
        });
    };
    
    const createChartData = (labels, label, data) => ({
        labels,
        datasets: [
            {
                label,
                data,
                backgroundColor: backCol(data),
            },
        ],
    });
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false, // 고정된 높이를 사용하기 위해 false로 설정
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    display: false // X축의 그리드 라인을 제거
                },
                title: {
                    display: false,
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                },
                title: {
                    display: false,
                },
                ticks:{
                    display: false,
                },
            }
        },
        plugins: {
            legend: {
                display: false,
                position: "bottom",
            },
        },
    };
    
    
    //chart opition
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
                position: "bottom",
            },
        },
    };
    console.log("searchInfo 인포탭", searchInfo);
    const kinder = () =>{
        if(currentTabType?.[0]) {
            return(
                <>
                <div className={styles.infoBackground0}>
                    <button
                        type="button"
                        className={styles.closeInfoButton}
                        onClick={() => closeInfoButton()}
                    >
                        x
                    </button>
                    <div className={styles.infoBaseBox}>
                        <div className={styles.infoBaseTitle}>
                            <h2 className={styles.semiTitle}>
                                기본정보
                            </h2>
                            <ul className={styles.infoBaseUl}>
                                <li className={styles.infoBaseLi}>
                                    <i>유치원이름</i>
                                    <span><a href={"https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query="+searchInfo.kindergarten_name} target="_blank" rel="noopener noreferrer">{searchInfo.kindergarten_name}</a></span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>전화번호</i>
                                    <span>{searchInfo.tel}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>운영시간</i>
                                    <span>{searchInfo.operating_hours}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>대표자명</i>
                                    <span>{searchInfo.hearder}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>원장명</i>
                                    <span>{searchInfo.director}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>설립일</i>
                                    <span>{searchInfo.birth}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>개원일</i>
                                    <span>{searchInfo.start}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>관할기관</i>
                                    <span>{searchInfo.office_education}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>주소</i>
                                    <span>{searchInfo.address}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>홈페이지</i>
                                    <span><a href={searchInfo.home_page} target="_blank" rel="noopener noreferrer">
                                        {searchInfo.home_page}
                                    </a></span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>통학차량</i>
                                    <span>{searchInfo.car_check}</span>
                                </li>
                            </ul>
                        </div>
                        <br/>
                        <div className={styles.infoBaseTitle}>
                            <h2 className={styles.semiTitle}>
                                현황
                            </h2>
                            <div className={styles.infoChartBox}>
                                {chartData.map((data, chartIndex) => (
                                    <div key={chartIndex} className={styles.cycleChart}>
                                        <h4>{chartLabel[chartIndex]}</h4> {/* 차트별 제목 */}
                                        {chartIndex === 2 ? (
                                            <Bar
                                                data={createChartData(chartLabels[chartIndex], chartLabel[chartIndex], chartData[chartIndex])}
                                                options={barChartOptions}
                                                height={700}
                                            />
                                        ) : (
                                            <Doughnut
                                                data={createChartData(chartLabels[chartIndex], chartLabel[chartIndex], chartData[chartIndex])}
                                                options={chartOptions}
                                            />
                                        )}
                                        <ul className={styles.legendList}>
                                            {chartLabels[chartIndex].map((label, index) => (
                                                
                                                <li key={index} className={styles.legendItem}>
                                                    <span
                                                        className={styles.legendCol}
                                                        style={{
                                                            backgroundColor: backCol(chartData[chartIndex])[index], // 해당 차트의 색상
                                                        }}
                                                    ></span>
                                                    <span 
                                                        className={styles.legendText}
                                                        style={chartData[chartIndex][index] === 0 ? {color: "#bbb"} : {}}
                                                    >
                                                        {label}: {chartData[chartIndex][index] || "0"}
                                                    </span> 
                                                    {chartData[chartIndex][index] === 0 || chartIndex === 2
                                                        ? '' 
                                                        : `${(chartData[chartIndex][index] / rowSums[chartIndex] * 100).toFixed(1)}%`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </>
            )
        } else if(currentTabType?.[1]) {
            return(
                <>
                <div className={styles.infoBackground1}>
                    <button
                        type="button"
                        className={styles.closeInfoButton}
                        onClick={() => closeInfoButton()}
                    >
                        x
                    </button>
                    <div className={styles.infoBaseBox}>
                        <div className={styles.infoBaseTitle}>
                            <h2 className={styles.semiTitle}>
                                기본정보
                            </h2>
                            <ul className={styles.infoBaseUl}>
                                <li className={styles.infoBaseLi}>
                                    <i>센터이름</i>
                                    <span><a href={"https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query="+searchInfo.center_name} target="_blank" rel="noopener noreferrer">{searchInfo.center_name}</a></span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>주소</i>
                                    <span>{searchInfo.address}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>전화번호</i>
                                    <span>{searchInfo.tel}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>연령층</i>
                                    <span>{searchInfo.age_range}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>사용료</i>
                                    <span>{searchInfo.price}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>학기중</i>
                                    <span>{searchInfo.format_regular}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>방학중</i>
                                    <span>{searchInfo.format_vacation}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>토요일</i>
                                    <span>{searchInfo.format_saturday}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </>
            )
        } else if(currentTabType?.[2]) {
            return(
                <>
                <div className={styles.infoBackground2}>
                    <button
                        type="button"
                        className={styles.closeInfoButton}
                        onClick={() => closeInfoButton()}
                    >
                        x
                    </button>
                    <div className={styles.infoBaseBox}>
                        <div className={styles.infoBaseTitle}>
                            <h2 className={styles.semiTitle}>
                                기본정보
                            </h2>
                            <ul className={styles.infoBaseUl}>
                                <li className={styles.infoBaseLi}>
                                    <i>시설이름</i>
                                    <span><a 
                                        href={"https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query="+searchInfo.facility_name} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {searchInfo.facility_name}
                                    </a></span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>주소</i>
                                    <span>{searchInfo.address}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>상세주소</i>
                                    <span>{searchInfo.address_detail}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>전화번호</i>
                                    <span>{searchInfo.tel}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>연령층</i>
                                    <span>{searchInfo.age_range}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>무료여부</i>
                                    <span>{searchInfo.free_price}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>운영일</i>
                                    <span>{searchInfo.open_day}</span>
                                </li>
                                <li className={styles.infoBaseLi}>
                                    <i>휴관일</i>
                                    <span>{searchInfo.break_day}</span>
                                </li>
                            </ul>
                        </div>
                        <div className={styles.footBlank}>
                            <button 
                                onClick={() => window.open(
                                    `https://icare.seoul.go.kr/icare/user/kidsCafe/BD_selectKidsCafeList.do?q_hiddenVal=1&q_fcltyId=&q_rowPerPage=5&q_currPage=1&q_sortName=&q_sortOrder=&q_searchVal=${searchInfo.facility_name}&q_useAge=`, 
                                    '_blank', 
                                    'noopener,noreferrer'
                                )}
                                className={styles.reserveBtn}
                            >
                                이용안내 및 예약이동
                            </button>
                        </div>
                    </div>
                </div>
            </>
            )
        }
    }

    return kinder();
}

function EducationMain() {
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([]);
    const educationCategories = ["유치원", "돌봄시설", "놀이시설"];
    const [currentTabType, setCurrentTabType] = useState([true, false, false]);
    //검색어
    const [query, setQuery] = useState("");
    //검색지역
    const [areas, setAreas] = useState([]);
    //에러문구
    const [error, setError] = useState("");
    //페이징
    const [page, setPage] = useState(1);
    //스프링에서 검색해온 데이터
    const [results, setResults] = useState({
        items: [],
        total: 0,
        searchVO: {
            totPage: 1
        }
    });
    //클릭한 유치원
    const [selectedDetailInfo, setSelectedDetailInfo] = useState({});
    //인포창 열림,닫힘
    const [isVisible, setIsVisible] = useState(false);
    //검색 필터
    const [selectedFilters, setSelectedFilters] = useState([]);

    const fetchData = async (filters = [], query, areas, page = 1) => {
        let response;
        try {
            const params = {
                query,
                areas: areas.join(","),
                page,
                filters: filters.join(",")
            };
            if(currentTabType[0]){
                response = await axios.get(
                    'http://localhost:9002/seoul/education/eduGardenSearch',
                    { params }
                );
            } else if(currentTabType[1]) {
                response = await axios.get(
                    'http://localhost:9002/seoul/education/eduLocalCenterSearch', 
                    { params }
                );
            } else if(currentTabType[2]) {
                response = await axios.get(
                    'http://localhost:9002/seoul/education/eduPlaySearch', 
                    { params }
                );
            }
            setResults(response.data);
            
            // 마커 생성
            let multiMarker;
            if(currentTabType[0]) {
                multiMarker = response.data.items
                .map((item, index) => ({
                    position: {
                        lat: parseFloat(item.y_coordinate),
                        lng: parseFloat(item.x_coordinate)
                    },
                    content: item.kindergarten_name || "오류",
                    category: item.address || "오류",
                    index: index
                }));
            }else if (currentTabType[1]) {
                multiMarker = response.data.items
                .map((item, index) => ({
                    position: {
                        lat: parseFloat(item.y_coordinate),
                        lng: parseFloat(item.x_coordinate)
                    },
                    content: item.center_name || "오류",
                    category: item.address || "오류",
                    service_type: item.service_type,
                    index: index
                }));
            }else if(currentTabType[2]) {
                multiMarker = response.data.items
                .map((item, index) => ({
                    position: {
                        lat: parseFloat(item.y_coordinate),
                        lng: parseFloat(item.x_coordinate)
                    },
                    content: item.facility_name || "오류",
                    category: item.address || "오류",
                    index: index
                }));
            };
            setMarkers(multiMarker);
            //0번 마커로 이동
            if (multiMarker.length > 0) {
                const firstMarker = multiMarker[0].position;
                if (mapRef.current) {
                    const center = new window.kakao.maps.LatLng(firstMarker.lat, firstMarker.lng);
                    mapRef.current.setCenter(center);
                }
            };
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
        fetchData(selectedFilters, searchQuery, selectedAreas, 1);
    };

    useEffect(() => {
        if (selectedFilters.length > 0 || areas.length > 0 || query) {
            fetchData(selectedFilters, query, areas, page);
        }
    }, [selectedFilters, query, areas, page]);

    const markerKinderinfo = async (marker) => {
        let response;
        try {
            const params = {
                selectName: marker.content,
                selectAddress: marker.category,
            };
            if(currentTabType[0]){
                response = await axios.get(
                    'http://localhost:9002/seoul/education/eduKinderInfo',
                    { params: {
                        selectName: marker.content,
                        selectAddress: marker.category,
                    } }
                );
            } else if(currentTabType[1]){
                response = await axios.get(
                    'http://localhost:9002/seoul/education/eduLocalCenterInfo',
                    { params: {
                        selectName: marker.content,
                        selectAddress: marker.category,
                        service_type: marker.service_type,
                    } }
                );
            } else if(currentTabType[2]){
                response = await axios.get(
                    'http://localhost:9002/seoul/education/eduPlayInfo',
                    { params: {
                        selectName: marker.content,
                        selectAddress: marker.category,
                    } }
                );
            }
            setSelectedDetailInfo(response.data);
            setIsVisible(true);
            setError("");
            console.log("setSelectedDetailInfo", setSelectedDetailInfo);
        } catch (err) {
            console.error("데이터 로드 오류:", err);
            setError("데이터 불러오기 중 오류 발생");
        }
    }
    const selectKinderInfo = async (item) => {
        const center = new window.kakao.maps.LatLng(item.y_coordinate, item.x_coordinate);
        mapRef.current.setCenter(center);
    }
    const tabReset = () =>{
        setResults({
            items: [],
            total: 0,
            searchVO: {
                totPage: 1,
            },
        });
        setAreas([]);
        setQuery("");
        setMarkers([]);
        setSelectedDetailInfo({});
        setSelectedFilters([]);
        setIsVisible(false);
    }

    return (
        <div className={styles.educationContainer}>
            <CommonMap 
                setMap={(map) => { mapRef.current = map; }} 
                mapLevel={4}
                // onClick 제거 (오버레이 관련)
            >
                {markers.map((marker, index) => (
                    <div
                        key={`marker-container-${index}`}
                        className={`${styles.markerContainer} marker-container-${index}`}
                    >
                    <MapMarker
                        key={`marker-${index}`}
                        className={styles.markerSet}
                        position={marker.position}
                        clickable={true}
                    />
                    <CustomOverlayMap
                        className={styles.customO}
                        position={marker.position}
                    >
                        <div
                            className={styles.markerInfo}
                            onClick={() => markerKinderinfo(marker)}
                            style={{
                                transform: marker.content.length >= 32 ? 'translateY(-100px)' : 'translateY(-75px)'
                            }}
                        >
                            <h4>{marker.content}</h4>
                            <p>{marker.category}</p>
                        </div>
                    </CustomOverlayMap>
                </div>
                ))}
            </CommonMap>
            <Infotab 
                currentTabType={currentTabType}
                searchInfo={selectedDetailInfo}
                setIsVisible={setIsVisible}
                isVisible={isVisible}
            />
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
                                tabReset();
                            }}
                        >
                            {category}
                        </div>
                    ))}
                </div>
                <div className={styles.searchBox}>
                    <EduSearchBox
                        selectedFilters={selectedFilters}
                        setSelectedFilters={setSelectedFilters}
                        currentTabType={currentTabType}
                        setPage={setPage}
                        setMarkers={setMarkers}
                        setSelectedDetailInfo={setSelectedDetailInfo}
                        onSearch={handleSearch}
                        selectedItems={areas}
                        setSelectedItems={setAreas}
                        query={query}
                        setQuery={setQuery}
                        setResults={setResults}
                        setError={setError}
                    /><br/>
                    <KindergartenList 
                        selectedFilters={selectedFilters}
                        currentTabType={currentTabType}
                        results={results} 
                        error={error} 
                        page={page}
                        setPage={setPage}
                        totalPages={results.searchVO.totPage}
                        fetchData={fetchData}
                        query={query}
                        areas={areas}
                        onSelect={selectKinderInfo}
                    />
                </div>
            </SideTab>
        </div>
    );
}

export default EducationMain;
