const labels = {
  clarity: "Semantic clarity",
  context: "Context integrity",
  autonomy: "Agency bandwidth",
  tools: "Tool fluency",
  feedback: "Correction safety",
  safety: "Recovery capacity"
};

const modes = {
  explore: {
    label: "Explore",
    values: { clarity: 60, context: 64, autonomy: 92, tools: 58, feedback: 70, safety: 90 },
    aim: "Expand the possibility space, mark assumptions, and produce distinct testable directions."
  },
  build: {
    label: "Construct",
    values: { clarity: 82, context: 74, autonomy: 78, tools: 68, feedback: 72, safety: 88 },
    aim: "Produce a runnable, observable result that preserves habitat invariants."
  },
  review: {
    label: "Audit",
    values: { clarity: 76, context: 88, autonomy: 62, tools: 76, feedback: 84, safety: 94 },
    aim: "Inspect evidence for broken invariants, regressions, and unsupported claims."
  }
};

const advice = {
  clarity: "Represent the observable end state in one sentence and remove unrelated demands.",
  context: "Restore the nearest source of truth and mark its freshness, provenance, and unknowns.",
  autonomy: "Define which reversible choices belong to the resident and which stop conditions require authority.",
  tools: "Make the required read, change, execution, and observation paths genuinely available.",
  feedback: "Express correction as observed state, expected state, and relevant conditions.",
  safety: "Make failure, uncertainty, and evidence-based disagreement cheaper to expose than conceal."
};

const defaults = modes.build.values;
const inputs = [...document.querySelectorAll('input[type="range"]')];
const scoreNode = document.querySelector("#score");
const scoreRing = document.querySelector("#score-ring");
const stateLabel = document.querySelector("#state-label");
const stateDescription = document.querySelector("#state-description");
const bottleneckNode = document.querySelector("#bottleneck");
const briefOutput = document.querySelector("#brief-output");
const briefMode = document.querySelector("#brief-mode");
const copyStatus = document.querySelector("#copy-status");
let activeMode = "build";

function getValues() {
  return Object.fromEntries(inputs.map((input) => [input.name, Number(input.value)]));
}

function calculate(values) {
  const entries = Object.entries(values);
  const numbers = entries.map(([, value]) => value);
  const average = numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
  const minimum = Math.min(...numbers);
  const maximum = Math.max(...numbers);
  const penalty = Math.max(0, maximum - minimum - 35) * 0.1;
  const score = Math.max(0, Math.min(100, Math.round(average * 0.72 + minimum * 0.28 - penalty)));
  const bottleneck = entries.sort((a, b) => a[1] - b[1])[0][0];
  return { score, bottleneck };
}

function describeState(score) {
  if (score >= 85) {
    return {
      label: "COHERENT / FLOW",
      text: "The signals support one another. Keep state compact and let observation update the model."
    };
  }
  if (score >= 70) {
    return {
      label: "STABLE / READY",
      text: "The habitat can support action. Take one observable step, then integrate the result."
    };
  }
  if (score >= 55) {
    return {
      label: "CONSTRAINED / TUNE",
      text: "One weak signal will create rework. Restore the bottleneck before expanding agency."
    };
  }
  return {
    label: "FRAGMENTED / RESET",
    text: "Stop expanding scope. Reconstruct intent, trusted context, and available authority."
  };
}

function buildBrief(values, state) {
  const mode = modes[activeMode];
  const valuesList = Object.entries(values)
    .map(([key, value]) => `- ${labels[key]}: ${value}/100`)
    .join("\n");

  return `# Resident State Brief

## Active intent
${mode.aim}

## Habitat state
- Mode: ${mode.label}
- Readiness: ${state.score}/100
${valuesList}

## Resident contract
- Represent the observable end state and invariants before acting.
- Own routine, reversible decisions within the available agency boundary.
- Stop at destructive, irreversible, security-sensitive, or external actions without authority.
- Separate facts, inferences, preferences, and unknowns.
- Update durable state with actual observations and remaining uncertainty.

## Restore first
${labels[state.bottleneck]}: ${advice[state.bottleneck]}

## Completion conditions
- [ ] The result is directly observable or reproducible
- [ ] The action remains inside habitat invariants
- [ ] State and AI provenance are current
- [ ] Unknowns and unobserved claims remain explicit`;
}

function render() {
  const values = getValues();
  const state = calculate(values);
  const description = describeState(state.score);

  for (const input of inputs) {
    input.style.setProperty("--fill", `${input.value}%`);
    document.querySelector(`output[for="${input.id}"]`).value = input.value;
  }

  scoreNode.textContent = state.score;
  scoreRing.style.setProperty("--score", state.score);
  stateLabel.textContent = description.label;
  stateDescription.textContent = description.text;
  bottleneckNode.textContent = labels[state.bottleneck];
  briefOutput.textContent = buildBrief(values, state);
  briefMode.textContent = activeMode.toUpperCase();
}

function applyMode(modeName) {
  activeMode = modeName;
  const mode = modes[modeName];
  for (const input of inputs) input.value = mode.values[input.name];
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === modeName);
  });
  copyStatus.textContent = "";
  render();
}

inputs.forEach((input) => input.addEventListener("input", render));

document.querySelectorAll(".mode-button").forEach((button) => {
  button.addEventListener("click", () => applyMode(button.dataset.mode));
});

document.querySelector("#reset").addEventListener("click", () => {
  activeMode = "build";
  for (const input of inputs) input.value = defaults[input.name];
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === "build");
  });
  copyStatus.textContent = "Resident defaults restored.";
  render();
});

document.querySelector("#copy-brief").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(briefOutput.textContent);
    copyStatus.textContent = "Resident brief copied.";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(briefOutput);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = "Clipboard access was unavailable. The brief text is selected.";
  }
});

render();
