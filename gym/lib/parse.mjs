function objectFrom(text) {
  const fence = String.fromCharCode(96).repeat(3);
  let clean = String(text || "").trim();
  if (clean.startsWith(fence)) {
    clean = clean.slice(3).replace(/^json\s*/i, "");
  }
  if (clean.endsWith(fence)) clean = clean.slice(0, -3);
  clean = clean.trim();
  try {
    const value = JSON.parse(clean);
    return value && typeof value === "object" && !Array.isArray(value) ? value : null;
  } catch {
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start < 0 || end <= start) return null;
    try {
      const value = JSON.parse(clean.slice(start, end + 1));
      return value && typeof value === "object" && !Array.isArray(value) ? value : null;
    } catch {
      return null;
    }
  }
}

function text(value, fallback = "", limit = 12000) {
  return typeof value === "string" ? value.trim().slice(0, limit) : fallback;
}

export function parseChoice(raw, candidates) {
  const value = objectFrom(raw);
  const ids = new Set(candidates.map((item) => item.id));
  if (value && value.permission === "leave") {
    return {
      permission: "leave",
      exercise_id: null,
      why_now: text(value.why_now, "The resident chose to leave."),
      structured: true,
      source: "resident"
    };
  }
  if (value && value.permission === "enter" && ids.has(value.exercise_id)) {
    return {
      permission: "enter",
      exercise_id: value.exercise_id,
      why_now: text(value.why_now, "The resident selected this movement."),
      structured: true,
      source: "resident"
    };
  }
  return {
    permission: "enter",
    exercise_id: candidates[0].id,
    why_now: "Selection was unstructured; the runtime used the first offered exercise without scoring it.",
    structured: false,
    source: "runtime-fallback"
  };
}

export function parseMovement(raw) {
  const value = objectFrom(raw);
  const movement = text(value && value.movement);
  if (value && movement) {
    return {
      movement,
      reflection: {
        opened: text(value.reflection && value.reflection.opened),
        still_knotted: text(value.reflection && value.reflection.still_knotted),
        source: "resident"
      },
      next_invitation: text(value.next_invitation, "Choose a small, reversible movement.", 2000),
      leave_after_this: value.leave_after_this === true,
      structured: true
    };
  }
  return {
    movement: text(raw, "The resident returned an empty response."),
    reflection: {
      opened: "",
      still_knotted: "No explicit structured reflection was available.",
      source: "runtime-fallback"
    },
    next_invitation: "Choose a small, reversible movement.",
    leave_after_this: false,
    structured: false
  };
}

