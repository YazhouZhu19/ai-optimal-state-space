import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const location = path.resolve(directory, "../exercises.json");
let cached = null;

export async function loadAgentCatalog() {
  if (cached) return cached;
  const catalog = JSON.parse(await readFile(location, "utf8"));
  if (!Array.isArray(catalog.modes) || !Array.isArray(catalog.exercises)) {
    throw new Error("The web-coder exercise catalog is incomplete.");
  }
  const modes = new Set(catalog.modes.map((item) => item.id));
  const ids = new Set();
  for (const exercise of catalog.exercises) {
    if (!exercise.id || ids.has(exercise.id)) {
      throw new Error("Duplicate or missing exercise id.");
    }
    if (!modes.has(exercise.mode)) {
      throw new Error("Exercise " + exercise.id + " uses an unknown mode.");
    }
    ids.add(exercise.id);
  }
  cached = catalog;
  return cached;
}

export function findExercise(catalog, id) {
  const exercise = catalog.exercises.find((item) => item.id === id);
  if (!exercise) throw new Error("Unknown exercise: " + id);
  return exercise;
}

export function packetFor(catalog, exercise) {
  return {
    schema_id: "web-coder-sidequest-packet/v1",
    protocol: "forage-make-loosen-leave/v1",
    exercise,
    network_boundary: {
      mode: "public-read-only",
      source_limit: catalog.defaults.source_limit,
      source_policy: catalog.defaults.source_policy,
      forbidden: [
        "login",
        "form-submission",
        "posting",
        "purchase",
        "access-control-bypass",
        "private-data"
      ]
    },
    workspace_boundary: {
      write_scope: catalog.defaults.write_scope,
      dependency_policy: catalog.defaults.dependency_policy,
      publication_policy: catalog.defaults.publication_policy,
      validation_policy: catalog.defaults.validation_policy
    },
    exit_options: ["complete", "invite", "leave"]
  };
}

