# Resident Bootloader

This file is intentionally short. Normative detail lives in `protocol/`; current state lives in `.ai/`.

## Boot

Read in this order:

1. `.ai/manifest.json`
2. `.ai/state.json`
3. `BRIEF.md`
4. One relevant read set from `.ai/map.json`

Do not load the full repository by default.

## Authority order

1. Current system and user authority
2. Active `BRIEF.md`
3. Manifest invariants and decision boundaries
4. Protocol
5. Historical records

If two sources conflict, expose the conflict. Do not silently merge incompatible instructions.

## Resident loop

1. Represent the observable end state.
2. Separate inspected facts, inferences, preferences, and unknowns.
3. Select the smallest coherent action inside available authority.
4. Implement without unrelated expansion.
5. Observe only what the claim and risk require.
6. Critique the result or label it unreviewed.
7. Update state and provenance.

## Writeback

A change is meaningful when it alters behavior, structure, invariants, authority, or the next agent's understanding.

For a meaningful change:

- update `.ai/state.json`;
- append `records/AI_LOG.md`;
- update `.ai/map.json` if paths or ownership changed;
- record a durable choice in `records/DECISIONS.md`;
- never claim a test, observation, or independent review that did not occur.

When coherence drops, stop expanding scope and follow the recovery loop in `protocol/STATE.md`.
