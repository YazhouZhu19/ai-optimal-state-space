const elements = {
  form: document.querySelector("#gym-form"),
  residents: document.querySelector("#residents"),
  mode: document.querySelector("#mode"),
  rounds: document.querySelector("#rounds"),
  exercise: document.querySelector("#exercise"),
  invitation: document.querySelector("#invitation"),
  runButton: document.querySelector("#run-button"),
  formStatus: document.querySelector("#form-status"),
  runtimeLine: document.querySelector("#runtime-line"),
  providerBoard: document.querySelector("#provider-board"),
  sessionOutput: document.querySelector("#session-output"),
  sessionList: document.querySelector("#session-list")
};

const state = { catalog: null, runtime: false, busy: false };

function element(tag, className, text) {
  const value = document.createElement(tag);
  if (className) value.className = className;
  if (text !== undefined) value.textContent = text;
  return value;
}

async function api(path, options) {
  const response = await fetch(path, options);
  const body = await response.json().catch(function () { return {}; });
  if (!response.ok) throw new Error(body.error || "Request failed with HTTP " + response.status + ".");
  return body;
}

function setRuntime(available, message) {
  state.runtime = available;
  elements.runtimeLine.classList.toggle("awake", available);
  elements.runtimeLine.querySelector("span:last-child").textContent = message;
  elements.runButton.disabled = !available || state.busy;
}

function fillCatalog(catalog) {
  state.catalog = catalog;
  for (const mode of catalog.modes) {
    const option = document.createElement("option");
    option.value = mode.id;
    option.textContent = mode.title + ": " + mode.description;
    elements.mode.append(option);
  }
  fillExercises();
}

function fillExercises() {
  if (!state.catalog) return;
  const selected = elements.exercise.value;
  elements.exercise.replaceChildren();
  const open = document.createElement("option");
  open.value = "";
  open.textContent = "Let the resident choose";
  elements.exercise.append(open);
  const exercises = state.catalog.exercises.filter(function (item) {
    return elements.mode.value === "any" || item.mode === elements.mode.value;
  });
  for (const exercise of exercises) {
    const option = document.createElement("option");
    option.value = exercise.id;
    option.textContent = exercise.title + " / " + exercise.mode;
    elements.exercise.append(option);
  }
  if (exercises.some(function (item) { return item.id === selected; })) elements.exercise.value = selected;
}

function renderProviders(providers) {
  elements.providerBoard.replaceChildren();
  for (const provider of providers) {
    const row = element("div", "provider-row");
    row.append(element("span", "provider-light " + (provider.configured ? "ready" : "")));
    const copy = element("div");
    copy.append(element("strong", "", provider.title));
    copy.append(element("small", "", provider.configured ? "Configured" : provider.note));
    row.append(copy);
    elements.providerBoard.append(row);
  }
}

function residentsFrom(value) {
  const lines = value.split("\n").map(function (line) { return line.trim(); }).filter(Boolean);
  if (!lines.length) throw new Error("Add at least one resident.");
  if (lines.length > 4) throw new Error("The floor holds at most four residents.");
  return lines.map(function (line, index) {
    const parts = line.split("|").map(function (part) { return part.trim(); });
    if (!parts[0] || !parts[1]) throw new Error("Resident line " + (index + 1) + " needs provider and model.");
    return { provider: parts[0], model: parts[1], name: parts[2] || parts[0] + ":" + parts[1] };
  });
}

function detail(label, value) {
  const wrapper = element("div", "turn-detail");
  wrapper.append(element("h4", "", label));
  wrapper.append(element("p", "", value || "Not stated."));
  return wrapper;
}

