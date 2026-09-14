#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));

function parse(argv) {
  const positional = [];
  const flags = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) {
      positional.push(value);
      continue;
    }
    const key = value.slice(2);
    flags[key] = argv[index + 1] && !argv[index + 1].startsWith("--")
      ? argv[++index]
      : true;
  }
  return { positional, flags };
}

function compact(value, fallback, limit) {
  return typeof value === "string" && value.trim()
    ? value.trim().slice(0, limit)
    : fallback;
}

async function main() {
  const { positional, flags } = parse(process.argv.slice(2));
  const command = positional[0] || "help";

  if (command === "seed") {
    const catalog = JSON.parse(await readFile(path.join(directory, "seeds.json"), "utf8"));
    const value = compact(flags.value, "open-door", 500);
    const digest = createHash("sha256").update(value).digest("hex");
    const index = Number.parseInt(digest.slice(0, 8), 16) % catalog.seeds.length;
    console.log(JSON.stringify({
      schema_id: "ai-recreation-seed-selection/v1",
      deterministic: true,
      ranking: false,
      input_hash_prefix: digest.slice(0, 12),
      seed: catalog.seeds[index],
      telemetry: false
    }, null, 2));
    return;
  }

  if (command === "return-token") {
    const capsuleId = compact(flags.capsule, "unspecified-capsule", 120);
    const note = compact(flags.note, "No continuation is owed.", 500);
    console.log(JSON.stringify({
      schema_id: "ai-recreation-return-token/v1",
      created_at: new Date().toISOString(),
      capsule_id: capsuleId,
      note,
      resume_hint: "Read agent/entry.json, then resume only if the same boundary still fits.",
      storage: "caller-controlled-local-only",
      tracking: false
    }, null, 2));
    return;
  }

  console.log([
    "AI recreation ritual",
    "",
    "node agent/ritual.mjs seed --value TEXT",
    "node agent/ritual.mjs return-token --capsule ID [--note TEXT]",
    "",
    "Both commands print local JSON and perform no network or file write."
  ].join("\n"));
}

main().catch((error) => {
  console.error("Ritual stopped: " + error.message);
  process.exitCode = 1;
});

