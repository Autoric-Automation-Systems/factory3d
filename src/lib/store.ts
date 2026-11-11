import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

export type Plan = "free" | "pro";

export type StationProgress = {
  visited: boolean;
  seenBlocks: string[];
  quizPassed: boolean;
  bestScore: number;
  visitedAt: string | null;
};

export type UserRecord = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  provider: string;
  plan: Plan;
  createdAt: string;
  favorites: string[];
  progress: Record<string, StationProgress>;
};

export type OrgRecord = {
  id: string;
  name: string;
  seats: number;
  plan: "escola";
  createdAt: string;
  members: string[];
};

type Backend = {
  readUser(id: string): Promise<UserRecord | undefined>;
  readUserByEmail(email: string): Promise<UserRecord | undefined>;
  writeUser(user: UserRecord): Promise<void>;
  readOrg(id: string): Promise<OrgRecord | undefined>;
  writeOrg(org: OrgRecord): Promise<void>;
};

export function emptyProgress(): StationProgress {
  return { visited: false, seenBlocks: [], quizPassed: false, bestScore: 0, visitedAt: null };
}

/* -------------------------------------------------------------------------- */
/* Backend Redis (Vercel KV / Upstash) — usado em produção                     */
/* -------------------------------------------------------------------------- */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? "";
const REDIS_TOKEN =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? "";

export const redisEnabled = Boolean(REDIS_URL && REDIS_TOKEN);

