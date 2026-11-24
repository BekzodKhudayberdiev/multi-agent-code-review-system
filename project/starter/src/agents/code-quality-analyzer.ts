import { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { CodeQualityResultJSONSchema } from '../types/index.js';
import { CODE_QUALITY_ANALYZER_PROMPT } from '../prompts/index.js';

/**
 * Code Quality Analyzer Subagent
 *
 * Analyzes pull request code for:
 * - Security vulnerabilities
 * - Performance issues
 * - Best practice violations
 * - Maintainability concerns
 */
export const codeQualityAnalyzer: AgentDefinition = {
  description: 'Specialized agent for analyzing code quality, security vulnerabilities, performance issues, and best practices in pull request changes',
  tools: ['web_search', 'skill'] as unknown as string[],
  model: 'inherit'
} as unknown as AgentDefinition;
