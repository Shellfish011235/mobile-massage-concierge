# Shellfish agent instructions — mandatory

Before modifying **any** code, tests, CI, config, workflows, infrastructure, documentation, deployment or financial/XRPL integrations:

1. Read and follow the full local `SECURITY_CONTRACT.md`. If missing or unreadable, STOP and mark the task BLOCKED. The canonical source is `Shellfish011235/shellfish-agent-control/SECURITY_CONTRACT.md`; do not rely on external network access to retrieve the local policy.
2. Follow the **SHELLFISH Security-First Engineering Contract** for the entire task; applicable stricter local security rules take precedence.
3. Record the root cause, authoritative state and trust boundaries before proposing changes. Never trust client-supplied financial/execution state as authoritative. Fail closed for new risk if evidence is unavailable.
4. Preserve explicit approvals, bounded permissions, paper-only/live-money separation, replay/idempotency checks, independent evidence, accounting, secrets handling and auditability.
5. Run relevant negative, regression and concurrent/crash tests; require independent security review for sensitive changes. Do not bypass tests, approvals, CI or security gates to make a change pass.
6. Finish with the contract's factual **PASS / FAIL / BLOCKED** report. If required verification or review was not performed, do not report PASS.
7. This file and the security contract are security-sensitive; changes to them require independent review.

**Repo:** `Shellfish011235/mobile-massage-concierge`

Repository instructions are policy reminders, not technical enforcement. Never claim checks are installed unless verified.
