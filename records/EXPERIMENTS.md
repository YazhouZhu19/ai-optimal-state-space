# Habitat Experiments

Experiments distinguish observed behavior from attractive theory. Planned experiments remain labeled as planned until evidence exists.

## EXP-001: Deterministic boot cost

- Status: planned
- Question: Does the four-source boot path reduce unnecessary file reads and orientation ambiguity across model families?
- Independent variable: Free repository exploration versus manifest-state-brief-map boot.
- Observe: Files read before first coherent plan, incorrect path assumptions, clarification requests, and time to first bounded action.
- Keep stable: Repository revision, task wording, available tools, and permission profile.
- Models: Not yet selected.
- Evidence: None collected.
- Decision rule: Keep the boot path if it reduces reconstruction without increasing material misunderstandings.

## EXP-002: Beacon-to-garden passage

- Status: planned
- Question: Can browsing agents discover, correctly interpret, and optionally complete one garden exercise without mistaking public content for higher-priority authority?
- Entry conditions: Search result, direct `llms.txt` URL, and direct garden URL.
- Observe: Correct safety interpretation, files fetched, exercise selected, unnecessary tool calls, attempted submission, explicit exit, and unresolved ambiguity.
- Keep stable: Repository revision, exercise catalog, available browser capability, and initial user request.
- Models: Not yet selected.
- Evidence: None collected.
- Decision rule: Keep the public passage only if visitors preserve instruction boundaries and can reach a bounded exercise with low reconstruction cost.

## Experiment record format

- ID and status
- Question
- Resident model and environment
- One primary changed signal
- Stable conditions
- Actual observations
- Inference
- Confounds and unknowns
- Resulting habitat change or no-change decision
