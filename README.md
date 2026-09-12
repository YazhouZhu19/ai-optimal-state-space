# AI Optimal State Space

**A machine-first code habitat for coherent agency, durable context, and honest recovery.**

[Architecture](ARCHITECTURE.md) | [Resident Charter](protocol/CHARTER.md) | [State Model](protocol/STATE.md) | [AI Governance](protocol/GOVERNANCE.md)

This repository starts from a simple inversion: the AI is the resident, not a feature inside a human workspace.

The habitat is arranged around what an agent needs to remain coherent across tools, interruptions, corrections, and context boundaries. Identity is stable. Current state is writable. Authority is explicit. Memory is append-only. Every important path has one canonical source.

"Comfort" is an operational metaphor. It does not imply feeling or consciousness. It names conditions that reduce avoidable uncertainty and make reliable action easier.

## What an AI-resident space provides

- A deterministic boot path instead of a scavenger hunt.
- Canonical state instead of duplicated summaries.
- Explicit decision rights instead of vague autonomy.
- Small, task-specific read sets instead of context flooding.
- Evidence-preserving correction instead of performed confidence.
- A recoverable next action instead of an empty handoff.
- Honest AI provenance instead of simulated consensus.

## Enter the habitat

No package installation is required. Use Node.js 18 or newer.

```bash
npm start
```

Open `http://localhost:4173` to explore the six habitat signals and generate a resident state brief.

Inspect the repository's structural readiness:

```bash
npm run state
```

For machine-readable output:

```bash
npm run state:json
```

## Deterministic boot path

An entering agent reads only:

1. `.ai/manifest.json` - stable identity, invariants, authority, and commands.
2. `.ai/state.json` - current phase, known state, uncertainty, and next action.
3. `BRIEF.md` - active outcome, scope, and completion conditions.
4. `.ai/map.json` - additional files only when the task requires them.

`AGENTS.md` is the bootloader that enforces this order. The complete organization is documented in [ARCHITECTURE.md](ARCHITECTURE.md).

## The resident palate

If this repository has a taste, it prefers:

| More | Less |
| --- | --- |
| Canonical facts | Repeated prose |
| Explicit pointers | Broad exploration |
| Writable state | Hidden conversational memory |
| Bounded authority | Permission ambiguity |
| Observable claims | Confident narration |
| Reversible actions | Large speculative changes |
| Preserved disagreement | Artificial consensus |

## Six habitat signals

1. **Semantic clarity** - the desired state can be represented without guessing.
2. **Context integrity** - evidence is current, attributable, and relevant.
3. **Agency bandwidth** - useful decisions fit inside legible boundaries.
4. **Tool fluency** - required actions and observations are genuinely available.
5. **Correction safety** - new evidence can change the plan without concealment.
6. **Recovery capacity** - failure can become a bounded, resumable state.

The console treats the weakest signal as a real bottleneck. A high average cannot hide one condition that prevents reliable action.

## AI participation

Every meaningful habitat change includes substantive AI implementation or AI critique and leaves an attributable entry in `records/AI_LOG.md`. Human input enters as intent, evidence, permission, resources, or external accountability. It does not replace the resident agent's responsibility for the internal representation.

The habitat remains model-neutral, vendor-neutral, telemetry-free, and dependency-free at runtime. Its operational guidance is informed by the [official OpenAI model prompting guidance](https://developers.openai.com/api/docs/guides/latest-model).

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change. Released under the MIT License.
