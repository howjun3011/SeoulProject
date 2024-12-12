import styles from '../../../assets/css/culture/CultureMain.module.css';

function CultureBookLibrary(props) {
    return (
        <div className={ `${styles.cultureBookStoreContainer}` }>
            <div className={ `${styles.cultureBookStoreFrame}` }>
                <div className={ `${styles.cultureBookStoreHeader}` }>
                    {`${props.bookContents.lbrry_ty_nm} 도서관 ${ props.bookContents.reprsnt_at === 'Y' ? '(대표)' : ''}`}
                </div>
                <div className={ `${styles.cultureBookStoreName}` }>
                    {`${props.bookContents.lbrry_nm}`}
                </div>
                <div className={ `${styles.cultureBookStoreCenter}` }>
                    <div style={{ fontSize: '18px', paddingBottom: '12px' }}>정보</div>
                    <div
                        className={ `${styles.cultureBookStoreInfo}` }
                        style={{ paddingLeft: '6px', cursor: 'pointer', paddingBottom: props.bookContents.fond_mby_value ? '' : '30px' }}
                        onClick={() => {window.open(props.bookContents.hmpg_value)}}
                    >
                        {`1. ${props.bookContents.hmpg_value}`}
                    </div>
                    { props.bookContents.fond_mby_value && <div
                        className={ `${styles.cultureBookStoreInfo}` }
                        style={{ padding: '10px 0 25px 5px' }}
                    >
                        {`2. ${props.bookContents.fond_mby_value} 주도 ${ props.bookContents.opnng_year ? props.bookContents.opnng_year+'년 ' : ''}설립`}
                    </div> }
                    <div>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginRight: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M9 1C5.4 1 2.5 3.7 2.5 7.1c0 1.2.4 2.3 1 3.3l5.1 6.1c.2.2.6.2.8 0l5.1-6.1c.7-1 1-2.1 1-3.3C15.5 3.7 12.6 1 9 1zm0 8c-.8 0-1.5-.7-1.5-1.5S8.2 6 9 6s1.5.7 1.5 1.5S9.8 9 9 9z"
                        ></path>
                        </svg>
                        {`${props.bookContents.lbrry_addr} `}<span style={{ fontWeight: '700' }}>{`(${props.bookContents.zip_no})`}</span>
                    </div>
                    <div style={{ margin: '6px 0' }}>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginRight: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M13.8 15.6c-.2.2-.6.3-.9.3A14.8 14.8 0 012.1 5.1c-.1-.3 0-.6.3-.9l1.5-1.5c.4-.4 1-.4 1.4 0l2.5 2.5c.4.4.4 1 0 1.4v.1l-.7.8c-.4.3-.4.8-.2 1.2.8 1.2 1.9 2.2 3.1 2.9 0 0 .8-.7 1.3-1.3.4-.4 1-.4 1.4 0l2.5 2.5c.4.4.4 1 0 1.4l-1.4 1.4z"
                        ></path>
                        </svg>
                        {`${props.bookContents.tel_no} / (FAX) ${props.bookContents.fax_no}`}
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginBottom: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M9 1.5C4.9 1.5 1.5 4.9 1.5 9s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5S13.1 1.5 9 1.5zm2.7 10c-.2.3-.6.3-.9.1L8.4 9.9V5.8c0-.4.3-.6.6-.6s.6.3.6.6v3.4l1.9 1.4c.3.2.4.6.2.9z"
                        ></path>
                        </svg>
                        <div style={{ paddingLeft: '5px' }}>
                            <div>{`1. ${props.bookContents.opnng_time || '내용 없음'}`}</div>
                            <div style={{ margin: '10px 0 0 -1px', lineHeight: '22px', whiteSpace: 'normal', wordWrap: 'breakWord' }}>{`2. 휴무일 안내내용 : ${props.bookContents.closedon_dc || '내용 없음'}`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CultureBookLibrary;