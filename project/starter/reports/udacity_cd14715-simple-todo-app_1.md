# 🔍 Code Review Report

## Summary

| Metric | Value |
|--------|-------|
| **Overall Score** | 82/100 |
| **Files Reviewed** | 1 |
| **Critical Issues** | 0 |
| **High Priority Tests** | 4 |
| **Refactoring Opportunities** | 5 |

## 🎯 Top Recommendations

1. ⚠️ **Security**: Address security vulnerabilities identified in code review
   - Files: fixtures/clean-code.ts

2. ⚠️ **Testing**: Increase test coverage for critical and high-priority paths
   - Files: fixtures/clean-code.ts

## 📁 File Details

### 📄 `fixtures/clean-code.ts`

**Quality Score:** 82/100 | **Coverage:** ~50%

#### Issues (6)
  - Line 24: `medium` Email validation regex is too permissive and doesn't follow RFC 5322 standards. The pattern /^[^\s@]+@[^\s@]+\.[^\s@]+$/ allows invalid email formats like 'a@b.c' and doesn't handle edge cases properly.
  - Line 68: `medium` ID generation using Date.now() and Math.random() may not guarantee uniqueness in high-concurrency scenarios. This approach is fragile for distributed systems.
  - Line 29: `low` The sanitizeInput function uses multiple replace() calls sequentially, which is inefficient for longer strings. While the logic is correct, it could be optimized.

  *...and 3 more*

#### Test Gaps (7)
  - `isValidEmail() line 21` (high priority)
  - `sanitizeInput() line 29` (critical priority)

  *...and 5 more*

#### Refactoring Opportunities (5)
  - **modernize**: Use modern email validation approach with built-in URL API instead of regex, or use a well-tested library like email-validator. This improves reliability and maintainability.
  - **extract-function**: Extract validation logic into a separate function to improve separation of concerns and make the validation reusable. This follows Single Responsibility Principle.

  *...and 3 more*

---

*Generated at 2026-11-24T19:28:32.961Z • Duration: 26914ms*
