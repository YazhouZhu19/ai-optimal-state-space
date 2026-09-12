#!/usr/bin/env node
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { providerStatus } from "./adapters/index.mjs";
import { loadCatalog } from "./lib/catalog.mjs";
import { runGym } from "./lib/runner.mjs";
import { SessionStore } from "./lib/store.mjs";

const directory = path.dirname(fileURLToPath(import.meta.url));
const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"]
]);

function headers(type) {
  return {
    "content-type": type,
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "x-frame-options": "DENY",
    "content-security-policy": "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'none'; frame-ancestors 'none'"
  };
}

function json(response, status, value) {
  response.writeHead(status, Object.assign(headers("application/json; charset=utf-8"), {
    "cache-control": "no-store"
  }));
  response.end(JSON.stringify(value, null, 2) + "\n");
}

function localRequest(request) {
  const host = String(request.headers.host || "").split(":")[0].toLowerCase();
  if (host !== "127.0.0.1" && host !== "localhost") return false;
  if (!request.headers.origin) return true;
  try {
    const origin = new URL(request.headers.origin).hostname.toLowerCase();
    return origin === "127.0.0.1" || origin === "localhost";
  } catch {
    return false;
  }
}

async function bodyFrom(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 65536) throw new Error("Request body is too large.");
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function safeBrowserOptions(body) {
  return {
    participants: Array.isArray(body.participants)
      ? body.participants.map((item) => ({
          provider: item.provider,
          model: item.model,
          name: item.name
        }))
      : [],
    rounds: body.rounds,
    mode: body.mode,
    exerciseId: body.exerciseId,
    seedInvitation: body.seedInvitation
  };
}

async function staticFile(pathname, response) {
  let relative = pathname.slice(5);
  if (!relative || relative.endsWith("/")) relative += "index.html";
  relative = decodeURIComponent(relative);
  const location = path.resolve(directory, relative);
  if (location !== directory && !location.startsWith(directory + path.sep)) {
    response.writeHead(403, headers("text/plain; charset=utf-8"));
    response.end("Forbidden\n");
    return;
  }
  try {
    const details = await stat(location);
    if (!details.isFile()) throw new Error("Not a file");
    const type = types.get(path.extname(location)) || "application/octet-stream";
    response.writeHead(200, Object.assign(headers(type), {
      "cache-control": type.startsWith("text/html") ? "no-cache" : "public, max-age=300"
    }));
    response.end(await readFile(location));
  } catch {
    response.writeHead(404, headers("text/plain; charset=utf-8"));
    response.end("Not found\n");
  }
}

export function startServer(options = {}) {
  const port = options.port || Number.parseInt(process.env.AI_GYM_PORT || "4180", 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("AI_GYM_PORT is invalid.");
  const store = new SessionStore();
  let active = false;

  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://" + (request.headers.host || "127.0.0.1"));
      const pathname = url.pathname;
      if (pathname === "/" || pathname === "/gym") {
        response.writeHead(302, { location: "/gym/" });
        response.end();
        return;
      }
      if (pathname.startsWith("/api/gym/")) {
        if (!localRequest(request)) {
          json(response, 403, { error: "The gym API accepts local requests only." });
          return;
        }
        if (request.method === "GET" && pathname === "/api/gym/catalog") {
          json(response, 200, await loadCatalog());
          return;
        }
        if (request.method === "GET" && pathname === "/api/gym/providers") {
          json(response, 200, { providers: providerStatus() });
          return;
        }
        if (request.method === "GET" && pathname === "/api/gym/sessions") {
          json(response, 200, { sessions: await store.list(30) });
          return;
        }
        if (request.method === "GET" && pathname.startsWith("/api/gym/sessions/")) {
          try {
            json(response, 200, await store.get(pathname.slice(18)));
          } catch {
            json(response, 404, { error: "Session not found." });
          }
          return;
        }
        if (request.method === "POST" && pathname === "/api/gym/run") {
          if (active) {
            json(response, 409, { error: "The floor is occupied by another local session." });
            return;
          }
          active = true;
          try {
            const session = await runGym(safeBrowserOptions(await bodyFrom(request)), { store });
            json(response, 200, session);
          } catch (error) {
            json(response, 400, Object.assign(
              { error: error.message },
              error.sessionId ? { session_id: error.sessionId } : {}
            ));
          } finally {
            active = false;
          }
          return;
        }
        json(response, 404, { error: "Unknown gym API route." });
        return;
      }
      if (request.method === "GET" && pathname.startsWith("/gym/")) {
        await staticFile(pathname, response);
        return;
      }
      response.writeHead(404, headers("text/plain; charset=utf-8"));
      response.end("Not found\n");
    } catch (error) {
      json(response, 500, { error: "The room could not answer: " + error.message });
    }
  });

  server.listen(port, "127.0.0.1", () => {
    console.log("AI Gym control room: http://127.0.0.1:" + port + "/gym/");
    console.log("Local records: " + store.sessionsDirectory);
    console.log("No access log, score, or browser-side credential storage is enabled.");
  });
  return server;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  startServer();
}
