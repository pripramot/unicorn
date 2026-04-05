/**
 * A2A Protocol - Core Agent-to-Agent Protocol Handler
 *
 * Defines the communication protocol for inter-agent messaging,
 * task delegation, and context sharing.
 */

export type MessageType =
  | 'request'
  | 'response'
  | 'notification'
  | 'task_delegation'
  | 'context_share'
  | 'heartbeat';

export interface AgentCapability {
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
}

export interface A2AMessage {
  id: string;
  type: MessageType;
  fromAgent: string;
  toAgent: string;
  payload: Record<string, unknown>;
  capabilities?: AgentCapability[];
  correlationId?: string;
  timestamp: number;
  ttl?: number;
}

export class A2AProtocol {
  private agentId: string;
  private handlers: Map<MessageType, ((msg: A2AMessage) => Promise<A2AMessage | void>)[]> = new Map();
  private messageLog: A2AMessage[] = [];

  constructor(agentId: string) {
    this.agentId = agentId;
  }

  /**
   * Register a handler for a specific message type.
   */
  on(type: MessageType, handler: (msg: A2AMessage) => Promise<A2AMessage | void>): void {
    const existing = this.handlers.get(type) ?? [];
    existing.push(handler);
    this.handlers.set(type, existing);
  }

  /**
   * Create and send a message to another agent.
   */
  createMessage(
    type: MessageType,
    toAgent: string,
    payload: Record<string, unknown>,
    correlationId?: string
  ): A2AMessage {
    const message: A2AMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      fromAgent: this.agentId,
      toAgent,
      payload,
      correlationId,
      timestamp: Date.now(),
      ttl: 60000, // 1 minute default
    };

    this.messageLog.push(message);
    return message;
  }

  /**
   * Process an incoming message through registered handlers.
   */
  async processMessage(message: A2AMessage): Promise<A2AMessage | void> {
    this.messageLog.push(message);
    const handlers = this.handlers.get(message.type) ?? [];

    for (const handler of handlers) {
      const response = await handler(message);
      if (response) return response;
    }
  }

  /**
   * Create a task delegation message.
   */
  delegateTask(
    toAgent: string,
    taskName: string,
    taskInput: Record<string, unknown>
  ): A2AMessage {
    return this.createMessage('task_delegation', toAgent, {
      task: taskName,
      input: taskInput,
      delegatedBy: this.agentId,
    });
  }

  /**
   * Share context with another agent.
   */
  shareContext(
    toAgent: string,
    context: Record<string, unknown>
  ): A2AMessage {
    return this.createMessage('context_share', toAgent, {
      context,
      sharedBy: this.agentId,
    });
  }

  /**
   * Get message history.
   */
  getMessageLog(limit?: number): A2AMessage[] {
    if (limit) return this.messageLog.slice(-limit);
    return [...this.messageLog];
  }

  /**
   * Get this agent's ID.
   */
  getAgentId(): string {
    return this.agentId;
  }
}
