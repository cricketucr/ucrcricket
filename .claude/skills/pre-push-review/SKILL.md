---
name: pre-push-review
description: Run a multi-agent code review on staged git changes before pushing. Use this skill whenever the user wants to review their code before pushing, check staged changes for bugs or issues, run a pre-push audit, or asks for a local code review. Triggers on phrases like "review my changes", "check before I push", "pre-push review", "audit my staged changes", or any request to review local code changes.
---

# Pre-Push Code Review

Runs a thorough, multi-perspective code review on staged changes in the current branch before pushing. Outputs a scored, filtered markdown report.

## When to use

- User wants to review staged changes before pushing
- User says "check my code", "review before push", "audit changes", etc.
- Any pre-push code quality check

## Workflow

### Step 1: Validate the environment

Check we're in a git repo with staged changes:

```bash
git rev-parse --is-inside-work-tree
git diff --cached --stat
```

If no staged changes, tell the user and stop. Suggest they run `git add` first.

### Step 2: Gather context

Run these in parallel:

**A. Get the full diff**
```bash
git diff --cached
```

**B. Find all CLAUDE.md guideline files**
```bash
find . -name "CLAUDE.md" -not -path "*/node_modules/*" -not -path "*/.git/*"
```
Read each one found. If none exist, note that compliance checking will be skipped.

**C. Get list of changed files**
```bash
git diff --cached --name-only
```

**D. Get git blame/history context for changed files**
For each changed file, run:
```bash
git log --oneline -10 -- <filename>
git blame --date=short <filename> 2>/dev/null | head -50
```

**E. Get current branch name**
```bash
git branch --show-current
```

### Step 3: Summarize the changes

Before launching agents, write a brief 3-5 sentence summary of what the PR changes do (purpose, files touched, patterns observed). This helps agents focus.

### Step 4: Launch 3 review agents in parallel

Spawn these three agents simultaneously with the diff, file list, and summary as context:

---

**Agent 1 — Bug Detector**

Your job: Find obvious bugs *introduced by these changes only*. Do NOT flag pre-existing issues.

Look for:
- Null/undefined dereferences
- Off-by-one errors
- Missing error handling (try/catch, promise rejections, error returns)
- Race conditions or async issues
- Memory leaks (unclosed handles, missing cleanup)
- Incorrect logic (wrong operator, flipped condition)
- Security issues (injection, improper auth, exposed secrets)

For each issue found, output:
```
ISSUE: <short title>
FILE: <filename>
LINES: <start>-<end>
DESCRIPTION: <what the bug is and why it matters>
CONFIDENCE: <0-100>
```

Filter: Only report issues you're at least 50% confident about. Skip issues that linters would catch automatically (unused vars, formatting, etc.).

---

**Agent 2 — CLAUDE.md Compliance**

Your job: Check if the changes violate any guidelines in the CLAUDE.md files found.

For each potential violation:
- Quote the exact guideline from CLAUDE.md that is violated
- Point to the specific lines in the diff that violate it
- If no CLAUDE.md files exist, output: NO_GUIDELINES_FOUND

Output format:
```
ISSUE: <short title>
FILE: <filename>
LINES: <start>-<end>
GUIDELINE: "<exact quote from CLAUDE.md>"
DESCRIPTION: <how the change violates it>
CONFIDENCE: <0-100>
```

Only flag issues where you can cite the *exact* guideline text. Do not flag general style preferences not mentioned in CLAUDE.md.

---

**Agent 3 — History & Context Analyzer**

Your job: Use git blame and history to find issues that only make sense with historical context.

Look for:
- Changes that revert or undo a deliberate previous decision
- Patterns that break an established convention in this file
- Modifications to code with a history of bugs (touched many times recently)
- Changes that seem to misunderstand the purpose of existing code

Output format:
```
ISSUE: <short title>
FILE: <filename>
LINES: <start>-<end>
CONTEXT: <what history shows about this code>
DESCRIPTION: <why the change is problematic given history>
CONFIDENCE: <0-100>
```

---

### Step 5: Score and filter

Collect all issues from all 3 agents. For each issue:

1. Review the confidence score (0-100)
2. Apply the filter: **drop any issue with confidence < 80**
3. De-duplicate: if two agents flagged the same issue, merge them into one (use the higher confidence score)

Confidence guide:
- 0–25: Likely false positive
- 50: Real but uncertain
- 75: Confident it's real
- 80–100: High confidence — include in report

**False positives to exclude regardless of score:**
- Issues not introduced by these changes
- Things a linter/formatter would catch
- Nitpicks or stylistic preferences (unless in CLAUDE.md)
- Code that looks odd but is intentional (has a comment explaining it)
- Issues with `// eslint-disable` or similar suppression comments

### Step 6: Write the markdown report

Save the report to `code-review-<branch-name>-<YYYY-MM-DD>.md` in the repo root (or current directory if repo root can't be determined).

Use this format:

```markdown
# Code Review — <branch name>
**Date:** <date>
**Staged files:** <comma-separated list>

## Summary
<3-5 sentence summary of what the changes do>

## Issues Found (<N> issues, <M> filtered as low-confidence)

### 1. <Issue title> — <Agent: Bug/Compliance/History>
**File:** `<filename>` · **Lines:** <start>–<end>
**Confidence:** <score>/100

<Description of the issue>

<If compliance issue, include:>
> Guideline: "<exact CLAUDE.md text>"

---

### 2. ...

## No issues found
<Only include this section if 0 issues passed the threshold>

## Filtered out
<N> issues were found but scored below the 80-confidence threshold and were excluded.
```

If there are 0 issues total (nothing from any agent), write a brief positive summary instead of an empty issues list.

### Step 7: Report to user

Tell the user:
- How many issues were found and how many were filtered
- The filename of the saved report
- A one-line summary of the most critical issue (if any)

Do NOT print the full report in the terminal — just point to the file.