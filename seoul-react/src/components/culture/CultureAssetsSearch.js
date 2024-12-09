import styles from '../../assets/css/culture/CultureMain.module.css';
import GetFetch from '../../hooks/getFetch';

function CultureAssetsSearch(props) {
    return (
        <div className={styles.cultureBookMain} style={{ paddingBottom: '0' }}>
            <div className={styles.bestsellerHeader}>검색 결과</div>
            <div className={styles.bestsellerContainer} style={{ height: '600px' }}>
                {
                    ( props.assetContents && props.assetContents.length > 0 ) && props.assetContents.map((data, index) => {
                        return (<CultureAssetsDetailSearch key={index} data={data} map={props.map} index={index} setMarkers={() => {props.setMarkers([data])}} />);
                    })
                }
            </div>
        </div>
    );
}

function CultureAssetsDetailSearch(props) {
    const detailData = GetFetch(`http://localhost:9002/seoul/culture/getCulturalAssetsDetail?sort=${props.data.ccbaKdcd}&code=${props.data.ccbaAsno}`);

    if (detailData.item) {
        return (
            <div
                className={`${styles.bestsellerFrame} ${styles.assetSearchFrame}`}
                key={`${props.data.sn}-${props.data.no}-${props.index}`}
                onClick={() => {
                    props.map.setCenter(new window.kakao.maps.LatLng(Number(props.data.latitude),Number(props.data.longitude)));
                    props.setMarkers();
                }}
            >
                <div className={styles.bestsellerFrameNo}>{props.index + 1}.</div>
                <div>
                    <img
                        src={detailData.item.imageUrl}
                        alt={detailData.item.ccbaMnm1}
                        onError={(e) => {e.target.src = '/images/culture/noImage.png';}}
                        style={{
                            width: '80px',
                            height: '110px'
                        }}
                    />
                </div>
                <div className={styles.bestsellerFrameInfo} style={{ height: '124px', marginTop: '-2px' }}>
                    <div className={styles.bestsellerFrameInfoHeader}>
                        {detailData.item.ccbaMnm1}
                    </div>
                    <div
                        style={{ display: 'flex', marginBottom: '6px', color: '#111', fontSize: '12px', opacity: '0.7', width: '300px' }}
                    >
                        <div
                            style={{
                                maxWidth: '300px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {detailData.item.ccmaName}
                        </div>
                        <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '90%' }}>
                            &nbsp;| {detailData.item.ccceName || '내용없음'} | {`${detailData.item.ccbaAsdt.slice(0,4)}년 ${detailData.item.ccbaAsdt.slice(4,6)}월 ${detailData.item.ccbaAsdt.slice(6)}일`}
                        </span>
                    </div>
                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '15px' }}>
                        <div>{`1. 분류: ${detailData.item.gcodeName} - ${detailData.item.bcodeName || '내용 없음'} - ${detailData.item.mcodeName || '내용 없음'} - ${detailData.item.scodeName || '내용 없음'}`}</div>
                        <div>{`2. 수량: ${detailData.item.ccbaQuan || '내용 없음'}`}</div>
                        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {`3. 소재지: ${detailData.item.ccbaLcad || '내용 없음'}`}
                        </div>
                        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                            {`4. 내용: ${detailData.item.content || '없음'}`}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CultureAssetsSearch;