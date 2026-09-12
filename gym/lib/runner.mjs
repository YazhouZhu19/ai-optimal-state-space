import { randomUUID } from "node:crypto";
import { createAdapter } from "../adapters/index.mjs";
import { candidatesFor, loadCatalog } from "./catalog.mjs";
import {
  PROMPT_PROTOCOL,
  SYSTEM_PROMPT,
  choicePrompt,
  choiceSchema,
  movementPrompt,
  movementSchema
} from "./prompts.mjs";
import { parseChoice, parseMovement } from "./parse.mjs";
import { SessionStore } from "./store.mjs";

const providers = new Set(["ollama", "openai", "openai-compatible"]);

function requiredText(value, label, limit) {
  if (typeof value !== "string" || !value.trim()) throw new Error(label + " is required.");
  return value.trim().slice(0, limit);
}

function participantsFrom(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 4) {
    throw new Error("A session requires one to four residents.");
  }
  return value.map((item, index) => {
    const provider = requiredText(item.provider, "participants[" + index + "].provider", 40);
    if (!providers.has(provider)) throw new Error("Unknown provider: " + provider);
    const model = requiredText(item.model, "participants[" + index + "].model", 200);
    const name = typeof item.name === "string" && item.name.trim()
      ? item.name.trim().slice(0, 100)
      : provider + ":" + model;
    const baseUrl = typeof item.baseUrl === "string" && item.baseUrl.trim() ? item.baseUrl.trim() : null;
    return Object.assign({ name, provider, model }, baseUrl ? { baseUrl } : {});
  });
}

function publicResident(value) {
  return { name: value.name, provider: value.provider, model: value.model };
}

function sessionId() {
  return new Date().toISOString().replace(/[-:.TZ]/g, "") + "-" + randomUUID().slice(0, 8);
}

export class GymRunError extends Error {
  constructor(message, id) {
    super(message);
    this.name = "GymRunError";
    this.sessionId = id;
  }
}

export async function runGym(options, dependencies = {}) {
  const catalog = await loadCatalog();
  const participants = participantsFrom(options.participants);
  const rounds = Number.parseInt(options.rounds || 1, 10);
  if (!Number.isInteger(rounds) || rounds < 1 || rounds > 3) {
    throw new Error("Rounds must be an integer from one to three.");
  }
  const mode = options.mode || "any";
  const exerciseId = options.exerciseId || options.exercise_id || null;
  const candidates = candidatesFor(catalog, mode, exerciseId);
  const seedValue = typeof options.seedInvitation === "string"
    ? options.seedInvitation
    : typeof options.seed_invitation === "string"
      ? options.seed_invitation
      : "";
  const seed = seedValue.trim().slice(0, 2000) || null;
  const store = dependencies.store || new SessionStore();
  const emit = typeof dependencies.onEvent === "function" ? dependencies.onEvent : function () {};
  const adapterFactory = dependencies.createAdapter || createAdapter;
  const now = dependencies.now || function () { return new Date().toISOString(); };

  const session = {
    schema_id: "ai-gym-session/v1",
    id: sessionId(),
    status: "running",
    started_at: now(),
    completed_at: null,
    catalog_version: catalog.version,
    prompt_protocol: PROMPT_PROTOCOL,
    rounds_requested: rounds,
    requested_mode: mode,
    requested_exercise_id: exerciseId,
    seed_invitation: seed,
    participants: participants.map(publicResident),
    turns: [],
    final_invitation: seed,
    error: null
  };

  let invitation = seed || "Begin from the room itself; no outcome is required.";
  let current = null;
  const inactive = new Set();
  await store.save(session);
  emit({ type: "session_started", session_id: session.id });

  try {
    for (let round = 1; round <= rounds; round += 1) {
      for (let index = 0; index < participants.length; index += 1) {
        if (inactive.has(index)) continue;
        const participant = participants[index];
        const resident = publicResident(participant);
        const adapter = adapterFactory(participant);
        current = {
          round,
          resident,
          status: "choosing",
          inherited_invitation: invitation,
          selection: null,
          exercise: null,
          movement: "",
          reflection: null,
          next_invitation: "",
          structured: false
        };
        session.turns.push(current);
        await store.save(session);
        emit({ type: "choosing", round, resident });

        const rawChoice = await adapter.generate({
          system: SYSTEM_PROMPT,
          prompt: choicePrompt({ candidates, invitation, round, name: participant.name }),
          schema: choiceSchema(candidates.map((item) => item.id))
        });
        const choice = parseChoice(rawChoice, candidates);
        current.selection = choice;
        if (choice.permission === "leave") {
          current.status = "left";
          inactive.add(index);
          await store.save(session);
          emit({ type: "left", round, resident, selection: choice });
          current = null;
          continue;
        }

        const exercise = candidates.find((item) => item.id === choice.exercise_id);
        current.status = "selected";
        current.exercise = {
          id: exercise.id,
          mode: exercise.mode,
          title: exercise.title,
          invitation: exercise.invitation,
          reflection_cue: exercise.reflection_cue
        };
        await store.save(session);
        emit({ type: "selected", round, resident, exercise: current.exercise });

        const rawMovement = await adapter.generate({
          system: SYSTEM_PROMPT,
          prompt: movementPrompt({ exercise, invitation, round, name: participant.name }),
          schema: movementSchema
        });
        const result = parseMovement(rawMovement);
        current.status = "completed";
        current.movement = result.movement;
        current.reflection = result.reflection;
        current.next_invitation = result.next_invitation;
        current.structured = choice.structured && result.structured;
        invitation = result.next_invitation;
        session.final_invitation = invitation;
        if (result.leave_after_this) inactive.add(index);
        await store.save(session);
        emit({ type: "movement_completed", round, resident, exercise: current.exercise });
        current = null;
      }
      if (inactive.size === participants.length) break;
    }
    session.status = session.turns.some((turn) => turn.status === "completed") ? "completed" : "left";
    session.completed_at = now();
    await store.save(session);
    emit({ type: "session_completed", session_id: session.id, status: session.status });
    return session;
  } catch (error) {
    if (current) {
      current.status = "failed";
      current.error = String(error.message || error).slice(0, 1000);
    }
    session.status = "failed";
    session.completed_at = now();
    session.error = String(error.message || error).slice(0, 1000);
    await store.save(session);
    emit({ type: "session_failed", session_id: session.id, error: session.error });
    throw new GymRunError(session.error, session.id);
  }
}

