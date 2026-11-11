import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserById } from "@/lib/store";

export async function GET() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = getUserById(id);
  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({
    progress: user.progress,
    favorites: user.favorites,
    plan: user.plan,
    name: user.name,
  });
}
