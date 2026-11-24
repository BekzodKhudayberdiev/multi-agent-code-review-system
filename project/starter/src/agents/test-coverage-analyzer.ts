import { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { TestCoverageResultJSONSchema } from '../types/index.js';
import { TEST_COVERAGE_ANALYZER_PROMPT } from '../prompts/index.js';

/**
 * Test Coverage Analyzer Subagent
 *
 * Analyzes pull request for:
 * - Test coverage gaps
 * - Functions/methods without tests
 * - Critical untested code paths
 * - Specific test case suggestions with assertions
 */
export const testCoverageAnalyzer: AgentDefinition = {
  description: 'Specialized agent for evaluating test coverage, identifying untested code paths, and suggesting specific test cases with meaningful assertions',
  tools: ['web_search', 'skill'] as unknown as string[],
  model: 'inherit'
} as unknown as AgentDefinition;
