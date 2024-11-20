import {Capacitor, registerPlugin} from '@capacitor/core'

const mockIntentPlugin: IntentPlugin = {
    openMailApp: async (options: {}) => {
        return {message: 'Mail app opened'}
    },
    displayShareSheet: async (options: {message: string, intentTitle: string, subject: string}) => {
        return {message: 'Share sheet displayed'}
    }
}

export interface IntentPlugin {
    openMailApp(options: {}): Promise<{ message:string|null }>,
    displayShareSheet(options: {message: string, intentTitle: string, subject: string}): Promise<{ message:string|null }>
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