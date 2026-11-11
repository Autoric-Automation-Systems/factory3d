import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserById, type UserRecord } from "./store";

export async function requireUser(): Promise<UserRecord> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/entrar");
  const user = getUserById(id);
  if (!user) redirect("/entrar");
  return user;
}

export async function currentUser(): Promise<UserRecord | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  return getUserById(id) ?? null;
}
