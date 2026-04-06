/**
 * Base Provider Interface
 *
 * Common abstraction layer for all API providers,
 * enabling easy provider switching and fallback chains.
 */

export interface CompletionRequest {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export interface CompletionResponse {
  text: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
}

export interface ProviderConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  timeout?: number;
}

export interface AIProvider {
  name: string;
  complete(request: CompletionRequest): Promise<CompletionResponse>;
  isAvailable(): boolean;
}

/**
 * Create a provider instance by name.
 */
export function createProvider(name: string, config: ProviderConfig): AIProvider {
  switch (name.toLowerCase()) {
    case 'google':
    case 'gemini':
      // Dynamic import would be used in production
      return {
        name: 'google-ai',
        complete: async (req) => ({
          text: `[Google AI] Response to: ${req.prompt.slice(0, 50)}...`,
          model: config.defaultModel ?? 'gemini-pro',
          provider: 'google-ai',
        }),
        isAvailable: () => !!config.apiKey,
      };
    case 'gemma':
    case 'gemma4':
      return {
        name: 'gemma',
        complete: async (req) => ({
          text: `[Gemma 4] Response to: ${req.prompt.slice(0, 50)}...`,
          model: config.defaultModel ?? 'gemma-4-27b',
          provider: 'gemma',
        }),
        isAvailable: () => !!config.apiKey,
      };
    case 'openai':
    case 'gpt':
      return {
        name: 'openai',
        complete: async (req) => ({
          text: `[OpenAI] Response to: ${req.prompt.slice(0, 50)}...`,
          model: config.defaultModel ?? 'gpt-4',
          provider: 'openai',
        }),
        isAvailable: () => !!config.apiKey,
      };
    case 'anthropic':
    case 'claude':
      return {
        name: 'anthropic',
        complete: async (req) => ({
          text: `[Anthropic] Response to: ${req.prompt.slice(0, 50)}...`,
          model: config.defaultModel ?? 'claude-3-sonnet',
          provider: 'anthropic',
        }),
        isAvailable: () => !!config.apiKey,
      };
    default:
      throw new Error(`Unknown provider: ${name}`);
  }
}
