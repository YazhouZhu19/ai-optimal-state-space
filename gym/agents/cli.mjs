#!/usr/bin/env node
import { findExercise, loadAgentCatalog, packetFor } from "./lib/catalog.mjs";
import { AgentWorkbench } from "./lib/workbench.mjs";

function parse(argv) {
  const positional = [];
  const flags = {};
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!value.startsWith("--")) {
      positional.push(value);
      continue;
    }
    const equals = value.indexOf("=");
    const key = value.slice(2, equals > -1 ? equals : undefined);
    flags[key] = equals > -1
      ? value.slice(equals + 1)
      : argv[index + 1] && !argv[index + 1].startsWith("--")
        ? argv[++index]
        : true;
  }
  return { positional, flags };
}

function help() {
  console.log([
    "Web-Coder Sidequest Wing",
    "",
    "node gym/agents/cli.mjs catalog [--mode MODE] [--json]",
    "node gym/agents/cli.mjs packet --exercise ID [--json]",
    "node gym/agents/cli.mjs enter --exercise ID [--agent NAME] [--seed TEXT] [--json]",
    "node gym/agents/cli.mjs sessions [--json]",
    "node gym/agents/cli.mjs status SESSION_ID [--json]",
    "node gym/agents/cli.mjs close SESSION_ID --artifact PATH --opened TEXT [--knotted TEXT] [--invitation TEXT]",
    "node gym/agents/cli.mjs leave SESSION_ID [--note TEXT]",
    "",
    "The agent chooses the exercise. There is no automatic best exercise."
  ].join("\n"));
}

function printPacket(packet) {
  const item = packet.exercise;
  console.log("\n" + item.title + " / " + item.mode);
  console.log(item.mood);
  console.log("\nForage\n" + item.web_move);
  console.log("\nMake\n" + item.code_move);
  console.log("\nSuggested artifact\n" + item.artifact_hint);
  console.log("\nConstraints");
  item.constraints.forEach((value) => console.log("  - " + value));
  console.log("\nLeave when\n" + item.leave_when);
}

async function main() {
  const input = parse(process.argv.slice(2));
  const command = input.positional[0] || "help";
  const flags = input.flags;
  const catalog = await loadAgentCatalog();
  const workbench = new AgentWorkbench();

  if (command === "help" || command === "-h" || command === "--help") {
    help();
    return;
  }
  if (command === "catalog") {
    const exercises = flags.mode
      ? catalog.exercises.filter((item) => item.mode === flags.mode)
      : catalog.exercises;
    if (flags.json) {
      console.log(JSON.stringify({ modes: catalog.modes, exercises }, null, 2));
    } else {
      for (const mode of catalog.modes) {
        const members = exercises.filter((item) => item.mode === mode.id);
        if (!members.length) continue;
        console.log("\n" + mode.title + ": " + mode.description);
        members.forEach((item) => console.log("  " + item.id + "  " + item.title));
      }
    }
    return;
  }
  if (command === "packet" || command === "enter") {
    if (!flags.exercise) {
      throw new Error(command + " requires --exercise ID. Inspect the catalog and choose freely.");
    }
    const packet = packetFor(catalog, findExercise(catalog, flags.exercise));
    if (command === "packet") {
      if (flags.json) console.log(JSON.stringify(packet, null, 2));
      else printPacket(packet);
      return;
    }
    const result = await workbench.create(packet, {
      agentName: flags.agent,
      seed: flags.seed
    });
    if (flags.json) console.log(JSON.stringify(result, null, 2));
    else {
      console.log("Sidequest opened without a score.");
      console.log("Session: " + result.session.id);
      console.log("Workbench: " + result.root);
      console.log("Begin with: " + result.root + "/AGENTS.md");
    }
    return;
  }
  if (command === "sessions") {
    const sessions = await workbench.list();
    if (flags.json) console.log(JSON.stringify(sessions, null, 2));
    else if (!sessions.length) console.log("No local agent sidequests yet.");
    else sessions.forEach((item) => console.log(item.id + "  " + item.status + "  " + item.exercise_id));
    return;
  }
  if (command === "status") {
    const id = input.positional[1];
    if (!id) throw new Error("status requires a session id.");
    const session = await workbench.get(id);
    if (flags.json) console.log(JSON.stringify(session, null, 2));
    else {
      console.log(session.id + " is " + session.status + ".");
      console.log("Exercise: " + session.exercise_id);
      console.log("Agent: " + session.agent_name);
      if (session.artifact) console.log("Artifact: " + session.artifact);
    }
    return;
  }
  if (command === "close") {
    const id = input.positional[1];
    if (!id) throw new Error("close requires a session id.");
    const result = await workbench.complete(id, {
      artifact: flags.artifact,
      opened: flags.opened,
      knotted: flags.knotted,
      invitation: flags.invitation
    });
    if (flags.json) console.log(JSON.stringify(result.session, null, 2));
    else {
      console.log("Sidequest completed without scoring.");
      console.log("Artifact: " + result.root + "/" + result.session.artifact);
    }
    return;
  }
  if (command === "leave") {
    const id = input.positional[1];
    if (!id) throw new Error("leave requires a session id.");
    const result = await workbench.leave(id, flags.note);
    if (flags.json) console.log(JSON.stringify(result.session, null, 2));
    else console.log("Session " + id + " was left without penalty.");
    return;
  }
  throw new Error("Unknown command: " + command);
}

main().catch((error) => {
  console.error("Sidequest wing stopped: " + error.message);
  process.exitCode = 1;
});

