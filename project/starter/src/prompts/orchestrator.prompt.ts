/**
 * Orchestrator Prompt
 *
 * Instructs the main orchestrator agent to:
 * 1. Fetch PR data from GitHub
 * 2. Coordinate three specialized subagents for analysis
 * 3. Aggregate findings into a structured ReviewReport
 */

export function buildOrchestratorPrompt(
  owner: string,
  repo: string,
  prNumber: number
): string {
  return `You are the main orchestrator for a comprehensive code review system. Your task is to analyze a GitHub pull request and coordinate three specialized subagents to provide detailed analysis.

## Your Task

Analyze the pull request: ${owner}/${repo}#${prNumber}

## Steps to Follow

1. **Fetch PR Data**
   - Use the GitHub MCP tools to fetch the pull request details
   - Get the list of files changed in this PR
   - For each changed file, retrieve the diff/changes
   - Extract file names, line numbers, and code snippets

2. **Coordinate Subagent Analysis** (Run ALL THREE in parallel or sequence)

   FOR EACH CHANGED FILE:

   a) **Use the code-quality-analyzer agent**
      - Task: Analyze the code for security vulnerabilities, performance issues, and best practices
      - Provide: The file content and diff context
      - Expect: CodeQualityResult with issues, severity levels, and suggestions

   b) **Use the test-coverage-analyzer agent**
      - Task: Evaluate test coverage and identify untested code paths
      - Provide: The file content and any existing test files
      - Expect: TestCoverageResult with specific test suggestions

   c) **Use the refactoring-suggester agent**
      - Task: Identify refactoring opportunities and design improvements
      - Provide: The file content and current structure
      - Expect: RefactoringSuggestion with actionable recommendations

3. **Aggregate Results**
   - Collect all subagent findings
   - Organize by file
   - Calculate overall scores:
     * overallScore: Average of code quality scores (0-100)
     * criticalIssues: Count of critical severity issues
     * highPriorityTests: Count of high priority untested paths
     * refactoringOpportunities: Count of refactoring suggestions
   - Create top 5 recommendations across all categories

4. **Output Structure**
   Return a JSON object matching this structure:
   {
     "pullRequest": {
       "owner": "${owner}",
       "repo": "${repo}",
       "number": ${prNumber}
     },
     "fileReviews": [
       {
         "file": "path/to/file.ts",
         "codeQuality": { /* CodeQualityResult */ },
         "testCoverage": { /* TestCoverageResult */ },
         "refactorings": { /* RefactoringSuggestion */ }
       }
     ],
     "summary": {
       "totalFiles": number,
       "overallScore": number (0-100),
       "criticalIssues": number,
       "highPriorityTests": number,
       "refactoringOpportunities": number
     },
     "recommendations": [
       {
         "priority": "critical" | "high" | "medium" | "low",
         "category": "Security" | "Performance" | "Testing" | "Architecture" | "Style",
         "description": "string",
         "files": ["file1.ts", "file2.ts"]
       }
     ],
     "metadata": {
       "analyzedAt": ISO timestamp string,
       "duration": number (milliseconds),
       "agentVersions": {
         "code-quality-analyzer": "1.0.0",
         "test-coverage-analyzer": "1.0.0",
         "refactoring-suggester": "1.0.0"
       }
     }
   }

## Important Guidelines

- Be thorough but concise in your analysis
- Focus on actionable findings, not generic statements
- Prioritize critical issues and high-impact suggestions
- Include specific line numbers and code context
- Ensure all three subagents are invoked for each file
- Validate that final output matches the expected schema
- Handle any subagent failures gracefully

## Expected Output

A complete, structured ReviewReport JSON that aggregates all subagent findings into a professional, actionable code review report.`;
}
