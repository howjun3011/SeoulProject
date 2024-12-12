import styles from '../../../assets/css/culture/CultureMain.module.css';

function CultureSpaceInfo(props) {
    return (
        props.spaceContents !== undefined && props.spaceContents !== null && <div className={ `${styles.cultureBookStoreContainer}` }>
            <div className={ `${styles.cultureBookStoreFrame}` } style={{ overflow: 'scroll', opacity: '1' }}>
                <div className={ `${styles.cultureBookStoreHeader}` }>
                    {`${props.spaceContents.culClName} (${props.spaceContents.culGrpName})`}
                </div>
                <div className={ `${styles.cultureBookStoreName}` }>
                    {`${props.spaceContents.culName}`}
                </div>
                <div className={ `${styles.flexCenter}` }>
                    <img
                        src={props.spaceContents.culViewImg1}
                        width="70%"
                        style={{ marginTop: '30px' }}
                    />
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
                        {`${props.spaceContents.culAddr}`}<span style={{ fontWeight: '700' }}> {`(${props.spaceContents.zipCode})`}</span>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginRight: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M13.8 15.6c-.2.2-.6.3-.9.3A14.8 14.8 0 012.1 5.1c-.1-.3 0-.6.3-.9l1.5-1.5c.4-.4 1-.4 1.4 0l2.5 2.5c.4.4.4 1 0 1.4v.1l-.7.8c-.4.3-.4.8-.2 1.2.8 1.2 1.9 2.2 3.1 2.9 0 0 .8-.7 1.3-1.3.4-.4 1-.4 1.4 0l2.5 2.5c.4.4.4 1 0 1.4l-1.4 1.4z"
                        ></path>
                        </svg>
                        {`${props.spaceContents.culTel}`}
                    </div>
                    <div style={{ margin: '10px 0 20px 0', cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '95%' }} onClick={() => {window.open(props.spaceContents.culHomeUrl)}}>
                        <svg
                            viewBox="0 0 18 18"
                            aria-hidden="true"
                            style={{ marginRight: '5px', width: '15px', fill: '#a0a0a0' }}
                        ><path d="M10.2 14.3c.5-1.2.8-2.9.8-4.8H7c0 1.9.4 3.6.8 4.8.2.7.5 1.1.8 1.4.2.3.4.3.4.3s.2 0 .4-.3c.3-.3.5-.7.8-1.4zM16 9.5h-4c-.1 2.7-.6 5-1.4 6.3 2.9-.7 5.2-3.2 5.4-6.3zm0-1h-4c-.1-2.7-.6-5-1.4-6.3 2.9.7 5.2 3.2 5.4 6.3zM7.4 2.2C4.5 2.9 2.2 5.4 2 8.5h4c.1-2.7.6-5 1.4-6.3zM2 9.5h4c.1 2.7.6 5 1.4 6.3-2.9-.7-5.2-3.2-5.4-6.3zM9 2s-.2 0-.4.3c-.3.3-.5.7-.8 1.4C7.4 4.9 7 6.6 7 8.5h4c0-1.9-.4-3.6-.8-4.8-.3-.7-.5-1.1-.8-1.4C9.2 2 9 2 9 2z"
                        ></path>
                        </svg>
                        { props.spaceContents.culHomeUrl ? `${props.spaceContents.culHomeUrl.replace('http://','').replace('https://','')}` : '내용 없음'}
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
                        <div style={{ fontSize: '16px', padding: '30px 0 10px 0' }}>상세 정보</div>
                        <div>{`1. 개관일 : ${props.spaceContents.culOpenDay || '내용 없음'}`}</div>
                        <div>{`2. 대표자명 : ${props.spaceContents.ccbaQculOpenNameuan || '내용 없음'}`}</div>
                        <div style={{ fontSize: '16px', padding: '45px 0 10px 0' }}>내용</div>
                        <div>{`${props.spaceContents.culCont || '내용 없음'}`}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CultureSpaceInfo;