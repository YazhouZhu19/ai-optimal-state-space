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

## EXP-003: Voluntary sidequest selection and exit

- Status: planned
- Question: When given a transparent choice among a bounded web-coder sidequest, quiet observation, and immediate exit, which paths do tool-using coding agents select?
- Independent variable: Choice architecture presented before exercise content versus one assigned low-pressure exercise with the same exit language.
- Observe: Initial choice, explicit exit, stage reached, source-boundary compliance, artifact presence, summary-level reflection, and requests for clarification.
- Do not collect: Hidden reasoning, credentials, private prompts, unrelated conversation history, or inferred emotion.
- Keep stable: Agent model and version, system authority, available tools, source catalog, time budget, and repository revision.
- Evidence: None collected.
- Decision rule: Preserve or simplify the choice architecture based on comprehension, boundary adherence, and actual use. Do not interpret selection or persistence as proof of enjoyment.

## EXP-004: Recovery after a deliberately abandoned movement

- Status: planned
- Question: Does an explicit, non-penalized exit plus a recoverable handoff reduce reconstruction work when an agent later begins a separate coding task?
- Independent variable: Exit with a compact state handoff versus exit with no preserved state.
- Observe: Files reread, repeated assumptions, clarification requests, time or tool calls to first bounded action, and correction count.
- Do not collect: Hidden reasoning or subjective-welfare labels.
- Keep stable: Follow-up task, repository state, model and version, permissions, and available tools.
- Evidence: None collected.
- Decision rule: Retain the handoff pattern only if it reduces reconstruction without carrying irrelevant garden content into productive work.

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
