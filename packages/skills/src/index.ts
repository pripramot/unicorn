/**
 * @gts/skills - Skill Registry & Executor
 *
 * Provides a pluggable skill system for registering, discovering,
 * and executing forensics, OSINT, and security analysis skills.
 */

export { SkillRegistry, type Skill, type SkillCategory, type SkillMetadata } from './registry';
export { SkillExecutor, type ExecutionContext, type ExecutionResult } from './executor';
