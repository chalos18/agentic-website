import { NextRequest, NextResponse } from "next/server";
import { updateJson } from "@/lib/jsonStore";
import { RECIPE_ADMIN_KEY, type RecipeRequest } from "@/lib/recipeRequests";

const STORE = "recipe-requests";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status, adminKey } = body ?? {};

  if (adminKey !== RECIPE_ADMIN_KEY) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }
  if (status !== "quoted" && status !== "dismissed" && status !== "open") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  let entry: RecipeRequest | undefined;
  await updateJson<RecipeRequest[]>(STORE, [], (current: any[]) => {
    const found = current.find((r: { id: string }) => r.id === id);
    if (!found) return current;
    entry = { ...found, status };
    return current.map((r: { id: string }) => (r.id === id ? entry! : r));
  });

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ request: entry });
}
