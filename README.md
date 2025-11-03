# SDK

Este SDK permite integrar fácilmente el componente en distintos proyectos.

## Instalación y build

Dentro de la carpeta `/SDK` ejecutar los siguientes comandos:

1. Instalar todas las dependencias definidas en `package.json`:

```
npm install
```

2. Generar los archivos distribuibles (*.umd.js y *.esm.js) usando Webpack:

```
npm run build
```

Luego, estos archivos se pueden importar en tus proyectos usando `<script>` o como módulo.

La versión que utilice de Node.js es la `v16.19.0`

# Server

Este proyecto usa Quarkus, the Supersonic Subatomic Java Framework.

### Correr la App en Dev Mode

Script para compilar y correr el backend en modo dev en el puerto 8080:

```shell script
./mvnw compile quarkus:dev
```

# Frontend

Se cuenta con 2 proyectos: `Script` y `Frontend`

### Script

Cuenta con un simple archivo .html el cual utiliza nuestro componente SDK embebido con script tags.

Para correr este proyecto utilizamos live-server (Servidor de Desarrollo Local):

```
live-server --port=8081
```

### Frontend

Es un proyecto web hecho con Nuxt 2, Vue 2 y Vuetify 2 el cual utiliza nuestro componente importandolo.

Para correr este proyecto ejecutamos el comando:

```
yarn install
yarn dev
```

# Test

### Test del SDK

Dentro de la carpeta `/SDK` se ejecuta el comando:

```
npm test
```
Se corren los test que se encuentran en el archivo `MySDK.test.js` de la carpeta `/tests`

### Test de API

Para probar la API se pueden realizar las siguientes requests utilizando Postman (o cualquier cliente HTTP):

1. Enviar feedback (POST)

> POST to http://localhost:8080/feedback

* Headers:

> X-API-Key: mi-clave-secreta
>
> Content-Type: application/json

* Body (JSON):

```
{
"project_id": "proyecto2",
"user_id": "usuario1",
"rating": 3,
"comment": "Muy bueno",
"timestamp": "2025-10-28T03:00:00Z"
}
```

Este request creará un nuevo feedback en el servidor.

2. Health check (GET)

> GET to http://localhost:8080/health

Este request devuelve el estado del servidor, indicando si la API está corriendo correctamente.

---
## Ejemplo de uso

#### Script tag (UMD):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Prueba de SDK Vue/Vuetify</title>

  <!-- Estilos globales de Vuetify y Material Design Icons -->
  <link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet" />

  <!-- SDK compilado -->
  <script src="my-sdk.umd.js"></script>
</head>
<body>
  <h1>Ejemplo de integración del SDK</h1>

  <my-sdk id="sdk"></my-sdk>

  <!-- Contenedor necesario para Vuetify -->
  <div data-app="true"></div>

  <script>
    const sdk = document.getElementById('sdk');

    sdk.initialize({
      apiKey: 'mi-clave-secreta',
      projectId: 'Project-sdk-Tag',
      apiUrl: 'http://localhost:8080/feedback',
      debug: false
    });

    document.addEventListener('sdk-ready', (event) => {
      const sdk = event.target;
      console.log("SDK listo. Abriendo modal...");
      if (typeof sdk.openModal === 'function') {
        sdk.openModal();
      } else {
        console.error("SDK Error: openModal no existe.");
      }
    });
  </script>
</body>
</html>
```
#### Uso como módulo ES6:
```js
import { MySDK } from './dist/my-sdk.esm.js';

const sdk = new MySDK();

sdk.initialize({
  apiKey: 'mi-clave-secreta',
  projectId: 'Project-sdk-Tag',
  apiUrl: 'http://localhost:8080/feedback'
});

sdk.openModal();
```
---

# ADR: Elección de Tecnologías y Enfoques para el SDK

## Contexto

Se desarrolló un SDK para integrar un componente de feedback en proyectos existentes, utilizando Vue 2 y Vuetify 2. El
SDK debe poder integrarse **tanto como módulo ES6** como **mediante `<script>`**, y funcionar de manera independiente
del proyecto que lo consuma.

## Decisión

1. **Framework:** Vue.js 2
    - Se eligió Vue 2 por su compatibilidad con Vuetify 2 y la base de proyectos existentes.
    - Permite encapsular la lógica del componente y la interfaz de manera reactiva y mantenible.

2. **UI Library:** Vuetify 2
    - Se utiliza para mantener consistencia visual, accesibilidad y componentes predefinidos.
    - Los estilos se inyectan dentro del Shadow DOM para aislar el componente del proyecto que lo consume y evitar
      conflictos CSS.

3. **Distribución del SDK:**
    - Se empaqueta en **UMD** (`dist/my-sdk.umd.js`) para uso directo vía `<script>` en páginas web.
    - Se genera un **ESM** (`dist/my-sdk.esm.js`) para importación como módulo en proyectos modernos de JavaScript.

4. **Arquitectura del componente:**
    - Se creó un **Web Component (`<my-sdk>`)** que encapsula la instancia de Vue y maneja la comunicación con la página
      que lo consume.
    - Se expone una **API pública clara** con métodos como `initialize(userConfig)` y `openModal()`, y
      callbacks `onSubmitFeedback` y `onOpenModal` para interacción bidireccional.
    - Se implementa un **queue para envío offline**, que se procesa automáticamente al reconectarse.

5. **Construcción y Bundling:** Webpack
    - Compila los componentes Vue y Vuetify en un único bundle distribuible.
    - Permite generar distintos formatos (UMD y ESM) desde la misma base de código.

6. **Testing:** Jest y JUnit
    - **Jest** se usa para pruebas unitarias e integración del SDK y del componente Vue, asegurando que la lógica del
      frontend funcione correctamente.
    - **JUnit** se utiliza para pruebas unitarias y de integración en el backend con Quarkus, garantizando que la API y
      la lógica de negocio funcionen como se espera.

## Consecuencias

- El SDK se integra de manera aislada, sin afectar la aplicación que lo consume.
- Permite interacción externa mediante métodos y callbacks bien definidos.
- Maneja estado offline y online de manera robusta.
- Los proyectos pueden elegir entre usar `<script>` o importar como módulo.
- Facilita futuras mejoras y migraciones a Vue 3 o Vuetify 3 sin cambiar la API pública.
