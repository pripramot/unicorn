/**
 * @gts/brain - AI Reasoning & Planning Module
 *
 * Provides chain-of-thought reasoning, hierarchical task planning,
 * and context-aware decision making for the GTS agent system.
 * Supports Gemma 4 deep reasoning mode for complex logical tasks.
 */

export { ReasoningEngine, type ReasoningStep, type ReasoningResult, type ReasoningBackend } from './reasoning';
export { TaskPlanner, type Task, type Plan, type PlanStatus } from './planning';
