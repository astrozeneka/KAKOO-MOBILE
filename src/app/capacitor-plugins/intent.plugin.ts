import {Capacitor, registerPlugin} from '@capacitor/core'

const mockIntentPlugin: IntentPlugin = {
    openMailApp: async (options: {}) => {
        return {message: 'Mail app opened'}
    }
}

export interface IntentPlugin {
    openMailApp(options: {}): Promise<{ message:string|null }>
}

// Loading the plugin
let Intent: IntentPlugin
if (Capacitor.isNativePlatform()){
    console.log("Registering Intent plugin")
    Intent = registerPlugin<IntentPlugin>('Intent');
} else {
    Intent = mockIntentPlugin;
}
export default Intent