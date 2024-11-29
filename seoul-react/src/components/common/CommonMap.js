import commons from '../../assets/css/common/Common.module.css';
import { CustomOverlayMap, Map, MapMarker, MapTypeId } from "react-kakao-maps-sdk";
import { useEffect, useState } from 'react';

function CommonMap(props) {
    // 맵 확대 및 축소 함수
    const [level, setLevel] = useState(props.mapLevel);

    // 현재 위치 확인 함수
    const [location, setLoacation] = useState({
        latitude: 126.97209840,
        longitude: 37.55576761
    });
    let [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
		navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
	}, []);

    const successHandler = (response) => {
		const { latitude, longitude } = response.coords;
		setLoacation({ latitude, longitude });
        setIsChanged(true);
	};
    const errorHandler = (error) => {
		console.log(error);
	};

    // 지도 뷰 변경 함수
    const [mapTypeId, setMapTypeId] = useState("");

    return (
        <Map
            className={ commons.map }
            center={{ lat: location.latitude, lng: location.longitude }}
            level={level}
            isPanto={true}
            onCreate={isChanged ? props.setMap : ''}
        >
            {/* 마커 */}
            <MapMarker position={{ lat: location.latitude, lng: location.longitude }}></MapMarker>
            <CustomOverlayMap position={{ lat: location.latitude, lng: location.longitude }}>
                <div className={ `${commons.overlay} ${commons.flexCenter}` }>현재 위치</div>
            </CustomOverlayMap>
            {/* 맵 타입 */}
            { mapTypeId && <MapTypeId type={mapTypeId} /> }

            {/* 현재 위치 변환 */}
            <div
                className={ `${commons.mapCurrentBtnContainer} ${commons.flexCenter}` }
                onClick={() => {navigator.geolocation.getCurrentPosition(successHandler, errorHandler);}}
            >
                <svg
                    className={ commons.mapCurrentBtn }
                    viewBox="0 0 29 29"
                ><path
                    d="M13.89 23.01V21a.61.61 0 0 1 1.22 0v2.01a8.533 8.533 0 0 0 7.9-7.9H21a.61.61 0 0 1 0-1.22h2.01a8.533 8.533 0 0 0-7.9-7.9V8a.61.61 0 0 1-1.22 0V5.99a8.533 8.533 0 0 0-7.9 7.9H8a.61.61 0 0 1 0 1.22H5.99a8.533 8.533 0 0 0 7.9 7.9zm10.36-8.51c0 5.385-4.365 9.75-9.75 9.75s-9.75-4.365-9.75-9.75 4.365-9.75 9.75-9.75 9.75 4.365 9.75 9.75zm-9.75 1.625a1.625 1.625 0 1 0 0-3.25 1.625 1.625 0 0 0 0 3.25z"
                ></path>
                </svg>
            </div>

            {/* 맵 확대 및 축소 */}
            <div className={ commons.mapBtnContainer }>
                <div
                    className={ `${commons.mapBtn} ${commons.flexCenter}` }
                    style={{ borderRight: '2px solid #e2e2e2' }}
                    onClick={() => setLevel(level - 1)}
                >
                    +
                </div>
                <div
                    className={ `${commons.mapBtn} ${commons.flexCenter}` }
                    onClick={() => {
                        if (level > 12) {}
                        else {setLevel(level + 1)}
                    }}
                >
                    -
                </div>
            </div>

            {/* 지도 뷰 변경 */}
            <div className={ commons.mapSelectBtnContainer }>
                <div className={ `${commons.mapSelectBtn} ${commons.flexCenter}` } onClick={() => setMapTypeId("")}>일반지도</div>
                <div className={ `${commons.mapSelectBtn} ${commons.flexCenter}` } onClick={() => setMapTypeId("TRAFFIC")}>교통정보</div>
                <div className={ `${commons.mapSelectBtn} ${commons.flexCenter}` } onClick={() => setMapTypeId("ROADVIEW")}>로드뷰 도로정보</div>
                <div className={ `${commons.mapSelectBtn} ${commons.flexCenter}` } onClick={() => setMapTypeId("TERRAIN")}>지형정보</div>
                <div className={ `${commons.mapSelectBtn} ${commons.flexCenter}` } onClick={() => setMapTypeId("USE_DISTRICT")}>지적편집도</div>
            </div>

            { props.children }
        </Map>
    );
}

export default CommonMap;