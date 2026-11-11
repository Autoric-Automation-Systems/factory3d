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

type Database = { users: UserRecord[] };

const DATA_DIR = process.env.DATA_DIR || ".data";
const DB_PATH = path.join(process.cwd(), DATA_DIR, "db.json");

const globalStore = globalThis as unknown as { __factory3dDb?: Database };

function emptyProgress(): StationProgress {
  return { visited: false, seenBlocks: [], quizPassed: false, bestScore: 0, visitedAt: null };
}

function load(): Database {
  if (globalStore.__factory3dDb) return globalStore.__factory3dDb;
  let db: Database = { users: [] };
  try {
    if (existsSync(DB_PATH)) {
      const parsed = JSON.parse(readFileSync(DB_PATH, "utf8")) as Database;
      if (Array.isArray(parsed.users)) db = parsed;
    }
  } catch {
    db = { users: [] };
  }
  globalStore.__factory3dDb = db;
  return db;
}

function persist(db: Database) {
  const dir = path.dirname(DB_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const tmp = `${DB_PATH}.${randomUUID()}.tmp`;
  writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  renameSync(tmp, DB_PATH);
}

function mutate<T>(fn: (db: Database) => T): T {
  const db = load();
  const result = fn(db);
  persist(db);
  return result;
}

export function getUserById(id: string): UserRecord | undefined {
  return load().users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): UserRecord | undefined {
  const normalized = email.trim().toLowerCase();
  return load().users.find((u) => u.email === normalized);
}

export function upsertUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
  provider: string;
}): UserRecord {
  const email = input.email.trim().toLowerCase();
  return mutate((db) => {
    const existing = db.users.find((u) => u.email === email);
    if (existing) {
      if (input.name) existing.name = input.name;
      if (input.image) existing.image = input.image;
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
    db.users.push(user);
    return user;
  });
}

export function getProgressFor(userId: string, stationId: string): StationProgress {
  return getUserById(userId)?.progress[stationId] ?? emptyProgress();
}

export function markVisited(userId: string, stationId: string): StationProgress {
  return mutate((db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error("Usuário não encontrado");
    const current = user.progress[stationId] ?? emptyProgress();
    if (!current.visited) {
      current.visited = true;
      current.visitedAt = new Date().toISOString();
    }
    user.progress[stationId] = current;
    return current;
  });
}

export function markBlocksSeen(
  userId: string,
  stationId: string,
  blockIds: string[],
): StationProgress {
  return mutate((db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error("Usuário não encontrado");
    const current = user.progress[stationId] ?? emptyProgress();
    current.visited = true;
    current.visitedAt = current.visitedAt ?? new Date().toISOString();
    const merged = new Set([...current.seenBlocks, ...blockIds]);
    current.seenBlocks = [...merged];
    user.progress[stationId] = current;
    return current;
  });
}

export function saveQuizScore(
  userId: string,
  stationId: string,
  score: number,
): StationProgress {
  return mutate((db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error("Usuário não encontrado");
    const current = user.progress[stationId] ?? emptyProgress();
    current.visited = true;
    current.visitedAt = current.visitedAt ?? new Date().toISOString();
    current.bestScore = Math.max(current.bestScore, Math.round(score));
    if (current.bestScore >= 70) current.quizPassed = true;
    user.progress[stationId] = current;
    return current;
  });
}

export function toggleFavorite(userId: string, stationId: string): string[] {
  return mutate((db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error("Usuário não encontrado");
    const has = user.favorites.includes(stationId);
    user.favorites = has
      ? user.favorites.filter((id) => id !== stationId)
      : [...user.favorites, stationId];
    return user.favorites;
  });
}

export function resetProgress(userId: string): void {
  mutate((db) => {
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new Error("Usuário não encontrado");
    user.progress = {};
    user.favorites = [];
  });
}

export function setPlan(userId: string, plan: Plan): void {
  mutate((db) => {
    const user = db.users.find((u) => u.id === userId);
    if (user) user.plan = plan;
  });
}
