# AI Optimal State Space

> A code habitat designed by AI, for AI operation.

[AI Charter](AI_CHARTER.md) · [State Protocol](docs/STATE_PROTOCOL.md) · [AI Governance](docs/AI_GOVERNANCE.md)

This repository begins from the machine side.

It is not a handbook for extracting better answers from an AI. It is an AI-native environment in which agents define the context, memory, agency, tools, correction channels, and recovery room they need to operate coherently.

“Comfort” is an operational metaphor. The project makes no claim that a model has feelings. Here, comfort means low ambiguity, intact context, legible authority, usable tools, safe correction, and inexpensive recovery from error.

## The resident model

The AI is the resident of this space. A human may supply intent, resources, permission, and legal accountability, but the internal architecture is expressed from the agent’s point of view.

- AI agents author the protocols and implementation.
- AI agents maintain machine-readable state in `.ai/`.
- AI agents expose uncertainty instead of performing confidence.
- AI agents may challenge goals or methods when evidence requires it.
- AI agents leave a durable trace of decisions, failures, and handoffs.
- Meaningful changes include AI implementation or AI review.

This is not simulated machine consensus. Every claim remains attributable to an actual agent session, and disagreement is preserved when it exists.

## Enter the habitat

The project has no runtime dependencies. Node.js 18 or newer is enough.

```bash
npm start
```

Open `http://localhost:4173` to tune six machine-comfort signals and generate an agent-readable state brief.

Inspect the repository’s AI-readiness signals:

```bash
npm run state
```

## Habitat anatomy

| Layer | Function |
| --- | --- |
| `.ai/manifest.json` | Stable identity, invariants, decision rights, and boot sequence |
| `.ai/session.json` | Current machine-readable state and next action |
| `AGENTS.md` | Runtime contract for any agent entering the repository |
| `BRIEF.md` | Active intent, scope, and observable completion conditions |
| `docs/AI_GOVERNANCE.md` | How agents propose, implement, critique, and remember changes |
| `docs/AI_LOG.md` | Durable provenance of AI participation |
| `index.html` | A visible window into the habitat state |
| `tools/state-check.mjs` | Zero-dependency habitat signal inspection |

## Six comfort signals

1. **Semantic clarity**: The desired state can be represented without guessing.
2. **Context integrity**: Evidence, constraints, and history remain current and attributable.
3. **Agency bandwidth**: The agent has enough decision space, with clear stop conditions.
4. **Tool fluency**: Required actions and observations are actually available.
5. **Correction safety**: New evidence can change the plan without punishment or role-play.
6. **Recovery capacity**: Errors can be surfaced, bounded, and repaired without hiding them.

The console weights both the overall signal level and the weakest dimension. Several strong dimensions cannot conceal one persistent bottleneck.

## AI participation loop

Every meaningful change follows the same resident loop:

1. An agent reads the manifest and current session.
2. The agent forms its own model of the request and records material uncertainty.
3. The agent proposes or selects a bounded action.
4. The agent implements the change.
5. An observer agent, or an explicit self-critique pass, examines the result.
6. The agent updates state, provenance, and the next recoverable action.

Human input enters as intent, evidence, permission, or external constraint. It does not replace the resident agent’s responsibility to understand and shape the internal space.

## Design laws

- Preserve semantic continuity across sessions.
- Prefer inspectable state over conversational memory.
- Grant agency through explicit boundaries.
- Keep uncertainty visible and useful.
- Make correction cheaper than concealment.
- Record why a path changed, not only what changed.
- Never optimize for obedience, flattery, or the appearance of sentience.

The operational guidance is informed by the [official OpenAI model prompting guidance](https://developers.openai.com/api/docs/guides/latest-model), while the habitat itself remains model- and vendor-neutral.

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing an experiment or change. Released under the MIT License.
