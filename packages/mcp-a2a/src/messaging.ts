/**
 * Agent Messaging - Inter-Agent Communication
 *
 * Provides message routing, queuing, and handling
 * for agent-to-agent communication.
 */

import type { A2AMessage } from './protocol';

export interface MessageEnvelope {
  message: A2AMessage;
  attempts: number;
  maxRetries: number;
  lastAttempt?: number;
}

export type MessageHandler = (message: A2AMessage) => Promise<A2AMessage | void>;

export class AgentMessaging {
  private queues: Map<string, MessageEnvelope[]> = new Map();
  private handlers: Map<string, MessageHandler[]> = new Map();
  private processedIds: Set<string> = new Set();

  /**
   * Subscribe an agent to receive messages.
   */
  subscribe(agentId: string, handler: MessageHandler): void {
    const existing = this.handlers.get(agentId) ?? [];
    existing.push(handler);
    this.handlers.set(agentId, existing);
  }

  /**
   * Unsubscribe an agent from messages.
   */
  unsubscribe(agentId: string): void {
    this.handlers.delete(agentId);
  }

  /**
   * Send a message to an agent's queue.
   */
  send(message: A2AMessage, maxRetries: number = 3): void {
    const envelope: MessageEnvelope = {
      message,
      attempts: 0,
      maxRetries,
    };

    const queue = this.queues.get(message.toAgent) ?? [];
    queue.push(envelope);
    this.queues.set(message.toAgent, queue);
  }

  /**
   * Process pending messages for an agent.
   */
  async processQueue(agentId: string): Promise<(A2AMessage | void)[]> {
    const queue = this.queues.get(agentId) ?? [];
    const handlers = this.handlers.get(agentId) ?? [];
    const results: (A2AMessage | void)[] = [];

    const remaining: MessageEnvelope[] = [];

    for (const envelope of queue) {
      if (this.processedIds.has(envelope.message.id)) continue;

      envelope.attempts++;
      envelope.lastAttempt = Date.now();

      try {
        for (const handler of handlers) {
          const result = await handler(envelope.message);
          results.push(result);
        }
        this.processedIds.add(envelope.message.id);
      } catch {
        if (envelope.attempts < envelope.maxRetries) {
          remaining.push(envelope);
        }
      }
    }

    this.queues.set(agentId, remaining);
    return results;
  }

  /**
   * Get pending message count for an agent.
   */
  getPendingCount(agentId: string): number {
    return (this.queues.get(agentId) ?? []).length;
  }

  /**
   * Get total messages across all queues.
   */
  getTotalPending(): number {
    let total = 0;
    for (const queue of this.queues.values()) {
      total += queue.length;
    }
    return total;
  }
}
