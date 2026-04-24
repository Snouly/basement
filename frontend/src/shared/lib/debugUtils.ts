const debugMode = import.meta.env.VITE_DEBUG === 'true'

export const debugFunc = (debugMess: string, method: keyof Console = 'log') => {
    if (debugMode) {
        console[method](debugMess);
    }
}

export const isDebugOn = () => {
    if (debugMode){
        return true
    }
    else{
        return false
    }
}