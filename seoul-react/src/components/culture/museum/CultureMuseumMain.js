import { useEffect, useState } from 'react';
import styles from '../../../assets/css/culture/CultureMain.module.css';
import GetFetch from '../../../hooks/getFetch';

function CultureMuseumMain(props) {
    // 전시 정보를 획득하는 함수
    const exhibitionData = GetFetch(`http://localhost:9002/seoul/culture/getExhibitionInfo`);
    const [museumExhibitions, setMuseumExhibitions] = useState([]);
    const [artMuseumExhibitions, setArtMuseumExhibitions] = useState([]);

    // HTML 태그 제거 및 HTML 엔티티 제거 함수
    const cleanText = (text = '') => text.replace(/<[^>]*>/g, '').replace(/&[^;\s]+;/g, '');

    useEffect(() => {
        if (!exhibitionData.body) return;

        // 버퍼 생성
        const x = [];
        const y = [];

        // 전시 정보로부터 각각 원하는 정보 획득
        exhibitionData.body.items.item.forEach((data) => {
            const isMuseum = (data.CNTC_INSTT_NM.includes('대한민국역사박물관') ||
                              data.CNTC_INSTT_NM.includes('국립박물관문화재단') ||
                              data.EVENT_SITE.includes('아시아문화박물관')) &&
                              data.PERIOD.includes('2024');

            const isArtMuseum = data.CNTC_INSTT_NM.includes('미술관') && data.PERIOD.includes('2024');

            if (isMuseum) x.push(data);
            if (isArtMuseum) y.push(data);
        });

        setMuseumExhibitions(x);
        setArtMuseumExhibitions(y);
    },[exhibitionData]);

    return (
        <div className={styles.cultureBookMain}>
            <div className={styles.bestsellerHeader}>서울 박물관 전시 현황</div>
            <div className={styles.bestsellerContainer}>
                {
                    exhibitionData.body && museumExhibitions.map((data, index) => {
                        return (
                            <div
                                className={`${styles.bestsellerFrame} ${styles.assetSearchFrame}`}
                                key={ `${data.CNTC_INSTT_NM}-${index}` }
                                onClick={() => {window.open(`${data.URL}`)}}
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div>
                                    <img
                                        src={data.IMAGE_OBJECT || '/images/culture/noImage.png'}
                                        alt={data.TITLE}
                                        style={{
                                            width: '80px',
                                            height: '110px'
                                        }}
                                    />
                                </div>
                                <div className={styles.bestsellerFrameInfo} style={{ height: '114px' }}>
                                    <div className={styles.bestsellerFrameInfoHeader}>
                                        {data.TITLE}
                                    </div>
                                    <div className={styles.commonInfoStyle}>
                                        <div className={styles.commonEllipsisStyle}>
                                            {data.CNTC_INSTT_NM}
                                        </div>&nbsp;| {data.PERIOD}
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '17px' }}>
                                        <div className={styles.commonEllipsisStyleNoMax}>{`1. 위치: ${data.EVENT_SITE || '내용 없음'}`}</div>
                                        <div>{`2. ${cleanText(data.DESCRIPTION) || "상세페이지 확인"}`}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <div className={styles.bestsellerHeader}>서울 미술관 전시 현황</div>
            <div className={styles.bestsellerContainer}>
                {
                    exhibitionData.body && artMuseumExhibitions.map((data, index) => {
                        return (
                            <div
                                className={`${styles.bestsellerFrame} ${styles.assetSearchFrame}`}
                                key={ `${data.CNTC_INSTT_NM}-${index}` }
                                onClick={() => {window.open(`${data.URL}`)}}
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div>
                                    <img
                                        src={data.IMAGE_OBJECT || '/images/culture/noImage.png'}
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
                                    <div className={styles.commonInfoStyle}>
                                        <div className={styles.commonEllipsisStyle}>
                                            {data.CONTRIBUTOR}
                                        </div>&nbsp;| {data.PERIOD}
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '17px' }}>
                                        <div className={styles.commonEllipsisStyleNoMax}>{`1. 위치: ${data.EVENT_SITE}, 작가: ${data.AUTHOR}`}</div>
                                        <div>{`2. ${cleanText(data.DESCRIPTION) || "상세페이지 확인"}`}</div>
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

export default CultureMuseumMain;