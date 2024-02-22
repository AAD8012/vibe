import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import './assets/styles.css';
import 'primeicons/primeicons.css'
import store from './store';
import ToastService from 'primevue/toastservice';

const app = createApp(App);
app.use(store);
app.use(PrimeVue);
app.use(ToastService);
app.mount('#app');


