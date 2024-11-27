import styles from '../../assets/css/culture/CultureMain.module.css';
import { Map } from "react-kakao-maps-sdk";
import UseFetch from '../../hooks/useFetch';

function CultureMain() {
    const test = UseFetch(`http://localhost:9002/seoul/culture/test`);
    console.log(test);

    return (
        <Map
            className={ styles.cultureMap }
            center={{ lat: 37.5630, lng: 126.9793 }}
            level={5}
        />
    );
}

export default CultureMain;