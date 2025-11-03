<template>
  <v-app>
    <v-main>
      <v-container>
        <my-sdk ref="sdk"></my-sdk>

        <v-btn color="primary" @click="simulateOffline">Simular Offline</v-btn>
        <v-btn color="green" @click="simulateOnline">Simular Online</v-btn>
        <v-btn color="blue" @click="initializeSDK('dev')">Inicializar DEV</v-btn>
        <v-btn color="pink" @click="initializeSDK('prod')">Inicializar PROD</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  mounted() {
    const sdk = this.$refs.sdk;

    sdk.addEventListener('sdk-ready', () => {
      console.log("SDK listo en Nuxt. Podemos abrir el modal.");
      if (typeof sdk.openModal === 'function') {
        sdk.openModal();
      }
    });
  },
  methods: {
    simulateOffline() {
      Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
      console.log("Simulado OFFLINE");
    },
    simulateOnline() {
      Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
      console.log("Simulado ONLINE, disparando evento 'online'");
      window.dispatchEvent(new Event('online'));
    },
    initializeSDK(env) {
      const sdk = this.$refs.sdk;

      // Definimos URLs según ambiente
      const apiUrls = {
        dev: 'http://localhost:8080/feedback',
        prod: 'https://api.myfeedbackservice.com/feedback'
      };

      sdk.initialize({
        apiKey: 'mi-clave-secreta',
        projectId: 'Project-sdk-Import',
        apiUrl: apiUrls[env],
        debug: false // activa Debug Mode
      });

      console.log(`SDK inicializado en entorno: ${env}`);
    }
  }
};
</script>