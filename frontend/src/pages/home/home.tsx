import styles from './style.module.css'
import '../../shared/assets/styles/global.css'
import { debugFunc } from '../../shared/lib/debugUtils';
import { useEffect, useState } from 'react';
import deviceOnIcon from '../../shared/assets/images/icons/deviceOn.svg';
import deviceOffIcon from '../../shared/assets/images/icons/deviceOff.svg';
import deviceLoadIcon from '../../shared/assets/images/icons/deviceLoad.svg';

const API_URL = 'http://localhost:3001';

type Device = {
    id: number;
    name: string;
    type: string;
    location: string;
    isOn?: boolean;
};

const deviceTypeNames: Record<string, string> = {
    light: 'Свет',
    kettle: 'Чайник',
    socket: 'Розетка',
};

const Devices = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [devices, setDevices] = useState<Device[]>([]);
    const [deviceName, setDeviceName] = useState('');
    const [deviceType, setDeviceType] = useState('light');
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [deletingDeviceId, setDeletingDeviceId] = useState<number | null>(null);
    const [togglingDeviceId, setTogglingDeviceId] = useState<number | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDevices = async () => {
            try {
                const response = await fetch(`${API_URL}/devices`);

                if (!response.ok) {
                    throw new Error('Не удалось загрузить устройства');
                }

                const loadedDevices = await response.json();
                setDevices(loadedDevices);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Не удалось загрузить устройства');
            } finally {
                setIsLoading(false);
            }
        };

        loadDevices();
    }, []);

    const handleClickOpen = () => {
        setIsOpen(!isOpen);
        debugFunc('click on add button', 'debug')
    };
    
    const closeModal = () => {
        setIsOpen(false);
    };

    const handleAddDevice = async () => {
        if (isAdding) return;

        const trimmedName = deviceName.trim();

        if (!trimmedName) {
            setError('Введите название устройства');
            return;
        }

        try {
            setError('');
            setIsAdding(true);

            const response = await fetch(`${API_URL}/devices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: trimmedName,
                    type: deviceType,
                    location: 'home',
                }),
            });

            if (!response.ok) {
                throw new Error('Не удалось добавить устройство');
            }

            const createdDevice = await response.json();
            setDevices((currentDevices) => [...currentDevices, createdDevice]);
            setDeviceName('');
            setDeviceType('light');
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось добавить устройство');
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteDevice = async (id: number) => {
        if (deletingDeviceId !== null) return;

        try {
            setError('');
            setDeletingDeviceId(id);

            const response = await fetch(`${API_URL}/devices/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Не удалось удалить устройство');
            }

            setDevices((currentDevices) => currentDevices.filter((device) => device.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось удалить устройство');
        } finally {
            setDeletingDeviceId(null);
        }
    };

    const handleToggleDevice = async (id: number) => {
        if (togglingDeviceId !== null) return;

        try {
            setError('');
            setTogglingDeviceId(id);

            const response = await fetch(`${API_URL}/devices/${id}/toggle`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                throw new Error('Не удалось изменить состояние устройства');
            }

            const updatedDevice = await response.json();
            setDevices((currentDevices) => currentDevices.map((device) => (
                device.id === id ? updatedDevice : device
            )));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось изменить состояние устройства');
        } finally {
            setTogglingDeviceId(null);
        }
    };

    return(
        <div className={styles.deviceList}>
                    {isLoading && <div className={styles.deviceMessage}>Загрузка устройств...</div>}
                    {!isLoading && devices.length === 0 && (
                        <div className={styles.deviceMessage}>Устройств пока нет</div>
                    )}
                    {devices.map((device) => (
                        <div className={styles.device} key={device.id}>
                            <div className={styles.deviceImg}></div>
                            <div className={styles.deviceText}>
                                <div className={styles.deviceName}>{device.name}</div>
                                <div className={styles.deviceSubs}>
                                    {deviceTypeNames[device.type] ?? device.type}
                                </div>
                            </div>
                            <button
                                className={styles.deleteDeviceButton}
                                onClick={() => handleDeleteDevice(device.id)}
                                disabled={deletingDeviceId === device.id}
                                title="Удалить устройство"
                            >
                            </button>
                            <button
                                className={styles.deviceStatusButton}
                                onClick={() => handleToggleDevice(device.id)}
                                disabled={togglingDeviceId === device.id}
                                title={(device.isOn ?? true) ? 'Выключить устройство' : 'Включить устройство'}
                            >
                                <img
                                    className={styles.deviceStatus}
                                    src={togglingDeviceId === device.id ? deviceLoadIcon : (device.isOn ?? true) ? deviceOnIcon : deviceOffIcon}
                                    alt={(device.isOn ?? true) ? 'Устройство включено' : 'Устройство выключено'}
                                />
                            </button>
                        </div>
                    ))}
                    
                    <div 
                        className={styles.addDeviceButton} 
                        onClick={handleClickOpen}>
                            +
                    </div>
                    {isOpen && (
                            <div className={styles.modal}>
                                <h3>Добавить устройство</h3>

                                <input
                                    placeholder="Название"
                                    value={deviceName}
                                    onChange={(event) => setDeviceName(event.target.value)}
                                />

                                <select
                                    value={deviceType}
                                    onChange={(event) => setDeviceType(event.target.value)}
                                >
                                    <option value="light">Свет</option>
                                    <option value="kettle">Чайник</option>
                                    <option value="socket">Розетка</option>
                                </select>

                                {error && <div className={styles.deviceError}>{error}</div>}

                                <button className={styles.modalButton} onClick={handleAddDevice} disabled={isAdding}>
                                    {isAdding ? 'Добавляю...' : 'Добавить'}
                                </button>
                                <button className={styles.modalButton} onClick={closeModal}>
                                    Закрыть
                                </button>                            
                            </div>
                    )}
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
