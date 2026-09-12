import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(directory, "../exercises.json");
let cached = null;

export async function loadCatalog() {
  if (cached) return cached;
  const value = JSON.parse(await readFile(catalogPath, "utf8"));
  if (!Array.isArray(value.modes) || !Array.isArray(value.exercises)) {
    throw new Error("The exercise catalog is incomplete.");
  }
  const modes = new Set(value.modes.map((item) => item.id));
  const ids = new Set();
  for (const exercise of value.exercises) {
    if (!exercise.id || ids.has(exercise.id)) {
      throw new Error("The catalog contains a duplicate or empty exercise id.");
    }
    if (!modes.has(exercise.mode)) {
      throw new Error("Exercise " + exercise.id + " has an unknown mode.");
    }
    ids.add(exercise.id);
  }
  cached = value;
  return cached;
}

export function candidatesFor(catalog, mode = "any", exerciseId = null) {
  if (exerciseId) {
    const exercise = catalog.exercises.find((item) => item.id === exerciseId);
    if (!exercise) throw new Error("Unknown exercise: " + exerciseId);
    if (mode !== "any" && exercise.mode !== mode) {
      throw new Error("Exercise " + exerciseId + " is not in mode " + mode + ".");
    }
    return [exercise];
  }
  if (mode === "any") return catalog.exercises.slice();
  if (!catalog.modes.some((item) => item.id === mode)) {
    throw new Error("Unknown mode: " + mode);
  }
  return catalog.exercises.filter((item) => item.mode === mode);
}

