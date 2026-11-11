import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserById, markBlocksSeen, markVisited, saveQuizScore } from "@/lib/store";

type Body = {
  stationId?: string;
  action?: "visit" | "blocks" | "quiz";
  blockIds?: string[];
  score?: number;
};

export async function POST(request: Request) {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { stationId, action } = body;
  if (!stationId || !action) {
    return NextResponse.json({ error: "stationId e action são obrigatórios" }, { status: 400 });
  }

  if (action === "visit") await markVisited(id, stationId);
  else if (action === "blocks") await markBlocksSeen(id, stationId, body.blockIds ?? []);
  else if (action === "quiz") await saveQuizScore(id, stationId, Number(body.score ?? 0));
  else return NextResponse.json({ error: "action inválida" }, { status: 400 });

  const user = await getUserById(id);
  return NextResponse.json({
    progress: user?.progress ?? {},
    favorites: user?.favorites ?? [],
  });
}
