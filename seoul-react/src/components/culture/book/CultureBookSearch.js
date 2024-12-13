import styles from '../../../assets/css/culture/CultureMain.module.css';

function CultureBookSearch(props) {
    return (
        <div className={styles.cultureBookMain} style={{ paddingBottom: '0' }}>
            <div className={styles.bestsellerHeader}>검색 결과</div>
            <div className={styles.bestsellerContainer} style={{ height: '600px' }}>
                {
                    ( props.bookContents && props.bookContents.length > 0 ) && props.bookContents.map((data, index) => {
                        return (
                            <div
                                className={`${styles.bestsellerFrame} ${styles.assetSearchFrame}`}
                                key={data.id}
                                style={{marginBottom: '10px'}}
                                onClick={() => {window.open(`https://www.nl.go.kr/${data.detail_link}`)}}
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div className={styles.bestsellerFrameInfo} style={{ paddingLeft: '0', height: '128px' }}>
                                    <div className={`${styles.bestsellerFrameInfoHeader} ${styles.commonEllipsisStyleNoMax}`}>
                                        {data.title_info}
                                    </div>
                                    <div className={styles.commonInfoStyle}>
                                        <div className={styles.commonEllipsisStyleNoMax}>
                                            {data.author_info || '내용없음'}
                                        </div>
                                        <span className={styles.commonEllipsisStyleNoMax}>
                                            &nbsp;| {data.pub_info} | {data.pub_year_info}
                                        </span>
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '18px' }}>
                                        <div>{`1. 분류: ${data.type_name} ${data.kdc_name_1s}`}</div>
                                        <div>{`2. 저작권: ${data.lic_text}`}</div>
                                        <div>{`3. 위치: ${data.manage_name} ${data.place_info}`}</div>
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