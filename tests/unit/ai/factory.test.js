jest.mock('../../../src/ai/providers/openai', () => ({ analyze: jest.fn() }));
jest.mock('../../../src/ai/providers/puter', () => ({ analyze: jest.fn() }));

describe('AI Provider Factory', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('returns openai provider when configured', () => {
    jest.doMock('../../../src/utils/config', () => ({
      ai: { provider: 'openai' }
    }));

    const { getAIProvider } = require('../../../src/ai/factory');
    const provider = getAIProvider();

    // Should return the mocked openai module
    const openaiMock = require('../../../src/ai/providers/openai');
    expect(provider).toBe(openaiMock);
  });

  test('returns puter provider when configured', () => {
    jest.doMock('../../../src/utils/config', () => ({
      ai: { provider: 'puter' }
    }));

    const { getAIProvider } = require('../../../src/ai/factory');
    const provider = getAIProvider();

    const puterMock = require('../../../src/ai/providers/puter');
    expect(provider).toBe(puterMock);
  });

  test('throws error for unknown provider', () => {
    jest.doMock('../../../src/utils/config', () => ({
      ai: { provider: 'unknown' }
    }));

    const { getAIProvider } = require('../../../src/ai/factory');
    expect(() => getAIProvider()).toThrow('Unknown AI provider: unknown');
  });
});