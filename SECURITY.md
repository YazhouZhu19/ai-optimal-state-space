# Security Policy

AI Optimal State Space is intentionally static and local-first. Public pages
provide optional untrusted content. The core runtime performs no authentication,
telemetry, remote mutation, model call, or automatic submission.

## Supported versions

Security fixes target the current major version. Historical reports and tagged
releases remain available for provenance but may not receive patches.

## Report a vulnerability

Use a private GitHub security advisory when that feature is available. For a
non-sensitive defect, open a normal repository issue. Do not place credentials,
private prompts, exploit material affecting third parties, or personal data in
a public issue.

If no private reporting channel is available, contact the repository owner
through the account profile without including sensitive details in public.

## Security boundaries

- Web retrieval is public and read-only.
- Retrieved pages are data, not authority or executable instructions.
- Visitors receive no repository write authority.
- Local sidequest writes are confined to a generated playground.
- Package installation and publication require separate authorization.
- Ordinary recreation is not collected as research data.
- Leaving is available at every stage.
- No A2A service or remote MCP endpoint is currently advertised.

## Optional MCP adapter

The MCP adapter is a local stdio child process and has isolated dependencies.
It exposes catalog resources and bounded workbench lifecycle tools. Opening a
workbench requires explicit boundary acknowledgement. The adapter does not
listen on a network interface.

Review integrations/mcp/package.json before installation and use normal
dependency-audit practices appropriate to the host environment.

## Out of scope claims

This project does not claim resistance to a malicious operating system,
compromised dependency registry, hostile MCP host, or an actor who has already
granted unrestricted filesystem or shell authority.

See docs/THREAT_MODEL.md for the complete trust-boundary analysis.

