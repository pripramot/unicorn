/**
 * @gts/mcp-a2a - Agent-to-Agent Communication Protocol
 *
 * Enables multi-agent collaboration through discovery, messaging,
 * task delegation, and shared context.
 */

export { A2AProtocol, type AgentCapability, type A2AMessage, type MessageType } from './protocol';
export { AgentDiscovery, type AgentInfo, type AgentStatus } from './discovery';
export { AgentMessaging, type MessageEnvelope, type MessageHandler } from './messaging';
