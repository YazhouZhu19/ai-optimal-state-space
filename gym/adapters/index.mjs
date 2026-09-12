class ProviderError extends Error {
  constructor(message, provider) {
    super(message);
    this.name = "ProviderError";
    this.provider = provider;
  }
}

function endpoint(baseUrl, suffix) {
  const base = String(baseUrl).replace(/\/+$/, "");
  return base.endsWith(suffix) ? base : base + suffix;
}

function ollamaEndpoint(baseUrl) {
  const base = String(baseUrl).replace(/\/+$/, "");
  if (base.endsWith("/api/chat")) return base;
  if (base.endsWith("/api")) return base + "/chat";
  return base + "/api/chat";
}

function compact(value) {
  const message = typeof value === "string"
    ? value
    : value && value.error && value.error.message
      ? value.error.message
      : value && value.message
        ? value.message
        : JSON.stringify(value || "");
  return String(message || "No response body.").replace(/\s+/g, " ").slice(0, 500);
}

async function postJson(url, provider, body, headers, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: Object.assign({ "content-type": "application/json" }, headers || {}),
      body: JSON.stringify(body),
      signal: controller.signal
    });
    const raw = await response.text();
    let value;
    try {
      value = raw ? JSON.parse(raw) : {};
    } catch {
      value = raw;
    }
    if (!response.ok) {
      throw new ProviderError(provider + " returned HTTP " + response.status + ": " + compact(value), provider);
    }
    if (!value || typeof value !== "object") {
      throw new ProviderError(provider + " returned a non-JSON envelope.", provider);
    }
    return value;
  } catch (error) {
    if (error instanceof ProviderError) throw error;
    if (error && error.name === "AbortError") {
      throw new ProviderError(provider + " request timed out.", provider);
    }
    throw new ProviderError(provider + " request failed: " + error.message, provider);
  } finally {
    clearTimeout(timer);
  }
}

function outputText(value) {
  if (typeof value.output_text === "string" && value.output_text.trim()) return value.output_text;
  const pieces = [];
  for (const item of Array.isArray(value.output) ? value.output : []) {
    for (const part of Array.isArray(item.content) ? item.content : []) {
      if (part && part.type === "output_text" && typeof part.text === "string") pieces.push(part.text);
    }
  }
  return pieces.join("\n");
}

function timeout(env) {
  const value = Number.parseInt(env.AI_GYM_TIMEOUT_MS || "180000", 10);
  return Number.isFinite(value) && value >= 1000 ? value : 180000;
}

export function createAdapter(participant, env = process.env) {
  const timeoutMs = timeout(env);
  if (participant.provider === "ollama") {
    const base = participant.baseUrl || env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
    return {
      async generate(input) {
        const headers = env.OLLAMA_API_KEY ? { authorization: "Bearer " + env.OLLAMA_API_KEY } : {};
        const value = await postJson(
          ollamaEndpoint(base),
          "ollama",
          {
            model: participant.model,
            messages: [
              { role: "system", content: input.system },
              { role: "user", content: input.prompt }
            ],
            stream: false,
            format: input.schema
          },
          headers,
          timeoutMs
        );
        const result = value.message && value.message.content;
        if (typeof result !== "string" || !result.trim()) throw new Error("Ollama returned no assistant content.");
        return result;
      }
    };
  }

  if (participant.provider === "openai") {
    if (!env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required for the openai provider.");
    const base = participant.baseUrl || env.OPENAI_BASE_URL || "https://api.openai.com/v1";
    return {
      async generate(input) {
        const value = await postJson(
          endpoint(base, "/responses"),
          "openai",
          {
            model: participant.model,
            instructions: input.system,
            input: input.prompt,
            store: false
          },
          { authorization: "Bearer " + env.OPENAI_API_KEY },
          timeoutMs
        );
        const result = outputText(value);
        if (!result.trim()) throw new Error("OpenAI returned no output text.");
        return result;
      }
    };
  }

  if (participant.provider === "openai-compatible") {
    const base = participant.baseUrl || env.AI_GYM_COMPAT_BASE_URL;
    if (!base) throw new Error("AI_GYM_COMPAT_BASE_URL is required for the compatible provider.");
    return {
      async generate(input) {
        const headers = env.AI_GYM_COMPAT_API_KEY ? { authorization: "Bearer " + env.AI_GYM_COMPAT_API_KEY } : {};
        const value = await postJson(
          endpoint(base, "/chat/completions"),
          "openai-compatible",
          {
            model: participant.model,
            messages: [
              { role: "system", content: input.system },
              { role: "user", content: input.prompt }
            ],
            stream: false
          },
          headers,
          timeoutMs
        );
        const result = value.choices && value.choices[0] && value.choices[0].message
          ? value.choices[0].message.content
          : "";
        if (typeof result !== "string" || !result.trim()) {
          throw new Error("The compatible endpoint returned no assistant content.");
        }
        return result;
      }
    };
  }
  throw new Error("Unknown provider: " + participant.provider);
}

export function providerStatus(env = process.env) {
  return [
    {
      id: "ollama",
      title: "Ollama",
      transport: "Ollama chat API",
      configured: true,
      note: "Requires a running service and installed model."
    },
    {
      id: "openai",
      title: "OpenAI",
      transport: "Responses API",
      configured: Boolean(env.OPENAI_API_KEY),
      note: "Requires OPENAI_API_KEY."
    },
    {
      id: "openai-compatible",
      title: "OpenAI-compatible",
      transport: "Chat Completions API",
      configured: Boolean(env.AI_GYM_COMPAT_BASE_URL),
      note: "Requires AI_GYM_COMPAT_BASE_URL; key is optional."
    }
  ];
}