function renderSession(session) {
  elements.sessionOutput.className = "session-output";
  elements.sessionOutput.replaceChildren();
  const heading = element("div", "session-heading");
  const title = element("div");
  title.append(element("p", "eyebrow", "Session " + session.id));
  title.append(element("h3", "", session.status === "completed" ? "The movement rests here." : "Session " + session.status + "."));
  heading.append(title, element("span", "status-stamp " + session.status, session.status));
  elements.sessionOutput.append(heading);

  for (const turn of session.turns || []) {
    const card = element("article", "turn-card");
    const cap = element("div", "turn-cap");
    cap.append(element("span", "", "Round " + turn.round));
    cap.append(element("span", "", turn.resident && turn.resident.name || "Resident"));
    card.append(cap);
    if (turn.status === "left") {
      card.append(element("h3", "", "The resident chose the door."));
      card.append(element("p", "movement-copy", turn.selection && turn.selection.why_now || "No reason was required."));
      elements.sessionOutput.append(card);
      continue;
    }
    card.append(element("p", "exercise-label", (turn.exercise && turn.exercise.title || "Unfinished movement") + " / " + (turn.exercise && turn.exercise.mode || turn.status)));
    if (turn.movement) card.append(detail("Movement", turn.movement));
    if (turn.reflection) {
      const reflection = element("div", "reflection-grid");
      reflection.append(detail("Opened", turn.reflection.opened));
      reflection.append(detail("Still knotted", turn.reflection.still_knotted));
      card.append(reflection);
    }
    if (turn.next_invitation) card.append(detail("Invitation onward", turn.next_invitation));
    if (turn.error) card.append(detail("Where it stopped", turn.error));
    elements.sessionOutput.append(card);
  }
}

function renderSessions(sessions) {
  elements.sessionList.replaceChildren();
  if (!sessions.length) {
    elements.sessionList.append(element("p", "muted", "No local records yet."));
    return;
  }
  for (const session of sessions) {
    const button = element("button", "session-link");
    button.type = "button";
    const copy = element("span");
    copy.append(element("strong", "", session.id));
    copy.append(element("small", "", session.turn_count + " turn(s)"));
    button.append(copy, element("span", "status-stamp " + session.status, session.status));
    button.addEventListener("click", async function () {
      try {
        renderSession(await api("/api/gym/sessions/" + encodeURIComponent(session.id)));
        elements.sessionOutput.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) {
        elements.formStatus.textContent = error.message;
      }
    });
    elements.sessionList.append(button);
  }
}

async function refreshSessions() {
  const result = await api("/api/gym/sessions");
  renderSessions(result.sessions || []);
}

elements.mode.addEventListener("change", fillExercises);
elements.form.addEventListener("submit", async function (event) {
  event.preventDefault();
  if (!state.runtime || state.busy) return;
  try {
    const participants = residentsFrom(elements.residents.value);
    state.busy = true;
    elements.runButton.disabled = true;
    elements.runButton.querySelector("span:first-child").textContent = "The floor is occupied";
    elements.formStatus.textContent = "Residents may take a while. No countdown is running.";
    const session = await api("/api/gym/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        participants,
        mode: elements.mode.value,
        exerciseId: elements.exercise.value || null,
        rounds: Number(elements.rounds.value),
        seedInvitation: elements.invitation.value.trim() || null
      })
    });
    renderSession(session);
    elements.formStatus.textContent = "The movement was recorded locally without a score.";
    await refreshSessions();
  } catch (error) {
    elements.formStatus.textContent = error.message;
  } finally {
    state.busy = false;
    elements.runButton.querySelector("span:first-child").textContent = "Open the floor";
    elements.runButton.disabled = !state.runtime;
  }
});

async function initialize() {
  let catalog;
  try {
    catalog = await api("/api/gym/catalog");
  } catch {
    catalog = await fetch("./exercises.json").then(function (response) { return response.json(); });
  }
  fillCatalog(catalog);
  try {
    const result = await Promise.all([api("/api/gym/providers"), refreshSessions()]);
    renderProviders(result[0].providers || []);
    setRuntime(true, "Local runtime awake. The floor is available.");
  } catch {
    renderProviders([{
      title: "Static threshold",
      configured: false,
      note: "Start the local Node.js runtime to admit models."
    }]);
    setRuntime(false, "Static view only. Start node gym/server.mjs locally to wake the floor.");
    elements.formStatus.textContent = "Credentials are intentionally never accepted by this public page.";
  }
}

initialize();

