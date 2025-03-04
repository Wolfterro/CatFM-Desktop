import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import { createRouter, createWebHashHistory } from 'vue-router';
import LoginComponent from './components/LoginComponent.vue';
import DashboardComponent from './components/DashboardComponent.vue';

const routes = [
  { path: '/', name: 'Login', component: LoginComponent },
  { path: '/dashboard', name: 'Dashboard', component: DashboardComponent },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.mount('#app');