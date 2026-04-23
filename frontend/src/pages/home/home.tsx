import styles from './style.module.css'
import React from 'react';  
import '../../shared/assets/styles/global.css'

function Home() {
    return (
        <div className={styles.mainBlock}>

            <div className={styles.nav}>

                <div className={styles.navHeader}>
                    <div className={styles.profilePicture} style={{ backgroundImage: `url.(${'ыыыыКартинка'})`, backgroundSize: '50px 50px' }}>img</div>
                    <div className={styles.navSigns}>
                        <div className={styles.userName}>userNamePlaceHolder</div>
                        <div className={styles.locationsList}>
                            <div className={styles.locationsSearch}>Название локации...</div>
                            <div className={styles.arrowImg}></div>
                        </div>
                    </div>
                </div>

                <div className={styles.deviceList}>
                    <div className={styles.device}>
                        <div className={styles.deviceImg}></div>
                        <div className={styles.deviceText}>
                            <div className={styles.deviceName}>Название устройства</div>
                            <div className={styles.deviceSubs}>Описание устройства</div>
                        </div>
                        <img className={styles.deviceStatus} src='src\shared\assets\images\icons\deviceOn.svg'></img>
                    </div>
                    <div className={styles.device}>
                        <div className={styles.deviceImg}></div>
                        <div className={styles.deviceText}>
                            <div className={styles.deviceName}>Название устройства</div>
                            <div className={styles.deviceSubs}>Описание устройства</div>
                        </div>
                        <img className={styles.deviceStatus} src='src\shared\assets\images\icons\deviceOn.svg'></img>
                    </div>
                    <div className={styles.device}>
                        <div className={styles.deviceImg}></div>
                        <div className={styles.deviceText}>
                            <div className={styles.deviceName}>Название устройства</div>
                            <div className={styles.deviceSubs}>Описание устройства</div>
                        </div>
                        <img className={styles.deviceStatus} src='src\shared\assets\images\icons\deviceOn.svg'></img>

                    </div>
                    <div className={styles.device}>
                        <div className={styles.deviceImg}></div>
                        <div className={styles.deviceText}>
                            <div className={styles.deviceName}>Название устройства</div>
                            <div className={styles.deviceSubs}>Описание устройства</div>
                        </div>
                        <img className={styles.deviceStatus} src='src\shared\assets\images\icons\deviceOn.svg'></img>

                    </div>
                    <div className={styles.device}>
                        <div className={styles.deviceImg}></div>
                        <div className={styles.deviceText}>
                            <div className={styles.deviceName}>Название устройства</div>
                            <div className={styles.deviceSubs}>Описание устройства</div>
                        </div>
                        <img className={styles.deviceStatus} src='src\shared\assets\images\icons\deviceOn.svg'></img>

                    </div>
                    <div className={styles.device}>
                        <div className={styles.deviceImg}></div>
                        <div className={styles.deviceText}>
                            <div className={styles.deviceName}>Название устройства</div>
                            <div className={styles.deviceSubs}>Описание устройства</div>
                        </div>
                        <img className={styles.deviceStatus} src='src\shared\assets\images\icons\deviceOn.svg'></img>

                    </div>
                    <div className={styles.device}>
                        <div className={styles.deviceImg}></div>
                        <div className={styles.deviceText}>
                            <div className={styles.deviceName}>Название устройства</div>
                            <div className={styles.deviceSubs}>Описание устройства</div>
                        </div>
                        <img className={styles.deviceStatus} src='src\shared\assets\images\icons\deviceOn.svg'></img>

                    </div>
                    <div className={styles.device}>
                        <div className={styles.deviceImg}></div>
                        <div className={styles.deviceText}>
                            <div className={styles.deviceName}>Название устройства</div>
                            <div className={styles.deviceSubs}>Описание устройства</div>
                        </div>
                        <img className={styles.deviceStatus} src='src\shared\assets\images\icons\deviceOn.svg'></img>

                    </div>
                    <div className={styles.device}>
                        <div className={styles.deviceImg}></div>
                        <div className={styles.deviceText}>
                            <div className={styles.deviceName}>Название устройства</div>
                            <div className={styles.deviceSubs}>Описание устройства</div>
                        </div>
                        <img className={styles.deviceStatus} src='src\shared\assets\images\icons\deviceOn.svg'></img>

                    </div>
                </div>

            </div>

            <div className={styles.vidgets}>
                {/* <div className={styles.vidgetSetingsButton}></div> */}
                <div className={styles.vidget}>
                    <div className={styles.deviceName}>Кондиционер в 🛏️</div>
                </div>
                <div className={styles.vidget}></div>
                <div className={styles.vidget}></div>
                <div className={styles.vidget}></div>
                <div className={styles.vidget}></div>
                <div className={styles.vidget}></div>
            </div>
    
        </div>
    )
}

export default Home