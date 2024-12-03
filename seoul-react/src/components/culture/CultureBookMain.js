import styles from '../../assets/css/culture/CultureMain.module.css';
import GetFetch from '../../hooks/getFetch';

function CultureBooKMain(props) {
    // 사서의 책장 정보 획득하는 함수
    const randomPage = Math.floor(Math.random()*5943)+1;
    const recommendationOriData = GetFetch(`http://api.kcisa.kr/openapi/service/rest/convergence2018/conver6?serviceKey=${encodeURIComponent(process.env.REACT_APP_RECOMMENDATION_LIBRARY_KEY)}&numOfRows=10&pageNo=${randomPage}`);
    let recommendationData;
    if (recommendationOriData.response !== undefined) {recommendationData = recommendationOriData.response.body.items.item;}
    
    // 베스트 셀러 정보 획득하는 함수
    const bestsellerDatas = GetFetch(`http://localhost:9002/seoul/culture/getBestsellerData`);

    return (
        <div className={styles.cultureBookMain}>
            <div className={styles.bestsellerHeader}>사서의 책장</div>
            <div className={styles.bestsellerContainer}>
                {
                    recommendationOriData.response !== undefined && recommendationData.map((data, index) => {
                        return (
                            <div
                                className={styles.bestsellerFrame}
                                key={data.rn}
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div className={styles.bestsellerFrameInfo} style={{ paddingLeft: '0', height: '128px' }}>
                                    <div className={styles.bestsellerFrameInfoHeader}>
                                        {data.title}
                                    </div>
                                    <div
                                        style={{ display: 'flex', marginBottom: '6px', color: '#111', fontSize: '12px', opacity: '0.7' }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: '140px',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {data.rights}
                                        </div>&nbsp;| {new Date(data.issuedDate.replace('KST ','')).getFullYear()}년 { String(new Date(data.issuedDate.replace('KST ','')).getMonth()).padStart(2,'0') }월
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail}>{data.description.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig,'')}</div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className={styles.bestsellerHeader}>알라딘 12월 종합 베스트셀러</div>
            <div className={styles.bestsellerContainer}>
                {
                    bestsellerDatas.map((data, index) => {
                        return (
                            <div
                                className={styles.bestsellerFrame}
                                key={data.seq_no}
                            >
                                <div className={styles.bestsellerFrameNo}>{data.rank_co}.</div>
                                <div>
                                    <img
                                        src={data.book_cvr_image_nm}
                                        alt={data.book_title_nm}
                                        style={{
                                            width: '80px',
                                            height: '100px'
                                        }}
                                    />
                                </div>
                                <div className={styles.bestsellerFrameInfo}>
                                    <div className={styles.bestsellerFrameInfoHeader}>
                                        {data.book_title_nm}
                                    </div>
                                    <div
                                        style={{ display: 'flex', marginBottom: '6px', color: '#111', fontSize: '12px', opacity: '0.7' }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: '140px',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {data.authr_nm}
                                        </div>&nbsp;| {data.publisher_nm} | {data.pblicte_de.substring(0,4)}년 {data.pblicte_de.substring(5,7)}월
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail}>{data.book_intrcn_cn}</div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default CultureBooKMain;