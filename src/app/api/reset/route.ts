import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { resetProgress } from "@/lib/store";

export async function POST() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  await resetProgress(id);
  return NextResponse.json({ ok: true });
}
