import styles from '../../assets/css/culture/CultureMain.module.css';
import UseFetch from '../../hooks/useFetch';

// 컴포넌트 객체 생성
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import { useState } from 'react';

function CultureMain() {
    // 테스트를 위한 함수
    const test = UseFetch(`http://localhost:9002/seoul/culture/test`);
    console.log(test);

    // 탭 클릭 이벤트 처리
    const tabNames = ['책', '박물관', '문화재', '공연'];
    const [currentTabType, setCurrentTabType] = useState([true, false, false, false]);

    return (
        <div className={ styles.cultureContainer }>
            <CommonMap mapLevel={ 6 }></CommonMap>
            <SideTab>
                <div className={ styles.cultureFrame }>
                    <div className={ styles.cultureHeader }>
                        {
                            tabNames.map((tabName, index) => {
                                return (
                                    <div 
                                        className={ `${styles.cultureHeaderCompontent} ${styles.flexCenter}` }
                                        style={{
                                            backgroundColor: currentTabType[index] ? '#a0a0a0' : '#b8b8b8',
                                            fontWeight: currentTabType[index] ? '600' : '400'
                                        }}
                                        onClick={() => {
                                            let temp = [false, false, false, false];
                                            temp[index] = true;
                                            setCurrentTabType(temp);
                                        }}
                                    >
                                        {tabName}
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </SideTab>
        </div>
    );
}

export default CultureMain;