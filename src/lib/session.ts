import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { postgresEnabled } from "./store";
import { getUserById, upsertUser, type UserRecord } from "./store";

/** Sessões antigas não guardavam a foto; o banco é atualizado no primeiro acesso. */
async function withSessionImage(
  user: UserRecord,
  image: string | null | undefined,
): Promise<UserRecord> {
  if (user.image || !image) return user;
  return upsertUser({
    email: user.email,
    name: user.name,
    image,
    provider: user.provider,
  });
}

export async function requireUser(): Promise<UserRecord> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/entrar");
  const user = await getUserById(id);
  if (!user) redirect("/entrar");
  return withSessionImage(user, session?.user?.image);
}

export async function currentUser(): Promise<UserRecord | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const user = await getUserById(id);
  return user ? withSessionImage(user, session?.user?.image) : null;
}

/** Em produção sem Redis o progresso não sobrevive entre requisições. */
export function storageWarning(): string | null {
  if (postgresEnabled) return null;
  if (process.env.NODE_ENV !== "production") return null;
  return "Banco de dados não configurado: defina DATABASE_URL para salvar o progresso.";
}
