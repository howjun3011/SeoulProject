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

        const menuElement = document.querySelector(`.${ styles.mainHeader }`);
        const centerElement = document.querySelector(`.${ styles.mainCenter }`);
        console.log(menuElement);

        if (centerElement && menuElement) {
            console.log("complete");
            const menuHeight = menuElement.clientHeight;
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
                <div className={ styles.mainExplanation }>서울시 관련 공공 데이터 제공 서비스</div>
                { props.menuNames.map((menuName, index) => {
                    return (
                        <div key={ index } className={ `${styles.mainComponent}` }
                             onClick={() => { navigate(`${props.addressNames[index]}`); }}>
                            <div className={ styles.componentFontSetting }>
                                { menuName }
                                <div className={ styles.componentEngFontSetting }>
                                    { props.addressNames[index].charAt(0).toUpperCase() + props.addressNames[index].slice(1) }
                                </div>
                            </div>
                            <div className={ `${styles.componentImgContainer} ${styles.flexCenter}` }>
                                <img
                                    className={ styles.componentImg }
                                    src={ `/images/main/${props.addressNames[index]}.png` }
                                    alt={ menuName }
                                />
                            </div>
                        </div>
                    );
                }) }
            </div>
        </>
    );
}

export default Home;