import styles from '../../assets/css/culture/CultureMain.module.css';

function CulturePerformSearch(props) {
    return (
        <div className={styles.cultureBookMain} style={{ paddingBottom: '0' }}>
            <div className={styles.bestsellerHeader}>검색 결과</div>
            <div className={styles.bestsellerContainer} style={{ height: '600px' }}>
                {
                    ( props.spaceContents && props.spaceContents.length > 0 ) && props.spaceContents.map((data, index) => {
                        return (
                            <div
                                className={`${styles.bestsellerFrame} ${styles.assetSearchFrame}`}
                                key={`${data.mt20id}-${index}`}
                                onClick={() => {
                                    fetch(`http://localhost:9002/seoul/culture/getCulturalPerformanceDetail?q=${data.mt20id}`)
                                        .then((response) => response.json())
                                        .then((data) => {
                                            if (Array.isArray(data.db.relates.relate)) {
                                                window.open(data.db.relates.relate[1].relateurl);
                                            } else {
                                                window.open(data.db.relates.relate.relateurl);
                                            }
                                        })
                                }}
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div>
                                    <img
                                        src={ data.poster || '/images/culture/noImage.png' }
                                        alt={data.prfnm}
                                        onError={(e) => {e.target.src = '/images/culture/noImage.png';}}
                                        style={{
                                            width: '80px',
                                            height: '110px'
                                        }}
                                    />
                                </div>
                                <div className={styles.bestsellerFrameInfo} style={{ height: '124px', marginTop: '-2px', width: '80%' }}>
                                    <div className={styles.bestsellerFrameInfoHeader}>
                                        {data.prfnm}
                                    </div>
                                    <div
                                        style={{ display: 'flex', marginBottom: '6px', color: '#111', fontSize: '12px', opacity: '0.7' }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: '250px',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {data.fcltynm}
                                        </div>
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '15px' }}>
                                        <div>{`1. 공연 장르: ${data.genrenm || '내용 없음'}`}</div>
                                        <div>{`2. 오픈런: ${data.openrun === 'Y' ? '오픈런 공연' : '오픈런 공연이 아닙니다.'}`}</div>
                                        <div>{`3. 공연 일정: ${data.prfpdfrom || '내용 없음'} ~ ${data.prfpdto || '내용 없음'}`}</div>
                                        <div>{`4. 공연상태: ${data.prfstate || '내용 없음'}`}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default CulturePerformSearch;