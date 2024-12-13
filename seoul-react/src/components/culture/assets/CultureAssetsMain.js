import { useEffect, useState } from 'react';
import styles from '../../../assets/css/culture/CultureMain.module.css';
import GetFetch from '../../../hooks/getFetch';

function CultureAssetsMain(props) {
    // 전시 정보를 획득하는 함수
    const data = GetFetch(`http://localhost:9002/seoul/culture/getCulturalAssetsEvent`);
    const [eventData, setEventData] = useState([]);

    // HTML 태그 제거 및 HTML 엔티티 제거 함수
    const cleanText = (text = '') => text.replace(/<[^>]*>/g, '').replace(/&[^;\s]+;/g, '');

    useEffect(() => {
        if (!data.item) return;

        // 버퍼 생성
        const x = [];

        data.item.forEach((data) => {
            if (data.sido === "서울특별시") {
                x.push(data);
            }
        });
        setEventData(x);
    },[data]);

    return (
        <div className={styles.cultureBookMain}>
            <div className={styles.bestsellerHeader}>서울 국가유산 행사목록</div>
            <div className={styles.bestsellerContainer} style={{ height: '570px' }}>
                {
                    eventData.length > 0 && eventData.map((data, index) => {
                        return (
                            <div
                                className={`${styles.bestsellerFrame} ${styles.assetSearchFrame}`}
                                key={ `${data.seqNo}-${index}` }
                                style={{ height: '222px', marginBottom: '30px' }}
                                onClick={() => {window.open(`${data.subPath}`)}}
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div className={styles.bestsellerFrameInfo} style={{ height: '204px', marginTop: '-1px', paddingLeft: '0' }}>
                                    <div className={styles.bestsellerFrameInfoHeader}>
                                        {data.subTitle}
                                    </div>
                                    <div className={styles.commonInfoStyle}>
                                        <div className={styles.commonEllipsisStyle}>
                                            {data.groupName || data.gugun || '내용없음'}
                                        </div>&nbsp;| {`${data.sDate} - ${data.eDate}`}
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '17px' }}>
                                        <div>{`1. 위치: ${data.subDesc}`}</div>
                                        <div>{`2. 문의: ${data.contact ? (data.contact !== '.' ? data.contact : '내용없음') : '내용없음'}`}</div>
                                        <div>{`3. 기간: ${data.subDate}`}</div>
                                        <div>{`4. 참여대상: ${data.subDesc_2 || '내용없음'}`}</div>
                                        <div>{`5. 기타: ${data.subDesc_3 || '내용없음'}`}</div>
                                        { !data.fileList && <div>{`7. 파일: 내용없음`}</div> }
                                        { data.fileList && <div className={styles.commonEllipsisStyleNoMax}>
                                            {`6. 파일: `}
                                            { data.fileList.downFile.map((d, index, row) => {
                                                return (
                                                    <span
                                                        key={index}
                                                        onClick={(e) => {e.stopPropagation(); window.open(`${d.filePath}`)}}
                                                        className={styles.cultureAssetFileName}
                                                    >
                                                        {`${ index+1 === row.length ? d.fileNm : d.fileNm+', '}`}
                                                    </span>
                                                );})
                                            }
                                        </div> }
                                        <div style={{ marginTop: '5px' }}>{`${cleanText(data.subContent) || "상세페이지 확인"}`}</div>
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