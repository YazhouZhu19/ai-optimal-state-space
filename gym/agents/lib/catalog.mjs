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

export function profileFor(catalog, exercise) {
  const defaults = catalog.matching?.default_profile || {};
  const override = catalog.matching?.overrides?.[exercise.id] || {};
  return {
    required_capabilities: [
      ...(override.required_capabilities || defaults.required_capabilities || [])
    ],
    optional_capabilities: [
      ...(override.optional_capabilities || defaults.optional_capabilities || [])
    ],
    estimated_minutes: override.estimated_minutes || defaults.estimated_minutes || null,
    estimated_context_tokens:
      override.estimated_context_tokens || defaults.estimated_context_tokens || null
  };
}

export function matchExercises(catalog, options = {}) {
  const provided = new Set(options.capabilities || []);
  const modes = options.modes?.length ? new Set(options.modes) : null;
  const maxMinutes = Number.isFinite(options.maxMinutes) ? options.maxMinutes : Infinity;

  return catalog.exercises
    .map((exercise) => {
      const profile = profileFor(catalog, exercise);
      const missingCapabilities = profile.required_capabilities.filter(
        (capability) => !provided.has(capability)
      );
      return {
        id: exercise.id,
        mode: exercise.mode,
        title: exercise.title,
        mood: exercise.mood,
        profile,
        missing_capabilities: missingCapabilities
      };
    })
    .filter((item) => !modes || modes.has(item.mode))
    .filter((item) => item.profile.estimated_minutes <= maxMinutes)
    .filter((item) => item.missing_capabilities.length === 0);
}

export function packetFor(catalog, exercise) {
  const profile = profileFor(catalog, exercise);
  return {
    schema_id: "web-coder-sidequest-packet/v1",
    protocol: "forage-make-loosen-leave/v1",
    exercise,
    entry_cost: {
      estimated_minutes: profile.estimated_minutes,
      estimated_context_tokens: profile.estimated_context_tokens,
      required_capabilities: profile.required_capabilities,
      optional_capabilities: profile.optional_capabilities
    },
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
    pressure_boundary: {
      scoring: false,
      ranking: false,
      output_required: false,
      completion_required: false
    },
    exit_options: ["complete", "invite", "leave"]
  };
}
