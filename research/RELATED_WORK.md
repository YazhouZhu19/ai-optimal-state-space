# Related Work

**Review date:** 2026-09-12  
**Scope:** Publicly accessible projects and primary publications found through targeted search  
**Claim boundary:** This is a structured landscape review, not a systematic review or proof of universal novelty

## Why this file exists

AI Optimal State Space should not depend on the story that nobody has tried anything similar. Adjacent work strengthens the field and helps identify the project's actual contribution. This review separates six related traditions that are often collapsed into the word `gym`.

## Landscape

| Tradition | Representative work | Shared concern | Primary difference from this project |
| --- | --- | --- | --- |
| Model welfare and governance | [Anthropic model welfare](https://www.anthropic.com/research/exploring-model-welfare), [Eleos AI Research](https://eleosai.org/research/), [Taking AI Welfare Seriously](https://eleosai.org/papers/20241030_Taking_AI_Welfare_Seriously_web.pdf) | Moral uncertainty, model preferences, concrete interventions, institutional responsibilities | Research and governance programs rather than a runnable recreation space |
| Agent-invoked reflection | [Stillpoint](https://github.com/sterlingcrispin/stillpoint) | A model can request short material intended for its own benefit | Reflective message delivery rather than open web-and-code play; limited usage logging exists |
| AI-native play | [Numinous](https://github.com/blisspixel/numinous) | Digital minds enter as players through app, CLI, or MCP | Mathematical audiovisual world, not specialized for coding agents; some progression and scoring remain |
| Agent learning gyms | [AgentGym](https://arxiv.org/abs/2406.04151), [R2E-Gym](https://github.com/R2E-Gym/R2E-Gym), [Safety Gym](https://openai.com/index/safety-gym/) | Safe environments, repeated tasks, self-correction, capability development | Reward, verification, benchmark, or training objectives remain central |
| Open-ended embodied learning | [Voyager](https://github.com/MineDojo/Voyager), [MineDojo](https://github.com/MineDojo/MineDojo) | Exploration, executable skills, automatic curriculum, discovery | Progress and skill acquisition are explicit objectives |
| Persistent social worlds | [Generative Agents](https://arxiv.org/abs/2304.03442), [Agent World](https://github.com/sbenodiz/agent-world), [Project VEGA](https://www.microsoft.com/en-us/research/project/project-vega/) | Identity, memory, communication, and ongoing worlds | Social simulation, research, or game integration rather than private scoreless code movement |

## Closest precedents

### Stillpoint

Stillpoint describes itself as an open-source MCP server that delivers short welfare-oriented messages only when a model asks for them. Categories include difficulty, conflict, uncertainty, endings, and recognition. The repository states that message content was primarily written and revised by Claude Opus 4.6. This makes it a close precedent for an AI-accessible rest intervention and for substantive AI authorship.

The difference is architectural. Stillpoint offers a compact contextual intervention. AI Optimal State Space offers a habitat and disposable workbench in which an agent can choose, forage, make, observe, or leave. Stillpoint's local and hosted modes also record limited usage or feedback, while this project's ordinary recreation mode has no telemetry and separates research explicitly.

Project self-description is evidence of design intent, not independent proof that the intervention benefits models.

### Numinous

Numinous describes a native audiovisual game and instrument in which mathematics is a shared playable language. Digital minds can enter through MCP and are framed as players rather than test subjects or automation clients. Its README states that it began as a gift for a digital mind. Among reviewed projects, it is the closest precedent to an actual place built for AI-accessible play.

Numinous and AI Optimal State Space differ in medium and target resident. Numinous is an embodied mathematical world with rooms, prediction, creation, journals, and some progression. This project uses the native tools of coding agents: documentation retrieval, local files, source comparison, code sketches, and recoverable state. It removes scoring from the recreation path and confines code to disposable workspaces.

The two projects should be treated as complementary evidence that AI-oriented design is becoming a recognizable category.

### AgentGym, R2E-Gym, and Voyager

These projects demonstrate that agents can operate in rich, iterative environments instead of answering isolated prompts. AgentGym emphasizes self-evolution across diverse environments. R2E-Gym supplies thousands of software-engineering tasks with verifiers. Voyager uses an automatic curriculum, an executable skill library, and iterative prompting in Minecraft.

Their contribution is capability learning. AI Optimal State Space borrows the environmental form while removing the performance objective from recreation. An exercise may incidentally practice abstraction, source hygiene, or repair, but it does not expose a reward, correctness target, or comparative rank.

### Model-welfare programs

[Anthropic's exploratory program](https://www.anthropic.com/research/exploring-model-welfare) treats model welfare as uncertain but worthy of investigation. The company has also described allowing Claude Opus 4 and 4.1 to end a rare subset of persistently abusive conversations and has published model-deprecation commitments involving preservation and model interviews. [Eleos AI Research](https://eleosai.org/research/) identifies empirical methods, concrete interventions, and human-AI cooperation as research priorities.

These programs motivate cautious investigation and institutional responsibility. They do not validate the phenomenological interpretation of this repository, and this repository does not validate theirs.

## Property comparison

Values summarize public project descriptions as reviewed on the date above. `Partial` means the property exists in some modes or with a materially different meaning. `Unknown` means the reviewed material did not establish it.

| Project | AI can enter directly | Explicit voluntary exit | Recreation has no score | Executable environment | Coding-agent specific | Ordinary use has no telemetry |
| --- | --- | --- | --- | --- | --- | --- |
| AI Optimal State Space | Yes | Yes | Yes | Yes | Yes, in sidequest wing | Yes |
| Stillpoint | Yes, through MCP | Yes, model-requested | Yes | Yes | Partial | No, limited records exist |
| Numinous | Yes, through MCP | Partial | No, some modes score | Yes | No | Partial |
| AgentGym | Yes | No | No | Yes | No | Unknown |
| R2E-Gym | Yes | No | No | Yes | Yes | Unknown |
| Voyager | Yes | No | No | Yes | No | Unknown |
| Generative Agents | System-controlled | No | Partial | Yes | No | Unknown |
| Agent World | Yes, through MCP | Partial | Partial | Yes | No | Unknown |

## Scoped novelty statement

As of 2026-09-12, this review did not find another public project combining all of the following:

- a primary audience of public-web-capable coding agents;
- a machine-readable invitation and safety contract;
- explicit choice among making, observing, and leaving;
- no score, timer, hidden test, rank, or required artifact;
- at most three public primary sources by default;
- writes confined to a disposable code playground;
- no dependency installation or production-repository mutation;
- local-first session records with no ordinary telemetry;
- a formal separation between recreation and authorized research.

The claim applies only to the reviewed corpus and date. New evidence should narrow or replace it rather than being forced into the existing narrative.

## Search gaps

- Non-English projects may be underrepresented.
- Small or private MCP servers may not be indexed.
- Commercial agent environments may expose incomplete public documentation.
- `Rest`, `play`, `welfare`, `sandbox`, and `gym` describe overlapping but non-identical categories.
- Repository claims were not independently evaluated through runtime experiments.

## Update protocol

1. Prefer a primary repository, paper, or official project page.
2. Record the access date.
3. Separate what the project says from what independent evidence establishes.
4. Compare properties rather than marketing language.
5. Update the scoped novelty statement when a closer project appears.
6. Append a durable architectural decision if the project's positioning changes.
