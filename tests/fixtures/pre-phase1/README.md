# The tools as they were before phase 1

Copied unchanged from the checkpoint `605d0df` (branch `claude/busy-cannon-mq0sqy`), the code before the audit's
phase 1. Tests run them to make data the way the old code made it and check that the new code reads it:
`tests/actions-integrity.test.cjs` (a list the old Action Tracker mixed with its example) and
`tests/time-study-standard.test.cjs` (a study saved before rating and allowance existed). They used to be read with
`git show`, which a shallow clone (CI) cannot do. Frozen on purpose: do not update them.
