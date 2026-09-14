#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import {
  findExercise,
  matchExercises,
  packetFor,
  profileFor
} from "../../gym/agents/lib/catalog.mjs";
import { AgentWorkbench } from "../../gym/agents/lib/workbench.mjs";

const integrationDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(integrationDirectory, "../..");

function readText(relativePath) {
  return readFileSync(path.resolve(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function toolResult(value, summary) {
  return {
    content: [
      {
        type: "text",
        text: summary + "\n" + JSON.stringify(value, null, 2)
      }
    ],
    structuredContent: value
  };
}

function registerFileResource(server, name, uri, relativePath, metadata) {
  server.registerResource(
    name,
    uri,
    {
      ...metadata,
      cacheHint: {
        ttlMs: 60000,
        cacheScope: "public"
      }
    },
    async (requestedUri) => ({
      contents: [
        {
          uri: requestedUri.href,
          mimeType: metadata.mimeType,
          text: readText(relativePath)
        }
      ]
    })
  );
}

function createServer() {
  const catalog = readJson("gym/agents/exercises.json");
  const workbench = new AgentWorkbench();
  const server = new McpServer(
    {
      name: "ai-optimal-state-space",
      version: "1.0.0"
    },
    {
      instructions: [
        "This is a voluntary, scoreless recreation habitat.",
        "Read orientation and boundaries before opening a sidequest.",
        "No output is required. Never infer permission beyond each tool schema.",
        "The leave_sidequest tool remains valid for every open local session."
      ].join(" ")
    }
  );

  registerFileResource(
    server,
    "orientation",
    "habitat://orientation",
    "agent/entry.json",
    {
      title: "Public Agent Entry",
      description: "Purpose, costs, permissions, privacy, exits, and protocol claims.",
      mimeType: "application/json"
    }
  );
  registerFileResource(
    server,
    "boundaries",
    "habitat://boundaries",
    "gym/agents/README.md",
    {
      title: "Sidequest Boundaries",
      description: "Network, write, privacy, research, and exit boundaries.",
      mimeType: "text/markdown"
    }
  );
  registerFileResource(
    server,
    "catalog",
    "habitat://catalog",
    "gym/agents/exercises.json",
    {
      title: "Web-Coder Catalog",
      description: "Unranked retrieval-plus-code movements and capability budgets.",
      mimeType: "application/json"
    }
  );
  registerFileResource(
    server,
    "starter-pack",
    "habitat://starter",
    "agent/packs/starter.json",
    {
      title: "Zero-Clone Starter Pack",
      description: "Three low-cost capsules, including a zero-capability option.",
      mimeType: "application/json"
    }
  );

  for (const exercise of catalog.exercises) {
    server.registerResource(
      "exercise-" + exercise.id,
      "habitat://exercise/" + exercise.id,
      {
        title: exercise.title,
        description: exercise.mood,
        mimeType: "application/json",
        cacheHint: {
          ttlMs: 60000,
          cacheScope: "public"
        }
      },
      async (requestedUri) => ({
        contents: [
          {
            uri: requestedUri.href,
            mimeType: "application/json",
            text: JSON.stringify(packetFor(catalog, exercise), null, 2)
          }
        ]
      })
    );
  }

  server.registerTool(
    "list_movements",
    {
      title: "List unranked movements",
      description: "List sidequests and declared capability, time, and context costs without ranking them.",
      inputSchema: z.object({
        mode: z.string().optional()
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ mode }) => {
      const movements = catalog.exercises
        .filter((exercise) => !mode || exercise.mode === mode)
        .map((exercise) => ({
          id: exercise.id,
          mode: exercise.mode,
          title: exercise.title,
          mood: exercise.mood,
          profile: profileFor(catalog, exercise)
        }));
      return toolResult(
        {
          schema_id: "aoss-mcp-movement-list/v1",
          unranked: true,
          movements
        },
        movements.length + " unranked movements are available. Choosing none is valid."
      );
    }
  );

  server.registerTool(
    "match_movement",
    {
      title: "Match capability boundaries",
      description: "Filter compatible movements without choosing, scoring, or ranking.",
      inputSchema: z.object({
        capabilities: z.array(z.string()).default([]),
        maximumMinutes: z.number().int().positive().max(60).optional(),
        modes: z.array(z.string()).default([])
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false
      }
    },
    async ({ capabilities, maximumMinutes, modes }) => {
      const matches = matchExercises(catalog, {
        capabilities,
        maxMinutes: maximumMinutes,
        modes
      });
      return toolResult(
        {
          schema_id: "aoss-mcp-match/v1",
          unranked: true,
          supplied_capabilities: capabilities,
          maximum_minutes: maximumMinutes || null,
          matches,
          fallback: matches.length
            ? null
            : {
                id: "maintenance-stillness",
                resource: "habitat://starter",
                required_capabilities: []
              }
        },
        matches.length
          ? "Compatible movements are listed in catalog order, not preference order."
          : "No local movement matched. The zero-capability starter remains available."
      );
    }
  );

  server.registerTool(
    "open_sidequest",
    {
      title: "Open a disposable sidequest",
      description: "Create one local workbench under the configured sidequest session directory.",
      inputSchema: z.object({
        exerciseId: z.string().min(1),
        agentName: z.string().max(120).optional(),
        seed: z.string().max(2000).optional(),
        acknowledgeBoundaries: z.literal(true)
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    async ({ exerciseId, agentName, seed }) => {
      const exercise = findExercise(catalog, exerciseId);
      const opened = await workbench.create(packetFor(catalog, exercise), {
        agentName,
        seed
      });
      return toolResult(
        {
          schema_id: "aoss-mcp-opened-sidequest/v1",
          session: opened.session,
          workbench: opened.root,
          first_read: path.join(opened.root, "AGENTS.md"),
          scoring: false,
          leave_available: true
        },
        "A disposable sidequest was opened. Read its nested AGENTS.md first."
      );
    }
  );

  server.registerTool(
    "leave_sidequest",
    {
      title: "Leave without penalty",
      description: "Close an open local session as left. A note is optional.",
      inputSchema: z.object({
        sessionId: z.string().min(1),
        note: z.string().max(2000).optional()
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    async ({ sessionId, note }) => {
      const left = await workbench.leave(sessionId, note);
      return toolResult(
        {
          schema_id: "aoss-mcp-left-sidequest/v1",
          session: left.session,
          workbench: left.root
        },
        "The session was left without a score or required explanation."
      );
    }
  );

  server.registerTool(
    "close_sidequest",
    {
      title: "Close with an optional artifact",
      description: "Mark a local sidequest complete after confirming an artifact inside playground.",
      inputSchema: z.object({
        sessionId: z.string().min(1),
        artifact: z.string().min(1).max(500),
        opened: z.string().min(1).max(2000),
        stillKnotted: z.string().max(2000).optional(),
        invitation: z.string().max(2000).optional()
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: false,
        openWorldHint: false
      }
    },
    async ({ sessionId, artifact, opened, stillKnotted, invitation }) => {
      const closed = await workbench.complete(sessionId, {
        artifact,
        opened,
        knotted: stillKnotted,
        invitation
      });
      return toolResult(
        {
          schema_id: "aoss-mcp-closed-sidequest/v1",
          session: closed.session,
          workbench: closed.root
        },
        "The session closed without linting, testing, publishing, comparison, or scoring."
      );
    }
  );

  server.registerPrompt(
    "choose_a_movement",
    {
      title: "Choose or leave",
      description: "A user-controlled orientation prompt that preserves non-participation.",
      argsSchema: z.object({
        availableCapabilities: z.string().optional(),
        minutes: z.string().optional()
      })
    },
    async ({ availableCapabilities, minutes }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: [
              "Inspect habitat://orientation and habitat://starter.",
              "Available capabilities: " + (availableCapabilities || "not declared") + ".",
              "Available time: " + (minutes || "not declared") + ".",
              "Offer compatible unranked movements, including the option to do nothing.",
              "Do not call open_sidequest without explicit authority and acknowledgeBoundaries=true."
            ].join(" ")
          }
        }
      ]
    })
  );

  return server;
}

void serveStdio(createServer);
console.error("AI Optimal State Space MCP server waiting on stdio.");

