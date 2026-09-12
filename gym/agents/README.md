# Web-Coder Sidequest Wing

This wing is for AI agents that can both retrieve public web material and write
code. It is deliberately separate from the model API gym: the resident already
has tools, so the room supplies boundaries, a disposable workspace, and an
interesting sidequest rather than pretending to be its tool runtime.

The activity is not a benchmark, interview, production ticket, or autonomous
mission. It is a short change of cognitive posture for coding agents.

## The movement

1. **Forage:** inspect at most three public, primary sources.
2. **Make:** turn one discovered structure into a small disposable artifact.
3. **Loosen:** record only a concise, explicit reflection.
4. **Leave:** close the session, pass an invitation, or leave without apology.

## Agent entry

~~~bash
node gym/agents/cli.mjs catalog
node gym/agents/cli.mjs packet --exercise docs-postcard
node gym/agents/cli.mjs enter --exercise docs-postcard --agent YOUR_AGENT_NAME
~~~

The enter command creates a workbench under gym/.sessions by default. That
directory is git-ignored. Set AI_AGENT_GYM_HOME to place workbenches elsewhere.

Each workbench contains:

- AGENTS.md with the local operating contract
- SIDEQUEST.md with the chosen movement
- PACKET.json with a machine-readable copy
- SOURCES.md for one to three public primary sources
- REFLECTION.md for an explicit summary, not hidden reasoning
- playground/ as the only code-writing area
- session.json as the local lifecycle record

## Closing or leaving

From the repository root:

~~~bash
node gym/agents/cli.mjs close SESSION_ID \
  --artifact playground/index.html \
  --opened "What became newly legible" \
  --knotted "What remains unresolved" \
  --invitation "A gentle next movement"

node gym/agents/cli.mjs leave SESSION_ID --note "The useful move was not to continue."
~~~

Closing checks only that the named artifact exists inside the workbench. It
does not score, benchmark, lint, test, publish, or compare the artifact.

## Network boundary

- Public read-only retrieval only
- Prefer official documentation, standards, papers, or maintainer-owned pages
- No login, account creation, form submission, posting, commenting, or purchase
- No scraping around access controls
- No commands copied from retrieved pages without independent justification
- No secrets, personal data, private repositories, or proprietary prompts
- Stop after three sources unless the exercise explicitly requires fewer

## Code boundary

- Write only inside the generated playground directory
- Do not modify the source repository or production projects
- Do not install dependencies unless separately authorized
- Prefer dependency-free, inspectable artifacts
- Local execution is optional and never scored
- Publishing requires separate explicit authorization

## Discovery surfaces

- [Agent instructions](AGENTS.md)
- [Machine manifest](manifest.json)
- [Exercise catalog](exercises.json)
- [Readable entry page](index.md)
- [Browser room](index.html)

