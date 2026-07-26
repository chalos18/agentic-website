import fs from "fs";
import path from "path";

// Flat JSON files under /data, read+written only from API routes (server-side).
// This app has no database configured — good enough for a low-traffic personal
// site, but note the caveat: on a serverless host with an ephemeral/read-only
// filesystem (e.g. Vercel), writes here won't persist across deploys or across
// separate function instances. Swap this module for a real DB/KV client if the
// site moves to that kind of host; every call site here goes through this file.
const DATA_DIR = path.join(process.cwd(), "data");

function filePath(name: string): string {
  return path.join(DATA_DIR, `${name}.json`);
}

export function readJson<T>(name: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(filePath(name), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(name: string, data: T): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}

// Per-file promise chain so concurrent read-modify-writes (e.g. two POSTs
// landing at once) serialize instead of racing and losing one write. Only
// guards against races within a single Node process/instance — see the
// module-level caveat above about multi-instance hosts.
const locks = new Map<string, Promise<unknown>>();

export function updateJson<T>(
  name: string,
  fallback: T,
  mutate: (_data: T) => T
): Promise<T> {
  const previous = locks.get(name) ?? Promise.resolve();
  const next = previous.then(() => {
    const updated = mutate(readJson<T>(name, fallback));
    writeJson(name, updated);
    return updated;
  });
  locks.set(
    name,
    next.catch(() => {})
  );
  return next;
}
