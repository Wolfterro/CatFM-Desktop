import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authData: null, // Armazena os dados de autenticação retornados pelo login
  }),
  actions: {
    setAuthData(data) {
      this.authData = data;
    },
    clearAuthData() {
      this.authData = null;
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.authData,
    fullName: (state) => state.authData ? `${state.authData.first_name} ${state.authData.last_name}` : '',
    token: (state) => state.authData ? state.authData.token : null,
  },
  // Configuração de persistência:
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'auth',
        storage: localStorage,
      },
    ],
  },
});
