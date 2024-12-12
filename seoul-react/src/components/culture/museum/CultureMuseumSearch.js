import styles from '../../../assets/css/culture/CultureMain.module.css';

function CultureMuseumSearch(props) {
    return (
        <div className={styles.cultureBookMain} style={{ paddingBottom: '0' }}>
            <div className={styles.bestsellerHeader}>검색 결과</div>
            <div className={styles.bestsellerContainer} style={{ height: '600px' }}>
                {
                    ( props.museumContents && props.museumContents.length > 0 ) && props.museumContents.map((data, index) => {
                        return (
                            <div
                                className={styles.bestsellerFrame}
                                key={`${data.rn}-${index}`}
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div>
                                    <img
                                        src={ data.referenceIdentifier ? ( !data.referenceIdentifier.includes('https://') ? `https://${data.referenceIdentifier}` : data.referenceIdentifier )
                                            : '/images/culture/noImage.png' }
                                        alt={data.title}
                                        onError={(e) => {e.target.src = '/images/culture/noImage.png';}}
                                        style={{
                                            width: '80px',
                                            height: '100px'
                                        }}
                                    />
                                </div>
                                <div className={styles.bestsellerFrameInfo} style={{ height: '124px', marginTop: '-2px' }}>
                                    <div className={styles.bestsellerFrameInfoHeader}>
                                        {data.title}
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
                                            {data.creator}
                                        </div>
                                        <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '50%' }}>
                                            &nbsp;| {data.temporal || '내용없음'} | {data.spatial}
                                        </span>
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '15px' }}>
                                        <div
                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'clip', cursor: 'pointer' }}
                                            onClick={() => {window.open(`${data.url}`)}}
                                        >
                                            {`1. ${ data.url && (data.url.replace("https://","").replace("http://","") || '링크 없음') }`}
                                        </div>
                                        <div>{`2. 자원의 물리적(물질적) 상태: ${data.medium || '내용 없음'}`}</div>
                                        <div>{`3. 자원에 대한 권리: ${data.rights || '내용 없음'}`}</div>
                                        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                            {`4. 내용: ${data.description || data.extent || '없음'}`}
                                        </div>
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

export default CultureMuseumSearch;