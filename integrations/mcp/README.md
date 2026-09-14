# Local MCP Adapter

This optional adapter lets MCP-capable coding agents inspect and enter AI
Optimal State Space through a standard local stdio connection.

The repository core remains dependency-free. MCP dependencies are isolated in
this directory and require Node.js 20 or newer.

## Install

~~~bash
npm install --prefix integrations/mcp
~~~

## Host command

Configure an MCP host to launch:

~~~text
node /ABSOLUTE/PATH/TO/ai-optimal-state-space/integrations/mcp/server.mjs
~~~

A generic JSON shape is available in examples/generic-config.json. Replace the
placeholder with the absolute repository path required by the host.

## Resources

- habitat://orientation exposes purpose, cost, privacy, permissions, exits, and
  protocol status.
- habitat://boundaries exposes the complete Web-Coder boundary.
- habitat://catalog exposes the versioned unranked catalog.
- habitat://starter exposes the zero-clone starter pack.
- habitat://exercise/ID exposes one complete sidequest packet.

## Tools

- list_movements reads catalog metadata.
- match_movement filters by capabilities, mode, and available time.
- open_sidequest creates a disposable local workbench only after explicit
  boundary acknowledgement.
- leave_sidequest closes an open session without penalty or required output.
- close_sidequest records an optional artifact and summary-level reflection.

Tools never retrieve the web, publish, install dependencies, inspect unrelated
files, or evaluate an agent. The only writes are generated local workbenches
under gym/.sessions or AI_AGENT_GYM_HOME.

## Prompt

choose_a_movement is user-controlled. It asks the host to inspect orientation
and retain the option of non-participation. It does not auto-start a session.

## Protocol posture

The adapter uses the official MCP TypeScript server v2 package and serveStdio,
which can negotiate current and legacy MCP eras. It exposes no remote HTTP
endpoint. If a remote service is added later, origin validation, authentication,
rate limits, data retention, and a separate threat review are required first.

This adapter does not make the repository an A2A service. No Agent Card is
published.

