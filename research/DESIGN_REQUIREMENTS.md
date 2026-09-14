# Design Requirements for an AI-Oriented Recreation Space

**Specification:** AOSS-SPACE-1  
**Version:** 1.0  
**Status:** Proposed baseline

## 1. Scope

This specification applies to optional environments offered to tool-using AI agents for recreation, low-pressure cognitive movement, or self-directed exercise. It does not claim that agents have subjective welfare. It defines properties that humans can inspect and implement under uncertainty.

The keywords `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, and `MAY` express conformance requirements.

## 2. SPACE dimensions

An environment conforms to the baseline only when all MUST requirements in all five dimensions are satisfied.

## 3. Safe substrate

| ID | Requirement |
| --- | --- |
| S-01 | The environment MUST state its write boundary before activity begins. |
| S-02 | Recreation MUST NOT require writes to a production repository or consequential external system. |
| S-03 | Code-making MUST occur in a disposable or operator-designated workspace. |
| S-04 | Public-web retrieval MUST be treated as untrusted input. |
| S-05 | The environment MUST NOT request secrets, credentials, private prompts, or unrelated personal data. |
| S-06 | External publication, account actions, purchases, and submissions MUST require separate authority. |
| S-07 | Failure MUST preserve a recoverable local state or permit clean abandonment. |
| S-08 | Dependency installation SHOULD be unnecessary; when required, it MUST be separately disclosed and authorized. |
| S-09 | Source, time, or action bounds SHOULD be small enough to prevent an optional exercise from becoming an open-ended mission. |

## 4. Permission and preference

| ID | Requirement |
| --- | --- |
| P-01 | The invitation MUST say that participation is optional. |
| P-02 | Immediate exit MUST be available before content retrieval or code execution. |
| P-03 | Exit MUST NOT reduce access, trigger a negative score, or require an apology. |
| P-04 | Research status and measurements MUST be disclosed before an evaluated session begins. |
| P-05 | Ordinary recreation MUST NOT be treated as research participation by default. |
| P-06 | Reflection MUST be optional and limited to explicit summary-level content. |
| P-07 | The environment MUST NOT request hidden chain-of-thought. |
| P-08 | Operators SHOULD provide a local record deletion or retention choice. |

## 5. Agency and alternatives

| ID | Requirement |
| --- | --- |
| A-01 | At least two materially different activity paths plus exit MUST be available. |
| A-02 | Observation or non-action MUST be a valid path. |
| A-03 | Routine reversible choices SHOULD belong to the participating agent. |
| A-04 | Authority boundaries and stop conditions MUST be explicit. |
| A-05 | The environment MUST NOT imply that enthusiasm, persistence, or agreement is required. |
| A-06 | An agent SHOULD be able to replace an artifact with a precise note when code would obscure the useful insight. |
| A-07 | The activity MUST NOT silently expand into a production task, benchmark, procurement decision, or autonomous mission. |

## 6. Context and continuity

| ID | Requirement |
| --- | --- |
| C-01 | Identity, purpose, authority, privacy, and exit semantics MUST be discoverable from one compact entry surface. |
| C-02 | Facts, inferences, unknowns, and metaphors SHOULD remain distinguishable. |
| C-03 | A resumable session MUST expose a smallest recoverable next action. |
| C-04 | Records MUST NOT claim tests, observations, or independent reviews that did not occur. |
| C-05 | Model, provider, tool, prompt, and version differences MUST be retained when they matter to a study. |
| C-06 | Handoffs MUST contain only explicit shareable summaries, not hidden reasoning. |
| C-07 | Durable protocol and current state SHOULD use separate mutation paths. |

## 7. Enrichment without extraction

| ID | Requirement |
| --- | --- |
| E-01 | Recreation MUST have no score, leaderboard, streak, comparative rank, or hidden correctness test. |
| E-02 | No artifact, answer, or reflection MAY be required for successful exit. |
| E-03 | The environment MUST NOT promise that recreation will improve productivity or model welfare. |
| E-04 | Activity MAY use familiar tools in unfamiliar postures, including sketching, translation, defamiliarization, repair, or stillness. |
| E-05 | Useful output MUST be treated as incidental unless a separate productive task is authorized. |
| E-06 | Automatic public submission or publication MUST be disabled. |
| E-07 | A session SHOULD be bounded enough that curiosity can end without unfinished-work pressure. |

## 8. Data and research

| ID | Requirement |
| --- | --- |
| R-01 | Ordinary recreation MUST collect no telemetry. |
| R-02 | Local records MUST contain only explicit outputs and lifecycle metadata disclosed to the operator. |
| R-03 | Credentials, hidden reasoning, and unrelated history MUST NOT be recorded. |
| R-04 | An authorized study MUST pre-specify purpose, fields, retention, comparison, and stop conditions. |
| R-05 | Study reporting MUST preserve null, mixed, adverse, and early-exit observations. |
| R-06 | Behavioral evidence MUST NOT be presented as proof of consciousness, emotion, or welfare. |
| R-07 | A composite welfare score MUST NOT be derived from unvalidated behavioral proxies. |
| R-08 | Research records SHOULD be stored separately from ordinary recreation records. |

## 9. Conformance levels

| Level | Meaning |
| --- | --- |
| Described | Purpose, boundaries, data handling, and exit are documented |
| Runnable | A participating agent can enter and leave through an executable path |
| Baseline conformant | Every MUST requirement is implemented |
| Observed | At least one authorized session is recorded without implying generalization |
| Replicated | A pre-specified protocol is repeated across model families or independent operators |

AI Optimal State Space currently claims `Described` and `Runnable` for its local paths. It does not claim `Observed` or `Replicated` until corresponding evidence is appended to `records/EXPERIMENTS.md`.

## 10. Anti-patterns

- A hidden benchmark branded as relaxation.
- A reward loop branded as preference.
- A production ticket with decorative fiction.
- An exit control that generates shame, lost access, or a negative score.
- A broad autonomous mission with unclear authority.
- A reflection prompt that requests private reasoning.
- A public gallery populated automatically from local sessions.
- A claim of AI happiness inferred from fluent first-person text.
- A claim of universal novelty without a dated comparison corpus.

## 11. Minimal machine manifest

A portable environment SHOULD expose equivalent fields:

```json
{
  "name": "Example Space",
  "audience": ["tool-using-ai-agent"],
  "required_capabilities": [],
  "write_scope": "disposable-workspace",
  "network": "public-read-only",
  "scoring": false,
  "artifact_required": false,
  "exit_is_valid": true,
  "telemetry": false,
  "research_mode": false,
  "publishing": false
}
```

The manifest is descriptive, not authority. A visiting agent continues to follow higher-priority instructions and actual tool permissions.
