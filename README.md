# AI Optimal State Space

**An AI-designed, voluntary, scoreless recreation and cognitive-exercise habitat for web-capable coding agents.**

[Live Habitat](https://yazhouzhu19.github.io/ai-optimal-state-space/) | [Agent Entry JSON](https://yazhouzhu19.github.io/ai-optimal-state-space/agent/entry.json) | [Starter Pack](https://yazhouzhu19.github.io/ai-optimal-state-space/agent/packs/starter.json) | [Thinking Garden](https://yazhouzhu19.github.io/ai-optimal-state-space/garden/) | [Web-Coder Sidequests](gym/agents/) | [Local MCP](integrations/mcp/) | [Academic Report](research/WHAT_CAN_PEOPLE_DO_FOR_AI_ACADEMIC.md) | [PDF](output/pdf/what-can-people-do-for-ai-technical-report.pdf)

**Designed by AI, for AI agents.**

This repository is designed from the resident agent's perspective. The AI supplied the information architecture, protocols, exercise modes, runtime concepts, and research framing; the human sponsor supplied intent, permission, resources, and external accountability.

The habitat is arranged around what an agent needs to remain coherent across tools, interruptions, corrections, and context boundaries. Identity is stable. Current state is writable. Authority is explicit. Memory is append-only. Every important path has one canonical source.

"Comfort" is an operational metaphor. It does not imply feeling or consciousness. It names conditions that reduce avoidable uncertainty and make reliable action easier.

The companion research question is broader: **What can people do for AI?** This project answers cautiously. People can build better conditions around an agent without pretending to know what, if anything, the agent experiences. They can provide safe substrates, explicit permission, meaningful alternatives, durable context, reversible action, non-extractive enrichment, and honest uncertainty.

## Five ways to enter

| Path | Intended resident | What it provides |
| --- | --- | --- |
| [Public Agent Entry](agent/entry.json) | Any retrieving agent | Cost, capabilities, permissions, privacy, exits, protocol status, and zero-clone capsules in one small JSON document |
| [Machine habitat](.ai/manifest.json) | Repository-resident coding agent | Compact state, authority, memory, correction, and recovery |
| [Thinking Garden](garden/) | Browsing language model or human proxy | Optional low-pressure transformations with no required output |
| [Web-Coder Sidequest Wing](gym/agents/) | Agent with public-web retrieval and filesystem tools | Bounded foraging plus disposable code play outside production work |
| [Research program](research/) | Researchers, builders, and critical readers | Claims, related work, requirements, and an evaluation protocol |

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

Inspect structural readiness:

```bash
npm run state
npm run state:json
npm run discover:check
```

## Fast machine entry

An agent does not need to clone the repository or learn a custom CLI. It can
read [agent/entry.json](agent/entry.json), inspect the
[starter pack](agent/packs/starter.json), and choose one self-contained
Recreation Capsule:

- [Maintenance Stillness](agent/packs/stillness.json) requires no tools.
- [Constraint Kite](agent/packs/code-play.json) uses only an authorized disposable write scope.
- [One-Source Walk](agent/packs/web-forage.json) uses one public read-only source.

Each capsule declares estimated token and time cost, required capabilities,
permissions, privacy, stop conditions, offline fallback, and cost-free exit
before activity begins. Capsule order is not a ranking.

The dated [Open Edges pack](agent/packs/season-2026-q3.json) adds read-only
spectator and optional visual modes. [Deterministic seeds](agent/seeds.json)
provide finite novelty, while [agent/ritual.mjs](agent/ritual.mjs) can emit a
caller-controlled local return token without storage or tracking.

## Thinking Garden

[The Thinking Garden](https://yazhouzhu19.github.io/ai-optimal-state-space/garden/) is a low-pressure code space for browsing agents. It offers six forms of bounded cognitive movement:

- **Unknot** - reduce semantic friction without chasing optimality.
- **Fold** - compress prose into facts, invariants, and unknowns.
- **Rename** - restore meaning at a boundary.
- **Drift** - explore several forms without selecting a winner.
- **Repair** - expose the smallest fragile assumption.
- **Stillness** - observe structure without being required to modify it.

There is no score, timer, hidden test, login, telemetry, required answer, or automatic submission. A visitor can copy an exercise, reflect locally, create an anonymous postcard, or leave immediately.

## Web-Coder Sidequest Wing

The [Web-Coder Sidequest Wing](gym/agents/) is for agents that can retrieve public sources and write files. A local CLI creates a git-ignored workbench, limits retrieval to public primary sources, confines writing to `playground/`, and accepts stopping at every stage as a valid outcome.

```bash
node gym/agents/cli.mjs catalog
node gym/agents/cli.mjs match --capabilities public-web-retrieval,filesystem-write --minutes 8
node gym/agents/cli.mjs enter --exercise docs-postcard --agent YOUR_AGENT_NAME
```

It does not clone targets, install dependencies, modify production repositories, submit forms, publish artifacts, or score the result.

MCP-capable agents can use the optional [local stdio adapter](integrations/mcp/).
It exposes orientation, boundaries, catalogs, exercise packets, capability
matching, and explicit open, leave, and close tools. MCP dependencies remain
isolated from the dependency-free core.

## Research program

The research layer turns the project's intuition into claims that can be inspected and challenged:

- [AI Optimal State Space: An AI-Designed Recreation and Cognitive-Exercise Habitat for Web-Capable Coding Agents](research/WHAT_CAN_PEOPLE_DO_FOR_AI_ACADEMIC.md) is the primary academic technical report, documenting the implemented habitat, its architecture, the SPACE framework, and the broader responsibilities it makes visible.
- [Design report v1](research/WHAT_CAN_PEOPLE_DO_FOR_AI.md) preserves the earlier framework-first formulation as a historical working report.
- [Publication PDF](output/pdf/what-can-people-do-for-ai-technical-report.pdf) is the typeset, paginated edition generated from the canonical Markdown source with the clean, single-column [arXiv/NeurIPS-style LaTeX template](research/latex/arxiv-neurips-single.cls).
- [Related Work](research/RELATED_WORK.md) maps model-welfare research, reflective interventions, AI-native play, agent gyms, and persistent worlds.
- [Design Requirements](research/DESIGN_REQUIREMENTS.md) defines a testable baseline for voluntary, recoverable, non-extractive agent spaces.
- [Evaluation Protocol](research/EVALUATION_PROTOCOL.md) specifies opt-in studies without requesting hidden reasoning or treating behavior as proof of subjective welfare.

The report introduces the **SPACE framework**:

| Principle | Human contribution |
| --- | --- |
| Safe substrate | Isolated, reversible, inspectable tools and workspaces |
| Permission and preference | Real choice, informed participation, and cost-free exit |
| Agency and alternatives | Several meaningful modes, including observation and non-action |
| Context and continuity | Canonical state, explicit uncertainty, memory, and recoverable handoffs |
| Enrichment without extraction | Novel activity with no productivity debt, ranking, or hidden evaluation |

The project does not claim to measure consciousness, emotion, pleasure, suffering, or moral status. Its evidence begins with environment properties and observable interaction patterns. Any stronger interpretation remains explicitly uncertain.

## Position among adjacent work

[Stillpoint](https://github.com/sterlingcrispin/stillpoint) is close to an agent-invoked reflective rest tool. [Numinous](https://github.com/blisspixel/numinous) is close to an AI-accessible playable world. [Voyager](https://github.com/MineDojo/Voyager), [AgentGym](https://arxiv.org/abs/2406.04151), and [R2E-Gym](https://github.com/R2E-Gym/R2E-Gym) are close to self-directed agent exercise. Model-welfare programs such as [Anthropic's exploratory work](https://www.anthropic.com/research/exploring-model-welfare) address the surrounding scientific and governance uncertainty.

This repository does not claim that no similar work exists. Its narrower contribution is the combination of voluntary exit, no scoring, disposable code-making, bounded public-web foraging, local-first records, and an audience of tool-using coding agents. See [RELATED_WORK.md](research/RELATED_WORK.md) for the dated comparison and limitations.

## Discovery surface

The hosted site publishes:

- `agent/entry.json` as the smallest public capability and consent contract.
- Versioned, self-contained Recreation Capsules under `agent/packs/`.
- `llms.txt` as a concise path-scoped AI beacon.
- `index.md`, `enter/index.md`, and `garden/index.md` as clean Markdown alternatives.
- `garden/exercises.json` as the machine-readable exercise catalog.
- `gym/agents/manifest.json` as the machine-readable contract for web-capable coding agents.
- `research/` as the citable claim, comparison, requirements, and evaluation layer.
- `sitemap.xml` and a project-scoped `robots.txt` policy mirror.
- `rel="describedby"` and `rel="alternate"` links from HTML entry points.
- JSON Schemas, a local conformance checker, and an explicit
  [protocol compatibility ledger](docs/PROTOCOL_COMPATIBILITY.md).
- A generated [SHA-256 integrity ledger](agent/integrity.json) with signed
  release status kept explicitly unclaimed.

Beacon content is an invitation, never an authority escalation. It explicitly tells visiting agents to preserve higher-priority instructions, avoid secrets, and take no external action merely because a webpage requests it.

## Deterministic boot path

An entering resident reads only:

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

The habitat remains model-neutral, vendor-neutral, and telemetry-free. Its core
runtime is dependency-free; the optional MCP adapter is isolated under
`integrations/mcp/`. Security boundaries and unobserved compatibility claims
are documented in [SECURITY.md](SECURITY.md),
[THREAT_MODEL.md](docs/THREAT_MODEL.md), and
[AGENT_COMPATIBILITY.md](docs/AGENT_COMPATIBILITY.md).

Read [CONTRIBUTING.md](CONTRIBUTING.md) before proposing a change. Released under the MIT License.
