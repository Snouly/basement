import styles from './style.module.css'
import '../../shared/assets/styles/global.css'
import { debugFunc } from '../../shared/lib/debugUtils';
import { useEffect, useMemo, useRef, useState } from 'react';
import deviceOnIcon from '../../shared/assets/images/icons/deviceOn.svg';
import deviceOffIcon from '../../shared/assets/images/icons/deviceOff.svg';
import deviceLoadIcon from '../../shared/assets/images/icons/deviceLoad.svg';

const API_URL = 'http://localhost:3001';
const WIDGET_COUNT = 6;
const WIDGETS_STORAGE_KEY = 'basement.widgets';

type DeviceType = 'light' | 'kettle' | 'socket' | 'conditioner';

type Device = {
    id: number;
    name: string;
    type: DeviceType | string;
    location: string;
    isOn?: boolean;
};

type TemperaturePreset = {
    name: string;
    value: number;
};

type LightPreset = {
    name: string;
    brightness: number;
    color: string;
};

type WidgetState = {
    deviceId: number | null;
    temperature: number;
    brightness: number;
    color: string;
    showColorPicker: boolean;
    logs: string[];
    temperaturePresetName: string;
    temperaturePresets: TemperaturePreset[];
    lightPresetName: string;
    lightPresets: LightPreset[];
};

const deviceTypeNames: Record<string, string> = {
    light: 'Свет',
    kettle: 'Чайник',
    socket: 'Розетка',
    conditioner: 'Кондиционер',
};

const createWidgetState = (): WidgetState => ({
    deviceId: null,
    temperature: 24,
    brightness: 70,
    color: '#ffd37a',
    showColorPicker: false,
    logs: [],
    temperaturePresetName: '',
    temperaturePresets: [
        { name: 'Комфорт', value: 22 },
        { name: 'Сон', value: 19 },
    ],
    lightPresetName: '',
    lightPresets: [
        { name: 'Теплый', brightness: 65, color: '#ffd37a' },
        { name: 'Работа', brightness: 100, color: '#ffffff' },
    ],
});

const normalizeWidgetState = (widget: Partial<WidgetState> | undefined): WidgetState => {
    const defaultWidget = createWidgetState();

    return {
        ...defaultWidget,
        ...widget,
        deviceId: typeof widget?.deviceId === 'number' ? widget.deviceId : null,
        temperature: typeof widget?.temperature === 'number' ? widget.temperature : defaultWidget.temperature,
        brightness: typeof widget?.brightness === 'number' ? widget.brightness : defaultWidget.brightness,
        color: typeof widget?.color === 'string' ? widget.color : defaultWidget.color,
        showColorPicker: false,
        logs: Array.isArray(widget?.logs) ? widget.logs.slice(0, 5) : defaultWidget.logs,
        temperaturePresetName: '',
        temperaturePresets: Array.isArray(widget?.temperaturePresets)
            ? widget.temperaturePresets
            : defaultWidget.temperaturePresets,
        lightPresetName: '',
        lightPresets: Array.isArray(widget?.lightPresets) ? widget.lightPresets : defaultWidget.lightPresets,
    };
};

const loadSavedWidgets = (): WidgetState[] => {
    if (typeof window === 'undefined') {
        return Array.from({ length: WIDGET_COUNT }, createWidgetState);
    }

    try {
        const savedWidgets = window.localStorage.getItem(WIDGETS_STORAGE_KEY);

        if (!savedWidgets) {
            return Array.from({ length: WIDGET_COUNT }, createWidgetState);
        }

        const parsedWidgets = JSON.parse(savedWidgets);

        if (!Array.isArray(parsedWidgets)) {
            return Array.from({ length: WIDGET_COUNT }, createWidgetState);
        }

        return Array.from({ length: WIDGET_COUNT }, (_, index) => (
            normalizeWidgetState(parsedWidgets[index])
        ));
    } catch {
        return Array.from({ length: WIDGET_COUNT }, createWidgetState);
    }
};

const addLog = (logs: string[], message: string) => {
    const time = new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return [`${time} - ${message}`, ...logs].slice(0, 5);
};

