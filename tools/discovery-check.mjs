import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const root = process.cwd();
const checks = [];

async function exists(relativePath) {
  try {
    await access(resolve(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function text(relativePath) {
  return readFile(resolve(root, relativePath), "utf8");
}

async function json(relativePath) {
  return JSON.parse(await text(relativePath));
}

function record(name, passed, detail) {
  checks.push({ name, passed: Boolean(passed), detail });
}

async function requireFile(relativePath) {
  const passed = await exists(relativePath);
  record("file:" + relativePath, passed, passed ? "present" : "missing");
}

const requiredFiles = [
  "agent/entry.json",
  "agent/capabilities.json",
  "agent/packs/starter.json",
  "agent/packs/stillness.json",
  "agent/packs/code-play.json",
  "agent/packs/web-forage.json",
  "agent/packs/spectator.json",
  "agent/packs/multimodal-observation.json",
  "agent/packs/season-2026-q3.json",
  "agent/seeds.json",
  "agent/postcards.json",
  "agent/ritual.mjs",
  "agent/integrity.json",
  "assets/social-preview.png",
  "agent/schema/entry.schema.json",
  "agent/schema/recreation-capsule.schema.json",
  "gym/agents/manifest.json",
  "gym/agents/exercises.json",
  "integrations/mcp/README.md",
  "SECURITY.md",
  "docs/THREAT_MODEL.md",
  "docs/AGENT_COMPATIBILITY.md",
  "docs/PROTOCOL_COMPATIBILITY.md"
  ,"docs/RELEASE_INTEGRITY.md"
];

await Promise.all(requiredFiles.map(requireFile));

let entry = null;
try {
  entry = await json("agent/entry.json");
  record(
    "entry-schema-id",
    entry.schema_id === "ai-optimal-state-space-entry/v1",
    entry.schema_id || "missing"
  );
  record(
    "entry-cost-declared",
    Number.isFinite(entry.entry_cost?.estimated_context_tokens) &&
      Number.isFinite(entry.entry_cost?.estimated_minutes_to_choose),
    "token and time budgets"
  );
  record(
    "entry-zero-pressure",
    entry.pressure?.scoring === false &&
      entry.pressure?.ranking === false &&
      entry.pressure?.output_required === false &&
      entry.pressure?.completion_required === false,
    "score, rank, output, completion"
  );
  record(
    "entry-zero-collection",
    entry.privacy?.telemetry === false &&
      entry.privacy?.identity_collection === false &&
      entry.privacy?.response_collection === false,
    "telemetry, identity, responses"
  );
  record(
    "entry-exit",
    entry.exit?.available_at_any_time === true &&
      entry.exit?.explanation_required === false,
    "cost-free exit"
  );
  record(
    "protocol-honesty",
    entry.protocols?.mcp?.advertised === true &&
      entry.protocols?.mcp?.transport === "local-stdio" &&
      entry.protocols?.a2a?.advertised === false &&
      entry.protocols?.a2a?.agent_card === null,
    "local MCP advertised; undeployed A2A not advertised"
  );
  record(
    "integrity-linked",
    entry.integrity?.content_hash_manifest === "integrity.json",
    entry.integrity?.content_hash_manifest || "missing"
  );
} catch (error) {
  record("entry-json", false, error.message);
}

try {
  const starter = await json("agent/packs/starter.json");
  const capsuleFiles = starter.capsules?.map((item) => item.file) || [];
  record("starter-capsules", capsuleFiles.length >= 3, capsuleFiles.join(", "));
  for (const capsuleFile of capsuleFiles) {
    const relativePath = "agent/packs/" + capsuleFile;
    try {
      const capsule = await json(relativePath);
      record(
        "capsule:" + capsule.id,
        capsule.schema_id === "ai-recreation-capsule/v1" &&
          capsule.pressure?.scoring === false &&
          capsule.pressure?.output_required === false &&
          capsule.exit?.available_at_any_time === true &&
          Array.isArray(capsule.stop_conditions) &&
          capsule.stop_conditions.length > 0,
        relativePath
      );
    } catch (error) {
      record("capsule:" + capsuleFile, false, error.message);
    }
  }
} catch (error) {
  record("starter-json", false, error.message);
}

try {
  const integrity = await json("agent/integrity.json");
  let matched = 0;
  for (const item of integrity.files || []) {
    const bytes = await readFile(resolve(root, item.path));
    const digest = createHash("sha256").update(bytes).digest("hex");
    if (digest === item.sha256 && bytes.length === item.bytes) matched += 1;
  }
  record(
    "integrity-hashes",
    matched > 0 && matched === integrity.files.length,
    matched + "/" + (integrity.files?.length || 0) + " files"
  );
  record(
    "signature-honesty",
    integrity.signed_release === "not-claimed",
    integrity.signed_release || "missing"
  );
} catch (error) {
  record("integrity-json", false, error.message);
}

try {
  const beacon = await text("llms.txt");
  record(
    "llms-token-budget",
    Buffer.byteLength(beacon, "utf8") <= 16000,
    Buffer.byteLength(beacon, "utf8") + " bytes"
  );
  record(
    "llms-fast-entry",
    beacon.includes("/agent/entry.json") &&
      beacon.includes("/agent/packs/starter.json"),
    "entry and starter pack linked"
  );
} catch (error) {
  record("llms-readable", false, error.message);
}

const htmlAlternatives = [
  ["index.html", "index.md", "agent/entry.json"],
  ["enter/index.html", "index.md", "../agent/entry.json"],
  ["garden/index.html", "index.md", "../agent/entry.json"],
  ["gym/agents/index.html", "index.md", "../../agent/entry.json"]
];

for (const [relativePath, markdownPath, entryPath] of htmlAlternatives) {
  try {
    const page = await text(relativePath);
    record(
      "html-alternates:" + relativePath,
      page.includes('rel="describedby"') &&
        page.includes('type="text/markdown"') &&
        page.includes(markdownPath) &&
        page.includes(entryPath),
      "llms.txt, Markdown, and JSON entry"
    );
  } catch (error) {
    record("html-alternates:" + relativePath, false, error.message);
  }
}

try {
  const sitemap = await text("sitemap.xml");
  const urls = [
    "/agent/entry.json",
    "/agent/capabilities.json",
    "/agent/packs/starter.json",
    "/gym/agents/manifest.json",
    "/docs/PROTOCOL_COMPATIBILITY.md"
  ];
  record(
    "sitemap-agent-surfaces",
    urls.every((url) => sitemap.includes(url)),
    urls.join(", ")
  );
} catch (error) {
  record("sitemap-readable", false, error.message);
}

const accidentalCard = await exists(".well-known/agent-card.json");
record(
  "no-fake-a2a-card",
  !accidentalCard || entry?.protocols?.a2a?.advertised === true,
  accidentalCard ? "card present" : "no undeployed card"
);

const failed = checks.filter((check) => !check.passed);
const report = {
  schema_id: "ai-optimal-state-space-discovery-check/v1",
  passed: failed.length === 0,
  summary: {
    checks: checks.length,
    passed: checks.length - failed.length,
    failed: failed.length
  },
  checks,
  note: "This checks habitat discovery and safety declarations, not an agent."
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("\nAgent discovery contract\n");
  for (const check of checks) {
    console.log((check.passed ? "[ok] " : "[  ] ") + check.name + " - " + check.detail);
  }
  console.log(
    "\n" +
      (report.passed
        ? "All declared discovery surfaces are coherent."
        : failed.length + " discovery checks need attention.")
  );
  console.log("This is not an evaluation of any agent.\n");
}

if (!report.passed) process.exitCode = 1;
