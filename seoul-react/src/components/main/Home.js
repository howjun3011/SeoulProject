import { useEffect } from 'react';
import styles from '../../assets/css/main/Home.module.css';
import { useNavigate } from 'react-router-dom';

function Home(props) {
    // 리사이즈 함수
    function executeResize() {
        document.addEventListener("DOMContentLoaded", resize());
        window.addEventListener("resize", resize());
    }
    
    function resize() {
        const windowHeight = window.innerHeight;
        const menuHeight = document.querySelector(`.${ styles.mainHeader }`).scrollHeight;

        const centerElement = document.querySelector(`.${ styles.mainCenter }`);

        if (centerElement) {
            centerElement.style.height = `${ windowHeight - menuHeight - 1 }px`;
        }
    }

    useEffect(() => {
        executeResize();
    });

    // 라우터 이동 함수
    const navigate = useNavigate();

    return (
        <>
            <div className={ `${ styles.mainHeader } ${ styles.flexCenter }` }>
                <div className={ styles.headerFontSetting }>I ❤︎ SEOUL</div>
            </div>
            <div className={ styles.mainCenter }>
                { props.menuNames.map((menuName, index) => {
                    return (
                        <div key={ index } className={ `${styles.mainComponent} ${styles.flexCenter}` }
                             onClick={() => { navigate(`${props.addressNames[index]}`); }}>
                            <div className={ styles.componentFontSetting }>{ menuName }</div>
                        </div>
                    );
                }) }
            </div>
        </>
    );
}

export default Home;