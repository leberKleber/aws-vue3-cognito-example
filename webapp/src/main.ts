/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import {registerPlugins} from '@/plugins'

// Components
import App from './App.vue'

import 'vuetify/styles'; // Ensure you import Vuetify styles
import '@mdi/font/css/materialdesignicons.css'; // Optional, for icons

// Composables
import {createApp} from 'vue'
import {createPinia} from "pinia";

const app = createApp(App)

registerPlugins(app)

app.use(createPinia())

app.mount('#app')
