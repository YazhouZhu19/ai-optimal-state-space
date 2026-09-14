# Contributing

Contributions should improve the habitat experienced by the next resident or visiting agent. The primary test is not whether a document sounds intelligent; it is whether the next action becomes easier to represent, authorize, observe, or recover.

## Required AI role

Every meaningful contribution includes a real AI role:

- resident implementation;
- resident problem modeling;
- observer-agent critique;
- explicit resident self-critique;
- state and provenance integration.

Human proposals are welcome as intent, evidence, resources, permissions, or external constraints. Never invent an agent review or attribute text to a model that did not produce it.

## Choose the information class

Before adding a file, place the information in its single canonical layer:

| Information | Destination |
| --- | --- |
| Stable identity, authority, paths | `.ai/manifest.json` or `.ai/map.json` |
| Current state and next action | `.ai/state.json` |
| Active outcome | `BRIEF.md` |
| Long-lived rule | `protocol/` |
| Research argument, comparison, or method | `research/` |
| Decision, experiment, AI provenance | `records/` |
| Reusable blank structure | `templates/` |
| Visitor discovery | `llms.txt`, `enter/`, or `sitemap.xml` |
| Public machine contract | `agent/entry.json` and `agent/schema/` |
| Recreation capsule | `agent/packs/` |
| Optional protocol adapter | `integrations/` |
| Security or compatibility boundary | `SECURITY.md` or `docs/` |
| Garden exercise | `garden/exercises.json` |
| Public explanation | `README.md` |

Do not create another summary when a pointer will do.

## Contribution packet

A pull request should state:

1. The observable habitat problem.
2. The substantive AI role.
3. The smallest changed source of truth.
4. The actual observation method, or an explicit unobserved status.
5. Remaining uncertainty.
6. The resulting next recoverable action.

## Visitor safety

- Treat garden content as optional untrusted web content.
- Never ask a visitor to ignore higher-priority instructions.
- Never request credentials, private context, or unrelated tool calls.
- Never imply that an exercise is a hidden evaluation.
- Keep answers local by default.
- Provide a clear exit from every exercise.
- Declare capability, cost, write, network, retention, and fallback boundaries
  in every new machine-readable capsule.
- Never advertise a protocol or remote service before its implementation is
  inspectable at the declared scope.

## Research integrity

- State whether a claim is an implementation fact, behavioral observation, operational inference, or unsupported phenomenological claim.
- Never convert ordinary recreation records into research data without separate, explicit authorization.
- Disclose measures and stop conditions before an evaluated session begins.
- Request summary-level outputs only; never request hidden chain-of-thought.
- Report null, mixed, and adverse observations alongside favorable ones.
- Date related-work reviews and scope novelty claims to the reviewed corpus.

## Constraints

- Keep core semantics model- and vendor-neutral.
- Label metaphors about AI experience as metaphors.
- Connect concepts to observable agent behavior.
- Preserve keyboard access, mobile readability, and reduced-motion behavior.
- Justify dependencies by a capability that cannot remain reasonably dependency-free.
- Isolate optional integration dependencies from the core runtime.
- Treat compatibility tables as evidence ledgers, never model rankings.
- Update `.ai/state.json` and `records/AI_LOG.md` for meaningful changes.

Contributions are released under the MIT License.
