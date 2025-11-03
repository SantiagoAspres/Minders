import 'regenerator-runtime/runtime';
import { MySDK } from '../src/index.js';

describe('Comportamiento basico de MySDK', () => {
  let sdk;

  beforeEach(() => {
    document.body.innerHTML = '';
    sdk = new MySDK();
    sdk.initialize({
      apiKey: 'mi-clave-secreta',
      projectId: 'test-project',
      debug: true
    });
  });

  test('Debe encolar feedback cuando esta offline', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });

    const feedback = { rating: 5, comment: 'Excelente!' };
    const feedback2 = { rating: 5, comment: 'Excelente!' };
    var result = await sdk.submitFeedback(feedback);
    result = await sdk.submitFeedback(feedback2);

    expect(result.queued).toBe(true);
    expect(sdk.queue.length).toBe(2);
  });

  test('Debe tener un userId generado', () => {
    expect(sdk.userId).toMatch(/^user-/);
  });
});