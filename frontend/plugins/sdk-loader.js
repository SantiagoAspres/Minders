export default async () => {
    // La importación dinámica garantiza que la ejecución de my-sdk.esm.js
    // (donde se registra el custom element) solo ocurra en el cliente.
    await import('~/static/my-sdk.esm.js');
};