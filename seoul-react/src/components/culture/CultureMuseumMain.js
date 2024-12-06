import { useEffect, useState } from 'react';
import styles from '../../assets/css/culture/CultureMain.module.css';
import GetFetch from '../../hooks/getFetch';

function CultureMuseumMain(props) {
    // 전시 정보를 획득하는 함수
    const exhibitionData = GetFetch(`http://localhost:9002/seoul/culture/getExhibitionInfo`);
    const [museumExhibitions, setMuseumExhibitions] = useState([]);
    const [artMuseumExhibitions, setArtMuseumExhibitions] = useState([]);

    useEffect(() => {
        // 버퍼 생성
        const x = [];
        const y = [];

        // 전시 정보로부터 각각 원하는 정보 획득
        if (exhibitionData.body) {
            exhibitionData.body.items.item.map((data, index) => {
                if ((data.CNTC_INSTT_NM.includes('대한민국역사박물관') ||
                    data.CNTC_INSTT_NM.includes('국립박물관문화재단') ||
                    data.EVENT_SITE.includes('아시아문화박물관')) &&
                    data.PERIOD.includes('2024')) {
                    x.push(data);
                } else if (data.CNTC_INSTT_NM.includes('미술관') && data.PERIOD.includes('2024')) {
                    y.push(data);
                }
            })
            setMuseumExhibitions(x);
            setArtMuseumExhibitions(y);
        }
    },[exhibitionData]);

    return (
        <div className={styles.cultureBookMain}>
            <div className={styles.bestsellerHeader}>서울 박물관 전시 현황</div>
            <div className={styles.bestsellerContainer}>
                {
                    exhibitionData.body && museumExhibitions.map((data, index) => {
                        return (
                            <div
                                className={styles.bestsellerFrame}
                                key={ `${data.CNTC_INSTT_NM}-${index}` }
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div>
                                    <img
                                        src={data.IMAGE_OBJECT || '/images/culture/noImage.png'}
                                        alt={data.TITLE}
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
                                        </div>&nbsp;| {data.PERIOD}
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '17px' }}>
                                        <div
                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'clip', cursor: 'pointer', marginLeft: '1px' }}
                                            onClick={() => {window.open(`${data.URL}`)}}
                                        >
                                            {`1. ${data.URL.replace("https://","")}`}
                                        </div>
                                        <div>{`2. 위치: ${data.EVENT_SITE}`}</div>
                                        <div>{`3. ${data.DESCRIPTION.replace(/<[^>]*>/g, '').replace(/&[^;\s]+;/g, '') || "상세페이지 확인"}`}</div>
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
                                className={styles.bestsellerFrame}
                                key={ `${data.CNTC_INSTT_NM}-${index}` }
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
                                            {data.CONTRIBUTOR}
                                        </div>&nbsp;| {data.PERIOD}
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '17px' }}>
                                        <div
                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'clip', cursor: 'pointer', marginLeft: '1px' }}
                                            onClick={() => {window.open(`${data.URL}`)}}
                                        >
                                            {`1. ${data.URL.replace("https://","")}`}
                                        </div>
                                        <div
                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'clip', cursor: 'pointer', marginLeft: '1px' }}
                                        >
                                            {`2. 위치: ${data.EVENT_SITE}, 작가: ${data.AUTHOR}`}
                                        </div>
                                        <div>{`3. ${data.DESCRIPTION.replace(/<[^>]*>/g, '').replace(/&[^;\s]+;/g, '') || "상세페이지 확인"}`}</div>
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