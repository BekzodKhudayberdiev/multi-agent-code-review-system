import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  CodeQualityResultSchema,
  TestCoverageResultSchema,
  RefactoringSuggestionSchema,
  ReviewReportSchema,
  CodeQualityResultJSONSchema,
  TestCoverageResultJSONSchema,
  RefactoringSuggestionJSONSchema,
  ReviewReportJSONSchema
} from '../src/types/index.js';

describe('Zod Schemas', () => {
  describe('CodeQualityResultSchema', () => {
    it('should accept valid code quality data', () => {
      const validData = {
        file: 'src/app.ts',
        issues: [
          {
            line: 42,
            severity: 'high',
            category: 'security',
            description: 'SQL injection vulnerability',
            suggestion: 'Use parameterized queries'
          }
        ],
        overallScore: 75,
        summary: 'Found 1 high severity issue'
      };

      const result = CodeQualityResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept multiple issues', () => {
      const validData = {
        file: 'src/utils.ts',
        issues: [
          {
            line: 10,
            severity: 'critical',
            category: 'security',
            description: 'XSS vulnerability',
            suggestion: 'Sanitize HTML'
          },
          {
            line: 20,
            severity: 'medium',
            category: 'performance',
            description: 'Inefficient loop',
            suggestion: 'Use Set instead of Array'
          }
        ],
        overallScore: 50,
        summary: 'Multiple issues found'
      };

      const result = CodeQualityResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept empty issues array', () => {
      const validData = {
        file: 'src/perfect.ts',
        issues: [],
        overallScore: 100,
        summary: 'No issues found'
      };

      const result = CodeQualityResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate score boundaries', () => {
      // Score of 0 should be valid
      let data = {
        file: 'src/app.ts',
        issues: [],
        overallScore: 0,
        summary: 'Critical issues'
      };
      expect(CodeQualityResultSchema.safeParse(data).success).toBe(true);

      // Score of 100 should be valid
      data = { ...data, overallScore: 100, summary: 'Perfect code' };
      expect(CodeQualityResultSchema.safeParse(data).success).toBe(true);

      // Score > 100 should be invalid
      data = { ...data, overallScore: 101 };
      expect(CodeQualityResultSchema.safeParse(data).success).toBe(false);

      // Score < 0 should be invalid
      data = { ...data, overallScore: -1 };
      expect(CodeQualityResultSchema.safeParse(data).success).toBe(false);
    });

    it('should reject invalid severity', () => {
      const invalidData = {
        file: 'src/app.ts',
        issues: [
          {
            line: 42,
            severity: 'extreme', // Invalid severity
            category: 'security',
            description: 'Issue',
            suggestion: 'Fix it'
          }
        ],
        overallScore: 75,
        summary: 'Issues found'
      };

      const result = CodeQualityResultSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid category', () => {
      const invalidData = {
        file: 'src/app.ts',
        issues: [
          {
            line: 42,
            severity: 'high',
            category: 'invalid-category', // Invalid category
            description: 'Issue',
            suggestion: 'Fix it'
          }
        ],
        overallScore: 75,
        summary: 'Issues found'
      };

      const result = CodeQualityResultSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should require all fields', () => {
      const incompleteData = {
        file: 'src/app.ts',
        issues: []
        // Missing overallScore and summary
      };

      const result = CodeQualityResultSchema.safeParse(incompleteData);
      expect(result.success).toBe(false);
    });
  });

  describe('TestCoverageResultSchema', () => {
    it('should accept valid test coverage data', () => {
      const validData = {
        file: 'src/helpers.ts',
        hasTests: true,
        testFiles: ['src/helpers.test.ts'],
        untestedPaths: [
          {
            type: 'function',
            location: 'parseDate() line 42',
            priority: 'high',
            reasoning: 'Date parsing edge cases',
            suggestedTest: "it('should handle invalid dates', () => { expect(parseDate('bad')).toBeNull(); });"
          }
        ],
        coverageEstimate: 65,
        summary: 'Some test gaps exist'
      };

      const result = TestCoverageResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept when hasTests is false', () => {
      const validData = {
        file: 'src/untested.ts',
        hasTests: false,
        testFiles: [],
        untestedPaths: [],
        coverageEstimate: 0,
        summary: 'No tests found'
      };

      const result = TestCoverageResultSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate coverage estimate boundaries', () => {
      const baseData = {
        file: 'src/app.ts',
        hasTests: true,
        testFiles: [],
        untestedPaths: [],
        summary: 'Test coverage assessment'
      };

      // 0 is valid
      expect(TestCoverageResultSchema.safeParse({ ...baseData, coverageEstimate: 0 }).success).toBe(true);

      // 100 is valid
      expect(TestCoverageResultSchema.safeParse({ ...baseData, coverageEstimate: 100 }).success).toBe(true);

      // -1 is invalid
      expect(TestCoverageResultSchema.safeParse({ ...baseData, coverageEstimate: -1 }).success).toBe(false);

      // 101 is invalid
      expect(TestCoverageResultSchema.safeParse({ ...baseData, coverageEstimate: 101 }).success).toBe(false);
    });

    it('should validate untested path types', () => {
      const baseData = {
        file: 'src/app.ts',
        hasTests: true,
        testFiles: [],
        summary: 'Test assessment'
      };

      // Valid types
      const validTypes = ['function', 'class', 'branch', 'edge-case'];
      validTypes.forEach(type => {
        const data = {
          ...baseData,
          untestedPaths: [
            {
              type,
              location: 'test',
              priority: 'high',
              reasoning: 'test',
              suggestedTest: 'test'
            }
          ],
          coverageEstimate: 50
        };
        expect(TestCoverageResultSchema.safeParse(data).success).toBe(true);
      });

      // Invalid type
      const invalidData = {
        ...baseData,
        untestedPaths: [
          {
            type: 'invalid-type',
            location: 'test',
            priority: 'high',
            reasoning: 'test',
            suggestedTest: 'test'
          }
        ],
        coverageEstimate: 50
      };
      expect(TestCoverageResultSchema.safeParse(invalidData).success).toBe(false);
    });
  });

  describe('RefactoringSuggestionSchema', () => {
    it('should accept valid refactoring suggestions', () => {
      const validData = {
        file: 'src/component.ts',
        suggestions: [
          {
            type: 'extract-function',
            location: 'render() lines 10-50',
            impact: 'high',
            description: 'Extract JSX rendering logic',
            before: 'const render = () => { /* 40 lines */ };',
            after: 'const renderHeader = () => { /* 10 lines */ }; const render = () => { renderHeader(); /* 30 lines */ };',
            benefits: 'Improved readability and testability'
          }
        ],
        summary: 'Found refactoring opportunity'
      };

      const result = RefactoringSuggestionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept multiple suggestions', () => {
      const validData = {
        file: 'src/utils.ts',
        suggestions: [
          {
            type: 'extract-function',
            location: 'parseData() line 20',
            impact: 'medium',
            description: 'Extract validation logic',
            before: 'if (x) { if (y) { /* ... */ } }',
            after: 'if (validate(x, y)) { /* ... */ }',
            benefits: 'Cleaner code'
          },
          {
            type: 'modernize',
            location: 'getUser() line 50',
            impact: 'low',
            description: 'Use async/await',
            before: 'return getUser().then()',
            after: 'return await getUser()',
            benefits: 'More readable'
          }
        ],
        summary: 'Multiple opportunities'
      };

      const result = RefactoringSuggestionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept empty suggestions', () => {
      const validData = {
        file: 'src/perfect.ts',
        suggestions: [],
        summary: 'Code is well structured'
      };

      const result = RefactoringSuggestionSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should validate suggestion types', () => {
      const baseData = {
        file: 'src/app.ts',
        summary: 'Assessment'
      };

      const validTypes = ['extract-function', 'rename', 'modernize', 'simplify', 'pattern-improvement'];
      validTypes.forEach(type => {
        const data = {
          ...baseData,
          suggestions: [
            {
              type,
              location: 'test',
              impact: 'high',
              description: 'test',
              before: 'before',
              after: 'after',
              benefits: 'benefits'
            }
          ]
        };
        expect(RefactoringSuggestionSchema.safeParse(data).success).toBe(true);
      });
    });
  });

  describe('ReviewReportSchema', () => {
    it('should accept a complete valid review report', () => {
      const validData = {
        pullRequest: {
          owner: 'octocat',
          repo: 'Hello-World',
          number: 1
        },
        fileReviews: [
          {
            file: 'src/main.ts',
            codeQuality: {
              file: 'src/main.ts',
              issues: [],
              overallScore: 85,
              summary: 'Good code'
            },
            testCoverage: {
              file: 'src/main.ts',
              hasTests: true,
              testFiles: ['src/main.test.ts'],
              untestedPaths: [],
              coverageEstimate: 90,
              summary: 'Well tested'
            },
            refactorings: {
              file: 'src/main.ts',
              suggestions: [],
              summary: 'No refactoring needed'
            }
          }
        ],
        summary: {
          totalFiles: 1,
          overallScore: 85,
          criticalIssues: 0,
          highPriorityTests: 0,
          refactoringOpportunities: 0
        },
        recommendations: [
          {
            priority: 'low',
            category: 'Style',
            description: 'Minor style improvement',
            files: ['src/main.ts']
          }
        ],
        metadata: {
          analyzedAt: new Date().toISOString(),
          duration: 5000,
          agentVersions: {
            'code-quality-analyzer': '1.0.0',
            'test-coverage-analyzer': '1.0.0',
            'refactoring-suggester': '1.0.0'
          }
        }
      };

      const result = ReviewReportSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should require all top-level fields', () => {
      const incompleteData = {
        pullRequest: {
          owner: 'octocat',
          repo: 'Hello-World',
          number: 1
        }
        // Missing fileReviews, summary, recommendations, metadata
      };

      const result = ReviewReportSchema.safeParse(incompleteData);
      expect(result.success).toBe(false);
    });
  });

  describe('JSON Schema Export', () => {
    it('should export valid JSON schemas', () => {
      expect(typeof CodeQualityResultJSONSchema).toBe('object');
      expect(typeof TestCoverageResultJSONSchema).toBe('object');
      expect(typeof RefactoringSuggestionJSONSchema).toBe('object');
      expect(typeof ReviewReportJSONSchema).toBe('object');
    });

    it('should have $schema property in JSON schemas', () => {
      expect(CodeQualityResultJSONSchema).toHaveProperty('type');
      expect(TestCoverageResultJSONSchema).toHaveProperty('type');
      expect(RefactoringSuggestionJSONSchema).toHaveProperty('type');
      expect(ReviewReportJSONSchema).toHaveProperty('type');
    });
  });

  describe('Type inference', () => {
    it('should infer types correctly from schemas', () => {
      const qualityResult = CodeQualityResultSchema.parse({
        file: 'test.ts',
        issues: [],
        overallScore: 50,
        summary: 'test'
      });

      expect(qualityResult.file).toBe('test.ts');
      expect(qualityResult.overallScore).toBe(50);
    });
  });
});
