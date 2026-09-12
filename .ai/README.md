# Machine State Layer

This directory is the habitat's canonical machine-facing surface. It should remain compact enough to load at the start of every agent session.

## Files

- `manifest.json` answers: What is this place, what is invariant, and what may I do?
- `state.json` answers: What is true now, what is uncertain, and what can happen next?
- `map.json` answers: Which additional sources does this task require?
- `schema/` defines the expected structure of canonical state.

## Mutation rules

- Change `manifest.json` only when identity, invariants, authority, or canonical paths change.
- Replace current fields in `state.json` after every meaningful state transition.
- Change `map.json` when a path, owner, relation, or task read set changes.
- Append historical reasoning to `../records/` instead of growing current state indefinitely.

## Size discipline

Canonical state should point to detail rather than absorb it. If a field becomes a narrative, move the narrative to the appropriate record and keep a path plus one-sentence meaning here.

## Trust discipline

JSON structure makes state parseable, not automatically true. Claims still require evidence. A missing observation must remain explicit.
