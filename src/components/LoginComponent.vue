<template>
  <div class="login-container">
    <div class="logo">CatFM</div>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">E-mail</label>
        <input
          class="input-field"
          type="email"
          id="email"
          v-model="email"
          placeholder="Digite seu e-mail"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Senha</label>
        <input
          class="input-field"
          type="password"
          id="password"
          v-model="password"
          placeholder="Digite sua senha"
          required
        />
      </div>
      <button type="submit" class="login-button" :disabled="isLoading">
        <span v-if="isLoading">Carregando...</span>
        <span v-else>Logar</span>
      </button>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: "LoginComponent",
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const email = ref('');
    const password = ref('');
    const isLoading = ref(false);
    const errorMessage = ref('');

    // Verifica se há dados de autenticação persistidos e redireciona se o usuário já estiver logado
    onMounted(() => {
      if (authStore.isAuthenticated) {
        console.log("Usuário autenticado.");
        router.push({ name: 'Dashboard' });
      }
    });

    const login = () => {
      isLoading.value = true;
      errorMessage.value = '';

      fetch("http://localhost:8000/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              return response.json().then((err) => {
                throw err;
              });
            } else {
              throw new Error("Erro na requisição");
            }
          }
          return response.json();
        })
        .then((data) => {
          console.log("Resposta do servidor:", data);
          authStore.setAuthData(data);
          router.push({ name: 'Dashboard' });
        })
        .catch((error) => {
          console.error("Erro ao efetuar login:", error);
          if (error.detail) {
            errorMessage.value = error.detail;
          } else {
            errorMessage.value = "Ocorreu um erro ao efetuar login.";
          }
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    return {
      email,
      password,
      isLoading,
      errorMessage,
      login,
    };
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #333;
  font-family: 'Roboto', sans-serif;
  overflow: hidden;
}

.login-container {
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: calc((100vh - 80vh) / 2) auto;
}

.logo {
  color: #fff;
  font-size: 5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: 2px;
}

form {
  background-color: #444;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 400px;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #fff;
}

.input-field,
.login-button {
  width: 100%;
  height: 50px;
  padding: 0 0.75rem;
  font-size: 1rem;
  border-radius: 4px;
  box-sizing: border-box;
}

.input-field {
  border: none;
}

.login-button {
  background-color: #5cb85c;
  color: #fff;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  appearance: none;
  -webkit-appearance: none;
}

.login-button:hover {
  background-color: #4cae4c;
}

.error-message {
  margin-top: 1rem;
  color: #ff6b6b;
  text-align: center;
}
</style>
