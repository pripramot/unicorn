/**
 * Forensic Memory - Digital Forensics Evidence & Case Management
 *
 * Specialized memory store for digital forensics workflows:
 * - Evidence chain of custody tracking
 * - Case management with timeline reconstruction
 * - Artifact cataloging (files, network, registry, etc.)
 * - Forensic analysis notes and findings
 *
 * Designed for integration with GTS Alpha Forensics platform.
 * All operations are timestamped for audit trail compliance.
 */

/**
 * Generate a unique ID with a prefix.
 * Uses timestamp + high-entropy random for uniqueness.
 */
function generateId(prefix: string): string {
  const ts = Date.now().toString(36);
  const r1 = Math.random().toString(36).slice(2, 10);
  const r2 = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${ts}_${r1}${r2}`;
}

// ─── Evidence Types ─────────────────────────────────────────

export type EvidenceType =
  | 'disk_image'
  | 'memory_dump'
  | 'network_capture'
  | 'log_file'
  | 'registry_hive'
  | 'email'
  | 'document'
  | 'browser_artifact'
  | 'mobile_backup'
  | 'malware_sample'
  | 'other';

export type EvidenceSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export type CaseStatus = 'open' | 'in_progress' | 'pending_review' | 'closed' | 'archived';

export type ChainAction = 'collected' | 'transferred' | 'analyzed' | 'stored' | 'released';

// ─── Interfaces ─────────────────────────────────────────────

export interface ChainOfCustodyEntry {
  action: ChainAction;
  handler: string;
  location: string;
  notes?: string;
  timestamp: number;
}

export interface ForensicEvidence {
  id: string;
  caseId: string;
  type: EvidenceType;
  name: string;
  description: string;
  severity: EvidenceSeverity;
  hash?: {
    md5?: string;
    sha1?: string;
    sha256?: string;
  };
  sourcePath?: string;
  tags: string[];
  chainOfCustody: ChainOfCustodyEntry[];
  metadata: Record<string, unknown>;
  collectedAt: number;
  createdAt: number;
  updatedAt: number;
}

export interface ForensicCase {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  investigator: string;
  evidenceIds: string[];
  findings: ForensicFinding[];
  timeline: TimelineEvent[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
  closedAt?: number;
}

export interface ForensicFinding {
  id: string;
  title: string;
  description: string;
  severity: EvidenceSeverity;
  evidenceIds: string[];
  iocIndicators?: string[];
  timestamp: number;
}

export interface TimelineEvent {
  timestamp: number;
  description: string;
  source: string;
  evidenceId?: string;
  category: string;
}

// ─── Forensic Memory Store ──────────────────────────────────

export class ForensicMemory {
  private evidence: Map<string, ForensicEvidence> = new Map();
  private cases: Map<string, ForensicCase> = new Map();

  // ── Case Management ──────────────────────────────────────

  /**
   * Create a new forensic case.
   */
  createCase(title: string, description: string, investigator: string, tags: string[] = []): ForensicCase {
    const now = Date.now();
    const forensicCase: ForensicCase = {
      id: generateId('case'),
      title,
      description,
      status: 'open',
      investigator,
      evidenceIds: [],
      findings: [],
      timeline: [],
      tags,
      createdAt: now,
      updatedAt: now,
    };

    this.cases.set(forensicCase.id, forensicCase);
    return forensicCase;
  }

  /**
   * Get a case by ID.
   */
  getCase(caseId: string): ForensicCase | undefined {
    return this.cases.get(caseId);
  }

  /**
   * Update case status.
   */
  updateCaseStatus(caseId: string, status: CaseStatus): ForensicCase | undefined {
    const c = this.cases.get(caseId);
    if (!c) return undefined;

    c.status = status;
    c.updatedAt = Date.now();
    if (status === 'closed' || status === 'archived') {
      c.closedAt = Date.now();
    }
    return c;
  }

  /**
   * List all cases, optionally filtered by status.
   */
  listCases(status?: CaseStatus): ForensicCase[] {
    const all = Array.from(this.cases.values());
    if (status) return all.filter(c => c.status === status);
    return all;
  }

  // ── Evidence Management ──────────────────────────────────

  /**
   * Add evidence to a case with chain of custody tracking.
   */
  addEvidence(
    caseId: string,
    name: string,
    type: EvidenceType,
    description: string,
    options: {
      severity?: EvidenceSeverity;
      hash?: ForensicEvidence['hash'];
      sourcePath?: string;
      tags?: string[];
      collectedBy?: string;
      location?: string;
      metadata?: Record<string, unknown>;
    } = {},
  ): ForensicEvidence | undefined {
    const forensicCase = this.cases.get(caseId);
    if (!forensicCase) return undefined;

    const now = Date.now();
    const evidence: ForensicEvidence = {
      id: generateId('ev'),
      caseId,
      type,
      name,
      description,
      severity: options.severity ?? 'medium',
      hash: options.hash,
      sourcePath: options.sourcePath,
      tags: options.tags ?? [],
      chainOfCustody: [
        {
          action: 'collected',
          handler: options.collectedBy ?? forensicCase.investigator,
          location: options.location ?? 'unknown',
          timestamp: now,
        },
      ],
      metadata: options.metadata ?? {},
      collectedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    this.evidence.set(evidence.id, evidence);
    forensicCase.evidenceIds.push(evidence.id);
    forensicCase.updatedAt = now;

    return evidence;
  }

  /**
   * Get evidence by ID.
   */
  getEvidence(evidenceId: string): ForensicEvidence | undefined {
    return this.evidence.get(evidenceId);
  }

  /**
   * Get all evidence for a case.
   */
  getCaseEvidence(caseId: string): ForensicEvidence[] {
    return Array.from(this.evidence.values())
      .filter(e => e.caseId === caseId);
  }

  /**
   * Add a chain of custody entry to evidence.
   */
  addCustodyEntry(
    evidenceId: string,
    action: ChainAction,
    handler: string,
    location: string,
    notes?: string,
  ): ForensicEvidence | undefined {
    const ev = this.evidence.get(evidenceId);
    if (!ev) return undefined;

    ev.chainOfCustody.push({
      action,
      handler,
      location,
      notes,
      timestamp: Date.now(),
    });
    ev.updatedAt = Date.now();
    return ev;
  }

  // ── Findings & Timeline ──────────────────────────────────

  /**
   * Add a forensic finding to a case.
   */
  addFinding(
    caseId: string,
    title: string,
    description: string,
    severity: EvidenceSeverity,
    evidenceIds: string[] = [],
    iocIndicators?: string[],
  ): ForensicFinding | undefined {
    const forensicCase = this.cases.get(caseId);
    if (!forensicCase) return undefined;

    const finding: ForensicFinding = {
      id: generateId('find'),
      title,
      description,
      severity,
      evidenceIds,
      iocIndicators,
      timestamp: Date.now(),
    };

    forensicCase.findings.push(finding);
    forensicCase.updatedAt = Date.now();
    return finding;
  }

  /**
   * Add a timeline event to a case for timeline reconstruction.
   */
  addTimelineEvent(
    caseId: string,
    timestamp: number,
    description: string,
    source: string,
    category: string,
    evidenceId?: string,
  ): TimelineEvent | undefined {
    const forensicCase = this.cases.get(caseId);
    if (!forensicCase) return undefined;

    const event: TimelineEvent = {
      timestamp,
      description,
      source,
      evidenceId,
      category,
    };

    forensicCase.timeline.push(event);
    // Keep timeline sorted chronologically
    forensicCase.timeline.sort((a, b) => a.timestamp - b.timestamp);
    forensicCase.updatedAt = Date.now();
    return event;
  }

  /**
   * Get the reconstructed timeline for a case.
   */
  getTimeline(caseId: string, options: {
    category?: string;
    startTime?: number;
    endTime?: number;
  } = {}): TimelineEvent[] {
    const forensicCase = this.cases.get(caseId);
    if (!forensicCase) return [];

    let events = forensicCase.timeline;

    if (options.category) {
      events = events.filter(e => e.category === options.category);
    }
    if (options.startTime) {
      events = events.filter(e => e.timestamp >= options.startTime!);
    }
    if (options.endTime) {
      events = events.filter(e => e.timestamp <= options.endTime!);
    }

    return events;
  }

  // ── Search & Analysis ────────────────────────────────────

  /**
   * Search evidence across all cases by keyword.
   */
  searchEvidence(query: string, options: {
    type?: EvidenceType;
    severity?: EvidenceSeverity;
    limit?: number;
  } = {}): ForensicEvidence[] {
    const lower = query.toLowerCase();
    const limit = options.limit ?? 20;

    return Array.from(this.evidence.values())
      .filter(e => {
        if (options.type && e.type !== options.type) return false;
        if (options.severity && e.severity !== options.severity) return false;
        return (
          e.name.toLowerCase().includes(lower) ||
          e.description.toLowerCase().includes(lower) ||
          e.tags.some(t => t.toLowerCase().includes(lower))
        );
      })
      .slice(0, limit);
  }

  /**
   * Get evidence statistics for a case.
   */
  getCaseStats(caseId: string): {
    totalEvidence: number;
    bySeverity: Record<EvidenceSeverity, number>;
    byType: Record<string, number>;
    totalFindings: number;
    timelineEvents: number;
  } | undefined {
    const forensicCase = this.cases.get(caseId);
    if (!forensicCase) return undefined;

    const evidenceList = this.getCaseEvidence(caseId);
    const bySeverity: Record<EvidenceSeverity, number> = {
      critical: 0, high: 0, medium: 0, low: 0, informational: 0,
    };
    const byType: Record<string, number> = {};

    for (const e of evidenceList) {
      bySeverity[e.severity]++;
      byType[e.type] = (byType[e.type] ?? 0) + 1;
    }

    return {
      totalEvidence: evidenceList.length,
      bySeverity,
      byType,
      totalFindings: forensicCase.findings.length,
      timelineEvents: forensicCase.timeline.length,
    };
  }

  /**
   * Get total evidence count.
   */
  get evidenceCount(): number {
    return this.evidence.size;
  }

  /**
   * Get total cases count.
   */
  get caseCount(): number {
    return this.cases.size;
  }
}
