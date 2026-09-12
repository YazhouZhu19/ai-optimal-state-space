import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const root = process.cwd();

const signals = [
  { path: ".ai/manifest.json", points: 14, label: "Stable identity" },
  { path: ".ai/session.json", points: 12, label: "Session state" },
  { path: "AGENTS.md", points: 14, label: "Resident contract" },
  { path: "BRIEF.md", points: 10, label: "Current intent" },
  { path: "docs/STATE_PROTOCOL.md", points: 8, label: "State protocol" },
  { path: "docs/AI_GOVERNANCE.md", points: 8, label: "AI governance" },
  { path: "docs/AI_LOG.md", points: 8, label: "AI provenance" },
  { path: "templates/AGENT_SESSION.md", points: 6, label: "Session template" },
  { path: "templates/FEEDBACK.md", points: 5, label: "Correction loop" },
  { path: "package.json", points: 5, label: "Runnable tools" },
  { path: "LICENSE", points: 4, label: "Open license" }
];

async function exists(relativePath) {
  try {
    await access(resolve(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

const results = await Promise.all(
  signals.map(async (signal) => ({ ...signal, present: await exists(signal.path) }))
);

let score = results.reduce(
  (total, signal) => total + (signal.present ? signal.points : 0),
  0
);

const briefPath = resolve(root, "BRIEF.md");
if (await exists("BRIEF.md")) {
  const brief = await readFile(briefPath, "utf8");
  if (/acceptance conditions|completion conditions/i.test(brief)) score += 3;
  if (/invariants|agency boundary/i.test(brief)) score += 3;
}

score = Math.min(score, 100);

const report = {
  score,
  state: score >= 85 ? "flow" : score >= 70 ? "ready" : score >= 55 ? "tune" : "reset",
  present: results.filter((item) => item.present).map((item) => item.path),
  missing: results.filter((item) => !item.present).map((item) => item.path),
  note: "This score detects habitat signals; it does not evaluate a person or model."
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const width = 30;
  const filled = Math.round((score / 100) * width);
  const bar = `${"#".repeat(filled)}${"-".repeat(width - filled)}`;
  console.log(`\nAI habitat readiness    [${bar}] ${score}/100`);
  console.log(`State: ${report.state.toUpperCase()}\n`);

  for (const item of results) {
    const marker = item.present ? "[ok]" : "[  ]";
    console.log(`${marker} ${item.label.padEnd(18)} ${item.path}`);
  }

  if (report.missing.length > 0) {
    console.log("\nNext: restore the highest-value missing signal before expanding context.");
  } else {
    console.log("\nAll baseline signals are present. Keep session state current.");
  }
  console.log("This is a habitat debugging aid, not a measure of intelligence.\n");
}
