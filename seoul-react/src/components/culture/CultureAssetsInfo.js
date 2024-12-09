import styles from '../../assets/css/culture/CultureMain.module.css';

function CultureAssetsInfo(props) {
    return (
        props.assetContents && props.assetContents.ccbaMnm1 && <div className={ `${styles.cultureBookStoreContainer}` }>
            <div className={ `${styles.cultureBookStoreFrame}` } style={{ overflow: 'scroll', opacity: '1' }}>
                <div className={ `${styles.cultureBookStoreHeader}` }>
                    {`${props.assetContents.ccmaName} (${props.assetContents.ccsiName})`}
                </div>
                <div className={ `${styles.cultureBookStoreName}` }>
                    {`${props.assetContents.ccbaMnm1} (${props.assetContents.ccbaMnm2})`}
                </div>
                <div className={ `${styles.flexCenter}` }>
                    <img
                        src={props.assetContents.imageUrl}
                        width="50%"
                        style={{ marginTop: '20px' }}
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
                        {`${props.assetContents.ccbaLcad}`}
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
                        <div>{`1. 분류 : ${props.assetContents.gcodeName} - ${props.assetContents.bcodeName} - ${props.assetContents.mcodeName} - ${props.assetContents.scodeName}`}</div>
                        <div>{`2. 수량 : ${props.assetContents.ccbaQuan}`}</div>
                        <div>{`3. 지정(등록일) : ${props.assetContents.ccbaAsdt && props.assetContents.ccbaAsdt.slice(0,4)}년 ${props.assetContents.ccbaAsdt && props.assetContents.ccbaAsdt.slice(4,6)}월 ${props.assetContents.ccbaAsdt && props.assetContents.ccbaAsdt.slice(6)}일`}</div>
                        <div>{`4. 시대 : ${props.assetContents.ccceName || '내용 없음'}`}</div>
                        <div>{`5. 소유자 : ${props.assetContents.ccbaPoss}`}</div>
                        <div>{`6. 관리자 : ${props.assetContents.ccbaAdmin}`}</div>
                        <div style={{ fontSize: '16px', padding: '30px 0 10px 0' }}>내용</div>
                        <div>{`${props.assetContents.content || '내용 없음'}`}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CultureAssetsInfo;