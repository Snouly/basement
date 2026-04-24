import styles from './style.module.css'
import React from 'react';  
import '../../shared/assets/styles/global.css'
import { debugFunc, isDebugOn } from '../../shared/lib/debugUtils';
import { use, useState, type ChangeEvent } from 'react';


const Devices = () => {
    const handleClick = (event: MouseEvent) => {
        // тут написать функцию открывающую окошко с добавлением девайса
        debugFunc('click on add button', 'debug')
    }

    // const {messages, addMessage} = useMessages(useShallow(state=>({
    //     messages: state.messages,
    //     addMessage: state.addMessage
    // })))

    // const handleAddDevice = () => {
    //     if (message.trim() !== '') {
    //         addMessage({
    //             messageId: uuidv4(), 
    //             chatId: uuidv4(), 
    //             isSenderYou: true, 
    //             messageSenderId: `убери это ---> ${uuidv4()}`, 
    //             messageText: message,  
    //             messageSendTime: `${dayjs().format('HH:mm')}`
    //         })
    //         setMessage("")

    //         if (textareaRef.current) {
    //             textareaRef.current.focus();
    //         }

    //         debugFunc('message sended', 'debug')
    //     }
    // }

    return(
        <div className={styles.deviceList}>
                    <div className={styles.device}>
                        <div className={styles.deviceImg}></div>
                        <div className={styles.deviceText}>
                            <div className={styles.deviceName}>Название устройства</div>
                            <div className={styles.deviceSubs}>Описание устройства</div>
                        </div>
                        <img className={styles.deviceStatus} src='src\shared\assets\images\icons\deviceOn.svg'></img>
                    </div>
                    
                    <div 
                        className={styles.addDeviceButton} 
                        onClick={handleClick}>
                            +
                    </div>
                </div>
    )


}

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

                <Devices></Devices>

            </div>

            <div className={styles.vidgets}>
                <div 
                    className={styles.vidgetSetingsButton}
                    // onClick={handleClick}
                ></div>
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