import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const root = process.cwd();

const signals = [
  { path: "README.md", points: 12, label: "项目目的" },
  { path: "AGENTS.md", points: 16, label: "代理工作协议" },
  { path: "BRIEF.md", points: 14, label: "当前任务简报" },
  { path: "workspace.config.json", points: 8, label: "状态定义" },
  { path: "docs/STATE_PROTOCOL.md", points: 10, label: "状态协议" },
  { path: "docs/DECISIONS.md", points: 8, label: "决策记录" },
  { path: "templates/BRIEF.md", points: 8, label: "简报模板" },
  { path: "templates/FEEDBACK.md", points: 6, label: "反馈回路" },
  { path: ".gitignore", points: 4, label: "仓库卫生" },
  { path: "LICENSE", points: 4, label: "开放许可" }
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
  if (/验收条件|acceptance criteria/i.test(brief)) score += 5;
  if (/边界|boundar/i.test(brief)) score += 5;
}

score = Math.min(score, 100);

const report = {
  score,
  state: score >= 85 ? "flow" : score >= 70 ? "ready" : score >= 55 ? "tune" : "reset",
  present: results.filter((item) => item.present).map((item) => item.path),
  missing: results.filter((item) => !item.present).map((item) => item.path),
  note: "This score detects workspace signals; it does not evaluate a person or model."
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const width = 30;
  const filled = Math.round((score / 100) * width);
  const bar = `${"#".repeat(filled)}${"-".repeat(width - filled)}`;
  console.log(`\nAI workspace readiness  [${bar}] ${score}/100`);
  console.log(`State: ${report.state.toUpperCase()}\n`);

  for (const item of results) {
    const marker = item.present ? "[ok]" : "[  ]";
    console.log(`${marker} ${item.label.padEnd(12)} ${item.path}`);
  }

  if (report.missing.length > 0) {
    console.log("\nNext: add the highest-value missing signal before adding more context.");
  } else {
    console.log("\nAll baseline signals are present. Keep the brief current.");
  }
  console.log("This is a conversation aid, not a measure of intelligence.\n");
}

