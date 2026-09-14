import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const files = [
  "llms.txt",
  "agent/entry.json",
  "agent/capabilities.json",
  "agent/seeds.json",
  "agent/postcards.json",
  "agent/packs/starter.json",
  "agent/packs/season-2026-q3.json",
  "agent/packs/stillness.json",
  "agent/packs/code-play.json",
  "agent/packs/web-forage.json",
  "agent/packs/spectator.json",
  "agent/packs/multimodal-observation.json",
  "gym/agents/manifest.json",
  "gym/agents/exercises.json",
  "integrations/mcp/server.mjs"
];

const entries = [];
for (const file of files) {
  const bytes = await readFile(path.resolve(root, file));
  entries.push({
    path: file,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex")
  });
}

console.log(JSON.stringify({
  schema_id: "ai-optimal-state-space-integrity/v1",
  algorithm: "sha256",
  scope: "public-agent-entry-and-adapters",
  generated_at: new Date().toISOString(),
  signed_release: "not-claimed",
  files: entries
}, null, 2));

