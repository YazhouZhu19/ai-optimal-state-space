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
