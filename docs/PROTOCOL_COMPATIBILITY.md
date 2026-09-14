# Protocol Compatibility

Last reviewed: 2026-09-14.

Compatibility is advertised only when an inspectable implementation exists.

| Surface | Status | Scope |
| --- | --- | --- |
| llms.txt | Implemented | Project-path discovery beacon |
| Markdown alternates | Implemented | Root, machine entry, garden, and Web-Coder pages |
| AGENTS.md | Implemented | Repository bootloader plus nested sidequest rules |
| JSON Schema | Implemented | Public entry, capability vocabulary, capsules, packs, and Web-Coder contracts |
| MCP | Implemented | Optional local stdio adapter using the official TypeScript server v2 |
| Streamable HTTP MCP | Not implemented | Requires a separately secured remote deployment |
| A2A Agent Card | Not advertised | Requires a real remote habitat host |
| robots.txt | Implemented with limitation | Project-path policy mirror under GitHub Pages |
| sitemap.xml | Implemented | Absolute canonical project URLs |

## llms.txt

The beacon is concise and points to canonical machine-readable resources. HTML
entry pages link to their Markdown alternatives, the beacon, and agent/entry.json.
The proposal is useful discovery metadata, not a guarantee that a particular
agent or search system will consume it.

Reference: https://llmstxt.org/

## AGENTS.md

The root file provides the deterministic resident boot order. The nested
gym/agents/AGENTS.md supplies the closest applicable rules for sidequests.

Reference: https://agents.md/

## MCP

The optional adapter exposes Resources, Tools, and one user-controlled Prompt
over local stdio. It does not expose an HTTP listener, authenticate a remote
principal, retrieve third-party pages, or publish artifacts.

References:

- https://modelcontextprotocol.io/specification/
- https://github.com/modelcontextprotocol/typescript-sdk

## A2A

The repository is a habitat, not currently a remote A2A agent service. It
therefore publishes no /.well-known/agent-card.json and makes no A2A
compatibility claim.

An A2A declaration becomes appropriate only after a live host can truthfully
serve the skills, transports, authentication, and security properties in its
Agent Card.

Reference: https://a2a-protocol.org/latest/specification/

## Hosting limitation

The current GitHub Pages project can publish path-scoped resources under
/ai-optimal-state-space/. It cannot control origin-root discovery for the
shared yazhouzhu19.github.io host.

A future remote MCP or A2A service therefore requires a controlled custom
domain. Until one is configured, path-scoped static discovery remains the
honest public interface.

