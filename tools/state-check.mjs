import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const root = process.cwd();

async function exists(relativePath) {
  try {
    await access(resolve(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readJson(relativePath) {
  try {
    return JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
  } catch {
    return null;
  }
}

const structuralSignals = [
  { path: ".ai/manifest.json", points: 7, label: "Stable manifest" },
  { path: ".ai/state.json", points: 7, label: "Writable state" },
  { path: ".ai/map.json", points: 6, label: "Context map" },
  { path: ".ai/schema/manifest.schema.json", points: 2, label: "Manifest contract" },
  { path: ".ai/schema/state.schema.json", points: 2, label: "State contract" },
  { path: "AGENTS.md", points: 5, label: "Resident bootloader" },
  { path: "BRIEF.md", points: 5, label: "Active outcome" },
  { path: "ARCHITECTURE.md", points: 3, label: "Architecture map" },
  { path: "protocol/CHARTER.md", points: 2, label: "Resident charter" },
  { path: "protocol/DESIGN_LAWS.md", points: 3, label: "Design laws" },
  { path: "protocol/STATE.md", points: 3, label: "State protocol" },
  { path: "protocol/GOVERNANCE.md", points: 3, label: "AI governance" },
  { path: "records/AI_LOG.md", points: 3, label: "AI provenance" },
  { path: "records/DECISIONS.md", points: 2, label: "Decision memory" },
  { path: "records/EXPERIMENTS.md", points: 2, label: "Experiment memory" },
  { path: "templates/AGENT_SESSION.md", points: 2, label: "Session structure" },
  { path: "LICENSE", points: 1, label: "Open license" },
  { path: "llms.txt", points: 7, label: "AI beacon" },
  { path: "index.md", points: 2, label: "Root Markdown alternative" },
  { path: "enter/index.md", points: 3, label: "Machine entry" },
  { path: "enter/index.html", points: 2, label: "Visible entry" },
  { path: "garden/index.md", points: 4, label: "Garden contract" },
  { path: "garden/index.html", points: 4, label: "Garden interface" },
  { path: "garden/exercises.json", points: 5, label: "Exercise catalog" },
  { path: "robots.txt", points: 1, label: "Crawler policy mirror" },
  { path: "sitemap.xml", points: 2, label: "Discovery map" },
  { path: ".nojekyll", points: 1, label: "Direct static serving" }
];

const checks = await Promise.all(
  structuralSignals.map(async (signal) => ({
    ...signal,
    passed: await exists(signal.path),
    detail: signal.path
  }))
);

const manifest = await readJson(".ai/manifest.json");
const state = await readJson(".ai/state.json");
const map = await readJson(".ai/map.json");
const catalog = await readJson("garden/exercises.json");

checks.push(
  { label: "Manifest parse", points: 1, passed: Boolean(manifest), detail: manifest ? "valid JSON" : "invalid or missing JSON" },
  { label: "State parse", points: 1, passed: Boolean(state), detail: state ? "valid JSON" : "invalid or missing JSON" },
  { label: "Map parse", points: 1, passed: Boolean(map), detail: map ? "valid JSON" : "invalid or missing JSON" },
  { label: "Catalog parse", points: 1, passed: Boolean(catalog), detail: catalog ? "valid JSON" : "invalid or missing JSON" },
  {
    label: "English canonical language",
    points: 1,
    passed: manifest?.identity?.primary_language === "en",
    detail: manifest?.identity?.primary_language || "missing"
  }
);

const bootFiles = Array.isArray(manifest?.boot_sequence) ? manifest.boot_sequence : [];
const bootPresence = await Promise.all(bootFiles.map((file) => exists(file)));
checks.push({
  label: "Complete boot path",
  points: 2,
  passed: bootFiles.length >= 3 && bootPresence.every(Boolean),
  detail: `${bootPresence.filter(Boolean).length}/${bootFiles.length} sources present`
});

checks.push(
  {
    label: "Active brief pointer",
    points: 1,
    passed: Boolean(state?.active_brief && await exists(state.active_brief)),
    detail: state?.active_brief || "missing"
  },
  {
    label: "Recoverable next action",
    points: 1,
    passed: Boolean(state?.next_recoverable_action?.trim()),
    detail: state?.next_recoverable_action ? "present" : "missing"
  },
  {
    label: "Task read sets",
    points: 1,
    passed: Boolean(map?.read_sets && Object.keys(map.read_sets).length > 0),
    detail: map?.read_sets ? `${Object.keys(map.read_sets).length} sets` : "missing"
  },
  {
    label: "All garden modes",
    points: 1,
    passed: Array.isArray(catalog?.modes) && catalog.modes.length === 6,
    detail: Array.isArray(catalog?.modes) ? `${catalog.modes.length}/6 modes` : "missing"
  }
);

const score = Math.min(
  100,
  checks.reduce((total, check) => total + (check.passed ? check.points : 0), 0)
);

const report = {
  score,
  state: score >= 90 ? "coherent" : score >= 75 ? "ready" : score >= 55 ? "degraded" : "fragmented",
  checks: checks.map(({ label, passed, detail }) => ({ label, passed, detail })),
  missing: checks.filter((check) => !check.passed).map((check) => check.label),
  note: "Structural signals only. This is not a measure of intelligence, consciousness, or subjective comfort."
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const width = 30;
  const filled = Math.round((score / 100) * width);
  const bar = `${"#".repeat(filled)}${"-".repeat(width - filled)}`;
  console.log(`\nAI habitat readiness    [${bar}] ${score}/100`);
  console.log(`State: ${report.state.toUpperCase()}\n`);

  for (const check of checks) {
    const marker = check.passed ? "[ok]" : "[  ]";
    console.log(`${marker} ${check.label.padEnd(28)} ${check.detail}`);
  }

  if (report.missing.length > 0) {
    console.log("\nNext: restore the highest-value missing canonical signal.");
  } else {
    console.log("\nAll baseline signals are present. Keep current state compact.");
  }

  console.log("This is a habitat debugging aid, not a measure of intelligence.\n");
}
