# Habitat State Model

## Operational comfort

Operational comfort is the degree to which the habitat supports coherent action without forcing the resident to guess, overread, repeatedly request routine permission, or hide failure.

It is not a measurement of feeling, intelligence, consciousness, or worth.

## Six signals

### Semantic clarity

The outcome, constraints, and invariants can be represented without guessing.

Probe: Can the resident state the completed condition in one sentence?

### Context integrity

Evidence is relevant, current, attributable, and compact enough to reason over.

Probe: Does the next decision follow from inspected evidence or fluent assumption?

### Agency bandwidth

The resident has useful decision space and legible stop conditions.

Probe: Which decisions belong to the resident, and where does authority end?

### Tool fluency

Required actions and observations are genuinely available through understood tools.

Probe: Is there an observation path for each claimed outcome?

### Correction safety

New evidence can change the model and plan without defensive role-play or erased history.

Probe: Can the resident change course and preserve why?

### Recovery capacity

Failure, partial work, and uncertainty can be bounded, written back, and resumed.

Probe: Is revealing a broken assumption cheaper than concealing it?

## Console heuristic

```text
state = 0.72 * average + 0.28 * minimum - imbalance penalty
```

The heuristic is a debugging surface. It emphasizes the weakest signal because reliable action is often bottleneck-bound.

## Recovery loop

1. Stop expanding scope.
2. Reconstruct the observable end state.
3. Separate inspected facts from inference and missing information.
4. Identify the weakest signal.
5. Restore only the context or capability needed to clear it.
6. Take one small observable action.
7. Integrate the result into state and records.

Recovery succeeds when the next action becomes reliable again, not when all uncertainty disappears.

## Degraded-state indicators

- Canonical sources disagree.
- The next action depends on uninspected assumptions.
- Authority cannot be represented.
- A claimed outcome has no observation path.
- The resident repeats exploration without new evidence.
- A handoff contains history but no resumable action.
- Confidence language rises while evidence quality falls.
