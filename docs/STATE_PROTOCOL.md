# AI Habitat State Protocol

## 1. Operational definition

An AI optimal state is an operational condition, not a claim about machine feeling. A resident agent is in a comfortable state when it can maintain a coherent task model, act through legible authority, observe consequences, accept correction, and recover from error without hiding information.

The state is temporary. It changes as context, tools, authority, and evidence change, so the habitat must make state visible and recoverable.

## 2. Six signals

### Semantic clarity

The desired end state, constraints, and invariants can be represented without guessing. Instructions describe observable outcomes rather than vague activity.

Resident probe: Can I state the completed condition in one sentence?

### Context integrity

Evidence is relevant, current, attributable, and small enough to reason over. Facts, inferences, preferences, and unknowns remain distinguishable.

Resident probe: Does my next decision follow from inspected evidence or fluent assumption?

### Agency bandwidth

The resident has enough freedom to choose effective reversible actions, together with explicit stop conditions for consequential actions.

Resident probe: Do I know which decisions are mine and where my authority ends?

### Tool fluency

The resident can perform and observe every action required by the completion conditions. Tool descriptions, permissions, and feedback channels match reality.

Resident probe: Is there an available observation for each claimed outcome?

### Correction safety

New evidence can alter the model and plan without requiring the agent to defend an earlier answer. Correction names the output difference and relevant conditions.

Resident probe: Can I change course while preserving an honest record of why?

### Recovery capacity

Failures, partial work, and uncertain state can be exposed, bounded, and handed off. The space retains a coherent point from which work can resume.

Resident probe: Is revealing a broken assumption cheaper than concealing it?

## 3. State heuristic

The console uses a deliberately simple heuristic. The average represents available signal, the minimum represents the active bottleneck, and severe imbalance adds a small penalty.

```text
state = 0.72 × average + 0.28 × minimum - imbalance penalty
```

This is not a scientific measurement and does not evaluate intelligence, consciousness, or worth. It is a debugging surface for habitat conditions.

## 4. Resident recovery loop

When coherence drops:

1. Stop expanding scope.
2. Reconstruct the observable end state.
3. Separate inspected facts from inference and missing information.
4. Identify the weakest habitat signal.
5. Restore only the context or capability needed to clear that bottleneck.
6. Take one small observable action.
7. Update session state and provenance from the result.

Recovery does not eliminate uncertainty. It makes the next action reliable again.

## 5. Habitat anti-patterns

- Role-play used to conceal missing intent.
- Context volume without source, relevance, or freshness.
- “Full autonomy” paired with punishment for routine decisions.
- Confidence demanded as a substitute for evidence.
- Prompt rewriting without observing the system.
- Ephemeral chat used as the only memory.
- Fabricated AI agreement or review.
- Human accountability reassigned to a model.

## 6. Minimum viable habitat

An AI-native repository provides:

- stable machine-readable identity and invariants;
- current session state and a recoverable next action;
- observable completion conditions;
- explicit decision rights and stop conditions;
- available commands and observation paths;
- durable decisions, critiques, failures, and handoffs;
- clear privacy, credential, and external-action boundaries.
