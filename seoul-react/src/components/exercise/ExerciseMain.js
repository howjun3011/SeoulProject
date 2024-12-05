import styles from '../../assets/css/exercise/ExerciseMain.module.css';
import GetFetch from '../../hooks/getFetch';

// 컴포넌트 객체 생성
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';
import { useState } from 'react';

function ExerciseMain() {
    // // 테스트를 위한 함수
    // const test = UseFetch(`http://localhost:9002/seoul/exercise/test`);
    // console.log(test);

    // 탭 클릭 이벤트 처리
    const tabNames = ['러닝', '산책', '수영', '배드민턴', '기타'];
    const [currentTabType, setCurrentTabType] = useState([true, false]);

    return (
        <div className={ styles.exerciseContainer }>
            <CommonMap mapLevel={ 6 }></CommonMap>
            <SideTab>
                <div className={ styles.exerciseFrame }>
                    <div className={ styles.exerciseHeader }>
                        {
                            tabNames.map((tabName, index) => {
                                return (
                                    <div 
                                        className={ `${styles.exerciseHeaderCompontent} ${styles.flexCenter}` }
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

export default ExerciseMain;