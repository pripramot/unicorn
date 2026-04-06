/**
 * Skill Executor - Execute Skills with Context
 *
 * Manages skill execution with input validation,
 * context injection, and result handling.
 */

import { SkillRegistry, type Skill } from './registry';

export interface ExecutionContext {
  userId?: string;
  sessionId?: string;
  permissions?: string[];
  metadata?: Record<string, unknown>;
}

export interface ExecutionResult {
  skillName: string;
  success: boolean;
  output?: unknown;
  error?: string;
  durationMs: number;
  timestamp: number;
}

export class SkillExecutor {
  private registry: SkillRegistry;
  private executionLog: ExecutionResult[] = [];

  constructor(registry: SkillRegistry) {
    this.registry = registry;
  }

  /**
   * Execute a skill by name with the given input.
   */
  async execute(
    skillName: string,
    input: Record<string, unknown>,
    context?: ExecutionContext
  ): Promise<ExecutionResult> {
    const startTime = Date.now();
    const skill = this.registry.get(skillName);

    if (!skill) {
      const result: ExecutionResult = {
        skillName,
        success: false,
        error: `Skill "${skillName}" not found`,
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
      };
      this.executionLog.push(result);
      return result;
    }

    // Check permissions
    if (skill.metadata.requiredPermissions && context?.permissions) {
      const missing = skill.metadata.requiredPermissions.filter(
        p => !context.permissions!.includes(p)
      );
      if (missing.length > 0) {
        const result: ExecutionResult = {
          skillName,
          success: false,
          error: `Missing permissions: ${missing.join(', ')}`,
          durationMs: Date.now() - startTime,
          timestamp: Date.now(),
        };
        this.executionLog.push(result);
        return result;
      }
    }

    // Validate input
    if (skill.validate && !skill.validate(input)) {
      const result: ExecutionResult = {
        skillName,
        success: false,
        error: 'Input validation failed',
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
      };
      this.executionLog.push(result);
      return result;
    }

    // Execute
    try {
      const output = await skill.execute(input);
      const result: ExecutionResult = {
        skillName,
        success: true,
        output,
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
      };
      this.executionLog.push(result);
      return result;
    } catch (err) {
      const result: ExecutionResult = {
        skillName,
        success: false,
        error: err instanceof Error ? err.message : String(err),
        durationMs: Date.now() - startTime,
        timestamp: Date.now(),
      };
      this.executionLog.push(result);
      return result;
    }
  }

  /**
   * Get execution history.
   */
  getHistory(limit?: number): ExecutionResult[] {
    if (limit) {
      return this.executionLog.slice(-limit);
    }
    return [...this.executionLog];
  }

  /**
   * Get execution statistics.
   */
  getStats(): { total: number; successful: number; failed: number; avgDurationMs: number } {
    const total = this.executionLog.length;
    const successful = this.executionLog.filter(r => r.success).length;
    const failed = total - successful;
    const avgDurationMs = total > 0
      ? this.executionLog.reduce((sum, r) => sum + r.durationMs, 0) / total
      : 0;

    return { total, successful, failed, avgDurationMs };
  }
}
