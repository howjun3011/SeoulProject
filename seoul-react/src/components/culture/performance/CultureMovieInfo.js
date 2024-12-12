import styles from '../../../assets/css/culture/CultureMain.module.css';

function CultureSpaceInfo(props) {
    if (props.spaceContents && props.spaceContents.movie_id) {
        return (
            props.spaceContents && props.spaceContents !== undefined && <div className={ `${styles.cultureBookStoreContainer}` }>
                <div className={ `${styles.cultureBookStoreFrame}` } style={{ overflow: 'scroll', opacity: '1' }}>
                    <div className={ `${styles.cultureBookStoreHeader}` }>
                        {`${props.spaceContents.cl_nm} (${props.spaceContents.mlsfc_nm})`}
                    </div>
                    <div className={ `${styles.cultureBookStoreName}` }>
                        {`${props.spaceContents.poi_nm}`} {`${props.spaceContents.bhf_nm}`} {`${props.spaceContents.asstn_nm}`}
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
                            {`${props.spaceContents.ctprvn_nm}`} {`${props.spaceContents.signgu_nm}`} {`${props.spaceContents.rdnmadr_nm}`} {`${props.spaceContents.buld_no}`}
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
                            <div style={{ fontSize: '16px', padding: '50px 0 10px 0' }}>상세 정보</div>
                            <div>{`1. 출처 : ${props.spaceContents.origin_nm || '내용 없음'}`}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            props.spaceContents && props.spaceContents !== undefined && <div className={ `${styles.cultureBookStoreContainer}` }>
                <div className={ `${styles.cultureBookStoreFrame}` } style={{ overflow: 'scroll', opacity: '1' }}>
                    <div className={ `${styles.cultureBookStoreHeader}` }>
                        {`${props.spaceContents.cl_nm} (${props.spaceContents.business_status === "OPERATIONAL" ? '운영중' : '운영중지'})`}
                    </div>
                    <div className={ `${styles.cultureBookStoreName}` }>
                        {`${props.spaceContents.name}`}
                    </div>
                    <div className={ `${styles.cultureBookStoreCenter}` }>
                        <div style={{ fontSize: '18px', paddingBottom: '20px' }}>정보</div>
                        <div style={{ display: 'flex' }}>
                            <svg
                                viewBox="0 0 18 18"
                                aria-hidden="true"
                                style={{ marginRight: '10px', width: '15px', fill: '#a0a0a0' }}
                            ><path d="M9 1C5.4 1 2.5 3.7 2.5 7.1c0 1.2.4 2.3 1 3.3l5.1 6.1c.2.2.6.2.8 0l5.1-6.1c.7-1 1-2.1 1-3.3C15.5 3.7 12.6 1 9 1zm0 8c-.8 0-1.5-.7-1.5-1.5S8.2 6 9 6s1.5.7 1.5 1.5S9.8 9 9 9z"
                            ></path>
                            </svg>
                            <div style={{ width: '90%', whiteSpace: 'normal' }}>{`${props.spaceContents.formatted_address} `}<span style={{ fontWeight: '700' }}>{ props.spaceContents.address_components ? `(${props.spaceContents.address_components[props.spaceContents.address_components.length-1].long_name})` : '' }</span></div>
                        </div>
                        <div style={{ marginTop: '14px' }}>
                            <svg
                                viewBox="0 0 18 18"
                                aria-hidden="true"
                                style={{ marginRight: '10px', width: '15px', fill: '#a0a0a0' }}
                            ><path d="M13.8 15.6c-.2.2-.6.3-.9.3A14.8 14.8 0 012.1 5.1c-.1-.3 0-.6.3-.9l1.5-1.5c.4-.4 1-.4 1.4 0l2.5 2.5c.4.4.4 1 0 1.4v.1l-.7.8c-.4.3-.4.8-.2 1.2.8 1.2 1.9 2.2 3.1 2.9 0 0 .8-.7 1.3-1.3.4-.4 1-.4 1.4 0l2.5 2.5c.4.4.4 1 0 1.4l-1.4 1.4z"
                            ></path>
                            </svg>
                            {`${props.spaceContents.formatted_phone_number || '내용없음'}`}
                        </div>
                        <div style={{ marginTop: '14px', cursor: 'pointer', textOverflow: 'ellipsis', overflow: 'hidden' }} onClick={() => {
                            if (props.spaceContents.website) {window.open(props.spaceContents.website)}
                            else {alert('홈페이지 정보가 없습니다.')}
                        }}>
                            <svg
                                viewBox="0 0 18 18"
                                aria-hidden="true"
                                style={{ marginRight: '10px', width: '15px', fill: '#a0a0a0' }}
                            ><path d="M10.2 14.3c.5-1.2.8-2.9.8-4.8H7c0 1.9.4 3.6.8 4.8.2.7.5 1.1.8 1.4.2.3.4.3.4.3s.2 0 .4-.3c.3-.3.5-.7.8-1.4zM16 9.5h-4c-.1 2.7-.6 5-1.4 6.3 2.9-.7 5.2-3.2 5.4-6.3zm0-1h-4c-.1-2.7-.6-5-1.4-6.3 2.9.7 5.2 3.2 5.4 6.3zM7.4 2.2C4.5 2.9 2.2 5.4 2 8.5h4c.1-2.7.6-5 1.4-6.3zM2 9.5h4c.1 2.7.6 5 1.4 6.3-2.9-.7-5.2-3.2-5.4-6.3zM9 2s-.2 0-.4.3c-.3.3-.5.7-.8 1.4C7.4 4.9 7 6.6 7 8.5h4c0-1.9-.4-3.6-.8-4.8-.3-.7-.5-1.1-.8-1.4C9.2 2 9 2 9 2z"
                            ></path>
                            </svg>
                            { props.spaceContents.website && props.spaceContents.website.replace('http://','').replace('https://','').replace('/','')}
                            { !props.spaceContents.website && '내용 없음'}
                        </div>
                        <div style={{ marginTop: '14px', display: 'flex' }}>
                            <svg
                                viewBox="0 0 18 18"
                                aria-hidden="true"
                                style={{ marginRight: '5px', width: '20px', height: '20px', fill: '#a0a0a0' }}
                            ><path d="M8.26 4.68h4.26a.48.48 0 01.28.87L9.35 8.02l1.33 4.01a.48.48 0 01-.18.54.48.48 0 01-.56 0l-3.44-2.5-3.44 2.5a.48.48 0 01-.74-.54l1.33-4L.2 5.54a.48.48 0 01.28-.87h4.26l1.3-4a.48.48 0 01.92 0l1.3 4z"
                            ></path>
                            </svg>
                            <div>{`${props.spaceContents.rating || '내용없음'}`} {`(${props.spaceContents.user_ratings_total || '0'})`}</div>
                        </div>
                        <div style={{ marginTop: '14px', display: 'flex' }}>
                            <svg
                                viewBox="0 0 18 18"
                                aria-hidden="true"
                                style={{ marginRight: '10px', width: '15px', height: '15px', fill: '#a0a0a0' }}
                            ><path d="M9 1.5C4.9 1.5 1.5 4.9 1.5 9s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5S13.1 1.5 9 1.5zm2.7 10c-.2.3-.6.3-.9.1L8.4 9.9V5.8c0-.4.3-.6.6-.6s.6.3.6.6v3.4l1.9 1.4c.3.2.4.6.2.9z"
                            ></path>
                            </svg>
                            <div style={{ lineHeight: '22px' }}>
                                {
                                    props.spaceContents.current_opening_hours && props.spaceContents.current_opening_hours.weekday_text.map((data, index) => {
                                        return (
                                            <div>{data}</div>
                                        );
                                    })
                                }
                                { !props.spaceContents.current_opening_hours && '내용 없음'}
                            </div>
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
                            <div style={{ fontSize: '16px', padding: '50px 0 10px 0' }}>상세 정보</div>
                            <div>{`1. 휠체어 이용가능 여부 : ${props.spaceContents.wheelchair_accessible_entrance ? '가능' : '불가능'}`}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CultureSpaceInfo;