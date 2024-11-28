import styles from "../../assets/css/health/HealthMain.module.css";
import { Map } from "react-kakao-maps-sdk";
import UseFetch from "../../hooks/useFetch";

function HealthMain() {
    const test = UseFetch(`http://localhost:9002/seoul/health/test`);
    console.log(test);

    return (
        <Map className={styles.healthMap} center={{lat: 37.5630, lng: 126.9793}} level={5} />
    );
}

export default HealthMain;