import styles from '../../assets/css/culture/CultureMain.module.css';

function CultureBooKStore(props) {
    return (
        <div className={ `${styles.cultureBookStoreContainer}` }>
            <div className={ `${styles.cultureBookStoreFrame}` }>
                <div className={ `${styles.cultureBookStoreHeader}` }>
                    {`${props.bookContents.lclas_nm} (${props.bookContents.mlsfc_nm})`}
                </div>
                <div className={ `${styles.cultureBookStoreName}` }>
                    {`${props.bookContents.fclty_nm}`}
                </div>
                <div className={ `${styles.cultureBookStoreCenter}` }>
                    <div style={{ fontSize: '17px', paddingBottom: '10px' }}>정보</div>
                    <div className={ `${styles.cultureBookStoreInfo}` }>{`1. ${props.bookContents.optn_dc}`}</div>
                    <div
                        className={ `${styles.cultureBookStoreInfo}` }
                        style={{ padding: '10px 0 20px 0' }}
                    >
                        {`2. ${props.bookContents.adit_dc}`}
                    </div>
                    <div>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginRight: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M9 1C5.4 1 2.5 3.7 2.5 7.1c0 1.2.4 2.3 1 3.3l5.1 6.1c.2.2.6.2.8 0l5.1-6.1c.7-1 1-2.1 1-3.3C15.5 3.7 12.6 1 9 1zm0 8c-.8 0-1.5-.7-1.5-1.5S8.2 6 9 6s1.5.7 1.5 1.5S9.8 9 9 9z"
                        ></path>
                        </svg>
                        {`${props.bookContents.fclty_road_nm_addr} `}<span style={{ fontWeight: '700' }}>{`(${props.bookContents.zip_no})`}</span>
                    </div>
                    <div style={{ margin: '4px 0' }}>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginRight: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M13.8 15.6c-.2.2-.6.3-.9.3A14.8 14.8 0 012.1 5.1c-.1-.3 0-.6.3-.9l1.5-1.5c.4-.4 1-.4 1.4 0l2.5 2.5c.4.4.4 1 0 1.4v.1l-.7.8c-.4.3-.4.8-.2 1.2.8 1.2 1.9 2.2 3.1 2.9 0 0 .8-.7 1.3-1.3.4-.4 1-.4 1.4 0l2.5 2.5c.4.4.4 1 0 1.4l-1.4 1.4z"
                        ></path>
                        </svg>
                        {`${props.bookContents.tel_no}`}
                    </div>
                    <div style={{ marginTop: '16px' }}>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginBottom: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M9 1.5C4.9 1.5 1.5 4.9 1.5 9s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5S13.1 1.5 9 1.5zm2.7 10c-.2.3-.6.3-.9.1L8.4 9.9V5.8c0-.4.3-.6.6-.6s.6.3.6.6v3.4l1.9 1.4c.3.2.4.6.2.9z"
                        ></path>
                        </svg>
                        <div>
                            <div>{`1. 평일 개점시간 : ${props.bookContents.workday_opn_bsns_time || '내용 없음'}`}</div>
                            <div>{`2. 평일 마감시간 : ${props.bookContents.workday_clos_time || '내용 없음'}`}</div>
                            <div>{`3. 토요일 개점시간 : ${props.bookContents.sat_opn_bsns_time || '휴무'}`}</div>
                            <div>{`4. 토요일 마감시간 : ${props.bookContents.sat_clos_time || '휴무'}`}</div>
                            <div>{`5. 일요일 개점시간 : ${props.bookContents.sun_opn_bsns_time || '휴무'}`}</div>
                            <div>{`6. 일요일 마감시간 : ${props.bookContents.sun_clos_time || '휴무'}`}</div>
                            <div>{`7. 휴무일 개점시간 : ${props.bookContents.rstde_opn_bsns_time || '휴무'}`}</div>
                            <div>{`8. 휴무일 마감시간 : ${props.bookContents.rstde_clos_time || '휴무'}`}</div>
                            <div>{`9. 휴무일 안내내용 : ${props.bookContents.rstde_guid_cn || '내용 없음'}`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CultureBooKStore;