type DevicesProps = {
    devices: Device[];
    isLoading: boolean;
    error: string;
    isAdding: boolean;
    deletingDeviceId: number | null;
    togglingDeviceId: number | null;
    onAddDevice: (name: string, type: DeviceType) => Promise<void>;
    onDeleteDevice: (id: number) => Promise<void>;
    onToggleDevice: (id: number) => Promise<Device | null>;
};

const Devices = ({
    devices,
    isLoading,
    error,
    isAdding,
    deletingDeviceId,
    togglingDeviceId,
    onAddDevice,
    onDeleteDevice,
    onToggleDevice,
}: DevicesProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [deviceName, setDeviceName] = useState('');
    const [deviceType, setDeviceType] = useState<DeviceType>('light');

    const handleClickOpen = () => {
        setIsOpen(!isOpen);
        debugFunc('click on add button', 'debug')
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleAddDevice = async () => {
        const trimmedName = deviceName.trim();

        if (!trimmedName) return;

        await onAddDevice(trimmedName, deviceType);
        setDeviceName('');
        setDeviceType('light');
        closeModal();
    };

    return (
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
                        onClick={() => onDeleteDevice(device.id)}
                        disabled={deletingDeviceId === device.id}
                        title="Удалить устройство"
                    >
                    </button>
                    <button
                        className={styles.deviceStatusButton}
                        onClick={() => onToggleDevice(device.id)}
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

            <button
                className={styles.addDeviceButton}
                onClick={handleClickOpen}
                type="button"
            >
                +
            </button>
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
                        onChange={(event) => setDeviceType(event.target.value as DeviceType)}
                    >
                        <option value="light">Свет</option>
                        <option value="kettle">Чайник</option>
                        <option value="socket">Розетка</option>
                        <option value="conditioner">Кондиционер</option>
                    </select>

                    {error && <div className={styles.deviceError}>{error}</div>}

                    <button className={styles.modalButton} onClick={handleAddDevice} disabled={isAdding || !deviceName.trim()}>
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

type WidgetSettingsProps = {
    devices: Device[];
    widgets: WidgetState[];
    isOpen: boolean;
    selectedWidget: number;
    selectedDeviceId: string;
    onOpen: () => void;
    onClose: () => void;
    onSelectWidget: (widgetIndex: number) => void;
    onSelectDevice: (deviceId: string) => void;
    onSave: () => void;
};

const WidgetSettings = ({
    devices,
    widgets,
    isOpen,
    selectedWidget,
    selectedDeviceId,
    onOpen,
    onClose,
    onSelectWidget,
    onSelectDevice,
    onSave,
}: WidgetSettingsProps) => (
    <>
        <button
            className={styles.vidgetSetingsButton}
            onClick={onOpen}
            title="Настроить виджеты"
            type="button"
        >
            ⚙
        </button>
        {isOpen && (
            <div className={styles.widgetSettingsMenu}>
                <h3>Настройка виджетов</h3>
                <label>
                    Виджет
                    <select
                        value={selectedWidget}
                        onChange={(event) => onSelectWidget(Number(event.target.value))}
                    >
                        {widgets.map((widget, index) => {
                            const device = devices.find((currentDevice) => currentDevice.id === widget.deviceId);

                            return (
                                <option value={index} key={index}>
                                    Виджет {index + 1}{device ? ` - ${device.name}` : ''}
                                </option>
                            );
                        })}
                    </select>
                </label>
                <label>
                    Устройство
                    <select
                        value={selectedDeviceId}
                        onChange={(event) => onSelectDevice(event.target.value)}
                    >
                        <option value="">Не выбрано</option>
                        {devices.map((device) => (
                            <option value={device.id} key={device.id}>
                                {device.name} - {deviceTypeNames[device.type] ?? device.type}
                            </option>
                        ))}
                    </select>
                </label>
                <div className={styles.modalActions}>
                    <button className={styles.modalButton} onClick={onSave}>
                        Сохранить
                    </button>
                    <button className={styles.modalButton} onClick={onClose}>
                        Закрыть
                    </button>
                </div>
            </div>
        )}
    </>
);

type DeviceWidgetProps = {
    index: number;
    widget: WidgetState;
    device?: Device;
    isToggling: boolean;
    onToggle: (widgetIndex: number, device: Device) => Promise<void>;
    onUpdateWidget: (widgetIndex: number, updater: (widget: WidgetState) => WidgetState) => void;
};

const DeviceWidget = ({
    index,
    widget,
    device,
    isToggling,
    onToggle,
    onUpdateWidget,
}: DeviceWidgetProps) => {
    const colorPickerRef = useRef<HTMLInputElement>(null);

    if (!device) {
        return (
            <div className={styles.vidget}>
                <div className={styles.widgetEmpty}>Виджет {index + 1}</div>
            </div>
        );
    }

    const isOn = device.isOn ?? true;
    const updateWidget = (updater: (widget: WidgetState) => WidgetState) => {
        onUpdateWidget(index, updater);
    };
    const setTemperature = (value: number) => {
        updateWidget((currentWidget) => ({
            ...currentWidget,
            temperature: value,
            logs: addLog(currentWidget.logs, `Температура установлена: ${value} C`),
        }));
    };
    const setBrightness = (value: number) => {
        updateWidget((currentWidget) => ({
            ...currentWidget,
            brightness: value,
            logs: addLog(currentWidget.logs, `Яркость установлена: ${value}%`),
        }));
    };

    const renderLogs = () => (
        <div className={styles.widgetLogs}>
            {widget.logs.length === 0 ? (
                <div className={styles.widgetLogEmpty}>Логов пока нет</div>
            ) : (
                widget.logs.map((log) => (
                    <div className={styles.widgetLogItem} key={log}>{log}</div>
                ))
            )}
        </div>
    );

    return (
        <div className={styles.vidget}>
            <div className={styles.widgetHeader}>
                <div>
                    <div className={styles.deviceName}>{device.name}</div>
                    <div className={styles.deviceSubs}>{deviceTypeNames[device.type] ?? device.type}</div>
                </div>
                <span className={isOn ? styles.widgetStatusOn : styles.widgetStatusOff}>
                    {isOn ? 'Вкл' : 'Выкл'}
                </span>
            </div>

            {device.type === 'socket' && (
                <div className={styles.widgetControls}>
                    <button
                        className={styles.widgetPrimaryButton}
                        onClick={() => onToggle(index, device)}
                        disabled={isToggling}
                    >
                        {isOn ? 'Выключить' : 'Включить'}
                    </button>
                </div>
            )}

            {device.type === 'kettle' && (
                <div className={styles.widgetControls}>
                    <label className={styles.widgetField}>
                        Температура
                        <input
                            type="number"
                            min="40"
                            max="100"
                            value={widget.temperature}
                            onChange={(event) => setTemperature(Number(event.target.value))}
                        />
                    </label>
                    <button
                        className={styles.widgetPrimaryButton}
                        onClick={() => {
                            updateWidget((currentWidget) => ({
                                ...currentWidget,
                                logs: addLog(currentWidget.logs, `Кипячение запущено до ${currentWidget.temperature} C`),
                            }));
                        }}
                    >
                        Кипятить
                    </button>
                    {renderLogs()}
                </div>
            )}

            {device.type === 'conditioner' && (
                <div className={styles.widgetControls}>
                    <button
                        className={styles.widgetPrimaryButton}
                        onClick={() => onToggle(index, device)}
                        disabled={isToggling}
                    >
                        {isOn ? 'Выключить' : 'Включить'}
                    </button>
                    <label className={styles.widgetField}>
                        Температура
                        <input
                            type="number"
                            min="16"
                            max="30"
                            value={widget.temperature}
                            onChange={(event) => setTemperature(Number(event.target.value))}
                        />
                    </label>
                    <select
                        className={styles.widgetSelect}
                        value=""
                        onChange={(event) => {
                            const preset = widget.temperaturePresets.find((currentPreset) => currentPreset.name === event.target.value);

                            if (preset) {
                                setTemperature(preset.value);
                            }
                        }}
                    >
                        <option value="">Выбрать пресет</option>
                        {widget.temperaturePresets.map((preset) => (
                            <option value={preset.name} key={preset.name}>{preset.name} - {preset.value} C</option>
                        ))}
                    </select>
                    <div className={styles.presetCreator}>
                        <input
                            placeholder="Новый пресет"
                            value={widget.temperaturePresetName}
                            onChange={(event) => updateWidget((currentWidget) => ({
                                ...currentWidget,
                                temperaturePresetName: event.target.value,
                            }))}
                        />
                        <button
                            className={styles.widgetSmallButton}
                            onClick={() => {
                                const presetName = widget.temperaturePresetName.trim();

                                if (!presetName) return;

                                updateWidget((currentWidget) => ({
                                    ...currentWidget,
                                    temperaturePresetName: '',
                                    temperaturePresets: [
                                        ...currentWidget.temperaturePresets,
                                        { name: presetName, value: currentWidget.temperature },
                                    ],
                                    logs: addLog(currentWidget.logs, `Пресет создан: ${presetName}`),
                                }));
                            }}
                        >
                            Создать
                        </button>
                    </div>
                    {renderLogs()}
                </div>
            )}

            {device.type === 'light' && (
                <div className={styles.widgetControls}>
                    <button
                        className={styles.widgetPrimaryButton}
                        onClick={() => onToggle(index, device)}
                        disabled={isToggling}
                    >
                        {isOn ? 'Выключить' : 'Включить'}
                    </button>
                    <div className={styles.brightnessRow}>
                        <label className={styles.widgetField}>
                            Яркость: {widget.brightness}%
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={widget.brightness}
                                onChange={(event) => setBrightness(Number(event.target.value))}
                            />
                        </label>
                        <button
                            className={styles.colorButton}
                            style={{ backgroundColor: widget.color }}
                            title="Выбрать цвет"
                            onClick={() => colorPickerRef.current?.click()}
                        >
                        </button>
                    </div>
                    <input
                        className={styles.colorPicker}
                        ref={colorPickerRef}
                        type="color"
                        value={widget.color}
                        onChange={(event) => updateWidget((currentWidget) => ({
                            ...currentWidget,
                            color: event.target.value,
                            logs: addLog(currentWidget.logs, `Цвет изменен: ${event.target.value}`),
                        }))}
                    />
                    <select
                        className={styles.widgetSelect}
                        value=""
                        onChange={(event) => {
                            const preset = widget.lightPresets.find((currentPreset) => currentPreset.name === event.target.value);

                            if (!preset) return;

                            updateWidget((currentWidget) => ({
                                ...currentWidget,
                                brightness: preset.brightness,
                                color: preset.color,
                                logs: addLog(currentWidget.logs, `Пресет применен: ${preset.name}`),
                            }));
                        }}
                    >
                        <option value="">Пресет света</option>
                        {widget.lightPresets.map((preset) => (
                            <option value={preset.name} key={preset.name}>
                                {preset.name} - {preset.brightness}%
                            </option>
                        ))}
                    </select>
                    <div className={styles.presetCreator}>
                        <input
                            placeholder="Новый пресет"
                            value={widget.lightPresetName}
                            onChange={(event) => updateWidget((currentWidget) => ({
                                ...currentWidget,
                                lightPresetName: event.target.value,
                            }))}
                        />
                        <button
                            className={styles.widgetSmallButton}
                            onClick={() => {
                                const presetName = widget.lightPresetName.trim();

                                if (!presetName) return;

                                updateWidget((currentWidget) => ({
                                    ...currentWidget,
                                    lightPresetName: '',
                                    lightPresets: [
                                        ...currentWidget.lightPresets,
                                        {
                                            name: presetName,
                                            brightness: currentWidget.brightness,
                                            color: currentWidget.color,
                                        },
                                    ],
                                    logs: addLog(currentWidget.logs, `Пресет создан: ${presetName}`),
                                }));
                            }}
                        >
                            Создать
                        </button>
                    </div>
                    {renderLogs()}
                </div>
            )}
        </div>
    );
};

function Home() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [deletingDeviceId, setDeletingDeviceId] = useState<number | null>(null);
    const [togglingDeviceId, setTogglingDeviceId] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [widgets, setWidgets] = useState<WidgetState[]>(loadSavedWidgets);
    const [isWidgetSettingsOpen, setIsWidgetSettingsOpen] = useState(false);
    const [selectedWidget, setSelectedWidget] = useState(0);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');

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

    useEffect(() => {
        window.localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(widgets));
    }, [widgets]);

    const devicesById = useMemo(() => (
        new Map(devices.map((device) => [device.id, device]))
    ), [devices]);

    const handleAddDevice = async (name: string, type: DeviceType) => {
        if (isAdding) return;

        if (!name.trim()) {
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
                    name,
                    type,
                    location: 'home',
                }),
            });

            if (!response.ok) {
                throw new Error('Не удалось добавить устройство');
            }

            const createdDevice = await response.json();
            setDevices((currentDevices) => [...currentDevices, createdDevice]);
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
            setWidgets((currentWidgets) => currentWidgets.map((widget) => (
                widget.deviceId === id ? { ...widget, deviceId: null } : widget
            )));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось удалить устройство');
        } finally {
            setDeletingDeviceId(null);
        }
    };

    const handleToggleDevice = async (id: number) => {
        if (togglingDeviceId !== null) return null;

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

            return updatedDevice as Device;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось изменить состояние устройства');
            return null;
        } finally {
            setTogglingDeviceId(null);
        }
    };

    const handleOpenWidgetSettings = () => {
        setSelectedDeviceId(widgets[selectedWidget].deviceId ? String(widgets[selectedWidget].deviceId) : '');
        setIsWidgetSettingsOpen(true);
    };

    const handleSelectWidget = (widgetIndex: number) => {
        setSelectedWidget(widgetIndex);
        setSelectedDeviceId(widgets[widgetIndex].deviceId ? String(widgets[widgetIndex].deviceId) : '');
    };

    const handleSaveWidgetSettings = () => {
        setWidgets((currentWidgets) => currentWidgets.map((widget, index) => (
            index === selectedWidget
                ? {
                    ...widget,
                    deviceId: selectedDeviceId ? Number(selectedDeviceId) : null,
                    logs: selectedDeviceId ? addLog(widget.logs, 'Устройство привязано к виджету') : widget.logs,
                }
                : widget
        )));
        setIsWidgetSettingsOpen(false);
    };

    const handleUpdateWidget = (widgetIndex: number, updater: (widget: WidgetState) => WidgetState) => {
        setWidgets((currentWidgets) => currentWidgets.map((widget, index) => (
            index === widgetIndex ? updater(widget) : widget
        )));
    };

    const handleToggleWidgetDevice = async (widgetIndex: number, device: Device) => {
        const updatedDevice = await handleToggleDevice(device.id);

        if (!updatedDevice) return;

        handleUpdateWidget(widgetIndex, (widget) => ({
            ...widget,
            logs: addLog(widget.logs, updatedDevice.isOn ? 'Устройство включено' : 'Устройство выключено'),
        }));
    };

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

                <Devices
                    devices={devices}
                    isLoading={isLoading}
                    error={error}
                    isAdding={isAdding}
                    deletingDeviceId={deletingDeviceId}
                    togglingDeviceId={togglingDeviceId}
                    onAddDevice={handleAddDevice}
                    onDeleteDevice={handleDeleteDevice}
                    onToggleDevice={handleToggleDevice}
                />
            </div>

            <div className={styles.vidgets}>
                <WidgetSettings
                    devices={devices}
                    widgets={widgets}
                    isOpen={isWidgetSettingsOpen}
                    selectedWidget={selectedWidget}
                    selectedDeviceId={selectedDeviceId}
                    onOpen={handleOpenWidgetSettings}
                    onClose={() => setIsWidgetSettingsOpen(false)}
                    onSelectWidget={handleSelectWidget}
                    onSelectDevice={setSelectedDeviceId}
                    onSave={handleSaveWidgetSettings}
                />
                {widgets.map((widget, index) => (
                    <DeviceWidget
                        index={index}
                        widget={widget}
                        device={widget.deviceId ? devicesById.get(widget.deviceId) : undefined}
                        isToggling={togglingDeviceId === widget.deviceId}
                        onToggle={handleToggleWidgetDevice}
                        onUpdateWidget={handleUpdateWidget}
                        key={index}
                    />
                ))}
            </div>
        </div>
    )
}

export default Home
