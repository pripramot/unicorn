/**
 * Short-Term Memory - Working Memory for Conversation Context
 *
 * Maintains a sliding window of recent interactions and context
 * with automatic expiration and capacity management.
 */

export interface MemoryEntry {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  metadata?: Record<string, unknown>;
  timestamp: number;
  expiresAt?: number;
}

export class ShortTermMemory {
  private entries: MemoryEntry[] = [];
  private maxEntries: number;
  private ttlMs: number;

  constructor(options: { maxEntries?: number; ttlMs?: number } = {}) {
    this.maxEntries = options.maxEntries ?? 100;
    this.ttlMs = options.ttlMs ?? 30 * 60 * 1000; // 30 minutes default
  }

  /**
   * Add a new entry to working memory.
   */
  add(content: string, role: MemoryEntry['role'], metadata?: Record<string, unknown>): MemoryEntry {
    this.cleanup();

    const entry: MemoryEntry = {
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      content,
      role,
      metadata,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.ttlMs,
    };

    this.entries.push(entry);

    // Enforce capacity limit
    while (this.entries.length > this.maxEntries) {
      this.entries.shift();
    }

    return entry;
  }

  /**
   * Get recent entries, optionally filtered by role.
   */
  getRecent(count?: number, role?: MemoryEntry['role']): MemoryEntry[] {
    this.cleanup();
    let filtered = this.entries;
    if (role) {
      filtered = filtered.filter(e => e.role === role);
    }
    if (count) {
      filtered = filtered.slice(-count);
    }
    return [...filtered];
  }

  /**
   * Search entries by content substring.
   */
  search(query: string): MemoryEntry[] {
    this.cleanup();
    const lower = query.toLowerCase();
    return this.entries.filter(e => e.content.toLowerCase().includes(lower));
  }

  /**
   * Get the current context window as a formatted string.
   */
  getContextWindow(maxTokens?: number): string {
    this.cleanup();
    const entries = this.entries.map(e => `[${e.role}]: ${e.content}`);
    const joined = entries.join('\n');
    if (maxTokens) {
      return joined.slice(0, maxTokens * 4); // rough approximation
    }
    return joined;
  }

  /**
   * Get the number of active entries.
   */
  get size(): number {
    this.cleanup();
    return this.entries.length;
  }

  /**
   * Clear all entries.
   */
  clear(): void {
    this.entries = [];
  }

  private cleanup(): void {
    const now = Date.now();
    this.entries = this.entries.filter(e => !e.expiresAt || e.expiresAt > now);
  }
}
