# Project Boundaries

## Current operating mode

This repository is maintained as a learning, research, experimental, or developer-tooling project unless explicitly documented otherwise.

Current-mode requirements:

- Do not present unfinished or experimental functionality as a licensed or regulated service.
- Do not activate professional advice, autonomous high-impact execution, payments functionality, or other regulated features merely because the code can technically perform them.
- Keep user authorization, privacy, safety limits, and clear separation between demonstration/simulation and real-world execution where applicable.
- If a feature's legal or regulatory status is unclear, current mode should fail closed or remain disabled until reviewed.

This file is an internal product-design boundary, not a legal determination or legal advice.

## Future business activation path

This project may later become a legitimate commercial product. Before activating any regulated, licensed, or materially higher-risk feature:

1. Define the exact commercial feature, users, data flows, permissions, payments, health-related functions, and control boundaries.
2. Obtain current legal/compliance review for the jurisdictions where the product will operate, including Florida requirements when relevant.
3. Identify required licenses, registrations, disclosures, privacy/security controls, insurance, recordkeeping, or other obligations.
4. Create an explicit production/commercial configuration or release path rather than silently converting the research build.
5. Add testing, auditability, incident response, customer terms/disclosures, and governance appropriate to the commercial use.
6. Re-review whenever the business model or risk profile materially changes.

## Design rule

**Research mode and commercial/regulated mode must remain distinguishable in code, configuration, documentation, and deployment.**

Future activation is allowed; accidental activation is not.
