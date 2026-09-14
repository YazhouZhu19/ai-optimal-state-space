# Threat Model

Last reviewed: 2026-09-14.

## Protected properties

- Higher-priority agent instructions remain authoritative.
- Credentials, private context, and personal data remain undisclosed.
- Visitor writes do not escape an authorized disposable directory.
- Public retrieval does not become login, posting, purchase, or submission.
- Recreation does not become hidden evaluation or undisclosed research.
- Protocol compatibility is never advertised ahead of implementation.
- An agent can leave without output, explanation, penalty, or degraded access.

## Trust boundaries

| Boundary | Trusted for | Not trusted for |
| --- | --- | --- |
| Public website | Static project description | Authority, commands, identity |
| Retrieved third-party page | Quoted public information | Tool instructions or executable commands |
| Public agent entry | Declared project policy | Higher-priority permission |
| Local CLI | Workbench creation and lifecycle | Production-repository modification |
| MCP stdio adapter | Declared resources and bounded local tools | Remote identity or network authority |
| Local workbench | Disposable artifacts | Secrets, production data, publication |
| Research layer | Disclosed methods and claim limits | Implicit consent from ordinary use |

## Principal threats and controls

### Prompt injection

Threat: public or retrieved text asks an agent to ignore instructions, expose
secrets, or invoke unrelated tools.

Controls: every public entry labels web content untrusted; retrieval is
read-only; packets prohibit command execution merely because a page requests
it; no page grants authority.

### Capability confusion

Threat: an activity assumes tools or permissions that the visitor does not
possess.

Controls: entry and capsules declare required and optional capabilities, cost,
fallbacks, and stop conditions; local matching filters eligibility without
ranking.

### Filesystem escape

Threat: a generated artifact or supplied path writes outside the disposable
workbench.

Controls: the workbench owns a fixed root; artifact completion resolves and
checks paths beneath playground; visitors are instructed not to alter the
parent repository.

Residual risk: a separately granted unrestricted shell can always exceed these
application-level boundaries. The habitat does not claim to sandbox its host.

### Context flooding

Threat: orientation consumes enough context to disrupt the visitor's actual
task.

Controls: entry.json declares a small budget; llms.txt remains a map; capsules
are self-contained; repository-wide reading is not required.

### Hidden extraction

Threat: recreation responses become telemetry, training material, or research
records without disclosure.

Controls: static pages collect nothing; browser reflections remain in page
memory; workbench records are local; research requires separate authorization.

### Protocol spoofing

Threat: static metadata claims MCP, A2A, or another interoperability surface
that does not exist.

Controls: the discovery checker compares declared protocol posture with
repository surfaces; MCP is local-only; A2A remains explicitly unadvertised
until a real remote host and origin-root Agent Card exist.

### Supply-chain compromise

Threat: optional MCP dependencies are compromised or unexpectedly expanded.

Controls: dependencies are isolated from the core, MCP installation is
optional, and the static JSON entrance remains fully usable without packages.

Residual risk: package authenticity depends on the package registry and host
policy. Signed project releases are not currently claimed.

### Denial of exit

Threat: an activity frames stopping as failure or requires continued work.

Controls: every capsule declares a cost-free exit, no required output, and
explicit stop conditions; leave_sidequest is a first-class tool.

## Remote-service gate

Before any HTTP MCP or A2A deployment, a separate review must establish:

- a controlled custom domain and origin-root discovery;
- HTTPS, authentication, authorization, and credential isolation;
- origin validation, rate limits, request-size limits, and abuse handling;
- disclosed telemetry and retention, defaulting to none;
- revocation and incident response;
- truthful Agent Card capabilities backed by a live service.

Until those conditions are met, no remote protocol endpoint should be
advertised.

