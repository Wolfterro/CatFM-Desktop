<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="logo">CatFM</div>
      <div class="user-info">
        <span class="full-name">{{ fullName }}</span>
        <span class="email">{{ email }}</span>
      </div>
    </header>
    <div class="content-divider"></div>
    <div class="dashboard-content">
      <!-- Seção Músicas -->
      <div v-if="streamingError" class="error-message">{{ streamingError }}</div>
      <div v-else-if="!streamingData || !streamingData.results || !streamingData.results.length">
        Carregando dados de streaming...
      </div>
      <div v-else>
        <h2 class="section-header">Músicas</h2>
        <Carousel :items-to-show="3" :wrap-around="true" :gap="1">
          <Slide v-for="item in streamingData.results" :key="item.identifier">
            <div class="carousel-item">
              <img :src="item.cover_url" alt="Capa" class="cover-image" />
              <div class="item-info">
                <small class="item-name">{{ item.name }}</small>
                <small class="item-artist">{{ item.artist }}</small>
              </div>
            </div>
          </Slide>
        </Carousel>
      </div>

      <!-- Seção Playlists Sugeridas -->
      <h2 class="section-header">Playlists Sugeridas</h2>
      <div v-if="playlistsError" class="error-message">{{ playlistsError }}</div>
      <div v-else-if="!playlistsData || !playlistsData.results || !playlistsData.results.length">
        Nenhuma playlist disponível.
      </div>
      <div v-else>
        <Carousel :items-to-show="3" :wrap-around="true" :gap="60">
          <Slide v-for="playlist in playlistsData.results" :key="playlist.identifier">
            <div class="carousel-item">
              <img
                :src="playlist.audios[0] ? playlist.audios[0].cover_url : ''"
                alt="Capa Playlist"
                class="cover-image"
              />
              <div class="item-info">
                <small class="item-name">{{ playlist.name }}</small>
              </div>
            </div>
          </Slide>
        </Carousel>
      </div>

      <!-- Seção Minhas Playlists -->
      <h2 class="section-header">Minhas Playlists</h2>
      <div v-if="myPlaylistsError" class="error-message">{{ myPlaylistsError }}</div>
      <div v-else-if="!myPlaylistsData || !myPlaylistsData.results || !myPlaylistsData.results.length">
        Nenhuma playlist disponível.
      </div>
      <div v-else>
        <Carousel :items-to-show="3" :wrap-around="true" :gap="60">
          <Slide v-for="playlist in myPlaylistsData.results" :key="playlist.identifier">
            <div class="carousel-item">
              <img
                :src="playlist.audios[0] ? playlist.audios[0].cover_url : ''"
                alt="Capa Playlist"
                class="cover-image"
              />
              <div class="item-info">
                <small class="item-name">{{ playlist.name }}</small>
              </div>
            </div>
          </Slide>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: "DashboardComponent",
  components: {
    Carousel,
    Slide,
  },
  setup() {
    const authStore = useAuthStore();
    const fullName = computed(() =>
      authStore.authData
        ? `${authStore.authData.first_name} ${authStore.authData.last_name}`
        : ''
    );
    const email = computed(() =>
      authStore.authData ? authStore.authData.email : ''
    );

    const streamingData = ref(null);
    const streamingError = ref('');
    const playlistsData = ref(null);
    const playlistsError = ref('');
    const myPlaylistsData = ref(null);
    const myPlaylistsError = ref('');

    onMounted(() => {
      const token = authStore.authData?.token;
      if (!token) {
        streamingError.value = "Token não disponível";
        playlistsError.value = "Token não disponível";
        return;
      }
      // Carrega dados de streaming (Músicas)
      fetch("http://localhost:8000/streaming/?order_by=-created_at", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Erro ao carregar dados de streaming");
          }
          return response.json();
        })
        .then(data => {
          streamingData.value = data;
          console.log("Dados de streaming:", data);
        })
        .catch(error => {
          streamingError.value = error.message;
          console.error("Erro ao carregar dados de streaming:", error);
        });

      // Carrega dados de playlists sugeridas
      fetch("http://localhost:8000/playlist/system_playlists/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Erro ao carregar playlists");
          }
          return response.json();
        })
        .then(data => {
          playlistsData.value = data;
          console.log("Dados de playlists:", data);
        })
        .catch(error => {
          playlistsError.value = error.message;
          console.error("Erro ao carregar playlists:", error);
        });
      
      // Carrega dados de minhas playlists
      fetch("http://localhost:8000/playlist/my_playlists/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Erro ao carregar playlists");
          }
          return response.json();
        })
        .then(data => {
          myPlaylistsData.value = data;
          console.log("Dados de playlists:", data);
        })
        .catch(error => {
          myPlaylistsError.value = error.message;
          console.error("Erro ao carregar playlists:", error);
        });
    });

    return {
      fullName,
      email,
      streamingData,
      streamingError,
      playlistsData,
      playlistsError,
    };
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap');

/* Remova overflow hidden de html/body nos estilos globais, se houver */

.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  color: white;
  font-family: 'Roboto', sans-serif;
  overflow-y: auto; /* Habilita rolagem vertical em toda a página */
}

.dashboard-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #444;
  margin: 0;
  box-sizing: border-box;
}

.logo {
  font-size: 2rem;
  font-weight: 700;
}

.user-info {
  text-align: right;
}

.user-info .full-name {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
}

.user-info .email {
  display: block;
  font-size: 1rem;
  opacity: 0.8;
}

.content-divider {
  height: 2px;
  background-color: #ccc;
  margin-top: 70px; /* Espaço para compensar o header fixo */
}

.dashboard-content {
  flex: 1;
  padding: 2rem;
  background-color: #333;
  margin-top: 20px; /* Espaço extra para não ficar colado ao divider */
}

/* Título das seções */
.section-header {
  font-size: 1.5rem;
  margin: 0.5rem 0;
  text-align: left;
  padding-left: 0;
}

/* Estilos do carrossel */
.carousel-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.cover-image {
  width: 200px;
  height: 200px;
  border-radius: 4px;
  object-fit: cover;
}

.item-info {
  margin-top: 0.5rem;
  text-align: center;
}

.item-name {
  display: block;
  font-size: 0.9rem;
}

.item-artist {
  display: block;
  font-size: 0.8rem;
  opacity: 0.8;
}

.error-message {
  color: #ff6b6b;
}
</style>
