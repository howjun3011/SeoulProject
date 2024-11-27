import { useEffect } from 'react';
import styles from '../../assets/css/main/MainLayout.module.css';
import { useLocation, useNavigate } from 'react-router-dom';

function MainLayout(props) {
    // 리사이즈 함수
    function executeResize() {
        document.addEventListener("DOMContentLoaded", resize());
        window.addEventListener("resize", resize());
    }
    
    function resize() {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const menuElement = document.querySelector(`.${ styles.mainMenu }`);
        const centerElement = document.querySelector(`.${ styles.mainCenter }`);

        if (menuElement) {
            menuElement.style.height = `${ windowHeight }px`;
        }

        if (centerElement) {
            const menuWidth = menuElement.scrollWidth;
            
            centerElement.style.width = `${ windowWidth-menuWidth }px`;
            centerElement.style.height = `${ windowHeight }px`;
        }
    }

    useEffect(() => {
        executeResize();
    });

    // 홈화면이 아니라면 사이드바 렌더링하는 함수
    const location = useLocation();
    const shouldShowSidebar = (location.pathname !== '/seoul') && (location.pathname !== '/seoul/');

    // 라우터 이동 함수
    const navigate = useNavigate();

    if (shouldShowSidebar) {
        return (
            <div className={ styles.mainFrame }>
                <div className={ `${ styles.mainMenu } ${ styles.flexCenter }` }>
                    <div className={ styles.menuLogo } onClick={() => { navigate(`seoul`); }}>
                        ❤︎
                    </div>
                    <div className={ styles.mainMenuContainer }>
                        { props.menuNames.map((menuName, index) => {
                            return (
                                <div key={ index } className={ `${styles.mainComponent} ${styles.flexCenter}` }
                                     onClick={() => { navigate(`seoul/${props.addressNames[index]}`); }}>
                                    <div className={ styles.componentFontSetting }>{ menuName }</div>
                                </div>
                            );
                        }) }
                    </div>
                </div>
                <div className={ styles.mainCenter }>
                    { props.children }
                </div>
            </div>
        );
    } else {
        return (
            <>
                { props.children }
            </>
        );
    }
}

export default MainLayout;