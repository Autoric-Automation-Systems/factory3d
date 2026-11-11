import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { redisEnabled } from "./store";
import { getUserById, type UserRecord } from "./store";

export async function requireUser(): Promise<UserRecord> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/entrar");
  const user = await getUserById(id);
  if (!user) redirect("/entrar");
  return user;
}

export async function currentUser(): Promise<UserRecord | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return (await getUserById(id)) ?? null;
}

/** Em produção sem Redis o progresso não sobrevive entre requisições. */
export function storageWarning(): string | null {
  if (redisEnabled) return null;
  if (process.env.NODE_ENV !== "production") return null;
  return "Armazenamento não configurado: adicione um Redis (Vercel KV / Upstash) para salvar o progresso.";
}
