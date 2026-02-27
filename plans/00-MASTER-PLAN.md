# Master Plan - Tutoring System Overhaul

## Current State Assessment
- **Backend:** 388 tests pass, 0 failures - solid foundation
- **Frontend:** 3 TS errors, 26 lint errors, 38 warnings, 2 test failures
- **Git:** Massive uncommitted changes (phases 5-14 implemented but not committed properly)
- **CHECKLIST.md:** Outdated (says phase 4 complete, but code has phases 5-14)

## Phases

### Phase 1: Code Quality & Bug Fixes (`01-code-quality.md`)
- Fix TypeScript errors in reports page
- Fix all ESLint errors and warnings
- Fix 2 failing frontend test suites (QuizCard, AttemptsTable)
- Fix unused imports and variables
- Fix SortIcon component-in-render issue

### Phase 2: Backend Audit & Fixes (`02-backend-fixes.md`)
- Fix QuizAttemptStatus enum missing 'graded' case
- Fix ExamResult redundant columns (marks_obtained vs obtained_marks)
- Verify all model relationships are consistent
- Ensure all API error messages are Arabic
- Security audit (SQL injection, mass assignment, auth checks)

### Phase 3: Frontend Completion & Polish (`03-frontend-polish.md`)
- Fix Arabic localization (validation messages still in English)
- Complete portal pages (payments, schedule, announcements)
- Fix uiStore persistence (theme/sidebar lost on refresh)
- Standardize portal auth with Zustand
- Fix date formatting to use Arabic locale

### Phase 4: Dashboard & UI Enhancement (`04-dashboard-ui.md`)
- Professional admin dashboard with charts/stats
- Responsive design verification
- RTL layout consistency
- Loading states and error boundaries
- Toast notification consistency

### Phase 5: Integration Testing (`05-integration-testing.md`)
- Run full backend test suite
- Run full frontend test suite
- Test frontend-backend integration manually
- Browser visual testing with Puppeteer
- Cross-check API contracts

### Phase 6: Security & Performance (`06-security-performance.md`)
- CSRF protection verification
- Rate limiting verification
- Input sanitization
- XSS prevention
- Performance monitoring middleware check

### Phase 7: Final Commit & Push (`07-final-push.md`)
- Update CHECKLIST.md with actual progress
- Update CLAUDE.md with corrections
- Commit all changes with descriptive messages
- Push to GitHub
- Verify CI passes

## Execution Order
1 → 2 → 3 → 4 → 5 → 6 → 7
