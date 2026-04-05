/**
 * Episodic Memory - Experience-Based Learning
 *
 * Records and recalls episodes (sequences of events) from past agent interactions,
 * enabling experience-based decision making and pattern recognition.
 */

export interface EpisodeEvent {
  type: 'action' | 'observation' | 'decision' | 'result';
  description: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

export interface Episode {
  id: string;
  title: string;
  events: EpisodeEvent[];
  outcome: 'success' | 'failure' | 'partial' | 'unknown';
  tags: string[];
  lessonsLearned?: string[];
  startedAt: number;
  completedAt?: number;
}

export class EpisodicMemory {
  private episodes: Map<string, Episode> = new Map();
  private activeEpisode: Episode | null = null;

  /**
   * Start recording a new episode.
   */
  startEpisode(title: string, tags: string[] = []): Episode {
    const episode: Episode = {
      id: `ep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title,
      events: [],
      outcome: 'unknown',
      tags,
      startedAt: Date.now(),
    };

    this.activeEpisode = episode;
    return episode;
  }

  /**
   * Record an event in the active episode.
   */
  recordEvent(type: EpisodeEvent['type'], description: string, data?: Record<string, unknown>): EpisodeEvent | null {
    if (!this.activeEpisode) return null;

    const event: EpisodeEvent = {
      type,
      description,
      data,
      timestamp: Date.now(),
    };

    this.activeEpisode.events.push(event);
    return event;
  }

  /**
   * Complete the active episode with an outcome.
   */
  completeEpisode(outcome: Episode['outcome'], lessonsLearned?: string[]): Episode | null {
    if (!this.activeEpisode) return null;

    this.activeEpisode.outcome = outcome;
    this.activeEpisode.lessonsLearned = lessonsLearned;
    this.activeEpisode.completedAt = Date.now();

    this.episodes.set(this.activeEpisode.id, this.activeEpisode);
    const completed = this.activeEpisode;
    this.activeEpisode = null;

    return completed;
  }

  /**
   * Find similar past episodes by tags.
   */
  findSimilar(tags: string[], limit: number = 5): Episode[] {
    const tagSet = new Set(tags.map(t => t.toLowerCase()));

    return Array.from(this.episodes.values())
      .map(ep => ({
        episode: ep,
        matchScore: ep.tags.filter(t => tagSet.has(t.toLowerCase())).length,
      }))
      .filter(({ matchScore }) => matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit)
      .map(({ episode }) => episode);
  }

  /**
   * Get successful episodes for learning.
   */
  getSuccessful(): Episode[] {
    return Array.from(this.episodes.values())
      .filter(ep => ep.outcome === 'success');
  }

  /**
   * Get lessons learned from past episodes.
   */
  getLessons(tags?: string[]): string[] {
    let episodes = Array.from(this.episodes.values());
    if (tags) {
      const tagSet = new Set(tags.map(t => t.toLowerCase()));
      episodes = episodes.filter(ep =>
        ep.tags.some(t => tagSet.has(t.toLowerCase()))
      );
    }
    return episodes
      .flatMap(ep => ep.lessonsLearned ?? [])
      .filter((v, i, a) => a.indexOf(v) === i); // unique
  }

  /**
   * Get the currently active episode.
   */
  getActive(): Episode | null {
    return this.activeEpisode;
  }

  /**
   * Get total episodes count.
   */
  get size(): number {
    return this.episodes.size;
  }
}
