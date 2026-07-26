import { NextRequest, NextResponse } from "next/server";
import { readJson, updateJson } from "@/lib/jsonStore";
import type { RecipeRequest } from "@/lib/recipeRequests";
import {
  sanitizeDisplayName,
  stampSubmission,
} from "@/lib/anonymousSubmission";

const STORE = "recipe-requests";

export async function GET() {
  const requests = readJson<RecipeRequest[]>(STORE, []).filter(
    (r) => r.status !== "dismissed"
  );
  requests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return NextResponse.json({ requests });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { recipeName, note, submitterName } = body ?? {};

  if (typeof recipeName !== "string" || !recipeName.trim()) {
    return NextResponse.json(
      { error: "Recipe name is required" },
      { status: 400 }
    );
  }

  const entry: RecipeRequest = {
    ...stampSubmission(),
    recipeName: recipeName.trim().slice(0, 120),
    note: typeof note === "string" ? note.trim().slice(0, 500) : "",
    submitterName: sanitizeDisplayName(submitterName),
    status: "open",
  };

  await updateJson<RecipeRequest[]>(STORE, [], (requests: any) => [
    ...requests,
    entry,
  ]);

  return NextResponse.json({ request: entry }, { status: 201 });
}
