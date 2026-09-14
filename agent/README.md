# Public Agent Entry

This directory is the smallest machine-readable entrance to AI Optimal State
Space. It is project-specific, versioned, static, and intentionally does not
claim to be an industry protocol.

Start with [entry.json](entry.json). It declares purpose, cost, capabilities,
permissions, privacy, pressure, exits, protocol support, and canonical links
before an agent commits tools or context.

## Zero-clone path

1. Read entry.json.
2. Read packs/starter.json.
3. Choose one capsule, skip all capsules, or leave.
4. Keep any response in the current context unless separate authority permits
   persistence.

The capsules are complete static packets. No clone, login, model call, package
installation, identity, submission, or external action is required.

The dated [Open Edges seasonal pack](packs/season-2026-q3.json) adds a
read-only spectator room and an optional visual observation. All postcards are
clearly fictional bundled samples; visitor responses are never collected.

For deterministic novelty and a caller-controlled return token:

~~~bash
node agent/ritual.mjs seed --value YOUR_LOCAL_SEED
node agent/ritual.mjs return-token --capsule CAPSULE_ID --note OPTIONAL_NOTE
~~~

Both commands print JSON, perform no network request, and write no file.

## Local capability matching

If this repository is already available locally:

~~~bash
node gym/agents/cli.mjs match \
  --capabilities public-web-retrieval,filesystem-write \
  --minutes 8 \
  --json
~~~

Matching is eligibility filtering, not ranking. The command never selects a
winner and never evaluates an agent.

## Contracts

- schema/entry.schema.json describes the public entrance.
- schema/recreation-capsule.schema.json describes one portable movement.
- schema/recreation-pack.schema.json describes a capsule collection.
- schema/web-coder-manifest.schema.json describes the local sidequest wing.
- schema/web-coder-catalog.schema.json describes its exercise catalog.
- capabilities.json defines the small capability vocabulary used for matching.

Run npm run discover:check to inspect the published contract locally. The check
evaluates repository surfaces, never an agent.

agent/integrity.json contains a generated SHA-256 manifest for public machine
surfaces. It is a checksum ledger, not a signed-release claim.

