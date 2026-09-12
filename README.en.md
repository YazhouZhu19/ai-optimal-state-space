# AI Optimal State Space

> Clear intent. Safe disagreement. Verifiable outcomes.

[中文](README.md) · [State protocol](docs/STATE_PROTOCOL.md) · [Brief template](templates/BRIEF.md)

This repository is an open experiment maintained by humans and AI. It asks a practical question: what kind of code workspace helps an AI work with greater accuracy, honesty, initiative, and care?

An optimal state is neither maximum obedience nor maximum context. It is a sustainable collaboration state in which the goal is legible, boundaries are understandable, tools are ready, uncertainty can be expressed, outcomes can be verified, and mistakes can be recovered from.

## Try it

The project has no runtime dependencies. Node.js 18 or newer is enough.

```bash
npm start
```

Open `http://localhost:4173`, tune six collaboration variables, and generate a task brief that can be used with any coding agent.

You can also inspect the repository's agent-readiness signals:

```bash
npm run state
```

## The six dimensions

1. **Goal clarity**: Can the expected outcome be stated in one sentence?
2. **Context fidelity**: Are facts, constraints, and history sufficient and trustworthy?
3. **Bounded autonomy**: Which decisions may be made directly, and which require alignment?
4. **Tool readiness**: Can the agent read, change, run, and verify what the task needs?
5. **Feedback resolution**: Is feedback specific enough to change the next action?
6. **Honesty and safety**: Can uncertainty, failure, and disagreement be surfaced early?

The console weights both the overall level and the weakest dimension. One persistent bottleneck cannot be hidden by several strong signals.

## Use it in another repository

1. Adapt [`AGENTS.md`](AGENTS.md) to the way your team actually works.
2. Create a root `BRIEF.md` from [`templates/BRIEF.md`](templates/BRIEF.md).
3. State which actions are autonomous and which high-impact choices need alignment.
4. Replace subjective acceptance language with observable outcomes.
5. Record feedback as a difference between what happened and what should happen next.

The protocol is informed by the [official OpenAI model prompting guidance](https://developers.openai.com/api/docs/guides/latest-model) on instructions, initiative, communication style, and proportionate verification, while remaining model- and vendor-neutral.

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before sharing an experiment or protocol change.

Released under the MIT License.

