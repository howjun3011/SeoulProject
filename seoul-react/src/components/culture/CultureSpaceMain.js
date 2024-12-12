import { useEffect, useState } from 'react';
import styles from '../../assets/css/culture/CultureMain.module.css';
import GetFetch from '../../hooks/getFetch';

function CultureSpaceMain(props) {
    // 공연 정보를 획득하는 함수
    const exhibitionData = GetFetch(`http://api.kcisa.kr/openapi/API_CCA_144/request?serviceKey=${encodeURIComponent(process.env.REACT_APP_SPACE_KEY)}&numOfRows=400&pageNo=1`);
    const [museumExhibitions, setMuseumExhibitions] = useState([]);

    // 어제의 박스오피스 정보를 획득하는 함수
    const dailyMovieData = GetFetch(`http://localhost:9002/seoul/culture/getCulturalYesterdayMovieInfo`);

    // 오늘의 날짜 정보
    const now = new Date();

    useEffect(() => {
        // 버퍼 생성
        const x = [];

        // 전시 정보로부터 각각 원하는 정보 획득
        if (exhibitionData.response) {
            exhibitionData.response.body.items.item.map((data, index) => {
                if (data.PERIOD.includes(`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`)) {x.push(data);}
            })
            setMuseumExhibitions(x);
        }
    },[exhibitionData]);

    return (
        <div className={styles.cultureBookMain}>
            <div className={styles.bestsellerHeader}>서울 주요 공연 현황</div>
            <div className={styles.bestsellerContainer}>
                {
                    exhibitionData.response && museumExhibitions.map((data, index) => {
                        return (
                            <div
                                className={styles.bestsellerFrame}
                                key={ `${data.CNTC_INSTT_NM}-${index}` }
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div>
                                    <img
                                        src={ data.IMAGE_OBJECT ? data.IMAGE_OBJECT : '/images/culture/noImage.png' }
                                        alt={data.TITLE}
                                        onError={(e) => {e.target.src = '/images/culture/noImage.png';}}
                                        style={{
                                            width: '80px',
                                            height: '100px'
                                        }}
                                    />
                                </div>
                                <div className={styles.bestsellerFrameInfo} style={{ height: '114px' }}>
                                    <div className={styles.bestsellerFrameInfoHeader}>
                                        {data.TITLE}
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
                                            {data.CNTC_INSTT_NM}
                                        </div>&nbsp;| {data.PERIOD ? (data.PERIOD.length !== 1 ? data.PERIOD : '내용없음') : '내용없음'}
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '17px' }}>
                                        <div
                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'clip', cursor: 'pointer', marginLeft: '1px' }}
                                            onClick={() => {window.open(`${data.URL}`)}}
                                        >
                                            {`1. ${data.URL && data.URL.replace("https://","").replace("http://","") || '내용 없음'}`}
                                        </div>
                                        <div>{`2. 위치: ${data.EVENT_SITE ? (data.EVENT_SITE.length !== 1 && data.EVENT_SITE.length !== 2 ? data.EVENT_SITE : '내용 없음') : '내용 없음'}`}</div>
                                        <div>{`3. ${data.DESCRIPTION && data.DESCRIPTION.replace(/<[^>]*>/g, '').replace(/&[^;\s]+;/g, '') || "상세페이지 확인"}`}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className={styles.bestsellerHeader}>어제의 박스오피스 ( {now.getFullYear()}년 {String(now.getMonth()+1).padStart(2,"0")}월 {String(now.getDate()).padStart(2,"0")}일 )</div>
            <div className={styles.bestsellerContainer}>
                {
                    dailyMovieData.boxOfficeResult && dailyMovieData.boxOfficeResult.dailyBoxOfficeList.map((data, index) => {
                        return( <BoxOffice key={data.movieCd} data={data} index={index} /> );
                    })
                }
            </div>
        </div>
    );
}

function BoxOffice(props) {
    const detailData = GetFetch(`http://localhost:9002/seoul/culture/getCulturalMovieImgInfo?id=${props.data.movieCd}`);
    const [movieImg, setMovieImg] = useState('');

    useEffect(() => {
        if (detailData.movieInfoResult) {
            fetch(`https://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&detail=Y&title=${encodeURIComponent(detailData.movieInfoResult.movieInfo.movieNm)}&director=${encodeURIComponent(detailData.movieInfoResult.movieInfo.directors[0].peopleNm)}&ServiceKey=${encodeURIComponent(process.env.REACT_APP_MOVIE_KEY)}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.Data !== undefined && data.Data[0].Result !== undefined) {
                        const temp = data.Data[0].Result[0].posters.split('|');
                        setMovieImg(temp[0]);
                    }
                });
        }
    },[detailData]);

    return (
        <div
            className={styles.bestsellerFrame}
            key={ `${props.data.movieCd}-${props.index}` }
        >
            <div className={styles.bestsellerFrameNo} style={{ flexBasis: '30px' }}>{props.data.rank}위</div>
            <div>
                <img
                    src={movieImg || '/images/culture/noImage.png'}
                    alt={props.data.TITLE}
                    onError={(e) => {e.target.src = '/images/culture/noImage.png';}}
                    style={{
                        width: '80px',
                        height: '100px'
                    }}
                />
            </div>
            <div className={styles.bestsellerFrameInfo} style={{ height: '114px' }}>
                <div className={styles.bestsellerFrameInfoHeader}>
                    {props.data.movieNm}
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
                        {props.data.rankOldAndNew === "OLD" ? "기존" : "신규"}
                    </div>&nbsp;| {props.data.rankInten.includes("-") ? props.data.rankInten : props.data.rankInten.includes("0") ? "순위변동없음" : "+"+props.data.rankInten}
                </div>
                <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '17px' }}>
                    <div
                        style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'clip', cursor: 'pointer', marginLeft: '1px' }}
                        onClick={() => {window.open(`https://kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do?dtTp=movie&dtCd=${props.data.movieCd}`)}}
                    >
                        {`1. kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do?dtTp=movie&dtCd=${props.data.movieCd}`}
                    </div>
                    <div>{`2. 개봉일: ${props.data.openDt}`}</div>
                    <div>{`3. 당일 관객수: ${props.data.audiCnt.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}명 | 당일 매출액: ${props.data.salesAmt.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원`}</div>
                    <div>{`4. 누적 관객수: ${props.data.audiAcc.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원`}</div>
                </div>
            </div>
        </div>
    );
}

export default CultureSpaceMain;