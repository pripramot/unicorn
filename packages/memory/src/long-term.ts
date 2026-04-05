/**
 * Long-Term Memory - Persistent Memory Storage
 *
 * Stores and retrieves persistent memories with semantic search.
 * Designed for integration with vector stores (Supabase pgvector, Pinecone, etc.)
 */

export interface StoredMemory {
  id: string;
  content: string;
  category: string;
  tags: string[];
  importance: number;
  embedding?: number[];
  createdAt: number;
  accessedAt: number;
  accessCount: number;
}

export interface MemorySearchResult {
  memory: StoredMemory;
  relevance: number;
}

export class LongTermMemory {
  private memories: Map<string, StoredMemory> = new Map();

  /**
   * Store a new memory.
   */
  store(content: string, category: string, options: {
    tags?: string[];
    importance?: number;
  } = {}): StoredMemory {
    const id = `ltm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const now = Date.now();

    const memory: StoredMemory = {
      id,
      content,
      category,
      tags: options.tags ?? [],
      importance: options.importance ?? 0.5,
      createdAt: now,
      accessedAt: now,
      accessCount: 0,
    };

    this.memories.set(id, memory);
    return memory;
  }

  /**
   * Retrieve a memory by ID, updating access metadata.
   */
  retrieve(id: string): StoredMemory | undefined {
    const memory = this.memories.get(id);
    if (memory) {
      memory.accessedAt = Date.now();
      memory.accessCount++;
    }
    return memory;
  }

  /**
   * Search memories by keyword matching.
   * In production, this would use vector similarity search.
   */
  search(query: string, options: {
    category?: string;
    limit?: number;
    minImportance?: number;
  } = {}): MemorySearchResult[] {
    const lower = query.toLowerCase();
    const limit = options.limit ?? 10;
    const minImportance = options.minImportance ?? 0;

    const results: MemorySearchResult[] = [];

    for (const memory of this.memories.values()) {
      if (options.category && memory.category !== options.category) continue;
      if (memory.importance < minImportance) continue;

      const contentLower = memory.content.toLowerCase();
      if (contentLower.includes(lower)) {
        // Simple relevance scoring based on position and frequency
        const index = contentLower.indexOf(lower);
        const relevance = 1 - (index / contentLower.length) * 0.5;
        results.push({ memory, relevance });
      }
    }

    return results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);
  }

  /**
   * Get memories by category.
   */
  getByCategory(category: string): StoredMemory[] {
    return Array.from(this.memories.values())
      .filter(m => m.category === category);
  }

  /**
   * Get the most important memories.
   */
  getImportant(limit: number = 10): StoredMemory[] {
    return Array.from(this.memories.values())
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  }

  /**
   * Remove a memory.
   */
  forget(id: string): boolean {
    return this.memories.delete(id);
  }

  /**
   * Get total stored memories count.
   */
  get size(): number {
    return this.memories.size;
  }
}
