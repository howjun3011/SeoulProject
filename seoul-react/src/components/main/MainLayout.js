import { useEffect, useState } from 'react';
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

    // 사이드바 화면 선택 함수
    const [isSelected, SetIsSelected] = useState([ false, false, false, false, false, false ]);

    useEffect(() => {
        props.addressNames.map((addressName, index) => {
            let temp = [ false, false, false, false, false, false ];
            if (location.pathname.slice(7) === addressName) {
                temp[index] = true;
                SetIsSelected(temp);
            }
        });
    },[location.pathname]);

    if (shouldShowSidebar) {
        return (
            <div className={ styles.mainFrame }>
                <div className={ `${ styles.mainMenu } ${ styles.flexCenter }` }>
                    <div className={ styles.menuLogo } onClick={() => { navigate(`seoul`); }}>
                        <img
                            className={ styles.seoulLogo }
                            src="/images/main/seoul.png"
                            alt="Seoul Logo"
                        />
                    </div>
                    <div className={ styles.mainMenuContainer }>
                        { props.menuNames.map((menuName, index) => {
                            return (
                                <div
                                    key={ index }
                                    className={ `${styles.mainComponent} ${styles.flexCenter}` }
                                    onClick={() => { navigate(`seoul/${props.addressNames[index]}`); }}
                                    style={{
                                        backgroundColor: isSelected[index] ? '#b8b8b8' : '',
                                        borderRadius: isSelected[index] ? '10px' : ''
                                    }}
                                >
                                    <div
                                        className={ styles.componentFontSetting }
                                        style={{
                                            fontWeight: isSelected[index] ? '700' : ''
                                        }}
                                    >
                                        { menuName }
                                    </div>
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