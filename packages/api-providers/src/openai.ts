/**
 * OpenAI Provider (GPT)
 *
 * Integration with OpenAI's API for GPT models.
 */

import type { AIProvider, CompletionRequest, CompletionResponse } from './base';

export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  baseUrl?: string;
  organization?: string;
}

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';
  private config: OpenAIConfig;

  constructor(config: OpenAIConfig) {
    this.config = config;
  }

  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const model = request.model ?? this.config.model ?? 'gpt-4';

    // In production, use openai SDK
    // const openai = new OpenAI({ apiKey: this.config.apiKey });
    // const completion = await openai.chat.completions.create({
    //   model, messages: [{ role: 'user', content: request.prompt }]
    // });

    return {
      text: `[OpenAI/${model}] Processing: ${request.prompt.slice(0, 100)}`,
      model,
      provider: this.name,
      usage: {
        promptTokens: Math.ceil(request.prompt.length / 4),
        completionTokens: 0,
        totalTokens: Math.ceil(request.prompt.length / 4),
      },
    };
  }

  isAvailable(): boolean {
    return !!this.config.apiKey;
  }
}
