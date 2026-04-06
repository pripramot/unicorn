/**
 * Agent Discovery - Find and Register Agents
 *
 * Manages agent registration, health monitoring,
 * and capability-based discovery.
 */

export type AgentStatus = 'online' | 'offline' | 'busy' | 'maintenance';

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  type: 'orchestrator' | 'specialist' | 'provider';
  capabilities: string[];
  status: AgentStatus;
  endpoint?: string;
  lastHeartbeat: number;
  metadata?: Record<string, unknown>;
}

export class AgentDiscovery {
  private agents: Map<string, AgentInfo> = new Map();
  private heartbeatTimeout: number;

  constructor(options: { heartbeatTimeoutMs?: number } = {}) {
    this.heartbeatTimeout = options.heartbeatTimeoutMs ?? 30000;
  }

  /**
   * Register a new agent.
   */
  register(agent: Omit<AgentInfo, 'lastHeartbeat'>): AgentInfo {
    const info: AgentInfo = {
      ...agent,
      lastHeartbeat: Date.now(),
    };
    this.agents.set(agent.id, info);
    return info;
  }

  /**
   * Remove an agent from the registry.
   */
  unregister(agentId: string): boolean {
    return this.agents.delete(agentId);
  }

  /**
   * Update an agent's heartbeat.
   */
  heartbeat(agentId: string): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;
    agent.lastHeartbeat = Date.now();
    agent.status = 'online';
    return true;
  }

  /**
   * Find agents by capability.
   */
  findByCapability(capability: string): AgentInfo[] {
    this.refreshStatuses();
    const lower = capability.toLowerCase();
    return Array.from(this.agents.values())
      .filter(a =>
        a.status === 'online' &&
        a.capabilities.some(c => c.toLowerCase().includes(lower))
      );
  }

  /**
   * Find agents by type.
   */
  findByType(type: AgentInfo['type']): AgentInfo[] {
    this.refreshStatuses();
    return Array.from(this.agents.values())
      .filter(a => a.type === type && a.status === 'online');
  }

  /**
   * Get all registered agents.
   */
  listAll(): AgentInfo[] {
    this.refreshStatuses();
    return Array.from(this.agents.values());
  }

  /**
   * Get online agents count.
   */
  getOnlineCount(): number {
    this.refreshStatuses();
    return Array.from(this.agents.values())
      .filter(a => a.status === 'online').length;
  }

  private refreshStatuses(): void {
    const now = Date.now();
    for (const agent of this.agents.values()) {
      if (now - agent.lastHeartbeat > this.heartbeatTimeout) {
        agent.status = 'offline';
      }
    }
  }
}
