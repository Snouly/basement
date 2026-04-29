const debugMode = import.meta.env.VITE_DEBUG === 'true'

type DebugMethod = 'log' | 'info' | 'warn' | 'error' | 'debug';

export const debugFunc = (debugMess: string, method: DebugMethod = 'log') => {
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
