import styles from '../../assets/css/culture/CultureMain.module.css';

function CultureBookSearch(props) {
    return (
        <div className={styles.cultureBookMain} style={{ paddingBottom: '0' }}>
            <div className={styles.bestsellerHeader}>검색 결과</div>
            <div className={styles.bestsellerContainer} style={{ height: '600px' }}>
                {
                    ( props.bookContents !== undefined && props.bookContents !== null) && props.bookContents.map((data, index) => {
                        return (
                            <div
                                className={styles.bestsellerFrame}
                                key={data.id}
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div className={styles.bestsellerFrameInfo} style={{ paddingLeft: '0', height: '128px' }}>
                                    <div className={styles.bestsellerFrameInfoHeader}>
                                        {data.title_info}
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
                                            {data.author_info}
                                        </div>&nbsp;| {data.pub_info} | {data.pub_year_info}년
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '15px' }}>
                                        <div
                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'clip', cursor: 'pointer' }}
                                            onClick={() => {window.open(`https://www.nl.go.kr/${data.detail_link}`)}}
                                        >
                                            {`1. https://www.nl.go.kr/${data.detail_link}`}
                                        </div>
                                        <div>{`2. 분류: ${data.type_name} ${data.kdc_name_1s}`}</div>
                                        <div>{`3. 저작권: ${data.lic_text}`}</div>
                                        <div>{`4. 위치: ${data.manage_name} ${data.place_info}`}</div>
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

export default CultureBookSearch;