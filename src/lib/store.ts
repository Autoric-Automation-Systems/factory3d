import { randomUUID } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Pool } from "pg";

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

export function emptyProgress(): StationProgress {
  return { visited: false, seenBlocks: [], quizPassed: false, bestScore: 0, visitedAt: null };
}

/* -------------------------------------------------------------------------- */
/* Postgres (Neon) — backend de produção                                     */
/* -------------------------------------------------------------------------- */

const CONNECTION_STRING = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
export const postgresEnabled = Boolean(CONNECTION_STRING);

type PoolGlobal = { __f3dPool?: Pool; __f3dSchema?: Promise<void> };
const poolGlobal = globalThis as unknown as PoolGlobal;

function pool(): Pool {
  if (!poolGlobal.__f3dPool) {
    const isLocal = /localhost|127\.0\.0\.1/.test(CONNECTION_STRING);
    poolGlobal.__f3dPool = new Pool({
      connectionString: CONNECTION_STRING,
      max: 3,
      idleTimeoutMillis: 10_000,
      ssl: isLocal ? undefined : { rejectUnauthorized: false },
    });
  }
  return poolGlobal.__f3dPool;
}

const SCHEMA = `
create table if not exists f3d_users (
  id text primary key,
  email text not null unique,
  name text not null,
  image text,
  provider text not null,
  plan text not null default 'free',
  created_at timestamptz not null default now(),
  favorites jsonb not null default '[]'::jsonb,
  progress jsonb not null default '{}'::jsonb
);

create table if not exists f3d_orgs (
  id text primary key,
  name text not null,
  seats integer not null,
  plan text not null default 'escola',
  created_at timestamptz not null default now(),
  members jsonb not null default '[]'::jsonb
);
`;

export function ensureSchema(): Promise<void> {
  if (!poolGlobal.__f3dSchema) {
    poolGlobal.__f3dSchema = pool()
      .query(SCHEMA)
      .then(() => undefined)
      .catch((error) => {
        poolGlobal.__f3dSchema = undefined;
        throw error;
      });
  }
  return poolGlobal.__f3dSchema;
}

type UserRow = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  provider: string;
  plan: string;
  created_at: Date;
  favorites: string[];
  progress: Record<string, StationProgress>;
};

type OrgRow = {
  id: string;
  name: string;
  seats: number;
  plan: string;
  created_at: Date;
  members: string[];
};

function toUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    image: row.image,
    provider: row.provider,
    plan: row.plan === "pro" ? "pro" : "free",
    createdAt: row.created_at.toISOString(),
    favorites: row.favorites ?? [],
    progress: row.progress ?? {},
  };
}

function toOrg(row: OrgRow): OrgRecord {
  return {
    id: row.id,
    name: row.name,
    seats: row.seats,
    plan: "escola",
    createdAt: row.created_at.toISOString(),
    members: row.members ?? [],
  };
}

const SQL = {
  userById: "select * from f3d_users where id = $1",
  userByEmail: "select * from f3d_users where email = $1",
  upsertUser: `
    insert into f3d_users (id, email, name, image, provider, plan, created_at, favorites, progress)
    values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb)
    on conflict (id) do update set
      email = excluded.email,
      name = excluded.name,
      image = excluded.image,
      provider = excluded.provider,
      plan = excluded.plan,
      favorites = excluded.favorites,
      progress = excluded.progress
  `,
  orgById: "select * from f3d_orgs where id = $1",
  upsertOrg: `
    insert into f3d_orgs (id, name, seats, plan, created_at, members)
    values ($1, $2, $3, $4, $5, $6::jsonb)
    on conflict (id) do update set
      name = excluded.name,
      seats = excluded.seats,
      plan = excluded.plan,
      members = excluded.members
  `,
};

const postgresBackend: Backend = {
  async readUser(id) {
    await ensureSchema();
    const { rows } = await pool().query<UserRow>(SQL.userById, [id]);
    return rows[0] ? toUser(rows[0]) : undefined;
  },
  async readUserByEmail(email) {
    await ensureSchema();
    const { rows } = await pool().query<UserRow>(SQL.userByEmail, [email]);
    return rows[0] ? toUser(rows[0]) : undefined;
  },
  async writeUser(user) {
    await ensureSchema();
    await pool().query(SQL.upsertUser, [
      user.id,
      user.email,
      user.name,
      user.image,
      user.provider,
      user.plan,
      user.createdAt,
      JSON.stringify(user.favorites),
      JSON.stringify(user.progress),
    ]);
  },
  async readOrg(id) {
    await ensureSchema();
    const { rows } = await pool().query<OrgRow>(SQL.orgById, [id]);
    return rows[0] ? toOrg(rows[0]) : undefined;
  },
  async writeOrg(org) {
    await ensureSchema();
    await pool().query(SQL.upsertOrg, [
      org.id,
      org.name,
      org.seats,
      org.plan,
      org.createdAt,
      JSON.stringify(org.members),
    ]);
  },
};

/* -------------------------------------------------------------------------- */
/* Arquivo JSON — usado em desenvolvimento local                             */
/* -------------------------------------------------------------------------- */

const DATA_DIR = process.env.DATA_DIR || ".data";
const DB_PATH = path.join(process.cwd(), DATA_DIR, "db.json");

type FileDb = { users: UserRecord[]; orgs: OrgRecord[] };

const fileGlobal = globalThis as unknown as { __f3dFileDb?: FileDb };

function loadFile(): FileDb {
  if (fileGlobal.__f3dFileDb) return fileGlobal.__f3dFileDb;
  let db: FileDb = { users: [], orgs: [] };
  try {
    if (existsSync(DB_PATH)) {
      const parsed = JSON.parse(readFileSync(DB_PATH, "utf8")) as Partial<FileDb>;
      db = { users: parsed.users ?? [], orgs: parsed.orgs ?? [] };
    }
  } catch {
    db = { users: [], orgs: [] };
  }
  fileGlobal.__f3dFileDb = db;
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
    // Serverless tem sistema de arquivos somente leitura: sem Postgres o
    // progresso não persiste entre requisições, mas o app continua respondendo.
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

/* -------------------------------------------------------------------------- */
/* API usada pelo app                                                        */
/* -------------------------------------------------------------------------- */

type Backend = {
  readUser(id: string): Promise<UserRecord | undefined>;
  readUserByEmail(email: string): Promise<UserRecord | undefined>;
  writeUser(user: UserRecord): Promise<void>;
  readOrg(id: string): Promise<OrgRecord | undefined>;
  writeOrg(org: OrgRecord): Promise<void>;
};

export const backendName: "postgres" | "file" = postgresEnabled ? "postgres" : "file";

const backend: Backend = postgresEnabled ? postgresBackend : fileBackend;

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