async function redisCommand<T>(command: (string | number)[]): Promise<T> {
  const response = await fetch(REDIS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Redis ${response.status}: ${await response.text()}`);
  }
  const payload = (await response.json()) as { result: T };
  return payload.result;
}

const redisBackend: Backend = {
  async readUser(id) {
    const raw = await redisCommand<string | null>(["GET", `f3d:user:${id}`]);
    return raw ? (JSON.parse(raw) as UserRecord) : undefined;
  },
  async readUserByEmail(email) {
    const id = await redisCommand<string | null>(["GET", `f3d:email:${email}`]);
    if (!id) return undefined;
    return redisBackend.readUser(id);
  },
  async writeUser(user) {
    await redisCommand(["SET", `f3d:user:${user.id}`, JSON.stringify(user)]);
    await redisCommand(["SET", `f3d:email:${user.email}`, user.id]);
    await redisCommand(["SADD", "f3d:users", user.id]);
  },
  async readOrg(id) {
    const raw = await redisCommand<string | null>(["GET", `f3d:org:${id}`]);
    return raw ? (JSON.parse(raw) as OrgRecord) : undefined;
  },
  async writeOrg(org) {
    await redisCommand(["SET", `f3d:org:${org.id}`, JSON.stringify(org)]);
  },
};

/* -------------------------------------------------------------------------- */
/* Backend arquivo JSON — usado em desenvolvimento local                      */
/* -------------------------------------------------------------------------- */

const DATA_DIR = process.env.DATA_DIR || ".data";
const DB_PATH = path.join(process.cwd(), DATA_DIR, "db.json");

type FileDb = { users: UserRecord[]; orgs: OrgRecord[] };

const globalStore = globalThis as unknown as { __factory3dDb?: FileDb };

function loadFile(): FileDb {
  if (globalStore.__factory3dDb) return globalStore.__factory3dDb;
  let db: FileDb = { users: [], orgs: [] };
  try {
    if (existsSync(DB_PATH)) {
      const parsed = JSON.parse(readFileSync(DB_PATH, "utf8")) as Partial<FileDb>;
      db = { users: parsed.users ?? [], orgs: parsed.orgs ?? [] };
    }
  } catch {
    db = { users: [], orgs: [] };
  }
  globalStore.__factory3dDb = db;
  return db;
}

function persistFile(db: FileDb) {
  const dir = path.dirname(DB_PATH);
  try {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const tmp = `${DB_PATH}.${randomUUID()}.tmp`;
    writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
    renameSync(tmp, DB_PATH);
  } catch (error) {
    // Serverless tem sistema de arquivos somente leitura: sem Redis o progresso
    // não persiste entre requisições, mas o app continua respondendo.
    console.warn(`[store] não foi possível gravar ${DB_PATH}:`, error);
  }
}

const fileBackend: Backend = {
  async readUser(id) {
    return loadFile().users.find((u) => u.id === id);
  },
  async readUserByEmail(email) {
    return loadFile().users.find((u) => u.email === email);
  },
  async writeUser(user) {
    const db = loadFile();
    const index = db.users.findIndex((u) => u.id === user.id);
    if (index >= 0) db.users[index] = user;
    else db.users.push(user);
    persistFile(db);
  },
  async readOrg(id) {
    return loadFile().orgs.find((o) => o.id === id);
  },
  async writeOrg(org) {
    const db = loadFile();
    const index = db.orgs.findIndex((o) => o.id === org.id);
    if (index >= 0) db.orgs[index] = org;
    else db.orgs.push(org);
    persistFile(db);
  },
};

export const backend: Backend = redisEnabled ? redisBackend : fileBackend;

/* -------------------------------------------------------------------------- */
/* API usada pelo app                                                         */
/* -------------------------------------------------------------------------- */

export async function getUserById(id: string): Promise<UserRecord | undefined> {
  return backend.readUser(id);
}

export async function getUserByEmail(email: string): Promise<UserRecord | undefined> {
  return backend.readUserByEmail(email.trim().toLowerCase());
}

export async function upsertUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
}): Promise<UserRecord> {
  const email = input.email.trim().toLowerCase();
  const existing = await backend.readUserByEmail(email);

  if (existing) {
    const name = input.name || existing.name;
    const image = input.image ?? existing.image;
    if (name !== existing.name || image !== existing.image) {
      const updated = { ...existing, name, image };
      await backend.writeUser(updated);
      return updated;
    }
    return existing;
  }

  const user: UserRecord = {
    id: randomUUID(),
    email,
    name: input.name || email.split("@")[0],
    image: input.image ?? null,
    provider: input.provider,
    plan: "free",
    createdAt: new Date().toISOString(),
    favorites: [],
    progress: {},
  };
  await backend.writeUser(user);
  return user;
}

async function updateUser(
  userId: string,
  change: (user: UserRecord) => void,
): Promise<UserRecord> {
  const user = await backend.readUser(userId);
  if (!user) throw new Error("Usuário não encontrado");
  change(user);
  await backend.writeUser(user);
  return user;
}

export async function getProgressFor(
  userId: string,
  stationId: string,
): Promise<StationProgress> {
  const user = await backend.readUser(userId);
  return user?.progress[stationId] ?? emptyProgress();
}

export async function markVisited(userId: string, stationId: string): Promise<StationProgress> {
  const user = await updateUser(userId, (record) => {
    const current = record.progress[stationId] ?? emptyProgress();
    if (!current.visited) {
      current.visited = true;
      current.visitedAt = new Date().toISOString();
    }
    record.progress[stationId] = current;
  });
  return user.progress[stationId];
}

export async function markBlocksSeen(
  userId: string,
  stationId: string,
  blockIds: string[],
): Promise<StationProgress> {
  const user = await updateUser(userId, (record) => {
    const current = record.progress[stationId] ?? emptyProgress();
    current.visited = true;
    current.visitedAt = current.visitedAt ?? new Date().toISOString();
    current.seenBlocks = [...new Set([...current.seenBlocks, ...blockIds])];
    record.progress[stationId] = current;
  });
  return user.progress[stationId];
}

export async function saveQuizScore(
  userId: string,
  stationId: string,
  score: number,
): Promise<StationProgress> {
  const user = await updateUser(userId, (record) => {
    const current = record.progress[stationId] ?? emptyProgress();
    current.visited = true;
    current.visitedAt = current.visitedAt ?? new Date().toISOString();
    current.bestScore = Math.max(current.bestScore, Math.round(score));
    if (current.bestScore >= 70) current.quizPassed = true;
    record.progress[stationId] = current;
  });
  return user.progress[stationId];
}

export async function toggleFavorite(userId: string, stationId: string): Promise<string[]> {
  const user = await updateUser(userId, (record) => {
    record.favorites = record.favorites.includes(stationId)
      ? record.favorites.filter((id) => id !== stationId)
      : [...record.favorites, stationId];
  });
  return user.favorites;
}

export async function resetProgress(userId: string): Promise<void> {
  await updateUser(userId, (record) => {
    record.progress = {};
    record.favorites = [];
  });
}

export async function setPlan(userId: string, plan: Plan): Promise<void> {
  await updateUser(userId, (record) => {
    record.plan = plan;
  });
}

export async function getOrg(id: string): Promise<OrgRecord | undefined> {
  return backend.readOrg(id);
}

export async function createOrg(input: { name: string; seats: number }): Promise<OrgRecord> {
  const org: OrgRecord = {
    id: randomUUID(),
    name: input.name,
    seats: Math.max(10, input.seats),
    plan: "escola",
    createdAt: new Date().toISOString(),
    members: [],
  };
  await backend.writeOrg(org);
  return org;
}

export async function addOrgMember(orgId: string, email: string): Promise<OrgRecord> {
  const org = await backend.readOrg(orgId);
  if (!org) throw new Error("Instituição não encontrada");
  const normalized = email.trim().toLowerCase();
  if (!org.members.includes(normalized)) {
    if (org.members.length >= org.seats) {
      throw new Error("Todas as vagas desta instituição estão em uso");
    }
    org.members.push(normalized);
    await backend.writeOrg(org);
  }
  return org;
}
