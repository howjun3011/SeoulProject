import styles from '../../assets/css/culture/CultureMain.module.css';

function CultureMovieSearch(props) {
    return (
        <div className={styles.cultureBookMain} style={{ paddingBottom: '0' }}>
            <div className={styles.bestsellerHeader}>검색 결과</div>
            <div className={styles.bestsellerContainer} style={{ height: '600px' }}>
                {
                    ( props.spaceContents && props.spaceContents.length > 0 ) && props.spaceContents.map((data, index) => {
                        return (
                            <div
                                className={`${styles.bestsellerFrame}`}
                                key={`${data.movieCd}-${index}`}
                                style={{ marginBottom: '40px' }}
                            >
                                <div className={styles.bestsellerFrameNo}>{index + 1}.</div>
                                <div className={styles.bestsellerFrameInfo} style={{ height: '150px', marginTop: '-1px', paddingLeft: '5px', width: '90%' }}>
                                    <div className={styles.bestsellerFrameInfoHeader}>
                                        {data.movieNm} {data.movieNmEn ? `(${data.movieNmEn})` : ''}
                                    </div>
                                    <div
                                        style={{ display: 'flex', marginBottom: '6px', color: '#111', fontSize: '12px', opacity: '0.7' }}
                                    >
                                        <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '90%' }}>
                                            {data.genreAlt} | {data.prdtYear || '내용없음'} | {`${data.nationAlt}`}
                                        </span>
                                    </div>
                                    <div className={styles.bestsellerFrameInfoDetail} style={{ lineHeight: '17px' }}>
                                        <div
                                            style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'clip', cursor: 'pointer', marginLeft: '1px' }}
                                            onClick={() => {window.open(`https://kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do?dtTp=movie&dtCd=${data.movieCd}`)}}
                                        >
                                            {`1. kobis.or.kr/kobis/business/mast/mvie/searchMovieList.do?dtTp=movie&dtCd=${data.movieCd}`}
                                        </div>
                                        <div>{`2. 개봉일: ${data.openDt ? `${data.openDt.slice(0,4)}년 ${data.openDt.slice(4,6)}월 ${data.openDt.slice(6)}일` : '내용 없음'}`}</div>
                                        <div>{`3. 영화 유형: ${data.typeNm || '내용 없음'}`}</div>
                                        <div>{`4. 제작 상태: ${data.prdtStatNm || '내용 없음'}`}</div>
                                        <div>{`5. 감독: ${data.directors.length > 0 ? data.directors[0].peopleNm || '내용 없음' : '내용 없음'}`}</div>
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

export default CultureMovieSearch;