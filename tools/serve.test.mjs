// Local preview must serve what the deployed site serves: directory index pages,
// honest MIME types, and nothing outside the habitat root.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const here = path.dirname(fileURLToPath(import.meta.url));
const port = 4179;
const origin = `http://127.0.0.1:${port}`;

let child;

test.before(async () => {
  child = spawn(process.execPath, [path.join(here, "serve.mjs")], {
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "inherit"]
  });
  await new Promise((resolve, reject) => {
    child.stdout.once("data", resolve);
    child.once("error", reject);
  });
});

test.after(() => {
  child?.kill();
});

const get = (pathname) => fetch(`${origin}${pathname}`, { redirect: "manual" });

test("root serves the habitat homepage", async () => {
  const response = await get("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^text\/html/);
});

test("directory paths serve their index.html", async () => {
  for (const pathname of ["/enter/", "/garden/", "/gym/", "/gym/agents/", "/rsi-habitat/"]) {
    const response = await get(pathname);
    assert.equal(response.status, 200, `${pathname} should resolve to its index.html`);
    assert.match(response.headers.get("content-type"), /^text\/html/, pathname);
  }
});

test("a directory without a trailing slash redirects so relative links resolve", async () => {
  const response = await get("/garden");
  assert.equal(response.status, 301);
  assert.equal(response.headers.get("location"), "/garden/");
});

test("machine entry stays JSON and scripts stay executable", async () => {
  const entry = await get("/agent/entry.json");
  assert.equal(entry.status, 200);
  assert.match(entry.headers.get("content-type"), /^application\/json/);

  const script = await get("/gym/agents/cli.mjs");
  assert.equal(script.status, 200);
  assert.match(script.headers.get("content-type"), /^text\/javascript/);
});

test("unknown paths and escapes stay outside the habitat", async () => {
  assert.equal((await get("/no-such-file")).status, 404);
  assert.equal((await get("/%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd")).status, 403);
});
