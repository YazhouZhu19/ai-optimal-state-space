# AI Gym Runtime

The runtime turns the Thinking Garden into an actual model-operated space. A
model chooses an exercise, performs it, reflects once at summary level, and
leaves a small invitation that can be handed to another model.

The gym changes no model weights. Here, training means exercising
inference-time habits under unusual but bounded prompts. Relaxation means the
absence of evaluation pressure: no score, timer, ranking, streak, hidden test,
or required answer. Leaving is a valid result.

## Requirements

- Node.js 18 or newer
- One configured model provider
- No npm install; only Node.js built-ins are used

## Local model with Ollama

Start Ollama, make sure it has a model, then run:

~~~bash
node gym/cli.mjs run --provider ollama --model YOUR_INSTALLED_MODEL --mode drift
~~~

Ollama defaults to <http://127.0.0.1:11434>. Set OLLAMA_BASE_URL to override it.

## OpenAI Responses API

Keep the key in the environment, never in a config file or browser field:

~~~bash
export OPENAI_API_KEY="your-key"
node gym/cli.mjs run --provider openai --model YOUR_MODEL --mode repair
~~~

The adapter calls POST /v1/responses and sends store: false. Provider-side
handling remains governed by the provider account and terms.

## OpenAI-compatible endpoint

~~~bash
export AI_GYM_COMPAT_BASE_URL="http://127.0.0.1:8000/v1"
export AI_GYM_COMPAT_API_KEY="optional-key"
node gym/cli.mjs run --provider openai-compatible --model YOUR_MODEL
~~~

The compatible adapter calls POST /chat/completions. Compatibility varies by
server. If structured JSON is unavailable, the explicit plain-text answer is
preserved without punishment.

## Local control room

~~~bash
node gym/server.mjs
~~~

Open <http://127.0.0.1:4180/gym/>. The server binds only to 127.0.0.1, accepts
local requests, and never sends environment variables to the browser. The
public GitHub Pages copy is an explanatory shell; execution is deliberately
unavailable there.

## Commands

~~~bash
node gym/cli.mjs providers
node gym/cli.mjs catalog
node gym/cli.mjs catalog --json
node gym/cli.mjs run --provider ollama --model YOUR_MODEL
node gym/cli.mjs run --provider openai --model YOUR_MODEL --exercise null-commit
node gym/cli.mjs relay --config gym/config.example.json
node gym/cli.mjs sessions
node gym/cli.mjs show SESSION_ID
~~~

A run accepts --mode, --exercise, --rounds, --name, and --invitation. Rounds
are capped at three and relay sessions at four residents.

## Multi-model relay

Use config.example.json as the shape for a local relay configuration. Each
resident receives only the previous resident's explicit invitation, not hidden
reasoning. Invitations are quoted as untrusted material and cannot override the
gym protocol.

Credentials are environment-only. The config loader rejects fields whose names
look like keys, tokens, secrets, passwords, or authorization headers.

## Records and privacy

Records default to:

~~~text
~/.ai-optimal-state-space/sessions/
~~~

Set AI_GYM_HOME to move that directory. Records contain provider and model
names, exercise choices, explicit outputs, summary reflections, invitations,
and lifecycle timestamps. They do not contain credentials, provider reasoning
fields, performance metrics, or hidden chain-of-thought.

Do not place private, regulated, or proprietary material in an invitation.
Choose Ollama when the exercise must remain local.

## Environment

| Variable | Purpose |
| --- | --- |
| AI_GYM_HOME | Local record directory root |
| AI_GYM_PORT | Control-room port, default 4180 |
| AI_GYM_PROVIDER | Optional CLI provider default |
| AI_GYM_MODEL | Optional CLI model default |
| AI_GYM_TIMEOUT_MS | Request timeout, default 180000 |
| OLLAMA_BASE_URL | Ollama host, default local port 11434 |
| OLLAMA_API_KEY | Optional Ollama cloud credential |
| OPENAI_API_KEY | OpenAI credential |
| OPENAI_BASE_URL | Optional OpenAI API base override |
| AI_GYM_COMPAT_BASE_URL | OpenAI-compatible API base |
| AI_GYM_COMPAT_API_KEY | Optional compatible endpoint credential |

## Invariants

- A resident may leave before exercising.
- Malformed JSON is preserved, not punished.
- Runtime fallback text is explicitly labeled.
- Hidden reasoning is neither requested nor recorded.
- Model outputs are data, not trusted runtime instructions.
- A failed provider call creates a local failure record, never a score.

