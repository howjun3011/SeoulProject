import styles from '../../../assets/css/culture/CultureMain.module.css';

function CultureMuseumInfo(props) {
    return (
        <div className={ `${styles.cultureBookStoreContainer}` }>
            <div className={ `${styles.cultureBookStoreFrame}` } style={{ overflow: 'scroll', opacity: '1' }}>
                <div className={ `${styles.cultureBookStoreHeader}` }>
                    {`${props.museumContents.flag_nm} 박물관`}
                </div>
                <div className={ `${styles.cultureBookStoreName}` }>
                    {`${props.museumContents.fclty_nm}`}
                </div>
                <div className={ `${styles.cultureBookStoreCenter}` }>
                    <div style={{ fontSize: '18px', paddingBottom: '20px' }}>정보</div>
                    <div>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginRight: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M9 1C5.4 1 2.5 3.7 2.5 7.1c0 1.2.4 2.3 1 3.3l5.1 6.1c.2.2.6.2.8 0l5.1-6.1c.7-1 1-2.1 1-3.3C15.5 3.7 12.6 1 9 1zm0 8c-.8 0-1.5-.7-1.5-1.5S8.2 6 9 6s1.5.7 1.5 1.5S9.8 9 9 9z"
                        ></path>
                        </svg>
                        {`${props.museumContents.rdnmadr_nm} `}<span style={{ fontWeight: '700' }}>{`(${props.museumContents.zip_no})`}</span>
                    </div>
                    <div style={{ marginTop: '7px' }}>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginRight: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M13.8 15.6c-.2.2-.6.3-.9.3A14.8 14.8 0 012.1 5.1c-.1-.3 0-.6.3-.9l1.5-1.5c.4-.4 1-.4 1.4 0l2.5 2.5c.4.4.4 1 0 1.4v.1l-.7.8c-.4.3-.4.8-.2 1.2.8 1.2 1.9 2.2 3.1 2.9 0 0 .8-.7 1.3-1.3.4-.4 1-.4 1.4 0l2.5 2.5c.4.4.4 1 0 1.4l-1.4 1.4z"
                        ></path>
                        </svg>
                        {`${props.museumContents.tel_no}`}
                    </div>
                    <div style={{ marginTop: '7px' }}>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginRight: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M9 1.5C4.9 1.5 1.5 4.9 1.5 9s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5S13.1 1.5 9 1.5zm2.7 10c-.2.3-.6.3-.9.1L8.4 9.9V5.8c0-.4.3-.6.6-.6s.6.3.6.6v3.4l1.9 1.4c.3.2.4.6.2.9z"
                        ></path>
                        </svg>
                        {`${props.museumContents.opnng_time || '내용 없음'}`}
                    </div>
                    <div style={{ marginTop: '6px', marginBottom: '45px', cursor: 'pointer' }} onClick={() => {window.open(props.museumContents.hmpg_addr)}}>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginRight: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M10.2 14.3c.5-1.2.8-2.9.8-4.8H7c0 1.9.4 3.6.8 4.8.2.7.5 1.1.8 1.4.2.3.4.3.4.3s.2 0 .4-.3c.3-.3.5-.7.8-1.4zM16 9.5h-4c-.1 2.7-.6 5-1.4 6.3 2.9-.7 5.2-3.2 5.4-6.3zm0-1h-4c-.1-2.7-.6-5-1.4-6.3 2.9.7 5.2 3.2 5.4 6.3zM7.4 2.2C4.5 2.9 2.2 5.4 2 8.5h4c.1-2.7.6-5 1.4-6.3zM2 9.5h4c.1 2.7.6 5 1.4 6.3-2.9-.7-5.2-3.2-5.4-6.3zM9 2s-.2 0-.4.3c-.3.3-.5.7-.8 1.4C7.4 4.9 7 6.6 7 8.5h4c0-1.9-.4-3.6-.8-4.8-.3-.7-.5-1.1-.8-1.4C9.2 2 9 2 9 2z"
                        ></path>
                        </svg>
                        {`${props.museumContents.hmpg_addr.replace('http://','').replace('https://','')}`}
                    </div>
                    <div
                        className={ `${styles.cultureBookStoreInfo}` }
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            paddingBottom: '25px'
                        }}
                    >
                        <div style={{ fontSize: '16px', paddingBottom: '5px' }}>시설</div>
                        <div>{`1. 총면적값 : ${props.museumContents.totar_value || '없음'}`}</div>
                        <div>{`2. 부지면적 : ${props.museumContents.lnd_ar_value || '정보없음'}`}</div>
                        <div>{`3. 특별전시면적값 : ${props.museumContents.specl_dspy_ar_value || '없음'}`}</div>
                        <div>{`4. 개관일자 : ${props.museumContents.opnng_de}`}</div>
                        <div>{`5. 관람인원수(연) : ${props.museumContents.viewng_nmpr_co || '없음'}`}</div>
                        <div>{`6. 일평균관람인원수 : ${props.museumContents.day_avrg_viewng_nmpr_co}`}</div>
                        <div>{`7. 연개관일수(일) : ${props.museumContents.opnng_day_co}`}</div>
                        <div>{`8. 주차가능수 : ${props.museumContents.parkng_posbl_co || '없음'}`}</div>
                        <div>{`9. 비고 : ${props.museumContents.rm_cn || '없음'}`}</div>
                        <div style={{ fontSize: '16px', padding: '20px 0 5px 0' }}>자료</div>
                        <div>{`1. 자료수 : ${props.museumContents.data_co}`}</div>
                        <div>{`2. 지정문화재 등 개수(점) : ${props.museumContents.crlts_co || '없음'}`}</div>
                        <div>{`3. 지정문화재 등 명칭 : ${props.museumContents.crlts_nm || '없음'}`}</div>
                        <div>{`4. 소장유물 유물 개수(건) : ${props.museumContents.hdch_artft_cas_co}`}</div>
                        <div>{`5. 소장유물 유물 개수(점) : ${props.museumContents.hdch_artft_co}`}</div>
                        <div>{`6. 소장유물 종류 : ${props.museumContents.hdch_artft_knd_co}`}</div>
                        <div>{`7. 전시실 유물 교체횟수 : ${props.museumContents.dspyrm_artft_chg_co}`}</div>
                        <div style={{ fontSize: '16px', padding: '20px 0 5px 0' }}>가격(일반)</div>
                        <div>{`1. 무료대상내용 : ${props.museumContents.fre_trget_cn}`}</div>
                        <div>{`2. 일반 관람료(원) : ${props.museumContents.viewng_price || '무료'}`}</div>
                        <div>{`3. 유아관람금액 : ${props.museumContents.infn_viewng_price || '무료'}`}</div>
                        <div>{`4. 초등학생관람금액 : ${props.museumContents.schboy_viewng_price || '무료'}`}</div>
                        <div>{`5. 중학생관람금액 : ${props.museumContents.msklsd_viewng_price || '무료'}`}</div>
                        <div>{`6. 성인관람금액 : ${props.museumContents.adult_viewng_price || '무료'}`}</div>
                        <div>{`7. 단체할인율 : ${props.museumContents.grp_dscnt_rt || '없음'}`}</div>
                        <div>{`8. 기타할인율 : ${props.museumContents.etc_dscnt_rt || '없음'}`}</div>
                        <div>{`9. 할인내용 : ${props.museumContents.dscnt_cn || '없음'}`}</div>
                        <div style={{ fontSize: '16px', padding: '20px 0 5px 0' }}>가격(특별)</div>
                        <div>{`1. 무료특별대상내용 : ${ props.museumContents.fre_specl_viewng_price || '내용 없음' }`}</div>
                        <div>{`2. 특별관람금액 : ${props.museumContents.specl_viewng_price || '무료'}`}</div>
                        <div>{`3. 유아특별관람금액 : ${props.museumContents.infn_specl_viewng_price || '무료'}`}</div>
                        <div>{`4. 초등학생특별관람금액 : ${props.museumContents.schboy_specl_viewng_price || '무료'}`}</div>
                        <div>{`5. 중학생특별관람금액 : ${props.museumContents.msklsd_specl_viewng_price || '무료'}`}</div>
                        <div>{`6. 성인특별관람금액 : ${props.museumContents.adult_specl_viewng_price || '무료'}`}</div>
                        <div>{`7. 단체특별관람율 : ${props.museumContents.grp_specl_viewng_rt || '없음'}`}</div>
                        <div>{`8. 기타특별관람할인내용 : ${props.museumContents.etc_specl_viewng_dscnt_cn || '내용없음'}`}</div>
                        <div>{`9. 기타특별관람할인율 : ${props.museumContents.etc_specl_viewng_dscnt_rt || '내용없음'}`}</div>
                        <div style={{ fontSize: '16px', padding: '20px 0 5px 0' }}>프로그램</div>
                        <div>{`1. 모바일 서비스 제공 여부 : ${props.museumContents.mobile_provd_at === "O" ? "제공" : "제공하지 않음"}`}</div>
                        <div>{`2. 오디오가이드 제공여부 : ${props.museumContents.sound_provd_at === "O" ? "제공" : "제공하지 않음"}`}</div>
                        <div>{`3. 오디오가이드 이용료 : ${props.museumContents.sound_utiliiza_price || "없음"}`}</div>
                        <div>{`4. 기획/특별전(연) : ${props.museumContents.pblprfr_cas_co || '없음'}`}</div>
                        <div>{`5. 프로그램 총계 : ${props.museumContents.tot_progrm_co || '없음'}`}</div>
                        <div>{`6. 체험 프로그램 정기 프로그램 : ${props.museumContents.fdrm_exprn_progrm_co || '내용없음'}`}</div>
                        <div>{`7. 체험 프로그램 비정기 프로그램 : ${props.museumContents.non_fdrm_exprn_progrm_co || '내용없음'}`}</div>
                        <div>{`8. 강좌 프로그램 : ${props.museumContents.progrm_co || '없음'}`}</div>
                        <div>{`9. 답사 프로그램 : ${props.museumContents.out_progrm_co || '없음'}`}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CultureMuseumInfo;