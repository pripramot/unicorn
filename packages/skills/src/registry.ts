/**
 * Skill Registry - Pluggable Skill Management
 *
 * Manages registration, discovery, and metadata for agent skills.
 */

export type SkillCategory =
  | 'osint'
  | 'forensics'
  | 'security'
  | 'analysis'
  | 'reporting'
  | 'web-intelligence'
  | 'general';

export interface SkillMetadata {
  name: string;
  description: string;
  category: SkillCategory;
  version: string;
  author?: string;
  tags: string[];
  requiredPermissions?: string[];
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
}

export interface Skill {
  metadata: SkillMetadata;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
  validate?: (input: Record<string, unknown>) => boolean;
}

export class SkillRegistry {
  private skills: Map<string, Skill> = new Map();

  /**
   * Register a new skill.
   */
  register(skill: Skill): void {
    const key = skill.metadata.name.toLowerCase();
    if (this.skills.has(key)) {
      throw new Error(`Skill "${skill.metadata.name}" is already registered`);
    }
    this.skills.set(key, skill);
  }

  /**
   * Unregister a skill by name.
   */
  unregister(name: string): boolean {
    return this.skills.delete(name.toLowerCase());
  }

  /**
   * Get a skill by name.
   */
  get(name: string): Skill | undefined {
    return this.skills.get(name.toLowerCase());
  }

  /**
   * Find skills by category.
   */
  findByCategory(category: SkillCategory): Skill[] {
    return Array.from(this.skills.values())
      .filter(s => s.metadata.category === category);
  }

  /**
   * Find skills by tag.
   */
  findByTag(tag: string): Skill[] {
    const lower = tag.toLowerCase();
    return Array.from(this.skills.values())
      .filter(s => s.metadata.tags.some(t => t.toLowerCase() === lower));
  }

  /**
   * Search skills by name or description.
   */
  search(query: string): Skill[] {
    const lower = query.toLowerCase();
    return Array.from(this.skills.values())
      .filter(s =>
        s.metadata.name.toLowerCase().includes(lower) ||
        s.metadata.description.toLowerCase().includes(lower)
      );
  }

  /**
   * List all registered skills.
   */
  listAll(): SkillMetadata[] {
    return Array.from(this.skills.values()).map(s => s.metadata);
  }

  /**
   * Get count of registered skills.
   */
  get size(): number {
    return this.skills.size;
  }
}
