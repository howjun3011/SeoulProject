import { useEffect, useState } from 'react';
import styles from '../../../assets/css/culture/CultureMain.module.css';
import GetFetch from '../../../hooks/getFetch';

function CultureAssetsMain(props) {
    // 전시 정보를 획득하는 함수
    const data = GetFetch(`http://localhost:9002/seoul/culture/getCulturalAssetsEvent`);
    const [eventData, setEventData] = useState([]);

    useEffect(() => {
        // 버퍼 생성
        const x = [];

        if (data.item) {
            data.item.map((y, index) => {
                if (y.sido === "서울특별시") {
                    x.push(y);
                }
            })
            setEventData(x);
        }
    },[data]);

    return (
        <div className={styles.cultureBookMain}>
            <div className={styles.bestsellerHeader}>서울 국가유산 행사목록</div>
            <div className={styles.bestsellerContainer} style={{ height: '570px' }}>
                {
                    eventData.length > 0 && eventData.map((data, index) => {
                        return (
                            <div
                                className={styles.bestsellerFrame}
                                key={ `${data.seqNo}-${index}` }
                                style={{ height: '204px', marginBottom: '40px' }}
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div className={styles.bestsellerFrameInfo} style={{ height: '204px', marginTop: '-1px', paddingLeft: '0' }}>
                                    <div className={styles.bestsellerFrameInfoHeader}>
                                        {data.subTitle}
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
                                            {data.groupName || data.gugun || '내용없음'}
                                        </div>&nbsp;| {`${data.sDate} - ${data.eDate}`}
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '17px' }}>
                                        <div
                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'clip', cursor: 'pointer', marginLeft: '1px' }}
                                            onClick={() => {window.open(`${data.subPath}`)}}
                                        >
                                            {`1. 링크: ${data.subPath.replace("https://","")}`}
                                        </div>
                                        <div>{`2. 위치: ${data.subDesc}`}</div>
                                        <div>{`3. 문의: ${data.contact ? (data.contact !== '.' ? data.contact : '내용없음') : '내용없음'}`}</div>
                                        <div>{`4. 기간: ${data.subDate}`}</div>
                                        <div>{`5. 참여대상: ${data.subDesc_2 || '내용없음'}`}</div>
                                        <div>{`6. 기타: ${data.subDesc_3 || '내용없음'}`}</div>
                                        { !data.fileList && <div>{`7. 파일: 내용없음`}</div> }
                                        { data.fileList && <div
                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'clip', cursor: 'pointer', marginLeft: '1px' }}
                                        >
                                            {`7. 파일: `}
                                            { data.fileList.downFile.map((d, index, row) => {
                                                return (
                                                    <span
                                                        key={index}
                                                        onClick={() => {window.open(`${d.filePath}`)}}
                                                        className={styles.cultureAssetFileName}
                                                    >
                                                        {`${ index+1 === row.length ? d.fileNm : d.fileNm+', '}`}
                                                    </span>
                                                );})
                                            }
                                        </div> }
                                        <div style={{ marginTop: '5px'}}>{`${data.subContent.replace(/<[^>]*>/g, '').replace(/&[^;\s]+;/g, '') || "상세페이지 확인"}`}</div>
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

export default CultureAssetsMain;