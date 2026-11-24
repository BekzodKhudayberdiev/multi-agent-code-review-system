import { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { RefactoringSuggestionJSONSchema } from '../types/index.js';
import { REFACTORING_SUGGESTER_PROMPT } from '../prompts/index.js';

/**
 * Refactoring Suggester Subagent
 *
 * Identifies opportunities for:
 * - Design pattern improvements
 * - Modernization of language features
 * - Code extraction (methods, classes)
 * - Simplification and clarity improvements
 * - Dead code elimination
 */
export const refactoringSuggester: AgentDefinition = {
  description: 'Specialized agent for identifying refactoring opportunities including design patterns, modernization, code extraction, and architectural improvements',
  tools: ['web_search', 'skill'] as unknown as string[],
  model: 'inherit'
} as unknown as AgentDefinition;
