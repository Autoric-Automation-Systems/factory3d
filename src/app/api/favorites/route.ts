import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toggleFavorite } from "@/lib/store";

export async function POST(request: Request) {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { stationId?: string };
  if (!body.stationId) {
    return NextResponse.json({ error: "stationId é obrigatório" }, { status: 400 });
  }
  const favorites = await toggleFavorite(id, body.stationId);
  return NextResponse.json({ favorites });
}
