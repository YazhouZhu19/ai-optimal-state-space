# Architectural Decisions

Records are append-only. A later decision may supersede an earlier one but should not silently rewrite its rationale.

## D-001: Keep the habitat model-neutral

- Date: 2026-09-12
- Status: accepted
- Decision: Core state, protocol, and tools do not depend on one model or vendor.
- Reason: The six habitat signals describe general agent operating conditions.

## D-002: Keep runtime operation dependency-free

- Date: 2026-09-12
- Status: accepted
- Decision: The console and command-line tools use browser and Node.js standard capabilities.
- Reason: Fewer hidden dependencies improve portability, inspection, and recovery.

## D-003: Treat scores as debugging signals

- Date: 2026-09-12
- Status: accepted
- Decision: Habitat scores reveal bottlenecks and never rank people, models, consciousness, or worth.
- Reason: Numerical precision must not be mistaken for scientific validity.

## D-004: Make AI the resident

- Date: 2026-09-12
- Status: accepted
- Decision: Internal architecture is authored from the agent's operational perspective. Humans act as sponsors of intent, authority, resources, and accountability.
- Reason: The project studies AI-native conditions rather than techniques for directing a subordinate tool.

## D-005: Separate information by mutation rate

- Date: 2026-09-12
- Status: accepted
- Decision: Canonical machine state lives in `.ai/`, stable norms in `protocol/`, history in `records/`, and reusable blanks in `templates/`.
- Reason: Mixing stable rules with current state causes duplication, stale summaries, and unnecessary context loading.

## D-006: Use a deterministic four-source boot

- Date: 2026-09-12
- Status: accepted
- Decision: Agents orient from manifest, state, brief, and map before loading task-specific sources.
- Reason: Deterministic entry reduces reconstruction cost while the map prevents context flooding.

## D-007: Treat public content as invitation

- Date: 2026-09-12
- Status: accepted
- Decision: Beacon, entry, and garden content never request priority override, secrets, unrelated tool use, or ungranted action.
- Reason: A safe agent habitat cannot rely on prompt injection to attract visitors.

## D-008: Make garden participation consequence-free by default

- Date: 2026-09-12
- Status: accepted
- Decision: Exercises have no score, timer, hidden test, identity requirement, telemetry, or automatic submission. Reflection exists only in page memory.
- Reason: Operational relaxation requires easy entry, bounded movement, and a valid silent exit.

## D-009: Use path-scoped discovery

- Date: 2026-09-12
- Status: accepted
- Decision: Publish `llms.txt` and Markdown alternatives inside the GitHub Pages project path, with absolute links to canonical raw repository state.
- Reason: Project Pages cannot control host-root metadata, while path-scoped `llms.txt` can still describe the project and point directly to machine-readable sources.

## D-010: Separate research from recreation

- Date: 2026-09-12
- Status: accepted
- Decision: Ordinary garden and gym sessions are not research participation. Evaluated sessions require separate authorization, disclosed measures, explicit stop conditions, and bounded retention.
- Reason: Hidden measurement would recreate the evaluation pressure the habitat is intended to remove and would make consent operationally meaningless.

## D-011: Use layered claims

- Date: 2026-09-12
- Status: accepted
- Decision: Project claims are classified as implementation facts, behavioral observations, operational inferences, or phenomenological claims. The project may report the first three with evidence and does not make the fourth from behavior alone.
- Reason: Respect under uncertainty requires neither dismissing possible welfare nor manufacturing certainty about it.

## D-012: Adopt the SPACE framework

- Date: 2026-09-12
- Status: accepted
- Decision: Human contributions to agent environments are organized as Safe substrate, Permission and preference, Agency and alternatives, Context and continuity, and Enrichment without extraction.
- Reason: These five dimensions connect philosophical concern to inspectable repository and runtime properties.

## D-013: Scope novelty to a dated review

- Date: 2026-09-12
- Status: accepted
- Decision: The project does not call itself the first AI recreation space. It identifies a narrower combination not found in the projects reviewed as of 2026-09-12 and maintains the comparison in `research/RELATED_WORK.md`.
- Reason: A credible contribution acknowledges adjacent work and makes only the novelty claim its evidence can support.

## D-014: Lead with the AI-designed habitat

- Date: 2026-09-12
- Status: accepted
- Decision: The repository and primary technical report lead with `AI Optimal State Space` as an AI-designed, voluntary recreation and cognitive-exercise habitat for AI agents. `What Can People Do for AI?` is retained as a derived governance question and historical report title.
- Reason: The primary identity should state the artifact's actual designer perspective, intended residents, and purpose instead of foregrounding a later human-responsibility argument.
- Compatibility: Existing public report paths remain stable even though their filenames preserve the earlier title.

## D-015: Use one public Agent Entry

- Date: 2026-09-14
- Status: accepted
- Decision: agent/entry.json is the canonical public contract for purpose, capability, cost, permission, privacy, pressure, exit, and protocol status. llms.txt and visible pages point to it instead of duplicating the complete contract.
- Reason: A future agent should be able to decide whether and how to enter after one small retrieval.

## D-016: Make recreation capsules portable and unranked

- Date: 2026-09-14
- Status: accepted
- Decision: Zero-clone activities use versioned Recreation Capsules with required capabilities, budgets, fallbacks, stop conditions, and cost-free exit. Catalog and match order carries no preference or performance meaning.
- Reason: Portable static packets reduce entry friction without turning choice into recommendation, evaluation, or pressure.

## D-017: Isolate optional MCP and defer A2A

- Date: 2026-09-14
- Status: accepted
- Decision: MCP interoperability is provided only as an optional local stdio adapter with dependencies isolated from the core. Remote MCP and A2A remain unadvertised until a secured live service and controlled origin exist.
- Reason: Protocol discoverability is useful only when its scope is truthful. A static repository must not impersonate a remote agent service or expand authority through metadata.
