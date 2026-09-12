import { readFile } from "node:fs/promises";
import path from "node:path";

const forbidden = ["apikey", "api_key", "secret", "token", "authorization", "password"];

function rejectCredentials(value, trail = "config") {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    const normalized = key.toLowerCase();
    if (forbidden.some((part) => normalized.includes(part))) {
      throw new Error("Credential-like field " + trail + "." + key + " is forbidden. Use an environment variable.");
    }
    rejectCredentials(child, trail + "." + key);
  }
}

export async function loadRunConfig(file) {
  if (!file) throw new Error("relay requires --config PATH.");
  const config = JSON.parse(await readFile(path.resolve(process.cwd(), file), "utf8"));
  rejectCredentials(config);
  return config;
}

