import styles from '../../assets/css/culture/CultureMain.module.css';
import UseFetch from '../../hooks/useFetch';

// 컴포넌트 객체 생성
import SideTab from '../common/SideTab';
import CommonMap from '../common/CommonMap';

function CultureMain() {
    // 테스트를 위한 함수
    const test = UseFetch(`http://localhost:9002/seoul/culture/test`);
    console.log(test);

    return (
        <div className={ styles.cultureContainer }>
            <CommonMap></CommonMap>
            <SideTab></SideTab>
        </div>
    );
}

export default CultureMain;