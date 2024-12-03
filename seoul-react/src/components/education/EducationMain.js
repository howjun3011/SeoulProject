import styles from '../../assets/css/education/EduMain.module.css';
import { useEffect, useState, useRef } from 'react';
import { MapMarker } from "react-kakao-maps-sdk";
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import axios from 'axios';

function EduSearchBox(){
    const [selectedItems, setSelectedItems] = useState([]);
    const [error,setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] =useState([]);

    const options =[
        "강남구","강동구","강북구","강서구","관악구","광진구","구로구",
        "금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구",
        "서초구","성동구","성북구","송파구","양천구","영등포구","용산구",
        "은평구","종로구","중구","중랑구",
    ];

    // select버튼 누르면 서버에 데이터 전송
    const handleSelect = async (event) => {
        const value = event.target.value;
        const query = document.getElementById("searchQuery").value;

        if(selectedItems.includes(value)) {
            setError("이미 선택된 항목입니다.");
            return
        } else if (selectedItems.length >= 4){
            setError("최대 4개 까지만 선택할 수 있습니다.")
            return
        }else {
            setError("")
            const updatedItems = [...selectedItems, value];
            setSelectedItems(updatedItems);
            try{
                const response = await axios.get(
                    'http://localhost:9002/seoul/education/eduGardenSearch', {
                    params: { 
                        areas: updatedItems.join(","),
                        query: query,
                    },
                });
                setResults(response.data);
            }catch (err) {
                console.error("셀렉트 서버 전송 오류 :", err);
                setError("서버 오류")
            }
        }
    };
    
    const handleRemove = (item) => {
        setSelectedItems(selectedItems.filter((selected) => selected !== item));
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        if(setSelectedItems.length ===0 ){
            setError("최소 한 개 이상의 항목을 선택해주세요.")
        } else{
            setError("")
            try {
                setLoading(true);
                const response = await axios.get(
                    'http://localhost:9002/seoul/education/eduGardenSearch',{
                    params: {
                        areas: selectedItems.join(","),
                        query: event.target.searchQuery.value,
                    },
                });
                setResults(response.data)
            } catch (err){
                setError("검색 중 오류 발생");
            } finally{
                setLoading(false);
            }
        }
    };


    return (
        // 검색줄
        <div className={styles.searchBox}>
            <form action="/eduGardenSearch" method="get" onSubmit={handleSubmit} >
                <select onChange={handleSelect} defaultValue="" >
                    <option value="" disabled >지역선택</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    className={styles.searchInput}
                    name="searchQuery"
                    id="searchQuery"
                    placeholder="검색어를 입력하세요"
                />
                <input type="hidden" name="selectedAreas" value={selectedItems.join(",")} />
                <input type="submit" value="검색" />
            </form>
                    {/* 선택항목 박스*/}
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
            {/* 검색 결과 */}
            {loading && <div className={styles.loading}>검색 중...</div>}
            {results.length > 0 && (
                <div className={styles.results}>
                    <h3>검색결과:</h3>
                    <ul>
                        {results.map((result,index) => (
                            <li key={index}>{result.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {error && <div className={styles.error} >{error}</div>}
        </div>
    )
}

function EducationMain() {
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([]);
    const educationCategories = ["유치원", "키즈카페", "유원시설"];
    const [currentTabType, setCurrentTabType] = useState([true, false, false]);

    // map 객체가 설정된 후에 실행되는 useEffect 훅
    useEffect(() => {
        if (mapRef.current) {
            const map = mapRef.current;

            // 지도 경계(bounds) 가져오기
            const bounds = map.getBounds();
            const swLatLng = bounds.getSouthWest();
            const neLatLng = bounds.getNorthEast();

            console.log('swLatLng', swLatLng);
            console.log('neLatLng', neLatLng);

            // 필요에 따라 여기에서 추가 작업 수행 (예: 서버에 좌표 전달)
        }
    }, [mapRef.current]); // mapRef.current가 변경될 때마다 실행

    return (
        <div className={styles.educationContainer}>
            <CommonMap setMap={(map) => { mapRef.current = map; }} mapLevel={4} />
            {markers.map((marker, index) => (
                <MapMarker
                    key={`marker-${index}`}
                    position={marker.position}
                    clickable={true}
                    title={marker.content}
                    map={mapRef.current}
                >
                    <div className={styles.overlay}>
                        <div>{marker.category}</div>
                        <div>{marker.content}</div>
                    </div>
                </MapMarker>
            ))}
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
                    <EduSearchBox></EduSearchBox>
                </div>
            </SideTab>
        </div>
    );
}

export default EducationMain;
