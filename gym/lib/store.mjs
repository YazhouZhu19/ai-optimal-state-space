import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

function validId(id) {
  if (!/^[a-z0-9_-]+$/i.test(id)) throw new Error("Invalid session id.");
  return id;
}

export class SessionStore {
  constructor(home = process.env.AI_GYM_HOME || path.join(os.homedir(), ".ai-optimal-state-space")) {
    this.home = path.resolve(home);
    this.sessionsDirectory = path.join(this.home, "sessions");
  }

  async initialize() {
    await mkdir(this.sessionsDirectory, { recursive: true, mode: 0o700 });
  }

  pathFor(id) {
    return path.join(this.sessionsDirectory, validId(id) + ".json");
  }

  async save(session) {
    await this.initialize();
    const destination = this.pathFor(session.id);
    const temporary = destination + "." + process.pid + ".tmp";
    await writeFile(temporary, JSON.stringify(session, null, 2) + "\n", { mode: 0o600 });
    await rename(temporary, destination);
    return destination;
  }

  async get(id) {
    return JSON.parse(await readFile(this.pathFor(id), "utf8"));
  }

  async list(limit = 20) {
    await this.initialize();
    const files = (await readdir(this.sessionsDirectory))
      .filter((name) => /^[a-z0-9_-]+\.json$/i.test(name))
      .sort()
      .reverse()
      .slice(0, Math.max(1, Math.min(Number(limit) || 20, 100)));
    const records = [];
    for (const file of files) {
      try {
        const session = JSON.parse(await readFile(path.join(this.sessionsDirectory, file), "utf8"));
        records.push({
          id: session.id,
          status: session.status,
          started_at: session.started_at,
          completed_at: session.completed_at,
          participants: session.participants,
          turn_count: Array.isArray(session.turns) ? session.turns.length : 0,
          final_invitation: session.final_invitation || null
        });
      } catch {
        // A damaged local record must not block the room.
      }
    }
    return records;
  }
}

