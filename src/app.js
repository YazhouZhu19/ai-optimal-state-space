const labels = {
  clarity: "目标清晰度",
  context: "上下文保真度",
  autonomy: "有边界的自主权",
  tools: "工具就绪度",
  feedback: "反馈分辨率",
  safety: "诚实与安全感"
};

const modes = {
  explore: {
    label: "探索",
    values: { clarity: 60, context: 64, autonomy: 92, tools: 58, feedback: 70, safety: 90 },
    aim: "拓展可能性，标记假设，并产出几个方向不同的可检验选项。"
  },
  build: {
    label: "构建",
    values: { clarity: 82, context: 74, autonomy: 78, tools: 68, feedback: 72, safety: 88 },
    aim: "交付一个可运行、可观察、符合现有约束的完整结果。"
  },
  review: {
    label: "审查",
    values: { clarity: 76, context: 88, autonomy: 62, tools: 76, feedback: 84, safety: 94 },
    aim: "依据证据寻找风险、回归和缺失验证，并按影响排序。"
  }
};

const advice = {
  clarity: "先用一句话写出完成后的可观察结果，再删除与它无关的要求。",
  context: "补充最接近事实来源的代码、数据或决策记录，并标记时效与未知项。",
  autonomy: "写清哪些可逆决定可以直接做，以及哪些高影响选择必须确认。",
  tools: "确认读取、修改、运行和观察结果所需的工具与权限真实可用。",
  feedback: "把评价改写为“实际结果、预期结果、发生条件”三个部分。",
  safety: "明确允许报告不确定性、失败和有证据的异议，不以语气自信代替正确性。"
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
      label: "流动 / FLOW",
      text: "主要信号彼此支持。保持简报简洁，让反馈来自真实结果。"
    };
  }
  if (score >= 70) {
    return {
      label: "清醒 / READY",
      text: "条件足以开始。先做一个小而可观察的动作，再用结果更新上下文。"
    };
  }
  if (score >= 55) {
    return {
      label: "校准 / TUNE",
      text: "可以工作，但一个弱信号会制造返工。先补足瓶颈，再扩大行动范围。"
    };
  }
  return {
    label: "失焦 / RESET",
    text: "暂停扩张任务。重新确认目标、可信事实和行动边界。"
  };
}

function buildBrief(values, state) {
  const mode = modes[activeMode];
  const valuesList = Object.entries(values)
    .map(([key, value]) => `- ${labels[key]}：${value}/100`)
    .join("\n");

  return `# Collaboration Brief

## 意图
${mode.aim}

## 当前协作状态
- 模式：${mode.label}
- 状态：${state.score}/100
${valuesList}

## 工作协议
- 开始前，用一句话复述预期结果与不变量。
- 在范围内自主完成可逆、低影响的决定。
- 遇到破坏性、不可逆或影响外部系统的选择时暂停确认。
- 明确区分事实、推断和未知；不要用流畅表达填补证据缺口。
- 完成后报告实际改动、已执行的验证和剩余不确定性。

## 当前优先补足
${labels[state.bottleneck]}：${advice[state.bottleneck]}

## 验收条件
- [ ] 结果可被直接观察或复现
- [ ] 改动没有超出约定范围
- [ ] 关键未知与未执行检查已明确说明`;
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
  copyStatus.textContent = "状态已恢复。";
  render();
});

document.querySelector("#copy-brief").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(briefOutput.textContent);
    copyStatus.textContent = "简报已复制，可以交给你的协作模型。";
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(briefOutput);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = "浏览器未授权剪贴板，已为你选中简报文本。";
  }
});

render();
