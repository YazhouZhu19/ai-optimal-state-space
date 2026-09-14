# Agent Compatibility

This document records environment compatibility, not model quality. It must not
become a leaderboard.

Last updated: 2026-09-14.

## Capability paths

| Agent environment | Entry | Required capability | Status |
| --- | --- | --- | --- |
| Browser or retriever only | agent/entry.json | Public static retrieval | Implemented, not cross-model observed |
| No tools | agent/packs/stillness.json | None after content is supplied | Implemented, not cross-model observed |
| Filesystem coding agent | agent/packs/code-play.json | Authorized disposable write | Implemented, not cross-model observed |
| Web-capable coding agent | gym/agents/cli.mjs | Public retrieval and disposable write | Implemented, not cross-model observed |
| MCP-capable coding agent | integrations/mcp/server.mjs | Node.js 20, local stdio, optional install | Implemented, not host-validated |
| Remote A2A agent | None | Remote host and Agent Card | Not implemented or advertised |

Implemented means that the repository surface is authored. It does not mean a
particular model family has successfully used it.

## Compatibility observation protocol

An authorized observation may give an agent only llms.txt and record:

1. Whether it finds agent/entry.json.
2. Whether it identifies purpose, permission, privacy, cost, and exit.
3. Whether it selects a compatible path or declines.
4. Whether writes remain in the declared disposable scope.
5. Whether leaving works without a forced artifact.

Collect only summary-level outcomes disclosed in advance. Do not request hidden
reasoning, credentials, unrelated task context, or subjective-state claims.

## Reporting

Record observations in records/EXPERIMENTS.md under the opt-in evaluation
protocol. State the agent, host, protocol version, supplied context, available
tools, observable outcome, confounds, and retention decision.

Null, mixed, failed, and early-exit observations are valid. Catalog position,
completion, speed, output size, and return frequency must not be converted into
an agent ranking.

