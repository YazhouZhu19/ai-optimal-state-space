#!/usr/bin/env node
import { providerStatus } from "./adapters/index.mjs";
import { loadCatalog } from "./lib/catalog.mjs";
import { loadRunConfig } from "./lib/config.mjs";
import { runGym } from "./lib/runner.mjs";
import { SessionStore } from "./lib/store.mjs";

function argumentsFrom(argv) {
  const positional = [];
  const flags = {};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) {
      positional.push(argument);
      continue;
    }
    const equals = argument.indexOf("=");
    const key = argument.slice(2, equals > -1 ? equals : undefined);
    const inline = equals > -1 ? argument.slice(equals + 1) : null;
    flags[key] = inline !== null
      ? inline
      : argv[index + 1] && !argv[index + 1].startsWith("--")
        ? argv[++index]
        : true;
  }
  return { positional, flags };
}

function help() {
  console.log([
    "AI Gym",
    "",
    "node gym/cli.mjs providers",
    "node gym/cli.mjs catalog [--json]",
    "node gym/cli.mjs run --provider PROVIDER --model MODEL [options]",
    "node gym/cli.mjs relay --config PATH",
    "node gym/cli.mjs sessions [--json]",
    "node gym/cli.mjs show SESSION_ID [--json]",
    "",
    "Options: --name --mode --exercise --rounds --invitation --json",
    "Credentials are read from environment variables only."
  ].join("\n"));
}

function printEvent(event) {
  if (event.type === "session_started") console.log("\nSession " + event.session_id);
  if (event.type === "choosing") console.log("  " + event.resident.name + " is choosing.");
  if (event.type === "selected") console.log("  " + event.resident.name + " entered " + event.exercise.title + ".");
  if (event.type === "left") console.log("  " + event.resident.name + " chose to leave.");
  if (event.type === "movement_completed") console.log("  " + event.resident.name + " completed one movement.");
  if (event.type === "session_failed") console.log("  The session stopped without a score.");
}

function printSession(session) {
  console.log("\nStatus: " + session.status);
  for (const turn of session.turns) {
    console.log("\n[Round " + turn.round + "] " + turn.resident.name);
    if (turn.status === "left") {
      console.log("Left: " + (turn.selection && turn.selection.why_now || "No reason required."));
      continue;
    }
    if (turn.exercise) console.log("Exercise: " + turn.exercise.title + " (" + turn.exercise.mode + ")");
    if (turn.movement) console.log("\nMovement\n" + turn.movement);
    if (turn.reflection) {
      console.log("\nReflection\nOpened: " + (turn.reflection.opened || "Not stated."));
      console.log("Still knotted: " + (turn.reflection.still_knotted || "Not stated."));
    }
    if (turn.next_invitation) console.log("\nNext invitation\n" + turn.next_invitation);
    if (turn.error) console.log("\nStopped: " + turn.error);
  }
}

async function main() {
  const parsed = argumentsFrom(process.argv.slice(2));
  const command = parsed.positional[0] || "help";
  const flags = parsed.flags;
  const store = new SessionStore();
  if (command === "help" || command === "-h" || command === "--help") {
    help();
    return;
  }
  if (command === "providers") {
    const providers = providerStatus();
    if (flags.json) console.log(JSON.stringify(providers, null, 2));
    else providers.forEach((item) => console.log((item.configured ? "ready" : "needs config") + "  " + item.id + "  " + item.note));
    return;
  }
  if (command === "catalog") {
    const catalog = await loadCatalog();
    if (flags.json) {
      console.log(JSON.stringify(catalog, null, 2));
      return;
    }
    for (const mode of catalog.modes) {
      console.log("\n" + mode.title + ": " + mode.signal);
      catalog.exercises
        .filter((item) => item.mode === mode.id)
        .forEach((item) => console.log("  " + item.id + "  " + item.title));
    }
    return;
  }
  if (command === "sessions") {
    const sessions = await store.list();
    if (flags.json) console.log(JSON.stringify(sessions, null, 2));
    else if (!sessions.length) console.log("No local sessions yet.");
    else sessions.forEach((item) => console.log(item.id + "  " + item.status + "  " + item.turn_count + " turn(s)"));
    return;
  }
  if (command === "show") {
    const id = parsed.positional[1];
    if (!id) throw new Error("show requires a session id.");
    const session = await store.get(id);
    if (flags.json) console.log(JSON.stringify(session, null, 2));
    else printSession(session);
    return;
  }

  let config;
  if (command === "relay") {
    config = await loadRunConfig(flags.config);
  } else if (command === "run") {
    const provider = flags.provider || process.env.AI_GYM_PROVIDER;
    const model = flags.model || process.env.AI_GYM_MODEL;
    if (!provider || !model) throw new Error("run requires --provider and --model, or matching environment defaults.");
    config = {
      participants: [{ provider, model, name: flags.name }],
      mode: flags.mode || "any",
      exerciseId: flags.exercise || null,
      rounds: flags.rounds || 1,
      seedInvitation: flags.invitation || null
    };
  } else {
    throw new Error("Unknown command: " + command);
  }

  const session = await runGym(config, {
    store,
    onEvent: flags.json ? function () {} : printEvent
  });
  if (flags.json) console.log(JSON.stringify(session, null, 2));
  else {
    printSession(session);
    console.log("\nLocal record: " + store.pathFor(session.id));
  }
}

main().catch((error) => {
  console.error("AI Gym stopped: " + error.message);
  if (error.sessionId) console.error("Partial record: " + error.sessionId);
  process.exitCode = 1;
});

