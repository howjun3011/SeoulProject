import commons from '../../assets/css/common/Common.module.css';
import { CustomOverlayMap, Map, MapMarker, MapTypeId } from "react-kakao-maps-sdk";
import { useEffect, useState } from 'react';

function CommonMap(props) {
    // 맵 확대 및 축소 함수
    const [level, setLevel] = useState(props.mapLevel);

    // 현재 위치 확인 함수
    const [location, setLocation] = useState({
        latitude: 126.97209840,
        longitude: 37.55576761
    });
    let [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
		navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
	}, []);

    const successHandler = (response) => {
		const { latitude, longitude } = response.coords;
		setLocation({ latitude, longitude });
        setIsChanged(true);
	};
    const errorHandler = (error) => {
		console.log(error);
	};

    // 지도 뷰 변경 함수
    const [mapTypeId, setMapTypeId] = useState("");

    // 주소 검색 함수
    const [mapName, setMapName] = useState("현재 위치");

    const onClickAddr = () => {
        new window.daum.Postcode({
            oncomplete: (addrData) => {
                var geocoder = new window.kakao.maps.services.Geocoder();
                geocoder.addressSearch(
                    addrData.address,
                    (result, status) => {
                        if (status === window.kakao.maps.services.Status.OK) {
                            setLocation({
                                latitude: Number(result[0].y),
                                longitude: Number(result[0].x)
                            });
                            setMapName(() => {
                                if (result[0].road_address.building_name !== '') {return result[0].road_address.building_name;}
                                else {return result[0].road_address.address_name;}
                            });
                        }
                    }
                );
            },
        }).open({
            left: (window.screen.width / 2) - (500 / 2),
            top: (window.screen.height / 2) - (500 / 2)
        });
    };

    const { showControls = true } = props;
    const { showCurrentLocationOverlay = true } = props;
    const { showCurrentLocationMarker = true } = props;

    return (
        <Map
            className={ commons.map }
            center={{ lat: location.latitude, lng: location.longitude }}
            level={level}
            isPanto={true}
            onCreate={isChanged ? props.setMap : ''}
        >
            {/* 마커 */}
            {/* showCurrentLocationMarker가 true일 때만 마커를 렌더링 */}
            { showCurrentLocationMarker && (
                <MapMarker position={{ lat: location.latitude, lng: location.longitude }}></MapMarker>
            ) }
            {/* showCurrentLocationOverlay가 true일 때만 오버레이를 렌더링 */}
            { showCurrentLocationOverlay && (
                <CustomOverlayMap position={{ lat: location.latitude, lng: location.longitude }}>
                    <div className={`${commons.overlay} ${commons.flexCenter}`}>{mapName}</div>
                </CustomOverlayMap>
            ) }
            {/* 맵 타입 */}
            { mapTypeId && <MapTypeId type={mapTypeId} /> }

            {/* showControls가 true일 때만 아래 요소들을 렌더링 */}
            { showControls && (
                <>
                    {/* 현재 위치 변환 */}
                    <div
                        className={ `${commons.mapCurrentBtnContainer} ${commons.flexCenter}` }
                        onClick={() => {
                            navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
                            setMapName("현재 위치");
                        }}
                    >
                        <svg
                            className={ commons.mapCurrentBtn }
                            viewBox="0 0 29 29"
                        ><path
                            d="M13.89 23.01V21a.61.61 0 0 1 1.22 0v2.01a8.533 8.533 0 0 0 7.9-7.9H21a.61.61 0 0 1 0-1.22h2.01a8.533 8.533 0 0 0-7.9-7.9V8a.61.61 0 0 1-1.22 0V5.99a8.533 8.533 0 0 0-7.9 7.9H8a.61.61 0 0 1 0 1.22H5.99a8.533 8.533 0 0 0 7.9 7.9zm10.36-8.51c0 5.385-4.365 9.75-9.75 9.75s-9.75-4.365-9.75-9.75 4.365-9.75 9.75-9.75 9.75 4.365 9.75 9.75zm-9.75 1.625a1.625 1.625 0 1 0 0-3.25 1.625 1.625 0 0 0 0 3.25z"
                        ></path>
                        </svg>
                    </div>

                    {/* 주소 검색 기능 */}
                    <div
                        className={ `${commons.mapSearchContainer} ${commons.flexCenter}` }
                        onClick={onClickAddr}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 488.4 488.4"
                            style={{ opacity: '0.8' }}
                        ><path
                            d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6 s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2 S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7 S381.9,104.65,381.9,203.25z"
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
                </>
            ) }
            { props.children }
        </Map>
    );
}

export default CommonMap;