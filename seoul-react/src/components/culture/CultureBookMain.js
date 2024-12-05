import styles from '../../assets/css/culture/CultureMain.module.css';
import GetFetch from '../../hooks/getFetch';

function CultureBooKMain(props) {
    // 사서의 책장 정보 획득하는 함수
    const randomPage = Math.floor(Math.random()*5943)+1;
    const recommendationData = GetFetch(`http://api.kcisa.kr/openapi/service/rest/convergence2018/conver6?serviceKey=${encodeURIComponent(process.env.REACT_APP_RECOMMENDATION_LIBRARY_KEY)}&numOfRows=10&pageNo=${randomPage}`);
    
    // 베스트 셀러 정보 획득하는 함수
    const bestsellerDatas = GetFetch(`http://localhost:9002/seoul/culture/getBestsellerData`);

    // 국립중앙도서관 사서 추천 도서 정보를 획득하는 함수
    const nationalLibraryData = GetFetch(`http://localhost:9002/seoul/culture/getNationalLibrary`);

    return (
        <div className={styles.cultureBookMain}>
            <div className={styles.bestsellerHeader}>국립중앙도서관 사서추천도서</div>
            <div className={styles.bestsellerContainer}>
                {
                    nationalLibraryData.list !== undefined && nationalLibraryData.list.map((data, index) => {
                        return (
                            <div
                                className={styles.bestsellerFrame}
                                key={data.item.recomNo}
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div>
                                    <img
                                        src={data.item.recomfilepath}
                                        alt={data.item.recomtitle}
                                        style={{
                                            width: '80px',
                                            height: '100px'
                                        }}
                                    />
                                </div>
                                <div className={styles.bestsellerFrameInfo} style={{ height: '114px' }}>
                                    <div className={styles.bestsellerFrameInfoHeader}>
                                        {data.item.recomtitle}
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
                                            {data.item.recomauthor}
                                        </div>&nbsp;| {data.item.recompublisher} | {data.item.publishYear}년
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail}>{data.item.recomcontens.replace(/<[^>]*>/g, '').replace(/&[^;\s]+;/g, '')}</div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className={styles.bestsellerHeader}>사서의 책장</div>
            <div className={styles.bestsellerContainer}>
                {
                    recommendationData.response !== undefined && recommendationData.response.body.items.item.map((data, index) => {
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
                                                maxWidth: '250px',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {data.rights}
                                        </div>&nbsp;| { data.issuedDate !== null && new Date(data.issuedDate.replace('KST ','')).getFullYear() }년 { data.issuedDate !== null && String(new Date(data.issuedDate.replace('KST ','')).getMonth()).padStart(2,'0') }월
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail}>{ ( data.description !== undefined || data.description !== null) && data.description.replace(/<[^>]*>/g, '').replace(/&[^;\s]+;/g, '') }</div>
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