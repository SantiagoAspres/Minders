<template>
  <div>
    <v-btn
        small
        aria-label="Abrir Formulario de Feedback"
        style="color: white;background-color: #1976D2"
        @click="abrirModal"
    >
      <span>Abrir Modal</span>
    </v-btn>

    <v-dialog v-model="isModalVisible" max-width="400" persistent>
      <v-card class="rounded-lg">
        <v-card-title
            class="headline"
            style="background-color: #1976D2; color: white;"
        >
          Enviar Feedback
        </v-card-title>

        <v-card-text class="pt-4 pb-2" style="font-family: Roboto, sans-serif; font-weight: 500;">
          <p class="font-weight-medium mb-1">calificación:</p>
          <v-rating
              v-model="rating"
              :length="5"
              hover
              size="32"
              :color="'#FFC107'"
              :background-color="'#616161'"
          ></v-rating>

          <v-textarea
              v-model="comment"
              label="Comentario"
              rows="3"
              class="mt-3"
              outlined
              clearable
              :error-messages="error ? 'Error al enviar: ' + error : ''"
          ></v-textarea>

          <v-alert v-if="successMessage" type="success" dense dismissible>Gracias! Tu feedback ha sido enviado.
          </v-alert>
          <v-alert v-if="error" type="error" dense dismissible>{{ error }}</v-alert>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="cerrarModal" :disabled="isLoading">Cancelar</v-btn>
          <v-btn
              style="color: white; background-color: #1976D2;"
              :loading="isLoading"
              @click="submitForm"
              :disabled="!rating || isLoading || isClosing"
          >
            Enviar Feedback
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // La función que index.js le pasa para enviar datos a la API
    onSubmitFeedback: {
      type: Function,
      required: true
    },
    // La función que index.js le pasa para registrar el método abrirModal
    onOpenModal: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isModalVisible: false,
      rating: 0,
      comment: '',
      isLoading: false,
      isClosing: false,
      error: null,
      successMessage: null,
    };
  },
  // Hook para registrar el método en el exterior
  mounted() {
    // Al montar, pasamos la referencia de nuestro método abrirModal a la función que nos dio el index.js
    this.onOpenModal(this.abrirModal);
  },
  methods: {
    // Método para abrir el modal (llamado desde index.js)
    abrirModal() {
      this.isModalVisible = true;
      this.resetForm();
    },
    cerrarModal() {
      this.isClosing = true;
      this.isModalVisible = false;
      // reseteamos el formulario después de cerrar la animación
      setTimeout(() => {
        this.resetForm();
        this.isClosing = false;
      }, 300);
    },
    resetForm() {
      this.rating = 0;
      this.comment = '';
      this.error = null;
      this.successMessage = null;
    },

    // Lógica de envío del formulario
    async submitForm() {
      if (!this.rating) {
        this.error = 'Por favor, selecciona una calificación.';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.successMessage = null;

      try {
        const payload = {
          rating: this.rating,
          comment: (this.comment || '').trim(),
        };

        // Llama a la prop de envío que viene desde index.js
        await this.onSubmitFeedback(payload);

        this.successMessage = '¡Gracias! Tu feedback ha sido enviado.';
        this.isClosing = true;

        // Espera un momento y cierra
        setTimeout(() => {
          this.cerrarModal();
        }, 1500);

      } catch (e) {
        this.error = e.message || 'Ocurrió un error desconocido al enviar.';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>