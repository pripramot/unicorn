/**
 * @gts/memory - Agent Memory System
 *
 * Provides short-term (working), long-term (persistent),
 * episodic (experience-based), and forensic (evidence & case management)
 * memory for intelligent context management.
 */

export { ShortTermMemory, type MemoryEntry } from './short-term';
export { LongTermMemory, type StoredMemory, type MemorySearchResult } from './long-term';
export { EpisodicMemory, type Episode, type EpisodeEvent } from './episodic';
export {
  ForensicMemory,
  type ForensicEvidence,
  type ForensicCase,
  type ForensicFinding,
  type TimelineEvent,
  type ChainOfCustodyEntry,
  type EvidenceType,
  type EvidenceSeverity,
  type CaseStatus,
  type ChainAction,
} from './forensic';
