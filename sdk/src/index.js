import Vue from 'vue';
import Vuetify from 'vuetify';
import Widget from './Widget.vue';

let MySDK = null;

if (typeof window !== 'undefined' && typeof document !== 'undefined') {

  Vue.use(Vuetify);

  // FUNCIONES AUXILIARES
  function getUserId() {
    const STORAGE_KEY = 'sdk_user_id';
    if (typeof localStorage === 'undefined') return 'user-temp-fallback';

    let userId = localStorage.getItem(STORAGE_KEY);
    if (!userId) {
      userId = 'user-' + Date.now() + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(STORAGE_KEY, userId);
    }
    return userId;
  }

  function injectStyles(shadowRoot) {
    const vuetifyLink = document.createElement('link');
    vuetifyLink.rel = 'stylesheet';
    vuetifyLink.href = 'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css';
    shadowRoot.appendChild(vuetifyLink);

    const mdiLink = document.createElement('link');
    mdiLink.rel = 'stylesheet';
    mdiLink.href = 'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css';
    shadowRoot.appendChild(mdiLink);

  }

  // SDKComponent 
  class SDKComponent extends HTMLElement {
    config = {
      projectId: null,
      apiKey: null,
      apiUrl: 'https://api.myfeedbackservice.com/submit',
      debug: false
    };
    vueInstance = null;
    userId = null;
    isReady = false;
    openModalHandler = null;
    queue = [];

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.userId = getUserId();

      // Escucha reconexión para flush de queue
      window.addEventListener('online', () => {
        if (this.queue.length > 0 && this.config.debug) console.log("Reconnected. Flush queue.");
        this._flushQueue();
      });
    }

    setOpenModalHandler(handler) {
      this.openModalHandler = handler;
    }

    initialize(userConfig) {
      this.config = Object.assign(this.config, userConfig);
      this.queue = []; 
      if (!this.config.apiKey) console.error("SDK Error: apiKey no proporcionada");
      if (!this.config.projectId) console.error("SDK Error: projectId no proporcionado");
      if (this.config.debug) console.log("SDK initialized:", this.config);
    }

    connectedCallback() {
      injectStyles(this.shadowRoot);

      const app = document.createElement('div');
      app.id = 'app';
      this.shadowRoot.appendChild(app);

      const submitFeedback = this.submitFeedback.bind(this);
      const onOpenModal = this.setOpenModalHandler.bind(this);

      this.vueInstance = new Vue({
        vuetify: new Vuetify({ icons: { iconfont: 'mdi' } }),
        render: h => h(Widget, { props: { onSubmitFeedback: submitFeedback, onOpenModal: onOpenModal } })
      }).$mount(app);

      this.vueInstance.$nextTick(() => {
        this.isReady = true;
        if (this.config.debug) console.log("SDK: Componente Vue montado y listo.");
        this.dispatchEvent(new CustomEvent('sdk-ready', { bubbles: true, composed: true }));
      });
    }

    openModal() {
      if (this.isReady && this.openModalHandler) {
        this.openModalHandler();
      } else {
        console.error("SDK Error: componente Vue no listo o llamado demasiado pronto.");
      }
    }

    async submitFeedback(payload) {
      const dataToSend = {
        ...payload,
        user_id: this.userId,
        project_id: this.config.projectId,
        timestamp: new Date().toISOString(),
        extra: {
          app_version: '1.0.0',
          user_agent: navigator.userAgent,
          url_actual: window.location.href,
          language: navigator.language
        }
      };

      if (!navigator.onLine) {
        if (this.config.debug) console.warn("Offline: encolando feedback", dataToSend);
        this.queue.push(dataToSend);
        return Promise.resolve({ queued: true });
      }

      return this._send(dataToSend);
    }

    async _send(data) {
      if (!this.config.apiKey) throw new Error("API Key no configurada. Llama a initialize() primero.");

      if (this.config.debug) console.log("Enviando feedback:", data);

      try {
        const response = await fetch(this.config.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.config.apiKey
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => ({ message: 'Server error' }));
          throw new Error(`Fallo en la API (${response.status}): ${errorBody.message || 'Error desconocido'}`);
        }

        if (this.config.debug) console.log("Feedback enviado exitosamente", data);
        return response.json();
      } catch (error) {
        if (this.config.debug) console.error("Error enviando feedback, encolando", error);
        this.queue.push(data);
        return Promise.reject(error);
      }
    }

    async _flushQueue() {
      while (this.queue.length > 0) {
        const item = this.queue.shift();
        try {
          await this._send(item);
        } catch (e) {
          this.queue.unshift(item);
          break;
        }
      }
    }
  }

  customElements.define('my-sdk', SDKComponent);
  MySDK = SDKComponent;
}

export { MySDK };
